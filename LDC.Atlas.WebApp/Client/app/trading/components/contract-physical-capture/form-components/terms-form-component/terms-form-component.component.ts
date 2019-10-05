import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { Arbitration } from '../../../../../shared/entities/arbitration.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Commodity } from '../../../../../shared/entities/commodity.entity';
import { ContractTerm } from '../../../../../shared/entities/contract-term.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Port } from '../../../../../shared/entities/port.entity';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';

@Component({
    selector: 'atlas-terms-form-component',
    templateUrl: './terms-form-component.component.html',
    styleUrls: ['./terms-form-component.component.scss'],
})
export class TermsFormComponent extends BaseFormComponent implements OnInit {
    isInputField = false;
    isTradeImage = false;
    isEdit: boolean = true;
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();

    contractTermsCtrl = new AtlasFormControl('ContractTermId');
    contractTermsDescriptionCtrl = new AtlasFormControl('ContractTermsDescription');
    portTermsCtrl = new AtlasFormControl('ContractTermLocationId');
    portTermsDescriptionCtrl = new AtlasFormControl('ContractTermsPortDescription');
    arbitrationCtrl = new AtlasFormControl('ArbitrationId');
    arbitrationDescriptionCtrl = new AtlasFormControl('ArbitrationDescription');

    filteredContractTerms: ContractTerm[];
    filteredPortTerms: Port[];
    filteredArbitration: Arbitration[];
    tradeImageDetails: TradeImageField[] = [];

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.ContractTerms,
        MasterDataProps.Ports,
        MasterDataProps.Arbitrations,
    ];
    company: string;
    contractTermsPrivilege: boolean = false;
    portTermsPrivilege: boolean = false;
    arbitrationPriviege: boolean = false;

    constructor(
        protected route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected tradingService: TradingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
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

                this.filteredContractTerms = this.masterdata.contractTerms;
                this.contractTermsCtrl.valueChanges.subscribe((input) => {
                    this.filteredContractTerms = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.contractTerms,
                        ['contractTermCode', 'description'],
                    );
                });

                this.filteredPortTerms = this.masterdata.ports;
                this.portTermsCtrl.valueChanges.subscribe((input) => {
                    this.filteredPortTerms = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.ports,
                        ['portCode', 'description'],
                    );
                });

                this.filteredArbitration = this.masterdata.arbitrations;
                this.arbitrationCtrl.valueChanges.subscribe((input) => {
                    this.filteredArbitration = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.arbitrations,
                        ['arbitrationCode', 'description'],
                    );
                });

                this.setValidators();
                this.bindConfiguration();
            });
        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
        }
        this.checkTermsFormPrivileges();
    }

    setValidators() {
        this.contractTermsCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.contractTerms,
                    nameof<ContractTerm>('contractTermCode'),
                ),
            ]),
        );

        this.portTermsCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.ports,
                    nameof<Port>('portCode'),
                ),
            ]),
        );

        this.arbitrationCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.arbitrations,
                    nameof<Arbitration>('arbitrationCode'),
                ),
            ]),
        );

        this.formGroup.updateValueAndValidity();
    }

    contractTermsCodeSelected(contractTermsCode: string) {
        const selectedContractTerm = this.masterdata.contractTerms.find(
            (conTerm) => conTerm.contractTermCode === contractTermsCode,
        );
        if (selectedContractTerm) {
            this.contractTermsDescriptionCtrl.patchValue(
                selectedContractTerm.description,
            );
        }
    }

    portCodeSelected(portCode: string) {
        const selectedPort = this.masterdata.ports.find(
            (pCode) => pCode.portCode === portCode,
        );
        if (selectedPort) {
            this.portTermsDescriptionCtrl.patchValue(selectedPort.description);
        }
    }

    arbitrationCodeSelected(arbitrationCode: string) {
        const filteredArbitration = this.masterdata.arbitrations.filter((arbCode) => arbCode.arbitrationCode === arbitrationCode);
        if (filteredArbitration.length === 0) { return; }
        const selectedArbitration = filteredArbitration[0];
        this.arbitrationDescriptionCtrl.patchValue(selectedArbitration.description);
        this.arbitrationDescriptionCtrl.updateValueAndValidity();
    }

    commodityCodeSelected(commodity: Commodity) {
        if (!this.arbitrationCtrl.value && commodity.arbitrationCode) {
            const filteredArbitration = this.masterdata.arbitrations.filter((arbCode) =>
                arbCode.arbitrationCode === commodity.arbitrationCode);
            if (filteredArbitration.length === 0) { return; }
            this.arbitrationCtrl.patchValue(filteredArbitration[0].arbitrationCode);
            this.arbitrationCodeSelected(commodity.arbitrationCode);
            this.arbitrationCtrl.updateValueAndValidity();
        }
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        this.isEdit = isEdit;
        if (this.model.contractTerms != null) {
            this.formGroup.patchValue({ contractTermsCtrl: this.model.contractTerms });
            this.contractTermsCodeSelected(this.model.contractTerms);
        }
        if (this.model.contractTermsLocation != null) {
            this.formGroup.patchValue({ portTermsCtrl: this.model.contractTermsLocation });
            this.portCodeSelected(this.model.contractTermsLocation);
        }
        if (this.model.arbitration != null) {
            this.formGroup.patchValue({ arbitrationCtrl: this.model.arbitration });
            this.arbitrationCodeSelected(this.model.arbitration);
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            if (!this.isTradeImage) {
                this.arbitrationDescriptionCtrl.disable();
                this.contractTermsDescriptionCtrl.disable();
                this.portTermsDescriptionCtrl.disable();
            }
        }
        if (this.isTradeImage) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {
                const checkContractTermIdIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'ContractTermId');
                if (checkContractTermIdIsImage && !checkContractTermIdIsImage.isEdit) {
                    this.contractTermsCtrl.disable();
                } else {
                    this.contractTermsCtrl.enable();
                }

                const checkContractLocationIdIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'ContractTermLocationId');
                if (checkContractLocationIdIsImage && !checkContractLocationIdIsImage.isEdit) {
                    this.portTermsCtrl.disable();
                } else {
                    this.portTermsCtrl.enable();
                }

                const checkArbitrationIdIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'ArbitrationId');
                if (checkArbitrationIdIsImage && !checkArbitrationIdIsImage.isEdit) {
                    this.arbitrationCtrl.disable();
                }

                this.handleCopyForImage('ContractTermId', [this.contractTermsCtrl, this.contractTermsDescriptionCtrl]);
                this.handleCopyForImage('ContractTermLocationId', [this.portTermsCtrl, this.portTermsDescriptionCtrl]);
                this.handleCopyForImage('ArbitrationId', [this.arbitrationCtrl, this.arbitrationDescriptionCtrl]);
            }
        } else {
            if (this.model.invoiceReference &&
                this.authorizationService.getPermissionLevel(
                    this.company,
                    'Trades', 'Physicals', 'SuperTradeEdition',
                ) <= PermissionLevels.None) {
                this.contractTermsCtrl.disable();
                this.portTermsCtrl.disable();
            }
        }
        return entity;
    }
    
    handleCopyForImage(fieldName: string, fields: AtlasFormControl[]) {
        const fieldConfig = this.tradeImageDetails.find((e) => e.tradeFieldName === fieldName);
        if (fieldConfig && !fieldConfig.isCopy) {
            fields.forEach((field) => {
                field.patchValue(null);
            });
        }
    }

    populateEntity(entity: any) {
        const section = entity as PhysicalFixedPricedContract;

        section.contractTerms = this.contractTermsCtrl.value;
        section.contractTermsLocation = this.portTermsCtrl.value;
        section.arbitration = this.arbitrationCtrl.value && this.arbitrationCtrl.value.length > 0 ? this.arbitrationCtrl.value : null;

        return section;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            contractTermsCtrl: this.contractTermsCtrl,
            contractTermsDescrptionCtrl: this.contractTermsDescriptionCtrl,
            portTermsCtrl: this.portTermsCtrl,
            portTermsDescriptionCtrl: this.portTermsDescriptionCtrl,
            arbitrationCtrl: this.arbitrationCtrl,
            arbitrationDescriptionCtrl: this.arbitrationDescriptionCtrl,
        });

        return super.getFormGroup();
    }
    checkTermsFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.contractTermsPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ContractTerms');
                this.portTermsPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PortTerms');
                this.arbitrationPriviege = this.authorizationService.isPrivilegeAllowed(this.company, 'Arbitration');
            }
        });
        if (!this.contractTermsPrivilege) {
            this.contractTermsCtrl.disable();
            this.contractTermsDescriptionCtrl.disable();
        }
        if (!this.portTermsPrivilege) {
            this.portTermsCtrl.disable();
            this.portTermsDescriptionCtrl.disable();
        }
        if (!this.arbitrationPriviege) {
            this.arbitrationCtrl.disable();
            this.arbitrationDescriptionCtrl.disable();
        }
    }

    clearDescription() {
        if (!this.arbitrationCtrl.value) {
            this.arbitrationDescriptionCtrl.patchValue('');
        }
        if (!this.portTermsCtrl.value) {
            this.portTermsDescriptionCtrl.patchValue('');
        }
        if (!this.contractTermsCtrl.value) {
            this.contractTermsDescriptionCtrl.patchValue('');
        }
    }
}
