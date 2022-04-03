import { assert, assertObjectMatch } from "../../deps.ts";
import warehouseService from "./mod.ts";
import client from "../dataClient/client.ts";

const warehouse = new warehouseService(client);
let ID = "";

Deno.test("WarehouseService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await warehouse.Create({
          data: {
            id: "",
            address: "Test 1B",
            country: "Sweden",
            name: "Sweden A",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
        await warehouse.Create({
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
      const data = await warehouse.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        created_at: data.created_at,
        address: "Test 1B",
        country: "Sweden",
        name: "Sweden A",
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
            id: ID,
            address: "Test 1B - Update",
            country: "Sweden - Update",
            name: "Sweden A - Update",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
        await warehouse.Update({
          data: {
            id: "00000000-0000-0000-0000-000000000000",
            address: "Test 1B - Update",
            country: "Sweden - Update",
            name: "Sweden A - Update",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
      const data = await warehouse.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await warehouse.GetMany({
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
