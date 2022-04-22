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
            discounts: {
              cart: [],
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
    name: "Create - Fail",
    fn: async () => {
      try {
        await cart.CreateOrUpdate({
          // @ts-expect-error want to test
          data: {
            id: "",
          },
        });

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
        discounts: {
          cart: [],
        },
      });
    },
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        await cart.CreateOrUpdate({
          data: {
            id: ID,
            products: {
              cart: [{
                pid: "111",
                quantity: 1,
              }],
            },
            discounts: {
              cart: [],
            },
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await cart.Get({
          id: "00000000-0000-0000-0000-000000000000",
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
        await cart.Delete({
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
        await cart.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
