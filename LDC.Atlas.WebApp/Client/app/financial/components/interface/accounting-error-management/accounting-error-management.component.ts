import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { InterfaceStatus } from '../../../../shared/enums/interface-status.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { AccountingInterfaceService } from '../../../../shared/services/http-services/accounting-interface.service';
import { TitleService } from '../../../../shared/services/title.service';
import { FunctionalErrorsComponent } from '../functional-errors/functional-errors.component';
import { TechnicalErrorsComponent } from '../technical-errors/technical-errors.component';

@Component({
    selector: 'atlas-accounting-error-management',
    templateUrl: './accounting-error-management.component.html',
    styleUrls: ['./accounting-error-management.component.scss'],
})
export class AccountingErrorManagementComponent extends BaseFormComponent implements OnInit {
    @ViewChild(FunctionalErrorsComponent) functionalErrorsComponent: FunctionalErrorsComponent;
    @ViewChild(TechnicalErrorsComponent) technicalErrorsComponent: TechnicalErrorsComponent;
    tabIndex: number = 0;
    company: string;
    accountingErrorFormGroup: FormGroup;
    private formComponents: BaseFormComponent[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private accountingInterfaceService: AccountingInterfaceService,
        protected formBuilder: FormBuilder,
        private titleService: TitleService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.tabIndex = 0;
        this.route.queryParams.subscribe((params) => {
            this.tabIndex = Number(params['index']);
        });

        this.formComponents.push(
            this.functionalErrorsComponent,
            this.technicalErrorsComponent,
        );
        this.getListOfErrors();
    }

    onSelectedIndexChanged(value: number) {
        this.tabIndex = value;
        if (this.tabIndex === 0) {
            this.functionalErrorsComponent.getListOfErrors();
        } else if (this.tabIndex === 1) {
            this.technicalErrorsComponent.getListOfErrors();
        }
    }

    getListOfErrors() {
        this.accountingInterfaceService.listErrorsForErrorManagement()
            .subscribe((data) => {
                if (data) {
                    const functionalErrors = data.value.filter((errorRows) =>
                        errorRows.interfaceStatusId === InterfaceStatus.NotPosted);
                    const technicalErrors = data.value.filter((errorRows) =>
                        errorRows.interfaceStatusId === InterfaceStatus.Rejected ||
                        errorRows.interfaceStatusId === InterfaceStatus.TransmitError);
                    this.functionalErrorsComponent.getFunctionalErrors(functionalErrors);
                    this.technicalErrorsComponent.getTechnicalErrors(technicalErrors);
                }
            });
    }
}
