import { OrderReturn } from "../../utils/types.ts";

export default interface IReturnService {
  Create(params: {
    data: OrderReturn;
  }): Promise<OrderReturn>;

  Update(params: {
    data: OrderReturn;
  }): Promise<OrderReturn>;

  Get(params: {
    id: string;
  }): Promise<OrderReturn>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<OrderReturn>>;

  SetReturnExported(params: {
    id: string;
  }): Promise<OrderReturn>;
}
