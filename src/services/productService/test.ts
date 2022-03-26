import { assert, assertObjectMatch } from "../../deps.ts";
import productService from "./mod.ts";
import client from "../dataClient/client.ts";

const product = new productService(client);
let ID = "";

Deno.test("ProductService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await product.Create({
          data: {
            id: "",
            active: true,
            images: [],
            price: 203300,
            title: "test product",
            description: "test product",
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
      const data = await product.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        created_at: data.created_at,
        active: true,
        images: [],
        price: "203300",
        title: "test product",
        description: "test product",
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
      });
    },
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await product.Update({
          data: {
            id: ID,
            active: true,
            images: [],
            price: 203300,
            title: "test product update",
            description: "test product update",
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
      const data = await product.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await product.Delete({
          id: ID,
        });
        assert(true);
      } catch {
        assert(false);
      }
    },
  });
});
