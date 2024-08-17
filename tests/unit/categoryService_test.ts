import { assert, assertObjectMatch } from "../test_deps.ts";
import categoryService from "../../src/services/categoryService/mod.ts";
import { dbClient } from "../test_utils.ts";
import { SHOP_ID } from "../test_utils.ts";
import { categories } from "../../src/utils/schema.ts";
import { eq } from "../../src/deps.ts";

const category = new categoryService(dbClient);
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
            publicId: "",
            name: "test",
            shop: SHOP_ID,
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
    name: "Create - Fail",
    fn: async () => {
      try {
        await category.Create({
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
    name: "Get",
    fn: async () => {
      const data = await category.Get({
        id: ID,
      });
      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        name: "test",
        shop: SHOP_ID,
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
        shop: SHOP_ID,
      });

      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        name: "test",
        shop: SHOP_ID,
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
    name: "Update",
    fn: async () => {
      try {
        const data = await category.Update({
          data: {
            publicId: ID,
            name: "test update",
            shop: SHOP_ID,
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
    name: "Update - Fail",
    fn: async () => {
      try {
        await category.Update({
          data: {
            publicId: "00000000-0000-0000-0000-000000000000",
            name: "test update",
            shop: SHOP_ID,
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
      const data = await category.GetMany({
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
        await category.GetMany({
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

  //@ts-expect-error not on type
  await dbClient.delete(categories).where(eq(categories.publicId, ID));
});
