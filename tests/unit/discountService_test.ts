import { assert, assertObjectMatch } from "../test_deps.ts";
import discountService from "../../src/services/discountService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const discount = new discountService(client);
let ID = "";

Deno.test("DiscountService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await discount.Create({
          data: {
            id: "",
            type: "FIXED",
            valid_from: null,
            valid_to: null,
            value: 20,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            code: "TEST",
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
        await discount.Create({
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
      const data = await discount.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        type: "FIXED",
        valid_from: null,
        valid_to: null,
        value: 20,
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
        code: "TEST",
      });
    },
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
  });

  await t.step({
    name: "GetByCode",
    fn: async () => {
      const data = await discount.GetByCode({
        code: "TEST",
      });
      assertObjectMatch(data, {
        id: ID,
        type: "FIXED",
        valid_from: null,
        valid_to: null,
        value: 20,
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
        code: "TEST",
      });
    },
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
  });

  await t.step({
    name: "GetMany",
    fn: async () => {
      const data = await discount.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await discount.GetMany({
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
        await discount.Delete({
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
        await discount.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
