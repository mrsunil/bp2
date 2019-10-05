import { LdrepManualAdjustmentRecords } from "./ldrep-manual-adjustment-records.entity";

export class LdrepManualAdjustment {
    company: string;
    dateFrom: Date;
    dateTo: Date;
    ldrepManualAdjustmentRecords: LdrepManualAdjustmentRecords[] = [];
}