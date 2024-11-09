import { assert, assertObjectMatch } from "../test_deps.ts";
import inventoryService from "../../src/services/inventoryService.ts";
import { dbClient, WAREHOUSE_ID } from "../test_utils.ts";
import { PRODUCT_ID } from "../test_utils.ts";

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
            product: PRODUCT_ID,
            quantity: 2,
            warehouse: WAREHOUSE_ID,
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
        await inventory.Create({
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
        product: PRODUCT_ID,
        quantity: 2,
        warehouse: WAREHOUSE_ID,
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
            publicId: ID,
            product: PRODUCT_ID,
            quantity: 10,
            warehouse: WAREHOUSE_ID,
          },
          id: ID,
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
        await inventory.Update({
          data: {
            publicId: "00000000-0000-0000-0000-000000000000",
            product: "00000000-0000-0000-0000-000000000000",
            quantity: 0,
            warehouse: "00000000-0000-0000-0000-000000000000",
          },
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
