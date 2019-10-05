import { ShippingType } from '../enums/shipping-type-enum';
import { ContractInvoiceType } from '../enums/contract-invoice-type.enum';

export class AllocateSection {
    sectionId: number;
    dataVersionId: number;
    allocatedSectionId: number;
    shippingType: ShippingType;
    quantity: number;
    allocatedSectionReference: string;
    contractInvoiceTypeId: ContractInvoiceType;
}
