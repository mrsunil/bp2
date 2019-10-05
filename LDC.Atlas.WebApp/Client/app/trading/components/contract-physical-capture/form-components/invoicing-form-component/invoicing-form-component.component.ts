import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ContractInvoice } from '../../../../../shared/entities/contract-invoice-type.entity';
import { InvoiceMarkingDetails } from '../../../../../shared/entities/invoice-marking-status-tab.entity';
import { ContractInvoiceType } from '../../../../../shared/enums/contract-invoice-type.enum';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { TradeDataService } from '../../../../services/trade-data.service';

@Component({
    selector: 'atlas-invoicing-form-component',
    templateUrl: './invoicing-form-component.component.html',
    styleUrls: ['./invoicing-form-component.component.scss'],
})
export class InvoicingFormComponentComponent extends BaseFormComponent implements OnInit {
    quantityCodeCtrl = new AtlasFormControl('invoicedQuantityCode');
    invoiceReferenceCtrl = new AtlasFormControl('invoiceReference');
    salesPercentageCtrl = new AtlasFormControl('salesPercentage');
    quantityInvoicedCtrl = new AtlasFormControl('invoicedQuantity');
    invoiceTypeCtrl = new AtlasFormControl('invoiceType');

    invoiceMarkingModel: InvoiceMarkingDetails;
    invoiceDate: Date;
    hasEmptyState: boolean = true;
    invoicingEmptyMessage: string = 'This trade has not been invoiced yet';
    invoiceDateFormatted: string;
    isLoading = true;
    isEdit = false;

    private sectionId: number;
    dataVersionId: number;
    invoiceTypeArray: ContractInvoice[];
    filteredInvoiceTypeArray: ContractInvoice[];
    invoicePercentage: number;
    invoiceMarkingDetails: InvoiceMarkingDetails;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
        private formatDate: FormatDatePipe,
        private tradeDataService: TradeDataService,
        private utilService: UtilService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        if (this.sectionId !== 0) {
            this.getInvoiceStatusValues();
        } else {
            this.isLoading = false;
        }
        this.invoiceTypeArray = [
            {
                contractInvoiceType: 'Washout',
                contractInvoiceTypeId: ContractInvoiceType.Washout,
            },
            {
                contractInvoiceType: 'Cancellation',
                contractInvoiceTypeId: ContractInvoiceType.Cancellation,
            },
        ];
        this.filteredInvoiceTypeArray = this.invoiceTypeArray;
        this.invoiceTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredInvoiceTypeArray = this.utilService.filterListforAutocomplete(
                input,
                this.invoiceTypeArray,
                ['contractInvoiceType', 'contractInvoiceTypeId'],
            );
        });
        this.setValidators();

    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            quantityCodeCtrl: this.quantityCodeCtrl,
            invoiceReferenceCtrl: this.invoiceReferenceCtrl,
            salesPercentageCtrl: this.salesPercentageCtrl,
            quantityInvoicedCtrl: this.quantityInvoicedCtrl,
            invoiceTypeCtrl: this.invoiceTypeCtrl,
        });
        return super.getFormGroup();
    }

    getInvoiceStatusValues() {
        this.subscriptions.push(this.tradeDataService.getInvoiceMarkingDetails()
            .subscribe((data: InvoiceMarkingDetails) => {
                if (data) {
                    this.invoiceMarkingDetails = data;
                    this.invoiceDate = data.createdDateTime;
                    this.invoiceDateFormatted = this.formatDate.transform(data.createdDateTime);
                    this.invoiceReferenceCtrl.patchValue(data.invoiceCode);
                    this.quantityCodeCtrl.patchValue(data.weightCode);
                    if (data.invoicePercent) {
                        this.invoicePercentage = data.invoicePercent;
                    }
                    this.checkIfEmpty();
                }
                this.isLoading = false;
            },
            ));
    }

    checkIfEmpty() {
        const zero = 0;
        let isNotEmpty = false;
        if (this.invoiceReferenceCtrl.value && this.invoiceReferenceCtrl.value !== '') {
            isNotEmpty = true;
        } else if (this.quantityInvoicedCtrl.value && this.quantityInvoicedCtrl.value !== 0) {
            isNotEmpty = true;
        } else if (this.salesPercentageCtrl.value && this.salesPercentageCtrl.value !== zero.toFixed(2)) {
            isNotEmpty = true;
        } else if (this.invoiceTypeCtrl.value && this.invoiceReferenceCtrl.value !== '' && this.isEdit) {
            isNotEmpty = true;
        }
        this.hasEmptyState = !isNotEmpty;
    }

    totalValuesCalculated(model: any) {
        this.quantityInvoicedCtrl.patchValue(model.totalQuantity);
        this.salesPercentageCtrl.setValue((model.totalInvoiceValuePercent ? model.totalInvoiceValuePercent : 0).toFixed(2));
        this.checkIfEmpty();
    }
    setValidators() {
        this.invoiceTypeCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.invoiceTypeArray,
                    nameof<ContractInvoice>('contractInvoiceType'),
                ),
            ]),
        );
    }

    initForm(entity: any, isEdit: boolean): any {
        if (!isEdit || this.invoicePercentage === 100) {
            this.invoiceTypeCtrl.disable();
        } else {
            this.invoiceTypeCtrl.enable();
        }
        this.isEdit = isEdit;
        return entity;
    }
    setContractInvoiceType(invoiceTypeId: number) {
        if (invoiceTypeId) {
            this.invoiceTypeCtrl.patchValue(this.invoiceTypeArray[invoiceTypeId - 1].contractInvoiceType);
        }
    }
    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;
        if (this.invoiceTypeCtrl.value === ContractInvoiceType[1]) {
            section.contractInvoiceTypeId = ContractInvoiceType.Washout;
        } else if (this.invoiceTypeCtrl.value === ContractInvoiceType[2]) {
            section.contractInvoiceTypeId = ContractInvoiceType.Cancellation;
        }
        return section;
    }
}
