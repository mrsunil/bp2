import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { Port } from '../../../../../shared/entities/port.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { nameof, UtilService } from "../../../../../shared/services/util.service";
import { isBeforeDate } from '../../../../../shared/validators/date-validators.validator';

@Component({
    selector: 'atlas-shipment-form-component',
    templateUrl: './shipment-form-component.component.html',
    styleUrls: ['./shipment-form-component.component.scss'],
})
export class ShipmentFormComponent extends BaseFormComponent implements OnInit {
    @Input() isCreateOrEdit: boolean = true;

    isInputField = false;
    charterLoadLocationCntrl = new AtlasFormControl('charterLoadLocationCntrl');
    charterLoadDescrCntrl = new AtlasFormControl('charterLoadDescrCntrl');
    charterLoadCntryCntrl = new AtlasFormControl('charterLoadCntryCntrl');
    charterDiscLocationCntrl = new AtlasFormControl('charterDiscLocationCntrl');
    charterDiscDescrCntrl = new AtlasFormControl('charterDiscDescrCntrl');
    charterDiscCntryCntrl = new AtlasFormControl('charterDiscCntryCntrl');
    charterBLDateCntrl = new FormControl();
    charterBLRefnCntrl = new AtlasFormControl('charterBLRefnCntrl');

    masterdata: any;
    filteredDiscLocations: Port[];
    filteredLoadLocations: Port[];

    dischargeControl: Port;
    loadingControl: Port;

    maxDate = this.companyManager.getCurrentCompanyDate().toDate();
    formGroup: FormGroup;
    isFormControlRequired: Map<string, boolean> = new Map<string, boolean>();

    constructor(public formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredLoadLocations = this.masterdata.ports;
        this.charterLoadLocationCntrl.valueChanges.subscribe((input) => {
            this.filteredLoadLocations =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.ports,
                    ['portCode', 'description', 'countryCode']);
        });

        this.filteredDiscLocations = this.masterdata.ports;
        this.charterDiscLocationCntrl.valueChanges.subscribe((input) => {
            this.filteredDiscLocations =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.ports,
                    ['portCode', 'description', 'countryCode']);
        });

        if (this.isCreateOrEdit) {
            this.enableControl();
            this.setValidators();
        } else {
            this.disableControl();
        }

    }

    clearValueOfControl() {

        this.charterLoadLocationCntrl.patchValue('');
        this.charterLoadDescrCntrl.patchValue('');
        this.charterLoadCntryCntrl.patchValue('');
        this.charterDiscLocationCntrl.patchValue('');
        this.charterDiscDescrCntrl.patchValue('');
        this.charterDiscCntryCntrl.patchValue('');
        this.charterBLDateCntrl.patchValue('');
        this.charterBLRefnCntrl.patchValue('');
    }

    enableControl() {
        this.charterLoadLocationCntrl.enable();
        this.charterLoadDescrCntrl.enable();
        this.charterLoadCntryCntrl.enable();
        this.charterDiscLocationCntrl.enable();
        this.charterDiscDescrCntrl.enable();
        this.charterDiscCntryCntrl.enable();
        this.charterBLDateCntrl.enable();
        this.charterBLRefnCntrl.enable();
    }

    disableControl() {
        this.charterLoadLocationCntrl.disable();
        this.charterLoadDescrCntrl.disable();
        this.charterLoadCntryCntrl.disable();
        this.charterDiscLocationCntrl.disable();
        this.charterDiscDescrCntrl.disable();
        this.charterDiscCntryCntrl.disable();
        this.charterBLDateCntrl.disable();
        this.charterBLRefnCntrl.disable();
    }

    initForm(entity: any, isEdit: boolean = false) {
        const model = entity as Charter;
        this.assignValues(entity, isEdit);
        this.charterLoadLocationCntrl.patchValue(this.loadingControl ? this.loadingControl : '');
        this.loadLocationSelected(model.loadingLocationCode);
        this.charterDiscLocationCntrl.patchValue(this.dischargeControl ? this.dischargeControl : '');
        this.dischargeLocationsSelected(model.dischargeLocationCode);
        this.charterBLDateCntrl.patchValue(model.blDate);
        this.charterBLRefnCntrl.patchValue(model.blRef);
    }

    assignValues(entity: Charter, isEdit: boolean = false) {
        const charter = entity as Charter;
        this.loadingControl = this.filteredLoadLocations
            .find((loadingLocationCode) => loadingLocationCode.portCode === charter.loadingLocationCode);
        this.dischargeControl = this.filteredDiscLocations
            .find(((dischargeLocationCode) => dischargeLocationCode.portCode === charter.dischargeLocationCode));
    }

    dischargeLocationsSelected(dischargeLocationCode: string) {
        if (dischargeLocationCode !== null) {
            const selectedLoc = this.masterdata.ports.find((port) => port.portCode.trim() === dischargeLocationCode.trim());
            if (selectedLoc) {
                this.charterDiscDescrCntrl.patchValue(selectedLoc.description);
                this.charterDiscCntryCntrl.patchValue(selectedLoc.countryCode);
            }
        }
    }

    loadLocationSelected(loadingLocationCode: string) {
        if (loadingLocationCode !== null) {
            const selectedLoc = this.masterdata.ports.find((port) => port.portCode.trim() === loadingLocationCode.trim());
            if (selectedLoc) {
                this.charterLoadCntryCntrl.patchValue(selectedLoc.countryCode);
                this.charterLoadDescrCntrl.patchValue(selectedLoc.description);
            }
        }
    }

    setValidators() {

        this.charterLoadLocationCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.ports,
                    nameof<Port>('portCode'),
                ),
            ]),
        );
        this.charterDiscLocationCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.ports,
                    nameof<Port>('portCode'),
                ),
            ]),
        );
        this.charterBLDateCntrl.setValidators(Validators.compose(
            [isBeforeDate(this.companyManager.getCurrentCompanyDate(), true)
                , Validators.maxLength(11)]));
        this.charterBLRefnCntrl.setValidators(Validators.maxLength(20));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({

            charterLoadLocationCntrl: this.charterLoadLocationCntrl,
            charterLoadDescrCntrl: this.charterLoadDescrCntrl,
            charterLoadCntryCntrl: this.charterLoadCntryCntrl,
            charterDiscLocationCntrl: this.charterDiscLocationCntrl,
            charterDiscDescrCntrl: this.charterDiscDescrCntrl,
            charterDiscCntryCntrl: this.charterDiscCntryCntrl,
            charterBLDateCntrl: this.charterBLDateCntrl,
            charterBLRefnCntrl: this.charterBLRefnCntrl,

        });

        return super.getFormGroup();

    }

    populateEntity(entity: any): any {
        const section = entity as Charter;

        if (this.charterLoadLocationCntrl.value && this.charterLoadLocationCntrl.value.portCode !== '') {
            section.loadingLocationCode = this.charterLoadLocationCntrl.value.portCode;
        }
        if (this.charterDiscLocationCntrl.value && this.charterDiscLocationCntrl.value.portCode !== '') {
            section.dischargeLocationCode = this.charterDiscLocationCntrl.value.portCode;
        }
        section.blDate = this.charterBLDateCntrl.value;
        section.blRef = this.charterBLRefnCntrl.value;

        return section;
    }

    onDischargePortSelected(value: Port) {
        const port = this.masterdata.ports.find(
            (item) => item.portCode === value.portCode,
        );
        if (port) {
            this.charterDiscDescrCntrl.patchValue(port.description);
            this.charterDiscCntryCntrl.patchValue(port.countryCode);
        }
    }

    onLoadingPortSelected(value: Port) {
        const port = this.masterdata.ports.find(
            (item) => item.portCode === value.portCode,
        );
        if (port) {
            this.charterLoadDescrCntrl.patchValue(port.description);
            this.charterLoadCntryCntrl.patchValue(port.countryCode);
        }
    }

    LoadingValueChanged(value) {
        this.charterLoadDescrCntrl.patchValue(value.description);
        this.charterLoadCntryCntrl.patchValue(value.countryCode);
    }

    DischargeValueChanged(value) {
        this.charterDiscDescrCntrl.patchValue(value.description);
        this.charterDiscCntryCntrl.patchValue(value.countryCode);
    }
}
