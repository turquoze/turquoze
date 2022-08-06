import container from "../services/mod.ts";

import StripeCheckout from "./StripeCheckout.ts";

export default function initPlugins() {
  const stripeCheckout = new StripeCheckout();

  container.PluginService.Add(stripeCheckout.Id, stripeCheckout);
}
