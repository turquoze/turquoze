import { assert, assertObjectMatch } from "../../deps.ts";
import cartService from "./mod.ts";
import client from "../dataClient/client.ts";

const cart = new cartService(client);
let ID = "";

Deno.test("CartService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await cart.CreateOrUpdate({
          data: {
            id: "",
            products: {
              cart: [{
                pid: "234",
                quantity: 3,
              }],
            },
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
      const data = await cart.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        products: {
          cart: [{
            pid: "234",
            quantity: 3,
          }],
        },
        created_at: data.created_at,
      });
    },
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await cart.Delete({
          id: ID,
        });
        assert(true);
      } catch {
        assert(false);
      }
    },
  });
});
