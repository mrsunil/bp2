import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { ApportionBasisType } from '../../../../shared/enums/apportion-basis-type.enum';
import { ContractsToCostInvoice } from '../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-apportion-dialog',
    templateUrl: './apportion-dialog.component.html',
    styleUrls: ['./apportion-dialog.component.scss'],
})
export class ApportionDialogComponent implements OnInit {
    quantityCtrl = new AtlasFormControl('Quantity');
    totalValueCtrl = new AtlasFormControl('TotalValue');
    invoicePercentageCtrl = new AtlasFormControl('InvoicePercentage');
    totalValueBasisCtrl = new AtlasFormControl('TotalValueBasis');
    apportionBasisCtrl = new AtlasFormControl('ApportionBasis');
    apportionBasisType: string[];
    dialogData: {
        selectedRows: ContractsToCostInvoice[],
        totalQuantity: number,
        totalInvoiceValue: number,
    };
    isMixedWeightCode: boolean = false;
    isPartialyInvoiced: boolean = false;
    isMixedRatetypes: boolean = false;
    apportionBasisToolTip: string = '';
    isReadOnly: boolean = true;

    constructor(private snackbarService: SnackbarService,
        public thisDialogRef: MatDialogRef<ApportionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
            selectedRows: ContractsToCostInvoice[], totalQuantity: number, totalInvoiceValue: number,
        }) {
        this.dialogData = data;
    }

    ngOnInit() {
        this.apportionBasisType = this.getApportionBasisTypeEnum();
        this.apportionBasisCtrl.patchValue(ApportionBasisType[ApportionBasisType.TotalValue]);
        this.totalValueBasisCtrl.setValue(100);
        this.setApportionValues();
        this.onChanges();
    }

    getApportionBasisTypeEnum(): string[] {
        const apportionBasisTypeEnum = [];
        const objectEnum = Object.keys(ApportionBasisType);
        const values = objectEnum.slice(0, objectEnum.length / 2);
        const keys = objectEnum.slice(objectEnum.length / 2);

        for (let i = 0; i < objectEnum.length / 2; i++) {
            apportionBasisTypeEnum.push({ viewValue: keys[i], value: values[i] });
        }
        return apportionBasisTypeEnum;
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close();
    }

    onDoneButtonClicked() {
        this.thisDialogRef.close(this.dialogData.selectedRows);
    }

    setApportionValues() {
        if (this.dialogData) {
            this.isReadOnly = true;
            let weightCode: string;
            let rateType: string;
            this.quantityCtrl.patchValue(this.dialogData.totalQuantity);
            this.totalValueCtrl.patchValue(this.dialogData.totalInvoiceValue);
            this.dialogData.selectedRows.forEach((row) => {
                if (!weightCode) {
                    weightCode = row.weightCode;
                }
                if (!rateType) {
                    rateType = row.rateTypeCode;
                }
                if (weightCode !== row.weightCode) {
                    this.isMixedWeightCode = true;
                }
                if (rateType !== row.rateTypeCode) {
                    this.isMixedRatetypes = true;
                }
                if (!this.isPartialyInvoiced && (row.invoicePercent > 0 && row.invoicePercent < 100)) {
                    this.isPartialyInvoiced = true;
                }
            });
            if (this.isPartialyInvoiced) {
                this.invoicePercentageCtrl.setValue('');
                this.invoicePercentageCtrl.disable();
                this.totalValueBasisCtrl.setValue('');
            } else {
                this.invoicePercentageCtrl.setValue(100);
                this.totalValueBasisCtrl.setValue((this.totalValueCtrl.value / this.dialogData.totalInvoiceValue) * 100);
                this.setApportionTooltip();
            }
        }
    }

    setApportionTooltip() {
        this.apportionBasisToolTip = 'The %invoiced basis the value entered above is ' +
            (this.totalValueCtrl.value / this.dialogData.totalInvoiceValue) * 100 + ' but the % invoiced will be reflected as ' +
            this.invoicePercentageCtrl.value + ' % for calculations ';
    }

    onApportionBasisChanged() {
        const selectedBasis: string = this.apportionBasisCtrl.value;
        if (selectedBasis.toLocaleLowerCase() === 'quantity') {
            if (this.isMixedRatetypes || this.isMixedWeightCode || this.isPartialyInvoiced) {
                this.snackbarService.informationSnackBar('Apportion Basis cannot be quantity in' +
                    ' case there is a mix of weight codes or there is a partially invoiced cost line or there is a mix of rate types');
                this.apportionBasisCtrl.patchValue(ApportionBasisType[ApportionBasisType.TotalValue]);
                this.isReadOnly = true;
            } else {
                // make quantity editable
                this.isReadOnly = false;
            }
        } else {
            this.isReadOnly = true;
        }
    }

    onTotalValueChanged() {
        const selectedBasis: string = this.apportionBasisCtrl.value;
        this.totalValueBasisCtrl.setValue((this.totalValueCtrl.value / this.dialogData.totalInvoiceValue) * 100);
        if (this.dialogData.selectedRows) {
            this.dialogData.selectedRows.forEach((costContract) => {
                if (selectedBasis.toLowerCase() === 'quantity') {
                    if (this.totalValueCtrl.value) {
                        costContract.costAmountToInvoice = this.totalValueCtrl.value *
                            (Number(costContract.quantity) / this.quantityCtrl.value);
                    }
                } else {
                    if (this.totalValueCtrl.value) {
                        costContract.costAmountToInvoice = costContract.costAmount *
                            (this.totalValueCtrl.value / this.dialogData.totalInvoiceValue);
                    }
                }
            });

        }
        if (!this.isPartialyInvoiced) {
            this.setApportionTooltip();
        }

    }

    onInvoicedPercentageChanged() {
        if (this.dialogData.selectedRows) {
            this.dialogData.selectedRows.forEach((costContract) => {
                if (this.invoicePercentageCtrl.value) {
                    costContract.invoicePercent = this.invoicePercentageCtrl.value;
                }
            });
        }
    }

    quantityOnChange() {
        if (this.dialogData.selectedRows) {
            this.dialogData.selectedRows.forEach((costContract) => {
                if (this.quantityCtrl.value) {
                    costContract.quantity = (this.quantityCtrl.value *
                        (Number(costContract.quantity) / this.dialogData.totalQuantity)).toString();
                    costContract.costAmountToInvoice = this.totalValueCtrl.value *
                        (Number(costContract.quantity) / this.quantityCtrl.value);
                }
            });
        }
    }

    onChanges(): void {
        this.invoicePercentageCtrl.valueChanges.subscribe(() => {
            this.onInvoicedPercentageChanged();
        });
        this.totalValueCtrl.valueChanges.subscribe(() => {
            this.onTotalValueChanged();
        });
    }
}
