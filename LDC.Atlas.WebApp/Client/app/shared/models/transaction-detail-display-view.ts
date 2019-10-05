import { TransactionDetail } from '../entities/transaction-detail.entity';

export class TransactionDetailDisplayView {
    transactionDocumentId: number;
    transactionDocumentTypeId: number;

    constructor(transactionDetail: TransactionDetail) {
        if (transactionDetail) {
            this.transactionDocumentId = transactionDetail.transactionDocumentId;
            this.transactionDocumentTypeId = transactionDetail.transactionDocumentTypeId;
        }
    }
}
