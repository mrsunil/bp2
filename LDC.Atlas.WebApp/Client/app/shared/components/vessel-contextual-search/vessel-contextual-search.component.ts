import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { inDropdownListValidator } from '../../directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../entities/atlas-form-control';
import { MasterDataProps } from '../../entities/masterdata-props.entity';
import { MasterData } from '../../entities/masterdata.entity';
import { SectionTraffic } from '../../entities/section-traffic.entity';
import { Vessel } from '../../entities/vessel.entity';
import { MasterdataService } from '../../services/http-services/masterdata.service';
import { SnackbarService } from '../../services/snackbar.service';
import { nameof, UtilService } from '../../services/util.service';
import { ContextualSearchBaseLightBoxComponent } from '../contextual-search/base-light-box/contextual-search-base-light-box.component';

@Component({
    selector: 'atlas-vessel-contextual-search',
    templateUrl: './vessel-contextual-search.component.html',
    styleUrls: ['./vessel-contextual-search.component.scss'],
})
export class VesselContextualSearchComponent implements OnInit {

    fieldGroup: FormGroup;
    @Input() required: boolean = false;
    @Output() readonly optionSelected = new EventEmitter();

    isAutocompleteActivated: boolean = true;

    company: string;
    vessels: Vessel[];

    vesselPart1Ctrl = new AtlasFormControl('VesselName');
    vesselPart1CompleteList: string[] = [];
    vesselPart1FilteredList: string[] = [];
    vesselPart1Validators: ValidatorFn[] = [];

    vesselPart2Ctrl = new AtlasFormControl('flag');
    vesselPart2CompleteList: string[] = [];
    vesselPart2FilteredList: string[] = [];
    vesselPart2Validators: ValidatorFn[] = [];

    vesselPart3Ctrl = new AtlasFormControl('built');
    vesselPart3CompleteList: string[] = [];
    vesselPart3FilteredList: string[] = [];
    vesselPart3Validators: ValidatorFn[] = [];

    selectedVesselCtrl = new AtlasFormControl('');

    masterdataList: string[] = [MasterDataProps.Vessels];
    destroy$ = new Subject();
    gridId = 'vesselsGrid';
    lightBoxTitle = 'Results for vessel';
    isEditable = true;
    // masterData: MasterData;
    masterdata: MasterData = new MasterData();

    constructor(private route: ActivatedRoute, protected utils: UtilService,
        protected dialog: MatDialog,
        protected utilService: UtilService,
        protected snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
    ) { }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data['masterdata'] as MasterData;

        this.vessels = this.masterdata.vessels;
        this.initialize();
    }

    initialize() {

        this.vesselPart2Ctrl.disable();
        this.vesselPart3Ctrl.disable();

        this.buildVesselArrays();

        this.onSelectedVesselValueChange();
    }

    initControlValidators() {
        this.vesselPart1Validators = [];
        this.vesselPart2Validators = [];
        this.vesselPart3Validators = [];
        this.vesselPart1Validators.push(
            inDropdownListValidator(
                this.vesselPart1CompleteList,
                nameof<Vessel>('vesselName'),
            ),
        );

        this.vesselPart2Validators.push(
            inDropdownListValidator(
                this.vesselPart2CompleteList,
                nameof<Vessel>('flag'),
            ),
        );

        this.vesselPart3Validators.push(
            inDropdownListValidator(
                this.vesselPart3CompleteList,
                nameof<Vessel>('built'),
            ),
        );

    }

    getFormGroup() {
        this.fieldGroup = this.formBuilder.group(
            {
                vesselPart1: this.vesselPart1Ctrl,
                vesselPart2: this.vesselPart2Ctrl,
                vesselPart3: this.vesselPart3Ctrl,
                selectedCommodity: this.selectedVesselCtrl,
            },
        );

        return this.fieldGroup;
    }

    // setValidators() {
    //     this.initControlValidators();
    //     this.vesselPart1Ctrl.setValidators(
    //         Validators.compose(this.vesselPart1Validators),
    //     );

    //     // this.vesselPart2Ctrl.setValidators(
    //     //     Validators.compose(this.vesselPart2Validators),
    //     // );

    //     // this.vesselPart3Ctrl.setValidators(
    //     //     Validators.compose(this.vesselPart3Validators),
    //     // );

    // }

    private buildVesselArrays() {
        this.vessels.forEach((cmy: Vessel) => {
            // vessel Part 1 should always be defined and is independant
            this.vesselPart1CompleteList = this.pushUniqueStringInArray(this.vesselPart1CompleteList, cmy.vesselName);

        });

        // Form Controls value changes
        // -- Part 1
        this.vesselPart1FilteredList = this.vesselPart1CompleteList;
        this.vesselPart1Ctrl.valueChanges.subscribe((value: string) => {
            this.vesselPart2Ctrl.reset();
            this.vesselPart3Ctrl.disable();

            this.vesselPart2CompleteList = [];

            this.vesselPart1FilteredList = this.vesselPart1CompleteList.filter((cmyType) => {
                return cmyType.toLocaleLowerCase().startsWith(value.toLocaleLowerCase());
            });
            if (this.vesselPart1Ctrl.valid) {
                const validVessels: Vessel[] = this.vessels.filter((vessel: Vessel) => {
                    return vessel.vesselName === value;
                });

                if (validVessels.length > 0) {
                    this.vesselPart2Ctrl.enable();

                    validVessels.forEach((vessel: Vessel) => {
                        const str = vessel.flag ? vessel.flag : '';
                        this.vesselPart2CompleteList =
                            this.pushUniqueStringInArray(this.vesselPart2CompleteList, str.toString());
                    });
                    this.vesselPart2FilteredList = this.vesselPart2CompleteList;

                    this.getSelectedVessels();

                }
            }

        });

        // -- Part 2
        this.vesselPart2Ctrl.valueChanges.subscribe((value: number) => {
            this.vesselPart3Ctrl.reset();
            this.vesselPart3CompleteList = [];
            this.vesselPart3Ctrl.disable();

            this.vesselPart2FilteredList = this.vesselPart2CompleteList.filter((cmyOrigin) => {
                return value && cmyOrigin;
            });

            if (this.vesselPart2Ctrl.valid && this.vesselPart2Ctrl.enabled) {

                const validVessels: Vessel[] = this.vessels.filter((vessel: Vessel) => {
                    return vessel.flag === this.vesselPart1Ctrl.value
                        && vessel.flag === this.vesselPart1Ctrl.value;
                });

                if (validVessels.length > 0) {
                    this.vesselPart3Ctrl.enable();

                    validVessels.forEach((vessel: Vessel) => {

                        const str = vessel.built ? vessel.built : '';
                        this.vesselPart3CompleteList =
                            this.pushUniqueStringInArray(this.vesselPart3CompleteList, str);
                    });

                    this.vesselPart3FilteredList = this.vesselPart3CompleteList;
                    // this.setValidators();
                    this.getSelectedVessels();

                }

            }
        });

        // -- Part 3 : just filter the list

        this.vesselPart3Ctrl.valueChanges.subscribe((value: string) => {
            this.vesselPart3FilteredList = this.vesselPart3CompleteList.filter((cmyPart3) => {
                return value && cmyPart3.toLocaleLowerCase().startsWith(value.toLocaleLowerCase());
            });
            if (this.vesselPart3Ctrl.valid) {
                this.getSelectedVessels();
            }
        });

    }

    // todo: move this to utilService
    pushUniqueStringInArray(stringArray: string[], value: string): string[] {
        const myClonedArray: string[] = JSON.parse(JSON.stringify(stringArray));
        if (myClonedArray.lastIndexOf(value) === -1) {
            myClonedArray.push(value);
        }
        return myClonedArray.sort((str1, str2) => str1.localeCompare(str2));
    }

    getVessel(): Vessel {
        return this.selectedVesselCtrl.value;
    }

    onExploreClicked(event) {
        const searchLightBox = this.dialog.open(ContextualSearchBaseLightBoxComponent, {
            data: {
                gridId: this.gridId,
                rowData$: this.getFilteredVessels(),
            },
            width: '80%',
            height: '80%',
        });

        searchLightBox.afterClosed().subscribe((vessel: Vessel) => {
            if (vessel) {
                this.patchValue(vessel);
            }
        });

        if (event) {
            event.stopPropagation();
        }
    }

    patchValue(vessel: Vessel) {
        this.selectedVesselCtrl.patchValue(vessel);
        this.vesselPart1Ctrl.patchValue(vessel.vesselName);
        this.vesselPart2Ctrl.patchValue(vessel.flag);
        this.vesselPart3Ctrl.patchValue(vessel.built);
        this.onSelectedVesselValueChange();
    }

    initForm(data: SectionTraffic) {
        this.vesselPart1Ctrl.patchValue(data.vesselCode);
    }

    private getSelectedVessels() {

        this.selectedVesselCtrl.patchValue(
            this.vessels.find((cmy: Vessel) => {
                return cmy.vesselName === this.vesselPart1Ctrl.value
                    && cmy.flag === this.vesselPart2Ctrl.value
                    && cmy.built === this.vesselPart3Ctrl.value;

            }),
        );
        this.onSelectedVesselValueChange();
    }

    private getFilteredVessels(): Vessel[] {
        return this.vessels.filter((cmy) => {
            return (((this.vesselPart1Ctrl.value
                && cmy.vesselName.toLowerCase().startsWith(String(this.vesselPart1Ctrl.value).toLowerCase()))
                ||
                (!this.vesselPart1Ctrl.value))
                &&
                ((this.vesselPart2Ctrl.value
                    && cmy.flag.toString().toLowerCase().startsWith(String(this.vesselPart2Ctrl.value).toLowerCase()))
                    ||
                    (!this.vesselPart2Ctrl.value))
                &&
                ((this.vesselPart3Ctrl.value
                    && cmy.built.toLowerCase().startsWith(String(this.vesselPart3Ctrl.value).toLowerCase()))
                    ||
                    (!this.vesselPart3Ctrl.value)));
        });
    }

    private onSelectedVesselValueChange() {

        if (!this.selectedVesselCtrl.value) {
            if (this.required) {
                this.selectedVesselCtrl.setErrors({ invalidVessel: true });
            } else {
                this.selectedVesselCtrl.setErrors(null);
            }
        } else {
            this.selectedVesselCtrl.setErrors(null);
            this.optionSelected.emit((this.selectedVesselCtrl.value as Vessel).vesselName);
        }
    }

}
