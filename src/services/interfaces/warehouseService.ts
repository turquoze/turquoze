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
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Warehouse>>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
