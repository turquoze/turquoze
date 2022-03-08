import { Router } from "../../deps.ts";

import { DataService } from "../../services/mod.ts";
import { stringifyJSON } from "../../utils/utils.ts";

const products = new Router({
  prefix: "/products",
});

products.get("/", async (ctx) => {
  try {
    const data = await DataService.GetMany({});
    ctx.response.body = stringifyJSON({
      products: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

products.post("/", async (ctx) => {
  try {
    const data = await DataService.Create({
      data: {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        active: true,
        images: [],
        price: 203300,
        title: "Test product",
        description: "test description",
      },
    });
    ctx.response.body = stringifyJSON({
      products: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

products.put("/:id", async (ctx) => {
  try {
    const data = await DataService.Update({
      data: {
        id: ctx.params.id,
        active: true,
        images: ["https://test.com"],
        price: 203300,
        title: "Test product update",
        description: "test description update",
      },
    });
    ctx.response.body = stringifyJSON({
      product: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

products.get("/:id", async (ctx) => {
  try {
    const data = await DataService.Get({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      product: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

products.delete("/:id", async (ctx) => {
  try {
    await DataService.Delete({ id: ctx.params.id });
    ctx.response.status = 201;
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

export default products;
