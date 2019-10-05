import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PopUpDialogComponentComponent } from '../dialog/pop-up-dialog-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { Router } from '@angular/router';

@Component({
    selector: 'atlas-ag-grid-pop-up',
    templateUrl: './ag-grid-pop-up.component.html',
    styleUrls: ['./ag-grid-pop-up.component.scss']
})

export class AgGridPopUpComponent extends BaseFormComponent implements ICellRendererAngularComp {
    data: any;
    params: any;

    popUpStatusDisplayCtrl = new AtlasFormControl('PopUpStatusDisplay');
    ngOnInit() {


    }
    agInit(params: any): void {
        this.params = params;
        this.data = params.value;
        this.popUpStatusDisplayCtrl.patchValue(this.data);
    }

    refresh(params: any): boolean {
        return false;
    }

    ispopUpcellRendererLoaded() {
        if (this.params.value) {
            if (this.params.data.contractLabel[0] == 'Contracts available for closure') {
                return false;
            }
            else {
                return true;
            }
        }
        else { return false; }
    }


    onExploreClicked() {
        let link;
        if (this.params.data) {
            if (this.params.data.status === 'Cost accrual') {
                link = `${this.params.context.componentParent.companyManager.getCurrentCompanyId()}/trades/display/${this.params.data.sectionId}/1`;
                window.open(link, '_blank');
            }
            else if (this.params.data.status === 'Invoices not cash matched') {
                link = `${this.params.context.componentParent.companyManager.getCurrentCompanyId()}/trades/display/${this.params.data.sectionId}/5`;
                window.open(link, '_blank');
            }
            else if (this.params.data.status === 'Cargo accrual') {
                link = `${this.params.context.componentParent.companyManager.getCurrentCompanyId()}/trades/display/${this.params.data.sectionId}/5`;
                window.open(link, '_blank');
            }
            else if (this.params.data.status === 'Invoices not posted') {
                link = `${this.params.context.componentParent.companyManager.getCurrentCompanyId()}/trades/display/${this.params.data.sectionId}/5`;
                window.open(link, '_blank');
            }
        }
    }

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
        protected router: Router,
        protected dialog: MatDialog) {
        super(formConfigurationProvider);
        this.formGroup = this.formBuilder.group({
            popUpStatusDisplayCtrl: this.popUpStatusDisplayCtrl
        });
    }

}
