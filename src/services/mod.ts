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

import client from "../db/client.ts";

export class Container {
  CacheService: ICacheService = new DefaultCacheService();
  ProductService: IProductService = new DefaultProductService(
    client,
  );
  CartService: ICartService = new DefaultCartService(client);
  OrderService: IOrderService = new DefaultOrderService(
    client,
  );
  CategoryService: ICategoryService = new DefaultCategoryService(
    client,
  );
  CategoryLinkService: ICategoryLinkService = new DefaultCategoryLinkService(
    client,
  );
  ShopService: IShopService = new DefaultShopService(
    client,
  );
  PluginService: IPluginService = new DefaultPluginService();
  PaymentService: IPaymentService = new DefaultPaymentService(
    client,
    this.CartService,
    this.OrderService,
    this.ProductService,
    this.PluginService,
  );
  DiscountService: IDiscountService = new DefaultDiscountService(
    client,
  );
  SearchService: ISearchService = new DefaultSearchService();
  WarehouseService: IWarehouseService = new DefaultWarehouseService(
    client,
  );
  InventoryService: IInventoryService = new DefaultInventoryService(
    client,
  );
  PriceService: IPriceService = new DefaultPriceService(
    client,
  );
  UserService: IUserService = new DefaultUserService(client);
  TokenService: ITokenService = new DefaultTokenService(
    client,
  );
  NotificationService: INotificationService = new DefaultNotificationService();
}

const container = new Container();
export default container;
