import {
  CartItem,
  PaymentPlugin,
  PaymentPluginResponse,
} from "../utils/types.ts";
import Stripe from "https://esm.sh/stripe@10.0.0";

export default class StripeCheckout implements PaymentPlugin {
  Id = "StripeCheckout";
  #stripe: typeof Stripe;
  constructor() {
    const STRIPE_API_KEY = Deno.env.get("STRIPE_API_KEY");
    if (!STRIPE_API_KEY) {
      throw new Error("environment variable STRIPE_API_KEY not set");
    }
    this.#stripe = Stripe(STRIPE_API_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  async pay(
    items: Array<CartItem>,
    amount: number,
    currency: string,
  ): Promise<PaymentPluginResponse> {
    const cartItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.product_id,
          },
          unit_amount: item.price,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
        quantity: item.quantity,
      };
    });

    const session = await this.#stripe.checkout.sessions.create({
      line_items: cartItems,
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "FI", "DK"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: currency,
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: currency,
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    return {
      type: "URL",
      value: session.url,
    };
  }
}