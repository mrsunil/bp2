import { AssignedSection } from '../../../entities/assigned-section.entity';

export class ReAssignSectionsCommand {
    company: string;
    newCharterId: number;
    newCharterVesselCode: string;
    charterId: number;
    sectionsAssigned: AssignedSection[];

}
