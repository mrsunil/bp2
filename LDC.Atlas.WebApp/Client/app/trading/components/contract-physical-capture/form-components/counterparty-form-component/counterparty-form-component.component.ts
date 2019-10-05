import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { CounterPartyDataLoader } from '../../../../../shared/services/masterdata/counterparty-data-loader';
import { SecurityService } from '../../../../../shared/services/security.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { Company } from './../../../../../shared/entities/company.entity';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';

@Component({
    selector: 'atlas-counterparty-form-component',
    templateUrl: './counterparty-form-component.component.html',
    styleUrls: ['./counterparty-form-component.component.scss'],
    providers: [CounterPartyDataLoader],
})
export class CounterpartyFormComponent extends BaseFormComponent
    implements OnInit {
    isInputField = false;
    isTradeImage = false;
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();

    buyerCodeCtrl = new AtlasFormControl('BuyerId');
    buyerNameCtrl = new AtlasFormControl('BuyerDescription');
    sellerCodeCtrl = new AtlasFormControl('SellerId');
    sellerNameCrtl = new AtlasFormControl('SellerDescription');
    counterpartyReferenceCtrl = new AtlasFormControl('CounterpartyRef');

    filteredBuyers: Counterparty[];
    filteredSellers: Counterparty[];

    masterdata: MasterData;
    masterdataList: string[] = [MasterDataProps.Counterparties];
    buyerCode: Counterparty[];
    sellerCode: Counterparty[];
    selectedContractType: ContractTypes;
    selectedCounterparty: Counterparty;
    tradeImageDetails: TradeImageField[] = [];
    company: string;
    buyerCodePrivilege: boolean = false;
    sellerCodePrivilege: boolean = false;
    counterPartyReference: boolean = false;

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');

    constructor(
        protected route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public counterpartyDataLoader: CounterPartyDataLoader,
        public companyManagerService: CompanyManagerService,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.filteredBuyers = this.masterdata.counterparties;
                this.buyerCodeCtrl.valueChanges.subscribe((input) => {
                    this.filterBuyers(input);
                });

                this.filteredSellers = this.masterdata.counterparties;
                this.sellerCodeCtrl.valueChanges.subscribe((input) => {
                    this.filterSellers(input);
                });
                this.setValidators();
                this.bindConfiguration();
            });
        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
        }
        // disabling this control as these are description and not to be edited
        this.buyerNameCtrl.disable();
        this.sellerNameCrtl.disable();
        this.checkCounterPartyPrivileges();
    }

    filterBuyers(input) {
        this.filteredBuyers = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        this.filteredBuyers = this.filteredBuyers.filter((counterparty: Counterparty) => {
            return this.sellerCodeCtrl.value !== counterparty;
        });
        if (this.buyerCodeCtrl.valid || !this.buyerCodeCtrl.value) {
            this.buyerCodeSelected(this.buyerCodeCtrl.value);
        }
    }

    filterSellers(input) {
        this.filteredSellers = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        this.filteredSellers = this.filteredSellers.filter((counterparty: Counterparty) => {
            return this.buyerCodeCtrl.value !== counterparty;
        });
        if (this.sellerCodeCtrl.valid || !this.sellerCodeCtrl.value) {
            this.sellerCodeSelected(this.sellerCodeCtrl.value);
        }
    }

    buyerCodeSelected(buyerCode: Counterparty) {
        if (!this.buyerCodeCtrl.valid || !buyerCode) {
            if (this.buyerNameCtrl.value) {
                this.buyerNameCtrl.patchValue('');
            }
            return;
        }
        const selectedBuyer = this.masterdata.counterparties.find(
            (buyer) => buyer.counterpartyCode === buyerCode.counterpartyCode,
        );

        if (selectedBuyer) {
            this.buyerNameCtrl.patchValue(selectedBuyer.description);

            if (this.selectedContractType === ContractTypes.Sale) {
                this.selectedCounterparty = selectedBuyer;
            }
        }
    }

    sellerCodeSelected(sellerCode: Counterparty) {
        if (!this.sellerCodeCtrl.valid || !sellerCode) {
            if (this.sellerNameCrtl.value) {
                this.sellerNameCrtl.patchValue('');
            }
            return;
        }
        const selectedSeller = this.masterdata.counterparties.find(
            (seller) => seller.counterpartyCode === sellerCode.counterpartyCode,
        );
        if (selectedSeller) {
            this.sellerNameCrtl.patchValue(selectedSeller.description);

            if (this.selectedContractType === ContractTypes.Purchase) {
                this.selectedCounterparty = selectedSeller;
            }
        }
    }

    setValidators() {
        this.buyerCodeCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.counterparties,
                nameof<Counterparty>('counterpartyCode'),
            ),
        );

        this.sellerCodeCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.counterparties,
                nameof<Counterparty>('counterpartyCode'),
            ),
        );

        this.counterpartyReferenceCtrl.setValidators(Validators.maxLength(40));

        this.formGroup.updateValueAndValidity();
    }

    contractTypeSelected(contractType: ContractTypes) {
        const company: Company = this.companyManagerService.getCurrentCompany();
        if (!company || !company.counterpartyId) {
            return;
        }
        const defaultCounterparty = this.masterdata.counterparties.find(
            (fb) => fb.counterpartyID === company.counterpartyId,
        );

        this.selectedContractType = contractType;
        if (contractType === ContractTypes.Purchase) {
            if (defaultCounterparty) {
                this.buyerCodeCtrl.setValue(
                    defaultCounterparty,
                );
                this.sellerCodeCtrl.setValue('');
                this.sellerNameCrtl.setValue('');
                this.buyerCodeCtrl.disable();
                this.sellerCodeCtrl.enable();
            }
        }
        if (contractType === ContractTypes.Sale) {
            if (defaultCounterparty) {
                this.sellerCodeCtrl.setValue(
                    defaultCounterparty,
                );
                this.buyerCodeCtrl.setValue('');
                this.buyerNameCtrl.setValue('');
                this.sellerCodeCtrl.disable();
                this.buyerCodeCtrl.enable();
            }
        }
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                buyerCodeCtrl: this.buyerCodeCtrl,
                buyerNameCtrl: this.buyerNameCtrl,
                sellerCodeCtrl: this.sellerCodeCtrl,
                sellerNameCrtl: this.sellerNameCrtl,
                counterpartyReferenceCtrl: this.counterpartyReferenceCtrl,
            },
        );

        return super.getFormGroup();
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        if (this.model.buyerCode) {
            const selectedBuyer = this.masterdata.counterparties.filter(
                (seller) => seller.counterpartyCode === this.model.buyerCode,
            );
            if (selectedBuyer.length > 0) {
                this.buyerCode = selectedBuyer;
                this.buyerCodeCtrl.patchValue(selectedBuyer[0]);
                this.buyerCodeSelected(selectedBuyer[0]);

            }
        }
        if (this.model.sellerCode) {
            const selectedSeller = this.masterdata.counterparties.filter(
                (seller) => seller.counterpartyCode === this.model.sellerCode,
            );
            if (selectedSeller.length > 0) {
                this.sellerCode = selectedSeller;
                this.sellerCodeCtrl.patchValue(selectedSeller[0]);
                this.sellerCodeSelected(selectedSeller[0]);

            }
        }
        if (this.model.counterpartyReference != null) {
            this.formGroup.patchValue({ counterpartyReferenceCtrl: this.model.counterpartyReference });
        }
        if (isEdit) {
            if (this.model.type === ContractTypes[0]) {
                this.buyerCodeCtrl.disable();
            } else if (this.model.type === ContractTypes[1]) {
                this.sellerCodeCtrl.disable();
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else if (this.isTradeImage) {
            const contractType = ContractTypes[Number(this.route.snapshot.queryParams.type)];
            if (contractType !== this.model.type) {
                if (this.sellerCode.length > 0) {
                    this.buyerCodeCtrl.patchValue(this.sellerCode[0]);
                }
                if (this.buyerCode.length > 0) {
                    this.sellerCodeCtrl.patchValue(this.buyerCode[0]);
                }
            }
            this.buyerCodeCtrl.enable();
            this.sellerCodeCtrl.enable();
            if (contractType === ContractTypes[0]) {
                this.buyerCodeCtrl.disable();
            } else if (contractType === ContractTypes[1]) {
                this.sellerCodeCtrl.disable();
            }
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {
                const checkBuyerIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'BuyerId');
                if (checkBuyerIsImage && !checkBuyerIsImage.isCopy) {
                    this.buyerCodeCtrl.patchValue(null);
                    this.buyerNameCtrl.patchValue(null);
                }
                const checkSellerIdIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'SellerId');
                if (checkSellerIdIsImage && !checkSellerIdIsImage.isCopy) {
                    this.sellerCodeCtrl.patchValue(null);
                    this.sellerNameCrtl.patchValue(null);
                }
                const checkCounterpartyRefIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'CounterpartyRef');
                if (checkCounterpartyRefIsImage && !checkCounterpartyRefIsImage.isEdit) {
                    this.counterpartyReferenceCtrl.disable();
                }
                if (checkCounterpartyRefIsImage && !checkCounterpartyRefIsImage.isCopy) {
                    this.counterpartyReferenceCtrl.patchValue(null);
                } else {
                    this.counterpartyReferenceCtrl.patchValue(this.model.counterpartyReference);
                }

            }

        } else {
            if (this.model.invoiceReference &&
                this.authorizationService.getPermissionLevel(this.company, 'Trades', 'Physicals', 'SuperTradeEdition') <= PermissionLevels.None) {
                this.buyerCodeCtrl.disable();
                this.sellerCodeCtrl.disable();
            }
        }
        return entity;
    }
    
    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;

        section.sellerCode = (this.sellerCodeCtrl.value as Counterparty).counterpartyCode;
        section.buyerCode = (this.buyerCodeCtrl.value as Counterparty).counterpartyCode;
        section.counterpartyReference = this.counterpartyReferenceCtrl.value;

        return section;
    }

    checkCounterPartyPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') &&
                this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.buyerCodePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'BuyerCode');
                this.sellerCodePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'SellerCode');
                this.counterPartyReference = this.authorizationService.isPrivilegeAllowed(this.company, 'CounterPartyReference');
            }
        });
        if (!this.buyerCodePrivilege) {
            this.buyerCodeCtrl.disable();
            this.buyerNameCtrl.disable();
        }
        if (!this.sellerCodePrivilege) {
            this.sellerCodeCtrl.disable();
            this.sellerNameCrtl.disable();
        }
        if (!this.counterPartyReference) {
            this.counterpartyReferenceCtrl.disable();
        }
    }
}
