import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { ContractsForBulkFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { AllocationMessage } from '../../../../../trading/entities/allocation-message';
import { GetWarningMessages } from '../../../../../shared/validators/warning-messages-validator.validator';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { WarningMessageTypes } from '../../../../../shared/enums/warning-message-type.enum';
import { AllocationWarning } from '../../../../../trading/entities/allocation-warning';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { isPositive } from '../../../../../shared/directives/number-validators.directive';
import { ShippingType } from '../../../../../shared/enums/shipping-type-enum';
import { ShippingTypes } from '../../../../../shared/entities/shipping-type-entity';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { min } from 'rxjs/operators';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { AllocationSetUp } from '../../../../../shared/entities/allocation-set-up-entity';


@Component({
    selector: 'atlas-allocation-grids',
    templateUrl: './allocation-grids.component.html',
    styleUrls: ['./allocation-grids.component.scss']
})
export class AllocationGridsComponent extends BaseFormComponent implements OnInit {

    allocationGridColumns: agGrid.ColDef[];
    contractPurchaseRows: ContractsForBulkFunctions[];
    contractSalesRows: ContractsForBulkFunctions[];
    purchaseGridOptions: agGrid.GridOptions = {};
    salesGridOptions: agGrid.GridOptions = {};
    gridApiPurchaseSelected: agGrid.GridApi;
    gridColumnApiPurchaseSelected: agGrid.ColumnApi;
    gridApiSaleSelected: agGrid.GridApi;
    gridColumnApiSaleSelected: agGrid.ColumnApi;
    allocationMessage: AllocationMessage[] = [];
    showAllowDescriptionCard: boolean = false;
    showRestrictedDescriptionCard: boolean = false;
    showWarningDescriptionCard: boolean = false;
    showWarningMessage: AllocationWarning[] = [];
    WarningMessage: string;
    restrictedWarningMessage: string;
    masterData: MasterData = new MasterData();
    atlasAgGridParam: AtlasAgGridParam;
    shippingTypeCtrl = new AtlasFormControl('shippingType');
    sourceQuantityCtrl = new AtlasFormControl('sourceQuantity');
    sumOfQuantitiesCtrl = new AtlasFormControl('sumOfQuantities');
    maxQuantity: number = 0;
    shippingTypes: ShippingTypes[] = [];
    mask = CustomNumberMask(12, 10, true);
    isOneToOneAllocation: boolean = false;
    isInputField: boolean = false;
    isOneToNAllocation: boolean = false;

    @Output() readonly isSaveDisabled = new EventEmitter<boolean>();
    allocationSetUpData: AllocationSetUp[] = [];
    company: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected snackbarService: SnackbarService,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
        public gridService: AgGridService,
        protected formBuilder: FormBuilder,
        protected configurationService: ConfigurationService, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.sumOfQuantitiesCtrl.disable();
        this.masterData = this.route.snapshot.data.masterdata;
        this.initializeGridColumns();
        for (const type in ShippingType) {
            if (typeof ShippingType[type] === 'number') {
                this.shippingTypes.push({ value: ShippingType[type] as any, shippingDescription: type });
            }
        }
        this.shippingTypeCtrl.patchValue(ShippingType.PurchaseToSale);

        this.setValidators();
        this.getAllocationSetUpData(this.company);
    }

    onGridReadyPurchase(params) {
        params.columnDefs = this.contractPurchaseRows;
        this.purchaseGridOptions = params;
        this.gridApiPurchaseSelected = params.api;
        this.gridColumnApiPurchaseSelected = params.columnApi;
        window.onresize = () => {
            this.gridColumnApiPurchaseSelected.autoSizeAllColumns();
        };
        this.gridColumnApiPurchaseSelected.autoSizeAllColumns();
    }

    onGridReadySales(params) {
        this.gridApiSaleSelected = params.api;
        this.gridColumnApiSaleSelected = params.columnApi;
        window.onresize = () => {
            this.gridColumnApiSaleSelected.autoSizeAllColumns();
        };
        this.gridColumnApiSaleSelected.autoSizeAllColumns();
    }


    initializeGridColumns() {
        this.allocationGridColumns = [
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                pinned: 'left',
            },

            {
                headerName: 'Contract reference',
                field: 'contractLabel',
                colId: 'contractLabel',
            },
            {
                headerName: 'CounterParty',
                field: 'counterparty',
                colId: 'counterparty',
            },

            {
                headerName: 'Commodity',
                field: 'commodityId',
                colId: 'commodityId',
                valueFormatter: this.commodityDescriptionFormatter.bind(this),
            },

            {
                headerName: 'Quantity',
                field: 'quantity',
                colId: 'quantity',
            },
            {
                headerName: 'Quantity Code',
                field: 'quantityCodeInvoiced',
                colId: 'quantityCodeInvoiced',
            },
            {
                headerName: 'Charter Ref',
                field: 'charterReference',
                colId: 'charterReference',
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
            },
            {
                headerName: 'Price',
                field: 'price',
                colId: 'price',
            },
            {
                headerName: 'Shipping Period',
                field: 'shipmentPeriod',
                colId: 'shipmentPeriod',
            },
            {
                headerName: 'Section Id',
                field: 'sectionId',
                colId: 'sectionId',
                hide: true,
            },
        ]
    }

    onPurcahseRowSelected(event) {
        this.isSaveEnabled();
        if (event.node.selected === true) {
            const isValid = this.checkValidations(event);
            if (!isValid) {
                this.snackbarService.throwErrorSnackBar(
                    'Only one Purcahse contract  can be allocated to multiple Sales contracts',
                );
            }
        }
        else {
            this.hideWarningMessages(event.node.data.contractLabel);

        }
        this.showTotalQuantities();

    }

    onSaleRowSelected(event) {
        this.isSaveEnabled();
        if (event.node.selected === true) {
            const isValid = this.checkValidations(event);
            if (!isValid) {
                this.snackbarService.throwErrorSnackBar(
                    'Only one Sale contract can be allocated to multiple Purchase contracts',
                );
            }

        }
        else {

            this.hideWarningMessages(event.node.data.contractLabel);
        }
        this.showTotalQuantities();
    }

    checkValidations(event) {
        const purchaseSelectedRows = this.gridApiPurchaseSelected.getSelectedRows();
        const saleSelectedRows = this.gridApiSaleSelected.getSelectedRows();
        if (purchaseSelectedRows.length > 1 && saleSelectedRows.length > 1) {
            event.node.setSelected(false);
            return false;
        }
        else if (purchaseSelectedRows.length === 1 && saleSelectedRows.length > 1) {
            let sumQuantity = 0;
            saleSelectedRows.forEach((contract) => {
                sumQuantity += contract.quantity;

            });
            if (sumQuantity > purchaseSelectedRows[0].quantity) {
                event.node.setSelected(false);
                this.snackbarService.throwErrorSnackBar(
                    'Sum of quantity of Sales contract should be less that or equal to Purchase quantity',
                );
            }
            else {
                this.checkWarningMessages(event);
            }
        }
        else if (saleSelectedRows.length === 1 && purchaseSelectedRows.length > 1) {
            let sumQuantity = 0;
            purchaseSelectedRows.forEach((contract) => {
                sumQuantity += contract.quantity;

            });
            if (sumQuantity > saleSelectedRows[0].quantity) {
                event.node.setSelected(false);
                this.snackbarService.throwErrorSnackBar(
                    'Sum of quantity of Purchase contract should be less that or equal to Sale quantity',
                );
            }
            else {
                this.checkWarningMessages(event);
            }

        }
        else {
            this.checkWarningMessages(event);
        }
        this.isSaveEnabled();
        return true;

    }
    checkWarningMessages(event) {
        let selectedContracts;
        if (event.node.data.contractType === ContractTypes[0]) {
            selectedContracts = this.gridApiSaleSelected.getSelectedRows();
        }
        else {
            selectedContracts = this.gridApiPurchaseSelected.getSelectedRows();
        }
        this.generateWarnings(selectedContracts, event);

    }



    validateWarningMessages(warningMessages: AllocationMessage[], sourceContract: string, targetContract: string) {
        let isValidTrade = true;
        let allocationwarningObj = new AllocationWarning();
        allocationwarningObj.sourceContract = sourceContract;
        allocationwarningObj.targetContract = targetContract;

        //this.resetAllDescriptionComponents();
        if (warningMessages.length > 0) {
            warningMessages.forEach((item) => {
                // trade is Restricted , so return isValid =false;
                if (item.errorTypeId === WarningMessageTypes.Restricted) {
                    allocationwarningObj.showRestrictedDescriptionCard = true;
                    allocationwarningObj.restrictedWarningMessage = item.message;
                    isValidTrade = false;


                } else if (item.errorTypeId === WarningMessageTypes.Warning) {
                    // trade is Warning, allocation can be done , so return isValid =true;
                    allocationwarningObj.showWarningDescriptionCard = true;
                    allocationwarningObj.warningMessage = item.message;
                }
            });
            allocationwarningObj.showAllowDescriptionCard = isValidTrade;
        }
        allocationwarningObj.showAllowDescriptionCard = isValidTrade;
        this.showWarningMessage.push(allocationwarningObj);
        this.isSaveEnabled();
        return isValidTrade;
    }

    generateWarnings(selectedContracts, event) {
        if (selectedContracts.length > 0) {
            this.allocationMessage = [];

            selectedContracts.forEach((selectedContract) => {
                this.executionService.getWarningMessages(selectedContract.sectionId, event.data.sectionId)
                    .subscribe((data) => {
                        if (data.value.length > 1) {
                            this.allocationMessage = GetWarningMessages(data.value, this.allocationSetUpData);
                            this.validateWarningMessages(this.allocationMessage, selectedContract.contractLabel, event.data.contractLabel);
                        }

                    });
            });
        }
    }

    hideWarningMessages(contractLabel) {

        if (this.showWarningMessage.length > 0) {
            const deselectedContract = this.showWarningMessage.filter((contract) => (contract.targetContract === contractLabel || contract.sourceContract === contractLabel));
            if (deselectedContract) {
                deselectedContract.forEach((contract) => {
                    const index: number = this.showWarningMessage.indexOf(contract);
                    if (index !== -1) {
                        this.showWarningMessage.splice(index, 1);
                        this.isSaveEnabled();
                    }
                });
            }
        }
    }

    onRestrictRemoveclicked(sourceContract, targetContract, showRestrictedDescriptionCard) {
        showRestrictedDescriptionCard = !showRestrictedDescriptionCard;
        const saleContracts = this.gridApiSaleSelected.getSelectedRows();
        const purchaseContracts = this.gridApiPurchaseSelected.getSelectedRows();
        this.gridApiPurchaseSelected.forEachNode((node) => {
            const selectedContract = purchaseContracts.find((contract) => node.data.contractLabel === sourceContract || node.data.contractLabel === targetContract);
            if (selectedContract) {
                node.setSelected(false);
                this.isSaveDisabled.emit(false);
            }
        });
        this.gridApiSaleSelected.forEachNode((node) => {
            const selectedContract = saleContracts.find((contract) => node.data.contractLabel === sourceContract || node.data.contractLabel === targetContract);
            if (selectedContract) {
                node.setSelected(false);
                this.isSaveDisabled.emit(false);
            }
        });
    }
    onWarningRemoveButtonClicked(params) {
        if (params) {
            params.currentTarget.parentElement.parentElement.remove();
        }
    }

    isSaveEnabled() {
        this.isOneToOneAllocation = false;
        const saleContracts = this.gridApiSaleSelected.getSelectedRows();
        const purchaseContracts = this.gridApiPurchaseSelected.getSelectedRows();
        const isRestrictedContract = this.showWarningMessage.find((contract) => contract.showRestrictedDescriptionCard === true)
        if (saleContracts && purchaseContracts && saleContracts.length === 1 && purchaseContracts.length === 1) {
            this.isOneToOneAllocation = true;
            this.maxQuantity = Math.min(saleContracts[0].quantity, purchaseContracts[0].quantity)
            this.sourceQuantityCtrl.patchValue(this.maxQuantity);
        }
        if (isRestrictedContract) {
            this.isSaveDisabled.emit(true);
        }
        else {
            if (saleContracts.length > 0 && purchaseContracts.length > 0) {
                this.isSaveDisabled.emit(false);
            }
            else {
                this.isSaveDisabled.emit(true);
            }
        }
    }
    setValidators() {
        this.sourceQuantityCtrl.setValidators(
            Validators.compose([isPositive()
                , Validators.required, Validators.min(0.0000000001), (control: AbstractControl) => Validators.max(Number(this.maxQuantity) > 0 ? Number(this.maxQuantity) : null)]),
        );

    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            shippingTypeCtrl: this.shippingTypeCtrl,
            sourceQuantityCtrl: this.sourceQuantityCtrl,
            sumOfQuantitiesCtrl: this.sumOfQuantitiesCtrl
        },
        );
        return super.getFormGroup();
    }

    checkQuantityValue() {
        if (this.sourceQuantityCtrl.value) {
            const formattedNumber = Number(this.sourceQuantityCtrl.value.toString().replace(/,/g, ""));
            if (formattedNumber > this.maxQuantity) {
                this.sourceQuantityCtrl.setErrors({ 'max': true });
            }
        }
    }
    resetGrids(saleContractData, purchaseRowData) {
        this.gridApiSaleSelected.setRowData(saleContractData);
        this.gridApiPurchaseSelected.setRowData(purchaseRowData);
        this.showWarningMessage = [];
        this.isOneToOneAllocation = false;
        this.isOneToNAllocation = false;
        this.isSaveDisabled.emit(true);

    }
    showTotalQuantities() {
        let totalQuantities = 0;
        this.isOneToNAllocation = false;
        const saleSelectedContracts = this.gridApiSaleSelected.getSelectedRows();
        const purchaseContracts = this.gridApiPurchaseSelected.getSelectedRows();
        if (saleSelectedContracts && saleSelectedContracts.length > 1) {
            saleSelectedContracts.forEach((contract) => {
                totalQuantities += contract.quantity;
            });

        }
        if (purchaseContracts && purchaseContracts.length > 1) {
            purchaseContracts.forEach((contract) => {
                totalQuantities += contract.quantity;
            });

        }
        if (totalQuantities !== 0) {
            this.sumOfQuantitiesCtrl.patchValue(totalQuantities);
            this.isOneToNAllocation = true;
        }

    }
    commodityDescriptionFormatter(params) {
        const commodity = this.masterData.commodities.find((com) => com.commodityId === params.value);
        return commodity ? commodity.principalCommodity : '';
    }

    // this method will fetch allocationsetupdata for a company
    getAllocationSetUpData(company: string) {
        this.configurationService.getAllocationSetUpByCompany(company)
            .subscribe((data) => {
                if (data && data.length > 0) {
                    this.allocationSetUpData = data;
                }
            });
    }
}
