import type postgresClient from "../dataClient/client.ts";
import IPaymentService from "../interfaces/paymentService.ts";
import {
  PaymentRequest,
  PaymentRequestResponse,
  PaymentValidation,
  PriceCalculation,
} from "../../utils/types.ts";
import ICartService from "../interfaces/cartService.ts";
import IOrderService from "../interfaces/orderService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { add, Din, dinero } from "../../deps.ts";
import IProductService from "../interfaces/productService.ts";

export default class PaymentService implements IPaymentService {
  client: typeof postgresClient;
  #CartService: ICartService;
  #OrderService: IOrderService;
  #ProductService: IProductService;
  constructor(
    client: typeof postgresClient,
    cartService: ICartService,
    orderService: IOrderService,
    productService: IProductService,
  ) {
    this.client = client;
    this.#CartService = cartService;
    this.#OrderService = orderService;
    this.#ProductService = productService;
  }

  async Create(
    params: { data: PaymentRequest },
  ): Promise<PaymentRequestResponse> {
    try {
      const cart = await this.#CartService.Get({
        id: params.data.cartId,
      });

      const price = await this.Price({ cartId: cart.public_id });

      const order = await this.#OrderService.Create({
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
      });

      return {
        data: {
          price: price,
          order: {
            ...order,
          },
        },
        id: order.id,
      };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Price(params: { cartId: string }): Promise<PriceCalculation> {
    try {
      const cart = await this.#CartService.Get({
        id: params.cartId,
      });

      /*const dollars = (amount: number) =>
        dinero({ amount, currency: currency.USD });*/
      const addMany = (addends: Array<Din.Dinero<number>>) =>
        addends.reduce(add);
      const arr: Array<Din.Dinero<number>> = [];

      /*await Promise.all(cart.products.cart.map(async (product) => {
        const dbProduct = await this.#ProductService.Get({ id: product.pid });
        // @ts-expect-error fake int
        const productPrice = parseInt(dbProduct.price);

        const dineroObj = dollars(productPrice);
        arr.push(dineroObj);
      }));*/

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
