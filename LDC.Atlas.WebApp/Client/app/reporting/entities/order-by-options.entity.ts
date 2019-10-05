export class OrderByOptions {
    private static list: OrderByOptions[];
    private static readonly date = new OrderByOptions(0, 'Date');

    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }

    public static getOptionList(): OrderByOptions[] {
        if (!this.list) {
            this.list =
                [
                    this.date,
                ];
        }
        return this.list;
    }

    public static getOptionStringList(): string[] {
        if (!this.list) {
            this.list =
                [
                    this.date,
                ];
        }
        return this.list.map((item) => item.name);
    }
}
