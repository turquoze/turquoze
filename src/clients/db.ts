import { postgres } from "../deps.ts";
import {
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "../utils/secrets.ts";

const pool = new postgres.Pool(
  {
    hostname: DATABASE_HOSTNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE,
    user: DATABASE_USER,
    port: DATABASE_PORT,
    tls: {
      caCertificates: [
        DATABASE_CERT!,
      ],
      enabled: false,
    },
  },
  3,
);

export default pool;
export const postgresClient = postgres.PoolClient;
