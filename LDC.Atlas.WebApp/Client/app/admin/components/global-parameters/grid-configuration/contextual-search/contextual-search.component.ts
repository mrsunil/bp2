import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationType } from '../../../../../shared/enums/configuration-type.enum';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { ContextualViewDetailsComponent } from './details/contextual-view-details.component';

@Component({
    selector: 'atlas-contextual-search',
    templateUrl: './contextual-search.component.html',
    styleUrls: ['./contextual-search.component.scss']
})
export class ContextualSearchComponent extends BaseFormComponent implements OnInit {

    @ViewChild('contextualViewDetailsComponent') contextualViewDetailsComponent: ContextualViewDetailsComponent;
    isSave: boolean;
    isEditMode: boolean = false;
    formComponents: BaseFormComponent[] = [];
    configurationTypeId: number;
    gridId: number;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected router: Router,
        protected companyManager: CompanyManagerService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.configurationTypeId = ConfigurationType.Contextual;

        if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[3].path.toString() === 'edit') {
            this.isEditMode = true;
        }
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
                    + '/admin/global-parameters/grid-configuration/contextual/display', this.gridId]);
            }
        });
    }

    onSaveButtonClick() {
        this.contextualViewDetailsComponent.onSaveButtonClicked();
    }
}
