import { Tag } from '../../../entities/tag.entity';
import { CostmatrixLine } from './costmatrixLine';

export class Costmatrix {
    costMatrixId: number;
    name: string;
    description: string;
    costMatrixLines: CostmatrixLine[];
    createdBy: string;
    createdDateTime: Date;
    tags: Tag[];
    bestMatch: number;
    tagsFormatted: string[];
}
