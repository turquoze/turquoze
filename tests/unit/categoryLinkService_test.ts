import { assert } from "../test_deps.ts";
import categoryLinkService from "../../src/services/categoryLinkService/mod.ts";
import client from "../../src/services/dataClient/client.ts";
import cacheService from "../../src/services/cacheService/mod.ts";

const cache = new cacheService();

const categoryLink = new categoryLinkService(client, cache);

Deno.test("CategoryLinkService", async (t) => {
  await t.step({
    name: "Link",
    fn: async () => {
      try {
        await categoryLink.Link({
          data: {
            category: "1c38d54e-4dad-46df-bf12-3a3743af5104",
            product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Get Products",
    fn: async () => {
      try {
        const data = await categoryLink.GetProducts({
          id: "1c38d54e-4dad-46df-bf12-3a3743af5104",
        });

        assert(data.length > 0);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await categoryLink.Delete({
          data: {
            category: "1c38d54e-4dad-46df-bf12-3a3743af5104",
            product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
          },
        });

        assert(true);
      } catch {
        assert(false);
      }
    },
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
  });
});
