import { Injectable } from '@angular/core';
import { Charter } from '../../shared/entities/charter.entity';
import { MasterData } from '../../shared/entities/masterdata.entity';
import { CashType } from '../../shared/enums/cash-type.enum';
import { TransactionDocument } from '../../shared/enums/transaction-document.enum';
import { CharterDisplayView } from '../../shared/models/charter-display-view';
import { CashMatching } from '../../shared/services/execution/dtos/cash-matching';
import { CommonEntity } from '../../shared/entities/common-entity';
import { WarningMessageTypes } from '../../shared/enums/warning-message-type.enum';

@Injectable({
    providedIn: 'root',
})
export class CommonMethods {
    constructor(
    ) { }
    // get counterpartyid based on counterpartyCode from masterdata
    public getCounterpartyIdBasedOnCodeFromMasterData(counterpartyCode: string, masterData: MasterData): number {

        if (masterData.counterparties && masterData.counterparties.length > 0) {
            const counterparty = masterData.counterparties.filter(
                (item) => item.counterpartyCode === counterpartyCode,
            );
            if (counterparty.length > 0) {
                return counterparty[0].counterpartyID;
            }
        }
    }

    // get departmentcode based on departmentId from masterdata
    public getCounterpartyCodeBasedOnIdFromMasterData(counterpartyID: number, masterData: MasterData): string {

        if (masterData.counterparties && masterData.counterparties.length > 0) {
            const counterparty = masterData.counterparties.filter(
                (item) => item.counterpartyID === counterpartyID,
            );
            if (counterparty.length > 0) {
                return counterparty[0].counterpartyCode;
            }
        }
    }

    // get department id based on departmentcode from masterdata
    public getDepartmentIdBasedOnCodeFromMasterData(departmentCode: string, masterData: MasterData): number {

        if (masterData.departments && masterData.departments.length > 0) {
            const department = masterData.departments.filter(
                (item) => item.departmentCode === departmentCode,
            );
            if (department.length > 0) {
                return department[0].departmentId;
            }
        }
    }

    // get department code based on departmentId from masterdata
    public getDepartmentCodeBasedOnIdFromMasterData(departmentID: number, masterData: MasterData): string {

        if (masterData.departments && masterData.departments.length > 0) {
            const department = masterData.departments.filter(
                (item) => item.departmentId === departmentID,
            );
            if (department.length > 0) {
                return department[0].departmentCode;
            }
        }
    }

    // get department code and description  based on departmentId from masterdata
    public getDepartmentCodeDescriptionBasedOnIdFromMasterData(departmentID: number, masterData: MasterData): string {

        if (masterData.departments && masterData.departments.length > 0) {
            const department = masterData.departments.filter(
                (item) => item.departmentId === departmentID,
            );
            if (department.length > 0) {
                return department[0].departmentCode + ' | ' + department[0].description;
            }
        }
    }

    // get payementTermcode based on paymentID from Masterdata
    getPaymentTermCodeBasedOnIdFromMasterData(paymentTermId: number, masterData: MasterData): string {
        if (masterData.paymentTerms && masterData.paymentTerms.length > 0) {
            const paymentTerm = masterData.paymentTerms.filter(
                (item) => item.paymentTermsId === paymentTermId,
            );
            if (paymentTerm.length > 0) {
                return paymentTerm[0].paymentTermCode;
            }
        }
    }

    // get charter code based on charterid from charterList
    getCharterReferenceBasedOnIdFromCharterList(charterId: number, charters: CharterDisplayView[]): string {
        if (charters && charters.length > 0) {
            const charter = charters.filter(
                (item) => item.charterId === charterId,
            );
            if (charter.length > 0) {
                return charter[0].charterCode;
            }
        }
    }

    // This method returns the sign to show in the document amount with sign in
    // invoice list in pick by transaction page in cash module.
    // Here documentType are like PI,SI,CN,DN and costDirectionId is Pay/receipt
    getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection(documentType: string, costDirectionId: number, document: CashMatching, isLoading: boolean)
        : number {
        let signedValue = 1;
        if (documentType && costDirectionId) {
            if (documentType === TransactionDocument.PurchaseInvoice || documentType === TransactionDocument.CreditNote
            ) {
                signedValue = -1;
            } else if (documentType === TransactionDocument.SalesInvoice || documentType === TransactionDocument.DebitNote
            ) {
                signedValue = 1;
            }
            else if ((documentType === TransactionDocument.JournalEntry
                || documentType === TransactionDocument.CashPayment) && !isLoading) {
                signedValue = Math.sign(document.amount);
            }
            else if (documentType === TransactionDocument.CashReceipt) {
                signedValue = Math.sign(document.amount) * (-1);
            }

            if (isLoading) {
                return signedValue;
            }
            else {

                return (costDirectionId === CashType.CashPayment) ? signedValue : -signedValue;
            }
        }
    }

    // this method will return charterid from charterlist based on charter code
    getCharterIdFromCharterList(charterCode: string, charters: Charter[]): number {
        if (charters && charters.length > 0) {
            const charter = charters.find((item) => item.charterCode === charterCode);
            if (charter) {
                return charter.charterId;
            }
        }
    }

    // this method is used to format the number to comma separated value with decimal points.
    // ex: 123456.13 => 123,456.13
    // ex: 123 => 123.00
    getFormattedNumberValue(value: any, numberOfDigits: number = 2) {
        if (isNaN(value) || value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: numberOfDigits, maximumFractionDigits: numberOfDigits }).
            format(value);

    }

    // This method used while allocation of trades.
    // based on the feild setup value it will add message and error type id to the common entity.
    populateAllocationMessages(isdifferenceBlocking: boolean,
        isDifferenceWarning: boolean, message: string): CommonEntity {
        let errorMessage = new CommonEntity();

        errorMessage.message = message;
        errorMessage.id = isdifferenceBlocking ? WarningMessageTypes.Restricted :
            (isDifferenceWarning ? WarningMessageTypes.Warning : null);

        return errorMessage;
    }
}
