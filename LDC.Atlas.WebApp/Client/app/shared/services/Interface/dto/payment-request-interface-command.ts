import { PaymentRequestInterfaceError } from './payment-request-interface-error';

export class PaymentRequestInterfaceCommand {
    paymentInterfaceError: PaymentRequestInterfaceError;
    paymentInterfaceStatus: string;
}
