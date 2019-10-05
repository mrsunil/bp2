import { PhysicalContractToUpdate } from './physical-contract-to-update.entity';
import { SectionToUpdate } from './section-to-update.entity';

export class PhysicalTradeBulkEdit {
    companyId: string;
    physicalContractToUpdate: PhysicalContractToUpdate[];
    sectionToUpdate: SectionToUpdate[];

    constructor(companyId: string, physicalContractToUpdate: PhysicalContractToUpdate[] = null,
        sectionToUpdate: SectionToUpdate[] = null) {
        this.companyId = companyId;
        this.physicalContractToUpdate = physicalContractToUpdate;
        this.sectionToUpdate = sectionToUpdate;
    }
}
