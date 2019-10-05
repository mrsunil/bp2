import { UpdateInterfaceError } from '../../../../shared/services/Interface/dto/update-interface-error';

export class UpdateInterfaceStatusCommand {
    accountingInterfaceError: UpdateInterfaceError[] = [];
    accountingInterfaceStatus: string;
}
