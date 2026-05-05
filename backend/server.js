const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

loadLocalEnv();

const { all, get, initializeDatabase, run } = require("./db");

const app = express();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "cobrador-admin-token";
const PORT = Number(process.env.PORT || 3001);
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_INSTANCE_TOKEN = process.env.ZAPI_INSTANCE_TOKEN;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN;
let databaseReadyPromise;

app.use(cors());
app.use(express.json());
app.use(async (_req, res, next) => {
  try {
    await ensureDatabaseReady();
    next();
  } catch (error) {
    const detail = error?.message || "Erro desconhecido.";
    console.error("Erro ao preparar banco:", error);
    res.status(500).json({ error: "Erro ao preparar banco.", detail });
  }
});

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const envContent = fs.readFileSync(envPath, "utf8");

  for (const rawLine of envContent.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function clampDueDay(year, monthIndex, dueDay) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return Math.min(Math.max(Number(dueDay || 1), 1), lastDay);
}

function getDueDate(year, monthIndex, dueDay) {
  return new Date(year, monthIndex, clampDueDay(year, monthIndex, dueDay), 12);
}

function formatReference(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseAgenda(rawAgenda) {
  if (!rawAgenda) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawAgenda);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeCellphone(value) {
  const raw = String(value || "").trim();

  if (!raw.startsWith("+")) {
    return null;
  }

  const digits = raw.replace(/\D/g, "");

  if (!/^[1-9]\d{7,14}$/.test(digits)) {
    return null;
  }

  return `+${digits}`;
}

function getCurrentMonthDueDate(baseDate, dueDay) {
  return getDueDate(baseDate.getFullYear(), baseDate.getMonth(), dueDay);
}

function getUpcomingDueDate(baseDate, dueDay) {
  const dueThisMonth = getCurrentMonthDueDate(baseDate, dueDay);

  if (baseDate <= dueThisMonth) {
    return dueThisMonth;
  }

  const nextMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
  return getDueDate(nextMonth.getFullYear(), nextMonth.getMonth(), dueDay);
}

function getTargetPaymentReference(baseDate, dueDay, paidReference) {
  const currentMonthDueDate = getCurrentMonthDueDate(baseDate, dueDay);
  const currentMonthReference = formatReference(currentMonthDueDate);

  if (
    baseDate > currentMonthDueDate &&
    paidReference !== currentMonthReference
  ) {
    return currentMonthReference;
  }

  return formatReference(getUpcomingDueDate(baseDate, dueDay));
}

function getChargeTargetDueDate(baseDate, dueDay, paidReference) {
  const currentMonthDueDate = getCurrentMonthDueDate(baseDate, dueDay);
  const currentMonthReference = formatReference(currentMonthDueDate);

  if (
    startOfDay(baseDate) > startOfDay(currentMonthDueDate) &&
    paidReference !== currentMonthReference
  ) {
    return currentMonthDueDate;
  }

  return getUpcomingDueDate(baseDate, dueDay);
}

function createReminderMessage(student, type, dueDate) {
  const amount = Number(student.valor || 0).toFixed(2);
  const formattedDate = dueDate.toLocaleDateString("pt-BR");

  if (type === "vencimento") {
    return `Ola ${student.nome}! Sua mensalidade de R$ ${amount} vence hoje (${formattedDate}) e ainda consta em aberto. Se ja realizou o pagamento, desconsidere esta mensagem.`;
  }

  if (type === "manual") {
    return `Ola ${student.nome}! Este e um lembrete da sua mensalidade de R$ ${amount}. Qualquer duvida, estou a disposicao.`;
  }

  return `Ola ${student.nome}! Sua mensalidade de R$ ${amount} vence em 5 dias, no dia ${formattedDate}. Se precisar de algo, estou a disposicao.`;
}

function ensureZApiConfigured() {
  if (!ZAPI_INSTANCE_ID || !ZAPI_INSTANCE_TOKEN || !ZAPI_CLIENT_TOKEN) {
    throw new Error(
      "Z-API nao configurada. Defina ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN e ZAPI_CLIENT_TOKEN.",
    );
  }
}

function isWhatsappConfigured() {
  return Boolean(
    ZAPI_INSTANCE_ID && ZAPI_INSTANCE_TOKEN && ZAPI_CLIENT_TOKEN,
  );
}

async function sendWhatsappMessage(student, type, dueDate) {
  ensureZApiConfigured();
  const telefoneLimpo = String(student.telefone || "").replace(/\D/g, "");

  await axios.post(
    `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_TOKEN}/send-text`,
    {
      phone: telefoneLimpo,
      message: createReminderMessage(student, type, dueDate),
    },
    {
      headers: {
        "Client-Token": ZAPI_CLIENT_TOKEN,
        "Content-Type": "application/json",
      },
    },
  );
}

function normalizeStudent(row, now = new Date()) {
  const dueDateThisMonth = getCurrentMonthDueDate(now, row.dia_vencimento);
  const currentMonthReference = formatReference(dueDateThisMonth);
  const paidForCurrentMonth = row.ultima_referencia_paga === currentMonthReference;
  const overdue =
    !paidForCurrentMonth &&
    (Boolean(row.vencido) || startOfDay(now) > startOfDay(dueDateThisMonth));

  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    email: row.email,
    plano: row.plano,
    valor: Number(row.valor || 0),
    vencimento: String(row.dia_vencimento || ""),
    dia_vencimento: row.dia_vencimento,
    agenda: parseAgenda(row.agenda_json),
    pago: paidForCurrentMonth,
    vencido: overdue,
  };
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Nao autorizado." });
    return;
  }

  next();
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    whatsappProvider: isWhatsappConfigured() ? "z-api" : null,
    whatsappConfigured: isWhatsappConfigured(),
    whatsappInstance: isWhatsappConfigured() ? ZAPI_INSTANCE_ID : null,
  });
});

app.post("/auth/login", (req, res) => {
  const { password, username } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Credenciais invalidas." });
    return;
  }

  res.json({
    token: ADMIN_TOKEN,
    user: {
      login: ADMIN_USERNAME,
      name: "Administrador",
    },
  });
});

app.get("/alunos", requireAuth, async (_req, res) => {
  try {
    const rows = await all("SELECT * FROM alunos ORDER BY id DESC");
    res.json(rows.map((row) => normalizeStudent(row)));
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar alunos." });
  }
});

app.post("/alunos", requireAuth, async (req, res) => {
  const {
    agenda = [],
    dia_vencimento,
    email = "",
    nome,
    plano = "",
    telefone,
    valor = 0,
    vencido = false,
  } = req.body;

  if (!nome || !telefone || !dia_vencimento) {
    res.status(400).json({ error: "Dados obrigatorios ausentes." });
    return;
  }

  const normalizedCellphone = normalizeCellphone(telefone);

  if (!normalizedCellphone) {
    res
      .status(400)
      .json({ error: "Celular invalido. Use o codigo do pais no formato +55." });
    return;
  }

  try {
    const result = await run(
      `INSERT INTO alunos (
        nome,
        telefone,
        email,
        plano,
        valor,
        dia_vencimento,
        agenda_json,
        vencido
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        normalizedCellphone,
        email,
        plano,
        valor,
        dia_vencimento,
        JSON.stringify(agenda),
        vencido ? 1 : 0,
      ],
    );

    const created = await get("SELECT * FROM alunos WHERE id = ?", [
      result.lastID,
    ]);
    res.status(201).json(normalizeStudent(created));
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar aluno." });
  }
});

app.put("/alunos/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const {
    agenda = [],
    dia_vencimento,
    email = "",
    nome,
    plano = "",
    telefone,
    valor = 0,
    vencido = false,
  } = req.body;

  if (!nome || !telefone || !dia_vencimento) {
    res.status(400).json({ error: "Dados obrigatorios ausentes." });
    return;
  }

  const normalizedCellphone = normalizeCellphone(telefone);

  if (!normalizedCellphone) {
    res
      .status(400)
      .json({ error: "Celular invalido. Use o codigo do pais no formato +55." });
    return;
  }

  try {
    const existingStudent = await get("SELECT * FROM alunos WHERE id = ?", [id]);

    if (!existingStudent) {
      res.status(404).json({ error: "Aluno nao encontrado." });
      return;
    }

    await run(
      `UPDATE alunos
       SET nome = ?,
           telefone = ?,
           email = ?,
           plano = ?,
           valor = ?,
           dia_vencimento = ?,
           agenda_json = ?,
           vencido = ?
       WHERE id = ?`,
      [
        nome,
        normalizedCellphone,
        email,
        plano,
        valor,
        dia_vencimento,
        JSON.stringify(agenda),
        vencido ? 1 : 0,
        id,
      ],
    );

    const updated = await get("SELECT * FROM alunos WHERE id = ?", [id]);
    res.json(normalizeStudent(updated));
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar aluno." });
  }
});

app.patch("/alunos/:id/status", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { pago } = req.body;

  try {
    const student = await get("SELECT * FROM alunos WHERE id = ?", [id]);

    if (!student) {
      res.status(404).json({ error: "Aluno nao encontrado." });
      return;
    }

    const reference = pago
      ? getTargetPaymentReference(
          new Date(),
          student.dia_vencimento,
          student.ultima_referencia_paga,
        )
      : null;

    await run(
      `UPDATE alunos
       SET ultima_referencia_paga = ?, vencido = ?
       WHERE id = ?`,
      [reference, 0, id],
    );

    const updated = await get("SELECT * FROM alunos WHERE id = ?", [id]);
    res.json(normalizeStudent(updated));
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar status do aluno." });
  }
});

app.post("/alunos/:id/cobrar", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { tipo = "manual" } = req.body;

  if (!isWhatsappConfigured()) {
    res.status(503).json({ error: "WhatsApp desativado neste ambiente." });
    return;
  }

  try {
    const student = await get("SELECT * FROM alunos WHERE id = ?", [id]);

    if (!student) {
      res.status(404).json({ error: "Aluno nao encontrado." });
      return;
    }

    const dueDate = getChargeTargetDueDate(
      new Date(),
      student.dia_vencimento,
      student.ultima_referencia_paga,
    );
    await sendWhatsappMessage(student, tipo, dueDate);
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao cobrar manualmente:", error.response?.data || error);
    res.status(500).json({ error: "Erro ao enviar mensagem." });
  }
});

app.delete("/alunos/:id", requireAuth, async (req, res) => {
  try {
    await run("DELETE FROM alunos WHERE id = ?", [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir aluno." });
  }
});

async function processAutomaticReminders() {
  if (!isWhatsappConfigured()) {
    return;
  }

  const now = new Date();
  const today = startOfDay(now);
  const rows = await all("SELECT * FROM alunos");

  for (const student of rows) {
    const dueDate = getUpcomingDueDate(now, student.dia_vencimento);
    const dueReference = formatReference(dueDate);
    const daysUntilDue = Math.round(
      (startOfDay(dueDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const isPaid = student.ultima_referencia_paga === dueReference;

    if (isPaid) {
      continue;
    }

    if (
      daysUntilDue === 5 &&
      student.ultima_cobranca_previa_referencia !== dueReference
    ) {
      try {
        await sendWhatsappMessage(student, "previa", dueDate);
        await run(
          `UPDATE alunos
           SET ultima_cobranca_previa_referencia = ?, vencido = 0
           WHERE id = ?`,
          [dueReference, student.id],
        );
      } catch (error) {
        console.error(
          "Erro ao enviar cobranca previa:",
          error.response?.data || error,
        );
      }
    }

    if (
      dueReference === formatReference(today) &&
      student.ultima_cobranca_vencimento_referencia !== dueReference
    ) {
      try {
        await sendWhatsappMessage(student, "vencimento", dueDate);
        await run(
          `UPDATE alunos
           SET ultima_cobranca_vencimento_referencia = ?, vencido = 1
           WHERE id = ?`,
          [dueReference, student.id],
        );
      } catch (error) {
        console.error(
          "Erro ao enviar cobranca de vencimento:",
          error.response?.data || error,
        );
      }
    }
  }
}

function startAutomaticReminderLoop() {
  if (!isWhatsappConfigured()) {
    console.log("WhatsApp desativado. Rotina automatica de cobranca ignorada.");
    return;
  }

  processAutomaticReminders().catch((error) => {
    console.error("Falha na verificacao inicial:", error);
  });

  setInterval(() => {
    processAutomaticReminders().catch((error) => {
      console.error("Falha na verificacao automatica:", error);
    });
  }, 1000 * 60 * 60);
}

function configureFrontendHosting() {
  const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");

  if (!fs.existsSync(frontendBuildPath)) {
    return;
  }

  app.use(express.static(frontendBuildPath));

  app.get(/^(?!\/(health|auth|alunos)(\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

function ensureDatabaseReady() {
  if (!databaseReadyPromise) {
    databaseReadyPromise = initializeDatabase();
  }

  return databaseReadyPromise;
}

async function bootstrapApp() {
  await ensureDatabaseReady();
  startAutomaticReminderLoop();
  configureFrontendHosting();
}

async function startServer() {
  await bootstrapApp();
  app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
}

if (process.env.VERCEL !== "1") {
  startServer().catch((error) => {
    console.error("Erro ao iniciar servidor:", error);
  });
} else {
  bootstrapApp().catch((error) => {
    console.error("Erro ao preparar app na Vercel:", error);
  });
}

module.exports = app;
