import { assert } from "../test_deps.ts";
import userService from "../../src/services/userService/mod.ts";
import { pool as client } from "../test_utils.ts";

const user = new userService(client);
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
    name: "Create",
    fn: async () => {
      try {
        const data = await user.Create({
          data: {
            id: 0,
            public_id: "",
            email: "test@example.com",
            password: "test123",
            name: "test",
            not_active: false,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
            role: "",
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
    name: "Login",
    fn: async () => {
      const data = await user.Login({
        email: "test@example.com",
        password: "test123",
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
          shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
            id: 0,
            public_id: ID,
            email: "test+test123@example.com",
            password: "",
            name: "test update",
            not_active: true,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
            role: "",
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
        await user.Update({
          data: {
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            email: "test+fail@example.com",
            password: "",
            name: "test fail",
            not_active: true,
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
            role: "",
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
    name: "GetMany",
    fn: async () => {
      const data = await user.GetMany({
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
          offset: "00000000-0000-0000-0000-000000000000",
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
