import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridHyperlinkComponent } from '../../../../shared/components/ag-grid-hyperlink/ag-grid-hyperlink.component';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../shared/entities/company.entity';
import { Department } from '../../../../shared/entities/department.entity';
import { IntercoTrade } from '../../../../shared/entities/interco-trade.entity';
import { IntercoField, IntercoValidation } from '../../../../shared/entities/interco-validation.entity';
import { MasterDataProps } from '../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { Trader } from '../../../../shared/entities/trader.entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../shared/services/util.service';
import { BannerStates } from './intero-state-banner/intero-state-banner.component';

@Component({
    selector: 'atlas-interco-trade-dialog',
    templateUrl: './interco-trade-dialog.component.html',
    styleUrls: ['./interco-trade-dialog.component.scss'],
})
export class IntercoTradeDialogComponent extends BaseFormComponent implements OnInit {
    isInterco: boolean = false;
    companyCtrl = new AtlasFormControl('Company');
    departmentCtrl = new AtlasFormControl('Department');
    traderCtrl = new AtlasFormControl('Trader');
    company: string[] = ['companyId'];
    department: string[] = ['departmentCode', 'description'];
    selectPropertiesDept = ['departmentCode'];
    trader: string[] = ['samAccountName', 'displayName'];
    traderDisplay: string = 'samAccountName';
    departmentDisplay: string = 'departmentCode';
    companyDisplay: 'companyId';
    masterdata: MasterData;
    companyList: Company[] = [];
    departmentList: Department[] = [];
    filteredDepartmentList: Department[] = [];
    traderList: Trader[] = [];
    filteredTraderList: Trader[] = [];
    filteredCompany: Company[] = [];
    masterdataList: string[] = [
        MasterDataProps.Companies,
        MasterDataProps.Traders,
        MasterDataProps.Departments,
    ];
    formGroup: FormGroup;
    isValueMissing: boolean = false;
    bannerState: BannerStates;
    bannerTitle: string;
    bannerDescription: string;
    interoGridCols: agGrid.ColDef[];
    rowData: any[] = [];
    intercoTradeData: IntercoTrade = {} as IntercoTrade;
    selectedCompany: Company;
    disableSaveButton: boolean;
    intercoValidation: IntercoValidation;
    intercoMissingData: IntercoField[] = [];
    constructor(public thisDialogRef: MatDialogRef<IntercoTradeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        protected masterdataService: MasterdataService,
        protected tradingService: TradingService,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected snackbarservice: SnackbarService,
        private route: ActivatedRoute,
    ) {
        super(formConfigurationProvider);
        thisDialogRef.disableClose = true;
        this.companyList = data.counterpartyCompanies;
        this.intercoValidation = data.intercoValidation;
    }

    ngOnInit() {
        this.tradingService.getAllTraders()
            .subscribe((traders) => {
                this.traderList = traders.value;
                this.filteredTraderList = this.traderList;
                this.traderCtrl.valueChanges.subscribe((input) => {
                    this.filteredTraderList = this.utilService.filterListforAutocomplete(
                        input,
                        this.traderList,
                        ['samAccountName', 'displayName'],
                    );
                });
                this.setValidators();
            });

        this.initIntercoGridColumns();
        this.masterdataService.getMasterData(this.masterdataList).subscribe((masterData: MasterData) => {
            this.masterdata = masterData;
        });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            companyCtrl: this.companyCtrl,
            departmentCtrl: this.departmentCtrl,
            traderCtrl: this.traderCtrl,
        });
        return super.getFormGroup();
    }

    handleCancel(isCancel: boolean) {
        this.intercoTradeData.isInterco = false;
        this.intercoTradeData.isCancelled = isCancel;
        this.thisDialogRef.close(this.intercoTradeData);
    }

    onCancelButtonClicked() {
        this.handleCancel(true);
    }

    onDiscardButtonClicked() {
        this.handleCancel(true);
    }

    onSaveButtonClicked() {
        if (this.formBuilder) {
            if (this.isInterco) {
                this.intercoTradeData.companyId = this.companyCtrl.value.companyId;
                const department = this.departmentList.find((dep) =>
                    (dep.departmentCode === this.departmentCtrl.value.departmentCode &&
                        dep.companyId === this.companyCtrl.value.id
                    ));
                if (department) {
                    this.intercoTradeData.departmentId = department.departmentId;
                } else {
                    const intercoCompany = this.masterdata.companies.find((e) =>
                        e.id === this.companyCtrl.value.id);
                    this.intercoTradeData.departmentId = intercoCompany.defaultDepartmentId;
                }

                const trader = this.filteredTraderList.find((trade) => trade.samAccountName === this.traderCtrl.value.samAccountName);
                if (trader) {
                    this.intercoTradeData.traderId = trader.userId;
                } else {
                    this.intercoTradeData.traderId = null;
                }

                this.intercoTradeData.isInterco = true;
                this.intercoTradeData.isCancelled = false;
                this.thisDialogRef.close(this.intercoTradeData);
            } else {
                this.handleCancel(false);
            }
        }
    }

    toggleIntercoTrade() {
        this.isInterco = !this.isInterco;
        if (!this.isInterco) {
            this.selectedCompany = null;
            this.intercoMissingData = [];
            this.isValueMissing = false;
        }
        if (this.companyList && this.companyList.length > 0 && this.isInterco) {
            this.disableSaveButton = true;
            this.companyCtrl.patchValue(this.companyList[0]);
            this.bindDepartments(this.companyCtrl.value);
        }
        if (this.isInterco && !this.selectedCompany) {
            this.disableSaveButton = true;
        } else if (!this.isInterco) {
            this.disableSaveButton = false;
        }
    }

    onGridReady() {
    }

    setValidators() {
        this.companyCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.companyList,
                    nameof<Company>('companyId'),
                ),
            ]),
        );

        this.traderCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.traderList,
                    nameof<Trader>('samAccountName'),
                ),
            ]),
        );
    }

    bindDepartments(event: any) {
        this.selectedCompany = event;
        this.masterdataService.getDepartmentsByCompanyIdInterco(event.companyId)
            .subscribe((data) => {
                this.departmentList = data.value;
                this.filteredDepartmentList = this.departmentList;
                this.departmentCtrl.valueChanges.subscribe((input) => {
                    this.filteredDepartmentList = this.utilService.filterListforAutocomplete(
                        input,
                        this.departmentList,
                        ['departmentCode', 'description'],
                    );
                });

                if (this.departmentList) {
                    this.departmentCtrl.setValidators(
                        Validators.compose([
                            inDropdownListValidator(
                                this.departmentList,
                                nameof<Department>('departmentCode'),
                            ),
                        ]),
                    );
                }
            });

        this.intercoValidation.companyId = this.selectedCompany.companyId;
        this.tradingService.validateIntercoFields(this.intercoValidation)
            .subscribe((data) => {
                if (this.isInterco) {
                    this.disableSaveButton = false;
                    this.isValueMissing = false;
                    if (data && data.intercoFields && data.intercoFields.length > 0) {
                        this.intercoMissingData = data.intercoFields;
                        this.intercoMissingData.forEach((missingData) => {
                            missingData.setValue = 'Set up value';
                        });
                        this.isValueMissing = true;

                    }
                    if (this.isValueMissing) {
                        this.bannerState = BannerStates.Error;
                        this.bannerTitle = 'Missing values';
                        this.bannerDescription = 'The following values has not been set up for this company \"' +
                            this.selectedCompany.companyId + '\". Unable to create Interco contract.';
                        this.disableSaveButton = true;
                    } else {
                        this.bannerState = BannerStates.Success;
                        this.bannerTitle = 'All values are set!';
                        this.bannerDescription = 'You can save your Interco contract';
                        this.disableSaveButton = false;
                    }
                }
            });
    }

    bindTraders(event: any) {
        this.filteredTraderList = this.traderList;
    }

    initIntercoGridColumns() {
        this.interoGridCols = [
            {
                headerName: 'Type',
                colId: 'type',
                field: 'type',
            },
            {
                headerName: 'Name',
                colId: 'name',
                field: 'name',
            },
            {
                headerName: 'Value',
                colId: 'value',
                field: 'value',
            },
            {
                headerName: 'Action',
                colId: 'setValue',
                field: 'setValue',
                cellRendererFramework: AgGridHyperlinkComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
            },
        ];
    }

    hyperlinkClicked(rowSelected: any, event) {
        this.snackbarservice.informationSnackBar('This feature is not available.');
        event.preventDefault();
    }
}
