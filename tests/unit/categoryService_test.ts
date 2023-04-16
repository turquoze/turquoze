import { assert, assertObjectMatch } from "../test_deps.ts";
import categoryService from "../../src/services/categoryService/mod.ts";
import { pool as client } from "../test_utils.ts";

const category = new categoryService(client);
let ID = "";

Deno.test("CategoryService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await category.Create({
          data: {
            id: 0,
            public_id: "",
            name: "test",
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
        await category.Get({
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
    name: "Get By Name",
    fn: async () => {
      const data = await category.GetByName({
        name: "test",
      });
      assertObjectMatch(data, {
        id: data.id,
        public_id: ID,
        name: "test",
        shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
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
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
        await category.Update({
          data: {
            id: 0,
            public_id: "00000000-0000-0000-0000-000000000000",
            name: "test update",
            shop: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
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
      const data = await category.GetMany({});
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
        await category.GetMany({
          offset: "00000000-0000-0000-0000-000000000000",
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
        await category.Delete({
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
        await category.Delete({
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
