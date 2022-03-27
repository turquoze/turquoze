import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { RegionSchema } from "../../utils/validator.ts";

export default class RegionsRoutes {
  #regions: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#regions = new Router({
      prefix: "/regions",
    });

    this.#regions.post("/", async (ctx) => {
      try {
        const posted = {
          id: "156e4529-8131-46bf-b0f7-03863a608214",
          currency: "EUR",
          name: "TEST-REGION",
          regions: ["EU"],
        };

        await RegionSchema.validate(posted);

        const data = await this.#Container.RegionService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          regions: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#regions.get("/:id", async (ctx) => {
      try {
        const data = await this.#Container.RegionService.Get({
          id: ctx.params.id,
        });
        ctx.response.body = stringifyJSON({
          regions: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#regions.put("/:id", async (ctx) => {
      try {
        const posted = {
          id: ctx.params.id,
          name: "TEST-UPDATE",
          currency: "USD",
          regions: ["EU", "GB"],
        };

        await RegionSchema.validate(posted);

        const data = await this.#Container.RegionService.Update({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          regions: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#regions.delete("/:id", async (ctx) => {
      try {
        await this.#Container.RegionService.Delete({ id: ctx.params.id });
        ctx.response.status = 201;
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#regions.routes();
  }
}
