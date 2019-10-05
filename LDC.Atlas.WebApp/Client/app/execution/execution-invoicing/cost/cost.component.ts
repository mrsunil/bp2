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
import { NominalAccount } from '../../../shared/entities/nominal-account.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { CostDirections } from '../../../shared/enums/cost-direction.enum';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { ContractsToCostInvoice } from '../../../shared/services/execution/dtos/contracts-to-cost-invoice';
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
import { CostSelectionComponent } from './components/cost-selection/cost-selection.component';
import { CostWorkingPageComponent } from './components/cost-working-page/cost-working-page.component';
import { CostSummaryComponent } from './components/summary/cost-summary.component';

@Component({
    selector: 'atlas-cost',
    templateUrl: './cost.component.html',
    styleUrls: ['./cost.component.scss'],
})
export class CostComponent extends InvoicingBaseFormComponent implements OnInit {
    @ViewChild('costSelectionComponent') costSelectionComponent: CostSelectionComponent;
    @ViewChild('costWorkingPageComponent') costWorkingPageComponent: CostWorkingPageComponent;
    @ViewChild('costSummaryComponent') costSummaryComponent: CostSummaryComponent;
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('bankAccountDialogComponent') bankAccountDialogComponent: BankAccountDialogComponent;

    filteredCompanyBankAccounts: CompanyBankAccounts[] = [];
    currencySelected: string;
    selectedSupplier: Counterparty;
    costInvoiceFormGroup: FormGroup;
    taxRecords: TaxRecord[];
    totalData: TaxRecord;
    invoiceCostContracts: ContractsToCostInvoice[];
    nominalAccounts: NominalAccount[];
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    currentStep: number = 0;
    invoiceLabel: string;
    selectedInvoiceId: number;
    PermissionLevels = PermissionLevels;
    isFromGrid: boolean = false;
    isSave: boolean = false;
    invoicingSteps: { [key: string]: number } = {
        templateStep: -1,
        invoiceCreationStep: 0,
        workingStep: 1,
        summaryStep: 2,
    };
    isValid: boolean = false;
    previewDocumentCtrl = new AtlasFormControl('previewDocumentCtrl');
    masterData: MasterData = new MasterData();
    invoiceSetupDataResult: InvoiceSetupResult;
    isCostNarrativeMaxLength: boolean;
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
        this.costInvoiceFormGroup = this.formBuilder.group({
            costSelectionComponent: this.costSelectionComponent.getFormGroup(),
            costWorkingPageComponent: this.costWorkingPageComponent.getFormGroup(),
        });
        this.formComponents.push(this.costSelectionComponent, this.costWorkingPageComponent);
        this.getInvoiceSetupByCompany();
        this.masterData = this.route.snapshot.data.masterdata;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if ((this.costWorkingPageComponent.invoiceCostWorkingFormGroup.dirty ||
            this.costSelectionComponent.invoiceSelectionFormGroup.dirty) &&
            this.isSave === false) {
            $event.returnValue = true;
        }
    }

    nextInvoiceButtonClicked() {
        let searchContractRef: string = '';
        let searchCounterParty: string = '';
        let searchCharterRef: string = '';
        let searchCost: string = '';
        let invoiceType: number = 0;
        searchContractRef = this.costSelectionComponent.contractSearchComponent.searchTerm;
        searchCounterParty = this.costSelectionComponent.contractSearchComponent.searchSupplierTerm;
        searchCharterRef = this.costSelectionComponent.contractSearchComponent.searchCharterTerm;
        searchCost = this.costSelectionComponent.contractSearchComponent.searchCostTerm;
        invoiceType = this.costSelectionComponent.contractSearchComponent.invoiceType;

        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/' + encodeURIComponent(invoiceType.toString())],
            {
                queryParams: {
                    savedContractRefCost: searchContractRef, savedCounterPartyCost: searchCounterParty,
                    savedCharterRefCost: searchCharterRef, savedCost: searchCost,
                },
                skipLocationChange: true,
            });
    }

    beforeInvoiceActions(invoiceRecord: InvoiceRecord) { }

    afterInvoiceActions(invoiceRecord: InvoiceRecord) {
        (this.selectedbankAccountId) ? invoiceRecord.bankAccountId = this.selectedbankAccountId : null;
        this.costSummaryComponent.populateInvoiceRecord(invoiceRecord);
        this.stepper.next();

    }

    onMoveButtonClicked(index: number) {
        let isFormValid = false;
        if (this.costSelectionComponent.costInvoiceeOptionsComponent.formGroup.valid) {
            if (this.isValid) {
                this.costContractsSelected();
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

    onNarrativeValueChanged(maxLength: boolean) {
        this.isCostNarrativeMaxLength = maxLength;
    }

    checkForTotalCostDirection() {
        if (this.costWorkingPageComponent
            .invoicingCostTaxesComponent.totalCostDirection === CostDirections[CostDirections.Payable]) {
            this.showConfirmationModal(this.hasTemplate && this.previewDocumentCtrl.value);
        } else if (this.costWorkingPageComponent
            .invoicingCostTaxesComponent.totalCostDirection === CostDirections[CostDirections.Receivable]) {
            this.getCompanyBankAccounts();
        }
    }

    onOpenDialogOnPreviewOrSaveClicked(createOrPreview) {
        this.isLoading = true;
        this.isSave = true;
        if (this.costWorkingPageComponent.invoiceCostWorkingFormGroup.valid &&
            this.costWorkingPageComponent.validateCostGrid()) {
            if (this.isCostNarrativeMaxLength) {
                this.snackbarService.informationSnackBar(
                    'Narrative length should be less than 30',
                );
                return;
            }
            this.checkForTotalCostDirection();
        } else {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors...');
            this.isLoading = false;
        }
        this.costAndTaxRowsSelected();
    }

    costContractsSelected() {
        const costContracts = this.costSelectionComponent.
            contractSearchComponent.selectedCostContracts as ContractsToCostInvoice[];
        if (costContracts) {
            this.costWorkingPageComponent.invoiceCostSelectedCostComponent.contractToBeSelected(costContracts);
            this.costWorkingPageComponent.costInvoiceSelectionComponent.contractToBeSelected(costContracts);
            costContracts.map((contract) => {
                this.currencySelected = contract ? contract.currencyCode : null;
            });
        }
    }

    getTaxRecordsForSelectedCost() {
        this.taxRecords = this.costWorkingPageComponent.invoicingCostTaxesComponent.taxesGridRows as TaxRecord[];
        this.totalData = this.costWorkingPageComponent.totalData as TaxRecord;
    }

    costAndTaxRowsSelected() {
        this.invoiceCostContracts = this.costWorkingPageComponent.invoiceCostSelectedCostComponent
            .getAllInvoiceCostLines();
        this.getTaxRecordsForSelectedCost();
    }

    getCompanyBankAccounts() {
        if (this.selectedSupplier && this.currencySelected) {
            this.masterdataService.getCompanyBankAccounts(this.currencySelected)
                .subscribe(
                    (data) => {
                        if (data.value.length > 0) {
                            this.filteredCompanyBankAccounts = data.value;
                        }
                        this.showAvailableBankingOptionDialog();
                    },
                    (error) => {
                        console.error(error);
                        this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    });
        } else {
            if (!this.selectedSupplier) {
                this.snackbarService.throwErrorSnackBar('The invoicee is incorrect');
            } else if (!this.currencySelected) {
                this.snackbarService.throwErrorSnackBar('The currency is incorrect');
            }
            this.isLoading = false;
            this.isSave = false;
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

    onCostContractsSelected(costContractsSelected: boolean) {
        this.isValid = costContractsSelected;
    }

    onUserSupplierValueChanged(userSupplier) {
        if (userSupplier) {
            this.costWorkingPageComponent.costInvoiceSelectionComponent.onUserSupplierValueChanged(userSupplier);
            this.selectedSupplier = this.masterData.counterparties.find(
                (counterParty) => counterParty.description === userSupplier);
        }
    }

    getInvoiceSetupByCompany() {
        this.subscriptions.push(this.executionService.getInvoiceSetupByCompany()
            .subscribe((data) => {
                this.invoiceSetupDataResult = data;
                this.costSelectionComponent.contractSearchComponent.setTolerancePercentage(data.tolerancePercentage);
                this.costWorkingPageComponent.invoiceCostSelectedCostComponent.setDefaultVatCode(data.defaultVATCode);
                this.costWorkingPageComponent.costPaymentsComponent.setPaymentTerms(data.paymentTermCode);
                this.costWorkingPageComponent.costInvoiceSelectionComponent.
                    setDefaultAuthorizeForPosting(data.authorizedForPosting);

            }));
    }

    onBackButtonClicked(index: number) {
        this.isCompleted = false;
        this.stepper.selectedIndex = index;
    }

}
