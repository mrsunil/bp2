import { InvoiceMarkings } from '../../../../shared/entities/invoice-markings.entity';

export class InvoiceMarkingListCommand {
    invoices: InvoiceMarkings[] = [];
    invoiceStatusId: number;
    sectionId: number;
    splitAction: boolean;
    dataVersionId: number;
}
