import { MonthEndTemporaryAdjustmentCommand } from './monthend-temporary-adjustment-command';

export class MonthEndTemporaryAdjustmentListCommand {
    DocumentDate: Date;
    AccountingPeriod: Date;
    dataVersionId: number;
    dataVersionDate: Date;
    reportType: number;
}
