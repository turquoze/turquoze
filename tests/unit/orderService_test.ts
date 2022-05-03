import { assert, assertObjectMatch } from "../test_deps.ts";
import orderService from "../../src/services/orderService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const order = new orderService(client);
let ID = "";

Deno.test("OrderService", async (t) => {
  await t.step({
    name: "Create",
    ignore: true,
    fn: async () => {
      try {
        const data = await order.Create({
          data: {
            id: "",
            payment: {
              status: "WAITING",
            },
            price: {
              total: 0,
              subtotal: 0,
            },
            created_at: 0,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
        await order.Create({
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
    ignore: true,
    fn: async () => {
      const data = await order.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: ID,
        payment: {
          status: "WAITING",
        },
        price: {
          total: 0,
          subtotal: 0,
        },
        created_at: 0,
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
      });
    },
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
  });

  await t.step({
    name: "GetMany",
    ignore: true,
    fn: async () => {
      const data = await order.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await order.GetMany({
          offset: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
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
  });
});
