import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AtlasFormControl } from '../../../shared/entities/atlas-form-control';
import { CompanyBankAccounts } from '../../../shared/entities/company-bankaccounts.entity';
import { Counterparty } from '../../../shared/entities/counterparty.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { CostDirections } from '../../../shared/enums/cost-direction.enum';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { ContractsToCostInvoice } from '../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { ContractsToInvoice } from '../../../shared/services/execution/dtos/contracts-to-invoice';
import { CostInvoiceRecord } from '../../../shared/services/execution/dtos/cost-invoice-record';
import { InvoiceRecord } from '../../../shared/services/execution/dtos/invoice-record';
import { TaxRecord } from '../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { DocumentService } from '../../../shared/services/http-services/document.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { PreaccountingService } from '../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UtilService } from '../../../shared/services/util.service';
import { BankAccountDialogComponent } from '../dialog-boxes/bank-account-dialog/bank-account-dialog.component';
import { InvoicingBaseFormComponent } from '../invoicing-base-form/invoicing-base-form.component';
import { GoodsCostSelectionCostComponent } from './components/goods-cost-selection-cost/goods-cost-selection-cost.component';
import { GoodsCostSelectionComponent } from './components/goods-cost-selection/goods-cost-selection.component';
import { GoodsCostSummaryComponent } from './components/goods-cost-summary/goods-cost-summary.component';
import { GoodsCostWorkingPageComponent } from './components/goods-cost-working-page/goods-cost-working-page.component';

@Component({
    selector: 'atlas-goods-cost',
    templateUrl: './goods-cost.component.html',
    styleUrls: ['./goods-cost.component.scss'],
})
export class GoodsCostComponent extends InvoicingBaseFormComponent implements OnInit {

    @ViewChild('goodsCostSelectionComponent') goodsCostSelectionComponent: GoodsCostSelectionComponent;
    @ViewChild('costSelectionComponent') costSelectionComponent: GoodsCostSelectionCostComponent;
    @ViewChild('goodsCostWorkingPageComponent') goodsCostWorkingPageComponent: GoodsCostWorkingPageComponent;
    @ViewChild('goodsCostSummaryComponent') goodsCostSummaryComponent: GoodsCostSummaryComponent;
    @ViewChild('stepper') stepper: MatStepper;

    filteredCompanyBankAccounts: CompanyBankAccounts[] = [];
    currencySelected: string;
    selectedSupplier: Counterparty;
    masterData: MasterData;
    goodsCostSelectedValues: InvoiceRecord;
    totalCostDirection: string;
    goodsCostInvoiceFormGroup: FormGroup;
    taxRecords: TaxRecord[];
    totalData: TaxRecord;
    invoiceCostContracts: ContractsToCostInvoice[];
    invoiceGoodsContracts: ContractsToInvoice[];
    goodsTaxCode: string;
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    invoiceLabel: string;
    selectedInvoiceId: number;
    isFromGrid: boolean = false;
    invoicingSteps: { [key: string]: number } = {
        invoiceContractSelection: 0,
        invoiceCostSelection: 1,
        workingStep: 2,
        summaryStep: 3,
    };
    isValid: boolean = false;
    additionalCostData: CostInvoiceRecord;
    valueOfGoodsData: InvoiceRecord;
    previewDocumentCtrl = new AtlasFormControl('previewDocumentCtrl');
    isCreateInvoiceButtonClicked = false;
    PermissionLevels = PermissionLevels;
    isCostNarrativeMaxLength: boolean;
    isCreationMode: boolean = true;
    isCompleted: boolean = false;

    constructor(
        protected dialog: MatDialog,
        protected router: Router,
        protected companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService,
        protected documentService: DocumentService,
        @Inject(WINDOW) protected window: Window,
        protected utilService: UtilService,
        protected executionService: ExecutionService,
        protected masterdataService: MasterdataService,
        protected route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected preaccountingService: PreaccountingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected documentPopupService: DocumentPopupService) {
        super(dialog, router, companyManager, snackbarService, documentService, window, utilService,
            executionService, route, formBuilder, preaccountingService, formConfigurationProvider, documentPopupService);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.companyManager.getCurrentCompanyId();
    }

    ngOnInit() {
        this.goodsCostInvoiceFormGroup = this.formBuilder.group({
            goodsCostSelectionComponent: this.goodsCostSelectionComponent.getFormGroup(),
            costSelectionComponent: this.costSelectionComponent.getFormGroup(),
            goodsCostWorkingPageComponent: this.goodsCostWorkingPageComponent.getFormGroup(),

        });
        this.formComponents.push(
            this.goodsCostSelectionComponent,
            this.costSelectionComponent,
            this.goodsCostWorkingPageComponent,
        );
        this.getInvoiceSetupByCompany();
        this.masterData = this.route.snapshot.data.masterdata;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.goodsCostInvoiceFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    onMoveButtonClicked(selectedStepperIndex: number) {
        let isFormValid = false;
        if (this.goodsCostSelectionComponent.goodsCostPricingOptionsComponent.formGroup.valid) {
            if (this.isValid) {
                (selectedStepperIndex === this.invoicingSteps.invoiceCostSelection) ? this.goodsContractsSelected() :
                    this.costContractsSelected();
                this.isCompleted = true;
                this.stepper.selectedIndex = selectedStepperIndex;
            }
            isFormValid = true;
        }

        if (!this.isValid) {
            this.snackbarService.throwErrorSnackBar(
                'Please select a contract to proceed.',
            );
        }
        if (!isFormValid) {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors..');
        }
    }

    onContractsSelected(contractsSelected: boolean) {
        this.isValid = contractsSelected;
    }

    onChangeValueOfGoods(model: InvoiceRecord) {
        this.valueOfGoodsData = model;
    }

    ontotalAmountCalculated(model: TaxRecord) {
        this.totalData = model;
    }

    onChangeCostContract(model: ContractsToCostInvoice[]) {
        this.invoiceCostContracts = model;
    }

    goodsContractsSelected() {
        const contracts = this.goodsCostSelectionComponent.
            goodsCostContractSearchComponent.selectedContractsToInvoice as ContractsToInvoice[];
        if (contracts) {
            const sectionIds: number[] = contracts.map((contract) => contract.sectionId);
            this.costSelectionComponent.goodsCostContractsCostComponent.getContractsToInvoice(sectionIds, contracts);
            this.goodsCostWorkingPageComponent.valueOfGoodsComponent.contractToBeSelected(contracts);
            this.goodsCostWorkingPageComponent.detailsComponent.contractToBeSelected(contracts);
            if (!this.isCreateInvoiceButtonClicked) {
                this.goodsCostWorkingPageComponent.paymentsComponent.contractToBeSelected(contracts);
            }
        }
    }

    costContractsSelected() {
        const costsForSelectedContracts = this.costSelectionComponent.
            goodsCostContractsCostComponent.selectedCostContracts as ContractsToCostInvoice[];
        if (costsForSelectedContracts) {
            this.goodsCostWorkingPageComponent.additionalCostComponent.contractToBeSelected(costsForSelectedContracts);
        }
    }

    getTaxRecordsForSelectedCost() {
        this.taxRecords = this.goodsCostWorkingPageComponent.taxCostComponent.taxesGridRows as TaxRecord[];
        this.totalData = this.goodsCostWorkingPageComponent.totalData as TaxRecord;
        this.goodsTaxCode = this.goodsCostWorkingPageComponent.selectedGoodsVatCode as string;
    }

    costAndTaxRowsSelected() {
        this.invoiceCostContracts = this.goodsCostWorkingPageComponent.additionalCostComponent
            .getAllInvoiceCostLines();
        this.invoiceGoodsContracts = this.goodsCostWorkingPageComponent.valueOfGoodsComponent
            .valueOfGoodsGridRows as ContractsToInvoice[];
        this.getTaxRecordsForSelectedCost();
    }

    onPricingAndDecimalOptionSelected(model: any) {
        if (this.goodsCostWorkingPageComponent) {
            this.goodsCostWorkingPageComponent.pricingAndDecimalOptionSelected(model.pricingSelected, model.decimalOptionSelected);
        }
    }

    beforeInvoiceActions(invoiceRecord: InvoiceRecord) {
        this.updateInvoiceLines(invoiceRecord);
    }

    afterInvoiceActions(invoiceRecord: InvoiceRecord) {
        (this.selectedbankAccountId) ? invoiceRecord.bankAccountId = this.selectedbankAccountId : null;
        this.goodsCostSummaryComponent.populateInvoiceRecord(invoiceRecord);
        this.stepper.next();
    }

    updateInvoiceLines(invoiceRecord: InvoiceRecord) {
        invoiceRecord.invoiceLines.forEach(
            (invoiceLine) => {
                if (!invoiceLine.vatCode) {
                    invoiceLine.vatCode = (invoiceLine.costID) ?
                        this.goodsCostWorkingPageComponent.additionalCostComponent.costVatCodeCtrl.value :
                        this.goodsCostWorkingPageComponent.taxGoodsComponent.invoiceGoodsVatCodeCtrl.value;
                }
            });
    }

    onNarrativeValueChanged(maxLength: boolean) {
        this.isCostNarrativeMaxLength = maxLength;
    }

    onOpenDialogOnPreviewOrSaveClicked() {
        this.isLoading = true;
        if (this.goodsCostWorkingPageComponent.invoiceWorkingFormGroup.valid) {
            if (this.isCostNarrativeMaxLength) {
                this.snackbarService.informationSnackBar(
                    'Narrative length should be less than 30',
                );
                return;
            }
            if (!this.goodsCostWorkingPageComponent.additionalCostComponent.validate()) {
                this.snackbarService.informationSnackBar(
                    'Additional cost is invalid',
                );
                return;
            }
            this.checkForPayableorReceivable();
        } else {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors...');
            this.isLoading = false;
        }
        this.costAndTaxRowsSelected();
    }

    checkForPayableorReceivable() {
        this.goodsCostSelectedValues = this.goodsCostWorkingPageComponent.getGoodsCostRecords();
        if (this.goodsCostSelectedValues) {
            this.selectedSupplier = this.masterData.counterparties.find(
                (counterParty) => counterParty.description === this.goodsCostSelectedValues.counterpartyCode);
            (this.goodsCostSelectedValues.costDirection === CostDirections.Payable) ?
                this.showConfirmationModal(this.hasTemplate && this.previewDocumentCtrl.value) :
                this.getCompanyBankAccounts();
        }

    }
    nextInvoiceButtonClicked() {
        let searchContractRef: string = '';
        let searchCounterParty: string = '';
        let searchCharterRef: string = '';
        searchContractRef = this.goodsCostSelectionComponent.
            goodsCostContractSearchComponent.searchTerm;
        searchCounterParty = this.goodsCostSelectionComponent.
            goodsCostContractSearchComponent.searchCounterPartyTerm;
        searchCharterRef = this.goodsCostSelectionComponent.
            goodsCostContractSearchComponent.searchCharterTerm;
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/' + encodeURIComponent(this.invoiceTypeId.toString())],
            {
                queryParams: {
                    savedContractReference: searchContractRef, savedCounterParty: searchCounterParty,
                    savedCharterReference: searchCharterRef,
                },
                skipLocationChange: true,
            });
    }

    getInvoiceSetupByCompany() {
        this.subscriptions.push(this.executionService.getInvoiceSetupByCompany()
            .subscribe((data) => {
                this.costSelectionComponent.goodsCostContractsCostComponent.setTolerancePercentage(data.tolerancePercentage);
                this.goodsCostWorkingPageComponent.setInvoiceSetupByCompany(data);
            }));
    }

    getCompanyBankAccounts() {
        if (this.selectedSupplier && this.goodsCostSelectedValues.currency) {
            this.masterdataService.getCompanyBankAccounts(this.goodsCostSelectedValues.currency)
                .subscribe((data) => {
                    if (data.value.length > 0) {
                        this.filteredCompanyBankAccounts = data.value;
                    }
                    this.showAvailableBankingOptionDialog();
                },
                    (error) => {
                        console.error(error);
                        this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    });
        }
    }

    showAvailableBankingOptionDialog() {
        if (this.filteredCompanyBankAccounts) {
            const availableBankingoptionDialog = this.dialog.open(BankAccountDialogComponent, {
                data: {
                    title: 'Bank Account',
                    okButton: 'Confirm',
                    value: this.filteredCompanyBankAccounts,
                },
            });
            availableBankingoptionDialog.afterClosed().subscribe((answer) => {
                if (!answer) {
                    this.isLoading = false;
                } else if (answer.isClose) {
                    this.selectedbankAccountId = answer.selectedValue;
                    this.showConfirmationModal(this.hasTemplate && this.previewDocumentCtrl.value);
                }
            });
        }
    }

    onBackButtonClicked(index: number) {
        this.isCompleted = false;
        this.stepper.selectedIndex = index;
    }
}
