import { Container } from "../src/services/mod.ts";
import { faker } from "npm:@faker-js/faker";
import { Category, Product } from "../src/utils/types.ts";
import { postgres } from "../src/deps.ts";

const hostname = Deno.env.get("TEST_DATABASE_HOSTNAME")!;
const password = Deno.env.get("TEST_DATABASE_PASSWORD")!;
const database = Deno.env.get("TEST_DATABASE")!;
const username = Deno.env.get("TEST_DATABASE_USER")!;
const port = Deno.env.get("TEST_DATABASE_PORT")!;

const pool = new postgres.Pool(
  {
    hostname: hostname,
    password: password,
    database: database,
    user: username,
    port: port,
    tls: {
      enabled: false,
      enforce: false,
    },
  },
  3,
);
const container = new Container(pool);

console.log("Start - Demo init");

try {
  console.log("Creating Shop");
  const { public_id } = await container.ShopService.Create({
    data: {
      name: "Demo - Store",
      regions: ["SE"],
      url: "https://shop.example.com",
      shipping_id: "",
      payment_id: undefined,
      currency: "SEK",
      secret: "",
      settings: {
        meilisearch: {
          api_key: "",
          host: "https://example.com",
          index: "products",
        },
      },
      search_index: "",
      id: 0,
      public_id: crypto.randomUUID(),
      _role: "WEBSITE",
      _signKey: new Uint8Array(),
    },
  });

  const categoryArr: Array<Category> = [];
  const productArr: Array<Product> = [];

  for (let index = 0; index < 10; index++) {
    categoryArr.push(GenerateCategory(public_id));
  }

  const categoryPromises = categoryArr.map((category) => {
    return container.CategoryService.Create({
      data: category,
    });
  });

  console.log("Creating Categories");
  const categories = await Promise.all(categoryPromises);

  for (let index = 0; index < 100; index++) {
    productArr.push(GenerateProduct(public_id));
  }

  const productPromises = productArr.map((product) => {
    return container.ProductService.Create({
      data: product,
    });
  });

  console.log("Creating Products");
  const products = await Promise.all(productPromises);

  const warehouse = await container.WarehouseService.Create({
    data: {
      address: faker.address.streetAddress(),
      country: faker.address.countryCode("alpha-2"),
      name: faker.address.cityName(),
      shop: public_id,
      id: 0,
      public_id: "",
    },
  });

  const inventoryPromises = products.map((product) => {
    return GenerateInventoryItem(
      warehouse.public_id,
      product.public_id!,
      faker.datatype.number({ max: 800 }),
    );
  });

  console.log("Creating Inventory");
  await Promise.all(inventoryPromises);

  const chunkSize = 10;
  const result: Array<Array<{ public_id: string }>> = products.reduce(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);

      if (!resultArray[chunkIndex]) {
        //@ts-expect-error err
        resultArray[chunkIndex] = []; // start a new chunk
      }

      //@ts-expect-error err
      resultArray[chunkIndex].push(item);

      return resultArray;
    },
    [],
  );

  const categoryLinkPromises = result.map((arr, i) => {
    return arr.map((product) => {
      return GenerateCategoryLink(product.public_id, categories[i].public_id);
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
      id: 0,
      public_id: "",
      product: product,
      warehouse: warehouse,
      quantity: quantity,
    },
  });
}

function GenerateCategory(shop: string): Category {
  return {
    id: 0,
    public_id: "",
    name: `${faker.commerce.department()} - ${faker.commerce.productName()}`,
    shop: shop,
  };
}

function GenerateProduct(shop: string): Product {
  return {
    id: 0,
    active: true,
    images: [faker.image.fashion()],
    long_description: faker.commerce.productDescription(),
    shop: shop,
    slug: faker.lorem.slug(),
    short_description: faker.commerce.productDescription().slice(0, 20),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(10000, 99999900, 0, "")),
  };
}
