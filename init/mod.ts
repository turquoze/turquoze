import Container from "../src/services/mod.ts";
import { faker } from "@faker-js/faker";
import { Category, DBProduct as Product } from "../src/utils/validator.ts";
import { drizzle, postgres } from "../src/deps.ts";

const DATABASE_URL = Deno.env.get("TEST_DATABASE_URL")!;

const client = postgres(DATABASE_URL!);
//@ts-ignore test
export const dbClient = drizzle(client);

const container = new Container(dbClient);

console.log("Start - Demo init");

try {
  console.log("Creating Shop");
  const { publicId } = await container.ShopService.Create({
    data: {
      name: "Demo - Store",
      regions: ["SE"],
      url: "https://shop.example.com",
      shippingId: "",
      paymentId: undefined,
      currency: "SEK",
      secret: "",
      settings: {
        meilisearch: {
          api_key: "",
          host: "https://example.com",
          index: "products",
        },
      },
      searchIndex: "",
      id: 0,
      publicId: crypto.randomUUID(),
    },
  });

  const categoryArr: Array<Category> = [];
  const productArr: Array<Product> = [];

  for (let index = 0; index < 10; index++) {
    categoryArr.push(GenerateCategory(publicId!));
  }

  const categoryPromises = categoryArr.map((category) => {
    return container.CategoryService.Create({
      data: category,
    });
  });

  console.log("Creating Categories");
  const categories = await Promise.all(categoryPromises);

  for (let index = 0; index < 1000; index++) {
    productArr.push(GenerateProduct(publicId!));
  }

  const productPromises = productArr.map((product): Promise<Product>  => {
    return container.ProductService.Create({
      data: product,
    });
  });

  console.log("Creating Products");
  const products: Array<Product> = await Promise.all(productPromises);

  const warehouse = await container.WarehouseService.Create({
    data: {
      address: faker.address.streetAddress(),
      country: faker.address.countryCode("alpha-2"),
      name: faker.address.cityName(),
      shop: publicId!,
      publicId: "",
    },
  });

  const inventoryPromises = products.map((product) => {
    return GenerateInventoryItem(
      warehouse.publicId!,
      product.publicId!,
      faker.datatype.number({ max: 800 }),
    );
  });

  console.log("Creating Inventory");
  await Promise.all(inventoryPromises);

  const pricePromises = products.map((product) => {
    return GeneratePricItem(
      publicId!,
      product.publicId!,
    );
  });

  console.log("Creating Prices");
  await Promise.all(pricePromises);

  const chunkSize = Math.ceil(products.length / categories.length);
  const result: Array<Array<{ publicId: string }>> = products.reduce(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    },
    [],
  );

  const categoryLinkPromises = result.map((arr, i) => {
    return arr.map((product) => {
      return GenerateCategoryLink(product.publicId, categories[i].publicId!);
    });
  });

  console.log("Creating CategoryLinks");
  await Promise.all(categoryLinkPromises);
} catch (error) {
  console.warn(error);
} finally {
  console.log("End - Demo init");
}

async function GenerateCategoryLink(product: string, category: string) {
  await container.CategoryLinkService.Link({
    data: {
      product,
      category,
    },
  });
}

async function GenerateInventoryItem(
  warehouse: string,
  product: string,
  quantity: number,
) {
  await container.InventoryService.Create({
    data: {
      publicId: "",
      product: product,
      warehouse: warehouse,
      quantity: quantity,
    },
  });
}

function GenerateCategory(shop: string): Category {
  return {
    publicId: "",
    name: `${faker.commerce.department()} - ${faker.commerce.productName()}`,
    shop: shop,
  };
}

function GenerateProduct(shop: string): Product {
  return {
    active: true,
    images: ["https://placehold.co/800x600/webp"],
    longDescription: faker.commerce.productDescription(),
    shop: shop,
    slug: faker.lorem.slug(),
    shortDescription: faker.commerce.productDescription().slice(0, 20),
    title: faker.commerce.productName(),
  };
}

async function GeneratePricItem(
  shop: string,
  product: string,
) {
  await container.PriceService.Create({
    data: {
      product: product,
      shop: shop,
      amount: parseInt(faker.commerce.price(10000, 205000, 0, "")),
    },
  });
}
