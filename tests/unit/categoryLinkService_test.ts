import { assert } from "../test_deps.ts";
import categoryLinkService from "../../src/services/categoryLinkService/mod.ts";
import { pool as client } from "../test_utils.ts";

const categoryLink = new categoryLinkService(client);

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
            category: "c150e5b3-c203-46a3-8f87-56af2c220bfe",
            product: "d72f032b-b91b-4dbf-811c-a01ab0938358",
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
          id: "c150e5b3-c203-46a3-8f87-56af2c220bfe",
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
            category: "c150e5b3-c203-46a3-8f87-56af2c220bfe",
            product: "d72f032b-b91b-4dbf-811c-a01ab0938358",
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
