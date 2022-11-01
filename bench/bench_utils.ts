import {
  PaymentPlugin,
  PaymentPluginResponse,
  Shop,
} from "../src/utils/types.ts";
import { MeiliSearch, postgres, Redis, Router } from "./bench_deps.ts";
import {
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  MEILIAPIKEY,
  MEILIHOST,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "./bench_secrets.ts";

export class TestCheckout implements PaymentPlugin {
  async pay(
    _items: { name: string; price: number; quantity: number }[],
    _orderId: string,
    _amount: number,
    _shop: Shop,
  ): Promise<PaymentPluginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return {
      type: "URL",
      value: "https://example.com",
    };
  }

  Routes(): Router<Record<string, unknown>> {
    const router = new Router();
    return router;
  }
}

export const pool = new postgres.Pool(
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

export const postgresClient = postgres.PoolClient;

export const searchClient = new MeiliSearch({
  host: MEILIHOST!,
  apiKey: MEILIAPIKEY,
});

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL!,
  token: UPSTASH_REDIS_REST_TOKEN!,
});
