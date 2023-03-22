import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";

export default class PingRoutes {
  #ping: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
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
