const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
  throw new Error("DATABASE_URL nao configurada.");
}

const postgresPool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

function normalizeSql(sql) {
  let index = 0;

  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

async function query(sql, params = []) {
  const normalizedSql = normalizeSql(sql);
  return postgresPool.query(normalizedSql, params);
}

async function run(sql, params = []) {
  const trimmedSql = sql.trim();
  const isInsert = /^insert\s+/i.test(trimmedSql);
  const sqlWithReturning =
    isInsert && !/\breturning\b/i.test(trimmedSql)
      ? `${trimmedSql} RETURNING id`
      : trimmedSql;
  const result = await query(sqlWithReturning, params);

  return {
    changes: result.rowCount || 0,
    lastID: result.rows[0]?.id || null,
  };
}

async function get(sql, params = []) {
  const result = await query(sql, params);
  return result.rows[0];
}

async function all(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

async function ensureColumn(tableName, columnName, definition) {
  const column = await get(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ?
        AND column_name = ?`,
    [tableName, columnName],
  );

  if (!column) {
    await run(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
    );
  }
}

async function initializeDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT DEFAULT '',
      plano TEXT DEFAULT '',
      valor NUMERIC(10, 2) DEFAULT 0,
      primeira_cobranca TEXT,
      dia_vencimento INTEGER NOT NULL,
      agenda_json TEXT DEFAULT '[]',
      vencido INTEGER DEFAULT 0,
      ultima_referencia_paga TEXT,
      ultima_cobranca_previa_referencia TEXT,
      ultima_cobranca_vencimento_referencia TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureColumn("alunos", "agenda_json", "TEXT DEFAULT '[]'");
  await ensureColumn("alunos", "vencido", "INTEGER DEFAULT 0");
  await ensureColumn("alunos", "ultima_referencia_paga", "TEXT");
  await ensureColumn(
    "alunos",
    "ultima_cobranca_previa_referencia",
    "TEXT",
  );
  await ensureColumn(
    "alunos",
    "ultima_cobranca_vencimento_referencia",
    "TEXT",
  );
  await ensureColumn(
    "alunos",
    "created_at",
    "TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP",
  );
}

module.exports = {
  all,
  get,
  initializeDatabase,
  run,
};
