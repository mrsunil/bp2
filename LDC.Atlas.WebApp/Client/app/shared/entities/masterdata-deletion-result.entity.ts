import { MasterDataOperationStatus } from '../enums/masterdata-operation-status.entity';

export class MasterDataDeletionResult {

    id: number;
    code: string;
    masterDataOperationStatus: MasterDataOperationStatus;

    constructor(id: number, code: string, masterDataOperationStatus: MasterDataOperationStatus) {
        this.id = id;
        this.code = code;
        this.masterDataOperationStatus = masterDataOperationStatus;
    }

    public toUserFriendlyMessage(): string {
        switch (this.masterDataOperationStatus) {
            case MasterDataOperationStatus.Success:
                return 'Masterdata has been successfully deleted.';
            case MasterDataOperationStatus.ForeignKeyViolation:
                return 'Masterdata cannot be deleted because it is assigned to and used in one or more companies.';
            case MasterDataOperationStatus.RessourceNotFound:
                return 'Masterdata could not be found.';
            default:
                return 'Unknown error';
        }
    }
}
