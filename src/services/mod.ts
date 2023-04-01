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
import DefaultSettingsService from "./settingsService/mod.ts";
import DefaultAdminService from "./adminService/mod.ts";
import DefaultShopLinkService from "./shopLinkService/mod.ts";

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
import ISettingsService from "./interfaces/settingsService.ts";
import IAdminService from "./interfaces/adminService.ts";
import IShopLinkService from "./interfaces/shopLinkService.ts";

import dbClient from "../clients/db.ts";
import redisClient from "../clients/redis.ts";
import { Shop } from "../utils/types.ts";
import { postgres, Redis } from "../deps.ts";

export class Container {
  #pool: postgres.Pool;
  #redis: Redis;
  CacheService: ICacheService;
  ProductService: IProductService;
  CartService: ICartService;
  OrderService: IOrderService;
  CategoryService: ICategoryService;
  CategoryLinkService: ICategoryLinkService;
  ShopService: IShopService;
  PluginService: IPluginService;
  PaymentService: IPaymentService;
  DiscountService: IDiscountService;
  SearchService: ISearchService;
  WarehouseService: IWarehouseService;
  InventoryService: IInventoryService;
  PriceService: IPriceService;
  UserService: IUserService;
  AdminService: IAdminService;
  TokenService: ITokenService;
  NotificationService: INotificationService;
  SettingsService: ISettingsService;
  ShopLinkService: IShopLinkService;

  constructor(db?: postgres.Pool, redis?: Redis) {
    if (db == undefined) {
      this.#pool = dbClient;
    } else {
      this.#pool = db;
    }

    if (redis == undefined) {
      this.#redis = redisClient;
    } else {
      this.#redis = redis;
    }

    this.CacheService = new DefaultCacheService(this.#redis);
    this.ProductService = new DefaultProductService(this.#pool);
    this.CartService = new DefaultCartService(this.#pool);
    this.OrderService = new DefaultOrderService(this.#pool);
    this.CategoryService = new DefaultCategoryService(this.#pool);
    this.CategoryLinkService = new DefaultCategoryLinkService(this.#pool);
    this.ShopService = new DefaultShopService(this.#pool);
    this.PluginService = new DefaultPluginService(this.#pool);
    this.PaymentService = new DefaultPaymentService(
      this.#pool,
      this.CartService,
      this.OrderService,
      this.ProductService,
      this.PluginService,
    );
    this.DiscountService = new DefaultDiscountService(this.#pool);
    this.SearchService = new DefaultSearchService();
    this.WarehouseService = new DefaultWarehouseService(this.#pool);
    this.InventoryService = new DefaultInventoryService(this.#pool);
    this.PriceService = new DefaultPriceService(this.#pool);
    this.UserService = new DefaultUserService(this.#pool);
    this.AdminService = new DefaultAdminService(this.#pool);
    this.TokenService = new DefaultTokenService(this.#pool);
    this.NotificationService = new DefaultNotificationService();
    this.SettingsService = new DefaultSettingsService(this.#pool);
    this.ShopLinkService = new DefaultShopLinkService(this.#pool);
  }

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
    _role: "VIEWER",
    shipping_id: "",
  };
}

const container = new Container();
export default container;
