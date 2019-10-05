import { InvoiceSetupResult } from '../../../dtos/invoice-setup-result';
import { AccountingFieldSetup } from '../../../entities/accounting-field-setup.entity';
import { AccountingParameter } from '../../../entities/accounting-parameter.entity';
import { AllocationSetUp } from '../../../entities/allocation-set-up-entity';
import { Company } from '../../../entities/company.entity';
import { DefaultAccountingSetup } from '../../../entities/default-accounting-setup.entity';
import { InterfaceSetup } from '../../../entities/interface-setup.entity';
import { MandatoryTradeApprovalImageSetup } from '../../../entities/mandatory-trade-fields';
import { RetentionPolicy } from '../../../entities/retention-policy.entity';
import { TradeConfiguration } from '../../../entities/trade-configuration-entity';
import { TradeParameter } from '../../../entities/trade-parameter.entity';
import { IntercoNoIntercoEmails } from './interco-no-interco-emails';

export class CompanyConfigurationRecord {
    companyId: number;
    companySetup: Company;
    invoiceSetup: InvoiceSetupResult;
    interfaceSetup: InterfaceSetup[];
    allocationSetUp: AllocationSetUp[];
    mandatoryTradeApprovalImageSetup: MandatoryTradeApprovalImageSetup[];
    tradeConfiguration: TradeConfiguration;
    interCoNoInterCoEmailSetup: IntercoNoIntercoEmails[];
    mainAccountingSetup: AccountingFieldSetup[];
    accountingParameters: AccountingParameter[];
    tradeParameters: TradeParameter[];
    defaultAccountingSetup: DefaultAccountingSetup;
    retentionPolicy: RetentionPolicy;
}
