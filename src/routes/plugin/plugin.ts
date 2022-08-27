import { Router } from "../../deps.ts";

import { initRoutes } from "../../plugins/mod.ts";

export default class PluginsRoutes {
  #plugin: Router;
  constructor() {
    this.#plugin = new Router();

    for (const route of initRoutes()) {
      this.#plugin.use(route.routes());
    }
  }

  routes() {
    return this.#plugin.routes();
  }
}
