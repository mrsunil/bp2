import { Commodity } from './commodity.entity';
import { ContractTerm } from './contract-term.entity';
import { Counterparty } from './counterparty.entity';
import { PaymentTerm } from './payment-term.entity';
import { Vat } from './vat.entity';
import { Vessel } from './vessel.entity';

export interface InvoiceMasterData {
    counterparties: Counterparty[];
    paymentTerms: PaymentTerm[];
    VAT: Vat[];
    commodities: Commodity[];
    contractTerms: ContractTerm[];
    vessels: Vessel[];
}
