import { ManualImportWarningErrorMsg } from './manualImport-warning-error-msg.entity';

export class ManualImportReport {
    importId: string;
    fxRateStageIds: number[] = [];
    blockerData: ManualImportWarningErrorMsg[] = [];
    warningData: ManualImportWarningErrorMsg[] = [];
    goodData: ManualImportWarningErrorMsg;
    disableConfirmImport: Boolean;
}
