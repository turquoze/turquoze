import { Token } from "../../utils/types.ts";

export default interface ITokenService {
  Create(params: {
    data: Token;
  }): Promise<Token>;

  Get(params: {
    token: string;
  }): Promise<Token>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Token>>;

  Delete(params: {
    token: string;
  }): Promise<void>;
}
