import { Arbitration } from '../../shared/entities/arbitration.entity';
import { Commodity } from '../../shared/entities/commodity.entity';
import { ContractTerm } from '../../shared/entities/contract-term.entity';
import { Counterparty } from '../../shared/entities/counterparty.entity';
import { Department } from '../../shared/entities/department.entity';
import { EnumEntity } from '../../shared/entities/enum-entity.entity';
import { PaymentTerm } from '../../shared/entities/payment-term.entity';
import { ProfitCenter } from '../../shared/entities/profit-center.entity';

export class TemplateManagementLine {
    selected: boolean;
    inactive: boolean;
    profitCenter: ProfitCenter[];
    department: Department[];
    commodity: Commodity[];
    modeOftransport: string[];
    contractType: EnumEntity[];
    arbitrationCode: Arbitration[];
    contractTerms: ContractTerm[];
    paymentTerms: PaymentTerm[];
    counterparty: Counterparty[];
    counterpartyClass: string[];
    name: string;
    entityId: string;
    entityExternalId: string;

    constructor() {
    }
}
