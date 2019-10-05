import { Component, OnInit, Inject } from '@angular/core';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { Counterparty } from '../../../../../../../shared/entities/counterparty.entity';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { MasterDataProps } from '../../../../../../../shared/entities/masterdata-props.entity';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Company } from '../../../../../../../shared/entities/company.entity';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CounterpartyCompany } from '../../../../../../../shared/entities/counterparty-company.entity';
@Component({
    selector: 'atlas-associated-counterparties-company',
    templateUrl: './associated-counterparties-company.component.html',
    styleUrls: ['./associated-counterparties-company.component.scss']
})
export class AssociatedCounterpartiesCompanyComponent extends BaseFormComponent implements OnInit {

    counterpartyCompaniesCtrl = new AtlasFormControl('CounterpartyCompany');
    counterpartyAssociateCompanyCtrl = new AtlasFormControl('CounterpartyAssociateCompany')
    counterpartCompanyList: Company[] = [];
    filteredCompany: Company[] = [];
    associateCompany: Company[] = [];
    checkedAssociateCompany: Company[];
    counterpartyCompany: string[] = ['companyId'];
    counterpartyAssociate: string[] = ['companyId'];
    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Companies
    ];
    form: FormGroup;
    matrixData: Company[] = [];
    constructor(public thisDialogRef: MatDialogRef<AssociatedCounterpartiesCompanyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            matrixData: CounterpartyCompany[],
        },
        protected formConfigurationProvider: FormConfigurationProviderService, protected masterdataService: MasterdataService,
        private formBuilder: FormBuilder) {

        super(formConfigurationProvider);

    }
    ngOnInit() {

        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.filteredCompany = this.masterdata.companies;
                this.counterpartCompanyList = this.filteredCompany;
                this.data.matrixData.forEach((row) => {
                    const availableCompany = this.counterpartCompanyList.find(company => company.companyId === row.companyName)
                    this.matrixData.push(availableCompany);
                })
            });

    }
    optionSelected(data: any) {
        this.associateCompany = [];
        data.forEach(element => {
            this.associateCompany.push(element);
        });
    }
    onSaveButtonClicked() {

        this.thisDialogRef.close(this.associateCompany);
    }
    onCancelButtonClicked() {
        this.associateCompany = [];
        this.thisDialogRef.close('true');
    }

    getAssociatedCompanies() {
        return this.associateCompany;
    }
}
