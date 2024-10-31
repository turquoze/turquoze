import { Hono } from "@hono/hono";
import type Container from "../../services/mod.ts";

export default class PingRoutes {
  #ping: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#ping = new Hono({ strict: false });

    this.#ping.get("/", (ctx) => {
      return ctx.text("Pong", 200);
    });
  }

  routes() {
    return this.#ping;
  }
}
