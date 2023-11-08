import { PriceCalculation } from "../../utils/types.ts";
import IPriceService from "../interfaces/priceService.ts";
import IPriceCalculatorService from "../interfaces/priceCalculatorService.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class PriceCalculatorService implements IPriceCalculatorService {
  #PriceService: IPriceService;
  constructor(
    priceService: IPriceService,
  ) {
    this.#PriceService = priceService;
  }

  async GetPrice(
    params: {
      itemId: string;
      quantity: number;
      currency: string;
      billingCountry: string;
    },
  ): Promise<PriceCalculation> {
    try {
      const price = await this.#PriceService.GetByProduct({
        productId: params.itemId,
      });

      //todo: add vat calculations
      const total = price.amount ?? 0 * params.quantity;

      return {
        price: price.amount ?? 0,
        subtotal: total,
        vat: 20000,
      };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
