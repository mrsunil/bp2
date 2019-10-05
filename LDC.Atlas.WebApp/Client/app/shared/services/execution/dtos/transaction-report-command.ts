import { BalancesType } from '../../../../shared/enums/balances-type.enum';
import { MatchingsType } from '../../../../shared/enums/matchings-type.enum';
import { NominalAccountType } from '../../../../shared/enums/nominal-account-type-enum';
import { ReportStyleType } from '../../../../shared/enums/report-style-type.enum';
import { UnmatchedType } from '../../../../shared/enums/unmatched-type.enum';

export class TransactionReportCommand {
    fromDate: Date;
    toDate: Date;
    balanceType: BalancesType;
    reportStyleType: ReportStyleType;
    matchingType: MatchingsType;
    unmatchedType: UnmatchedType;
    functionalCurrency: boolean;
    broughtForward :boolean;
    accuralsIncluded: boolean;
    accountType: NominalAccountType;
    documentFromDate: Date;
    documentToDate: Date;
}
