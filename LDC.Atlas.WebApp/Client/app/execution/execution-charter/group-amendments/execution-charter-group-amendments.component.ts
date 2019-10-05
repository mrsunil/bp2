import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CharterBulkClosureComponent } from './charter-bulk-closure/charter-bulk-closure.component';
import { CharterGroupSelection } from '../../../shared/entities/charter-group-selection.entity';
import { CharterGroupFunctionTypes } from '../../../shared/enums/charter-group-function-type';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { TitleService } from '../../../shared/services/title.service';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';


@Component({
    selector: 'atlas-execution-charter-group-amendments',
    templateUrl: './execution-charter-group-amendments.component.html',
    styleUrls: ['./execution-charter-group-amendments.component.scss']
})
export class ExecutionCharterGroupAmendmentsComponent extends BaseFormComponent implements OnInit {
    @ViewChild('charterBulkClosure') charterBulkClosure: CharterBulkClosureComponent;

    charterGroupFunctionTypeMenu: CharterGroupSelection[] = [];
    charterGroupFunctionFieldList: CharterGroupSelection[] = [];
    private formComponents: BaseFormComponent[] = [];
    charterGroupFunctionFormGroup: FormGroup;
    charterBulkActionTypeId: number;
    isDisabled: boolean = true;
    isSave: boolean = false;


    constructor(protected formBuilder: FormBuilder,
        private titleService: TitleService, protected formConfigurationProvider: FormConfigurationProviderService,
        protected router: Router, protected companyManager: CompanyManagerService) {
        super(formConfigurationProvider);
        this.populateListofOptions();
    }

    ngOnInit() {
        this.charterBulkClosure.charterGroupFunctionTypeMenu = this.charterGroupFunctionTypeMenu;
        this.charterGroupFunctionFormGroup = this.formBuilder.group({
            charterBulkClosure: this.charterBulkClosure.getFormGroup(),
        })
        this.titleService.setTitle('Charter Bulk Actions');
        this.formComponents.push(
            this.charterBulkClosure)
    }
    populateListofOptions() {
        this.charterGroupFunctionFieldList.push({
            charterbulkFunctionTypeId: 1,
            name: 'Bulk Closure Charter',
            charterFunctionTypeCode: CharterGroupFunctionTypes.CharterBulkClosure,
        });
        this.charterGroupFunctionFieldList.filter((e) => {
            this.charterGroupFunctionTypeMenu.push(e);
        });

    }
    onCharterBulkClosureOptionChecked($event) {
        this.charterBulkActionTypeId = $event.bulkClosureOption;
        if ($event.checked) {
            this.isDisabled = false;
        }
        else {
            this.isDisabled = true;

        }

    }
    onDiscardButtonClicked() {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/charter']);
    }

    onNextButtonClicked(charterBulkActionTypeId) {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/execution/charter/bulkActions/' + encodeURIComponent(charterBulkActionTypeId)]);

    }

}
