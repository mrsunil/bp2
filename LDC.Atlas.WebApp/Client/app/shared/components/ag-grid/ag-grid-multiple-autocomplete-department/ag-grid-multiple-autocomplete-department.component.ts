import { Component, OnInit } from '@angular/core';
import { AgGridMultipleAutocompleteComponent } from '../ag-grid-multiple-autocomplete/ag-grid-multiple-autocomplete.component';
import { MasterDataProps } from '../../../entities/masterdata-props.entity';
import { MasterData } from '../../../entities/masterdata.entity';
import { FormControl, Validators } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';
import { MasterdataService } from '../../../services/http-services/masterdata.service';
import { Department } from '../../../entities/department.entity';

@Component({
  selector: 'atlas-ag-grid-multiple-autocomplete-department',
  templateUrl: './ag-grid-multiple-autocomplete-department.component.html',
  styleUrls: ['./ag-grid-multiple-autocomplete-department.component.scss']
})
export class AgGridMultipleAutocompleteDepartmentComponent extends AgGridMultipleAutocompleteComponent implements OnInit, AgRendererComponent {

    companyId: string;
    isLoading = true;

    options: Department[];
    selectedOptions: Department[];
    allOptionsElement: Department;

    constructor(private masterDataService: MasterdataService) {
        super();
    }

    ngOnInit() {
    }

    agInit(params: any):void {

        this.params = params;
        this.formControl = new FormControl('', [Validators.required]);
        this.isRequiredField = params.isRequired;
        this.selectedOptions = this.params.value.map((o) => o);
        this.allOptionsElement = params.allOptionsElement;
        this.displayCode = params.displayCode;
        this.codeProperty = params.codeProperty;
        this.displayProperty = params.displayProperty;
        this.placeholder = params.placeholder;
        this.placeholderFilter = params.placeholderFilter;
        this.elementName = params.elementName;
        this.companyId = this.params.data.companyId;
        this.allSelected = this.params.data.allDepartments;

        this.masterDataService.getMasterData([MasterDataProps.Departments], this.companyId).subscribe((masterData: MasterData) => {
            this.options = masterData.departments;
            this.selectedOptions = this.options.filter((findoption) => {
                return this.selectedOptions.find((selectedoption) => selectedoption.departmentId === findoption.departmentId) ? true : false;
            });
            this.isLoading = false;
        });
        this.formControl.patchValue(this.selectedOptions);
        this.onValueChanged(this.formControl.value);
    }

    onValueChanged(input: any) {
        if (this.multipleAutocompleteDropdownComponent) {
            this.allSelected = this.multipleAutocompleteDropdownComponent.allSelected;
        }

        if (this.formControl.valid && !this.allSelected) {
            this.params.data[this.params.colDef.field] = this.formControl.value;
        } else {
            this.params.data[this.params.colDef.field] = [];
        }
        if (this.multipleAutocompleteDropdownComponent) {
            this.params.data["allDepartments"] = this.multipleAutocompleteDropdownComponent.allSelected;
        }
    }

}
