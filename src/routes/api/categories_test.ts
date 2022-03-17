import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { Application } from "../../deps.ts";

import CategoriesRoutes from "./categories.ts";
import { CategoryLinkService, CategoryService } from "../../services/mod.ts";
import { Category, CategoryLink } from "../../utils/types.ts";

let ID = "";

Deno.test({
  name: "Categories - Get | ok",
  async fn() {
    const app = new Application();

    app.use(
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
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
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories`, {
        method: "POST",
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
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
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
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/${ID}`, {
        method: "PUT",
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
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
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
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
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
      new CategoriesRoutes(CategoryService, CategoryLinkService).routes(),
    );

    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/link`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
