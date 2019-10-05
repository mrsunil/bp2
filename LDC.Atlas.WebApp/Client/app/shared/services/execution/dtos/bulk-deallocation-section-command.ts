import { DeallocateBulkSections } from "./deallocate-bulk-sections";

export class BulkDeallocateSectionCommand {
    company: string;
    dataVersionId: number;
    deallocateBulkSections: DeallocateBulkSections[];

}