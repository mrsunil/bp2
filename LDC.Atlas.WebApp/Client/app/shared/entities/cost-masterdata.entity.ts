import { CostPriceCode } from './cost-price-code.entity';
import { CostType } from './cost-type.entity';
import { RateType } from './rate-type.entity';

export interface CostMasterData {
    costTypes: CostType[];
    rateTypes: RateType[];
    costPriceCodes: CostPriceCode[];
}
