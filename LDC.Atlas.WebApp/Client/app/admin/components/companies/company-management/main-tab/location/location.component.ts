import { AfterViewInit, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { Country } from '../../../../../../shared/entities/country.entity';
import { EnumEntity } from '../../../../../../shared/entities/enum-entity.entity';
import { LdcRegion } from '../../../../../../shared/entities/ldc-region.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { TimeZone } from '../../../../../../shared/entities/time-zone.entity';
import { WeekDays } from '../../../../../../shared/enums/week-days.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
})
export class LocationComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    countryCtrl = new AtlasFormControl('Country');
    countryNameCtrl = new AtlasFormControl('CountryName');
    timeZoneCtrl = new AtlasFormControl('TimeZone');
    ldcRegionsCtrl = new AtlasFormControl('LDCRegions');
    endOfWeekCtrl = new AtlasFormControl('EndofWeek');
    companyDateCtrl = new AtlasFormControl('CompanyDate');

    isInputField = false;
    model: CompanyConfigurationRecord;
    masterData: MasterData;
    filteredTimeZoneList: TimeZone[];
    filteredLDCRegions: LdcRegion[];
    filteredCountries: Country[];
    filteredWeekDaysList: EnumEntity[];
    totalWeekList: EnumEntity[];
    masterdataList: string[] = [
        MasterDataProps.TimeZones,
    ];
    ldcRegionErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    CountryErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    timeZoneErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');
    CountryNameErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');
    endOfWeekErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        protected masterdataService: MasterdataService,
        private router: Router,
        @Optional() @Inject(MAT_DATE_LOCALE) private dateLocale?: string,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredTimeZoneList = this.masterData.timeZones;
        this.filteredCountries = this.masterData.countries;
        this.filteredLDCRegions = this.masterData.regions;
        this.countryNameCtrl.disable();
        this.getWeekDaysList();
        this.filterLDCRegions();
        this.filterCountries();
    }

    ngAfterViewInit() {
        this.setValidators();
    }

    getWeekDaysList() {
        this.filteredWeekDaysList = [
            {
                enumEntityId: WeekDays.Monday,
                enumEntityValue: WeekDays[WeekDays.Monday],
            },
            {
                enumEntityId: WeekDays.Tuesday,
                enumEntityValue: WeekDays[WeekDays.Tuesday],
            },
            {
                enumEntityId: WeekDays.Wednesday,
                enumEntityValue: WeekDays[WeekDays.Wednesday],
            },
            {
                enumEntityId: WeekDays.Thursday,
                enumEntityValue: WeekDays[WeekDays.Thursday],
            },
            {
                enumEntityId: WeekDays.Friday,
                enumEntityValue: WeekDays[WeekDays.Friday],
            },
            {
                enumEntityId: WeekDays.Saturday,
                enumEntityValue: WeekDays[WeekDays.Saturday],
            },
            {
                enumEntityId: WeekDays.Sunday,
                enumEntityValue: WeekDays[WeekDays.Sunday],
            },
        ];
        this.totalWeekList = this.filteredWeekDaysList;
    }

    filterLDCRegions() {
        this.ldcRegionsCtrl.valueChanges.subscribe((input) => {
            this.filteredLDCRegions = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.regions,
                ['regionCode', 'description'],
            );
            if (this.ldcRegionsCtrl.valid) {
                this.ldcRegionCodeSelected(this.ldcRegionsCtrl.value);
            }
        });
    }

    filterCountries() {
        this.countryCtrl.valueChanges.subscribe((input) => {
            this.filteredCountries = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.countries,
                ['countryCode', 'description'],
            );
            if (this.countryCtrl.valid) {
                this.countryCodeSelected(this.countryCtrl.value);
            }
        });
    }

    ldcRegionCodeSelected(value: LdcRegion) {
        if (value) {
            const selectedRegion = this.masterData.regions.find(
                (region) => region.ldcRegionCode === value.ldcRegionCode,
            );
            if (selectedRegion) {
                this.ldcRegionsCtrl.patchValue(selectedRegion.ldcRegionCode);
            }
        }
    }

    countryCodeSelected(value: Country) {
        if (value) {
            const selectedCountry = this.masterData.countries.find(
                (country) => country.countryCode === value.countryCode,
            );
            if (selectedCountry) {
                this.countryCtrl.patchValue(selectedCountry.countryCode);
                this.countryNameCtrl.patchValue(selectedCountry.description);
            }
        }
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            countryCtrl: this.countryCtrl,
            countryNameCtrl: this.countryNameCtrl,
            timeZoneCtrl: this.timeZoneCtrl,
            ldcRegionsCtrl: this.ldcRegionsCtrl,
            endOfWeekCtrl: this.endOfWeekCtrl,
            companyDateCtrl: this.companyDateCtrl,
        });
        return super.getFormGroup();
    }

    setValidators() {
        this.ldcRegionsCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.regions,
                    nameof<LdcRegion>('ldcRegionCode'),
                ), Validators.required,
            ]),
        );

        this.timeZoneCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.timeZones,
                    nameof<TimeZone>('timeZoneName'),
                ), Validators.required,
            ]),
        );
        this.endOfWeekCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.totalWeekList,
                    nameof<EnumEntity>('enumEntityValue'),
                ), Validators.required,
            ]),
        );
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.model = companyConfigurationRecord;
        if (this.model.companySetup) {
            this.countryCtrl.setValue(this.model.companySetup.countryCode);
            this.countryNameCtrl.setValue(this.model.companySetup.countryDescription);
            this.timeZoneCtrl.setValue(this.model.companySetup.timeZoneName);
            this.ldcRegionsCtrl.setValue(this.model.companySetup.ldcRegionCode);
            this.companyDateCtrl.setValue(this.model.companySetup.activeDate);
        }
        if (this.model.retentionPolicy) {
            this.endOfWeekCtrl.setValue(this.model.retentionPolicy.weekendDay);
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }

        return companyConfigurationRecord;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        companyConfiguration.companySetup.countryId = this.getCountryIdFromCode(this.countryCtrl.value);
        const selectedTimeZone = this.timeZoneCtrl.value;
        companyConfiguration.companySetup.timeZone = selectedTimeZone.timeZoneName ? selectedTimeZone.timeZoneName
            : selectedTimeZone;
        companyConfiguration.companySetup.ldcRegionId = this.getLDCRegionIdFromCode(this.ldcRegionsCtrl.value);
        const endOfWeek = this.endOfWeekCtrl.value;
        companyConfiguration.retentionPolicy.weekendDay = (endOfWeek.enumEntityValue) ? (endOfWeek.enumEntityValue)
            : endOfWeek;
        const local = this.dateLocale || moment.locale();
        const companyDate = this.companyDateCtrl.value ? moment(this.companyDateCtrl.value, 'YYYY-MM-DD').toDate() : null;
        companyConfiguration.companySetup.companyDate = (companyDate) ? moment.utc(moment.parseZone(companyDate).format('YYYY-MM-DD')).locale(local).toDate() : null;

        return companyConfiguration;
    }

    getCountryIdFromCode(countryCode: string): number {
        const selectedCountry = this.masterData.countries.find(
            (country) => country.countryCode === countryCode,
        );
        if (selectedCountry) {
            return selectedCountry.countryId;
        }
    }

    getLDCRegionIdFromCode(ldcRegionCode: string): number {
        const selectedLDCRegion = this.masterData.regions.find(
            (ldcRegion) => ldcRegion.ldcRegionCode === ldcRegionCode,
        );
        if (selectedLDCRegion) {
            return selectedLDCRegion.ldcRegionId;
        }
    }
}
