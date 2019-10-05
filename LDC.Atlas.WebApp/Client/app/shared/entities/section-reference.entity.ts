import { ContractStatus } from '../enums/contract-status.enum';

export interface SectionReference {
    contractLabel: string;
    sectionId: number;
    invoicingStatusId: number;
    sectionNumberId: string;
    sectionTypeId: number;
    status?: ContractStatus;
    isClosed?: boolean;
    isCancelled?: boolean;
}
