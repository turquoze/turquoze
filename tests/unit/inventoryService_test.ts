import { assert, assertObjectMatch } from "../test_deps.ts";
import inventoryService from "../../src/services/inventoryService/mod.ts";
import { dbClient } from "../test_utils.ts";

const inventory = new inventoryService(dbClient);
let ID = "";

Deno.test("InventoryService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await inventory.Create({
          data: {
            id: 0,
            publicId: "",
            product: "62e03261-c37d-4037-8f0b-b3dd1974f2c2",
            quantity: 2,
            warehouse: "5690efcf-07a6-4e93-a162-01d45a376dbe",
          },
        });

        ID = data.publicId;
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get",
    fn: async () => {
      const data = await inventory.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        createdAt: data.createdAt,
        product: "62e03261-c37d-4037-8f0b-b3dd1974f2c2",
        quantity: 2,
        warehouse: "5690efcf-07a6-4e93-a162-01d45a376dbe",
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
        await inventory.Get({
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
        const data = await inventory.Update({
          data: {
            id: 0,
            publicId: ID,
            product: "62e03261-c37d-4037-8f0b-b3dd1974f2c2",
            quantity: 10,
            warehouse: "5690efcf-07a6-4e93-a162-01d45a376dbe",
          },
        });

        ID = data.publicId;
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
        await inventory.Update({
          data: {
            id: 0,
            publicId: "00000000-0000-0000-0000-000000000000",
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });
});
