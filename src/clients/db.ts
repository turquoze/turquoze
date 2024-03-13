import { drizzle, postgres, PostgresJsDatabase, Sql } from "../deps.ts";

export function getDBClients(databasUrl: string): {
  migrationConnection: Sql;
  db: PostgresJsDatabase<Record<string, never>>;
} {
  const client = postgres(databasUrl);
  const db = drizzle(client);

  const migrationConnection = postgres(databasUrl, { max: 1 });

  return {
    migrationConnection,
    db,
  };
}
