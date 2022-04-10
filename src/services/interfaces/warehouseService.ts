import { Warehouse } from "../../utils/types.ts";

export default interface IWarehouseService {
  Create(params: {
    data: Warehouse;
  }): Promise<Warehouse>;

  Update(params: {
    data: Warehouse;
  }): Promise<Warehouse>;

  Get(params: {
    id: string;
  }): Promise<Warehouse>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Warehouse>>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}