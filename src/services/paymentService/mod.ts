import IPaymentService from "../interfaces/paymentService.ts";
import {
  PaymentPluginResponse,
  PaymentRequest,
  PaymentRequestResponse,
  PaymentValidation,
  PriceCalculation,
} from "../../utils/types.ts";
import ICartService from "../interfaces/cartService.ts";
import IOrderService from "../interfaces/orderService.ts";
import { DatabaseError, NoCartError } from "../../utils/errors.ts";
import IProductService from "../interfaces/productService.ts";
import IPluginService from "../interfaces/pluginService.ts";
import IPriceService from "../interfaces/priceService.ts";
import IPriceCalculatorService from "../interfaces/priceCalculatorService.ts";
import { Cart, CartItem, Plugin, Shop } from "../../utils/validator.ts";
import { Dinero } from "../../deps.ts";

export default class PaymentService implements IPaymentService {
  #CartService: ICartService;
  #OrderService: IOrderService;
  #ProductService: IProductService;
  #PluginService: IPluginService;
  #PriceService: IPriceService;
  #PriceCalculatorService: IPriceCalculatorService;
  constructor(
    cartService: ICartService,
    orderService: IOrderService,
    productService: IProductService,
    pluginService: IPluginService,
    priceService: IPriceService,
    priceCalculatorService: IPriceCalculatorService,
  ) {
    this.#CartService = cartService;
    this.#OrderService = orderService;
    this.#ProductService = productService;
    this.#PluginService = pluginService;
    this.#PriceService = priceService;
    this.#PriceCalculatorService = priceCalculatorService;
  }

  async Create(
    params: { data: PaymentRequest },
  ): Promise<PaymentRequestResponse> {
    try {
      const cart: Cart = await this.#CartService.Get({
        id: params.data.cartId,
      }) as Cart;

      if (cart == undefined || cart == null) {
        throw new NoCartError("No cart");
      }

      //@ts-ignore not on type
      cart.items = await this.#CartService.GetAllItems(params.data.cartId);

      const price = await this.Price({
        items: cart.items,
        cartId: cart.publicId!,
        currency: params.data.shop.currency!,
        billingCountry: params.data.info?.country ?? "UNKOWN",
      });

      const paymentProvider = await this.#PluginService.Get({
        id: params.data.shop.paymentId!,
      });

      const payCartItemsPromises = cart.items.map(async (item: CartItem) => {
        const product = await this.#ProductService.Get({ id: item.itemId! });
        const price = await this.#PriceService.GetByProduct({
          productId: product.publicId!,
        });

        return {
          name: product.title,
          price: parseInt((price.amount ?? 0).toString()),
          image_url: product.images != undefined && product.images.length > 0
            ? product.images[0]
            : null,
          quantity: item.quantity ?? 0,
        };
      });

      const payCartItems = await Promise.all(payCartItemsPromises);

      const orderProducts = cart.items.map((product: CartItem) => {
        return {
          price: {
            currency: params.data.shop.currency,
            value: product.price,
          },
          product: product.itemId,
          quantity: product.quantity,
        };
      });

      const order = await this.#OrderService.Create({
        data: {
          paymentStatus: "WAITING",
          priceTotal: parseInt(price.price.toString()),
          shop: params.data.shop.publicId!,
          products: JSON.stringify(orderProducts),
        },
      });

      const payData = await this.#PaymentRequest({
        plugin: paymentProvider,
        orderId: order.publicId!,
        items: payCartItems,
        shop: params.data.shop,
      });

      return {
        data: {
          price: price,
          order: {
            ...order,
          },
        },
        payment: payData,
        id: order.publicId!,
      };
    } catch (error) {
      if (error instanceof NoCartError) {
        throw error;
      } else {
        throw new DatabaseError("DB error", {
          cause: error,
        });
      }
    }
  }

  async #PaymentRequest(params: {
    plugin: Plugin;
    orderId: string;
    items: Array<
      {
        name: string;
        price: number;
        quantity: number;
        image_url: string | null;
      }
    >;
    shop: Shop;
  }) {
    const response = await fetch(
      params.plugin.url + `/checkout/8f1c1016-31b9-47b9-8933-250e43bcede5`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${params.plugin.token}`,
        },
        body: JSON.stringify({
          items: params.items,
          currency: params.shop.currency,
          orderId: params.orderId,
          shop: {
            url: params.shop.url,
            regions: params.shop.regions,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`${response.status} ${JSON.stringify(error)}`);
      throw new Error("Not ok response");
    }

    const paymentResponse: PaymentPluginResponse = await response.json();

    return paymentResponse;
  }

  async Price(
    params: {
      cartId: string;
      currency: string;
      items: Array<CartItem>;
      billingCountry: string;
    },
  ): Promise<PriceCalculation> {
    try {
      const dollars = (amount: number) =>
        Dinero({ amount, currency: params.currency });
      // deno-lint-ignore no-explicit-any
      const addMany = (addends: Array<any>) => addends.reduce(Dinero);

      // deno-lint-ignore no-explicit-any
      const arr = Array<any>();

      await Promise.all(params.items.map(async (product) => {
        const productPrice = await this.#PriceCalculatorService.GetPrice({
          itemId: product.itemId!,
          billingCountry: params.billingCountry,
          currency: params.currency,
          quantity: product.quantity!,
          priceList: undefined,
        });

        const dineroObj = dollars(productPrice.subtotal);
        arr.push(dineroObj);
      }));

      const price = addMany(arr);
      const total = price.toJSON();

      const sub = price * 1.25;

      return {
        price: total.amount,
        subtotal: parseInt(sub.toString()),
        vat: parseInt((sub - price).toString()),
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
