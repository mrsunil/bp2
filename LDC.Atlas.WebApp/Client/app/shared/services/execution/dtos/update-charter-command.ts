import { AssignedSection } from '../../../entities/assigned-section.entity';

export class UpdateCharterCommand {
    charterId: number;
    reference: string;
    description: string;
    transportType: string;
    vesselId: number;
    loadingLocation: string;
    departureDate: Date;
    dischargeLocation: string;
    arrivalDate: Date;
    creationDate: Date;
    createdBy: string;
    charterManagerId: number;
    currency: string;
    weightUnitId: number;
    memo: string;
    departmentId: number;
    blDate?: Date;
    blRef: string;
    sectionsAssigned: AssignedSection[];
    isDeassignSectionRequest: boolean;
    marketSector: string;
}
