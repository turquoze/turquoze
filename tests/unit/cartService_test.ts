import { assert, assertObjectMatch } from "../test_deps.ts";
import cartService from "../../src/services/cartService/mod.ts";
import { dbClient } from "../test_utils.ts";

const cart = new cartService(dbClient);
let ID = "";

Deno.test("CartService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await cart.Create({
          data: {
            publicId: "",
            id: 0,
            billing: {
              address1: "",
              address2: "",
              city: "",
              country: "",
              name: "",
              phone: "",
              state: "",
              zip: "",
            },
            shipping: {
              address1: "",
              address2: "",
              city: "",
              country: "",
              name: "",
              phone: "",
              state: "",
              zip: "",
            },
            coupon: "",
            giftcard: "",
            metadata: {},
            items: [],
            comment: "",
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
    name: "Get",
    fn: async () => {
      const data = await cart.Get({
        id: ID,
      });

      assert(data);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Add Items",
    fn: async () => {
      try {
        await cart.AddItem({
          data: {
            id: 0,
            cartId: ID,
            price: 2000,
            itemId: "d72f032b-b91b-4dbf-811c-a01ab0938358",
            type: "PRODUCT",
            quantity: 2,
            totalPrice: 4000,
          },
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
    name: "Add Items - Again",
    fn: async () => {
      try {
        await cart.AddItem({
          data: {
            id: 0,
            cartId: ID,
            price: 2000,
            itemId: "d72f032b-b91b-4dbf-811c-a01ab0938358",
            type: "PRODUCT",
            quantity: 3,
            totalPrice: 6000,
          },
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
    name: "Add Items - Fail",
    fn: async () => {
      try {
        await cart.AddItem({
          data: {
            id: 0,
            cartId: ID,
            price: 2000,
            itemId: "00000000-0000-0000-0000-000000000000",
            type: "PRODUCT",
            quantity: 2,
            totalPrice: 4000,
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
    name: "Get Items",
    fn: async () => {
      const data = await cart.GetCartItem(
        ID,
        "d72f032b-b91b-4dbf-811c-a01ab0938358",
      );

      assertObjectMatch(data, {
        id: data.id,
        cartId: ID,
        itemId: "d72f032b-b91b-4dbf-811c-a01ab0938358",
        quantity: 5,
        price: 2000,
        type: data.type,
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
        cartId: ID,
        itemId: "d72f032b-b91b-4dbf-811c-a01ab0938358",
        quantity: 5,
        price: 2000,
        type: data[0].type,
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Delete Items",
    fn: async () => {
      try {
        await cart.RemoveItem(ID, "d72f032b-b91b-4dbf-811c-a01ab0938358");
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
    name: "Delete Items - Fail",
    fn: async () => {
      try {
        await cart.RemoveItem(ID, "00000000-0000-0000-0000-000000000000");
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });
});
