import { ContractTypes } from '../../shared/enums/contract-type.enum';
import { TradeImageField } from '../../shared/services/trading/dtos/tradeImageField';

export class TradeImage {
    type: ContractTypes;
    numberOfContracts: number;
    imageEstimates: boolean;
    costMatrixId: number;
    trancheAndSplit: boolean;
    allocateContract: boolean;
    tradeImageField: TradeImageField[];
}
