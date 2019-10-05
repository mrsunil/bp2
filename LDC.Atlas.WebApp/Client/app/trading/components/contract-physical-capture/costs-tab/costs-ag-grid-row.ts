import { CostDirection } from '../../../../shared/entities/cost-direction.entity';
import { Cost } from '../../../../shared/entities/cost.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { RateTypes } from '../../../../shared/enums/rate-type.enum';

export class CostListDisplayView {
    costId: number;
    rowStatus: string;
    bestMatch: string;
    sectionId: number;
    costTypeCode: string;
    description: string;
    supplierCode: string;
    costDirection: string;
    currencyCode: string;
    rateTypeCode: string;
    priceCode: string;
    rate: number;
    inPL: boolean;
    noAction: boolean;
    invoiceStatus: number;
    narrative: string;
    costMatrixLineId: number;
    originalEstimatedPMTValue: number;
    originalEstRateTypeCode: string;
    originalEstPriceCode: string;
    originalEstCurrencyCode: string;
    originalEstRate: number;
    companyId: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    contextInformation: string;
    isDirty: boolean;
    documentReference: string;
    documentDate: Date;
    invoicePercent: number;
    costMatrixName: string;
    isAddOrOverride: string;

    constructor(cost?: Cost, masterdata?: MasterData, costDirections?: CostDirection[]) {
        if (cost) {
            this.costId = cost.costId;
            this.rowStatus = cost.rowStatus;
            this.bestMatch = cost.bestMatch;
            this.sectionId = cost.sectionId;
            this.costTypeCode = cost.costTypeCode;
            this.description = this.getCostTypeDescriptionFromCode(cost.costTypeCode, masterdata);
            this.supplierCode = cost.supplierCode;
            this.costDirection = this.getCostDirectionCodeFromId(cost.costDirectionId, costDirections);
            this.currencyCode = cost.currencyCode;
            this.rateTypeCode = this.getRateCodeFromId(cost.rateTypeId, masterdata);
            this.priceCode = cost.priceUnitId && cost.priceUnitId !== 0 ? this.getPriceCodeFromId(cost.priceUnitId, masterdata) : '';
            this.rate = cost.rate;
            this.inPL = cost.inPL;
            this.noAction = cost.noAction;
            this.invoiceStatus = cost.invoiceStatus;
            this.narrative = cost.narrative;
            this.costMatrixLineId = cost.costMatrixLineId;
            this.originalEstimatedPMTValue = cost.originalEstimatedPMTValue;
            this.originalEstRateTypeCode = this.getRateCodeFromId(cost.originalEstRateTypeId, masterdata);
            this.originalEstPriceCode = cost.originalEstPriceUnitId && cost.originalEstPriceUnitId !== 0 ?
                this.getPriceCodeFromId(cost.originalEstPriceUnitId, masterdata) : '';
            this.originalEstCurrencyCode = cost.originalEstCurrencyCode;
            this.originalEstRate = cost.originalEstRate;
            this.companyId = cost.companyId;
            this.createdDateTime = cost.createdDateTime;
            this.createdBy = cost.createdBy;
            this.modifiedDateTime = cost.modifiedDateTime;
            this.modifiedBy = cost.modifiedBy;
            this.contextInformation = cost.contextInformation;
            this.documentReference = cost.documentReference;
            this.documentDate = cost.documentDate;
            this.invoicePercent = cost.invoicePercent;
            this.costMatrixName = cost.costMatrixName;
        }
    }

    getCostTypeDescriptionFromCode(code, masterdata: MasterData) {
        const costType = masterdata.costTypes.find(
            (e) => e.costTypeCode === code);
        return costType ? costType.name : '';
    }

    getRateCodeFromId(id, masterdata: MasterData) {
        const rateCode = RateTypes[id];
        return rateCode;
    }

    getPriceCodeFromId(id, masterdata: MasterData) {
        const priceCode = masterdata.priceUnits.find(
            (e) => e.priceUnitId === id);
        return priceCode ? priceCode.priceCode : '';
    }

    getCostDirectionCodeFromId(id, costDirections: CostDirection[]) {
        const costDirection = costDirections.find(
            (e) => e.costDirectionId === id);
        return costDirection ? costDirection.costDirection : '';
    }

    getCost(masterdata, costDirections: CostDirection[]) {
        const cost = new Cost();
        cost.costId = this.costId;
        cost.sectionId = this.sectionId;
        cost.costTypeCode = this.costTypeCode;
        cost.description = this.description;
        cost.supplierCode = this.supplierCode;
        cost.costDirectionId = this.getCostDirectionIdFromCode(this.costDirection, costDirections);
        cost.currencyCode = this.currencyCode;
        cost.rateTypeId = this.getRateTypeIdFromCode(this.rateTypeCode, masterdata);
        if (this.priceCode) {
            cost.priceUnitId = this.getPriceUnitIdFromCode(this.priceCode, masterdata);
        }
        cost.rate = this.rate;
        cost.inPL = this.inPL;
        cost.noAction = this.noAction;
        cost.invoiceStatus = this.invoiceStatus;
        cost.narrative = this.narrative;
        cost.costMatrixLineId = this.costMatrixLineId;
        cost.originalEstimatedPMTValue = this.originalEstimatedPMTValue;
        cost.originalEstRateTypeId = this.getRateTypeIdFromCode(this.originalEstRateTypeCode, masterdata);
        if (this.originalEstPriceCode) {
            cost.originalEstPriceUnitId = this.getPriceUnitIdFromCode(this.originalEstPriceCode, masterdata);
        }
        cost.originalEstCurrencyCode = this.originalEstCurrencyCode;
        cost.originalEstRate = this.originalEstRate;
        cost.companyId = this.companyId;
        cost.createdDateTime = this.createdDateTime;
        cost.createdBy = this.createdBy;
        cost.modifiedDateTime = this.modifiedDateTime;
        cost.modifiedBy = this.modifiedBy;
        cost.contextInformation = this.contextInformation;
        cost.documentReference = this.documentReference;
        cost.documentDate = this.documentDate;
        cost.invoicePercent = this.invoicePercent;
        cost.costMatrixName = this.costMatrixName;

        return cost;
    }

    getRateTypeIdFromCode(code: string, masterdata: MasterData) {
        const rateTypeId = RateTypes[code];
        return rateTypeId;
    }

    getPriceUnitIdFromCode(code: string, masterdata: MasterData) {
        const priceUnit = masterdata.priceUnits.find(
            (e) => e.priceCode === code);
        return priceUnit ? priceUnit.priceUnitId : null;
    }

    getCostDirectionIdFromCode(code: string, costDirections: CostDirection[]) {
        const costDirection = costDirections.find(
            (e) => e.costDirection === code);
        return costDirection ? costDirection.costDirectionId : null;
    }

}
