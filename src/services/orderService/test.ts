import { assert, assertObjectMatch } from "../../deps.ts";
import orderService from "./mod.ts";
import client from "../dataClient/client.ts";

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
    name: "GetMany",
    ignore: true,
    fn: async () => {
      const data = await order.GetMany({});
      assert(data.length > 0);
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
