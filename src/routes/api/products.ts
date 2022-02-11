import { Router } from "../../deps.ts";

const products = new Router();

products.get("/", (ctx) => {
  ctx.response.body = "API product";
});

export default products;
