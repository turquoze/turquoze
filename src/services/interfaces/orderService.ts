import { Order } from "../../utils/validator.ts";

export default interface IOrderService {
  Create(params: {
    data: Order;
  }): Promise<Order>;

  Get(params: {
    id: string;
  }): Promise<Order>;

  GetMany(params: {
    offset?: number;
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
