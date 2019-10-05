import { Moment } from 'moment';
import { ContractTypes } from '../enums/contract-type.enum';

export class FuturesOptionsContracts {

    sectionId: number;
    reference: string;
    type: ContractTypes;

    contractDate: Moment;
    client: string;
    broker: string;
    commodity: string; // F&O Commodity
    promptMonthDate: Moment;

    numberOfLots: number;
    price: number;
    fixTypeCode: string;
    department: string;
    memo: string;

    createdBy: string;
    modifiedBy: string;
}
