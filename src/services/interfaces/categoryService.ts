import { Category } from "../../utils/types.ts";

export default interface ICategoryService {
  Create(params: {
    data: Category;
  }): Promise<Category>;

  Get(params: {
    id: string;
  }): Promise<Category>;

  GetByName(params: {
    name: string;
  }): Promise<Category>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Category>>;

  Update(params: {
    data: Category;
  }): Promise<Category>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
