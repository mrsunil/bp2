import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../../shared/entities/vat.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { CostInvoiceRecord } from '../../../../../../../shared/services/execution/dtos/cost-invoice-record';
import { TaxRecord } from '../../../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-tax-costs',
    templateUrl: './tax-costs.component.html',
    styleUrls: ['./tax-costs.component.scss'],
    providers: [DatePipe]
})
export class TaxCostsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly totalCostTaxCalculated = new EventEmitter<any>();
    taxesGridOptions: agGrid.GridOptions = {};
    taxesGridColumns: agGrid.ColDef[];
    atlasAgGridParam: AtlasAgGridParam;
    gridColumnApi: agGrid.ColumnApi;
    gridApi: agGrid.GridApi;
    rowGroupPanelShow: string;
    isGroupingEnabled: boolean = false;
    taxesGridRows: TaxRecord[];
    costDirection: CostDirection;
    totalCostDirection: string;
    costDirectionDisplay: string = '';
    debit: string = 'Dr';
    credit: string = 'Cr';
    masterdata: MasterData = new MasterData();
    vatCode: Vat[];
    vatCodeAvailable: TaxRecord[];
    costDirections: CostDirection[];

    costTotal: number = 0;
    total: number = 0;
    taxTotal: number = 0;
    currencyCode: string = '';
    pricingOptionValue: number = 0;
    decimalOptionValue: number = 2;
    formatType: string = 'en-US';
    costDirectionPay: string = 'Pay';
    userActiveDirectoryName: string;
    company: string;
    defaultTaxDirectionSign: string = CostSigns[CostDirections.Payable];

    constructor(private route: ActivatedRoute, protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService, private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        private companyManagerService: CompanyManagerService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
        this.company = this.companyManagerService.getCurrentCompanyId();
    }

    ngOnInit() {
        this.initializeGridColumns();
        this.masterdata = this.route.snapshot.data.masterdata;
    }

    onGridReady(params) {
        params.columnDefs = this.taxesGridColumns;
        this.taxesGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }





    initializeGridColumns() {
        this.taxesGridColumns = [
            {
                headerName: 'VAT Code',
                field: 'vatCode',
                colId: 'vatCode',
                hide: false,
            },
            {
                headerName: 'Description',
                field: 'vatDescription',
                colId: 'vatDescription',
                hide: false,
            },
            {
                headerName: 'VAT Amount',
                field: 'rate',
                colId: 'rate',
                hide: false,
                valueFormatter: this.vatAmountFormatter.bind(this),
            },
        ];
    }

    vatAmountFormatter(param) {
        return Math.abs(param.value);
    }

    setDefaultVatCode(defaultVatCode) {
        this.vatCode = this.masterdata.vats.filter((option) => option.vatCode === defaultVatCode);
        const defaultTaxRecord: TaxRecord[] = [];
        this.vatCode.forEach((data) => {
            const taxLine = new TaxRecord();
            taxLine.vatCode = data.vatCode;
            taxLine.vatDescription = data.vatDescription;
            taxLine.rate = data.rate;
            taxLine.costDirection = this.credit;
            defaultTaxRecord.push(taxLine);
        });
        if (defaultTaxRecord) {
            this.taxRecordsSelected(defaultTaxRecord);
        }
    }

    taxRecordsSelected(taxesRecord: TaxRecord[]) {
        if (taxesRecord.length > 0) {
            this.initializeGridColumns();
            this.taxesGridRows = taxesRecord;
            this.calculateTotalAmount(taxesRecord);
            if (this.gridApi) {
                this.gridApi.hideOverlay();
            }
        }
    }

    setDirectionAndCurrency(data: TaxRecord) {
        this.costDirectionDisplay = data.costDirection;
        this.currencyCode = data.currencyCode;
    }

    calculateTotalAmount(taxes: TaxRecord[]) {
        this.total = 0;
        this.taxTotal = 0;
        taxes.forEach(
            (tax) => {
                this.taxTotal = this.taxTotal + Math.abs(tax.rate);
            },
        );
        this.totalCostTaxCalculated.emit({
            amount: this.taxTotal,
            decimalOption: this.decimalOptionValue,
            currencyCode: this.currencyCode,
            costDirection: this.costDirectionDisplay,
        });
    }

    formatQuantityAndTotal(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }

    calculateTotalForSummary(costInvoiceRecord: CostInvoiceRecord) {
        this.total = costInvoiceRecord.totalVatAmount;
        this.currencyCode = costInvoiceRecord.currencyCode;
    }

    getTaxesForSelectedVat(model: CostInvoiceRecord) {
        if (model) {
            this.costTotal = model.rate;
            this.decimalOptionValue = model.decimalOption;
            this.currencyCode = model.currencyCode;
            this.totalCostDirection = model.costDirection;
            if (model.costDirection === CostDirections[CostDirections.Payable]) {
                this.costDirectionDisplay = this.credit;
            } else if (model.costDirection === CostDirections[CostDirections.Receivable]) {
                this.costDirectionDisplay = this.debit;
            }
            this.taxRecordsSelected(model.vatAvailable);
        }
    }

    onExportButtonClickedAsExcel() {
        let screenName: String = 'Taxes for Cost';
        let now = new Date();
        let todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        var params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        let screenName: String = 'Taxes for Cost';
        let now = new Date();
        let todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        var params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }
}
