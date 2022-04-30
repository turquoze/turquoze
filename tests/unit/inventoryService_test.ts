import { assert, assertObjectMatch } from "../test_deps.ts";
import inventoryService from "../../src/services/inventoryService/mod.ts";
import client from "../../src/services/dataClient/client.ts";
import cacheService from "../../src/services/cacheService/mod.ts";

const cache = new cacheService();

const inventory = new inventoryService(client, cache);
let ID = "";

Deno.test("InventoryService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await inventory.Create({
          data: {
            id: "",
            product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
            quantity: 2,
            warehouse: "a03a718d-619c-415c-933d-9ebcdff35e3c",
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
        await inventory.Create({
          // @ts-expect-error want to test
          data: {
            product: "00000000-0000-0000-0000-000000000000",
            quantity: 0,
            warehouse: "00000000-0000-0000-0000-000000000000",
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
      const data = await inventory.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        created_at: data.created_at,
        product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
        quantity: 2,
        warehouse: "a03a718d-619c-415c-933d-9ebcdff35e3c",
      });
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await inventory.Get({
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
        const data = await inventory.Update({
          data: {
            id: ID,
            product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
            quantity: 10,
            warehouse: "a03a718d-619c-415c-933d-9ebcdff35e3c",
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
        await inventory.Update({
          data: {
            id: "00000000-0000-0000-0000-000000000000",
            product: "00000000-0000-0000-0000-000000000000",
            quantity: 0,
            warehouse: "00000000-0000-0000-0000-000000000000",
          },
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
        await inventory.Delete({
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
        await inventory.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
