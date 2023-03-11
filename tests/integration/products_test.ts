import { assert, assertEquals } from "../test_deps.ts";

import ProductsRoutes from "../../src/routes/api/products.ts";
import ProductsAdminRoutes from "../../src/routes/admin/products.ts";
import { Product, Search } from "../../src/utils/types.ts";
import app from "../test_app.ts";

let ID = "";
const SLUG = "test1";

app.use(new ProductsRoutes(app.state.container).routes());
app.use(new ProductsAdminRoutes(app.state.container).routes());

Deno.test({
  name: "Products - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      active: true,
      images: [],
      price: 203300,
      title: "test product",
      short_description: "test product",
      long_description: "test product long",
      slug: "test1",
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
    ID = products.public_id;
  },
});

Deno.test({
  name: "Products - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/products`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Products - Get By Slug | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/products/byslug/${SLUG}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Products - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { products }: { products: Product } = await response?.json();
    assertEquals(products.public_id, ID);
  },
});

Deno.test({
  name: "Products - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      id: ID,
      active: true,
      images: ["https://test.com"],
      price: 203300,
      title: "Test product update",
      short_description: "test description update",
      long_description: "test description long update",
      slug: "test1",
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
    assertEquals(products.public_id, ID);
  },
});

Deno.test({
  name: "Products - Search | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const body: Search = {
      index: "",
      query: "test",
      options: {
        limit: 10,
      },
    };

    const data = JSON.stringify(body);

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
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
