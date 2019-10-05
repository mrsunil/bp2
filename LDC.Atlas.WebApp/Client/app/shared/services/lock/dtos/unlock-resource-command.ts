import { LockFunctionalContext } from '../../../entities/lock-functional-context.entity';

export class UnlockResourceCommand {
    company: string;
    functionalContext: LockFunctionalContext;
    resourceId: number;
    applicationSessionId: string;
    resourceType: string;
}
