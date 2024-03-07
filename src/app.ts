import { Hono } from "hono";
import { migrationConnection } from "./clients/db.ts";
import Cors from "./middleware/cors.ts";
import Logger from "./middleware/logger.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import Container from "./services/mod.ts";
import { reIndex, removeProduct } from "./utils/events.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import utils from "./routes/utils/utils.ts";
import NotFound from "./pages/404.ts";
import { ErrorHandler } from "./utils/errors.ts";
import { RUN_DB_MIGRATION } from "./utils/secrets.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { TurquozeEvent } from "./utils/types.ts";
import type ICacheService from "./services/interfaces/cacheService.ts";

class App {
  #container: Container;
  #app: Hono;
  constructor(container: Container) {
    this.#container = container;
    this.#app = new Hono({ strict: false });
    this.#app.use("*", Cors());
    this.#app.use("*", Logger());
    this.#app.use("*", ResponseTimer());
    this.#app.route("/admin", admin(this.#container));
    this.#app.route("/api", api(this.#container));
    this.#app.route("/utils", utils(this.#container));

    this.#app.notFound((ctx) => {
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

    this.#app.onError((error, ctx) => {
      const data = ErrorHandler(error);
      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        message: data.message,
      }, data.code);
    });

    this.event("Product.Created", (event) => {
      //@ts-expect-error not on type
      const { id, shop } = event.detail;
      reIndex(id, shop, this.#container);
    });

    this.event("Product.Updated", (event) => {
      //@ts-expect-error not on type
      const { id, shop } = event.detail;
      reIndex(id, shop, this.#container);
    });

    this.event("Product.Deleted", (event) => {
      //@ts-expect-error not on type
      const { id, shop } = event.detail;
      removeProduct(id, shop, this.#container);
    });
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

  event(event: TurquozeEvent, callback: EventListenerOrEventListenerObject) {
    this.#container.NotificationService.addListener(callback, event);
  }

  router() {
    return this.#app;
  }

  addCache(cache: ICacheService) {
    this.#container.CacheService = cache;
  }
}

export default App;
