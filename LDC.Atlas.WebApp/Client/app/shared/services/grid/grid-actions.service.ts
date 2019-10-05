import { Injectable } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgGridCheckboxComponent } from '../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridContextualSearchComponent } from '../../components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { ColumnConfigurationProperties } from '../../entities/grid-column-configuration.entity';
import { GridProperties } from '../../entities/grid-properties.entity';
import { MasterDataProps } from '../../entities/masterdata-props.entity';
import { AgGridService } from '../ag-grid.service';
import { MasterdataService } from '../http-services/masterdata.service';
import { UiService } from '../ui.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})

export class GridActionsService {
    constructor(
        public gridService: AgGridService,
        private utilService: UtilService,
        private uiService: UiService,
        protected masterdataService: MasterdataService,
    ) { }

    getColumns(configuration: ColumnConfigurationProperties[], gridCode: string,
        company: string): Observable<agGrid.ColDef[]> {

        const observableBatch: Array<Observable<any>> = [];

        configuration.filter((opt) => opt.gridType === 'masterdata').map((config) => {

            const columnDef = this.getColDef(config);

            observableBatch.push(
                this.masterdataService.getFullMasterData(config.optionSet, company, false).pipe(
                    map((data) => {

                        const gridProps: GridProperties = this.getGridPropertyForMasterData(config.optionSet);

                        columnDef.editable = config.isEditable;
                        columnDef.cellRendererFramework = AgGridContextualSearchComponent;

                        columnDef.cellRendererParams = {
                            context: {
                                componentParent: this,
                                gridEditable: config.isEditable,
                            },
                            gridId: gridProps.gridCode,
                            options: data[config.optionSet],
                            isRequired: false,
                            displayProperty: gridProps.display,
                            valueProperty: gridProps.value,
                            lightBoxTitle: 'Results for ' + config.optionSet,
                            showContextualSearchIcon: true,
                        };
                        return columnDef;
                    }),
                ),
            );

            return observableBatch;
        });

        const ColDef = configuration.filter((opt) => opt.gridType !== 'masterdata').map((config) => {

            const columnDef: agGrid.ColDef = this.getColDef(config);

            if (config.gridType === 'numeric') {
                columnDef.valueFormatter = this.numberFormatter;
            }

            if (config.gridType === 'boolean') {
                columnDef.cellRendererFramework = AgGridCheckboxComponent;
                columnDef.cellRendererParams = {
                    disabled: config.isEditable,
                };
            }

            const dateGetter = this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = config.gridType === 'month' ? 'monthFormat' : 'dateFormat';
                columnDef.valueGetter = dateGetter;
                columnDef.cellEditor = 'atlasMonthDatePicker';
            }

            const formatter = this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }

            columnDef.editable = config.isEditable;

            return of(columnDef);
        });

        const completeColDef = ColDef.concat(observableBatch);

        return forkJoin(completeColDef);
    }

    numberFormatter(params) {
        let data = '';
        if (params && params.value) {
            data = new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params.value);
        }
        return data;
    }

    isGridCheckboxEditable(params) {
        return !(params.context.gridEditable);
    }

    isGridEditable(params): boolean {
        return params.context.gridEditable;
    }

    getColDef(configuration: ColumnConfigurationProperties): agGrid.ColDef {
        const field = this.utilService.convertToCamelCase(configuration.fieldName);
        return {
            colId: field,
            headerName: configuration.friendlyName,
            field,
            width: 100,
            hide: !configuration.isVisible,
            rowGroup: configuration.isGroup,
            enableRowGroup: configuration.isGroup,
            cellClassRules: {
                'ag-grid-invalid-mandatory-field': ((params) => params.data.invalid && params.data.invalid[field]),
            },
        };
    }

    getGridPropertyForMasterData(masterdataname: string): GridProperties {
        let props: GridProperties;

        switch (masterdataname) {

            case MasterDataProps.Arbitrations: {
                props = {
                    id: 'arbitrationId',
                    display: 'arbitrationCode',
                    value: 'arbitrationId',
                    description: '',
                    orderBy: 'arbitrationCode',
                    gridCode: 'arbitrationCodeMasterData',
                };
                break;
            }

            case MasterDataProps.Commodities: {
                props = {
                    id: 'commodityId',
                    display: 'principalCommodity',
                    value: 'commodityId',
                    description: '',
                    orderBy: 'principalCommodity',
                    gridCode: 'commodityCodesMasterData',
                };
                break;
            }

            case MasterDataProps.ProfitCenters: {
                props = {
                    id: 'profitCenterId',
                    display: 'profitCenterCode',
                    value: 'profitCenterId',
                    description: '',
                    orderBy: 'profitCenterCode',
                    gridCode: 'profitCenterMasterData',
                };
                break;
            }

            case MasterDataProps.NominalAccounts: {
                props = {
                    id: 'nominalAccountId',
                    display: 'mainAccountTitle',
                    value: 'nominalAccountId',
                    description: '',
                    orderBy: 'mainAccountTitle',
                    gridCode: 'nominalAccountMasterData',
                };
                break;
            }

            case MasterDataProps.CostTypes: {
                props = {
                    id: 'costTypeId',
                    display: 'costTypeCode',
                    value: 'costTypeId',
                    description: '',
                    orderBy: 'costTypeCode',
                    gridCode: 'costTypesMasterData',
                };
                break;
            }

            case MasterDataProps.BusinessSectors: {
                props = {
                    id: 'sectorId',
                    display: 'sectorCode',
                    value: 'sectorId',
                    description: '',
                    orderBy: 'sectorCode',
                    gridCode: 'businessSectorsMasterData',
                };
                break;
            }

            case MasterDataProps.PriceUnits: {
                props = {
                    id: 'priceUnitId',
                    display: 'priceCode',
                    value: 'priceUnitId',
                    description: '',
                    orderBy: 'priceCode',
                    gridCode: 'priceCodesMasterData',
                };
                break;
            }

            case MasterDataProps.WeightUnits: {
                props = {
                    id: 'weightUnitId',
                    display: 'weightCode',
                    value: 'weightUnitId',
                    description: '',
                    orderBy: '',
                    gridCode: 'weightCodesMasterData',
                };
                break;
            }

            case MasterDataProps.LdcRegion: {
                props = {
                    id: 'ldcRegionCode',
                    display: 'ldcRegionCode',
                    value: 'ldcRegionCode',
                    description: '',
                    orderBy: 'ldcRegionCode',
                    gridCode: 'regionsMasterData',
                };
                break;
            }

            case MasterDataProps.CommodityTypes: {
                props = {
                    id: 'commodityTypeId',
                    display: 'code',
                    value: '',
                    description: '',
                    orderBy: 'code',
                    gridCode: 'commodityTypesMasterData',
                };
                break;
            }

            case MasterDataProps.Currencies: {
                props = {
                    id: 'currencyCode',
                    display: 'currencyCode',
                    value: 'currencyCode',
                    description: '',
                    orderBy: 'currencyCode',
                    gridCode: 'currencyCodesMasterData',
                };
                break;
            }

            case MasterDataProps.Countries: {
                props = {
                    id: 'countryId',
                    display: 'countryCode',
                    value: 'countryId',
                    description: '',
                    orderBy: 'countryCode',
                    gridCode: 'countryCodesMasterData',
                };
                break;
            }

            case MasterDataProps.Province: {
                props = {
                    id: 'provinceId',
                    display: '',
                    value: '',
                    description: '',
                    orderBy: 'stateCode',
                    gridCode: 'provincesMasterData',
                };
                break;
            }

            default: {
                break;
            }
        }
        return props;
    }
}
