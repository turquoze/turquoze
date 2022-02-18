import { Order } from "../../utils/types.ts";

export default interface IOrderService {
  Get(params: {
    id: string;
  }): Promise<Order>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Order>>;

  Update(params: {
    data: Order;
  }): Promise<Order>;
}
