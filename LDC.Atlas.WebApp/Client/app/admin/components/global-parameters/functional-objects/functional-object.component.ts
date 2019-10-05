// tslint:disable-next-line:no-submodule-imports
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FunctionalObjectNameValidator } from '../../../../admin/validators/functional-object-name.validator';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PicklistComponent } from '../../../../shared/components/picklist/picklist.component';
import { ApplicationTable } from '../../../../shared/entities/application-table.entity';
import { FunctionalObject } from '../../../../shared/entities/functional-object.entity';
import { ApiCollection } from '../../../../shared/services/common/models';
import { ConfigurationService } from '../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';

@Component({
    selector: 'atlas-functional-object',
    templateUrl: './functional-object.component.html',
    styleUrls: ['./functional-object.component.scss'],
})
export class FunctionalObjectComponent implements OnInit, OnDestroy {

    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('tablePicklist') tablePicklist: PicklistComponent;
    @ViewChildren('keyPicklist') keyPicklist: QueryList<PicklistComponent>;

    formGroup: FormGroup;
    nameCtrl = new FormControl();
    title: string = 'Create functional object';
    isCreation = true;
    company: string;
    currentStep = 0;
    isAllTableProcessed = false;
    isSave: boolean = false;
    bannerTitle = 'Key selection';
    bannerMessage = 'Tables where no keys are selected will not be saved.';
    functionalObjects: any;
    fields: any[] = [];
    functionalObjectId: number;
    tablesOptions: ApplicationTable[] = []; // To select tables in step 1
    pickedTables: ApplicationTable[] = []; // To select keys in step 2
    pickedKeys: ApplicationTable[] = []; // To store selected keys with table references on submit
    destroy$ = new Subject();
    pickedTablesedit: ApplicationTable[] = [];
    selectedtables: ApplicationTable[] = [];
    rowData: FunctionalObject[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog,
        private configurationService: ConfigurationService,
        private titleService: TitleService) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.functionalObjectId = this.route.snapshot.params['functionalObjectId'];
        this.getApplicationTables();
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.initializeForm();
        if (this.functionalObjectId !== undefined) {
            this.title = '';
            this.fillSelectedTabels();
        }
    }

    fillSelectedTabels() {
        this.configurationService.getFunctionalObjectById(this.functionalObjectId).subscribe((data) => {
            this.nameCtrl.patchValue(data.functionalObjectName);
            this.tablePicklist.pickedOptions = data.tables;
            this.selectedtables = data.tables;
            this.configurationService.getAllApplicationTables()
                .pipe(
                    takeUntil(this.destroy$),
                ).subscribe((appTables: ApplicationTable[]) => {
                    this.tablesOptions = appTables;
                    this.filterTablesItems(this.selectedtables, this.tablesOptions)
                });


        });

    }

    filterTablesItems(selectedtables: any[], allTables: any[]) {
        selectedtables.forEach((item) => {
            const element = allTables.find((element) => element.tableId === item.tableId);
            if (element) {
                const index = allTables.indexOf(element);
                if (index !== -1) {
                    allTables.splice(index, 1);
                }
            }
        })
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.formGroup.dirty) {
            $event.returnValue = true;
        }
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            nameCtrl: this.nameCtrl,
        });

        this.setValidators();
    }

    canDeactivate() {
        if (this.formGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    getApplicationTables() {
        this.configurationService.getAllApplicationTables()
            .pipe(
                takeUntil(this.destroy$),
            ).subscribe((appTables: ApplicationTable[]) => {
                this.tablesOptions = appTables;
            });
    }

    setValidators() {
        this.nameCtrl.setValidators(Validators.required);
        this.nameCtrl.setAsyncValidators(
            FunctionalObjectNameValidator.createValidator(this.configurationService, (this.functionalObjectId) ? this.functionalObjectId : 0));
    }

    navigateToList() {
        this.router.navigate([`/${this.company}/admin/global-parameters/functional-object/list`]);
    }

    onNextButtonClicked() {
        this.isSave = true;
        this.pickedTables = this.tablePicklist.getPickedItems();

        if (this.pickedTables.length < 1) {
            this.snackbarService.throwErrorSnackBar('Please select at least one table.');
            return;
        }

        this.stepper.next();
        this.pickedTables.forEach((pickedTable) => {
            pickedTable.fields = [];
            this.configurationService.getApplicationTableById(pickedTable.tableId)
                .pipe(
                    takeUntil(this.destroy$),
                )
                .subscribe((table: ApplicationTable) => {
                    const index = this.pickedTables.findIndex((appTable) => appTable.tableId === table.tableId);
                    if (index > -1) {
                        this.pickedTables[index].fields = table.fields;
                    }
                    if (this.functionalObjectId !== undefined) {
                        this.getSelectedKeys();
                    }
                });
        });

    }

    getSelectedKeys() {
        this.keyPicklist.forEach((selectedkeyTables) => {
            this.configurationService.getFunctionalObjectById(this.functionalObjectId).subscribe((dataTables) => {
                dataTables.tables.forEach((dataFields) => {
                    const index = dataTables.tables.findIndex((appTable) => appTable.tableId === selectedkeyTables.id);
                    if (index > -1) {
                        selectedkeyTables.pickedOptions = dataTables.tables[index].fields;
                        dataTables.tables[index].fields.forEach((item) => {
                            const element = selectedkeyTables.options.find((element) => element.fieldId === item.fieldId);
                            if (element) {
                                const index = selectedkeyTables.options.indexOf(element);
                                if (index !== -1) {
                                    selectedkeyTables.options.splice(index, 1);
                                }
                            }
                        });
                    }

                });
            });
        });
    }

    getPickedKeys(): number {
        let keyCount = 0;
        this.pickedKeys = [];
        this.keyPicklist.toArray().forEach((list) => {
            const keys = list.getPickedItems();
            if (keys || keys.length > 0) {
                keyCount += keys.length;

                const table = new ApplicationTable();
                table.tableId = list.id as number;
                table.fields = keys;

                this.pickedKeys.push(table);
            }
        });

        return keyCount;
    }

    onCreateButtonClicked() {
        this.configurationService.getFunctionalObjects().subscribe((functionalObj: ApiCollection<FunctionalObject>) => {
            this.functionalObjects = functionalObj.value;
            this.rowData = this.functionalObjects;

            const existingData = this.rowData.find((data) => data.functionalObjectName === this.nameCtrl.value)
            if (existingData) {
                this.snackbarService.throwErrorSnackBar('Name already exists');
            }
            else {
                this.isSave = true;
                const count = this.getPickedKeys();

                if (count === 0) {
                    this.snackbarService.throwErrorSnackBar('Please select at least one key.');
                    return;
                }

                if (count > 10) {
                    this.snackbarService.throwErrorSnackBar('Only 10 or fewer predefined keys can be selected.');
                    return;
                }

                if (!this.formGroup.valid) {
                    this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
                    return;
                }
                if (this.functionalObjectId !== undefined) {
                    //call edit here
                    this.configurationService.editFunctionalObject(this.functionalObjectId, this.nameCtrl.value, this.pickedKeys)
                        .subscribe(() => {
                            this.snackbarService.informationSnackBar('Functional object has been successfully updated.');
                            this.navigateToList();
                        });
                } else {
                    //call create here
                    this.configurationService.createFunctionalObject(this.nameCtrl.value, this.pickedKeys)
                        .subscribe(() => {
                            this.snackbarService.informationSnackBar('Functional object has been successfully created.');
                            this.navigateToList();
                        });
                }
            }
        });

    }

    onDiscardButtonClicked() {
        this.isSave = true;
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.navigateToList();
            }
        });
    }

    onPreviousButtonClicked() {
        this.isSave = true;
        this.stepper.previous();
    }

    onStepChanged(event: StepperSelectionEvent) {
        this.currentStep = event.selectedIndex;
    }

    onRemoveInformationBannerClicked() {
        this.isAllTableProcessed = !this.isAllTableProcessed;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
