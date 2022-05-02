import { Delete, Get, Update } from "../../dataAccessLayer/cacheOrDb.ts";
import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Region } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { RegionSchema, UuidSchema } from "../../utils/validator.ts";

export default class RegionsRoutes {
  #regions: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#regions = new Router({
      prefix: "/regions",
    });

    this.#regions.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let region: Region;
        if (body.type === "json") {
          region = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await RegionSchema.validate(region);
        const posted: Region = await RegionSchema.cast(region);

        const data = await this.#Container.RegionService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          regions: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#regions.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Region>({
          id: `region_${ctx.params.id}`,
          promise: this.#Container.RegionService.Get({
            id: ctx.params.id,
          }),
        });

        /*const data = await this.#Container.RegionService.Get({
          id: ctx.params.id,
        });*/
        ctx.response.body = stringifyJSON({
          regions: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#regions.put("/:id", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let region: Region;
        if (body.type === "json") {
          region = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        region.id = ctx.params.id;

        await RegionSchema.validate(region);
        const posted: Region = await RegionSchema.cast(region);

        const data = await Update<Region>({
          id: `region_${ctx.params.id}`,
          promise: this.#Container.RegionService.Update({
            data: posted,
          }),
        });

        /*const data = await this.#Container.RegionService.Update({
          data: posted,
        });*/
        ctx.response.body = stringifyJSON({
          regions: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#regions.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete({
          id: `region_${ctx.params.id}`,
          promise: this.#Container.RegionService.Delete({ id: ctx.params.id }),
        });

        //await this.#Container.RegionService.Delete({ id: ctx.params.id });
        ctx.response.status = 201;
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });
  }

  routes() {
    return this.#regions.routes();
  }
}
