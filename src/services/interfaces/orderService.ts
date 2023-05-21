import { Order } from "../../utils/types.ts";

export default interface IOrderService {
  Create(params: {
    data: Order;
  }): Promise<Order>;

  Get(params: {
    id: string;
  }): Promise<Order>;

  GetMany(params: {
    offset?: string;
    limit?: number;
    shop: string;
  }): Promise<Array<Order>>;

  SetPaymentStatus(params: {
    id: string;
    status: "PAYED" | "WAITING" | "FAILED";
  }): Promise<Order>;

  SetOrderExported(params: {
    id: string;
  }): Promise<Order>;
}
