import DefaultProductService from "./productService/mod.ts";
import DefaultCartService from "./cartService/mod.ts";
import DefaultOrderService from "./orderService/mod.ts";
import DefaultCategoryService from "./categoryService/mod.ts";
import DefaultCategoryLinkService from "./categoryLinkService/mod.ts";
import DefaultRegionService from "./regionService/mod.ts";
import DefaultPaymentService from "./paymentService/mod.ts";
import DefaultCacheService from "./cacheService/mod.ts";
import DefaultDiscountService from "./discountService/mod.ts";
import DefaultSearchService from "./searchService/mod.ts";
import DefaultWarehouseService from "./warehouseService/mod.ts";
import DefaultInventoryService from "./inventoryService/mod.ts";
import DefaultPriceService from "./priceService/mod.ts";
import DefaultUserService from "./userService/mod.ts";
import DefaultTokenService from "./tokenService/mod.ts";

import IProductService from "./interfaces/productService.ts";
import ICartService from "./interfaces/cartService.ts";
import IOrderService from "./interfaces/orderService.ts";
import ICategoryService from "./interfaces/categoryService.ts";
import ICategoryLinkService from "./interfaces/categoryLinkService.ts";
import IRegionService from "./interfaces/regionService.ts";
import IPaymentService from "./interfaces/paymentService.ts";
import ICacheService from "./interfaces/cacheService.ts";
import IDiscountService from "./interfaces/discountService.ts";
import ISearchService from "./interfaces/searchService.ts";
import IWarehouseService from "./interfaces/warehouseService.ts";
import IInventoryService from "./interfaces/inventoryService.ts";
import IPriceService from "./interfaces/priceService.ts";
import IUserService from "./interfaces/userService.ts";
import ITokenService from "./interfaces/tokenService.ts";

import client from "./dataClient/client.ts";

export class Container {
  CacheService: ICacheService = new DefaultCacheService();
  ProductService: IProductService = new DefaultProductService(
    client,
    this.CacheService,
  );
  CartService: ICartService = new DefaultCartService(client, this.CacheService);
  OrderService: IOrderService = new DefaultOrderService(
    client,
    this.CacheService,
  );
  CategoryService: ICategoryService = new DefaultCategoryService(
    client,
    this.CacheService,
  );
  CategoryLinkService: ICategoryLinkService = new DefaultCategoryLinkService(
    client,
    this.CacheService,
  );
  RegionService: IRegionService = new DefaultRegionService(
    client,
    this.CacheService,
  );
  PaymentService: IPaymentService = new DefaultPaymentService(
    client,
    this.CartService,
    this.OrderService,
    this.ProductService,
  );
  DiscountService: IDiscountService = new DefaultDiscountService(
    client,
    this.CacheService,
  );
  SearchService: ISearchService = new DefaultSearchService(
    client,
    this.CacheService,
  );
  WarehouseService: IWarehouseService = new DefaultWarehouseService(
    client,
    this.CacheService,
  );
  InventoryService: IInventoryService = new DefaultInventoryService(
    client,
    this.CacheService,
  );
  PriceService: IPriceService = new DefaultPriceService(
    client,
    this.CacheService,
  );
  UserService: IUserService = new DefaultUserService(client, this.CacheService);
  TokenService: ITokenService = new DefaultTokenService(
    client,
    this.CacheService,
  );
}

const container = new Container();
export default container;
