import { AccountingFieldSetup } from './accounting-field-setup.entity';
import { AccountingParameter } from './accounting-parameter.entity';
import { AllocationSetUp } from './allocation-set-up-entity';
import { CompanySetup } from './company-setup.entity';
import { DefaultAccountingSetupResult } from './default-accounting-setup-result.entity';
import { IntercoNoIntercoEmailSetup } from './interco-no-interco-email-setup.entity';
import { InterfaceSetup } from './interface-setup.entity';
import { InvoiceSetup } from './invoice-Setup.entity';
import { MandatoryTradeApprovalImageSetup } from './mandatory-trade-fields';
import { MappingFields } from './mapping-entity';
import { RetentionPolicy } from './retention-policy.entity';
import { TradeConfiguration } from './trade-configuration-entity';
import { TradeParameter } from './trade-parameter.entity';

export class CompanyConfiguration {
    companyId: string;
    companySetup: CompanySetup;
    interfaceSetup: InterfaceSetup[];
    invoiceSetup: InvoiceSetup;
    tradeConfiguration: TradeConfiguration;
    intercoNoIntercoEmailSetup: IntercoNoIntercoEmailSetup[];
    allocationSetUp: AllocationSetUp[];
    mandatoryTradeApprovalImageSetup: MandatoryTradeApprovalImageSetup[];
    mainAccountingFieldSetup: AccountingFieldSetup[];
    defaultAccountingSetup: DefaultAccountingSetupResult;
    mappingSetup: MappingFields[];
    accountingParameters: AccountingParameter[];
    tradeParameters: TradeParameter[];
    retentionPolicy: RetentionPolicy;
}
