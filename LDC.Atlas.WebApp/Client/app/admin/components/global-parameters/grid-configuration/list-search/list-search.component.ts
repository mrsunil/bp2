import { Component, OnInit, ViewChild } from '@angular/core';
import { GridConfigurationProperties } from '../../../../../shared/entities/grid-configuration.entity';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ListViewDetailsComponent } from './details/list-view-details.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationType } from '../../../../../shared/enums/configuration-type.enum';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-list-search',
    templateUrl: './list-search.component.html',
    styleUrls: ['./list-search.component.scss']
})
export class ListAndSearchComponent extends BaseFormComponent implements OnInit {
    @ViewChild('listViewDetailsComponent') listViewDetailsComponent: ListViewDetailsComponent;
    isSave: boolean;
    isEditMode: boolean = false;
    configurationTypeId: number;
    gridId: number;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected router: Router,
        protected companyManager: CompanyManagerService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {

        this.configurationTypeId = ConfigurationType.List;

        if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[3].path.toString() === 'edit') {
            this.isEditMode = true;
        };
    }

    onViewSectedForGridConfiguration(gridView: GridConfigurationProperties) {

    }

    onDiscardButtonClicked() {
        this.isSave = true;
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.gridId = Number(this.route.snapshot.paramMap.get('gridId'));
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                    + '/admin/global-parameters/grid-configuration/list/display', this.gridId]);
            }
        });
    }

    onSaveButtonClick() {
        this.listViewDetailsComponent.onSaveButtonClicked();
    }
}
