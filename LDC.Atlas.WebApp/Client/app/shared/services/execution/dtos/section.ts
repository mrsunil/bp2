import { SectionTraffic } from '../../../../shared/entities/section-traffic.entity';

export class AssignSectionsRequest {
    charterId: number;
    sectionsTraffic: SectionTraffic[];
}

export interface SectionIdentifiers {
    label: string;
    sectionId: number;
}
