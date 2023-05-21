import { assert } from "../test_deps.ts";
import orderService from "../../src/services/orderService/mod.ts";
import { pool as client } from "../test_utils.ts";

const order = new orderService(client);
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
            id: 0,
            public_id: "",
            payment_status: "WAITING",
            price_total: 1050,
            created_at: 0,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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

        ID = data.public_id;
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
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
          offset: "00000000-0000-0000-0000-000000000000",
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
