import { LockFunctionalContext } from './lock-functional-context.entity';

export class Lock {
    lockId: number;
    companyId: string;
    resourceId: number;
    resourceCode: string;
    dataVersionId: number;
    resourceType: string;
    lockOwner: string;
    lockAcquisitionDateTime: Date;
    functionalContext: LockFunctionalContext;
    applicationSessionId: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
}
