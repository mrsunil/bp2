export class TradeStatus {
    // tslint:disable-next-line:max-line-length
    // this class is used to have matching values with the Trade Cost /Movement Ssrs Report. which is using a stored proc [Report].[TradeStatus]
    private static list: TradeStatus[];
    private static readonly open = new TradeStatus(1, 'Open');
    private static readonly closed = new TradeStatus(2, 'Closed');
    private static readonly realized = new TradeStatus(3, 'Executed');
    private static readonly unrealized = new TradeStatus(4, 'Non-Executed');
    private static readonly zeroTonnage = new TradeStatus(5, 'Zero Tonnages');
    private static readonly cancelled = new TradeStatus(5, 'Cancelled');

    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }

    public static getStatusList(): TradeStatus[] {
        if (!this.list) {
            this.list =
                [
                    this.open,
                    this.closed,
                    this.realized,
                    this.unrealized,
                    this.zeroTonnage,
                    this.cancelled,
                ];
        }
        return this.list;
    }

    public static getStatusStringList(): string[] {
        if (!this.list) {
            this.list =
                [
                    this.open,
                    this.closed,
                    this.realized,
                    this.unrealized,
                    this.zeroTonnage,
                    this.cancelled,
                ];
        }
        return this.list.map((item) => item.name);
    }
}
