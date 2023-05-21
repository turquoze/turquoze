import { assert, assertObjectMatch } from "../test_deps.ts";
import warehouseService from "../../src/services/warehouseService/mod.ts";
import { pool as client } from "../test_utils.ts";

const warehouse = new warehouseService(client);
let ID = "";

Deno.test("WarehouseService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await warehouse.Create({
          data: {
            id: 0,
            public_id: "",
            address: "Test 1B",
            country: "Sweden",
            name: "Sweden A",
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
        await warehouse.Create({
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
  });

  await t.step({
    name: "Get",
    fn: async () => {
      const data = await warehouse.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        created_at: data.created_at,
        address: "Test 1B",
        country: "Sweden",
        name: "Sweden A",
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
      });
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await warehouse.Get({
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
        const data = await warehouse.Update({
          data: {
            id: 0,
            public_id: ID,
            address: "Test 1B - Update",
            country: "Sweden - Update",
            name: "Sweden A - Update",
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
        await warehouse.Update({
          data: {
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            address: "Test 1B - Update",
            country: "Sweden - Update",
            name: "Sweden A - Update",
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
      const data = await warehouse.GetMany({
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
      });
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await warehouse.GetMany({
          offset: "00000000-0000-0000-0000-000000000000",
          shop: "00000000-0000-0000-0000-000000000000",
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
        await warehouse.Delete({
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
        await warehouse.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
