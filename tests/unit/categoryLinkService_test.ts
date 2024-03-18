import { assert } from "../test_deps.ts";
import categoryLinkService from "../../src/services/categoryLinkService/mod.ts";
import { CATEGORY_ID, dbClient } from "../test_utils.ts";
import { PRODUCT_ID } from "../test_utils.ts";

const categoryLink = new categoryLinkService(dbClient);

Deno.test("CategoryLinkService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Link",
    fn: async () => {
      try {
        await categoryLink.Link({
          data: {
            category: CATEGORY_ID,
            product: PRODUCT_ID,
          },
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

  await t.step({
    name: "Get Products",
    ignore: true,
    fn: async () => {
      try {
        const data = await categoryLink.GetProducts({
          id: CATEGORY_ID,
        });

        assert(data.length > 0);
      } catch {
        assert(false);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await categoryLink.Delete({
          data: {
            category: CATEGORY_ID,
            product: PRODUCT_ID,
          },
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

  await t.step({
    name: "Link - Fail",
    fn: async () => {
      try {
        await categoryLink.Link({
          data: {
            category: "00000000-0000-0000-0000-000000000000",
            product: "00000000-0000-0000-0000-000000000000",
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
    name: "Delete - Fail",
    fn: async () => {
      try {
        await categoryLink.Delete({
          data: {
            category: "00000000-0000-0000-0000-000000000000",
            product: "00000000-0000-0000-0000-000000000000",
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
});
