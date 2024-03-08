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
import DefaultOauthService from "./oauthService/mod.ts";
import DefaultOrganizationService from "./organizationService/mod.ts";
import DefaultOrganizationLinkService from "./organizationLinkService/mod.ts";
import DefaultPriceCalculatorService from "./priceCalculatorService/mod.ts";

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
import IOauthService from "./interfaces/oauthService.ts";
import IOrganizationService from "./interfaces/organizationService.ts";
import IOrganizationLinkService from "./interfaces/organizationLinkService.ts";
import IPriceCalculatorService from "./interfaces/priceCalculatorService.ts";

import type { PostgresJsDatabase } from "../deps.ts";
import { Shop } from "../utils/schema.ts";

export default class Container {
  #db: PostgresJsDatabase;
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
  OauthService: IOauthService;
  OrganizationService: IOrganizationService;
  OrganizationLinkService: IOrganizationLinkService;
  PriceCalculatorService: IPriceCalculatorService;

  constructor(db: PostgresJsDatabase) {
    this.#db = db;

    this.CacheService = new DefaultCacheService();
    this.ProductService = new DefaultProductService(this.#db);
    this.CartService = new DefaultCartService(this.#db);
    this.OrderService = new DefaultOrderService(this.#db);
    this.CategoryService = new DefaultCategoryService(this.#db);
    this.CategoryLinkService = new DefaultCategoryLinkService(this.#db);
    this.ShopService = new DefaultShopService(this.#db);
    this.PluginService = new DefaultPluginService(this.#db);
    this.DiscountService = new DefaultDiscountService(this.#db);
    this.SearchService = new DefaultSearchService();
    this.WarehouseService = new DefaultWarehouseService(this.#db);
    this.InventoryService = new DefaultInventoryService(this.#db);
    this.PriceService = new DefaultPriceService(this.#db);
    this.UserService = new DefaultUserService(this.#db);
    this.AdminService = new DefaultAdminService(this.#db);
    this.TokenService = new DefaultTokenService(this.#db);
    this.NotificationService = new DefaultNotificationService();
    this.SettingsService = new DefaultSettingsService(this.#db);
    this.ShopLinkService = new DefaultShopLinkService(this.#db);
    this.OauthService = new DefaultOauthService(this.#db);
    this.OrganizationService = new DefaultOrganizationService(this.#db);
    this.OrganizationLinkService = new DefaultOrganizationLinkService(
      this.#db,
    );
    this.PriceCalculatorService = new DefaultPriceCalculatorService(
      this.PriceService,
    );
    this.PaymentService = new DefaultPaymentService(
      this.CartService,
      this.OrderService,
      this.ProductService,
      this.PluginService,
      this.PriceService,
      this.PriceCalculatorService,
    );
  }

  Shop: Shop = {
    id: 0,
    publicId: "",
    regions: [],
    paymentId: "",
    currency: "",
    name: "",
    url: "",
    searchIndex: "",
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
    shippingId: "",
  };
}
