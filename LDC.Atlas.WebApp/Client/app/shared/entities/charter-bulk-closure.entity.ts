import { CharterStatus } from "../enums/charter-status.enum";
import { AssignedSectionToCharterBulkClosure } from "./assigned-section-to-charter-bulk-closure.entity";

export class CharterBulkClosure {
    dataVersionId: number;
    charterId: number;
    charterCode: string;
    statusId: CharterStatus;
    sectionsAssigned: AssignedSectionToCharterBulkClosure[];
    category?: string;
    message?: string;
    vesselName: string;
    description?: string;

    constructor(charterData?: CharterBulkClosure) {
        if (charterData) {
            this.dataVersionId = charterData.dataVersionId;
            this.charterId = charterData.charterId;
            this.charterCode = charterData.charterCode;
            this.statusId = charterData.statusId;
            this.sectionsAssigned = charterData.sectionsAssigned;
            this.category = charterData.category;
            this.message = charterData.message;
            this.vesselName = charterData.vesselName;
            this.description = charterData.description;
        }
    }
}