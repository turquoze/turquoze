import type postgresClient from "../dataClient/client.ts";
import IPaymentService from "../interfaces/paymentService.ts";
import {
  OrderProduct,
  PaymentRequest,
  PaymentRequestResponse,
  PaymentValidation,
} from "../../utils/types.ts";
import ICartService from "../interfaces/cartService.ts";
import IOrderService from "../interfaces/orderService.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class PaymentService implements IPaymentService {
  client: typeof postgresClient;
  #CartService: ICartService;
  #OrderService: IOrderService;
  constructor(
    client: typeof postgresClient,
    cartService: ICartService,
    orderService: IOrderService,
  ) {
    this.client = client;
    this.#CartService = cartService;
    this.#OrderService = orderService;
  }

  async Create(
    params: { data: PaymentRequest },
  ): Promise<PaymentRequestResponse> {
    try {
      const cart = await this.#CartService.Get({
        id: params.data.cartId,
      });

      let price = 0;
      const products: Array<OrderProduct> = [];

      cart.products.cart.forEach((product) => {
        products.push({
          price: {
            currency: "EUR",
            value: 1050,
          },
          product: product.pid,
          quantity: product.quantity,
        });
        price += 1050 * product.quantity;
      });

      const order = await this.#OrderService.Create({
        data: {
          id: "",
          // @ts-expect-error payment
          payment: {},
          // @ts-expect-error price
          price: {},
          created_at: 0,
          region: params.data.info?.data.region ?? "",
          // @ts-expect-error products
          products: {},
        },
      });

      return {
        data: {
          price: price,
          order: {
            ...order
          }
        },
        id: order.id,
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
