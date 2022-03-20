import DefaultProductService from "./productService/mod.ts";
import DefaultCartService from "./cartService/mod.ts";
import DefaultOrderService from "./orderService/mod.ts";
import DefaultCategoryService from "./categoryService/mod.ts";
import DefaultCategoryLinkService from "./categoryLinkService/mod.ts";
import DefaultRegionService from "./regionService/mod.ts";
import DefaultPaymentService from "./paymentService/mod.ts";

import IProductService from "./interfaces/productService.ts";
import ICartService from "./interfaces/cartService.ts";
import IOrderService from "./interfaces/orderService.ts";
import ICategoryService from "./interfaces/categoryService.ts";
import ICategoryLinkService from "./interfaces/categoryLinkService.ts";
import IRegionService from "./interfaces/regionService.ts";

import client from "./dataClient/client.ts";
import IPaymentService from "./interfaces/paymentService.ts";

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
}
