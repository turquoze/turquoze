import { Router } from "../../deps.ts";

import { RegionService } from "../../services/mod.ts";
import { stringifyJSON } from "../../utils/utils.ts";

const regions = new Router({
  prefix: "/regions",
});

regions.post("/", async (ctx) => {
  try {
    const data = await RegionService.Create({
      data: {
        id: "NULL",
        currency: "EUR",
        name: "TEST-REGION",
        regions: ["EU"],
      },
    });
    ctx.response.body = stringifyJSON({
      regions: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

regions.get("/:id", async (ctx) => {
  try {
    const data = await RegionService.Get({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      regions: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

regions.put("/:id", async (ctx) => {
  try {
    const data = await RegionService.Update({
      data: {
        id: ctx.params.id,
        name: "TEST-UPDATE",
        currency: "USD",
        regions: ["EU", "GB"],
      },
    });
    ctx.response.body = stringifyJSON({
      regions: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

regions.delete("/:id", async (ctx) => {
  try {
    await RegionService.Delete({ id: ctx.params.id });
    ctx.response.status = 201;
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

export default regions;
