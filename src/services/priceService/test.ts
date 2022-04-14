import { assert, assertObjectMatch } from "../../deps.ts";
import priceService from "./mod.ts";
import client from "../dataClient/client.ts";

const price = new priceService(client);
let ID = "";

Deno.test("PriceService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await price.Create({
          data: {
            id: "",
            amount: 100,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
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
        await price.Create({
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
      const data = await price.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        created_at: data.created_at,
        amount: 100,
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
        product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
      });
    },
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
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await price.Update({
          data: {
            id: ID,
            amount: 200,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
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
        await price.Update({
          data: {
            id: "00000000-0000-0000-0000-000000000000",
            amount: 200,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            product: "00000000-0000-0000-0000-000000000000",
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
      const data = await price.GetMany({});
      assert(data.length > 0);
    },
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
  });
});
