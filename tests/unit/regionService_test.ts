import { assert, assertObjectMatch } from "../test_deps.ts";
import regionService from "../../src/services/regionService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const region = new regionService(client);
let ID = "";

Deno.test("RegionService", async (t) => {
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
          },
        });

        ID = data.public_id;
        assert(true);
      } catch {
        assert(false);
      }
    },
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
  });

  await t.step({
    name: "Get",
    fn: async () => {
      const data = await region.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        currency: "EUR",
        name: "TEST",
        regions: ["SE", "NO", "DK", "FI"],
      });
    },
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
          },
        });

        ID = data.public_id;
        assert(true);
      } catch {
        assert(false);
      }
    },
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
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
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
  });
});
