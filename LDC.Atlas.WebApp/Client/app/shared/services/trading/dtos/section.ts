import { Cost } from '../../../entities/cost.entity';

export class UpdateSectionRequest<T> {
    public section: T;
    public trackChanges: SectionTrackChanges;
    public isBLDateChanged = false;
    public company: string;
}

export class SectionTrackChanges {
    public costsChanges: TrackChanges<Cost>;
}

export class TrackChanges<T> {
    public deletedIdentifiers: number[];
    public modifiedItems: T[];
    public addedItems: T[];
}

export class SplitCreationResult {
    contractLabel: string;
    sectionId: number;
    sectionOriginId: number;
    costs: Cost[];
    constructor(sectionId: number, contractLabel: string = '', costs: Cost[] = null) {
        this.sectionId = sectionId;
        this.contractLabel = contractLabel;
        this.costs = costs;
    }

}

export class TrancheSplitCreationResult {
    contractLabel: string;
    sectionId: number;
    costs: Cost[];
    constructor(sectionId: number, contractLabel: string = '', costs: Cost[] = null) {
        this.sectionId = sectionId;
        this.contractLabel = contractLabel;
        this.costs = costs;
    }
}

export class SplitCreationDetails {
    sectionIds: number[];
    contractedValues: string[];
    quantity: number;
    dataVersionId?: number;
}


export class BulkSplitCreationDetails {
    sectionId: number;
    contractedValues: string[];
    quantity: number[];
    dataVersionId?: number;
}
