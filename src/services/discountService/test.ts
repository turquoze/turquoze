import { assert, assertObjectMatch } from "../../deps.ts";
import discountService from "./mod.ts";
import client from "../dataClient/client.ts";

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
      });
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
});
