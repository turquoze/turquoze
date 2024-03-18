import { ShopLink } from "../../utils/validator.ts";
import { ShopLinkData } from "../../utils/types.ts";

export default interface IShopLinkService {
  Link(params: {
    data: ShopLink;
  }): Promise<ShopLink>;

  Delete(params: {
    data: ShopLink;
  }): Promise<void>;

  GetShops(params: {
    id: string;
    offset?: number;
    limit?: number;
  }): Promise<Array<ShopLinkData>>;

  GetShop(params: {
    shopId: string;
    adminId: string;
  }): Promise<ShopLink>;
}
