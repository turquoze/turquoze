import { PaymentPlugin, PaymentPluginResponse, Shop } from "../utils/types.ts";
import Stripe from "https://esm.sh/stripe@10.0.0";
import { Router } from "https://deno.land/x/oak@v10.5.1/router.ts";
const cryptoProvider = Stripe.createSubtleCryptoProvider();

export default class StripeCheckout implements PaymentPlugin {
  Id = "StripeCheckout";
  #stripe: typeof Stripe;
  #STRIPE_WEBHOOK_SIGNING_SECRET: string | undefined;
  constructor() {
    const STRIPE_API_KEY = Deno.env.get("STRIPE_API_KEY");
    this.#STRIPE_WEBHOOK_SIGNING_SECRET = Deno.env.get(
      "STRIPE_WEBHOOK_SIGNING_SECRET",
    );
    if (!STRIPE_API_KEY) {
      throw new Error("environment variable STRIPE_API_KEY not set");
    }
    if (!this.#STRIPE_WEBHOOK_SIGNING_SECRET) {
      throw new Error(
        "environment variable STRIPE_WEBHOOK_SIGNING_SECRET not set",
      );
    }
    this.#stripe = Stripe(STRIPE_API_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  async pay(
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>,
    amount: number,
    shop: Shop,
  ): Promise<PaymentPluginResponse> {
    const cartItems = items.map((item) => {
      return {
        price_data: {
          currency: shop.currency,
          product_data: {
            name: item.name,
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
        allowed_countries: shop.regions,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: shop.currency,
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
              currency: shop.currency,
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],
      mode: "payment",
      success_url: `${shop.url}/success`,
      cancel_url: `${shop.url}/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + (3600 * 1),
    });

    return {
      type: "URL",
      value: session.url,
    };
  }

  Routes() {
    const router = new Router({
      prefix: "/stripe-checkout",
    });
    router.post("/webhook", async (ctx) => {
      const signature = ctx.request.headers.get("Stripe-Signature");

      // First step is to verify the event. The .text() method must be used as the
      // verification relies on the raw request body rather than the parsed JSON.
      const body = await ctx.request.body({ type: "text" }).value;
      let receivedEvent;
      try {
        receivedEvent = await this.#stripe.webhooks.constructEventAsync(
          body,
          signature,
          this.#STRIPE_WEBHOOK_SIGNING_SECRET,
          undefined,
          cryptoProvider,
        );
      } catch (err) {
        ctx.response.status = 404;
        return ctx.response.body = JSON.stringify({ error: err.message });
      }

      console.log(
        JSON.stringify({ stripe_event: "webhook", event: receivedEvent }),
      );

      // Secondly, we use this event to query the Stripe API in order to avoid
      // handling any forged event. If available, we use the idempotency key.
      /*const requestOptions =
        receivedEvent.request && receivedEvent.request.idempotency_key
          ? {
            idempotencyKey: receivedEvent.request.idempotency_key,
          }
          : {};

      let retrievedEvent;
      try {
        retrievedEvent = await this.#stripe.events.retrieve(
          receivedEvent.id,
          requestOptions,
        );
      } catch (err) {
        ctx.response.status = 404;
        return ctx.response.body = JSON.stringify({ error: err.message });
      }*/

      ctx.response.status = 200;
      ctx.response.body = JSON.stringify({ status: "ok" });
    });

    return router;
  }
}
