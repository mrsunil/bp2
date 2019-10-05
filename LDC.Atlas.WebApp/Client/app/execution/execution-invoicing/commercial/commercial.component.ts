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
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { ContractsToCostInvoice } from '../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { ContractsToInvoice } from '../../../shared/services/execution/dtos/contracts-to-invoice';
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
import { CommercialSelectionComponent } from './components/commercial-selection/commercial-selection.component';
import { CommercialSummaryComponent } from './components/summary/commercial-summary.component';
import { CommercialWorkingPageComponent } from './components/working-page/commercial-working-page.component';

@Component({
    selector: 'atlas-commercial',
    templateUrl: './commercial.component.html',
    styleUrls: ['./commercial.component.scss'],
})
export class CommercialComponent extends InvoicingBaseFormComponent implements OnInit {
    @ViewChild('commercialSelectionComponent') commercialSelectionComponent: CommercialSelectionComponent;
    @ViewChild('commercialWorkingPageComponent') commercialWorkingPageComponent: CommercialWorkingPageComponent;
    @ViewChild('commercialSummaryComponent') commercialSummaryComponent: CommercialSummaryComponent;
    @ViewChild('stepper') stepper: MatStepper;

    filteredCompanyBankAccounts: CompanyBankAccounts[] = [];
    currencySelected: string;
    selectedSupplier: Counterparty;
    masterData: MasterData;
    commercialInvoiceFormGroup: FormGroup;
    taxRecords: TaxRecord[];
    totalData: TaxRecord;
    invoiceCostContracts: ContractsToCostInvoice[];
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    currentStep: number = 0;
    invoiceLabel: string;
    selectedInvoiceId: number;
    PermissionLevels = PermissionLevels;
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
    isCompleted: boolean = false;
    weightCode: string;
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
        super(
            dialog, router, companyManager, snackbarService, documentService, window, utilService,
            executionService, route, formBuilder, preaccountingService, formConfigurationProvider, documentPopupService);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.companyManager.getCurrentCompanyId();
        const companyDetails = this.companyManager.getCurrentCompany();
        this.weightCode = companyDetails.weightCode;
    }

    ngOnInit() {
        this.commercialInvoiceFormGroup = this.formBuilder.group({
            commercialSelectionComponent: this.commercialSelectionComponent.getFormGroup(),
            commercialWorkingPageComponent: this.commercialWorkingPageComponent.getFormGroup(),
            commercialSummaryComponent: this.commercialSummaryComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.commercialSelectionComponent,
            this.commercialWorkingPageComponent,
            this.commercialSummaryComponent);
        this.getInvoiceSetupByCompany();
        this.route.queryParams.subscribe((params) => {
            this.selectedInvoiceId = params['invoiceId'];
            this.isFromGrid = params['isFromGrid'];
        });
        if (this.isFromGrid) {
            this.launchSelectedInvoiceSummary(this.selectedInvoiceId);
        }
        this.masterData = this.route.snapshot.data.masterdata;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if ((this.commercialWorkingPageComponent.invoiceWorkingFormGroup.dirty ||
            this.commercialSelectionComponent.invoiceSelectionContractFormGroup.dirty) &&
            this.stepper.selectedIndex !== 2) {
            $event.returnValue = true;
        }
    }

    launchSelectedInvoiceSummary(selectedInvoiceId: number) {
        this.subscriptions.push(this.executionService.
            getInvoiceById(selectedInvoiceId)
            .subscribe((data) => {
                this.stepper.selectedIndex = 2;
                this.commercialSummaryComponent.setSummaryFieldsFromGrid(data);
                this.invoiceLabel = data.invoiceCode;
            }));
    }

    contractsSelected() {
        const contracts = this.commercialSelectionComponent.
            contractSelectionComponent.selectedContractsToInvoice as ContractsToInvoice[];
        if (contracts) {
            this.commercialWorkingPageComponent.valueOfGoodsComponent.contractToBeSelected(contracts);
            this.commercialWorkingPageComponent.selectionFormComponent.contractToBeSelected(contracts);
            if (!this.isCreateInvoiceButtonClicked) {
                this.commercialWorkingPageComponent.paymentComponent.contractToBeSelected(contracts);
            }
            this.commercialSummaryComponent.contractToBeSelected(contracts);
            contracts.map((contract) => {
                this.currencySelected = contract ? contract.currencyCode : null;
                const selectedCounterparty = contract ? contract.counterparty : null;
                this.selectedSupplier = this.masterData.counterparties.find(
                    (counterParty) => counterParty.counterpartyCode === selectedCounterparty);
            });
        }
        this.getDecimalandPricingOption();
    }

    getInvoiceSetupByCompany() {
        this.subscriptions.push(this.executionService.getInvoiceSetupByCompany()
            .subscribe((data) => {
                if (this.invoiceTypeId === InvoiceTypes.Sales || this.invoiceTypeId === InvoiceTypes.Purchase) {
                    this.commercialWorkingPageComponent.selectionFormComponent.setDefaultAuthorizeForPosting(data.authorizedForPosting);
                    this.commercialWorkingPageComponent.taxesComponent.setDefaultVatCode(data.defaultVATCode);
                    this.commercialWorkingPageComponent.taxCostsComponent.setDefaultVatCode(data.defaultVATCode);
                }
            }));
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    onBackButtonClicked(index: number) {
        this.isCompleted = false;
        this.stepper.selectedIndex = index;
    }

    onMoveButtonClicked(index: number) {
        let isFormValid = false;
        if (this.commercialSelectionComponent.pricingOptionsComponent.formGroup.valid) {
            if (this.isValid) {
                this.contractsSelected();
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

    nextInvoiceButtonClicked() {
        let searchContractRef: string = '';
        let searchCounterParty: string = '';
        let searchCharterRef: string = '';
        let invoiceType: number = 0;
        searchContractRef = this.commercialSelectionComponent.
            contractSelectionComponent.searchContractReference;
        searchCounterParty = this.commercialSelectionComponent.
            contractSelectionComponent.searchCounterParty;
        searchCharterRef = this.commercialSelectionComponent.
            contractSelectionComponent.searchCharterReference;
        invoiceType = this.commercialSelectionComponent.
            contractSelectionComponent.invoiceType;

        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/' + encodeURIComponent(invoiceType.toString())],
            {
                queryParams: {
                    savedContractReference: searchContractRef, savedCounterParty: searchCounterParty,
                    savedCharterReference: searchCharterRef,
                },
                skipLocationChange: true,
            });
    }

    getDecimalandPricingOption() {
        const decimalOptionValue = this.commercialWorkingPageComponent.valueOfGoodsComponent.decimalOptionValue;
        const pricingOptionValue = this.commercialWorkingPageComponent.valueOfGoodsComponent.pricingOptionValue;
        this.commercialSummaryComponent.setDecimalAndPricingOption(decimalOptionValue, pricingOptionValue);
    }

    onPricingAndDecimalOptionSelected(model: any) {
        if (this.commercialWorkingPageComponent) {
            this.commercialWorkingPageComponent.pricingAndDecimalOptionSelected(model.pricingSelected, model.decimalOptionSelected);
        }
    }

    beforeInvoiceActions(invoiceRecord: InvoiceRecord) {
        this.updateInvoiceLines(invoiceRecord);
    }

    afterInvoiceActions(invoiceRecord: InvoiceRecord) {
        (this.selectedbankAccountId) ? invoiceRecord.bankAccountId = this.selectedbankAccountId : null;
        const costContracts = this.commercialWorkingPageComponent.
            addCostComponent.getAllInvoiceCostLines() as ContractsToCostInvoice[];
        this.commercialSummaryComponent.costContractToBeSelected(costContracts);
        this.commercialSummaryComponent.populateInvoiceRecord(invoiceRecord);
        this.stepper.next();
    }

    onContractsSelected(contractsSelected: boolean) {
        this.isValid = contractsSelected;
    }

    updateInvoiceLines(invoiceRecord: InvoiceRecord) {
        invoiceRecord.invoiceLines.forEach(
            (invoiceLine) => {
                if (!invoiceLine.vatCode) {
                    invoiceLine.vatCode =
                        this.commercialWorkingPageComponent.taxesComponent.invoiceGoodsVatCodeCntrl.value;
                }
            },
        );
    }

    onOpenDialogOnPreviewOrSaveClicked() {
        this.isLoading = true;
        if (this.commercialWorkingPageComponent.invoiceWorkingFormGroup.valid) {
            (this.invoiceTypeId === InvoiceTypes.Sales) ? this.getCompanyBankAccounts() :
                this.showConfirmationModal(this.hasTemplate && this.previewDocumentCtrl.value);
        } else {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors...');
            this.isLoading = false;
        }
        this.costAndTaxRowsSelected();
    }

    costAndTaxRowsSelected() {
        this.commercialWorkingPageComponent.addCostComponent.setAllInvoiceCostLines();
        this.invoiceCostContracts = this.commercialWorkingPageComponent.addCostComponent
            .getAllInvoiceCostLines();
        this.getTaxRecordsForSelectedCost();
    }
    getTaxRecordsForSelectedCost() {
        this.taxRecords = this.commercialWorkingPageComponent.taxCostsComponent.taxesGridRows as TaxRecord[];
        this.totalData = this.commercialWorkingPageComponent.totalData as TaxRecord;
    }

    ontotalAmountCalculated(model: TaxRecord) {
        this.totalData = model;
    }

    onChangeCostContract(model: ContractsToCostInvoice[]) {
        this.invoiceCostContracts = model;
    }

    getCompanyBankAccounts() {
        if (this.selectedSupplier && this.currencySelected) {
            this.masterdataService.getCompanyBankAccounts(this.currencySelected)
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

}
