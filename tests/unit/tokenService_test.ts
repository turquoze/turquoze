import { assert, assertObjectMatch } from "../test_deps.ts";
import tokenService from "../../src/services/tokenService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const token = new tokenService(client);
let ID = "";

Deno.test("TokenService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await token.Create({
          data: {
            name: "Test - 123",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
            token: "test12345",
            expire: null,
          },
        });

        ID = data.token;
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
        await token.Create({
          // @ts-expect-error want to test
          data: {
            region: "00000000-0000-0000-0000-000000000000",
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
      const data = await token.Get({
        token: ID,
      });
      assertObjectMatch(data, {
        name: "Test - 123",
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
        token: ID,
        expire: null,
      });
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await token.Get({
          token: "00000000-0000-0000-0000-000000000000",
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
        await token.Delete({
          token: ID,
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
        await token.Delete({
          token: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
