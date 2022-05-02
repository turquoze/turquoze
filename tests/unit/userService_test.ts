import { assert, assertObjectMatch } from "../test_deps.ts";
import userService from "../../src/services/userService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const user = new userService(client);
let ID = "";

Deno.test("UserService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await user.Create({
          data: {
            id: "",
            system_id: "",
            email: "test@example.com",
            name: "test",
            not_active: false,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        ID = data.system_id;
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
        await user.Create({
          // @ts-expect-error want to test
          data: {
            id: "",
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
      const data = await user.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        system_id: ID,
        created_at: data.created_at,
        email: "test@example.com",
        name: "test",
        not_active: false,
        region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
      });
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await user.Get({
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
        const data = await user.Update({
          data: {
            id: "",
            system_id: ID,
            email: "test+test123@example.com",
            name: "test update",
            not_active: true,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        ID = data.system_id;
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
        await user.Update({
          data: {
            id: "00000000-0000-0000-0000-000000000000",
            system_id: "00000000-0000-0000-0000-000000000000",
            email: "test+fail@example.com",
            name: "test fail",
            not_active: true,
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "GetMany",
    fn: async () => {
      const data = await user.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await user.GetMany({
          offset: "00000000-0000-0000-0000-000000000000",
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
        await user.Delete({
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
        await user.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
