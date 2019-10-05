import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ExecutionService } from '../../shared/services/http-services/execution.service';
import { TradingService } from '../../shared/services/http-services/trading.service';
import { MasterDataProps } from '../entities/masterdata-props.entity';
import { FreezeType } from '../enums/freeze-type.enum';
import { Freeze } from './../entities/freeze.entity';
import { FreezeService } from './http-services/freeze.service';
import { PreaccountingService } from './http-services/preaccounting.service';

@Injectable()
export class UiService {
    constructor(private executionService: ExecutionService,
        private preaccountingService: PreaccountingService,
        private freezeService: FreezeService,
        private tradingService: TradingService,
    ) {
    }

    public getIconForPrivilegeLevel1(level: string) {
        switch (level) {
            case 'Home': {
                return '<mat-icon matListIcon>home</mat-icon>';
            }
            case 'Trades': {
                return '<mat-icon svgIcon="trades" matListIcon></mat-icon>';
            }
            case 'Cash': {
                return '<mat-icon matListIcon>account_balance_wallet</mat-icon>';
            }
            case 'Charters': {
                return '<mat-icon matListIcon>directions_boat</mat-icon>';
            }
            case 'Invoices': {
                return '<mat-icon matListIcon>description</mat-icon>';
            }
            case 'Documents': {
                return '<mat-icon svgIcon="documents" matListIcon></mat-icon>';
            }
            case 'Reports': {
                return '<mat-icon matListIcon>bar_chart</mat-icon>';
            }
            case 'Administration': {
                return '<mat-icon matListIcon>vpn_key</mat-icon>';
            }
            case 'Dashboards': {
                return '<mat-icon matListIcon>dashboard</mat-icon>';
            }
            case 'Financials': {
                return '<mat-icon matListIcon>account_balance</mat-icon>';
            }
            case 'MasterData': {
                return '<mat-icon matListIcon>view_quilt</mat-icon>';
            }
            default: {
                return '';
            }

        }

    }

    public dateFormatter(params) {
        const momentToFormat: moment.Moment = moment(params.value);
        const result = params.value ? momentToFormat.format('DD MMM YYYY').toUpperCase() : '';
        return result;
    }

    public dateFormatterClient(params) {
        const momentToFormat: moment.Moment = moment(params.value);
        const result = params.value ? momentToFormat.format('DD/MM/YYYY').toUpperCase() : '';
        return result;
    }

    public dateGetterForExport(params) {
        if (!params.node.group) {
            const value = params.data[params.colDef.colId];
            const momentToFormat: moment.Moment = moment(value);
            const result = value ? momentToFormat.format('DD/MM/YYYY').toUpperCase() : '';
            if (result) {
                if (result.indexOf('/') < 0) {
                    return result;
                } else {
                    const split = result.split('/');
                    return split[2] + '-' + split[1] + '-' + split[0];
                }
            }
        }
    }
    public contractDateGetterForExport(params) {
        if (!params.node.group) {
            const value = params.data[params.colDef.colId];
            const momentToFormat: moment.Moment = moment(value);
            const result = value ? momentToFormat.format('DD/MM/YYYY hh:mm:ss').toUpperCase() : '';
            if (result) {
                if (result.indexOf('/') < 0) {
                    return result;
                } else {
                    const split = result.split(' ');
                    const date = split[0].split('/');
                    return date[2] + '-' + date[1] + '-' + date[0] + ' ' + split[1];
                }
            }
        }
    }
    public monthFormatter(params) {
        const momentToFormat: moment.Moment = moment(params.value);
        const result = params.value ? momentToFormat.format('MMM YYYY').toUpperCase() : '';
        return result;
    }

    public monthGetterForExport(params) {
        if (!params.node.group) {
            const value = params.data[params.colDef.colId];
            const momentToFormat: moment.Moment = moment(value);
            const result = value ? momentToFormat.format('MMM YYYY').toUpperCase() : '';
            return result;
        }
    }

    public timeGetterForExport(params) {
        if (!params.node.group) {
            const value = params.data[params.colDef.colId];
            const momentToFormat: moment.Moment = moment(value);
            const result = value ? momentToFormat.format('hh:mm:ss').toUpperCase() : '';
            return result;
        }
    }

    public timeFormatter(params) {
        if (params.value && params.value.toString().trim().length === 8) {
            return params.value;
        }
        const momentToFormat: moment.Moment = moment(params.value);
        const result = params.value ? momentToFormat.format('hh:mm:ss').toUpperCase() : '';
        return result;
    }

    public getFormatterForType(gridType: string) {
        if (gridType === 'date') {
            return this.dateFormatter;
        } else if (gridType === 'month') {
            return this.monthFormatter;
        } else if (gridType === 'time') {
            return this.timeFormatter;
        }
    }

    public getFormattterForTypeClientReport(gridType: string) {
        if (gridType === 'date') {
            return this.dateFormatterClient;
        } else if (gridType === 'month') {
            return this.monthFormatter;
        } else if (gridType === 'time') {
            return this.timeFormatter;
        }
    }

    public getterForDateType(gridType: string) {
        if (gridType === 'date') {
            return this.dateGetterForExport;
        } else if (gridType === 'month') {
            return this.monthGetterForExport;
        } else if (gridType === 'time') {
            return this.timeGetterForExport;
        }
    }
    public getterForCreatedDateType(gridType: string) {
        if (gridType === 'date') {
            return this.contractDateGetterForExport;
        } else if (gridType === 'month') {
            return this.monthGetterForExport;
        } else if (gridType === 'time') {
            return this.timeGetterForExport;
        }
    }

    public numberFormatter(params): string {
        if (!params.value) {
            return '';
        }
        const number = params.value.toString();
        const integer = number.split('.')[0];
        const decimals = number.split('.')[1];
        return new Intl.NumberFormat(
            'en-US',
            { maximumSignificantDigits: 21 })
            .format(
                Number(integer))
            + (decimals ? '.' + number.split('.')[1] : '');
    }

    public getFilterTypeForGridType(filterType: string): string {
        // To do : will have to use "grid type" when available
        return 'agTextColumnFilter';
    }

    public getMainMenuItems(params) {
        const itemsToExclude = ['separator', 'pinSubMenu', 'resetColumns'];
        return params.defaultItems.filter((item) => itemsToExclude.indexOf(item) === -1);
    }

    public getEntityLabelIfExists(activeUrl: string, dataValue): Observable<string> {

        if (activeUrl) {
            if (activeUrl.toString().includes('cash/new/1')) {
                return from(new Promise((resolve) => resolve('Payment')));
            } else if (activeUrl.toString().includes('cash/new/2')) {
                return from(new Promise((resolve) => resolve('Receipt')));
            }
            if (activeUrl.toString().includes('charter/details') || activeUrl.toString().includes('charter/assignment')) {
                if (activeUrl.match(/[^\/]+$/)) {
                    const charterId = activeUrl.match(/[^\/]+$/)[0].split(';')[0];
                    return this.executionService.getCharterById(Number(charterId))
                        .pipe(
                            map((data) => {
                                if (data) {
                                    return data.charterCode;
                                }
                            }),
                        );
                }
            }

            if (activeUrl.toString().includes('transferCosts')) {
                if (activeUrl.match(/[^\/]+$/)) {
                    const sectionId = activeUrl.match(/[^\/]+$/)[0].split(';')[0];
                    return this.tradingService.getSection(Number(sectionId), 0).pipe(
                        map((trade) => {
                            if (trade) {
                                return trade.contractLabel + ' Costs ';
                            }
                        }));
                }
            }
            if (activeUrl.toString().includes('tradeMerge')) {
                if (activeUrl.match(/[^\/]+$/)) {
                    const sectionId = activeUrl.match(/[^\/]+$/)[0].split(';')[0];
                    return this.tradingService.getSection(Number(sectionId), 0).pipe(
                        map((trade) => {
                            if (trade) {
                                return trade.contractLabel + ' Splits ';
                            }
                        }));
                }
            }
            if (activeUrl.toString().includes('companies/copy')) {
                if (activeUrl.match(/[^\/]+$/)) {
                    const companyId = activeUrl.match(/[^\/]+$/)[0].split(';')[0];
                    return from(new Promise((resolve) => resolve(companyId)));
                }
            }

            if (activeUrl.toString().includes('financial/edit/document/') && !activeUrl.toString().includes('financial/edit/document/summary')) {
                if (activeUrl.match(/[^\/]+$/)) {
                    const documentId = activeUrl.match(/[^\/]+$/)[0].split(';')[0];
                    if (documentId) {
                        return this.preaccountingService.getAccoutingDocumentData(Number(documentId))
                            .pipe(
                                map((data) => {
                                    if (data) {
                                        return data.value[0].documentReference;
                                    }
                                }),
                            );
                    }
                }

            } else if (activeUrl.toString().includes('/snapshot/')) {
                if (activeUrl.match(/\/snapshot\/([0-9]+)/) && activeUrl.match(/\/snapshot\/([0-9]+)/)[0]) {
                    return this.freezeService.getFreezeByDataVersionId(Number(activeUrl.match(/\/snapshot\/([0-9]+)/)[0].slice(10)))
                        .pipe(
                            map((data: Freeze) => {
                                if (data) {
                                    return data.dataVersionTypeId === FreezeType.Monthly ?
                                        this.monthFormatter({ value: data.freezeDate }) : this.dateFormatter({ value: data.freezeDate });
                                }
                            }),
                        );
                }
            }
        }
        return of('');
    }

    public getStylesForEnvironments() {
        let envType: string;
        envType = environment.environmentType;
        switch (envType) {
            case 'DEV': {
                return '-dev'; // pre-prod
            }
            case 'DEMO': {
                return '-demo';
            }
            case 'UAT': {
                return '-uat';
            }
            case 'TRAINING': {
                return '-training';
            }
            case 'SUPPORT': {
                return '-support';
            }

            default: {
                return '-primary';
            }
        }
    }

    public startsWithVowel(text: string) {
        if (!text) {
            return false;
        }
        text = text.toLowerCase();
        const startsWithVowel = (text.startsWith('a') || text.startsWith('e') || text.startsWith('i')
            || text.startsWith('o') || text.startsWith('u') || text.startsWith('y'));
        return startsWithVowel;
    }

    public getMasterDataFriendlyName(masterData: string) {
        switch (masterData) {
            case MasterDataProps.CommodityTypes: {
                return 'Commodity Types';
            }
            case MasterDataProps.Countries: {
                return 'Countries';
            }
            case MasterDataProps.Province: {
                return 'Provinces';
            }
            case MasterDataProps.LdcRegion: {
                return 'Regions';
            }
            case MasterDataProps.Arbitrations: {
                return 'Arbitration Codes';
            }
            case MasterDataProps.BusinessSectors: {
                return 'Business Sector';
            }
            case MasterDataProps.Commodities: {
                return 'Commodity Codes';
            }
            case MasterDataProps.ContractTerms: {
                return 'Contract Terms';
            }
            case MasterDataProps.PaymentTerms: {
                return 'Payment Terms';
            }
            case MasterDataProps.Ports: {
                return 'Port Codes';
            }
            case MasterDataProps.CostPriceCodes: {
                return 'Price Codes';
            }
            case MasterDataProps.PriceUnits: {
                return 'Price Units';
            }
            case MasterDataProps.ShippingTypes: {
                return 'Shipping Types';
            }
            case MasterDataProps.TransportTypes: {
                return 'Transport Types';
            }
            case MasterDataProps.Vessels: {
                return 'Vessel Information';
            }
            case MasterDataProps.WeightUnits: {
                return 'Weight Codes';
            }
            case MasterDataProps.CostTypes: {
                return 'Cost Types';
            }
            case MasterDataProps.Departments: {
                return 'Departments';
            }
            case MasterDataProps.NominalAccounts: {
                return 'Nominal Account Ledger';
            }
            case MasterDataProps.ProfitCenters: {
                return 'Profit Centers';
            }
            case MasterDataProps.Tax: {
                return 'Tax Codes';
            }
            case MasterDataProps.PeriodTypes: {
                return 'Period Types';
            }
            default: {
                return '';
            }
        }
    }
}
