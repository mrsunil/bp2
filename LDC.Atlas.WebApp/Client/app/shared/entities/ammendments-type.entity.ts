export class AmendmentsType {
    private static list: AmendmentsType[];
    private static readonly physicalAmendments = new AmendmentsType(1, 'Physicals Amendments');
    private static readonly costsAmendments = new AmendmentsType(2, 'Costs Amendments');
    private static readonly invoiceGoods = new AmendmentsType(3, 'Invoices Goods');
    private static readonly invoiceCosts = new AmendmentsType(4, 'Invoices Costs');
    private static readonly fxDealAmendments = new AmendmentsType(5, 'FX Deal Amendments');

    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }

    public static getAmendmentsTypeList(): AmendmentsType[] {
        this.list =
            [
                this.physicalAmendments,
                this.costsAmendments,
                this.invoiceGoods,
                this.invoiceCosts,
            ];
        return this.list;
    }

    public static getFXDealAmendmentsTypeList(): AmendmentsType[] {
        this.list =
            [
                this.fxDealAmendments,
            ];
        return this.list;
    }

    public static getAmendmentsTypeStringList(): string[] {
        if (!this.list) {
            this.list =
                [
                    this.physicalAmendments,
                    this.costsAmendments,
                    this.invoiceGoods,
                    this.invoiceCosts,
                    this.fxDealAmendments,
                ];
        }
        return this.list.map((item) => item.name);
    }
}
