export class DisplayOptions {
    private static list: DisplayOptions[];
    private static readonly friendlyName = new DisplayOptions(0, 'Friendly name');
    private static readonly technicalName = new DisplayOptions(1, 'Technical name');

    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }

    public static getOptionList(): DisplayOptions[] {
        if (!this.list) {
            this.list =
                [
                    this.friendlyName,
                    this.technicalName,
                ];
        }
        return this.list;
    }

    public static getOptionStringList(): string[] {
        if (!this.list) {
            this.list =
                [
                    this.friendlyName,
                    this.technicalName,
                ];
        }
        return this.list.map((item) => item.name);
    }
}
