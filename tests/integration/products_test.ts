import { assert, assertEquals } from "../test_deps.ts";

import ProductsRoutes from "../../src/routes/api/products.ts";
import ProductsAdminRoutes from "../../src/routes/admin/products.ts";
import PricesRoutes from "../../src/routes/admin/prices.ts";
import { Search } from "../../src/utils/types.ts";
import app, { container } from "../test_app.ts";
import { Price, Product } from "../../src/utils/validator.ts";
import { dbClient } from "../test_utils.ts";
import { products } from "../../src/utils/schema.ts";
import { eq } from "../../src/deps.ts";
import { prices } from "../../src/utils/schema.ts";
let ID = "";
let PriceID = "";
const SLUG = "test1";

app.route("/products", new ProductsRoutes(container).routes());
app.route("/products", new ProductsAdminRoutes(container).routes());
app.route("/prices", new PricesRoutes(container).routes());

Deno.test({
  name: "Products - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      active: true,
      images: [],
      title: "test product",
      shortDescription: "test product",
      longDescription: "test product long",
      slug: "test1",
    });

    const response = await app.request(
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
    ID = products.publicId!;

    const dataPrice = JSON.stringify({
      amount: 203300,
      product: products.publicId!,
    });

    const responsePrice = await app.request(
      new Request(`http://127.0.0.1/prices`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(dataPrice).length}`,
        }),
        method: "POST",
        body: dataPrice,
      }),
    );

    const { prices }: { prices: Price } = await responsePrice?.json();
    PriceID = prices.publicId!;

    assert(responsePrice?.ok);
  },
});

Deno.test({
  name: "Products - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
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
    const response = await app.request(
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
    const response = await app.request(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { products }: { products: Product } = await response?.json();
    assertEquals(products.publicId, ID);
  },
});

Deno.test({
  name: "Products - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      publicId: ID,
      active: true,
      images: ["https://test.com"],
      title: "Test product update",
      shortDescription: "test description update",
      longDescription: "test description long update",
      slug: "test1",
    });

    const response = await app.request(
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
    assertEquals(products.publicId, ID);
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

    const response = await app.request(
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
    const responsePrice = await app.request(
      new Request(`http://127.0.0.1/prices/${PriceID}`, {
        method: "DELETE",
      }),
    );

    assert(responsePrice?.ok);

    const response = await app.request(
      new Request(`http://127.0.0.1/products/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);

    await dbClient.delete(prices).where(eq(prices.publicId, PriceID));
    await dbClient.delete(products).where(eq(products.publicId, ID));
  },
});
