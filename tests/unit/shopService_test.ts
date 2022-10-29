import { assert } from "../test_deps.ts";
import shopService from "../../src/services/shopService/mod.ts";
import { pool as client } from "../test_utils.ts";

const region = new shopService(client);
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
        const data = await region.Create({
          data: {
            id: 0,
            public_id: "",
            currency: "EUR",
            name: "TEST",
            regions: ["SE", "NO", "DK", "FI"],
            payment_id: "StripeCheckout",
            search_index: "test",
            secret: "test",
            url: "https://example.com",
            _signKey: new Uint8Array(),
            settings: {
              meilisearch: {
                api_key: "",
                host: "",
                index: "",
              },
            },
          },
        });

        ID = data.public_id;
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
          // @ts-expect-error want to test
          data: {
            public_id: "",
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
            id: 0,
            public_id: ID,
            currency: "EUR",
            name: "TEST-Update",
            regions: ["SE"],
            payment_id: "StripeCheckout",
            search_index: "test",
            secret: "test",
            url: "https://example.com",
            _signKey: new Uint8Array(),
            settings: {
              meilisearch: {
                api_key: "",
                host: "",
                index: "",
              },
            },
          },
        });

        ID = data.public_id;
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
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            currency: "EUR",
            name: "TEST-Update",
            regions: ["SE"],
            payment_id: "StripeCheckout",
            search_index: "test",
            secret: "test",
            url: "https://example.com",
            _signKey: new Uint8Array(),
            settings: {
              meilisearch: {
                api_key: "",
                host: "",
                index: "",
              },
            },
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
