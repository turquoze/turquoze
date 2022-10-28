import DefaultProductService from "./productService/mod.ts";
import DefaultCartService from "./cartService/mod.ts";
import DefaultOrderService from "./orderService/mod.ts";
import DefaultCategoryService from "./categoryService/mod.ts";
import DefaultCategoryLinkService from "./categoryLinkService/mod.ts";
import DefaultShopService from "./shopService/mod.ts";
import DefaultPaymentService from "./paymentService/mod.ts";
import DefaultCacheService from "./cacheService/mod.ts";
import DefaultDiscountService from "./discountService/mod.ts";
import DefaultSearchService from "./searchService/mod.ts";
import DefaultWarehouseService from "./warehouseService/mod.ts";
import DefaultInventoryService from "./inventoryService/mod.ts";
import DefaultPriceService from "./priceService/mod.ts";
import DefaultUserService from "./userService/mod.ts";
import DefaultTokenService from "./tokenService/mod.ts";
import DefaultNotificationService from "./notificationService/mod.ts";
import DefaultPluginService from "./pluginService/mod.ts";
import DefaultPluginDataService from "./pluginDataService/mod.ts";

import IProductService from "./interfaces/productService.ts";
import ICartService from "./interfaces/cartService.ts";
import IOrderService from "./interfaces/orderService.ts";
import ICategoryService from "./interfaces/categoryService.ts";
import ICategoryLinkService from "./interfaces/categoryLinkService.ts";
import IShopService from "./interfaces/shopService.ts";
import IPaymentService from "./interfaces/paymentService.ts";
import ICacheService from "./interfaces/cacheService.ts";
import IDiscountService from "./interfaces/discountService.ts";
import ISearchService from "./interfaces/searchService.ts";
import IWarehouseService from "./interfaces/warehouseService.ts";
import IInventoryService from "./interfaces/inventoryService.ts";
import IPriceService from "./interfaces/priceService.ts";
import IUserService from "./interfaces/userService.ts";
import ITokenService from "./interfaces/tokenService.ts";
import INotificationService from "./interfaces/notificationService.ts";
import IPluginService from "./interfaces/pluginService.ts";
import IPluginDataService from "./interfaces/pluginDataService.ts";

import dbClient from "../clients/db.ts";
import searchClient from "../clients/search.ts";
import redisClient from "../clients/redis.ts";
import { Shop } from "../utils/types.ts";

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
  TokenService: ITokenService = new DefaultTokenService(
    dbClient,
  );
  NotificationService: INotificationService = new DefaultNotificationService();
  Shop: Shop = {
    id: 0,
    public_id: "",
    regions: [],
    payment_id: "",
    currency: "",
    name: "",
    url: "",
    search_index: "",
    secret: "",
    settings: {
      meilisearch: {
        api_key: "",
        host: "",
        index: "",
      },
    },
    _signKey: new Uint8Array(),
  };
}

const container = new Container();
export default container;
