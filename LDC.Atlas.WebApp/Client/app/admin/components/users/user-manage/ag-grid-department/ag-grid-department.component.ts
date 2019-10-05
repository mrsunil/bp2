import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';

@Component({
    selector: 'atlas-ag-grid-department',
    templateUrl: './ag-grid-department.component.html',
    styleUrls: ['./ag-grid-department.component.scss'],
})

export class AgGridDepartmentComponent implements AgRendererComponent {

    constructor(private masterDataService: MasterdataService) { }

    allSelected = true;
    isSelectedValue: boolean;
    displayValue = true;
    valueProperty: string = 'departmentId';
    codeProperty: string = 'departmentCode';
    displayProperty: string = 'description';

    allDepartmentsOption: Department = {
        departmentId: 0,
        departmentCode: 'All',
        description: 'All',
        profitCenterId: 0,
        companyId: 0,
        companyCode: null,
    };

    departement = new FormControl();
    selectedDepartement: string;
    companyId: string;
    masterData: MasterData = new MasterData();
    allDepartment: Department[];

    selectedValues: Department[];

    private params: any;

    agInit(params: any): void {
        this.params = params;
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    refresh(params: any): boolean {
        return false;
    }

    selectionChanged(event: any): void {
        if (!event.option) { return; }
        const object = event.option.value;

        if (object === this.allDepartmentsOption) {
            this.allSelected = !this.allSelected;
            this.resetSelected();
        } else {
            if (!this.isSelected(object)) {
                this.selectedValues.push(object);
            } else {
                this.deselect(object);
            }
            this.allSelected = this.selectedValues.length === this.allDepartment.length;
        }
        this.params.data.departments = this.selectedValues.map((o) => o);

        this.params.data.allDepartments = this.allSelected;

        this.selectedDepartement = this.selectedValues.length === this.allDepartment.length ? 'All' : (this.selectedValues.map((s) => s[this.displayProperty].trim()).sort().join(', '));
    }

    deselect(value) {
        const index = this.selectedValues.indexOf(this.selectedValues.find((x) => x.departmentId === value.departmentId));
        this.selectedValues.splice(index, 1);
    }

    resetSelected() {
        this.selectedValues = this.allSelected ? this.allDepartment.map((o) => o) : [];
    }

    ngOnInit() {
        this.selectedValues = this.params.value.map((o) => o);
        this.companyId = this.params.data.companyId;
        this.allSelected = this.params.data.allDepartments;
        this.masterDataService.getMasterData([MasterDataProps.Departments], this.companyId).subscribe((masterData: MasterData) => {
            this.allDepartment = masterData.departments;
            this.initView();
        });
    }

    initView() {
        if (this.allSelected) { this.selectedDepartement = 'All'; this.selectedValues = this.allDepartment.map((o) => o); } else {
            this.selectedValues.forEach((element) => {
                if (element.description == null) {
                    element.description = this.allDepartment.find((x) => x.departmentId === element.departmentId).description.trim();
                }
            });
            this.selectedDepartement = (this.selectedValues.map((s) => s[this.displayProperty].trim()).sort().join(', '));
        }
    }

    isSelected(object: any) {
        this.isSelectedValue = false;
        if (this.allSelected) {
            return true;
        }
        this.selectedValues.forEach((element) => {
            if (element.departmentId === object.departmentId) {
                if (this.isSelectedValue === false) {
                    this.isSelectedValue = true;
                }

            }
        });
        return this.isSelectedValue;
    }

}
