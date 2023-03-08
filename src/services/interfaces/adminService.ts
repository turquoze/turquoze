import { Admin } from "../../utils/types.ts";

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
    offset?: string;
    limit?: number;
  }): Promise<Array<Admin>>;

  Update(params: {
    data: Admin;
  }): Promise<Admin>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
