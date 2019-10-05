export class TradeMergeOptions {
    private static list: TradeMergeOptions[];
    private static readonly contractHeader = new TradeMergeOptions(1, 'Contract Header(.0000)');
    private static readonly contractParent = new TradeMergeOptions(2, 'Contract [Parent]');
    private static readonly firstSelectedSplit = new TradeMergeOptions(3, '1st Selected Split');

    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }

    public static getTradeMergeOptionsList(): TradeMergeOptions[] {
        if (!this.list) {
            this.list =
                [
                    this.contractHeader,
                    this.contractParent,
                    this.firstSelectedSplit,
                ];
        }
        return this.list;
    }

    public static getTradeMergeOptionsStringList(): string[] {
        if (!this.list) {
            this.list =
                [
                    this.contractHeader,
                    this.contractParent,
                    this.firstSelectedSplit,
                ];
        }
        return this.list.map((item) => item.name);
    }
}
