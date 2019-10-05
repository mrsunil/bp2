import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { from, Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { FormInputComponent } from '../../../../../shared/components/form-components/form-input/form-input.component';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { ApplicationFieldDisplayView } from '../../../../../shared/entities/application-field-display-view';
import { ApplicationField } from '../../../../../shared/entities/application-field.entity';
import { Freeze } from '../../../../../shared/entities/freeze.entity';
import { FunctionalObject } from '../../../../../shared/entities/functional-object.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { User } from '../../../../../shared/entities/user.entity';
import { AtlasServiceNames } from '../../../../../shared/enums/atlas-service-names.enum';
import { EventType } from '../../../../../shared/enums/event-type.enum';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';
import { ApiCollection, ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { FreezeService } from '../../../../../shared/services/http-services/freeze.service';
import { ReportingService } from '../../../../../shared/services/http-services/reporting.service';
import { UserIdentityService } from '../../../../../shared/services/http-services/user-identity.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { isBeforeDate, isDateBeforeControlDate } from '../../../../../shared/validators/date-validators.validator';
import { DisplayOptions } from '../../../../entities/display-options.entity';
import { OrderByOptions } from '../../../../entities/order-by-options.entity';

@Component({
    selector: 'atlas-audit-report',
    templateUrl: './audit-report.component.html',
    styleUrls: ['./audit-report.component.scss'],
})
export class AuditReportComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly alphanumericPattern = '^[a-zA-Z0-9.]*$';

    @ViewChildren('keyFields') keyFields: QueryList<FormInputComponent>;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    formGroup: FormGroup;
    dateFromCtrl: FormControl;
    dateToCtrl: FormControl;
    snapshotCtrl: FormControl;
    functionalObjectCtrl: FormControl;
    userCtrl = new FormControl();
    eventCtrl = new FormControl();
    functionalContextCtrl = new FormControl();
    additionalKeyCtrl = new FormControl();
    oldValueCtrl: FormControl;
    newValueCtrl: FormControl;
    orderByCtrl: FormControl;
    displayOptionCtrl: FormControl;

    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/Audit/Audit';
    parameters: any[] = [];
    company: string;
    destroy$ = new Subject();
    snapshotOptions: FreezeDisplayView[] = [];
    functionalObjectOptions: FunctionalObject[] = [];
    userOptions: User[] = [];
    userFilteredOptions: User[] = [];
    selectedEventTypes: EventType[] = [];
    isUpdateSelected: boolean;
    eventTypeOptions: string[] = [];
    functionalContextOptions: string[] = [];
    additionalFilterOptions: ApplicationFieldDisplayView[] = [];
    displayWithOptions: DisplayOptions[] = [];
    orderByOptions: OrderByOptions[] = [];
    predefinedKeys: ApplicationField[] = [];
    keysErrorMap: Map<string, string> = new Map();
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT');
    now: moment.Moment;
    filters: ListAndSearchFilter[] = [];
    dynamicControls: string[] = [];
    dateErrorMap: Map<string, string> = new Map();
    ToDateErrorMap: Map<string, string> = new Map();

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        private freezeService: FreezeService,
        private configurationService: ConfigurationService,
        private userIdentityService: UserIdentityService,
        private reportingService: ReportingService,
        private snackbarService: SnackbarService,
        private utilService: UtilService,
        private titleService: TitleService) {
        this.company = this.route.snapshot.paramMap.get('company');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.displayWithOptions = DisplayOptions.getOptionList();
        this.orderByOptions = OrderByOptions.getOptionList();
        this.eventTypeOptions = Object.values(EventType).filter((value) => typeof value === 'string') as string[];
        this.functionalContextOptions = Object.values(AtlasServiceNames).filter((value) => typeof value === 'string') as string[];
        this.keysErrorMap.set('pattern', 'Not accepted format');
        this.dateErrorMap
            .set('isDateValid', 'The date cannot be in the future.');

        this.ToDateErrorMap
            .set('isDateValid', 'The date cannot be in the future.')
            .set('isBeforeDateValid', 'To date cannot be before the from date');
    }

    ngOnInit() {
        this.initForm();
        this.loadData();
        this.titleService.setTitle(this.route.snapshot.data.title);
    }

    ngAfterViewInit() {
        this.keyFields.changes
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((components: QueryList<FormInputComponent>) => {
                this.dynamicControls.forEach((control) => {
                    this.formGroup.removeControl(control);
                });
                components.forEach((component) => {
                    const controlName = String(component.id);
                    this.dynamicControls.push(controlName);
                    component.fieldControl.setValidators(Validators.pattern(this.alphanumericPattern));
                    this.formGroup.addControl(controlName, component.fieldControl);
                });
                this.formGroup.updateValueAndValidity();
            });
    }

    onDateChanged(): void {
        this.setDateValidators();
    }

    setDateValidators() {
        this.dateToCtrl.setValidators(Validators.compose(
            [isBeforeDate(this.companyManager.getCurrentCompanyDate()), (isDateBeforeControlDate(moment(this.dateFromCtrl.value)))]));
        this.dateToCtrl.updateValueAndValidity();
    }

    initForm() {
        this.initControls();
        this.subscribeForChanges();
        this.formGroup = this.formBuilder.group({
            dateFromCtrl: this.dateFromCtrl,
            dateToCtrl: this.dateToCtrl,
            snapshotCtrl: this.snapshotCtrl,
            functionalObjectCtrl: this.functionalObjectCtrl,
            userCtrl: this.userCtrl,
            eventCtrl: this.eventCtrl,
            functionalContextCtrl: this.functionalContextCtrl,
            additionalKeyCtrl: this.additionalKeyCtrl,
            oldValueCtrl: this.oldValueCtrl,
            newValueCtrl: this.newValueCtrl,
            orderByCtrl: this.orderByCtrl,
            displayOptionCtrl: this.displayOptionCtrl,
        });
    }

    initControls() {
        this.dateFromCtrl = new FormControl(this.now, [Validators.required, isBeforeDate(this.companyManager.getCurrentCompanyDate())]);
        this.dateToCtrl = new FormControl(this.now, [Validators.required, isBeforeDate(this.companyManager.getCurrentCompanyDate())]);
        this.snapshotCtrl = new FormControl(this.currentSnapshot);
        this.functionalObjectCtrl = new FormControl('', Validators.required);
        this.newValueCtrl = new FormControl('', Validators.pattern(this.alphanumericPattern));
        this.oldValueCtrl = new FormControl('', Validators.pattern(this.alphanumericPattern));
        this.displayOptionCtrl = new FormControl(this.displayWithOptions.find((item) => item.name === 'Friendly name'));
        this.orderByCtrl = new FormControl(this.orderByOptions.find((item) => item.name === 'Date'));
    }

    subscribeForChanges() {
        this.userCtrl.valueChanges
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((input) => {
                this.userFilteredOptions = this.utilService.filterListforAutocomplete(
                    input,
                    this.userOptions,
                    ['displayName'],
                );
            });
    }

    loadData() {
        this.freezeService.getFreezeList()
            .pipe(
                map((collection: ApiPaginatedCollection<Freeze>) => {
                    return collection.value.map((freeze) => {
                        return new FreezeDisplayView(
                            freeze.dataVersionId,
                            this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate));
                    });
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((snapshots: FreezeDisplayView[]) => {
                this.snapshotOptions = snapshots;
                this.snapshotOptions.unshift(this.currentSnapshot);
            });

        this.configurationService.getFunctionalObjects()
            .pipe(
                map((collection: ApiCollection<FunctionalObject>) => collection.value),
                takeUntil(this.destroy$),
            )
            .subscribe((functionalObjects) => {
                this.functionalObjectOptions = functionalObjects;
            });

        this.userIdentityService.getAllUsers()
            .pipe(
                map((collection: ApiCollection<User>) => collection.value),
                takeUntil(this.destroy$),
            )
            .subscribe((users) => {
                this.userOptions = this.userFilteredOptions = users;
                this.userCtrl.setValidators(inDropdownListValidator(
                    this.userOptions,
                    nameof<User>('userId'),
                ));
            });
    }

    getAdditionalKeys(functionalObject: FunctionalObject): Observable<ApplicationFieldDisplayView[]> {
        return from(functionalObject.tables)
            .pipe(
                mergeMap((table) => this.configurationService.getApplicationTableById(table.tableId)),
                map((table) => {
                    return table.fields.map((field) => {
                        const fieldView: ApplicationFieldDisplayView = {
                            fieldId: field.fieldId,
                            fieldName: field.fieldName,
                            friendlyName: field.friendlyName,
                            description: field.description,
                            tableName: table.tableName,
                            type: field.type,
                        };
                        return fieldView;
                    });
                }),
            );
    }

    onEventTypeSelected(eventTypes: string[]) {
        this.selectedEventTypes = eventTypes.map((event) => {
            if (event) {
                return EventType[event];
            }
        });
        this.isUpdateSelected = this.selectedEventTypes.indexOf(EventType.Update) > -1;
    }

    onFunctionalObjectSelected(functionalObject: FunctionalObject) {
        if (functionalObject) {
            this.additionalFilterOptions = [];
            this.configurationService.getFunctionalObjectById(functionalObject.functionalObjectId)
                .pipe(
                    map((object: FunctionalObject) => {
                        let keyFields: ApplicationField[] = [];
                        object.tables.forEach((table) => {
                            keyFields = keyFields.concat(table.fields);
                        });
                        return keyFields;
                    }),
                    mergeMap((fields: ApplicationField[]) => {
                        this.predefinedKeys = fields;
                        return this.getAdditionalKeys(functionalObject);
                    }),
                    takeUntil(this.destroy$),
                )
                .subscribe((fields: ApplicationFieldDisplayView[]) => {
                    this.utilService.removeItemsFromArray(fields, this.predefinedKeys, 'fieldId');
                    this.additionalFilterOptions = this.additionalFilterOptions.concat(fields);
                    this.utilService.sortArrayAlphabetically(this.additionalFilterOptions, ['tableName', 'fieldName']);
                });
        }
    }

    getKeyFieldsParameter(): any {
        const parameters: any[] = [];
        const keyFieldValues: string[] = [];
        this.keyFields.forEach((input, index) => {
            if (input.id && input.fieldControl) {
                const keyValue = input.fieldControl.value;
                keyFieldValues.push(String(input.id).concat('=', keyValue ? String(keyValue) : ''));
            }
        });

        if (keyFieldValues && keyFieldValues.length > 0) {
            parameters.push({ name: 'KeyFields', value: keyFieldValues.join(',') });
        }
        return parameters;
    }

    getBasicParameters(): any[] {
        const dateFrom = (this.dateFromCtrl.value as moment.Moment).format('YYYY-MM-DD');
        const dateTo = (this.dateToCtrl.value as moment.Moment).format('YYYY-MM-DD');
        const snapshotId = (this.snapshotCtrl.value as FreezeDisplayView).dataVersionId;
        const functionalObjectId = (this.functionalObjectCtrl.value as FunctionalObject).functionalObjectId;
        const userId = this.userCtrl.value ? (this.userCtrl.value as User).userId : '';
        const functionalContext = this.functionalContextCtrl.value ?
            AtlasServiceNames[AtlasServiceNames[this.functionalContextCtrl.value]] : '';
        const orderBy = (this.orderByCtrl.value as OrderByOptions).value;
        const displayOption = (this.displayOptionCtrl.value as DisplayOptions).value;

        const parameters: any[] = [
            { name: 'DateFrom', value: dateFrom },
            { name: 'DateTo', value: dateTo },
            { name: 'Company', value: this.company },
            { name: 'FunctionalObject', value: functionalObjectId },
            { name: 'DisplayWith', value: displayOption },
            { name: 'OrderBy', value: orderBy },
        ];

        if (userId) {
            parameters.push({ name: 'User', value: userId });
        }

        if (functionalContext) {
            parameters.push({ name: 'FunctionalContext', value: functionalContext });
        }

        if (snapshotId > -1) {
            parameters.push({ name: 'Database', value: snapshotId });
        }

        this.selectedEventTypes.forEach((event) => {
            parameters.push({ name: 'EventType', value: EventType[event].toUpperCase() });
        });

        return parameters;
    }

    getAdditionalFilterParameters(): any[] {
        const additionalFieldId = this.additionalKeyCtrl.value ? (this.additionalKeyCtrl.value as ApplicationField).fieldId : -1;
        const oldValue = this.oldValueCtrl.value;
        const newValue = this.newValueCtrl.value;
        const parameters: any[] = [];

        if (additionalFieldId > -1) {
            parameters.push({ name: 'AdditionalFilter', value: additionalFieldId });
        }

        parameters.push({ name: 'AdditionalFilterOldValue', value: oldValue });
        parameters.push({ name: 'AdditionalFilterNewValue', value: newValue });

        return parameters;
    }

    onGenerateReportButtonClicked() {
        if (!this.formGroup || !this.formGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }

        this.parameters = [];
        this.parameters = this.parameters.concat(
            this.getBasicParameters(),
            this.getKeyFieldsParameter(),
            this.getAdditionalFilterParameters());

        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }

    trackKeyFields(item: ApplicationField): any {
        return item.fieldId;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
