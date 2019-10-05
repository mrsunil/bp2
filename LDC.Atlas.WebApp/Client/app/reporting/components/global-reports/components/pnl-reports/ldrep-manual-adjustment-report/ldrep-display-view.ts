import { Inject, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { LdrepManualAdjustmentRecords } from '../../../../../../shared/entities/ldrep-manual-adjustment-records.entity';
import { LdrepManualAdjustment } from '../../../../../../shared/entities/ldrep-manual-adjustment.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { DateFormats } from '../../../../../../shared/enums/date-format.enum';
const moment = _moment;

export class LdrepDisplayView {
    manualAdjustmentId: number;
    companyId: number;
    fromDateFormat: string;
    dateFrom: Date;
    toDateFormat: string;
    dateTo: Date;
    departmentCode: string;
    pNLType: string;
    realized: boolean;
    functionalCCYAdjustment: number;
    statutoryCCYAdjustment: number;
    narrative: string;
    charterRefrence: string;
    contractReference: string;
    principalCommodity: string;
    cmy2: string;
    cmy3: string;
    cmy4: string;
    cmy5: string;
    charterRefrenceId: number;
    sectionId: number;
    commodityId: number;
    cropYear: string;
    isDirty: boolean;

    constructor(ldrep?: LdrepManualAdjustmentRecords, masterdata?: MasterData, @Optional() @Inject(MAT_DATE_LOCALE)
    private dateLocale?: string) {
        if (ldrep) {
            this.manualAdjustmentId = ldrep.manualAdjustmentId;
            this.fromDateFormat = DateFormats[Number(ldrep.fromDateFormat)];
            this.dateFrom = ldrep.dateFrom ? moment(ldrep.dateFrom, 'YYYY-MM-DD').toDate() : null;
            this.toDateFormat = DateFormats[Number(ldrep.toDateFormat)];
            this.dateTo = ldrep.dateTo ? moment(ldrep.dateTo, 'YYYY-MM-DD').toDate() : null;
            this.departmentCode = ldrep.departmentCode;
            this.pNLType = ldrep.pnlType;
            this.realized = ldrep.realized;
            this.functionalCCYAdjustment = ldrep.functionalCCYAdjustment;
            this.statutoryCCYAdjustment = ldrep.statutoryCCYAdjustment;
            this.narrative = ldrep.narrative;
            this.charterRefrence = ldrep.charterCode;
            this.contractReference = ldrep.contractSectionCode;
            this.principalCommodity = ldrep.principalCommodity;
            this.commodityId = this.getCommodityIdFromPrincipalCommodity(ldrep.principalCommodity, masterdata);
            this.cmy2 = this.getCommodity2FromCommodity1(ldrep.principalCommodity, masterdata);
            this.cmy3 = this.getCommodity3FromCommodity1(ldrep.principalCommodity, masterdata);
            this.cmy4 = this.getCommodity4FromCommodity1(ldrep.principalCommodity, masterdata);
            this.cmy5 = this.getCommodity5FromCommodity1(ldrep.principalCommodity, masterdata);
            this.cropYear = ldrep.cropYear;
        }
    }

    getCommodityIdFromPrincipalCommodity(code: string, masterdata: MasterData) {
        const commodity = masterdata.commodities.find(
            (e) => e.principalCommodity === code);
        return commodity ? commodity.commodityId : null;
    }

    getCommodity2FromCommodity1(code: string, masterdata: MasterData) {
        const commodity = masterdata.commodities.find(
            (e) => e.principalCommodity === code);
        return commodity ? commodity.part2 : '';
    }

    getCommodity3FromCommodity1(code: string, masterdata: MasterData) {
        const commodity = masterdata.commodities.find(
            (e) => e.principalCommodity === code);
        return commodity ? commodity.part3 : '';
    }

    getCommodity4FromCommodity1(code: string, masterdata: MasterData) {
        const commodity = masterdata.commodities.find(
            (e) => e.principalCommodity === code);
        return commodity ? commodity.part4 : '';
    }

    getCommodity5FromCommodity1(code: string, masterdata: MasterData) {
        const commodity = masterdata.commodities.find(
            (e) => e.principalCommodity === code);
        return commodity ? commodity.part5 : '';
    }

    getLdrepData(masterdata: MasterData) {
        const local = this.dateLocale || moment.locale();
        const ldrep = new LdrepManualAdjustmentRecords();
        ldrep.manualAdjustmentId = this.manualAdjustmentId;
        ldrep.fromDateFormat = DateFormats[this.fromDateFormat];
        ldrep.dateFrom = moment.utc(moment.parseZone(this.dateFrom).format('YYYY-MM-DD')).locale(local);
        ldrep.toDateFormat = DateFormats[this.toDateFormat];
        ldrep.dateTo = this.dateTo ? moment.utc(moment.parseZone(this.dateTo).format('YYYY-MM-DD')).locale(local) : null;
        ldrep.departmentId = this.getDepartmentIdFromCode(this.departmentCode, masterdata);
        ldrep.pnlTypeId = this.getPNLTypeIdFromCode(this.pNLType, masterdata);
        ldrep.realized = this.realized;
        ldrep.functionalCCYAdjustment = this.functionalCCYAdjustment;
        ldrep.statutoryCCYAdjustment = this.statutoryCCYAdjustment;
        ldrep.narrative = this.narrative;
        ldrep.charterRefrenceId = this.charterRefrenceId;
        ldrep.sectionId = this.sectionId;
        ldrep.commodityId = this.getCommodityIdFromCode(this.principalCommodity, masterdata);
        ldrep.cropYear = this.cropYear;

        return ldrep;
    }

    getCommodityIdFromCode(code: string, masterdata: MasterData) {
        const commodity = masterdata.commodities.find(
            (e) => e.principalCommodity === code);
        return commodity ? commodity.commodityId : null;
    }

    getDepartmentIdFromCode(code: string, masterdata: MasterData) {
        const department = masterdata.departments.find(
            (e) => e.departmentCode === code);
        return department ? department.departmentId : null;
    }

    getPNLTypeIdFromCode(code: string, masterdata: MasterData) {
        const pnlType = masterdata.pnlTypes.find(
            (e) => e.enumEntityDescription === code);
        return pnlType ? pnlType.enumEntityId : null;
    }
}
