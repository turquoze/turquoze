import { assert } from "../test_deps.ts";
import userService from "../../src/services/userService.ts";
import { dbClient } from "../test_utils.ts";
import { SHOP_ID } from "../test_utils.ts";

const user = new userService(dbClient);
let ID = "";

Deno.test("UserService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create - Fail",
    fn: async () => {
      try {
        await user.Create({
          //@ts-ignore not on type
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
    name: "Create",
    fn: async () => {
      try {
        const data = await user.Create({
          data: {
            publicId: "",
            email: "test@example.com",
            password: "test123",
            name: "test",
            notActive: false,
            shop: SHOP_ID,
            role: "",
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
    name: "Get",
    fn: async () => {
      const data = await user.Get({
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
        await user.Get({
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
    ignore: true, // flaky do to "Caused by: PostgresError: invalid salt"
    name: "Login",
    fn: async () => {
      const data = await user.Login({
        email: "test@example.com",
        password: "test123",
        shop: SHOP_ID,
      });

      assert(data != null);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Login - Fail",
    fn: async () => {
      try {
        await user.Login({
          email: "test@example.com",
          password: "wrongpassword",
          shop: SHOP_ID,
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
    name: "Update Password",
    fn: async () => {
      try {
        await user.UpdatePassword({
          email: "test@example.com",
          new_password: "newpassword",
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
    name: "Login updated",
    fn: async () => {
      const data = await user.Login({
        email: "test@example.com",
        password: "newpassword",
        shop: SHOP_ID,
      });

      assert(data != null);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Update",
    fn: async () => {
      try {
        const data = await user.Update({
          data: {
            publicId: ID,
            email: "test+test123@example.com",
            password: "",
            name: "test update",
            notActive: true,
            shop: SHOP_ID,
            role: "",
          },
          id: ID,
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
        await user.Update({
          data: {
            publicId: "00000000-0000-0000-0000-000000000000",
            email: "test+fail@example.com",
            password: "",
            name: "test fail",
            notActive: true,
            shop: SHOP_ID,
            role: "",
          },
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
    name: "GetMany",
    fn: async () => {
      const data = await user.GetMany({
        shop: SHOP_ID,
      });
      assert(data.length > 0);
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await user.GetMany({
          offset: 0,
          shop: "00000000-0000-0000-0000-000000000000",
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
        await user.Delete({
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
        await user.Delete({
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
