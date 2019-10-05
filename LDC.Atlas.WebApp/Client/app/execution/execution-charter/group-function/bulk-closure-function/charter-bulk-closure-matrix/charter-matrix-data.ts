import { SectionMatrixData } from "./section-matrix-data"

export class CharterMatrixData {
    rowHeader: string;
    sectionsAssigned: SectionMatrixData[];
    charterId: number;
    category: string;
    vesselName: string;
    description?: string;
    netAccuralPnLValue: number;
    charterCode: string;
}