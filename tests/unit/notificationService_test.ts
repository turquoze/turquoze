import { assert } from "../test_deps.ts";
import notificationService from "../../src/services/notificationService/mod.ts";

const notification = new notificationService();

Deno.test("NotificationService", async (t) => {
  await t.step({
    name: "Add + notify",
    fn: () => {
      notification.addListener(callback, "Product.Created");
      notification.notify("Product.Created", { "id": "123test" });
      function callback(event: Event) {
        //@ts-expect-error not on type
        const { id } = event.detail;
        if (event.type == "Product.Created" && id == "123test") {
          assert(true);
        } else {
          assert(false);
        }
      }
    },
  });
});
