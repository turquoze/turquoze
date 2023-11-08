import { Admin } from "../../utils/schema.ts";

export default interface IAdminService {
  Create(params: {
    data: Admin;
  }): Promise<Admin>;

  Get(params: {
    id: string;
  }): Promise<Admin>;

  Login(params: {
    email: string;
    password: string;
  }): Promise<Admin>;

  UpdatePassword(params: {
    email: string;
    new_password: string;
  }): Promise<Admin>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Admin>>;

  Update(params: {
    data: Admin;
  }): Promise<Admin>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
