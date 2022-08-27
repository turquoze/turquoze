import { Router } from "../../deps.ts";
import plugin from "./plugin.ts";
import container from "../../services/mod.ts";

const app = new Router({
  prefix: "/plugin/:shop_id",
});

app.use(async (ctx, next) => {
  try {
    const pattern = new URLPattern({ pathname: "/plugin/:shop_id/*" });
    if (pattern.test(ctx.request.url)) {
      const match = pattern.exec(ctx.request.url);
      const shop_id = match?.pathname.groups.shop_id;

      if (
        shop_id == undefined || shop_id == null ||
        shop_id == ""
      ) {
        throw new Error("Something is wrong");
      }

      const shop = await container.ShopService.Get({ id: shop_id });

      ctx.state.request_data = shop;

      await next();
    } else {
      throw new Error("Something is wrong");
    }
  } catch (error) {
    console.log(error);
    ctx.response.status = 401;
    ctx.response.headers.set("content-type", "application/json");
    ctx.response.body = JSON.stringify({
      msg: "Not allowed",
      error: "NO_SHOP",
    });
  }
});
app.use(new plugin().routes());

export default app;
