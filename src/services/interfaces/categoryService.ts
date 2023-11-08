import { Category } from "../../utils/schema.ts";

export default interface ICategoryService {
  Create(params: {
    data: Category;
  }): Promise<Category>;

  Get(params: {
    id: string;
  }): Promise<Category>;

  GetByName(params: {
    name: string;
    shop: string;
  }): Promise<Category>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Category>>;

  Update(params: {
    data: Category;
  }): Promise<Category>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
