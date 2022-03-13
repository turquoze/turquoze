import { Router } from "../../deps.ts";

import { CategoryLinkService, CategoryService } from "../../services/mod.ts";
import { stringifyJSON } from "../../utils/utils.ts";
import { CategoryLinkSchema, CategorySchema } from "../../utils/validator.ts";

const categories = new Router({
  prefix: "/categories",
});

categories.get("/", async (ctx) => {
  try {
    const data = await CategoryService.GetMany({});
    ctx.response.body = stringifyJSON({
      categories: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.post("/", async (ctx) => {
  try {
    const posted = {
      id: "",
      name: "test",
      region: ctx.state.region,
    };

    await CategorySchema.validate(posted);

    const data = await CategoryService.Create({
      data: posted,
    });
    ctx.response.body = stringifyJSON({
      categories: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.get("/:id", async (ctx) => {
  try {
    const data = await CategoryService.Get({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      categories: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.put("/:id", async (ctx) => {
  try {
    const posted = {
      id: "",
      name: "test update",
      region: ctx.state.region,
    };

    await CategorySchema.validate(posted);

    const data = await CategoryService.Update({
      data: posted,
    });
    ctx.response.body = stringifyJSON({
      categories: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.delete("/:id", async (ctx) => {
  try {
    const data = await CategoryService.Delete({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      categories: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.post("/link", async (ctx) => {
  try {
    const posted = {
      category: "e6cd1629-9a7d-44b6-8816-daf8dbeb61a3",
      product: "12c8eb72-c4b2-40eb-a30d-bafd436ea60e",
    };

    await CategoryLinkSchema.validate(posted);

    const data = await CategoryLinkService.Link({
      data: posted,
    });
    ctx.response.body = stringifyJSON({
      link: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

categories.delete("/link", async (ctx) => {
  try {
    const posted = {
      category: "e6cd1629-9a7d-44b6-8816-daf8dbeb61a3",
      product: "12c8eb72-c4b2-40eb-a30d-bafd436ea60e",
    };

    await CategoryLinkSchema.validate(posted);

    await CategoryLinkService.Delete({
      data: posted,
    });
    ctx.response.status = 201;
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

export default categories;
