import { Router } from "../../deps.ts";
import IProductService from "../../services/interfaces/productService.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { ProductSchema } from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Router;
  #ProductService: IProductService;
  constructor(productService: IProductService) {
    this.#ProductService = productService;
    this.#products = new Router({
      prefix: "/products",
    });

    this.#products.get("/", async (ctx) => {
      try {
        const data = await this.#ProductService.GetMany({});
        ctx.response.body = stringifyJSON({
          products: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#products.post("/", async (ctx) => {
      try {
        const posted = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          active: true,
          images: [],
          price: 203300,
          title: "test product",
          description: "test product",
          region: ctx.state.region,
        };

        await ProductSchema.validate(posted);

        const data = await this.#ProductService.Create({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          products: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#products.put("/:id", async (ctx) => {
      try {
        const posted = {
          id: ctx.params.id,
          active: true,
          images: ["https://test.com"],
          price: 203300,
          title: "Test product update",
          description: "test description update",
          region: ctx.state.region,
        };

        await ProductSchema.validate(posted);

        const data = await this.#ProductService.Update({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          product: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#products.get("/:id", async (ctx) => {
      try {
        const data = await this.#ProductService.Get({ id: ctx.params.id });
        ctx.response.body = stringifyJSON({
          product: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#products.delete("/:id", async (ctx) => {
      try {
        await this.#ProductService.Delete({ id: ctx.params.id });
        ctx.response.status = 201;
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#products.routes();
  }
}
