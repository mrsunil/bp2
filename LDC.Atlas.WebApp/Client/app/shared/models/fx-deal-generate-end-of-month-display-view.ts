import { FxDealGenerateEndOfMonth } from '../entities/fx-deal-generate-end-of-month.entity';
import { TradeCostMonthEndMappingErrors } from '../entities/tradecost-monthend-mappingerrors-entity';

export class FxDealGenerateEndOfMonthDisplayView {
    dealNumber: string;
    accrualNumber: number;
    costType: string;
    departmentCode: string;
    dealCurrency: string;
    settlementCurrency: string;
    associatedClient: string;
    dealAmount: number;
    settlementAmount: number;
    marketCcyRoeDealt: number;
    maturityDate: Date;
    marketCcyRoeSettlement: number;
    variationMargin: number;
    accountNumber: string;
    accountDescription: string;
    currencyCode: string;
    line1NominalAccountCode: string;
    line2NominalAccountCode: string;
    line1NominalAccountDesc: string;
    line2NominalAccountDesc: string;
    fxDealMonthEndMappingErrors: TradeCostMonthEndMappingErrors[];
    constructor(fxDeal: FxDealGenerateEndOfMonth) {
        if (fxDeal) {
            this.costType = fxDeal.costType;
            this.departmentCode = fxDeal.departmentCode;
            this.associatedClient = fxDeal.associatedClient;
            this.accrualNumber = fxDeal.accrualNumber;
            this.dealNumber = fxDeal.dealNumber;
            this.dealCurrency = fxDeal.dealCurrency;
            this.settlementCurrency = fxDeal.settlementCurrency;
            this.dealAmount = fxDeal.dealAmount;
            this.maturityDate = fxDeal.maturityDate;
            this.settlementAmount = fxDeal.settlementAmount;
            this.marketCcyRoeDealt = fxDeal.marketCcyRoeDealt;
            this.marketCcyRoeSettlement = fxDeal.marketCcyRoeSettlement;
            this.variationMargin = fxDeal.variationMargin;
            this.accountNumber = fxDeal.accountNumber;
            this.accountDescription = fxDeal.accountDescription;
            this.currencyCode = fxDeal.currencyCode;
            this.line1NominalAccountCode = fxDeal.line1NominalAccountCode;
            this.line2NominalAccountCode = fxDeal.line2NominalAccountCode;
            this.line1NominalAccountDesc = fxDeal.line1NominalAccountDesc;
            this.line2NominalAccountDesc = fxDeal.line2NominalAccountDesc;
            this.fxDealMonthEndMappingErrors=fxDeal.fxDealMonthEndMappingErrors;
        }
    }
}
