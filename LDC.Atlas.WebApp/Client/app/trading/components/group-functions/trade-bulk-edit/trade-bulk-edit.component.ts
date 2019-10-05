import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { PhysicalTradeBulkEdit } from '../../../../shared/entities/physical-trade-bulk-edit';
import { TradePropertyPrivilege } from '../../../../shared/entities/trade-property-privilege.entity';
import { TradeApprovalStatus } from '../../../../shared/enums/trade-approval-status.enum';
import { TradeBulkEditFields } from '../../../../shared/enums/trade-bulk-edit-fields.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TradeEditService } from '../../../../shared/services/trade-edit.service';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { TradeFieldsForBulkEdit } from '../../../../shared/services/trading/dtos/tradeFieldsForBulkEdit';
import { TradeActionsService } from '../../../services/trade-actions.service';
import { GroupFunctionContractsComponent } from '../group-function-contracts/group-function-contracts.component';
import { GroupFunctionWarningComponent } from '../group-function-warning/group-function-warning.component';
import { EditionMatrixComponent } from './edition-matrix/edition-matrix.component';
import { TradeBulkFieldsComponent } from './trade-bulk-fields/trade-bulk-fields.component';

@Component({
    selector: 'atlas-trade-bulk-edit',
    templateUrl: './trade-bulk-edit.component.html',
    styleUrls: ['./trade-bulk-edit.component.scss'],
})
export class TradeBulkEditComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('contractSelection') contractSelection: GroupFunctionContractsComponent;
    @ViewChild('groupFunctionWarning') groupFunctionWarning: GroupFunctionWarningComponent;
    @ViewChild('editionMatrix') editionMatrix: EditionMatrixComponent;
    @ViewChild('tradeBulkFields') tradeBulkFields: TradeBulkFieldsComponent;
    @ViewChild('summaryGrid') summaryGrid: EditionMatrixComponent;

    formComponents: BaseFormComponent[] = [];
    matrixGridFormComponents: EditionMatrixComponent;
    selectedContractsForBulkFunctions: ContractsForBulkFunctions[];
    tradeFieldList: TradeFieldsForBulkEdit[] = [];
    updatedContracts: PhysicalTradeBulkEdit;
    privileges: TradePropertyPrivilege;
    company: string;
    bulkEditionFormGroup: FormGroup;
    isContractsNextDisabled: boolean = true;
    currentStep: number = 0;
    errorMessage: string;
    noErrorMessage: string = 'noError';
    isSaveInProgress: boolean;
    selectedSectionIds: number[] = [];
    selectedFieldsToEdit: string[] = [];
    unlocking: number[] = [];
    private getTradesForSubscription: Subscription;
    // Additional Editable Columns in Edition Matrix Grid
    departmentDescriptionColumn: string = 'departmentDescription';
    buyerDescriptionColumn: string = 'buyerDescription';
    sellerDescriptionColumn: string = 'sellerDescription';
    commodityColumn = ['commodity2', 'commodity3', 'commodity4', 'commodity5'];
    contractTermDescriptionColumn: string = 'contractTermDescription';
    arbitrationDescriptionColumn: string = 'arbitrationDescription';
    currencyDescriptionColumn: string = 'currencyDescription';
    businessSectorDescription: string = 'businessSectorDescription';
    isEditButtonClicked: boolean;
    fetchingInProgress: boolean;
    isDepartmentselected: boolean;
    isBuyerSelected: boolean;
    isSellerSelected: boolean;
    isCommoditySelected: boolean;
    isContractTermSelected: boolean;
    isArbitrationSelected: boolean;
    isCurrencySelected: boolean;
    isbusinessSectorSelected: boolean;
    isStatusApproved: boolean;
    approvalStatus: boolean;
    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private router: Router,
        private companyManager: CompanyManagerService,
        private lockService: LockService,
        private tradingService: TradingService,
        private tradeEditService: TradeEditService,
        protected snackbarService: SnackbarService,
        private tradeActionService: TradeActionsService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.bulkEditionFormGroup = this.formBuilder.group({
            contractSelection: this.contractSelection.getFormGroup(),
            editionMatrix: this.editionMatrix.getFormGroup(),
            summaryGrid: this.summaryGrid.getFormGroup(),
        });
        this.formComponents.push(this.contractSelection, this.editionMatrix, this.summaryGrid);
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    isContractSelected(contractSelected: boolean) {
        this.isContractsNextDisabled = !contractSelected;
    }

    onContractSelectionNextButtonClicked() {
        this.editionMatrix.lockedContracts = this.contractSelection.lockedContracts;
        this.contractsSelected(this.isEditButtonClicked = false);
        this.stepper.next();
    }

    contractsSelected(buttonClicked) {
        this.isEditButtonClicked = buttonClicked;
        const selectedContracts = this.contractSelection.selectedContractsForBulkFunctions as ContractsForBulkFunctions[];
        const privileges = this.tradeActionService.getTradePropertyPrivileges();
        this.privileges = privileges as TradePropertyPrivilege;
        this.selectedSectionIds = [];
        selectedContracts.forEach((element) => {
            this.selectedSectionIds.push(element.sectionId);
        });
        if (this.selectedSectionIds) {
            this.fetchingInProgress = false;
            this.subscriptions.push(this.tradingService.getTradesForBulkEdit(this.selectedSectionIds)
                .pipe(catchError((error) => {
                    return throwError(error);
                }),
                      finalize(() => {
                        this.fetchingInProgress = true;
                    })).subscribe((data) => {
                        if (data) {
                            this.selectedContractsForBulkFunctions = data.value;
                            if (this.isEditButtonClicked) {
                                this.afterContractsFetched();
                            }
                        }
                    }));
        }
    }

    getSelectedFieldsToEdit(selectedFields: TradeFieldsForBulkEdit[]) {
        this.tradeFieldList = selectedFields;
    }

    onFieldSelectionNextButtonClicked() {
        this.populateEditableColumns();
        this.checkAdditionalFieldsSelected();
        this.editionMatrix.selectedContractsToEdit(false, this.selectedContractsForBulkFunctions, this.privileges);
        this.editionMatrix.gridColumnApi.setColumnsVisible(this.selectedFieldsToEdit, true);
        this.editionMatrix.gridColumnApi.setColumnVisible('rowStatus', true);
        this.summaryGrid.gridColumnApi.setColumnsVisible(this.selectedFieldsToEdit, true);
        this.isDescriptionColumnsVisible();
        this.stepper.next();
    }

    populateEditableColumns() {
        this.tradeFieldList = this.tradeFieldList.filter((e) => e.isChecked === true);
        const selectedFieldRows = this.tradeFieldList as TradeFieldsForBulkEdit[];
        this.selectedFieldsToEdit = [];
        this.selectedFieldsToEdit = selectedFieldRows.map((row) => row.bulkEditFieldName);
    }

    checkAdditionalFieldsSelected() {
        const departmentColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.DepartmentId);
        this.isDepartmentselected = (departmentColumn) ? departmentColumn.isChecked : false;
        const buyerColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.BuyerId);
        this.isBuyerSelected = (buyerColumn) ? buyerColumn.isChecked : false;
        const sellerColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.SellerId);
        this.isSellerSelected = (sellerColumn) ? sellerColumn.isChecked : false;
        const commodityColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.CommodityId);
        this.isCommoditySelected = (commodityColumn) ? commodityColumn.isChecked : false;
        const contractTermColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.ContractTermId);
        this.isContractTermSelected = (contractTermColumn) ? contractTermColumn.isChecked : false;
        const arbitrationColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.ArbitrationId);
        this.isArbitrationSelected = (arbitrationColumn) ? arbitrationColumn.isChecked : false;
        const currencyColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.CurrencyCode);
        this.isCurrencySelected = (currencyColumn) ? currencyColumn.isChecked : false;
        const businessSectorColumn = this.tradeFieldList.find((e) => e.bulkEditFieldName === TradeBulkEditFields.MarketSectorId);
        this.isbusinessSectorSelected = (businessSectorColumn) ? businessSectorColumn.isChecked : false;
        const approvalStatus = this.tradeFieldList.find((e) => e.unapproval === TradeApprovalStatus.ApprovedStatus);
        this.isStatusApproved = approvalStatus ? true : false;
    }

    isDescriptionColumnsVisible() {
        // for the edition matrix step
        this.editionMatrix.gridColumnApi.setColumnVisible(this.departmentDescriptionColumn, this.isDepartmentselected);
        this.editionMatrix.gridColumnApi.setColumnVisible(this.buyerDescriptionColumn, this.isBuyerSelected);
        this.editionMatrix.gridColumnApi.setColumnVisible(this.sellerDescriptionColumn, this.isSellerSelected);
        this.editionMatrix.gridColumnApi.setColumnsVisible(this.commodityColumn, this.isCommoditySelected);
        this.editionMatrix.gridColumnApi.setColumnVisible(this.contractTermDescriptionColumn, this.isContractTermSelected);
        this.editionMatrix.gridColumnApi.setColumnVisible(this.arbitrationDescriptionColumn, this.isArbitrationSelected);
        this.editionMatrix.gridColumnApi.setColumnVisible(this.currencyDescriptionColumn, this.isCurrencySelected);
        this.editionMatrix.gridColumnApi.setColumnVisible(this.businessSectorDescription, this.isbusinessSectorSelected);

        // for the summary step
        this.summaryGrid.gridColumnApi.setColumnVisible(this.departmentDescriptionColumn, this.isDepartmentselected);
        this.summaryGrid.gridColumnApi.setColumnVisible(this.buyerDescriptionColumn, this.isBuyerSelected);
        this.summaryGrid.gridColumnApi.setColumnVisible(this.sellerDescriptionColumn, this.isSellerSelected);
        this.summaryGrid.gridColumnApi.setColumnsVisible(this.commodityColumn, this.isCommoditySelected);
        this.summaryGrid.gridColumnApi.setColumnVisible(this.contractTermDescriptionColumn, this.isContractTermSelected);
        this.summaryGrid.gridColumnApi.setColumnVisible(this.arbitrationDescriptionColumn, this.isArbitrationSelected);
        this.summaryGrid.gridColumnApi.setColumnVisible(this.currencyDescriptionColumn, this.isCurrencySelected);
        this.summaryGrid.gridColumnApi.setColumnVisible(this.businessSectorDescription, this.isbusinessSectorSelected);

    }

    onFieldSelectionPreviousButtonClicked() {
        this.stepper.previous();
    }

    onEditionMatrixPreviousButtonClicked() {
        this.editionMatrix.gridColumnApi.setColumnsVisible(this.selectedFieldsToEdit, false);
        this.summaryGrid.gridColumnApi.setColumnsVisible(this.selectedFieldsToEdit, false);
        this.isDescriptionColumnsVisible();
        this.stepper.previous();
    }

    onBulkEditionSaveButtonClicked() {
        this.editionMatrix.onSaveButtonClicked();
        if (this.errorMessage !== '') {
            if (this.errorMessage !== this.noErrorMessage) {
                this.snackbarService.throwErrorSnackBar(this.errorMessage);
            } else {
                this.isSaveInProgress = true;
                this.getApprovalStatus();
                this.updatedContracts = this.editionMatrix.getGridData();
                this.updatedContracts.sectionToUpdate[0].contractStatusCode = Number(this.approvalStatus);
                this.subscriptions.push(this.tradingService.PhysicalTradeBulkEdit(this.updatedContracts)
                    .pipe(catchError((error) => {
                        return throwError(error);
                    }),   finalize(() => {
                        this.isSaveInProgress = false;
                    }),
                    ).subscribe(() => {
                        this.afterContractsUpdated();
                    }));
            }
        } else {
            this.snackbarService.informationSnackBar('Please Update any one grid row');
        }
    }

    getApprovalStatus() {
        if (this.isStatusApproved) {
            this.approvalStatus = this.editionMatrix.isValueChanged ? false : true;
        }
    }

    afterContractsUpdated() {
        const updatedContractRows = this.editionMatrix.updatedContractRows;
        if (this.isStatusApproved) {
            updatedContractRows[0].status = this.editionMatrix.isValueChanged ?
                TradeApprovalStatus.Unapproved : TradeApprovalStatus.Approved;
        }

        this.summaryGrid.selectedContractsToEdit(true, updatedContractRows, this.privileges);
        this.summaryGrid.gridColumnApi.setColumnVisible('rowStatus', false);
        this.editionMatrix.isValueChanged = false;
        this.stepper.next();
    }

    afterContractsFetched() {
        this.editionMatrix.selectedContractsToEdit(false, this.selectedContractsForBulkFunctions, this.privileges);
        this.stepper.previous();
    }

    saveBlockingMessage(message: string) {
        this.errorMessage = message;
    }

    onSummaryEditButtonClicked() {
        this.contractsSelected(this.isEditButtonClicked = true);
        this.editionMatrix.gridColumnApi.setColumnVisible('rowStatus', true);
    }

    onContractSelectionDiscardButtonClicked() {
        if (this.isContractsNextDisabled) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
        } else {
            this.discardButtonDialog();
        }
    }

    onCloseButtonClicked() {
        for (let i = 0; i < this.selectedSectionIds.length; i++) {
            const sectionId = this.selectedSectionIds[i];
            this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.BulkEdition)
                .subscribe(() => {
                    this.selectedSectionIds = this.selectedSectionIds.filter((id) => id !== sectionId);
                }));
        }
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/groupfunctions']);
    }

    ngOnDestroy(): void {
        if (this.getTradesForSubscription) {
            this.getTradesForSubscription.unsubscribe();
        }
    }

    onFieldSelectionDiscardButtonClicked() {
        this.discardButtonDialog();
    }

    onEditionMatrixDiscardButtonClicked() {
        this.discardButtonDialog();
    }

    discardButtonDialog() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
            }
        });
    }
}
