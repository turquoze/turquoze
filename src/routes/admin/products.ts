import { Router } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Product, TurquozeState } from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";
import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { ProductSchema, UuidSchema } from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#products = new Router<TurquozeState>({
      prefix: "/products",
    });

    this.#products.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const data = await this.#Container.ProductService.GetMany({
          shop: ctx.state.request_data.public_id,
        });

        const products = data.map((product) => {
          product.price = Dinero({
            amount: parseInt((product.price * 100).toString()),
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return product;
        });

        ctx.response.body = stringifyJSON({
          products,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#products.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let product: Product;
        if (body.type === "json") {
          product = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        product.shop = ctx.state.shop;

        await ProductSchema.validate(product);
        const posted: Product = await ProductSchema.cast(product);

        const data = await this.#Container.ProductService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          products: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#products.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Product>(this.#Container, {
          id: `product_${ctx.state.request_data.public_id}-${ctx.params.id}`,
          promise: this.#Container.ProductService.Get({
            id: ctx.params.id,
          }),
        });

        data.price = Dinero({
          amount: parseInt((data.price * 100).toString()),
          currency: ctx.state.request_data.currency,
        }).getAmount();

        ctx.response.body = stringifyJSON({
          products: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#products.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let product: Product;
        if (body.type === "json") {
          product = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        product.public_id = ctx.params.id;
        product.shop = ctx.state.shop;

        await ProductSchema.validate(product);
        const posted: Product = await ProductSchema.cast(product);

        const data = await Update<Product>(this.#Container, {
          id: `product_${ctx.state.request_data.public_id}-${product.id}`,
          promise: this.#Container.ProductService.Update({
            data: posted,
          }),
        });

        ctx.response.body = stringifyJSON({
          products: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#products.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `product_${ctx.state.request_data.public_id}-${ctx.params.id}`,
          promise: this.#Container.ProductService.Delete({ id: ctx.params.id }),
        });

        ctx.response.status = 201;
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });
  }

  routes() {
    return this.#products.routes();
  }
}
