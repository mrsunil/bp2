import { ContractStatus } from '../enums/contract-status.enum';
import { ContractTypes } from '../enums/contract-type.enum';
import { PositionMonthTypes } from '../enums/position-month-type.enum';
import { ToleranceTypes } from '../enums/tolerance-type.enum';
import { Cost } from './cost.entity';


export class Trade<T> {
    contractCode: string = null;
    type: ContractTypes = null;
    contractDate: Date = null;
    departmentCode: number = null;
    traderId: number = null;
    buyerCode: string = null;
    sellerCode: string = null;
    commodityId: number = null;
    quantity: number = null;
    weightUnitId: number = null;
    toleranceType: ToleranceTypes = null;
    toleranceValue: number = null;
    toleranceMin: number = null;
    toleranceMax: number = null;
    deliveryPeriodStart: Date = null;
    deliveryPeriodEnd: Date = null;
    portOfOrigin: string = null;
    portOfDestination: string = null;
    positionMonthType: PositionMonthTypes = null;
    positionMonthIndex: number = null;
    blDate: Date = null;
    allocatedTo: string = null;
    allocationDate: Date = null;
    price: number = null;
    status: ContractStatus = null;
    createdBy: string = null;
    creationDate: Date = null;
    lastModifiedBy: string = null;
    lastModifiedDate: Date = null;
    sections: T[] = new Array<T>();
    costs: Cost[];
}
