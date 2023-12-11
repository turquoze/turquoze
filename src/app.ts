import { Hono } from "hono";
import dbClient from "./clients/db.ts";
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

export const container = new Container(dbClient, redisClient);

addEvents(container);

class App {
  #container: Container;
  #app: Hono;
  constructor(container: Container) {
    this.#container = container;
    this.#app = new Hono();
  }

  container() {
    return this.#container;
  }

  router() {
    return this.#app;
  }
}

const app = new App(container);

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

export default app;
