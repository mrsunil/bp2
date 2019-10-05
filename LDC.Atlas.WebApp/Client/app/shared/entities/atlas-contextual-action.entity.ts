export class AtlasContextualAction {
    text?: string;
    icon?: string;
    disabled: boolean | (() => boolean);
    action: string;

    constructor(text: string, disabled: (() => boolean) | boolean, action: string, icon: string = null) {
        this.text = text;
        this.disabled = disabled;
        this.action = action;
        this.icon = icon;
    }

    isDisabled(): boolean {
        if (typeof (this.disabled) === 'function') {
            return this.disabled();
        }
        return this.disabled;
    }
}
