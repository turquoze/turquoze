import { assert, assertObjectMatch } from "../test_deps.ts";
import priceService from "../../src/services/priceService/mod.ts";
import { pool as client } from "../test_utils.ts";

const price = new priceService(client);
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
            id: 0,
            public_id: "",
            amount: 100,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
            product: "b9bb5511-add4-4fb4-b262-e498a7e73506",
          },
        });

        ID = data.public_id;
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
        public_id: ID,
        created_at: data.created_at,
        amount: 100,
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
        product: "b9bb5511-add4-4fb4-b262-e498a7e73506",
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
            id: 0,
            public_id: ID,
            amount: 200,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
            product: "b9bb5511-add4-4fb4-b262-e498a7e73506",
          },
        });

        ID = data.public_id;
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
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            amount: 200,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
      const data = await price.GetMany({});
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
          offset: "00000000-0000-0000-0000-000000000000",
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
