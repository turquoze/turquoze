import { DBShop as Shop } from "../../utils/validator.ts";

export default interface IShopService {
  Create(params: {
    data: Shop;
  }): Promise<Shop>;

  Get(params: {
    id: string;
  }): Promise<Shop>;

  Update(params: {
    data: Shop;
  }): Promise<Shop>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
