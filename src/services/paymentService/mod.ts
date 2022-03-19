import type postgresClient from "../dataClient/client.ts";
import IPaymentService from "../interfaces/paymentService.ts";
import { PaymentRequest, PaymentRequestResponse, PaymentValidation } from "../../utils/types.ts";
import ICartService from "../interfaces/cartService.ts";
import IOrderService from "../interfaces/orderService.ts";

export default class PaymentService implements IPaymentService {
  client: typeof postgresClient;
  #CartService: ICartService;
  #OrderService: IOrderService;
  constructor(client: typeof postgresClient, cartService: ICartService, orderService: IOrderService) {
    this.client = client;
    this.#CartService = cartService;
    this.#OrderService = orderService;
  }

  async Create(params: { data: PaymentRequest; }): Promise<PaymentRequestResponse> {
    try {
      const cart = await this.#CartService.Get({
        id: params.data.cartId
      })

      //TODO: calculate price for product
      let price = 0

      cart.products.forEach((product) => {
        price += 1050 * product.quantity
      })

      //TODO: create order

      return {
        data: {
          price: price
        },
        id: "123"
      }
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    }
  }

  Validate(params: { data: PaymentValidation; }): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
