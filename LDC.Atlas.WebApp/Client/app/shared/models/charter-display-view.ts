import { Charter } from '../entities/charter.entity';

export class CharterDisplayView {
    charterId: number;
    charterCode: string;
    description: string;
    transportType: string;
    vessel: string;
    loadingLocation: string;
    departureDate: Date;
    dischargeLocation: string;
    arrivalDate: Date;
    creationDate: Date;
    createdBy: string;
    blDate?: Date;
    departmentId: number;
    charterManagerId: number;
    charterManagerSamAccountName: string;
    charterStatusId: number;

    constructor(charter?: Charter) {
        if (charter) {
            this.charterId = charter.charterId;
            this.charterCode = charter.charterCode;
            this.description = charter.description;
            this.transportType = charter.transportTypeCode;
            this.vessel = charter.vesselCode;
            this.loadingLocation = charter.loadingLocationCode;
            this.departureDate = charter.departureDate;
            this.dischargeLocation = charter.dischargeLocationCode;
            this.arrivalDate = charter.arrivalDate;
            this.creationDate = charter.creationDate;
            this.createdBy = charter.createdBy;
            this.blDate = charter.blDate;
            this.departmentId = charter.departmentId;
            this.charterManagerId = charter.charterManagerId;
            this.charterManagerSamAccountName = charter.charterManagerSamAccountName;
            this.charterStatusId = charter.charterStatusId;
        }
    }
}
