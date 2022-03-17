import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { Application } from "../../deps.ts";

import ProductsRoutes from "./products.ts";
import { ProductService } from "../../services/mod.ts";
import { Product } from "../../utils/types.ts";

let ID = "";

Deno.test({
  name: "Products - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(ProductService).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/products`, {
        method: "POST",
      }),
    );

    assert(response?.ok);

    const { products }: { products: Product } = await response?.json();
    ID = products.id;
  },
});

Deno.test({
  name: "Products - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(ProductService).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/products`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Products - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(ProductService).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { products }: { products: Product } = await response?.json();
    assertEquals(products.id, ID);
  },
});

Deno.test({
  name: "Products - Put | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(ProductService).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "PUT",
      }),
    );

    assert(response?.ok);

    const { products }: { products: Product } = await response?.json();
    assertEquals(products.id, ID);
  },
});

Deno.test({
  name: "Products - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(ProductService).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
