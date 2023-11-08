import { User } from "../../utils/schema.ts";

export default interface IUserService {
  Create(params: {
    data: User;
  }): Promise<User>;

  Get(params: {
    id: string;
  }): Promise<User>;

  Login(params: {
    email: string;
    password: string;
    shop: string;
  }): Promise<User>;

  UpdatePassword(params: {
    email: string;
    new_password: string;
    shop: string;
  }): Promise<User>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<User>>;

  Update(params: {
    data: User;
  }): Promise<User>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
