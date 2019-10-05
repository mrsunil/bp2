export class CompanyTabIndex {
    companyId: string;
    tabIndex: number;

    constructor(companyId: string, tabIndex: number = 0) {
        this.companyId = companyId;
        this.tabIndex = tabIndex;
    }
}
