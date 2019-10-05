export class SectionTabIndex {
    sectionId: number;
    tabIndex: number;

    constructor(sectionId: number, tabIndex: number = 0) {
        this.sectionId = sectionId;
        this.tabIndex = tabIndex;
    }
}
