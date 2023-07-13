import { assert, assertEquals } from "../test_deps.ts";
import notificationService from "../../src/services/notificationService/mod.ts";
import { TurquozeEvent } from "../../src/utils/types.ts";

const notification = new notificationService();
let ID = "";

Deno.test("NotificationService", async (t) => {
  await t.step({
    name: "Add + notify",
    fn: () => {
      ID = notification.add(["Product.Created"], onEvent, "test123");

      notification.notify("Product.Created", "123test");

      function onEvent(event: TurquozeEvent, id: string) {
        if (event == "Product.Created" && id == "123test") {
          assert(true);
        } else {
          assert(false);
        }
      }
    },
  });

  await t.step({
    name: "One listener",
    fn: () => {
      assertEquals(notification.notifyListeners.size, 1);
    },
  });

  await t.step({
    name: "Remove",
    fn: () => {
      notification.remove(ID);
    },
  });

  await t.step({
    name: "Zero listener",
    fn: () => {
      assertEquals(notification.notifyListeners.size, 0);
    },
  });
});
