import { assert, assertObjectMatch } from "../test_deps.ts";
import cartService from "../../src/services/cartService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const cart = new cartService(client);
let ID = "";

Deno.test("CartService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await cart.Create({
          data: {
            public_id: "",
            id: 0,
            items: [],
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
    name: "Get",
    fn: async () => {
      const data = await cart.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        created_at: data.created_at,
      });
    },
  });

  await t.step({
    name: "Add Items",
    fn: async () => {
      try {
        await cart.AddItem({
          data: {
            id: 0,
            cart_id: ID,
            price: 2000,
            product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
            quantity: 2,
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Add Items - Again",
    fn: async () => {
      try {
        await cart.AddItem({
          data: {
            id: 0,
            cart_id: ID,
            price: 2000,
            product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
            quantity: 3,
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Add Items - Fail",
    fn: async () => {
      try {
        await cart.AddItem({
          data: {
            id: 0,
            cart_id: ID,
            price: 2000,
            product_id: "00000000-0000-0000-0000-000000000000",
            quantity: 2,
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Get Items",
    fn: async () => {
      const data = await cart.GetCartItem(
        ID,
        "00669ffc-bc13-47b1-aec6-f524611a657f",
      );

      assertObjectMatch(data, {
        id: data.id,
        cart_id: ID,
        product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
        quantity: 5,
        price: 2000,
      });
    },
  });

  await t.step({
    name: "Get Items - Fail",
    fn: async () => {
      try {
        await cart.GetCartItem(
          ID,
          "00000000-0000-0000-0000-000000000000",
        );

        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Get All Items",
    fn: async () => {
      const data = await cart.GetAllItems(
        ID,
      );

      assert(data.length > 0);

      assertObjectMatch(data[0], {
        id: data[0].id,
        cart_id: ID,
        product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
        quantity: 5,
        price: 2000,
      });
    },
  });

  await t.step({
    name: "Get All Items - Fail",
    fn: async () => {
      try {
        await cart.GetAllItems(
          "00000000-0000-0000-0000-000000000000",
        );

        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Delete Items",
    fn: async () => {
      try {
        await cart.RemoveItem(ID, "00669ffc-bc13-47b1-aec6-f524611a657f");
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Delete Items - Fail",
    fn: async () => {
      try {
        await cart.RemoveItem(ID, "00000000-0000-0000-0000-000000000000");
        assert(false);
      } catch {
        assert(true);
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
