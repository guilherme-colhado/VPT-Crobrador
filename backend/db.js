const fs = require("fs");
const path = require("path");

let Pool;
let sqlite3;

const databaseUrl = process.env.DATABASE_URL || "";
const usePostgres = Boolean(databaseUrl);

if (usePostgres) {
  ({ Pool } = require("pg"));
} else {
  sqlite3 = require("sqlite3").verbose();
}

const bundledDatabasePath = path.join(__dirname, "database.db");
const databasePath = process.env.DATABASE_PATH || bundledDatabasePath;

if (
  !usePostgres &&
  databasePath !== bundledDatabasePath &&
  !fs.existsSync(databasePath)
) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  if (fs.existsSync(bundledDatabasePath)) {
    fs.copyFileSync(bundledDatabasePath, databasePath);
  }
}

const sqliteDb = usePostgres ? null : new sqlite3.Database(databasePath);
const postgresPool = usePostgres
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  : null;

function normalizeSql(sql, params) {
  if (!usePostgres) {
    return sql;
  }

  let index = 0;

  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

async function query(sql, params = []) {
  if (!usePostgres) {
    throw new Error("Postgres nao configurado.");
  }

  const normalizedSql = normalizeSql(sql, params);
  return postgresPool.query(normalizedSql, params);
}

function runSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ changes: this.changes, lastID: this.lastID });
    });
  });
}

async function runPostgres(sql, params = []) {
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

function run(sql, params = []) {
  return usePostgres ? runPostgres(sql, params) : runSqlite(sql, params);
}

function getSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

async function getPostgres(sql, params = []) {
  const result = await query(sql, params);
  return result.rows[0];
}

function get(sql, params = []) {
  return usePostgres ? getPostgres(sql, params) : getSqlite(sql, params);
}

function allSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function allPostgres(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

function all(sql, params = []) {
  return usePostgres ? allPostgres(sql, params) : allSqlite(sql, params);
}

async function ensureSqliteColumn(tableName, columnName, definition) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    await run(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
    );
  }
}

async function ensurePostgresColumn(tableName, columnName, definition) {
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

function ensureColumn(tableName, columnName, definition) {
  return usePostgres
    ? ensurePostgresColumn(tableName, columnName, definition)
    : ensureSqliteColumn(tableName, columnName, definition);
}

async function initializeSqliteDatabase() {
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

async function initializePostgresDatabase() {
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

function initializeDatabase() {
  return usePostgres
    ? initializePostgresDatabase()
    : initializeSqliteDatabase();
}

module.exports = {
  all,
  db: sqliteDb,
  get,
  initializeDatabase,
  run,
  usePostgres,
};
