import container from "../src/services/mod.ts";
import { faker } from "npm:@faker-js/faker";
import { Category, Product } from "../src/utils/types.ts";

const { public_id } = await container.ShopService.Create({
  data: {
    name: "Demo - Store",
    regions: ["SE"],
    url: "https://shop.example.com",
    shipping_id: "",
    payment_id: "",
    currency: "SEK",
    secret: "",
    settings: {
      meilisearch: {
        api_key: "",
        host: "",
        index: "",
      },
    },
    search_index: "",
    id: 0,
    public_id: "",
    _role: "WEBSITE",
    _signKey: new Uint8Array(),
  },
});

const categories: Array<string> = [];
const products: Array<string> = [];

for (let index = 0; index < 10; index++) {
  const category = GenerateCategory();
  const categoryCreated = await container.CategoryService.Create({
    data: category,
  });

  categories.push(categoryCreated.public_id);
}

for (let index = 0; index < 100; index++) {
  const product = GenerateProduct();
  const productCreated = await container.ProductService.Create({
    data: product,
  });

  products.push(productCreated.public_id!);
}

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

for (const product in products) {
  await GenerateInventoryItem(
    warehouse.public_id,
    product,
    faker.datatype.number({ max: 800 }),
  );
}

const chunkSize = 10;
for (let i = 0; i < products.length; i += chunkSize) {
  const chunk = products.slice(i, i + chunkSize);

  for (const product in chunk) {
    await GenerateCategoryLink(product, categories[i / chunkSize]);
  }
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

function GenerateCategory(): Category {
  return {
    id: 0,
    public_id: "",
    name: faker.commerce.department(),
    shop: public_id,
  };
}

function GenerateProduct(): Product {
  return {
    id: 0,
    active: true,
    images: [faker.image.fashion()],
    long_description: faker.commerce.productDescription(),
    shop: public_id,
    slug: faker.lorem.slug(),
    short_description: faker.commerce.productDescription().slice(0, 20),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(10000, 99999900, 0, "")),
  };
}
