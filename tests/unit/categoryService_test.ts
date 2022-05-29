import { assert, assertObjectMatch } from "../test_deps.ts";
import categoryService from "../../src/services/categoryService/mod.ts";
import client from "../../src/services/dataClient/client.ts";

const category = new categoryService(client);
let ID = "";

Deno.test("CategoryService", async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await category.Create({
          data: {
            id: 0,
            public_id: "",
            name: "test",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
        await category.Create({
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
      const data = await category.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        name: "test",
        shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
      });
    },
  });

  await t.step({
    name: "Get - Fail",
    fn: async () => {
      try {
        await category.Get({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Get By Name",
    fn: async () => {
      const data = await category.GetByName({
        name: "test",
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        name: "test",
        shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
      });
    },
  });

  await t.step({
    name: "Get By Name - Fail",
    fn: async () => {
      try {
        await category.GetByName({
          name: "",
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
        const data = await category.Update({
          data: {
            id: 0,
            public_id: ID,
            name: "test update",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
        await category.Update({
          data: {
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            name: "test update",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
      const data = await category.GetMany({});
      assert(data.length > 0);
    },
  });

  await t.step({
    name: "GetMany - Fail",
    fn: async () => {
      try {
        await category.GetMany({
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
        await category.Delete({
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
        await category.Delete({
          id: "00000000-0000-0000-0000-000000000000",
        });
        assert(false);
      } catch {
        assert(true);
      }
    },
  });
});
