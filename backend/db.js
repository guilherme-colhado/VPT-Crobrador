const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const bundledDatabasePath = path.join(__dirname, "database.db");
const databasePath = process.env.DATABASE_PATH || bundledDatabasePath;

if (databasePath !== bundledDatabasePath && !fs.existsSync(databasePath)) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  if (fs.existsSync(bundledDatabasePath)) {
    fs.copyFileSync(bundledDatabasePath, databasePath);
  }
}

const db = new sqlite3.Database(databasePath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ changes: this.changes, lastID: this.lastID });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function ensureColumn(tableName, columnName, definition) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    await run(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
    );
  }
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT DEFAULT '',
      plano TEXT DEFAULT '',
      valor REAL DEFAULT 0,
      primeira_cobranca TEXT,
      dia_vencimento INTEGER NOT NULL,
      agenda_json TEXT DEFAULT '[]',
      vencido INTEGER DEFAULT 0,
      ultima_referencia_paga TEXT,
      ultima_cobranca_previa_referencia TEXT,
      ultima_cobranca_vencimento_referencia TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
  await ensureColumn("alunos", "created_at", "TEXT DEFAULT CURRENT_TIMESTAMP");
}

module.exports = {
  all,
  db,
  get,
  initializeDatabase,
  run,
};
