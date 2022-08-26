import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";

import { initRoutes } from "../../plugins/mod.ts";

export default class PluginsRoutes {
  #plugin: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#plugin = new Router({
      prefix: "/plugin",
    });

    for (const route of initRoutes()) {
      this.#plugin.use(route.routes());
    }
  }

  routes() {
    return this.#plugin.routes();
  }
}
