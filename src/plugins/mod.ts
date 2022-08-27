import container from "../services/mod.ts";
import StripeCheckout from "./StripeCheckout.ts";
const stripeCheckout = new StripeCheckout();

export default function initPlugins() {
  container.PluginService.Add(stripeCheckout.Id, stripeCheckout);
}

export function initRoutes() {
  return new Array(
    stripeCheckout.Routes(),
  );
}
