import { LockResourceInformation } from '../../../entities/lock-resource-information.entity';

export class RefreshLockOwnershipCommand {
    company: string;    
    applicationSessionId: string;
    resourcesInformation: LockResourceInformation[];
}

