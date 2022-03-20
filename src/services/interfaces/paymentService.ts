import {
  PaymentRequest,
  PaymentRequestResponse,
  PaymentValidation,
} from "../../utils/types.ts";

export default interface IPaymentService {
  Create(params: {
    data: PaymentRequest;
  }): Promise<PaymentRequestResponse>;

  Validate(params: {
    data: PaymentValidation;
  }): Promise<boolean>;
}
