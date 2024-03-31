import { PriceCalculation } from "../../utils/types.ts";

export default interface IPriceCalculatorService {
  GetPrice(params: {
    itemId: string;
    quantity: number;
    currency: string;
    billingCountry: string;
    priceList?: string;
  }): Promise<PriceCalculation>;
}
