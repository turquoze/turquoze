import {
  CartItem,
  PaymentPlugin,
  PaymentPluginResponse,
} from "../src/utils/types.ts";

export default class TestCheckout implements PaymentPlugin {
  async pay(
    items: CartItem[],
    amount: number,
    currency: string,
  ): Promise<PaymentPluginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return {
      type: "URL",
      value: "https://example.com",
    };
  }
}
