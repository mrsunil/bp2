import { MonthEndTemporaryAdjustmentCommand } from './monthend-temporary-adjustment-command';

export class FXDealMonthEndTemporaryAdjustmentListCommand {
    documentDate: Date;
    accountingPeriod: Date;
    dataVersionId: number;
    dataVersionDate: Date;
    reportType: number;
}
