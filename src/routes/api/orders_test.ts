import { Application, assert, assertEquals } from "../../deps.ts";

import OrdersRoutes from "./orders.ts";
import { Order } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Orders - Get Many | ok",
  async fn() {
    const app = new Application();

    app.use(new OrdersRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/orders`, {
        method: "Get",
      }),
    );

    assert(response?.ok);

    const { orders }: { orders: Array<Order> } = await response?.json();
    if (orders.length > 0) {
      ID = orders[0].id;
    }
  },
});

Deno.test({
  name: "Orders - Get | ok",
  ignore: ID == "" || ID == undefined || ID == null ? true : false,
  async fn() {
    const app = new Application();

    app.use(new OrdersRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/orders/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { orders }: { orders: Order } = await response?.json();
    assertEquals(orders.id, ID);
  },
});
