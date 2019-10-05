import { InvoiceTypes } from '../../../enums/invoice-type.enum';

export class InvoiceHomeSearch {
    public invoiceLabel: string;
    public invoiceType: InvoiceTypes;
    public invoiceDate: Date;
    public counterpartyCode: string;
    public dueDate: Date;
    public description: string;
    public counterpartyAdress: string;
    public totalInvoiceValue: number;
    public currency: string;
}
