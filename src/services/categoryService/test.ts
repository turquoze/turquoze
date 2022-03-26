import { assert, assertObjectMatch } from "../../deps.ts";
import categoryService from "./mod.ts";
import client from "../dataClient/client.ts";

const category = new categoryService(client);
let ID = "";

Deno.test("CategoryService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await category.Create({
          data: {
            id: "",
            name: "test",
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
    name: "Get",
    fn: async () => {
      const data = await category.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        name: "test",
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
      });
    },
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await category.Update({
          data: {
            id: ID,
            name: "test update",
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
    name: "GetMany",
    fn: async () => {
      const data = await category.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await category.Delete({
          id: ID,
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });
});
