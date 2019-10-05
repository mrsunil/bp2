import { AccountImportWarningErrorMsg } from './accountingImport-warning-error-msg.entity';
import { AccountingImportList } from './accounting-import-list.entity';

export class AccountingImportReport {
    blockerData: AccountImportWarningErrorMsg[] = [];
    goodData: AccountImportWarningErrorMsg;
    goodDataList: AccountingImportList[] = [];
    disableConfirmImport: Boolean;
}
