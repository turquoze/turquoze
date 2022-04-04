import { Inventory } from "../../utils/types.ts";

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

  Delete(params: {
    id: string;
  }): Promise<void>;
}
