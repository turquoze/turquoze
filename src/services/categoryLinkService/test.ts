import { assert } from "../../deps.ts";
import categoryLinkService from "./mod.ts";
import client from "../dataClient/client.ts";

const categoryLink = new categoryLinkService(client);
let CATEGORY = "";
let PRODUCT = "";

Deno.test("CategoryLinkService", async (t) => {
  await t.step({
    name: "Link",
    ignore: true,
    fn: async () => {
      try {
        const data = await categoryLink.Link({
          data: {
            category: "",
            product: "",
          },
        });

        CATEGORY = data.category;
        PRODUCT = data.product;
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Delete",
    ignore: true,
    fn: async () => {
      try {
        await categoryLink.Delete({
          data: {
            category: CATEGORY,
            product: PRODUCT,
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });
});
