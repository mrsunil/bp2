import { FreezeType } from '../enums/freeze-type.enum';

export class Freeze {
    dataVersionId: number;
    companyId: string;
    freezeDate: Date;
    dataVersionTypeId: FreezeType;
    dataVersionTypeDescription: string;
    createdBy: string;
    startDateTime: Date;
    endDateTime: Date;
}
