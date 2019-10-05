
export interface CheckboxTriStateCellRendererParams {
    disabled: boolean | ((params: any) => boolean);
    originalCheckStatusField: string;
    onCellValueChanged: ((params) => void);
}
