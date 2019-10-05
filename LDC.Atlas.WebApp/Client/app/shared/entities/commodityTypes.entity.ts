import { MasterDataEntity } from "./masterdata-entity.entity";

export class CommodityTypes implements MasterDataEntity{
    commodityTypeId: number;
    code: string;
    description: string;

    GetTechnicalId() : number{
        return this.commodityTypeId;
    }

    GetFunctionalId() : string{
        return this.code;
    }
}
