export class CancelTrade {
    counterParty: string;
    cancellationDate: Date;
    dueDate: Date;
    contractPrice: string;
    currency: string;
    priceCode: string;
    settlementPrice: number;
    settlementValue: string;
    quantity: number;
    quantityCode: string;
    nominalAccount: string;
    costType: string;
    narrative: string;
    externalInternal: number;
    template: string;
    isSectionClosed: boolean;
    contractLabel: string;
    costTypeForCancellationLoss: string;
}
