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

import client from "./dataClient/client.ts";

export default class Container {
  ProductService: IProductService = new DefaultProductService(client);
  CartService: ICartService = new DefaultCartService(client);
  OrderService: IOrderService = new DefaultOrderService(client);
  CategoryService: ICategoryService = new DefaultCategoryService(client);
  CategoryLinkService: ICategoryLinkService = new DefaultCategoryLinkService(
    client,
  );
  RegionService: IRegionService = new DefaultRegionService(client);
  PaymentService: IPaymentService = new DefaultPaymentService(
    client,
    this.CartService,
    this.OrderService,
  );
  CacheService: ICacheService = new DefaultCacheService();
  DiscountService: IDiscountService = new DefaultDiscountService(client);
  SearchService: ISearchService = new DefaultSearchService(client);
  WarehouseService: IWarehouseService = new DefaultWarehouseService(client);
  InventoryService: IInventoryService = new DefaultInventoryService(client);
}
