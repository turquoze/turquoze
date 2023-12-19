import { Hono } from "hono";
import dbClient, { migrationConnection } from "./clients/db.ts";
import redisClient from "./clients/redis.ts";
import Cors from "./middleware/cors.ts";
import Logger from "./middleware/logger.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import Container from "./services/mod.ts";
import addEvents from "./utils/events.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import utils from "./routes/utils/utils.ts";
import NotFound from "./pages/404.ts";
import { ErrorHandler } from "./utils/errors.ts";
import { RUN_DB_MIGRATION } from "./utils/secrets.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

export const container = new Container(dbClient, redisClient);

addEvents(container);

class App {
  #container: Container;
  #app: Hono;
  constructor(container: Container) {
    this.#container = container;
    this.#app = new Hono({ strict: false });
  }

  container() {
    return this.#container;
  }

  async migrate() {
    if (
      RUN_DB_MIGRATION != undefined && RUN_DB_MIGRATION.toLowerCase() == "true"
    ) {
      await migrate(drizzle(migrationConnection), {
        migrationsFolder: "drizzle",
      });
      await migrationConnection.end();
    }
  }

  router() {
    return this.#app;
  }
}

const app = new App(container);

await app.migrate();

app.router().use("*", Cors());
app.router().use("*", Logger());
app.router().use("*", ResponseTimer());
app.router().route("/admin", admin(container));
app.router().route("/api", api(container));
app.router().route("/utils", utils(container));

app.router().notFound((ctx) => {
  const acceptHeader = ctx.req.header("Accept");
  const hit = acceptHeader?.includes("text/html");

  if (hit) {
    const html = NotFound;

    ctx.res.headers.set("content-type", "text/html");
    return ctx.html(html, 404);
  } else {
    ctx.res.headers.set("content-type", "application/json");

    return ctx.json({
      msg: "Not Found",
      error: "NOT_FOUND",
    }, 404);
  }
});

app.router().onError((error, ctx) => {
  const data = ErrorHandler(error);
  ctx.res.headers.set("content-type", "application/json");
  return ctx.json({
    message: data.message,
  }, data.code);
});

export default app;
