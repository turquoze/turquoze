import { assert, assertEquals } from "../test_deps.ts";

import OrdersRoutes from "../../src/routes/admin/orders.ts";
import app from "../test_app.ts";
import { Order } from "../../src/utils/schema.ts";

let ID = "";

app.use(new OrdersRoutes(app.state.container).routes());

Deno.test({
  name: "Orders - Get Many | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/orders`, {
        method: "Get",
      }),
    );

    assert(response?.ok);

    const { orders }: { orders: Array<Order> } = await response?.json();
    if (orders.length > 0) {
      ID = orders[0].publicId!;
    }
  },
});

Deno.test({
  name: "Orders - Get | ok",
  ignore: ID == "" || ID == undefined || ID == null ? true : false,
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/orders/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { orders }: { orders: Order } = await response?.json();
    assertEquals(orders.publicId, ID);
  },
});
