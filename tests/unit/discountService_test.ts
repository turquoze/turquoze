import { assert, assertObjectMatch } from "../test_deps.ts";
import discountService from "../../src/services/discountService/mod.ts";
import { dbClient, SHOP_ID } from "../test_utils.ts";
import { discounts } from "../../src/utils/schema.ts";
import { eq } from "../../src/deps.ts";

const discount = new discountService(dbClient);
let ID = "";
const TEST_CODE = `TEST-${crypto.randomUUID()}`;

Deno.test("DiscountService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await discount.Create({
          data: {
            publicId: "",
            type: "FIXED",
            validFrom: null,
            validTo: null,
            value: 20,
            shop: SHOP_ID,
            code: TEST_CODE,
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
        await discount.Create({
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
      const data = await discount.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        type: "FIXED",
        validFrom: null,
        validTo: null,
        value: 20,
        shop: SHOP_ID,
        code: TEST_CODE,
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
        await discount.Get({
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
    name: "GetByCode",
    fn: async () => {
      const data = await discount.GetByCode({
        code: TEST_CODE,
      });
      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        type: "FIXED",
        validFrom: null,
        validTo: null,
        value: 20,
        shop: SHOP_ID,
        code: TEST_CODE,
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "GetByCode - Fail",
    fn: async () => {
      try {
        await discount.GetByCode({
          code: "00000000-0000-0000-0000-000000000000",
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
      const data = await discount.GetMany({
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
        await discount.GetMany({
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
        await discount.Delete({
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
        await discount.Delete({
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

  //@ts-expect-error not on type
  await dbClient.delete(discounts).where(eq(discounts.publicId, ID));
});
