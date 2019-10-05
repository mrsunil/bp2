import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AssignedSection } from '../../../shared/entities/assigned-section.entity';
import { Charter } from '../../../shared/entities/charter.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TitleService } from '../../../shared/services/title.service';
import { UtilService } from './../../../shared/services/util.service';
import { AdditionalInformationFormComponent } from './components/additional-information-form-component/additional-information-form-component.component';
import { MainInformationFormComponent } from './components/main-information-form-component/main-information-form-component.component';
import { MemoFormComponent } from './components/memo-form-component/memo-form-component.component';
import { ShipmentFormComponent } from './components/shipment-form-component/shipment-form-component.component';

@Component({
    selector: 'atlas-execution-charter-creation-page',
    templateUrl: './execution-charter-creation-page.component.html',
    styleUrls: ['./execution-charter-creation-page.component.scss'],
})
export class ExecutionCharterCreationPageComponent extends BaseFormComponent implements OnInit {

    @ViewChild('mainInfoComponent') mainInfoComponent: MainInformationFormComponent;
    @ViewChild('additionalInfoComponent') additionalInfoComponent: AdditionalInformationFormComponent;
    @ViewChild('shipmentComponent') shipmentComponent: ShipmentFormComponent;
    @ViewChild('memoComponent') memoComponent: MemoFormComponent;
    charterForm: FormGroup;

    savingInProgress = false;
    isClearClicked = false;
    isSave: boolean = false;
    model: Charter;
    charters: Charter[];
    charterId: number;
    sectionModel: AssignedSection = new AssignedSection();
    formComponents: BaseFormComponent[] = [];

    // -- FAB Management
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;

    constructor(private route: ActivatedRoute,
        private executionService: ExecutionService,
        private cdr: ChangeDetectorRef,
        protected formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private router: Router,
        private location: Location,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected utilService: UtilService,
        private titleService: TitleService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.titleService.setTitle('Charter Creation');

        this.isClearClicked = false;

        this.charterForm = this.formBuilder.group({
            additionalInfoComponent: this.additionalInfoComponent.getFormGroup(),
            mainInfoComponent: this.mainInfoComponent.getFormGroup(),
            shipmentComponent: this.shipmentComponent.getFormGroup(),
            memoComponent: this.memoComponent.getFormGroup(),
        });

        this.formComponents.push(this.additionalInfoComponent, this.mainInfoComponent, this.memoComponent, this.shipmentComponent);
        this.cdr.detectChanges();

        this.charterId = Number(this.route.snapshot.paramMap.get('charterId'));
        if (this.charterId > 0) {
            this.getCharterDetails(this.charterId);
        }

        this.initFABActions();
        this.isLoaded = true;
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

    getCharterDetails(charterId: number) {
        this.executionService.getCharterById(this.charterId)
            .subscribe((data) => {
                this.model = data;
                this.model.charterCode = null;
                this.formComponents.forEach((comp) => {
                    comp.initForm(this.model);
                });
                this.snackbarService.informationSnackBar('Charter details copied successfully.');
            });
    }

    cancelForm() {
        this.isSave = true;
        this.location.back();
    }

    submitForm() {
        this.isSave = true;
        this.utilService.updateFormGroupValidity(this.charterForm);
        if (this.charterForm.valid) {
            this.getCharterInfo();

            this.executionService.findChartersByReference(this.model.charterCode)
                .subscribe((data) => {
                    this.charters = data.value.map((charter) => {
                        return charter;
                    });

                    if (this.charters == null || this.charters.length === 0) {
                        this.executionService.createCharter(this.model)
                            .subscribe(
                                (data) => {
                                    this.snackbarService.informationSnackBar('Charter has been saved successfully.');
                                    this.goToCharterView(data.charterId);
                                },
                                (error) => {
                                    console.error(error);
                                    this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                                },
                                () => {
                                    this.savingInProgress = false;
                                });
                    } else {
                        this.snackbarService.informationSnackBar('Charter Reference already exist.');
                        return;
                    }

                });
        } else {
            this.additionalInfoComponent.showErrorIcon = true;
            this.mainInfoComponent.showErrorIcon = true;
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
        }
    }

    goToUserList() {
        this.router.navigate(['/' + this.route.snapshot.paramMap.get('company') + '/execution/charter']);
    }

    goToCharterView(charterId: number) {
        this.router.navigate(['/' + this.route.snapshot.paramMap.get('company') + '/execution/charter/details', charterId]);
    }

    getCharterInfo() {
        this.model = new Charter();

        this.formComponents.forEach((comp) => {
            this.model = comp.populateEntity(this.model);
        });

    }

    clearForm() {
        this.mainInfoComponent.clearValueOfControl();
        this.additionalInfoComponent.clearValueOfControl();
        this.shipmentComponent.clearValueOfControl();
        this.memoComponent.clearValueOfControl();
    }

    // For FAB
    initFABActions() {
        this.fabTitle = 'init FAB mini Creation';
        this.fabType = FABType.MiniFAB;

        const actionItemSave: FloatingActionButtonActions = {
            icon: 'save',
            text: 'Save',
            action: 'save',
            disabled: false,
            index: 0,
        };
        const actionItemCancel: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Cancel',
            action: 'cancel',
            disabled: false,
            index: 1,
        };

        this.fabMenuActions.push(actionItemSave);
        this.fabMenuActions.push(actionItemCancel);
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'save': {
                this.submitForm();
                break;
            }
            case 'cancel': {
                this.cancelForm();
                break;
            }
        }
    }

}
