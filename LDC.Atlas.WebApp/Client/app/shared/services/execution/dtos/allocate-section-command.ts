import { AllocationType } from '../../../../shared/enums/allocation-type.enum';
import { ShippingType } from '../../../../shared/enums/shipping-type-enum';
import { SplitType } from '../../../../shared/enums/split-type.enum';
import { ContractInvoiceType } from '../../../../shared/enums/contract-invoice-type.enum';

export class AllocateSectionCommand {
    sectionId: number;
    dataVersionId?: number;
    allocatedSectionId: number;
    shippingType: ShippingType;
    quantity: number;
    sourceQuantity: number;
    targetQuantity: number;
    sectionReference: string;
    allocatedSectionReference: string;
    splitType: SplitType;
    allocationSourceType: AllocationType;
    allocationTargetType: AllocationType;
    contractInvoiceTypeId: ContractInvoiceType;
}
