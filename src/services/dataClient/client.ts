import { postgres } from "./_deps.ts";
import {
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "../../utils/secrets.ts";

const client = new postgres.Client({
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
});

export default client;
export const postgresClient = postgres.Client;
