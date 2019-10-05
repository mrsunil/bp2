export class SectionReference {
    sectionId: number;
    dataVersionId: number;
    selectedTab: number = 0;

    constructor(sectionId: number, dataVersionId: number, selectedTab: number = 0) {
        this.sectionId = sectionId;
        this.dataVersionId = dataVersionId;
        this.selectedTab = selectedTab;
    }
}