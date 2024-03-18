import { Tax, TaxProductLink } from "../../utils/validator.ts";

export default interface ITaxLinkService {
  Create(params: {
    data: TaxProductLink;
  }): Promise<TaxProductLink>;

  GetTaxByProduct(params: {
    productId: string;
    country: string;
  }): Promise<Tax>;

  Delete(params: {
    productId: string;
    countryId: string;
    taxId: string;
  }): Promise<void>;
}
