import { CompanyConfiguration } from './company-configuration.entity';
import { CompanyUserProfile } from './company-user-profile.entity';

export class CreateCompany {
    companyId: string;
    companyToCopy: string;
    isCounterpartyRequired: boolean;
    isTransactionDataSelected: boolean;
    companyConfiguration: CompanyConfiguration;
    companyUserProfile: CompanyUserProfile[];
}
