import { Router } from "../../deps.ts";

import { CategoryService } from "../../services/mod.ts";
import { stringifyJSON } from "../../utils/utils.ts";

const categories = new Router({
  prefix: "/categories",
});

categories.get("/", async (ctx) => {
  try {
    const data = await CategoryService.GetMany({});
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.post("/", async (ctx) => {
  try {
    const data = await CategoryService.Create({
      data: {
        id: 1,
        name: "test",
        parent: "",
      },
    });
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.get("/:id", async (ctx) => {
  try {
    const data = await CategoryService.Get({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.put("/:id", async (ctx) => {
  try {
    const data = await CategoryService.Update({
      data: {
        id: 1,
        name: "test update",
        parent: "test parent 1",
      },
    });
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.delete("/:id", async (ctx) => {
  try {
    const data = await CategoryService.Delete({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

export default categories;
