import { assert } from "../../deps.ts";
import paymentService from "./mod.ts";
import client from "../dataClient/client.ts";
import DefaultOrderService from "../orderService/mod.ts";
import DefaultCartService from "../cartService/mod.ts";

const payment = new paymentService(
  client,
  new DefaultCartService(client),
  new DefaultOrderService(client),
);
let ID = "";

Deno.test("PaymentService", async (t) => {
  await t.step({
    name: "Create",
    ignore: true,
    fn: async () => {
      try {
        const data = await payment.Create({
          data: {
            cartId: "",
            id: "",
            customerId: "",
            info: {
              country: "",
              data: {},
              type: "PERSONAL",
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
    name: "Validate",
    ignore: true,
    fn: async () => {
      try {
        await payment.Validate({
          data: {
            orderId: ID,
            status: "PAYED",
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });
});
