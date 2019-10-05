import { AdditionalCost } from '../../../../../shared/entities/additional-cost.entity';
import { CostDirection } from '../../../../../shared/entities/cost-direction.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';

export class AdditionalCostListDisplayView {
    cashAdditionalCostId: number;
    costDirection: string;
    costType: string;
    nominalAccountCode: string;
    accountLineType: string;
    currencyCode: string;
    amount: number;
    narrative: string;
    isDirty: boolean;
    accountCode: string;
    counterpartyCode: string;
    clientAccount: number;
    customerVendor: string;
    costTypeCode: string;
    nominalAccountNumber: string;
    clientAccountMandatory: boolean;

    constructor(additionalCost?: AdditionalCost, masterdata?: MasterData, costDirections?: CostDirection[]) {
        if (additionalCost) {
            this.cashAdditionalCostId = additionalCost.cashAdditionalCostId;
            this.costDirection = this.getCostDirectionCodeFromId(additionalCost.costDirectionId, costDirections);
            this.costTypeCode = additionalCost.costTypeCode;
            this.accountCode = additionalCost.accountCode;
            this.nominalAccountNumber = additionalCost.accountCode;
            this.accountLineType = additionalCost.accountLineType;
            this.currencyCode = additionalCost.currencyCode;
            this.amount = additionalCost.amount;
            this.narrative = additionalCost.narrative;
            this.accountLineType = additionalCost.accountLineType;
            this.counterpartyCode = this.getCounterpartyDetail(additionalCost.clientAccount, masterdata.counterparties, true);
            this.customerVendor = this.getCustomerVendorFromNominalAccountDetail(additionalCost.accountCode, masterdata);
            this.clientAccountMandatory = this.getclientAccountMandatoryFromNominalAccountDetail(additionalCost.accountCode, masterdata);
        }
    }

    getCostDirectionCodeFromId(id, costDirections: CostDirection[]): string {
        const costDirectionCode = costDirections.filter(
            (e) => e.costDirectionId === id)[0].costDirection;
        return costDirectionCode;
    }

    getAdditionalCost(masterdata, costDirections: CostDirection[]): AdditionalCost {
        const additionalCost = new AdditionalCost();

        additionalCost.cashAdditionalCostId = this.cashAdditionalCostId;
        additionalCost.costDirectionId = this.getCostDirectionIdFromCode(this.costDirection, costDirections);
        additionalCost.costTypeCode = this.costTypeCode;
        additionalCost.accountLineType = this.accountLineType;
        additionalCost.currencyCode = this.currencyCode;
        additionalCost.amount = this.amount;
        additionalCost.narrative = this.narrative;
        additionalCost.accountId =
            this.getNominalOrClientAccountIdFromCode(this.accountCode, masterdata.nominalAccounts, masterdata.counterparties);
        additionalCost.accountCode = this.accountCode;
        additionalCost.clientAccount = this.getCounterpartyDetail(this.counterpartyCode, masterdata.counterparties, false);
        additionalCost.customerVendor = this.customerVendor;
        additionalCost.clientAccountMandatory = this.clientAccountMandatory;
        return additionalCost;
    }

    getCostDirectionIdFromCode(code: string, costDirections: CostDirection[]): number {
        const costDirectionId = costDirections.filter(
            (e) => e.costDirection === code)[0].costDirectionId;
        return costDirectionId;
    }

    getNominalOrClientAccountIdFromCode(code: string, nominalAccounts: NominalAccount[], counterparties: Counterparty[]): number {
        let nominalOrClientAccountId: number = 0;

        const filteredNominalAccount = nominalAccounts.filter(
            (e) => e.accountNumber === code);

        const filteredCounterParty = counterparties.filter(
            (e) => e.counterpartyCode === code);

        if (filteredNominalAccount.length > 0) {
            nominalOrClientAccountId = filteredNominalAccount[0].nominalAccountId;
        } else if (filteredCounterParty.length > 0) {
            nominalOrClientAccountId = filteredCounterParty[0].counterpartyID;
        }

        return nominalOrClientAccountId;
    }

    getCounterpartyDetail(value: any, counterparties: Counterparty[], getCodeFromId: boolean): any {

        const filteredCounterParty = counterparties.filter(
            (e) => getCodeFromId === true ? e.counterpartyID === value : e.counterpartyCode === value);

        if (filteredCounterParty.length > 0) {
            return getCodeFromId === true ? filteredCounterParty[0].counterpartyCode : filteredCounterParty[0].counterpartyID;
        }
    }
    getCustomerVendorFromNominalAccountDetail(nominalCode: string, masterdata: MasterData) {

        const nominalAccount = masterdata.nominalAccounts.find(
            (item) => item.accountNumber === nominalCode ,
        );
        return nominalAccount ? nominalAccount.customerVendor : '';
    }
    getclientAccountMandatoryFromNominalAccountDetail(nominalCode: string, masterdata: MasterData) {

        const nominalAccount = masterdata.nominalAccounts.find(
            (item) => item.accountNumber === nominalCode ,
        );
        return (nominalAccount && nominalAccount.clientAccountMandatory === 1) ? true : false;
    }
}
