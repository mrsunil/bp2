export class ColumnsList {
    // this class is used to have matching values with the Additional Columns if required for PNL /Movement Ssrs Report.
    private static list: ColumnsList[];
    private static readonly cmy1 = new ColumnsList(1, 'Cmy1');

    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }

    public static getColumnsList(): ColumnsList[] {
        if (!this.list) {
            this.list =
                [
                    this.cmy1,
                ];
        }
        return this.list;
    }

    public static getColumnsStringList(): string[] {
        if (!this.list) {
            this.list =
                [
                    this.cmy1,
                ];
        }
        return this.list.map((item) => item.name);
    }
}
