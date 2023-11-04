import { assert, assertEquals } from "../test_deps.ts";

import CategoriesRoutes from "../../src/routes/admin/categories.ts";
import { Category } from "../../src/utils/types.ts";
import app from "../test_app.ts";

let ID = "";

app.use(new CategoriesRoutes(app.state.container).routes());

Deno.test({
  name: "Categories - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      publicId: "156e4529-8131-46bf-b0f7-03863a608214",
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
    ID = categories.publicId;
  },
});

Deno.test({
  name: "Categories - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    assertEquals(categories.publicId, ID);
  },
});

Deno.test({
  name: "Categories - Get | ok",
  ignore: true, // Not stable
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/categories/byname/test`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { categories }: { categories: Category } = await response?.json();
    assertEquals(categories.publicId, ID);
  },
});

Deno.test({
  name: "Categories - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      publicId: ID,
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
    assertEquals(categories.publicId, ID);
  },
});

Deno.test({
  name: "Categories - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
