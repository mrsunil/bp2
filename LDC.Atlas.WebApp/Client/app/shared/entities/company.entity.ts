import * as moment from 'moment';

export class Company {
    companyId: string;
    id: number;
    description: string;
    isFrozen: boolean;
    timeZoneName: string;
    activeDate: Date = null;
    functionalCurrencyCode: string;
    statutoryCurrencyCode: string;
    counterpartyId?: number;
    isCounterpartyGroupAccount: boolean;
    companyFriendlyCode: string;
    lastDateRefresh: moment.Moment = moment().subtract(1, 'days');
    companyDate: moment.Moment;
    priceCode: string;
    weightCode: string;
    countryCode: string;
    ldcRegionCode: string;
    companyType: string;
    companyPlatform: string;
    countryDescription: string;
    legalEntityCode: string;
    legalEntity: string;
    canEditFunctionalCurrency: boolean;
    canEditStatutoryCurrency: boolean;
    cropYearId: number;
    defaultBrokerId: number;
    defaultNominalAccountDealId: number;
    defaultNominalAccountSettlementId: number;
    defaultProvinceId: number;
    defaultBranchId: number;
    isProvinceEnable: boolean;
    defaultDepartmentId: number;
}
