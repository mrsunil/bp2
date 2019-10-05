export class DocumentPopupButtonSettings {
    createButtonText: string;
    uploadButtonText: string;
    createButtonTooltip: string;
    uploadButtonTooltip: string;

    constructor() {
        this.createButtonText = 'Use Atlas Template';
        this.uploadButtonText = 'Edit Template';
        this.createButtonTooltip = 'Generate the document from Atlas';
        this.uploadButtonTooltip = 'Generate the document from the file you edited and saved from your computer';
    }
}
