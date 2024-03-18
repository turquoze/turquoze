import { assert, assertObjectMatch } from "../test_deps.ts";
import priceService from "../../src/services/priceService/mod.ts";
import { dbClient, PRODUCT_ID, SHOP_ID } from "../test_utils.ts";

const price = new priceService(dbClient);
let ID = "";

Deno.test("PriceService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await price.Create({
          data: {
            publicId: "",
            amount: 100,
            shop: SHOP_ID,
            product: PRODUCT_ID,
          },
        });

        ID = data.publicId!;
        assert(true);
      } catch {
        assert(false);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Create - Fail",
    fn: async () => {
      try {
        await price.Create({
          //@ts-ignore not on type
          data: {
            publicId: "",
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get",
    fn: async () => {
      const data = await price.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        createdAt: data.createdAt,
        amount: 100,
        shop: SHOP_ID,
        product: PRODUCT_ID,
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await price.Get({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await price.Update({
          data: {
            publicId: ID,
            amount: 200,
            shop: SHOP_ID,
            product: PRODUCT_ID,
          },
        });

        ID = data.publicId!;
        assert(true);
      } catch {
        assert(false);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Update - Fail",
    fn: async () => {
      try {
        await price.Update({
          data: {
            publicId: "00000000-0000-0000-0000-000000000000",
            amount: 200,
            shop: SHOP_ID,
            product: "00000000-0000-0000-0000-000000000000",
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "GetMany",
    fn: async () => {
      const data = await price.GetMany({
        shop: SHOP_ID,
      });
      assert(data.length > 0);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await price.GetMany({
          offset: 0,
          shop: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await price.Delete({
          id: ID,
        });
        assert(true);
      } catch {
        assert(false);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Delete - Fail",
    fn: async () => {
      try {
        await price.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });
});
