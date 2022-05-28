import { assert, assertObjectMatch } from "../test_deps.ts";
import productService from "../../src/services/productService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const product = new productService(client);
let ID = "";
const SLUG = "test2";

Deno.test("ProductService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await product.Create({
          data: {
            id: 0,
            public_id: "",
            active: true,
            images: [],
            price: 203300,
            title: "test product",
            short_description: "test product",
            long_description: "test product long",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            slug: "test2",
          },
        });

        ID = data.public_id;
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Create - Fail",
    fn: async () => {
      try {
        await product.Create({
          // @ts-expect-error want to test
          data: {
            public_id: "",
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Get",
    fn: async () => {
      const data = await product.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        created_at: data.created_at,
        active: true,
        images: [],
        price: "203300",
        title: "test product",
        short_description: "test product",
        long_description: "test product long",
        shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
        slug: "test2",
      });
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await product.Get({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Get By Slug",
    fn: async () => {
      const data = await product.GetBySlug({
        slug: SLUG,
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        created_at: data.created_at,
        active: true,
        images: [],
        price: "203300",
        title: "test product",
        short_description: "test product",
        long_description: "test product long",
        shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
        slug: "test2",
      });
    },
  });

  await t.step({
    name: "Get By Slug - Fail",
    fn: async () => {
      try {
        await product.GetBySlug({
          slug: "123",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await product.Update({
          data: {
            id: 0,
            public_id: ID,
            active: true,
            images: [],
            price: 203300,
            title: "test product update",
            short_description: "test product update",
            long_description: "test product long update",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            slug: "test2",
          },
        });

        ID = data.public_id;
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Update - Fail",
    fn: async () => {
      try {
        await product.Update({
          data: {
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            active: true,
            images: [],
            price: 203300,
            title: "test product update",
            short_description: "test product update",
            long_description: "test product long update",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            slug: "test2",
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "GetMany",
    fn: async () => {
      const data = await product.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await product.GetMany({
          offset: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await product.Delete({
          id: ID,
        });
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Delete - Fail",
    fn: async () => {
      try {
        await product.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
