import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../shared/entities/company.entity';
import { InterfaceObjectTypes } from '../../../../../shared/entities/interface-object-type.entity';
import { InterfaceTypes } from '../../../../../shared/entities/interface-type.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { InterfaceObjectType } from '../../../../../shared/enums/interface-object-type.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { InterfaceService } from '../../../../../shared/services/http-services/interface.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-interface-builder-details',
    templateUrl: './interface-builder-details.component.html',
    styleUrls: ['./interface-builder-details.component.scss'],
})

export class InterfaceBuilderDetailsComponent extends BaseFormComponent implements OnInit {
    interfaceCtrl = new AtlasFormControl('reportStyleTypes');
    objectTypeCtrl = new AtlasFormControl('objectTypeCtrl');
    docIdCtrl = new AtlasFormControl('docIdCtrl');
    companyCtrl = new AtlasFormControl('companyCtrl');
    messageCtrl = new AtlasFormControl('messageCtrl');

    filteredInterfaceTypes: InterfaceTypes[];
    filteredInterfaceObjectTypes: InterfaceObjectTypes[];
    filteredCompanies: Company[];
    masterdata: MasterData;
    objectTypes: InterfaceObjectTypes[];
    interfaceBuilderFormGroup: FormGroup;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected companyManager: CompanyManagerService,
        private interfaceService: InterfaceService,
        private snackbarService: SnackbarService,
        protected route: ActivatedRoute) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

        this.interfaceBuilderFormGroup = this.formBuilder.group({
            interfaceCtrl: this.interfaceCtrl,
            objectTypeCtrl: this.objectTypeCtrl,
            docIdCtrl: this.docIdCtrl,
            companyCtrl: this.companyCtrl,
        });
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredInterfaceTypes = this.masterdata.interfaceType;
        this.filteredCompanies = this.masterdata.companies;

        this.interfaceCtrl.valueChanges.subscribe((input) => {
            this.filteredInterfaceTypes = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.interfaceType,
                ['interfaceType'],
            );
        });

        this.companyCtrl.valueChanges.subscribe((input) => {
            this.filteredCompanies = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.companies,
                ['companyId'],
            );
        });
        this.setValidators();
    }

    bindObjectTypes(interfaceTypeId: number) {
        this.objectTypes = [];
        this.objectTypeCtrl.setValue(null);
        this.objectTypeCtrl.clearValidators();
        this.objectTypeCtrl.updateValueAndValidity();

        this.filteredInterfaceObjectTypes = this.masterdata.interfaceObjectType;

        this.interfaceCtrl.valueChanges.subscribe((input) => {
            this.filteredInterfaceObjectTypes = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.interfaceObjectType,
                ['objectType'],
            );
        });

        if (interfaceTypeId) {
            this.objectTypes =
                this.filteredInterfaceObjectTypes.filter((objectType) => objectType.interfaceTypeId === interfaceTypeId);
        }

        if (this.objectTypes && this.objectTypes.length >> 0) {
            this.objectTypeCtrl.setValidators(Validators.required);
            this.objectTypeCtrl.setValidators(
                inDropdownListValidator(
                    this.objectTypes,
                    nameof<InterfaceObjectTypes>('interfaceObjectTypeId'),
                ),
            );
        }
    }

    setValidators() {
        this.interfaceCtrl.setValidators(Validators.required);
        this.interfaceCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.interfaceType,
                nameof<InterfaceTypes>('interfaceTypeId'),
            ),
        );
        this.objectTypeCtrl.setValidators(Validators.required);
        this.docIdCtrl.setValidators(Validators.required);
        this.companyCtrl.setValidators(Validators.required);
        this.companyCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.companies,
                nameof<Company>('id'),
            ),
        );
    }

    onInterfaceTypeSelected(event: any) {
        this.bindObjectTypes(event);
    }

    onGenerateButtonClicked() {
        if (this.interfaceBuilderFormGroup.valid) {
            let isValidDocId: boolean = true;
            if (this.objectTypeCtrl.value === InterfaceObjectType.Accruals) {
                const docRef: string = this.docIdCtrl.value;
                if (!docRef.includes('_')) {
                    isValidDocId = false;
                    this.snackbarService.informationSnackBar('Please Provide Valid Accrual Document ID');
                }
            }
            if (isValidDocId) {
                const companySelected: string = this.masterdata.companies.find((id) => id.id === this.companyCtrl.value).companyId;
                this.interfaceService.checkDocumentIdExists(companySelected, this.docIdCtrl.value, this.objectTypeCtrl.value).subscribe((exists: boolean) => {
                    if (exists) {
                        this.interfaceService.getMessage(this.interfaceCtrl.value, this.objectTypeCtrl.value, this.docIdCtrl.value, companySelected).
                            subscribe((message: string) => {
                                if (message !== null) {
                                    this.messageCtrl.setValue(message);
                                } else {
                                    this.messageCtrl.setValue('CSV/Xml format is Invalid');
                                }
                            });
                    } else {
                        this.snackbarService.informationSnackBar('Document not existing');
                    }
                });
            }
        } else {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors..');
        }
    }

    displayInterfaceType(interfaceTypeId: number): string {
        if (interfaceTypeId) {
            const selectedPeriod = this.filteredInterfaceTypes.find(
                (interfaceType) => interfaceType.interfaceTypeId === interfaceTypeId,
            );

            if (selectedPeriod) {
                return selectedPeriod.interfaceType;
            }
        }
        return '';
    }

    displayObjectType(objectTypeId: number): string {
        if (objectTypeId) {
            const selectedPeriod = this.objectTypes.find(
                (objectType) => objectType.interfaceObjectTypeId === objectTypeId,
            );

            if (selectedPeriod) {
                return selectedPeriod.objectType;
            }
        }
        return '';
    }

    displayCompany(id: number): string {
        if (id) {
            const selectedPeriod = this.filteredCompanies.find(
                (companies) => companies.id === id,
            );

            if (selectedPeriod) {
                return selectedPeriod.companyId;
            }
        }
        return '';
    }

    clearFieldValues() {
        this.messageCtrl.reset();
    }
}
