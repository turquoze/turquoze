import DefaultPaymentService from "./paymentService/mod.ts";
import DefaultCacheService from "./cacheService/mod.ts";
import DefaultSearchService from "./searchService/mod.ts";
import DefaultTokenService from "./tokenService/mod.ts";
import DefaultNotificationService from "./notificationService/mod.ts";
import DefaultSettingsService from "./settingsService/mod.ts";
import DefaultOauthService from "./oauthService/mod.ts";
import DefaultPriceCalculatorService from "./priceCalculatorService/mod.ts";

import IPaymentService from "./interfaces/paymentService.ts";
import ICacheService from "./interfaces/cacheService.ts";
import ISearchService from "./interfaces/searchService.ts";
import ITokenService from "./interfaces/tokenService.ts";
import INotificationService from "./interfaces/notificationService.ts";
import ISettingsService from "./interfaces/settingsService.ts";
import IOauthService from "./interfaces/oauthService.ts";
import IPriceCalculatorService from "./interfaces/priceCalculatorService.ts";
import WarehouseService from "./warehouseService.ts";
import UserService from "./userService.ts";
import ShopService from "./shopService.ts";
import ProductService from "./productService.ts";
import PriceService from "./priceService.ts";
import PluginService from "./pluginService.ts";
import OrganizationService from "./organizationService.ts";
import OrganizationLinkService from "./organizationLinkService.ts";
import OrderService from "./orderService.ts";
import InventoryService from "./inventoryService.ts";
import DiscountService from "./discountService.ts";
import CategoryService from "./categoryService.ts";
import CategoryLinkService from "./categoryLinkService.ts";
import AdminService from "./adminService.ts";
import ShopLinkService from "./shopLinkService.ts";
import CartService from "./cartService.ts";

import type { PostgresJsDatabase } from "../deps.ts";
import { Shop } from "../utils/validator.ts";

export default class Container {
  #db: PostgresJsDatabase;
  CacheService: ICacheService;
  ProductService: ProductService;
  CartService: CartService;
  OrderService: OrderService;
  CategoryService: CategoryService;
  CategoryLinkService: CategoryLinkService;
  ShopService: ShopService;
  PluginService: PluginService;
  PaymentService: IPaymentService;
  DiscountService: DiscountService;
  SearchService: ISearchService;
  WarehouseService: WarehouseService;
  InventoryService: InventoryService;
  PriceService: PriceService;
  UserService: UserService;
  AdminService: AdminService;
  TokenService: ITokenService;
  NotificationService: INotificationService;
  SettingsService: ISettingsService;
  ShopLinkService: ShopLinkService;
  OauthService: IOauthService;
  OrganizationService: OrganizationService;
  OrganizationLinkService: OrganizationLinkService;
  PriceCalculatorService: IPriceCalculatorService;

  constructor(db: PostgresJsDatabase) {
    this.#db = db;

    this.CacheService = new DefaultCacheService();
    this.ProductService = new ProductService(this.#db);
    this.CartService = new CartService(this.#db);
    this.OrderService = new OrderService(this.#db);
    this.CategoryService = new CategoryService(this.#db);
    this.CategoryLinkService = new CategoryLinkService(this.#db);
    this.ShopService = new ShopService(this.#db);
    this.PluginService = new PluginService(this.#db);
    this.DiscountService = new DiscountService(this.#db);
    this.SearchService = new DefaultSearchService();
    this.WarehouseService = new WarehouseService(this.#db);
    this.InventoryService = new InventoryService(this.#db);
    this.PriceService = new PriceService(this.#db);
    this.UserService = new UserService(this.#db);
    this.AdminService = new AdminService(this.#db);
    this.TokenService = new DefaultTokenService(this.#db);
    this.NotificationService = new DefaultNotificationService();
    this.SettingsService = new DefaultSettingsService(this.#db);
    this.ShopLinkService = new ShopLinkService(this.#db);
    this.OauthService = new DefaultOauthService(this.#db);
    this.OrganizationService = new OrganizationService(this.#db);
    this.OrganizationLinkService = new OrganizationLinkService(
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
