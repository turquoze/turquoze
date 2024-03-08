import { drizzle, postgres } from "../deps.ts";
import { DATABASE_URL } from "../utils/secrets.ts";

const client = postgres(DATABASE_URL!);
export const migrationConnection = postgres(DATABASE_URL!, { max: 1 });
const db = drizzle(client);
export default db;
