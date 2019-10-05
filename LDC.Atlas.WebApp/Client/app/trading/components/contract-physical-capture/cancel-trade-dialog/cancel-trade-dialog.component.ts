import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { CostType } from '../../../../shared/entities/cost-type.entity';
import { DefaultAccountingSetup } from '../../../../shared/entities/default-accounting-setup.entity';
import { PhysicalDocumentTemplate } from '../../../../shared/entities/document-template.entity';
import { MasterDataProps } from '../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../shared/entities/nominal-account.entity';
import { PriceUnit } from '../../../../shared/entities/price-unit.entity';
import { Section } from '../../../../shared/entities/section.entity';
import { WeightUnit } from '../../../../shared/entities/weight-unit.entity';
import { ContractTypes } from '../../../../shared/enums/contract-type.enum';
import { DocumentTypes } from '../../../../shared/enums/document-type.enum';
import { InvoiceSourceType } from '../../../../shared/enums/invoice-source-type.enum';
import { CompanyConfigurationRecord } from '../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../shared/services/http-services/configuration.service';
import { DocumentService } from '../../../../shared/services/http-services/document.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UtilService } from '../../../../shared/services/util.service';
import { CancelTrade } from '../../../entities/cancel-trade.entity';

@Component({
    selector: 'atlas-cancel-trade-dialog',
    templateUrl: './cancel-trade-dialog.component.html',
    styleUrls: ['./cancel-trade-dialog.component.scss'],
})
export class CancelTradeDialogComponent extends BaseFormComponent implements OnInit {
    cancelTradeData: Section;
    contractLabel: String;
    isSectionClosed: boolean = true;
    isConfirmCancellationEdit: boolean = false;
    counterPartyCtrl = new AtlasFormControl('CounterParty');
    cancellationDateCtrl = new AtlasFormControl('CancellationDate');
    dueDateCtrl = new AtlasFormControl('DueDate');
    contractPriceCtrl = new AtlasFormControl('ContractPrice');
    currencyCtrl = new AtlasFormControl('Currency');
    priceCodeCtrl = new AtlasFormControl('PriceCode');
    settlementPriceCtrl = new AtlasFormControl('SettlementPrice');
    settlementValueCtrl = new AtlasFormControl('SettlementValue');
    quantityCtrl = new AtlasFormControl('Quantity');
    quantityCodeCtrl = new AtlasFormControl('QuantityCode');
    nominalAccountCtrl = new AtlasFormControl('NominalAccount');
    costTypeCtrl = new AtlasFormControl('CostType');
    narrativeCtrl = new AtlasFormControl('Narrative');
    externalInternalCtrl = new AtlasFormControl('ExternalInternal');
    templateCtrl = new AtlasFormControl('Template');
    isSectionClosedCtrl = new AtlasFormControl('ToggleClosedTrade');
    contractReferenceCtrl = new AtlasFormControl('ContractReference');
    isCheckboxChecked: boolean;
    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.PriceUnits,
        MasterDataProps.WeightUnits,
        MasterDataProps.CostTypes,
        MasterDataProps.NominalAccounts,
    ];
    filteredPriceCodeList: PriceUnit[];
    filteredQuantityCode: WeightUnit[];
    filteredCostType: CostType[];
    filteredNominalAccount: NominalAccount[];
    costType: CostType;
    nominalAccount: NominalAccount;
    settlementValue: number;
    cancelTradeFormGroup: FormGroup;
    settlementPriceErrorMap: Map<string, string> = new Map()
        .set('min', 'Negative Value Not allowed');
    invoiceSourceType: string[];
    filteredTemplates: PhysicalDocumentTemplate[] = [];
    isTemplateRequired: boolean = false;
    settlementValueToolTip: any = '';
    filterDate: Date = this.companyManager.getCurrentCompanyDate().toDate();
    defaultAccountingSetup: DefaultAccountingSetup;
    companyConfigurationRecord: CompanyConfigurationRecord;
    now: moment.Moment;
    companyId: string = this.companyManager.getCurrentCompany().companyId;

    constructor(public thisDialogRef: MatDialogRef<CancelTradeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected snackbarService: SnackbarService,
        protected companyManager: CompanyManagerService,
        protected documentService: DocumentService,
        protected configurationService: ConfigurationService,
        protected utilService: UtilService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        thisDialogRef.disableClose = true;
        this.cancelTradeData = data.sectionModel;
        this.now = this.companyManager.getCurrentCompanyDate();
    }

    ngOnInit() {
        this.getFormGroup();
        this.contractLabel = this.cancelTradeData.contractLabel;
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.filteredPriceCodeList = this.masterdata.priceUnits;
                this.filteredQuantityCode = this.masterdata.weightUnits;
                this.filteredCostType = this.masterdata.costTypes;
                this.filteredNominalAccount = this.masterdata.nominalAccounts;
                this.onDisablingFields();
                this.setDefaultValues();
                this.setValidators();
                this.settlementPriceCtrl.valueChanges.subscribe((v) =>
                    this.setSettlementValue(),
                );
            });
        this.invoiceSourceType = this.getInvoiceSourceTypeEnum();

        this.subscriptions.push(this.documentService.getTemplates(DocumentTypes.InvoiceCancellation).subscribe((templates) => {
            this.filteredTemplates = templates.value;
        }));
        this.companyConfigurationRecord = new CompanyConfigurationRecord();
        this.subscriptions.push(this.configurationService.getCompanyConfigurationDetails(this.companyId, this.now.year())
            .subscribe((companyConfigurationRecord: CompanyConfigurationRecord) => {
                if (companyConfigurationRecord) {
                    this.companyConfigurationRecord = companyConfigurationRecord;
                    this.defaultAccountingSetup = this.companyConfigurationRecord.defaultAccountingSetup;
                }
            }));
    }

    onToggleClosedTrade(isCloseTrade: boolean) {
        this.isSectionClosed = isCloseTrade;
        this.cancelTradeFormGroup.controls['isSectionClosedCtrl'].patchValue(isCloseTrade);
    }

    getFormGroup() {
        this.cancelTradeFormGroup = this.formBuilder.group({
            counterPartyCtrl: this.counterPartyCtrl,
            cancellationDateCtrl: this.cancellationDateCtrl,
            dueDateCtrl: this.dueDateCtrl,
            contractPriceCtrl: this.contractPriceCtrl,
            currencyCtrl: this.currencyCtrl,
            priceCodeCtrl: this.priceCodeCtrl,
            settlementPriceCtrl: this.settlementPriceCtrl,
            settlementValueCtrl: this.settlementValueCtrl,
            quantityCtrl: this.quantityCtrl,
            quantityCodeCtrl: this.quantityCodeCtrl,
            nominalAccountCtrl: this.nominalAccountCtrl,
            costTypeCtrl: this.costTypeCtrl,
            narrativeCtrl: this.narrativeCtrl,
            externalInternalCtrl: this.externalInternalCtrl,
            templateCtrl: this.templateCtrl,
            isSectionClosedCtrl: this.isSectionClosedCtrl,
            contractReferenceCtrl: this.contractReferenceCtrl,
        });
        return super.getFormGroup();
    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close();
    }

    onConfirmButtonClicked() {
        if (this.cancelTradeFormGroup.valid) {
            this.thisDialogRef.close(this.getCancelTradeEntity(this.cancelTradeFormGroup));
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        }
    }

    getCancelTradeEntity(cancelTradeFormGroup: FormGroup): CancelTrade {
        const cancelTradeModel = new CancelTrade();
        cancelTradeModel.counterParty = this.counterPartyCtrl.value;
        cancelTradeModel.cancellationDate = this.cancellationDateCtrl.value;
        cancelTradeModel.dueDate = this.dueDateCtrl.value;
        cancelTradeModel.contractPrice = this.contractPriceCtrl.value;
        cancelTradeModel.currency = this.currencyCtrl.value;
        cancelTradeModel.priceCode = this.priceCodeCtrl.value;
        cancelTradeModel.settlementPrice = this.settlementPriceCtrl.value;
        cancelTradeModel.settlementValue = this.settlementValueCtrl.value;
        cancelTradeModel.quantity = this.quantityCtrl.value;
        cancelTradeModel.quantityCode = this.quantityCodeCtrl.value;
        cancelTradeModel.nominalAccount = this.nominalAccountCtrl.value;
        cancelTradeModel.costType = this.costTypeCtrl.value;
        cancelTradeModel.narrative = this.narrativeCtrl.value;
        cancelTradeModel.externalInternal = this.externalInternalCtrl.value;
        cancelTradeModel.template = this.templateCtrl.value ?
            (this.templateCtrl.value as PhysicalDocumentTemplate).path : null;
        cancelTradeModel.isSectionClosed = this.isSectionClosedCtrl.value;
        cancelTradeModel.contractLabel = this.contractReferenceCtrl.value;
        cancelTradeModel.costTypeForCancellationLoss = this.defaultAccountingSetup.cancellationLoss;

        return cancelTradeModel;
    }

    onDisablingFields() {
        this.counterPartyCtrl.disable();
        this.contractPriceCtrl.disable();
        this.currencyCtrl.disable();
        this.priceCodeCtrl.disable();
        this.settlementValueCtrl.disable();
        this.quantityCtrl.disable();
        this.quantityCodeCtrl.disable();
        this.costTypeCtrl.disable();
        this.nominalAccountCtrl.disable();

    }
    numberFormatter(params, isPrice: boolean) {
        if (isPrice) {

            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params);
        } else if (params) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params);
        }
    }

    setDefaultValues() {
        if (this.cancelTradeData.contractType === ContractTypes.Purchase) {
            this.counterPartyCtrl.patchValue(this.cancelTradeData.sellerCode);
        }
        if (this.cancelTradeData.contractType === ContractTypes.Sale) {
            this.counterPartyCtrl.patchValue(this.cancelTradeData.buyerCode);

        }
        this.contractPriceCtrl.patchValue(this.numberFormatter(this.cancelTradeData.price, true));
        this.currencyCtrl.patchValue(this.cancelTradeData.currencyCode);
        this.quantityCtrl.patchValue(this.numberFormatter(this.cancelTradeData.quantity, false));
        if (this.cancelTradeData.priceUnitId) {
            this.priceCodeCtrl.patchValue((this.filteredPriceCodeList.find((x) =>
                x.priceUnitId === this.cancelTradeData.priceUnitId).priceCode));
        }
        if (this.cancelTradeData.weightUnitId) {
            this.quantityCodeCtrl.patchValue((this.filteredQuantityCode.find((x) =>
                x.weightUnitId === this.cancelTradeData.weightUnitId).weightCode));
        }
        this.narrativeCtrl.patchValue('Cancellation');
        this.cancelTradeFormGroup.controls['isSectionClosedCtrl'].patchValue(this.isSectionClosed);
        this.cancelTradeFormGroup.controls['externalInternalCtrl'].patchValue(InvoiceSourceType[InvoiceSourceType.External].toString());
        this.contractReferenceCtrl.patchValue(this.cancelTradeData.contractLabel);
        this.cancellationDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.dueDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
    }

    setSettlementValue() {
        this.settlementValueCtrl.setValue('');
        if (this.settlementPriceCtrl.valid && this.settlementPriceCtrl.value >= 0) {
            this.settlementValue = (Number(this.contractPriceCtrl.value) - Number(this.settlementPriceCtrl.value)) * Number(this.cancelTradeData.quantity);
            this.settlementValueCtrl.setValue(Math.abs(this.settlementValue).toFixed(2));
            if (this.settlementValue.toString() > this.settlementValue.toFixed(2)) {
                this.settlementValueToolTip = Math.abs(this.settlementValue);
            }
        }
        this.setCostType(this.settlementValue);
    }

    setValidators() {
        this.cancellationDateCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.dueDateCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.settlementPriceCtrl.setValidators(
            Validators.compose([Validators.required, Validators.min(0)]),
        );
        this.externalInternalCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.cancelTradeFormGroup.updateValueAndValidity();
        this.cancelTradeFormGroup.get('externalInternalCtrl').valueChanges.subscribe((externalInternal) => {
            if (externalInternal === InvoiceSourceType[InvoiceSourceType.Inhouse].toString()) {
                this.templateCtrl.setValidators([Validators.required]);
                this.isTemplateRequired = true;
            } else {
                this.cancelTradeFormGroup.get('templateCtrl').reset();
                this.isTemplateRequired = false;
                this.templateCtrl.setValidators(null);
            }
            this.templateCtrl.updateValueAndValidity();
        });
    }

    setCostType(settlementValue: number) {
        this.costTypeCtrl.setValue('');
        this.nominalAccountCtrl.setValue('');
        this.costType = {} as CostType;

        if (this.cancelTradeData.contractType === ContractTypes.Purchase) {
            if (settlementValue < 0 || settlementValue === 0) {
                if (this.defaultAccountingSetup) {
                    this.costType = this.filteredCostType.find((costType) =>
                        costType.costTypeCode === this.defaultAccountingSetup.cancellationGain);
                }
            }
            if (settlementValue > 0) {
                if (this.defaultAccountingSetup) {
                    this.costType = this.filteredCostType.find((costType) =>
                        costType.costTypeCode === this.defaultAccountingSetup.cancellationLoss,
                    );
                }
            }
        }

        if (this.cancelTradeData.contractType === ContractTypes.Sale) {
            if (settlementValue < 0) {
                this.costType = this.filteredCostType.find((costType) =>
                    costType.costTypeCode === this.defaultAccountingSetup.cancellationLoss);
            }
            if (settlementValue > 0 || settlementValue === 0) {
                this.costType = this.filteredCostType.find((costType) =>
                    costType.costTypeCode === this.defaultAccountingSetup.cancellationGain,
                );
            }
        }
        if (this.costType) {
            if (this.costType.costTypeCode) {
                this.costTypeCtrl.setValue(this.costType.costTypeCode);
                this.setNominalAccount(this.costType);
            }
        }
    }

    setNominalAccount(costType: CostType) {
        if (costType) {
            this.nominalAccount = this.filteredNominalAccount.find((nomaccount) =>
                nomaccount.accountNumber === costType.nominalAccountCode,
            );
        }
        this.nominalAccountCtrl.setValue(this.nominalAccount.accountNumber);
    }

    getInvoiceSourceTypeEnum(): string[] {
        const myEnum = [];
        const objectEnum = Object.keys(InvoiceSourceType);
        const values = objectEnum.slice(0, objectEnum.length / 2);
        const keys = objectEnum.slice(objectEnum.length / 2);

        for (let i = 0; i < objectEnum.length / 2; i++) {
            myEnum.push({ viewValue: keys[i], value: values[i] });
        }
        return myEnum;
    }
    onValueChange() {
        if (this.cancelTradeFormGroup.valid) {
            this.isConfirmCancellationEdit = true;
        } else {
            this.isConfirmCancellationEdit = false;
        }
    }
}
