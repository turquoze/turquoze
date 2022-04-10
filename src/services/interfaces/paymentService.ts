import {
  PaymentRequest,
  PaymentRequestResponse,
  PaymentValidation,
  PriceCalculation,
} from "../../utils/types.ts";

export default interface IPaymentService {
  Create(params: {
    data: PaymentRequest;
  }): Promise<PaymentRequestResponse>;

  Price(params: {
    cartId: string;
  }): Promise<PriceCalculation>;

  Validate(params: {
    data: PaymentValidation;
  }): Promise<boolean>;
}
