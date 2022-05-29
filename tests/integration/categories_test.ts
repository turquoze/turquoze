import { Application, assert, assertEquals } from "../test_deps.ts";

import CategoriesRoutes from "../../src/routes/api/categories.ts";
import { Category } from "../../src/utils/types.ts";
import container from "../../src/services/mod.ts";

let ID = "";

Deno.test({
  name: "Categories - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const data = JSON.stringify({
      public_id: "156e4529-8131-46bf-b0f7-03863a608214",
      name: "test",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    ID = categories.public_id;
  },
});

Deno.test({
  name: "Categories - Get | ok",
  async fn() {
    const app = new Application();

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Categories - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    assertEquals(categories.public_id, ID);
  },
});

Deno.test({
  name: "Categories - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/byname/test`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    assertEquals(categories.public_id, ID);
  },
});

Deno.test({
  name: "Categories - Put | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const data = JSON.stringify({
      public_id: ID,
      name: "test update",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    assertEquals(categories.public_id, ID);
  },
});

Deno.test({
  name: "Categories - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Categories Link - Post | ok",
  ignore: true,
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const data = JSON.stringify({
      category: "05820ab4-6661-4fba-95ab-b5ca40b43da5",
      product: "00669ffc-bc13-47b1-aec6-f524611a657f",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/link`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Categories Link - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const data = JSON.stringify({
      category: "05820ab4-6661-4fba-95ab-b5ca40b43da5",
      product: "00669ffc-bc13-47b1-aec6-f524611a657f",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/link`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "DELETE",
        body: data,
      }),
    );

    assert(response?.ok);
  },
});
