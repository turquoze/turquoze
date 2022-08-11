import type postgresClient from "../dataClient/client.ts";
import IPaymentService from "../interfaces/paymentService.ts";
import {
  CartItem,
  PaymentPlugin,
  PaymentRequest,
  PaymentRequestResponse,
  PaymentValidation,
  PriceCalculation,
} from "../../utils/types.ts";
import ICartService from "../interfaces/cartService.ts";
import IOrderService from "../interfaces/orderService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { add, Dinero, dinero } from "../../deps.ts";
import IProductService from "../interfaces/productService.ts";
import IPluginService from "../interfaces/pluginService.ts";
import { CodeToCurrency } from "../../utils/utils.ts";

export default class PaymentService implements IPaymentService {
  client: typeof postgresClient;
  #CartService: ICartService;
  #OrderService: IOrderService;
  #ProductService: IProductService;
  #PluginService: IPluginService;
  constructor(
    client: typeof postgresClient,
    cartService: ICartService,
    orderService: IOrderService,
    productService: IProductService,
    pluginService: IPluginService,
  ) {
    this.client = client;
    this.#CartService = cartService;
    this.#OrderService = orderService;
    this.#ProductService = productService;
    this.#PluginService = pluginService;
  }

  async Create(
    params: { data: PaymentRequest },
  ): Promise<PaymentRequestResponse> {
    try {
      const cart = await this.#CartService.Get({
        id: params.data.cartId,
      });

      cart.items = await this.#CartService.GetAllItems(params.data.cartId);

      const price = await this.Price({
        items: cart.items,
        cartId: cart.public_id,
        currency: params.data.shop.currency,
      });

      const paymentProvider = this.#PluginService.Get<PaymentPlugin>(
        params.data.shop.payment_id,
      );

      const payData = await paymentProvider.pay(
        cart.items,
        price.price.valueOf(),
        params.data.shop,
      );

      //1. Add to order table

      /*const order = await this.#OrderService.Create({
        data: {
          id: "",
          // @ts-expect-error payment
          payment: {},
          // @ts-expect-error price
          price: {},
          created_at: 0,
          shop: params.data.info?.data.region ?? "",
          // @ts-expect-error products
          products: {},
        },
      });*/

      const order = {
        id: "123",
      };

      //2. Remove cart

      return {
        data: {
          price: price,
          order: {
            ...order,
          },
        },
        payment: payData,
        id: order.id,
      };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Price(
    params: { cartId: string; currency: string; items: Array<CartItem> },
  ): Promise<PriceCalculation> {
    try {
      const dollars = (amount: number) =>
        dinero({ amount, currency: CodeToCurrency(params.currency) });
      const addMany = (addends: Array<Dinero.Dinero<number>>) =>
        addends.reduce(add);

      const arr = Array<Dinero.Dinero<number>>();

      await Promise.all(params.items.map(async (product) => {
        const dbProduct = await this.#ProductService.Get({
          id: product.product_id,
        });
        // @ts-expect-error fake int
        const productPrice = parseInt(dbProduct.price);

        const dineroObj = dollars(productPrice);
        arr.push(dineroObj);
      }));

      const price = addMany(arr);
      const total = price.toJSON();

      return {
        price: total.amount,
        subtotal: 0,
        vat: 0,
      };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Validate(params: { data: PaymentValidation }): Promise<boolean> {
    try {
      await this.#OrderService.SetPaymentStatus({
        id: params.data.orderId,
        status: params.data.status,
      });

      return true;
    } catch {
      return false;
    }
  }
}
