import { Router } from "../../deps.ts";
import IRegionService from "../../services/interfaces/regionService.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { RegionSchema } from "../../utils/validator.ts";

export default class RegionsRoutes {
  #regions: Router;
  #RegionService: IRegionService;
  constructor(regionService: IRegionService) {
    this.#RegionService = regionService;
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

        const data = await this.#RegionService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          regions: data,
        });
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#regions.get("/:id", async (ctx) => {
      try {
        const data = await this.#RegionService.Get({ id: ctx.params.id });
        ctx.response.body = stringifyJSON({
          regions: data,
        });
      } catch (error) {
        ctx.response.status = 400;
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

        const data = await this.#RegionService.Update({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          regions: data,
        });
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#regions.delete("/:id", async (ctx) => {
      try {
        await this.#RegionService.Delete({ id: ctx.params.id });
        ctx.response.status = 201;
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#regions.routes();
  }
}
