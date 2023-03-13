import { Shop, ShopLink } from "../../utils/types.ts";

export default interface IShopLinkService {
  Link(params: {
    data: ShopLink;
  }): Promise<ShopLink>;

  Delete(params: {
    data: ShopLink;
  }): Promise<void>;

  GetShops(params: {
    id: string;
    offset?: string;
    limit?: number;
  }): Promise<Array<Shop>>;
}
