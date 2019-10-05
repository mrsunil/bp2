import { LockFunctionalContext } from '../../../entities/lock-functional-context.entity';

export class LockResourceCommand {
    company: string;
    functionalContext: LockFunctionalContext;
    resourceId: number;
    applicationSessionId: string;
    resourceType: string;
}
