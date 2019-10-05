export class AgContextualMenuAction {
    icon: string;
    text: string;
    action: string;
    disabled?: boolean | ((params: any) => boolean);

}
