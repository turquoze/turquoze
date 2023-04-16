import { assert, assertObjectMatch } from "../test_deps.ts";
import tokenService from "../../src/services/tokenService/mod.ts";
import { pool as client } from "../test_utils.ts";

const token = new tokenService(client);
let ID = "";

Deno.test("TokenService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await token.Create({
          data: {
            name: "Test - 123",
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
            id: "test12345",
            secret: "test",
            role: "WEBSITE",
          },
        });

        ID = data.id;
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
        await token.Create({
          // @ts-expect-error want to test
          data: {
            shop: "00000000-0000-0000-0000-000000000000",
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
      const data = await token.Get({
        tokenId: ID,
      });
      assertObjectMatch(data, {
        name: "Test - 123",
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
        secret: data.secret,
        id: "test12345",
        role: "WEBSITE",
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await token.Get({
          tokenId: "00000000-0000-0000-0000-000000000000",
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
        await token.Delete({
          tokenId: ID,
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
        await token.Delete({
          tokenId: "00000000-0000-0000-0000-000000000000",
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
