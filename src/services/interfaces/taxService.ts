import { Tax } from "../../utils/schema.ts";

export default interface ITaxService {
  Create(params: {
    data: Tax;
  }): Promise<Tax>;

  Get(params: {
    id: string;
  }): Promise<Tax>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Tax>>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
