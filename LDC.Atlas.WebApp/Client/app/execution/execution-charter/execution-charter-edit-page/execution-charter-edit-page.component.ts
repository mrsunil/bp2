import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AssignedSection } from '../../../shared/entities/assigned-section.entity';
import { Charter } from '../../../shared/entities/charter.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { IsLocked } from '../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../shared/entities/lock-functional-context.entity';
import { ContractTypes } from '../../../shared/enums/contract-type.enum';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { LockService } from '../../../shared/services/http-services/lock.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AdditionalInformationFormComponent } from '../execution-charter-creation-page/components/additional-information-form-component/additional-information-form-component.component';
import { AssignedContractListFormComponent } from '../execution-charter-creation-page/components/assigned-contract-list-form-component/assigned-contract-list-form-component.component';
import { MainInformationFormComponent } from '../execution-charter-creation-page/components/main-information-form-component/main-information-form-component.component';
import { MemoFormComponent } from '../execution-charter-creation-page/components/memo-form-component/memo-form-component.component';
import { ShipmentFormComponent } from '../execution-charter-creation-page/components/shipment-form-component/shipment-form-component.component';
import { TotalCardComponent } from '../execution-charter-creation-page/components/total-card-component/total-card-component.component';
import { WarningComponent } from '../execution-charter-creation-page/components/warning-component/warning-component.component';
import { TitleService } from './../../../shared/services/title.service';
import { UtilService } from './../../../shared/services/util.service';

@Component({
    selector: 'atlas-execution-charter-edit-page',
    templateUrl: './execution-charter-edit-page.component.html',
    styleUrls: ['./execution-charter-edit-page.component.scss'],
})
export class ExecutionCharterEditPageComponent extends BaseFormComponent implements OnInit, OnDestroy {

    @ViewChild('mainInfoComponent') mainInfoComponent: MainInformationFormComponent;
    @ViewChild('additionalInfoComponent') additionalInfoComponent: AdditionalInformationFormComponent;
    @ViewChild('shipmentComponent') shipmentComponent: ShipmentFormComponent;
    @ViewChild('memoComponent') memoComponent: MemoFormComponent;
    @ViewChild('totalCardComponent') totalCardComponent: TotalCardComponent;
    @ViewChild('assignedContractListFormComponent') assignedContractListFormComponent: AssignedContractListFormComponent;
    @ViewChild('warningComponent') warningComponent: WarningComponent;

    charterForm: FormGroup;
    charterReference: string;
    savingInProgress = false;
    isClearClicked = false;
    model: Charter;
    charterId: number;
    creationDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    masterdata: any;
    sectionModel: AssignedSection = new AssignedSection();
    sectionsAssigned: AssignedSection[];
    formComponents: BaseFormComponent[] = [];
    viewWarning: boolean = false;
    warning: boolean = true;
    company: string;
    isEdit: boolean = true;
    isSave: boolean = false;
    isLoading = true;
    hideFloatingButtons: boolean = false;
    destroy$ = new Subject();
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;

    constructor(protected route: ActivatedRoute,
        protected executionService: ExecutionService,
        protected cdr: ChangeDetectorRef,
        protected formBuilder: FormBuilder,
        protected snackbarService: SnackbarService,
        protected router: Router,
        protected location: Location,
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected lockService: LockService,
        protected utilService: UtilService,
        protected titleService: TitleService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.isClearClicked = false;
        this.charterId = this.route.snapshot.params['charterId'];
        const companySubscription = this.route.paramMap
            .pipe(
                map((params) => params.get('company')),
            )
            .subscribe((company) => {
                this.company = company;
            });

        this.charterForm = this.formBuilder.group({
            additionalInfoComponent: this.additionalInfoComponent.getFormGroup(),
            mainInfoComponent: this.mainInfoComponent.getFormGroup(),
            shipmentComponent: this.shipmentComponent.getFormGroup(),
            memoComponent: this.memoComponent.getFormGroup(),
            assignedContractListFormComponent: this.assignedContractListFormComponent.getFormGroup(),

        });

        this.formComponents.push(
            this.additionalInfoComponent,
            this.mainInfoComponent,
            this.memoComponent,
            this.shipmentComponent,
            this.assignedContractListFormComponent,
            this.totalCardComponent);
        this.cdr.detectChanges();

        this.subscriptions.push(this.lockService.lockCharter(this.charterId, LockFunctionalContext.CharterEdit)
            .subscribe(
                (data) => {
                    this.loadCharterData();
                },
                (err) => {
                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: err.error.detail,
                            okButton: 'Got it',
                        },
                    });
                    this.goToChartersDetails(this.charterId);
                }));
        this.subscriptions.push(companySubscription);
    }

    canDeactivate() {
        if (this.charterForm.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.charterForm.dirty) {
            $event.returnValue = true;
        }
    }

    loadCharterData() {
        this.subscriptions.push(this.executionService.getCharterById(this.charterId)
            .subscribe((data) => {
                this.model = data;
                this.creationDate = data.creationDate.toDateString();
                this.createdBy = data.createdBy;
                this.modifiedDate = data.modifiedDate === null ? '' : data.modifiedDate.toDateString();
                this.modifiedBy = data.modifiedBy;
                this.charterReference = data.charterCode;
                this.mainInfoComponent.assignValues(this.model);
                this.mainInfoComponent.initForm(this.model);

                this.additionalInfoComponent.initForm(this.model);

                this.shipmentComponent.assignValues(this.model);
                this.shipmentComponent.initForm(this.model);
                this.memoComponent.initForm(this.model);
                this.assignedContractListFormComponent.initForm(this.model, true);
                this.initFABActions();
                this.isLoading = false;
                this.titleService.setTitle(this.charterReference + ' - Edit Charter');
            }));
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
                this.mainInfoComponent.initForm(this.model);
                this.additionalInfoComponent.initForm(this.model);
                this.shipmentComponent.initForm(this.model);
                this.memoComponent.initForm(this.model);
                this.goToChartersDetails(this.charterId);
            }
        });
    }

    onSaveButtonClicked() {
        this.isSave = true;
        this.utilService.updateFormGroupValidity(this.charterForm);
        if (this.charterForm.valid) {
            this.masterdata = this.route.snapshot.data.masterdata;
            this.getCharterInfo();

            this.warning = false;
            // This code has been removed in bug 23126 but will be added back for UX
            // if (this.model.assignedSections.length > 0 && this.model.allContractsSelected === false) {
            //     const result = this.model;
            // 
            //     const assignSectionDialog = this.dialog.open(AssignSectionDialogComponent, {
            //         data: { result, masterdata: this.masterdata },
            //     });
            //     assignSectionDialog.afterClosed().subscribe((charters: Charter) => {
            //         if (charters != null) {
            //             this.validateSectionAndUpdate(charters);
            //         }
            //     });
            // } else {

            if (this.model.assignedSections.length === 0) {
                this.warning = true;
                this.viewWarning = true;
            }
            this.validateSectionAndUpdate(this.model);

        } else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
        }

    }

    goToChartersDetails(charterId: number) {
        this.router.navigate([this.route.snapshot.paramMap.get('company') +
            '/execution/charter/details', charterId, { warning: this.viewWarning }]);
    }

    validateSectionAndUpdate(charter: Charter) {
        let assignedSections: AssignedSection[];
        assignedSections = charter.assignedSections.map((o) => o);
        const sectionsInvoicedOrUnallocatedSales = assignedSections.filter((section) => this.isSectionInvoicedOrUnallocatedSale(section));
        if (sectionsInvoicedOrUnallocatedSales.length > 0) {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Warning',
                    text: 'The BL date of invoiced contracts or unallocated sales contracts will not be updated',
                    okButton: 'Ok',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.updateCharter(charter);
                }
            });
        } else {
            this.updateCharter(charter);
        }
    }

    isSectionInvoicedOrUnallocatedSale(section): boolean {
        if (section.invoiceRef && section.invoiceRef !== '') {
            return true;
        }
        // Sale not allocated will not be updated
        if (section.contractType === ContractTypes.Sale && section.allocatedTo === null) {
            return true;
        }
        return false;
    }

    updateCharter(updateCharterModel: Charter) {
        updateCharterModel.charterId = this.charterId;
        this.executionService.updateCharter(updateCharterModel, false)
            .subscribe(
                () => {
                    this.snackbarService.informationSnackBar('Charter has been updated successfully.');
                    this.goToChartersDetails(this.charterId);
                },
                (error) => {
                    console.error(error);
                    this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                },
                () => {
                    this.savingInProgress = false;
                });
    }

    goToChartersList() {
        this.router.navigate([this.route.snapshot.paramMap.get('company') + '/execution/charter']);
    }

    getCharterInfo() {
        this.model = new Charter();
        this.formComponents.forEach((comp) => {
            this.model = comp.populateEntity(this.model);
        });

    }
    onClearButtonClicked() {
        this.isSave = true;
        this.mainInfoComponent.clearValueOfControl();
        this.additionalInfoComponent.clearValueOfControl();
        this.shipmentComponent.clearValueOfControl();
        this.memoComponent.clearValueOfControl();
    }

    deleteCharter() {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Charter Deletion',
                text: 'Deleting a charter is permanent. Do you wish to proceed?',
                okButton: 'Delete anyway',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.executionService.deleteCharter(this.charterId).subscribe(() => {
                    this.snackbarService.informationSnackBar('Charter deleted successfully');
                    this.goToChartersList();
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }));
    }

    onPreviousPageNavigation() {
        this.location.back();
    }

    onEditCharterClicked() {
        this.lockService.isLockedCharter(this.charterId).pipe(
            takeUntil(this.destroy$),
        ).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {

                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.router.navigate(['/' + this.company + '/execution/charter/edit', this.charterId]);
            }
        });
    }

    // For FAB
    initFABActions() {
        this.fabTitle = 'Charter Edit FAB mini';
        this.fabType = FABType.MiniFAB;

        const actionItemSave: FloatingActionButtonActions = {
            icon: 'save',
            text: 'Save',
            action: 'save',
            disabled: false,
            index: 3,
        };
        const actionItemCancel: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Cancel',
            action: 'cancel',
            disabled: false,
            index: 2,
        };

        this.fabMenuActions.push(actionItemSave);
        this.fabMenuActions.push(actionItemCancel);
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'save': {
                this.onSaveButtonClicked();
                break;
            }
            case 'cancel': {
                this.onPreviousPageNavigation();
                break;
            }
        }
    }

    onReassignedButtonClicked(event) {
        if (event) {
            this.hideFloatingButtons = true;
        } else {
            this.hideFloatingButtons = false;
        }
    }
}
