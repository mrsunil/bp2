import { FreezeType } from '../../../enums/freeze-type.enum';

export class CreateFreezeCommand {
    company: string;
    freezeDate: Date;
    dataVersionTypeId: FreezeType;
}
