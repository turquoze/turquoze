import { Inventory } from "../../utils/schema.ts";

export default interface IInventoryService {
  Create(params: {
    data: Inventory;
  }): Promise<Inventory>;

  Update(params: {
    data: Inventory;
  }): Promise<Inventory>;

  Get(params: {
    id: string;
  }): Promise<Inventory>;

  GetInventoryByProduct(params: {
    id: string;
  }): Promise<Array<Inventory>>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
