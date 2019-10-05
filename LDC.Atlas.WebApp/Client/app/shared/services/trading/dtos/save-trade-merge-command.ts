import { MergeContracts } from '../../../../shared/entities/merge-contracts.entity';

export class SaveTradeMergeCommand {
    mergeContracts: MergeContracts[];
    dataVersionId?: number;
}
