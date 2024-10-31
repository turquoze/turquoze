import { assert } from "../test_deps.ts";
import shopService from "../../src/services/shopService/mod.ts";
import { dbClient } from "../test_utils.ts";

const region = new shopService(dbClient);
let ID = "";

Deno.test("ShopService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const shop = await region.Create({
          data: {
            publicId: "",
            currency: "EUR",
            name: "TEST",
            regions: ["SE"],
            searchIndex: "test",
            secret: "test",
            url: "https://example.com",
            settings: {
              meilisearch: {
                api_key: "",
                host: "",
                index: "",
              },
            },
          },
        });

        ID = shop.publicId!;
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
    name: "Create - Fail",
    fn: async () => {
      try {
        await region.Create({
          data: {
            publicId: "",
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
    name: "Get",
    fn: async () => {
      const data = await region.Get({
        id: ID,
      });

      assert(data);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await region.Get({
          id: "00000000-0000-0000-0000-000000000000",
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
    name: "Update",
    fn: async () => {
      try {
        const data = await region.Update({
          data: {
            publicId: ID,
            currency: "EUR",
            name: "TEST-Update",
            regions: ["SE"],
            searchIndex: "test",
            secret: "test",
            url: "https://example.com",
            settings: {
              meilisearch: {
                api_key: "",
                host: "",
                index: "",
              },
            },
            shippingId: "",
          },
        });

        ID = data.publicId!;
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
    name: "Update - Fail",
    fn: async () => {
      try {
        await region.Update({
          data: {
            publicId: "00000000-0000-0000-0000-000000000000",
            currency: "EUR",
            name: "TEST-Update",
            regions: ["SE"],
            searchIndex: "test",
            secret: "test",
            url: "https://example.com",
            settings: {
              meilisearch: {
                api_key: "",
                host: "",
                index: "",
              },
            },
            shippingId: "",
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
    name: "Delete",
    fn: async () => {
      try {
        await region.Delete({
          id: ID,
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
    name: "Delete - Fail",
    fn: async () => {
      try {
        await region.Delete({
          id: "00000000-0000-0000-0000-000000000000",
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
