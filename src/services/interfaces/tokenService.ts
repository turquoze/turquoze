import { Shop, Token, TokenOld } from "../../utils/types.ts";

export default interface ITokenService {
  Create(params: {
    data: Token;
  }): Promise<Token>;

  GetShopByToken(params: {
    tokenId: string;
    tokenSecret: string;
  }): Promise<Shop>;

  GetOld(params: {
    token: string;
  }): Promise<TokenOld>;

  Get(params: {
    tokenId: string;
  }): Promise<Token>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Token>>;

  Delete(params: {
    tokenId: string;
  }): Promise<void>;
}
