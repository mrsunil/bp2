import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { InvoiceSetupResult } from '../../../shared/dtos/invoice-setup-result';
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
import { ContractsToWashoutInvoice } from '../../../shared/services/execution/dtos/contracts-to-washout-invoice';
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
import { WashoutSelectionComponent } from './components/washout-selection/washout-selection.component';
import { WashoutSummaryComponent } from './components/washout-summary/washout-summary.component';
import { WashoutWorkingPageComponent } from './components/washout-working-page/washout-working-page.component';

@Component({
    selector: 'atlas-washout',
    templateUrl: './washout.component.html',
    styleUrls: ['./washout.component.scss'],
})
export class WashoutComponent extends InvoicingBaseFormComponent implements OnInit {
    @ViewChild('washoutSelectionComponent') washoutSelectionComponent: WashoutSelectionComponent;
    @ViewChild('washoutWorkingPageComponent') washoutWorkingPageComponent: WashoutWorkingPageComponent;
    @ViewChild('washoutSummaryComponent') washoutSummaryComponent: WashoutSummaryComponent;
    @ViewChild('stepper') stepper: MatStepper;

    filteredCompanyBankAccounts: CompanyBankAccounts[] = [];
    currencySelected: string;
    selectedSupplier: Counterparty;
    masterData: MasterData;
    washoutSelectedValues: InvoiceRecord;
    totalCostDirection: string;
    invoiceSetUpData: InvoiceSetupResult;
    invoiceCostContracts: ContractsToCostInvoice[];
    invoiceGoodsContracts: ContractsToWashoutInvoice[];
    goodsTaxCode: string;
    additionalCostData: CostInvoiceRecord;
    valueOfGoodsData: InvoiceRecord;
    washoutInvoiceFormGroup: FormGroup;
    taxRecords: TaxRecord[];
    totalData: TaxRecord;
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    currentStep: number = 0;
    invoiceLabel: string;
    selectedInvoiceId: number;
    PermissionLevels = PermissionLevels;
    isCostNarrativeMaxLength: boolean;
    isFromGrid: boolean = false;
    invoicingSteps: { [key: string]: number } = {
        templateStep: -1,
        invoiceCreationStep: 0,
        workingStep: 1,
        summaryStep: 2,
    };
    isValid: boolean = false;
    previewDocumentCtrl = new AtlasFormControl('previewDocumentCtrl');
    isCreateInvoiceButtonClicked = false;
    isCreationMode: boolean = true;
    isSaveClicked: boolean = false;
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
        this.company = this.route.snapshot.paramMap.get('company');
        this.route.queryParams.subscribe((params) => {
            this.selectedInvoiceId = params['invoiceId'];
            this.isFromGrid = params['isFromGrid'];
        });
        if (this.isFromGrid) {
            this.launchSelectedInvoiceSummary(this.selectedInvoiceId);
        }
        this.washoutInvoiceFormGroup = this.formBuilder.group({
            washoutSelectionComponent: this.washoutSelectionComponent.getFormGroup(),
            washoutWorkingPageComponent: this.washoutWorkingPageComponent.getFormGroup(),
        });
        this.formComponents.push(this.washoutSelectionComponent, this.washoutWorkingPageComponent);
        this.getInvoiceSetupByCompany();
        this.masterData = this.route.snapshot.data.masterdata;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if ((this.washoutSelectionComponent.invoiceSelectionFormGroup.dirty || this.washoutWorkingPageComponent.invoiceWashoutWorkingFormGroup.dirty) && (this.isSaveClicked === false)) {
            $event.returnValue = true;
        }
    }

    getInvoiceSetupByCompany() {
        this.subscriptions.push(this.executionService.getInvoiceSetupByCompany()
            .subscribe((data) => {
                this.invoiceSetUpData = data;
            }));
    }

    launchSelectedInvoiceSummary(selectedInvoiceId) {
        this.subscriptions.push(this.executionService.
            getInvoiceById(selectedInvoiceId)
            .subscribe((data) => {
                this.stepper.selectedIndex = 4;
                // this.invoiceSummaryStep.populateInvoiceRecordFromGrid(data);
                this.invoiceLabel = data.invoiceCode;
            }));
    }

    beforeInvoiceActions(invoiceRecord: InvoiceRecord) {
        this.updateInvoiceLines(invoiceRecord);
    }

    afterInvoiceActions(invoiceRecord: InvoiceRecord) {

        (this.selectedbankAccountId) ? invoiceRecord.bankAccountId = this.selectedbankAccountId : null;
        this.washoutSummaryComponent.populateInvoiceRecord(invoiceRecord);
        this.stepper.next();
    }

    updateInvoiceLines(invoiceRecord: InvoiceRecord) {
        invoiceRecord.invoiceLines.forEach(
            (invoiceLine) => {
                if (!invoiceLine.vatCode) {
                    invoiceLine.vatCode = (invoiceLine.costID) ?
                        this.washoutWorkingPageComponent.additionalCostComponent.costVatCodeCtrl.value :
                        this.washoutWorkingPageComponent.taxGoodsComponent.goodsVatCodeCtrl.value;
                }
            });
    }

    onNarrativeValueChanged(maxLength: boolean) {
        this.isCostNarrativeMaxLength = maxLength;
    }

    onOpenDialogOnPreviewOrSaveClicked() {
        this.isLoading = true;
        if (this.washoutWorkingPageComponent.invoiceWashoutWorkingFormGroup.valid
            && this.washoutWorkingPageComponent.additionalCostComponent.validate()) {
            if (this.isCostNarrativeMaxLength) {
                this.snackbarService.informationSnackBar(
                    'Narrative length should be less than 30',
                );
                return;
            }
            this.isSaveClicked = true;
            this.checkForPayableorReceivable();
        } else {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors...');
            this.isLoading = false;
        }
        this.costAndTaxRowsSelected();
    }

    onMoveButtonClicked(index: number) {
        let isFormValid = false;
        if (this.washoutSelectionComponent.washoutDecimalsComponent.formGroup.valid) {

            if (this.isValid) {
                this.selectedWashoutContracts();
                this.getTaxRecordsForSelectedCost();
                this.isCompleted = true;
                this.stepper.selectedIndex = index;
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

    selectedWashoutContracts() {
        const selectedSectionIdList: number[] = [];
        if (this.washoutSelectionComponent.
            washoutSearchComponent.selectedWashoutContracts.length > 0) {
            this.washoutSelectionComponent.
                washoutSearchComponent.selectedWashoutContracts.map((data) => {
                    selectedSectionIdList.push(data.sectionId);
                });
            if (this.invoiceSetUpData) {
                this.washoutWorkingPageComponent.taxCostsComponent.setDefaultVatCode(this.invoiceSetUpData.defaultVATCode);
                this.washoutWorkingPageComponent.taxGoodsComponent.setDefaultVatCode(this.invoiceSetUpData.defaultVATCode);
                this.washoutWorkingPageComponent.washoutSelectionComponent.setDefaultAuthorizeForPosting
                    (this.invoiceSetUpData.authorizedForPosting);
                this.washoutWorkingPageComponent.washoutPaymentComponent.setPaymentTerms(this.invoiceSetUpData.paymentTermCode);
                this.washoutWorkingPageComponent.additionalCostComponent.setDefaultVatCode(this.invoiceSetUpData.defaultVATCode);
            }
            this.subscriptions.push(this.executionService.getAllocatedContractsForSelectedWashout(selectedSectionIdList)
                .subscribe(((allocatedWashoutContract) => {
                    if (allocatedWashoutContract) {
                        if (!this.isCreateInvoiceButtonClicked) {
                            this.washoutWorkingPageComponent.contractsSelected(allocatedWashoutContract.value);
                            this.washoutWorkingPageComponent.valueOfGoodsComponent.selectedWashoutContracts(allocatedWashoutContract.value);
                        } else {
                            this.washoutSummaryComponent.washoutContracts(allocatedWashoutContract.value);
                        }
                    }
                })));
        } else {
            this.isValid = false;
        }

    }
    getTaxRecordsForSelectedCost() {
        this.taxRecords = this.washoutWorkingPageComponent.taxCostsComponent.taxesGridRows as TaxRecord[];
        this.totalData = this.washoutWorkingPageComponent.totalData as TaxRecord;
        this.goodsTaxCode = this.washoutWorkingPageComponent.selectedGoodsVatCode as string;
    }

    costAndTaxRowsSelected() {
        this.washoutWorkingPageComponent.additionalCostComponent.setAllInvoiceCostLines();
        this.invoiceCostContracts = this.washoutWorkingPageComponent.additionalCostComponent
            .getAllInvoiceCostLines();
        this.invoiceGoodsContracts = this.washoutWorkingPageComponent.valueOfGoodsComponent
            .valueOfGoodsGridRows as ContractsToWashoutInvoice[];
        this.getTaxRecordsForSelectedCost();
    }

    onWashoutContractsSelected(contractsSelected: boolean) {
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

    onPricingAndDecimalOptionSelected(model: any) {
        if (this.washoutWorkingPageComponent) {
            this.washoutWorkingPageComponent.pricingAndDecimalOptionSelected(model.pricingSelected, model.decimalOptionSelected);
        }
    }

    onCounterPartySelected(counterParty) {
        this.washoutWorkingPageComponent.washoutSelectionComponent.counterPartySelected(counterParty);
    }

    nextInvoiceButtonClicked() {
        let searchContractRef: string = '';
        let searchCounterParty: string = '';
        let searchCharterRef: string = '';
        searchContractRef = this.washoutSelectionComponent.washoutSearchComponent.searchContractReference;
        searchCounterParty = this.washoutSelectionComponent.washoutSearchComponent.searchCounterParty;
        searchCharterRef = this.washoutSelectionComponent.washoutSearchComponent.saveCharterReference;
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

    checkForPayableorReceivable() {
        this.washoutSelectedValues = this.washoutWorkingPageComponent.getWashoutRecords();
        if (this.washoutSelectedValues) {
            this.selectedSupplier = this.masterData.counterparties.find(
                (counterParty) => counterParty.description === this.washoutSelectedValues.counterpartyCode);
            (this.washoutSelectedValues.costDirection === CostDirections.Payable) ?
                this.showConfirmationModal(this.hasTemplate && this.previewDocumentCtrl.value) :
                this.getCompanyBankAccounts();
        }
    }

    getCompanyBankAccounts() {
        if (this.selectedSupplier && this.washoutSelectedValues.currency) {
            this.masterdataService.getCompanyBankAccounts(this.washoutSelectedValues.currency)
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
