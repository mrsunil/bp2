import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { InformationCardComponent } from './information-card/information-card.component';
import { MainAddressCardComponent } from './main-address-card/main-address-card.component';
import { CustomerDefaultCardComponent } from './customer-default-card/customer-default-card.component';
import { ThirdSystemCodesCardComponent } from './third-system-codes-card/third-system-codes-card.component';
import { AlternateMailingCardComponent } from './alternate-mailing-card/alternate-mailing-card.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FormBuilder } from '@angular/forms';
import { MdmCategoryAccountTypeMapping } from '../../../../../shared/mdmCategory-account-mapping-entity';
import { CounterpartyMdmCategory } from '../../../../../shared/entities/counterparty-mdm-category.entity';
import { ActivatedRoute } from '@angular/router';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { MdmCategory } from '../../../../../shared/entities/mdm-Category.entity';
import { AccountType } from '../../../../../shared/entities/account-type.entity';
import { CounterpartyAccountType } from '../../../../../shared/entities/counterparty-account-type.entity';

@Component({
    selector: 'atlas-counterparty-capture-form-main-tab',
    templateUrl: './counterparty-capture-form-main-tab.component.html',
    styleUrls: ['./counterparty-capture-form-main-tab.component.scss']
})
export class CounterpartyCaptureFormMainTabComponent extends BaseFormComponent implements OnInit {
    @ViewChild('informationCardComponent') informationCardComponent: InformationCardComponent;
    @ViewChild('mainAddressCardComponent') mainAddressCardComponent: MainAddressCardComponent;
    @ViewChild('thirdSystemCodesCardComponent') thirdSystemCodesCardComponent: ThirdSystemCodesCardComponent;
    @ViewChild('alternateMailingCardComponent') alternateMailingCardComponent: AlternateMailingCardComponent;
    @ViewChild('customerDefaultCardComponent') customerDefaultCardComponent: CustomerDefaultCardComponent;

    @Input() isViewMode: boolean = false;
    @Input() isEditMode: boolean = false;
    @Input() mappedData: MdmCategoryAccountTypeMapping[] = [];
    masterdata: MasterData;
    filteredAccountTypes: AccountType[];
    filteredMdmCategories: MdmCategory[];
    constructor(private route: ActivatedRoute, protected formBuilder: FormBuilder, protected formConfigurationProvider: FormConfigurationProviderService, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
    }


    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            informationCardComponent: this.informationCardComponent.getFormGroup(),
            mainAddressCardComponent: this.mainAddressCardComponent.getFormGroup(),
            thirdSystemCodesCardComponent: this.thirdSystemCodesCardComponent.getFormGroup(),
            alternateMailingCardComponent: this.alternateMailingCardComponent.getFormGroup(),
            customerDefaultCardComponent: this.customerDefaultCardComponent.getFormGroup(),
        });
        return super.getFormGroup();
    }

    onSelectedAccountTypesOptions(event) {
        let selectedCodes: CounterpartyMdmCategory[] = [];
        let selected: any[] = event;
        this.mappedData.forEach((accountType) => {
            selected.forEach((accType) => {
                if (accType.accountTypeId == accountType.accountTypeID) {
                    const code = selectedCodes.find((c => c.mdmCategoryID == accountType.mdmCategoryID));
                    if (!code) {
                        let mdmCategory: CounterpartyMdmCategory = <CounterpartyMdmCategory>{};
                        mdmCategory.mdmCategoryID = accountType.mdmCategoryID;
                        selectedCodes.push(mdmCategory);
                    }
                }
            });
        });

        this.filteredMdmCategories = [];
        selectedCodes.forEach((obj) => {
            const mdmCode = this.masterdata.mdmCategories.find((c) => c.mdmCategoryId === obj.mdmCategoryID);
            if (mdmCode) {
                this.filteredMdmCategories.push(mdmCode);
            }
        });

        this.thirdSystemCodesCardComponent.mdmCategoryCodeCtrl.patchValue(this.filteredMdmCategories);
    }

    onSelectedMdmCodesOptions(event) {
        let selectedAccountTypes: CounterpartyAccountType[] = [];
        let selected: any[] = event;
        this.mappedData.forEach((mdmCodes) => {
            selected.forEach((mdmCode) => {
                if (mdmCode.mdmCategoryId == mdmCodes.mdmCategoryID) {
                    const code = selectedAccountTypes.find((c => c.accountTypeId == mdmCodes.accountTypeID));
                    if (!code) {
                        let accountTypeObj: CounterpartyAccountType = <CounterpartyAccountType>{};
                        accountTypeObj.accountTypeId = mdmCodes.accountTypeID;
                        selectedAccountTypes.push(accountTypeObj);
                    }
                }
            });
        });

        this.filteredAccountTypes = [];
        selectedAccountTypes.forEach((obj) => {
            const accType = this.masterdata.accountTypes.find((c) => c.accountTypeId === obj.accountTypeId);
            if (accType) {
                this.filteredAccountTypes.push(accType);
            }
        });
        this.informationCardComponent.accountTypeCtrl.patchValue(this.filteredAccountTypes);
    }
}