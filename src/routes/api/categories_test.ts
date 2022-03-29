import { Application, assert, assertEquals } from "../../deps.ts";

import CategoriesRoutes from "./categories.ts";
import { Category, CategoryLink } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
const container = new Container();

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
  name: "Categories - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories`, {
        method: "POST",
        body: JSON.stringify({
          id: "156e4529-8131-46bf-b0f7-03863a608214",
          name: "test",
        }),
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    ID = categories.id;
  },
});

Deno.test({
  name: "Categories - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
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
    assertEquals(categories.id, ID);
  },
});

Deno.test({
  name: "Categories - Put | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/${ID}`, {
        method: "PUT",
        body: JSON.stringify({
          id: ID,
          name: "test update",
        }),
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    assertEquals(categories.id, ID);
  },
});

Deno.test({
  name: "Categories - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
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
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/link`, {
        method: "POST",
      }),
    );

    assert(response?.ok);

    /*const { link }: { link: CategoryLink } = await response?.json();
    assertEquals(link.category, link.category); // TODO: add body
    assertEquals(link.product, link.product); // TODO: add body*/
  },
});

Deno.test({
  name: "Categories Link - Delete | ok",
  ignore: true, // TODO: make work
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(
      new CategoriesRoutes(container).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/link`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
