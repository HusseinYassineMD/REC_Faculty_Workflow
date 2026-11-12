import "server-only";

import fs from "fs";
import path from "path";
import type { Client, InArgs, InValue, ResultSet } from "@libsql/client";
import type Sqlite from "better-sqlite3";
import { DB_PATH } from "./paths";

export type SqlValue = string | number | bigint | null;

export type SqlArgs = SqlValue[] | Record<string, SqlValue | undefined>;

export type SqlStatement = {
  sql: string;
  args?: SqlArgs;
};

export type SqlDb = {
  exec(sql: string): Promise<void>;
  all<T>(sql: string, args?: SqlArgs): Promise<T[]>;
  get<T>(sql: string, args?: SqlArgs): Promise<T | undefined>;
  run(sql: string, args?: SqlArgs): Promise<{ changes: number }>;
  batch(statements: SqlStatement[]): Promise<void>;
};

export type RemoteConfig = {
  url: string;
  authToken: string;
};

/** Turso when both variables are set. Local SQLite when both are empty. */
export function remoteDatabaseConfig(): RemoteConfig | null {
  const url = process.env.TURSO_DATABASE_URL?.trim() ?? "";
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() ?? "";
  if (!url && !authToken) return null;
  if (!url || !authToken) {
    throw new Error(
      "Set both TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, or leave both empty to keep the local SQLite file."
    );
  }
  return { url, authToken };
}

function normalizeRecord(args: Record<string, SqlValue | undefined>): Record<string, InValue> {
  const out: Record<string, InValue> = {};
  for (const [key, value] of Object.entries(args)) {
    out[key] = value === undefined ? null : value;
  }
  return out;
}

function toInArgs(args?: SqlArgs): InArgs | undefined {
  if (args === undefined) return undefined;
  if (Array.isArray(args)) return args.map((value) => (value === undefined ? null : value));
  return normalizeRecord(args);
}

function rowsOf<T>(result: ResultSet): T[] {
  return result.rows.map((row) => ({ ...row }) as T);
}

function localRun(stmt: Sqlite.Statement, args?: SqlArgs) {
  if (args === undefined) return stmt.run();
  if (Array.isArray(args)) return stmt.run(...args);
  return stmt.run(normalizeRecord(args));
}

function localGet(stmt: Sqlite.Statement, args?: SqlArgs) {
  if (args === undefined) return stmt.get();
  if (Array.isArray(args)) return stmt.get(...args);
  return stmt.get(normalizeRecord(args));
}

function localAll(stmt: Sqlite.Statement, args?: SqlArgs) {
  if (args === undefined) return stmt.all();
  if (Array.isArray(args)) return stmt.all(...args);
  return stmt.all(normalizeRecord(args));
}

function wrapLocal(database: Sqlite.Database): SqlDb {
  return {
    async exec(sql) {
      database.exec(sql);
    },
    async all<T>(sql: string, args?: SqlArgs) {
      return localAll(database.prepare(sql), args) as T[];
    },
    async get<T>(sql: string, args?: SqlArgs) {
      return localGet(database.prepare(sql), args) as T | undefined;
    },
    async run(sql, args) {
      return { changes: localRun(database.prepare(sql), args).changes };
    },
    async batch(statements) {
      if (statements.length === 0) return;
      const write = database.transaction(() => {
        for (const statement of statements) {
          localRun(database.prepare(statement.sql), statement.args);
        }
      });
      write();
    },
  };
}

function wrapRemote(client: Client): SqlDb {
  return {
    async exec(sql) {
      await client.executeMultiple(sql);
    },
    async all<T>(sql: string, args?: SqlArgs) {
      const result = await client.execute({ sql, args: toInArgs(args) });
      return rowsOf<T>(result);
    },
    async get<T>(sql: string, args?: SqlArgs) {
      const rows = await this.all<T>(sql, args);
      return rows[0];
    },
    async run(sql, args) {
      const result = await client.execute({ sql, args: toInArgs(args) });
      return { changes: result.rowsAffected };
    },
    async batch(statements) {
      if (statements.length === 0) return;
      await client.batch(
        statements.map((statement) => ({
          sql: statement.sql,
          args: toInArgs(statement.args),
        })),
        "write"
      );
    },
  };
}

export async function createSqlDb(remote: RemoteConfig | null): Promise<SqlDb> {
  if (remote) {
    const { createClient } = await import("@libsql/client");
    const client = createClient({
      url: remote.url,
      authToken: remote.authToken,
      intMode: "number",
    });
    return wrapRemote(client);
  }

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const { default: Database } = await import("better-sqlite3");
  const database = new Database(DB_PATH);
  database.pragma("journal_mode = WAL");
  return wrapLocal(database);
}
