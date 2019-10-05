import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { TransportType } from '../../../../../shared/entities/transport-type.entity';
import { User } from '../../../../../shared/entities/user.entity';
import { Vessel } from '../../../../../shared/entities/vessel.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { CharterManagerDataLoader } from './../../../../../shared/services/execution/charter-manager-data-loader';
import { UserIdentityService } from './../../../../../shared/services/http-services/user-identity.service';
import { SnackbarService } from './../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-main-information-form-component',
    templateUrl: './main-information-form-component.component.html',
    styleUrls: ['./main-information-form-component.component.scss'],
    providers: [CharterManagerDataLoader],
})
export class MainInformationFormComponent extends BaseFormComponent implements OnInit {

    @Input() isCreateOrEdit: boolean = true;

    isFormControlRequired: Map<string, boolean> = new Map<string, boolean>();

    charterVesselCtrl = new AtlasFormControl('charterVesselCtrl');
    charterRefCntrl = new AtlasFormControl('charterRefCntrl');
    charterDescCntrl = new AtlasFormControl('charterDescCntrl');
    charterMgrCntrl = new AtlasFormControl('charterMgrCntrl');
    charterTransportCntrl = new AtlasFormControl('charterTransportCntrl');
    showErrorIcon: boolean;
    filteredVessels: Vessel[];
    filteredTransports: TransportType[];
    filteredCharterManagers: User[];
    model: Charter;
    charterManagerId: number;
    vesselControl: Vessel;
    transportControl: TransportType;
    charterManagerControl: User;
    masterdata: any;
    charterReference: string;

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected snackbarService: SnackbarService,
        protected userIdentityService: UserIdentityService,
        public charterManagerDataLoader: CharterManagerDataLoader,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.charterReference = this.route.snapshot.paramMap.get('ref');
        this.filteredVessels = this.masterdata.vessels;
        this.charterVesselCtrl.valueChanges.subscribe((input) => {
            this.filteredVessels =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.vessels,
                    ['vesselName', 'flag', 'built']);
        });

        this.filteredTransports = this.masterdata.transportTypes;
        this.charterTransportCntrl.valueChanges.subscribe((input) => {
            this.filteredTransports =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.transportTypes,
                    ['transportTypeCode']);
        });

        this.charterManagerDataLoader.getData().subscribe((charterManager) => {
            this.filteredCharterManagers = charterManager;
            if (this.isCreateOrEdit) {
                this.setValidatorOnCharterManager();
            }
            if (this.charterManagerId) {
                this.charterManagerControl = this.filteredCharterManagers.find((charterManagers) =>
                    charterManagers.userId === this.charterManagerId);
                this.charterMgrCntrl.patchValue(this.charterManagerControl);
            }
            this.charterMgrCntrl.valueChanges.subscribe((input) => {
                this.filteredCharterManagers = this.utilService.filterListforAutocomplete(
                    input,
                    charterManager,
                    ['userId', 'displayName'],
                );
            });

        });

        if (this.isCreateOrEdit) {
            this.enableControl();
            this.setValidators();
            this.setCharterReference();
        } else {
            this.disableControl();
        }
    }

    disableControl() {
        this.charterVesselCtrl.disable();
        this.charterRefCntrl.disable();
        this.charterDescCntrl.disable();
        this.charterMgrCntrl.disable();
        this.charterTransportCntrl.disable();
    }

    enableControl() {
        this.charterVesselCtrl.enable();
        this.charterRefCntrl.enable();
        this.charterDescCntrl.enable();
        this.charterMgrCntrl.enable();
        this.charterTransportCntrl.enable();
    }

    clearValueOfControl() {
        this.charterVesselCtrl.patchValue('');
        this.charterRefCntrl.patchValue('');
        this.charterDescCntrl.patchValue('');
        this.charterMgrCntrl.patchValue('');
        this.charterTransportCntrl.patchValue('');
    }

    initForm(entity: Charter, isEdit: boolean = false) {
        this.model = entity;
        this.assignValues(entity, isEdit);
        this.charterVesselCtrl.patchValue(this.vesselControl);
        this.charterRefCntrl.patchValue(this.model.charterCode);
        this.charterDescCntrl.patchValue(this.model.description);
        this.charterMgrCntrl.patchValue(this.charterManagerControl ? this.charterManagerControl : '');
        this.charterTransportCntrl.patchValue(this.transportControl);
    }

    assignValues(entity: Charter, isEdit: boolean = false) {
        const charter = entity as Charter;
        this.vesselControl = this.filteredVessels.find((vessel) => vessel.vesselName === charter.vesselCode);
        this.charterManagerControl = this.filteredCharterManagers ?
            this.filteredCharterManagers.find((charterManager) => charterManager.userId === charter.charterManagerId) : null;
        this.transportControl = this.filteredTransports.find((transport) => transport.transportTypeCode === charter.transportTypeCode);
        if (this.filteredCharterManagers) {
            this.charterManagerControl = this.filteredCharterManagers.find((charterManager) =>
                charterManager.userId === charter.charterManagerId);
        } else {
            this.charterManagerId = charter.charterManagerId;
        }
    }

    populateEntity(entity: any): any {
        const charter = entity as Charter;

        charter.vesselCode = this.charterVesselCtrl.value.vesselName;
        charter.vesselId = this.charterVesselCtrl.value.vesselId;
        charter.charterCode = this.charterRefCntrl.value;
        const charterManager: User = this.charterMgrCntrl.value;
        if (charterManager && charterManager.userId) {
            charter.charterManagerId = charterManager.userId;
        }
        charter.description = this.charterDescCntrl.value;
        const transport: TransportType = this.charterTransportCntrl.value;
        charter.transportTypeCode = transport ? transport.transportTypeCode : '';

        return charter;
    }

    setValidatorOnCharterManager() {
        this.charterMgrCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.filteredCharterManagers,
                    nameof<User>('displayName'),
                ),
            ]),
        );
    }

    setValidators() {
        this.charterVesselCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.vessels,
                    nameof<Vessel>('vesselName'),
                ),
            ]),
        );

        this.charterDescCntrl.setValidators(Validators.maxLength(60));

        this.charterTransportCntrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.transportTypes,
                    nameof<TransportType>('transportTypeCode'),
                ),
            ]),
        );

        this.charterRefCntrl.setValidators(Validators.compose([
            Validators.required,
            Validators.maxLength(15),
            Validators.pattern('^[a-zA-Z0-9.]*'),
        ]));

        this.isFormControlRequired[
            'charterVesselCtrl'
        ] = this.utilService.isRequired(this.charterVesselCtrl);
        this.isFormControlRequired[
            'charterTransportCntrl'
        ] = this.utilService.isRequired(this.charterTransportCntrl);
        this.isFormControlRequired[
            'charterRefCntrl'
        ] = this.utilService.isRequired(this.charterRefCntrl);

        this.formGroup.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({

            charterVesselCtrl: this.charterVesselCtrl,
            charterRefCntrl: this.charterRefCntrl,
            charterDescCntrl: this.charterDescCntrl,
            charterMgrCntrl: this.charterMgrCntrl,
            charterTransportCntrl: this.charterTransportCntrl,
        });

        return super.getFormGroup();
    }

    setCharterReference() {
        if (this.charterReference != null) {
            this.charterRefCntrl.patchValue(this.charterReference);
        }
    }
}
