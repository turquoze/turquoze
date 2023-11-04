import { Oauth } from "../../utils/types.ts";

export default interface IOauthService {
  Create(params: {
    data: Oauth;
  }): Promise<Oauth>;

  Get(params: {
    id: string;
  }): Promise<Oauth>;

  GetByToken(params: {
    token: string;
  }): Promise<Oauth>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Oauth>>;

  Delete(params: {
    tokenId: string;
  }): Promise<void>;
}
