import { Application, assert, assertEquals } from "../../deps.ts";

import ProductsRoutes from "./products.ts";
import { Product } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Products - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(container).routes());

    const data = JSON.stringify({
      active: true,
      images: [],
      price: 203300,
      title: "test product",
      description: "test product",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/products`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
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

    app.use(new ProductsRoutes(container).routes());

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

    app.use(new ProductsRoutes(container).routes());

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

    app.use(new ProductsRoutes(container).routes());

    const data = JSON.stringify({
      id: ID,
      active: true,
      images: ["https://test.com"],
      price: 203300,
      title: "Test product update",
      description: "test description update",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { products }: { products: Product } = await response?.json();
    assertEquals(products.id, ID);
  },
});

Deno.test({
  name: "Products - Search | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(container).routes());

    const data = JSON.stringify({
      query: "test",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/products/search`, {
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
  name: "Products - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new ProductsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
