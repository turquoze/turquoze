import { assert, assertObjectMatch } from "../test_deps.ts";
import productService from "../../src/services/productService/mod.ts";
import { dbClient, SHOP_ID } from "../test_utils.ts";
import { products } from "../../src/utils/schema.ts";
import { eq } from "../../src/deps.ts";

const product = new productService(dbClient);
let ID = "";
const SLUG = "test2";

Deno.test("ProductService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Create",
    fn: async () => {
      try {
        const data = await product.Create({
          data: {
            publicId: "",
            active: true,
            images: [],
            title: "test product",
            shortDescription: "test product",
            longDescription: "test product long",
            shop: SHOP_ID,
            slug: "test2",
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
        await product.Create({
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
      const data = await product.Get({
        id: ID,
      });

      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        createdAt: data.createdAt,
        active: true,
        images: [],
        title: "test product",
        shortDescription: "test product",
        longDescription: "test product long",
        shop: SHOP_ID,
        slug: "test2",
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
        await product.Get({
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
    name: "Get By Slug",
    fn: async () => {
      const data = await product.GetBySlug({
        slug: SLUG,
      });
      assertObjectMatch(data, {
        id: data.id,
        publicId: ID,
        createdAt: data.createdAt,
        active: true,
        images: [],
        title: "test product",
        shortDescription: "test product",
        longDescription: "test product long",
        shop: SHOP_ID,
        slug: "test2",
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Get By Slug - Fail",
    fn: async () => {
      try {
        await product.GetBySlug({
          slug: "123",
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
        const data = await product.Update({
          data: {
            publicId: ID,
            active: true,
            images: "",
            title: "test product update",
            shortDescription: "test product update",
            longDescription: "test product long update",
            shop: SHOP_ID,
            slug: "test2",
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
        await product.Update({
          data: {
            publicId: "00000000-0000-0000-0000-000000000000",
            active: true,
            images: "",
            title: "test product update",
            shortDescription: "test product update",
            longDescription: "test product long update",
            shop: SHOP_ID,
            slug: "test2",
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
      const data = await product.GetMany({
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
        await product.GetMany({
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
        await product.Delete({
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
        await product.Delete({
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

  await dbClient.delete(products).where(eq(products.publicId, ID));
});
