import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription, Subject } from 'rxjs';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FxTradeType } from '../../../../shared/entities/fx-trade-type.entity';
import { FxDealDetail } from '../../../../shared/entities/fxdeal-detail.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { FxDealStatus } from '../../../../shared/enums/fx-deals-status.enum';
import { PostingStatus } from '../../../../shared/enums/posting-status.enum';
import { SpotRoeType } from '../../../../shared/enums/spot-roe-type.enum';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UtilService } from '../../../../shared/services/util.service';
import { BankFormComponent } from '../form-components/bank-form-component/bank-form.component';
import { DealFormComponent } from '../form-components/deal-form-comonent/deal-form.component';
import { DealTermsFormComponent } from '../form-components/deal-terms-component/deal-terms-form.component';
import { FxDealHeaderFormComponent } from '../form-components/header-form-component/fxdeal-header-form.component';
import { InternalMemoFormComponent } from '../form-components/internal-memo-form-component/internal-memo-form.component';
import { RateEntryComponent } from '../form-components/rate-entry-form-component/rate-entry-form.component';
import { SettlementDocumentsComponent } from '../form-components/settlement-documents-component/settlement-documents.component';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { takeUntil } from 'rxjs/operators';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { FloatingActionButtonActions } from './../../../../shared/entities/floating-action-buttons-actions.entity';
import { FABType } from './../../../../shared/components/floating-action-button/floating-action-button-type.enum';
@Component({
    selector: 'atlas-fx-deals-capture',
    templateUrl: './fx-deals-capture.component.html',
    styleUrls: ['./fx-deals-capture.component.scss'],
})
export class FxDealsCaptureComponent implements OnInit {
    @ViewChild('fxDealHeaderFormComponent') fxDealHeaderFormComponent: FxDealHeaderFormComponent;
    @ViewChild('dealTermsFormComponent') dealTermsFormComponent: DealTermsFormComponent;
    @ViewChild('bankFormComponent') bankFormComponent: BankFormComponent;
    @ViewChild('dealFormComponent') dealFormComponent: DealFormComponent;
    @ViewChild('rateEntryComponent') rateEntryComponent: RateEntryComponent;
    @ViewChild('internalMemoFormComponent') internalMemoFormComponent: InternalMemoFormComponent;
    @ViewChild('settlementDocumentsComponent') settlementDocumentsComponent: SettlementDocumentsComponent;

    fxDealDeatil: FxDealDetail;
    private formComponents: BaseFormComponent[] = [];
    saveInProgress: boolean;
    captureFxdealFormGroup: FormGroup;
    onValidationState = false;
    model: FxDealDetail;
    subscriptions: Subscription[] = [];
    isViewMode: boolean = false;
    isEdit: boolean = false;
    fxDealId: number;
    isDeleteShow: boolean = false;
    isEditShow: boolean = false;
    company: string;
    isEditPrivilege: boolean = false;
    isDeletePrivilege: boolean = false;
    masterData: MasterData;
    filteredFxTradeTypes: FxTradeType[];
    isNdf: boolean = false;;
    ndfAgreedRate: number;
    ndfAgreedDate?: Date;
    messageGenerated: string;
    mappingFields = new Array();
    isSettled: boolean = false;
    destroy$ = new Subject();
    // -- FAB Management
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;

    constructor(private route: ActivatedRoute, protected tradingService: TradingService,
        protected utilService: UtilService,
        protected snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        private authorizationService: AuthorizationService,
        protected companyManager: CompanyManagerService,
        protected lockService: LockService,
        protected router: Router,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredFxTradeTypes = this.masterData.fxTradeTypes;
        this.captureFxdealFormGroup = this.formBuilder.group({
            fxDealHeaderFormComponent: this.fxDealHeaderFormComponent.getFormGroup(),
            dealTermsFormComponent: this.dealTermsFormComponent.getFormGroup(),
            bankFormComponent: this.bankFormComponent.getFormGroup(),
            dealFormComponent: this.dealFormComponent.getFormGroup(),
            rateEntryComponent: this.rateEntryComponent.getFormGroup(),
            internalMemoFormComponent: this.internalMemoFormComponent.getFormGroup(),
            settlementDocumentsComponent: this.settlementDocumentsComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.fxDealHeaderFormComponent,
            this.dealTermsFormComponent,
            this.bankFormComponent,
            this.dealFormComponent,
            this.rateEntryComponent,
            this.internalMemoFormComponent,
            this.settlementDocumentsComponent,
        );

        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
            && this.authorizationService.isPrivilegeAllowed(this.company, 'FxDeals')) {
            this.isEditPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CreateEditFxDeal');
            this.isDeletePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'DeleteFxDeal');
        }

        this.fxDealId = Number(this.route.snapshot.paramMap.get('fxDealId'));
        if (this.route.snapshot.data.isView) {
            this.isEdit = false;
            this.isViewMode = true;
            this.loadFxDealData();
        }
        if (this.route.snapshot.data.isEdit) {
            this.isEdit = true;
            this.loadFxDealData();
        }
        if (this.route.snapshot.data.isView === undefined
            && this.route.snapshot.data.isEdit === undefined) {
            this.initFABActions();
        }
        this.isLoaded = true;
    }

    onSaveButtonClicked() {
        this.saveInProgress = true;
        this.onValidationState = true;
        this.utilService.updateFormGroupValidity(this.captureFxdealFormGroup);

        if (this.captureFxdealFormGroup.pending) {
            this.captureFxdealFormGroup.statusChanges.subscribe(() => {
                if (this.onValidationState) {
                    this.onValidationState = false;
                    this.handleSave();
                }
            });
        } else {
            this.onValidationState = false;
            this.handleSave();
        }
    }

    handleSave() {
        try {
            if (!this.captureFxdealFormGroup.valid) {
                this.snackbarService.throwErrorSnackBar(
                    'Form is invalid. Please resolve the errors.',
                );
                this.saveInProgress = false;
                return;
            }

            if (!this.model) {
                this.model = new FxDealDetail();
            }

            this.model.isEditMode = this.isEdit;
            this.fxDealHeaderFormComponent.populateEntity(this.model);
            this.dealTermsFormComponent.populateEntity(this.model);
            this.bankFormComponent.populateEntity(this.model);
            this.dealFormComponent.populateEntity(this.model);
            this.rateEntryComponent.populateEntity(this.model);
            this.internalMemoFormComponent.populateEntity(this.model);

            if (this.isEdit) {
                                this.subscriptions.push(this.tradingService.updateFxDeal(this.fxDealId, this.model)
                                    .subscribe(() => {
                                        this.saveInProgress = false;
                                        this.snackbarService.informationSnackBar('Fx Deal has been updated successfully.');
                                        this.tradingService.settleFxDeal(this.fxDealId).subscribe((response) => {
                                            this.saveInProgress = false;
                                            if (response) {
                                                const documentReferences = response.map((r) => r.documentReference).toString();
                                                const messageGenerated = 'FxDeal document(s): ' + documentReferences + ' generated successfully';
                                                this.snackbarService.informationAndCopySnackBar(messageGenerated, documentReferences);
                                            }
                                            if (this.fxDealId) {
                                                this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/display/' + this.fxDealId]);
                                            } else {
                                                this.goToFxDealHome();
                                            }
                                        });
                                    },
                                        (err) => {
                                            this.saveInProgress = false;
                                            this.snackbarService.informationSnackBar('Some fields have incorrect values, please correct them before saving.');
                                        }));
           

            } else {
                this.subscriptions.push(this.tradingService.createFxDeal(this.model)
                    .subscribe((data: any) => {
                        if (data) {
                            this.saveInProgress = false;
                            this.fxDealId = data.fxDealId;
                            if (data.c2CCode && data.departmentAlternativeCode
                                && data.nominalAlternativeAccount && data.settlementNominalAccount) {
                                this.messageGenerated = 'Fx Deal has been created successfully.';

                            } else {
                                if (!data.c2CCode) {
                                    this.mappingFields.push('" bank / broker account :' + data.counterpartyCode + '"');
                                }
                                if (!data.departmentAlternativeCode) {
                                    this.mappingFields.push('"Department :' + data.departmentMappingCode + '"');
                                }
                                if (!data.nominalAlternativeAccount) {
                                    this.mappingFields.push('"Nominal Account :' + data.nominalAccountNumber + '"');
                                }
                                if (!data.settlementNominalAccount) {
                                    this.mappingFields.push('"Settlement Nominal Account :' + data.settlementAccountNumber + '"');
                                }
                                const mappingErrorFields = this.mappingFields.join(', ');
                                this.messageGenerated = 'The FJ document of the deal' + data.fxReference +
                                    ' will not be sent to the accounting interface because the accounting interface code of '
                                    + mappingErrorFields + ' is/are not filled in. Please contact the accountant';
                            }
                            this.snackbarService.informationAndCopySnackBar(this.messageGenerated, this.messageGenerated);

                            this.tradingService.settleFxDeal(data.fxDealId).subscribe((response) => {
                                if (response) {
                                    const documentReferences = response.map((r) => r.documentReference).toString();
                                    const messageGenerated = 'FxDeal document(s): ' + documentReferences + ' generated successfully';
                                    this.snackbarService.informationAndCopySnackBar(messageGenerated, documentReferences);
                                }
                                if (this.fxDealId) {
                                    this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/display/' + this.fxDealId]);
                                } else {
                                    this.goToFxDealHome();
                                }
                            });
                        } else {
                            this.saveInProgress = false;
                        }
                    },
                        (err) => {
                            this.saveInProgress = false;
                            this.snackbarService.informationSnackBar('Some fields have incorrect values, please correct them before saving.');
                        }));
            }
        } catch (ex) {
            this.saveInProgress = false;
            console.error(ex);
        }
    }


    onCreateButtonClicked() {
        this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/capture']);
    }

    onDiscardButtonClicked() {
        if (this.fxDealId) {
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/display/' + this.fxDealId]);
        } else {
            this.goToFxDealHome();
        }
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    goToFxDealHome() {
        const tabIndex: number = 2;
        this.router.navigate(['/' + this.company + '/trades'],
            {
                queryParams: { index: tabIndex },
            });
    }

    loadFxDealData() {
        this.tradingService.getfxDealById(this.fxDealId)
            .subscribe((data) => {
                if (data) {
                    this.fxDealDeatil = data;
                    this.isDeleteShow = (this.fxDealDeatil.fxDealStatusId === FxDealStatus.Deleted) ? true : false;
                    this.isEditShow = (this.fxDealDeatil.fxDealStatusId === FxDealStatus.Deleted) ? false : true;
                    this.formComponents.forEach((comp) => {
                        comp.initForm(this.fxDealDeatil, this.isEdit);
                        const fxTradeType = this.filteredFxTradeTypes.find((x) => x.code == this.dealTermsFormComponent.dealTypeCtrl.value);
                        if (fxTradeType && fxTradeType.isNdf) {
                            this.rateEntryComponent.ndfChange = false;
                            this.isNdf = true;
                        }
                    });
                    if (this.fxDealDeatil.fxDealStatusId === FxDealStatus.Settled) {
                        this.isSettled = true;
                    }
                }
                this.initFABActions();
            });

    }

    onDeleteButtonClicked() {
        if (!this.isDeleteShow) {
            let warningMessage: string;
            if (this.fxDealDeatil.fxDealStatusId === FxDealStatus.Open) {
                warningMessage = 'Do you confirm the deletion of this deal ?';
            } else if (this.fxDealDeatil.fxDealStatusId === FxDealStatus.Settled) {
                warningMessage = 'This FX deal is already settled, do you really wish do delete it ?';
                if (this.fxDealDeatil.fxSettlementDealDocumentPostingStatusId !== PostingStatus.Posted ||
                    this.fxDealDeatil.fxSettlementSettlementDocumentPostingStatusId !== PostingStatus.Posted) {
                    this.snackbarService.throwErrorSnackBar(
                        'The FX deal has already matured but the settlement documents have not been posted yet.' +
                        ' Please post the documents before deleting the deal',
                    );
                    return;
                }
            }

            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Delete FxDeal',
                    text: warningMessage,
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    if (this.fxDealDeatil.fxDealStatusId === FxDealStatus.Open) {
                        this.tradingService.deleteFxDeal(this.fxDealId).subscribe((data) => {
                            this.snackbarService.informationSnackBar('FxDeal has been deleted successfully');
                            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/display/' + this.fxDealId]);
                        });
                    } else {
                        this.tradingService.reverseFxDeal(this.fxDealId).subscribe((response) => {
                            setTimeout(() => {
                                const documentReferences = response.map((r) => r.documentReference).toString();
                                this.tradingService.deleteFxDeal(this.fxDealId).subscribe((data) => {
                                    const messageGenerated = 'FxDeal has been deleted successfully. The reversal document references are ' + documentReferences;
                                    this.snackbarService.informationAndCopySnackBar(messageGenerated, documentReferences);
                                    this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/display/' + this.fxDealId]);
                                });
                            });
                        });
                    }
                } else {
                    return;
                }
            });
        }
    }
    onEditButtonClicked() {
        this.lockService.isLockedFxDeal(this.fxDealId).pipe(
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
            }
            else {
                this.subscriptions.push(this.lockService.lockFxDeal(this.fxDealId, LockFunctionalContext.FxDeal).pipe(
                    takeUntil(this.destroy$),
                ).subscribe(
                    (data) => {
        if (!this.isSettled) {
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/edit/' + this.fxDealId]);
        }
  }))}});
    }

    onTraderROECalculation(result: number) {
        if (result) {
            this.dealFormComponent.tradedROECtrl.patchValue(result);
        }
    }

    onSettledAmountCalculation(result: string) {
        if (result) {
            if (result === SpotRoeType.Division) {
                this.dealFormComponent.isDivideROEType = true;
            } else {
                this.dealFormComponent.isDivideROEType = false;
            }
            this.dealFormComponent.onSettledAmountCalculate();
        }
    }

    onSettledAmountEvaluation(settledAmount: number) {
        this.dealFormComponent.settledAmountCtrl.patchValue(settledAmount);
    }

    onDefaultSpotRoeTypeValue(defaultSpotRoeValue: number) {
        if (defaultSpotRoeValue && this.route.snapshot.data.isCreate) {
            this.rateEntryComponent.mdCtrl.patchValue(defaultSpotRoeValue);
        }
    }

    onFxRateValue(fxRateValue: number) {
        if (fxRateValue) {
            this.rateEntryComponent.fxRateValue = fxRateValue;
        }
    }
    onSpotRoeWarningValue(isWarning: boolean) {
        if (isWarning) {
            this.rateEntryComponent.isWarningDisplay = true;
        } else {
            this.rateEntryComponent.isWarningDisplay = false;
        }
    }

    onDealTypeChanged(event) {
        this.rateEntryComponent.ndfChange = event;
        this.isNdf = true;
        if (this.rateEntryComponent.ndfChange) {
            this.isNdf = false;
            this.ndfAgreedRate = this.rateEntryComponent.ndfAgreedRateCtrl.value;
        } else {
            this.rateEntryComponent.ndfAgreedRateCtrl.patchValue(this.ndfAgreedRate);
            const noOfDays = this.masterData.fxTradeTypes.find((ndfAgreed) => ndfAgreed.isNdf === this.isNdf);
            const noOfDays2 = noOfDays ? noOfDays.noOfDays : null;
            const ndfAgreedDate = new Date(this.dealTermsFormComponent.maturityDateCtrl.value);
            ndfAgreedDate.setDate(ndfAgreedDate.getDate() - noOfDays2);
            this.rateEntryComponent.ndfAgreedDateCtrl.patchValue(ndfAgreedDate);
        }
    }

    onMaturityDateChanged(event) {
        if (this.isNdf && this.dealTermsFormComponent.maturityDateCtrl.value) {
            const noOfDays = this.masterData.fxTradeTypes.find((ndfAgreed) => ndfAgreed.isNdf === this.isNdf);
            const noOfDays2 = noOfDays ? noOfDays.noOfDays : null;
            const ndfAgreedDate = new Date(this.dealTermsFormComponent.maturityDateCtrl.value);
            ndfAgreedDate.setDate(ndfAgreedDate.getDate() - noOfDays2);
            this.rateEntryComponent.ndfAgreedDateCtrl.patchValue(ndfAgreedDate);
        } else {
            this.ndfAgreedRate = this.rateEntryComponent.ndfAgreedRateCtrl.value;
            this.rateEntryComponent.ndfAgreedDateCtrl.patchValue('');
            this.rateEntryComponent.ndfAgreedRateCtrl.patchValue('');
        }
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
            index: 3,
        };
        const actionItemCancel: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Cancel',
            action: 'cancel',
            disabled: false,
            index: 2,
        };
        const actionItemEdit: FloatingActionButtonActions = {
            icon: 'edit',
            text: 'Edit',
            action: 'edit',
            index: 1,
            disabled: this.isSettled ? true : false,
        };

        const actionItemCreate: FloatingActionButtonActions = {
            icon: 'add',
            text: 'Create',
            action: 'create',
            index: 4,
            disabled: false,
        };

        const actionItemDelete: FloatingActionButtonActions = {
            icon: 'delete',
            text: 'Delete',
            action: 'delete',
            index: 5,
            disabled: this.isDeleteShow,
        };

        if (!this.isViewMode) {
            this.fabMenuActions.push(actionItemSave);
            this.fabMenuActions.push(actionItemCancel);
        }
        if (this.isViewMode && this.isEditShow && this.isEditPrivilege) {
            this.fabMenuActions.push(actionItemEdit);
        }
        if (this.isEditShow && this.isEditPrivilege) {
            this.fabMenuActions.push(actionItemCreate);
        }
        if (this.isViewMode && this.isDeletePrivilege) {
            this.fabMenuActions.push(actionItemDelete);
        }
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'save': {
                this.onSaveButtonClicked();
                break;
            }
            case 'cancel': {
                this.onDiscardButtonClicked();
                break;
            }
            case 'create': {
                this.onCreateButtonClicked();
                break;
            }
            case 'edit': {
                this.onEditButtonClicked();
                break;
            }
            case 'delete': {
                this.onDeleteButtonClicked();
                break;
            }
        }
    }
}
