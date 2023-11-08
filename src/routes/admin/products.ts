import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { TurquozeState } from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";
import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { insertProductSchema, Product } from "../../utils/schema.ts";

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
        const offset = parseInt(
          ctx.request.url.searchParams.get("offset") ?? "",
        );
        const limit = parseInt(ctx.request.url.searchParams.get("limit") ?? "");

        const data = await this.#Container.ProductService.GetMany({
          shop: ctx.state.request_data.publicId,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        const productsPromises = data.map(async (product) => {
          const localProduct: Product = {
            ...product,
            price: 0,
          };
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          localProduct.price = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return localProduct;
        });

        const products = await Promise.all(productsPromises);

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

        product.shop = ctx.state.request_data.publicId;

        const posted = parse(insertProductSchema, product);

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
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Product>(this.#Container, {
          id: `product_${ctx.state.request_data.publicId}-${ctx.params.id}`,
          //@ts-ignore not on type
          promise: this.#Container.ProductService.Get({
            id: ctx.params.id,
          }),
        });

        const price = await this.#Container.PriceService.GetByProduct({
          productId: ctx.params.id,
        });

        data.price = Dinero({
          amount: parseInt((price.amount ?? -1).toString()),
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

        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let product: Product;
        if (body.type === "json") {
          product = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        product.publicId = ctx.params.id;
        product.shop = ctx.state.request_data.publicId;

        const posted = parse(insertProductSchema, product);

        const data = await Update<Product>(this.#Container, {
          id: `product_${ctx.state.request_data.publicId}-${product.id}`,
          //@ts-ignore not on type
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
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `product_${ctx.state.request_data.publicId}-${ctx.params.id}`,
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
