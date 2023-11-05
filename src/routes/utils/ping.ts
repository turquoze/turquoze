import { Router } from "@oakserver/oak";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";

export default class PingRoutes {
  #ping: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#ping = new Router<TurquozeState>({
      prefix: "/ping",
    });

    this.#ping.get("/", (ctx) => {
      ctx.response.body = "Pong";
    });
  }

  routes() {
    return this.#ping.routes();
  }
}
