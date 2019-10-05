import { Moment } from "moment";

export class LdrepManualAdjustmentRecords {
    manualAdjustmentId: number;
    companyId: number;
    fromDateFormat: number;
    dateFrom: Moment;
    toDateFormat: number;
    dateTo: Moment;
    departmentId: number;
    pnlTypeId: number;
    realized: boolean;
    functionalCCYAdjustment: number;
    statutoryCCYAdjustment: number;
    narrative: string;
    charterRefrenceId: number;
    departmentCode: string;
    pnlType: string;
    charterCode: string;
    contractSectionCode: string;
    principalCommodity: string;
    sectionId: number;
    commodityId: number;
    cropYear: string;
}