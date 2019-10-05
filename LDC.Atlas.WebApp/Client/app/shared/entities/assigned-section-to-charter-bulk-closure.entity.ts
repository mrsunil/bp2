import { CostAssignedToSection } from "./cost-assigned-to-section";

export class AssignedSectionToCharterBulkClosure {
    dataVersionId: number;
    charterId: number;
    sectionId: number;
    isClosed: boolean;
    category?: string;
    message?: string;
    contractSectionCode: string;
    netAccuralPnLValue: number;
    percentageInvoice: number;
    currencyCode: string;
    costAssigned: CostAssignedToSection[];
}
