import { assert, assertObjectMatch } from "../test_deps.ts";
import productService from "../../src/services/productService/mod.ts";
import client from "../../src/services/dataClient/client.ts";
import cacheService from "../../src/services/cacheService/mod.ts";

const cache = new cacheService();

const product = new productService(client, cache);
let ID = "";

Deno.test("ProductService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await product.Create({
          data: {
            id: "",
            active: true,
            images: [],
            price: 203300,
            title: "test product",
            description: "test product",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        ID = data.id;
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
            id: "",
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
        id: ID,
        created_at: data.created_at,
        active: true,
        images: [],
        price: "203300",
        title: "test product",
        description: "test product",
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
    name: "Update",
    fn: async () => {
      try {
        const data = await product.Update({
          data: {
            id: ID,
            active: true,
            images: [],
            price: 203300,
            title: "test product update",
            description: "test product update",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        ID = data.id;
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
            id: "00000000-0000-0000-0000-000000000000",
            active: true,
            images: [],
            price: 203300,
            title: "test product update",
            description: "test product update",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
