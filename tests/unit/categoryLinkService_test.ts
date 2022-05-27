import { assert } from "../test_deps.ts";
import categoryLinkService from "../../src/services/categoryLinkService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const categoryLink = new categoryLinkService(client);

Deno.test("CategoryLinkService", async (t) => {
  await t.step({
    name: "Link",
    fn: async () => {
      try {
        await categoryLink.Link({
          data: {
            category: "05820ab4-6661-4fba-95ab-b5ca40b43da5",
            product: "00669ffc-bc13-47b1-aec6-f524611a657f",
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
    ignore: true,
    fn: async () => {
      try {
        const data = await categoryLink.GetProducts({
          id: "05820ab4-6661-4fba-95ab-b5ca40b43da5",
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
            category: "05820ab4-6661-4fba-95ab-b5ca40b43da5",
            product: "00669ffc-bc13-47b1-aec6-f524611a657f",
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
