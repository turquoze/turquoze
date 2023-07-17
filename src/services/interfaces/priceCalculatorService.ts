import { PriceCalculation } from "../../utils/types.ts";

export default interface IPriceCalculatorService {
  GetPrice(params: {
    itemId: string;
    quantity: number;
    currency: string;
    billingCountry: string;
  }): Promise<PriceCalculation>;
}
