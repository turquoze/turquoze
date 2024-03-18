import { assert } from "../test_deps.ts";
import orderService from "../../src/services/orderService/mod.ts";
import { dbClient, SHOP_ID } from "../test_utils.ts";

const order = new orderService(dbClient);
let ID = "";

Deno.test("OrderService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    ignore: true,
    fn: async () => {
      try {
        const data = await order.Create({
          data: {
            publicId: "",
            paymentStatus: "WAITING",
            priceTotal: 1050,
            shop: SHOP_ID,
            products: [
              {
                price: {
                  currency: "EUR",
                  value: 1050,
                },
                product: "test-1",
                quantity: 1,
              },
            ],
            exported: false,
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
        await order.Create({
          //@ts-ignore not on type
          data: {
            publicId: "",
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
    ignore: true,
    fn: async () => {
      const data = await order.Get({
        id: ID,
      });

      assert(data);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await order.Get({
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
    name: "GetMany",
    ignore: true,
    fn: async () => {
      const data = await order.GetMany({
        shop: SHOP_ID,
      });
      assert(data.length > 0);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await order.GetMany({
          offset: 0,
          shop: "00000000-0000-0000-0000-000000000000",
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
    name: "SetPaymentStatus",
    ignore: true,
    fn: async () => {
      try {
        await order.SetPaymentStatus({
          id: ID,
          status: "PAYED",
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
});
