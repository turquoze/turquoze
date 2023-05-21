import { Shop, Token, TurquozeRole } from "../../utils/types.ts";

export default interface ITokenService {
  Create(params: {
    data: Token;
  }): Promise<Token>;

  GetShopByToken(params: {
    tokenId: string;
    tokenSecret: string;
  }): Promise<{ shop: Shop; role: TurquozeRole }>;

  Get(params: {
    tokenId: string;
  }): Promise<Token>;

  GetMany(params: {
    offset?: string;
    limit?: number;
    shop: string;
  }): Promise<Array<Token>>;

  Delete(params: {
    tokenId: string;
  }): Promise<void>;
}
