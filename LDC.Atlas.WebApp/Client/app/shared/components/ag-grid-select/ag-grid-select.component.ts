import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange, MatDialog, MatSelectChange } from '@angular/material';
import { AgRendererComponent } from 'ag-grid-angular';
import { MasterdataService } from '../../services/http-services/masterdata.service';
import { ContextualSearchBaseLightBoxComponent } from '../contextual-search/base-light-box/contextual-search-base-light-box.component';
import { AgGridSelect } from './interfaces/ag-grid-select.entity';

@Component({
    selector: 'atlas-ag-grid-select',
    templateUrl: 'ag-grid-select.component.html',
    styleUrls: ['ag-grid-select.component.scss'],
})
export class AgGridSelectComponent implements AgRendererComponent {
    @Input() options: AgGridSelect[];
    private params: any;

    checked = false;
    disabledCheckbox = false;
    formControlName: string;
    formGroup: FormGroup;
    formControl: AbstractControl;
    rowsModal: any;
    gridId: string;
    labelField: string;
    valueField: string;

    constructor(protected dialog: MatDialog, protected masterdataService: MasterdataService) { }

    agInit(params: any): void {
        this.params = params;

        this.valueField = this.params.valueField;
        this.labelField = this.params.labelField;

        this.options = this.composeOptions(this.params.options, this.valueField, this.labelField);
        this.formControlName = this.params.key;
        this.rowsModal = this.params.modalHelperData;
        this.gridId = this.params.gridId;
    }

    onChangeCheckbox(change: MatCheckboxChange) {
        this.checked = change.checked;

        if (change.checked) {
            this.formControl.enable();
            this.formControl.setValidators(Validators.required);
        } else {
            this.formControl.setValue(null);
            this.formControl.disable();
        }
    }

    onSelectionChange(change: MatSelectChange) {
        this.formControl = this.formGroup.controls[this.formControlName];

        if (this.formControl.value) {
            this.formControl.setValidators(Validators.required);
            this.checked = true;
        }
    }

    refresh(params: any): boolean {
        this.formGroup = params.context.formGroup;
        this.formControl = this.formGroup.controls[this.formControlName];

        if (!this.formControl.value) {
            this.checked = false;
        } else {
            this.formControl.setValidators(Validators.required);
            this.formControl.enable();
            this.checked = true;
        }
        return true;
    }

    onExploreClicked(event) {
        if (!this.formControl.disabled) {
            const searchLightBox = this.dialog.open(ContextualSearchBaseLightBoxComponent, {
                data: {
                    gridId: this.gridId,
                    rowData$: this.rowsModal,
                },
                width: '80%',
                height: '80%',
            });

            searchLightBox.afterClosed().subscribe((value: any) => {
                if (value) {
                    const val = new Array();
                    let objectlist: AgGridSelect[];

                    val.push(value);
                    objectlist = this.composeOptions(val, this.valueField, this.labelField);

                    if (this.formGroup) {

                        const actualValues = this.formControl.value;

                        if (actualValues) {
                            actualValues.push(objectlist[0].value);
                            this.formControl.setValue(actualValues);
                        } else {
                            this.formControl.setValue([objectlist[0].value]);
                        }
                    }
                }
            });
        }

        if (event) {
            event.stopPropagation();
        }
    }

    composeOptions(values: any[], propertyValue?: string, propertylabel?: string) {
        const objectList = new Array<AgGridSelect>();

        values.forEach((val) => {
            const object: AgGridSelect =
                propertyValue && propertylabel ? { value: this.parseTostring(val[propertyValue]), label: val[propertylabel] } : { value: val, label: val };
            objectList.push(object);
        });
        return objectList;
    }

    parseTostring(value){
        return isNaN(value) ? value : value.toString();
    }
}
