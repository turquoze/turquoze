import { assert, assertObjectMatch } from "../../deps.ts";
import regionService from "./mod.ts";
import client from "../dataClient/client.ts";

const region = new regionService(client);
let ID = "";

Deno.test("RegionService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await region.Create({
          data: {
            id: "",
            currency: "EUR",
            name: "TEST",
            regions: ["SE", "NO", "DK", "FI"],
          },
        });

        ID = data.id;
        assert(true);
      } catch {
        assert(false);
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
        id: ID,
        currency: "EUR",
        name: "TEST",
        regions: ["SE", "NO", "DK", "FI"],
      });
    },
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await region.Update({
          data: {
            id: ID,
            currency: "EUR",
            name: "TEST-Update",
            regions: ["SE"],
          },
        });

        ID = data.id;
        assert(true);
      } catch {
        assert(false);
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
});
