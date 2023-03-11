import DefaultProductService from "../src/services/productService/mod.ts";
import DefaultCartService from "../src/services/cartService/mod.ts";
import DefaultOrderService from "../src/services/orderService/mod.ts";
import DefaultCategoryService from "../src/services/categoryService/mod.ts";
import DefaultCategoryLinkService from "../src/services/categoryLinkService/mod.ts";
import DefaultShopService from "../src/services/shopService/mod.ts";
import DefaultPaymentService from "../src/services/paymentService/mod.ts";
import DefaultCacheService from "../src/services/cacheService/mod.ts";
import DefaultDiscountService from "../src/services/discountService/mod.ts";
import DefaultSearchService from "../src/services/searchService/mod.ts";
import DefaultWarehouseService from "../src/services/warehouseService/mod.ts";
import DefaultInventoryService from "../src/services/inventoryService/mod.ts";
import DefaultPriceService from "../src/services/priceService/mod.ts";
import DefaultUserService from "../src/services/userService/mod.ts";
import DefaultTokenService from "../src/services/tokenService/mod.ts";
import DefaultNotificationService from "../src/services/notificationService/mod.ts";
import DefaultPluginService from "../src/services/pluginService/mod.ts";
import DefaultPluginDataService from "../src/services/pluginDataService/mod.ts";
import DefaultSettingsService from "../src/services/settingsService/mod.ts";
import DefaultAdminService from "../src/services/adminService/mod.ts";

import IProductService from "../src/services/interfaces/productService.ts";
import ICartService from "../src/services/interfaces/cartService.ts";
import IOrderService from "../src/services/interfaces/orderService.ts";
import ICategoryService from "../src/services/interfaces/categoryService.ts";
import ICategoryLinkService from "../src/services/interfaces/categoryLinkService.ts";
import IShopService from "../src/services/interfaces/shopService.ts";
import IPaymentService from "../src/services/interfaces/paymentService.ts";
import ICacheService from "../src/services/interfaces/cacheService.ts";
import IDiscountService from "../src/services/interfaces/discountService.ts";
import ISearchService from "../src/services/interfaces/searchService.ts";
import IWarehouseService from "../src/services/interfaces/warehouseService.ts";
import IInventoryService from "../src/services/interfaces/inventoryService.ts";
import IPriceService from "../src/services/interfaces/priceService.ts";
import IUserService from "../src/services/interfaces/userService.ts";
import ITokenService from "../src/services/interfaces/tokenService.ts";
import INotificationService from "../src/services/interfaces/notificationService.ts";
import IPluginService from "../src/services/interfaces/pluginService.ts";
import IPluginDataService from "../src/services/interfaces/pluginDataService.ts";
import ISettingsService from "../src/services/interfaces/settingsService.ts";
import IAdminService from "../src/services/interfaces/adminService.ts";

import { Application } from "./test_deps.ts";
import type { Shop, TurquozeState } from "../src/utils/types.ts";
import {
  pool as dbClient,
  redis as redisClient,
  searchClient,
} from "./test_utils.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "./test_secrets.ts";

export class Container {
  CacheService: ICacheService = new DefaultCacheService(redisClient);
  ProductService: IProductService = new DefaultProductService(
    dbClient,
  );
  CartService: ICartService = new DefaultCartService(dbClient);
  OrderService: IOrderService = new DefaultOrderService(
    dbClient,
  );
  CategoryService: ICategoryService = new DefaultCategoryService(
    dbClient,
  );
  CategoryLinkService: ICategoryLinkService = new DefaultCategoryLinkService(
    dbClient,
  );
  ShopService: IShopService = new DefaultShopService(
    dbClient,
  );
  PluginService: IPluginService = new DefaultPluginService();
  PluginDataService: IPluginDataService = new DefaultPluginDataService(
    dbClient,
  );
  PaymentService: IPaymentService = new DefaultPaymentService(
    dbClient,
    this.CartService,
    this.OrderService,
    this.ProductService,
    this.PluginService,
  );
  DiscountService: IDiscountService = new DefaultDiscountService(
    dbClient,
  );
  SearchService: ISearchService = new DefaultSearchService(searchClient);
  WarehouseService: IWarehouseService = new DefaultWarehouseService(
    dbClient,
  );
  InventoryService: IInventoryService = new DefaultInventoryService(
    dbClient,
  );
  PriceService: IPriceService = new DefaultPriceService(
    dbClient,
  );
  UserService: IUserService = new DefaultUserService(dbClient);
  AdminService: IAdminService = new DefaultAdminService(dbClient);
  TokenService: ITokenService = new DefaultTokenService(
    dbClient,
  );
  NotificationService: INotificationService = new DefaultNotificationService();
  SettingsService: ISettingsService = new DefaultSettingsService(dbClient);
  Shop: Shop = {
    id: 0,
    public_id: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
    regions: ["SE"],
    payment_id: "",
    currency: "SEK",
    name: "test",
    url: "https://example.com",
    search_index: MEILIINDEX!,
    secret: "test",
    _signKey: new Uint8Array(),
    settings: {
      meilisearch: {
        api_key: MEILIAPIKEY!,
        host: MEILIHOST!,
        index: MEILIINDEX!,
      },
    },
    _role: "VIEWER",
    shipping_id: "",
  };
}

const container = new Container();

const app = new Application<TurquozeState>();
app.state.container = container;

app.use(async (ctx, next) => {
  ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
  ctx.state.request_data = {
    id: 0,
    public_id: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
    regions: ["SE"],
    payment_id: "",
    currency: "SEK",
    name: "test",
    url: "https://example.com",
    search_index: MEILIINDEX!,
    secret: "test",
    _signKey: new Uint8Array(),
    settings: {
      meilisearch: {
        api_key: MEILIAPIKEY!,
        host: MEILIHOST!,
        index: MEILIINDEX!,
      },
    },
    _role: "VIEWER",
    shipping_id: "",
  };
  await next();
});

export default app;
