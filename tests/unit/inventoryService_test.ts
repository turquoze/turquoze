import { assert, assertObjectMatch } from "../test_deps.ts";
import inventoryService from "../../src/services/inventoryService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const inventory = new inventoryService(client);
let ID = "";

Deno.test("InventoryService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await inventory.Create({
          data: {
            id: 0,
            public_id: "",
            product: "00669ffc-bc13-47b1-aec6-f524611a657f",
            quantity: 2,
            warehouse: "f87bfb4f-985b-4965-9f6c-844b80d591ab",
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
        id: data.id,
        public_id: ID,
        created_at: data.created_at,
        product: "00669ffc-bc13-47b1-aec6-f524611a657f",
        quantity: 2,
        warehouse: "f87bfb4f-985b-4965-9f6c-844b80d591ab",
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
            id: 0,
            public_id: ID,
            product: "00669ffc-bc13-47b1-aec6-f524611a657f",
            quantity: 10,
            warehouse: "f87bfb4f-985b-4965-9f6c-844b80d591ab",
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
        await inventory.Update({
          data: {
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
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
