import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AssignedSection } from '../../../shared/entities/assigned-section.entity';
import { Charter } from '../../../shared/entities/charter.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { IsLocked } from '../../../shared/entities/is-locked.entity';
import { Section } from '../../../shared/entities/section.entity';
import { CharterStatus } from '../../../shared/enums/charter-status.enum';
import { ContractInvoiceType } from '../../../shared/enums/contract-invoice-type.enum';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { LockService } from '../../../shared/services/http-services/lock.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AdditionalInformationFormComponent } from '../execution-charter-creation-page/components/additional-information-form-component/additional-information-form-component.component';
import { AssignedContractListFormComponent } from '../execution-charter-creation-page/components/assigned-contract-list-form-component/assigned-contract-list-form-component.component';
import { CharterMenuBarComponent } from '../execution-charter-creation-page/components/charter-menu-bar-component/charter-menu-bar-component.component';
import { MainInformationFormComponent } from '../execution-charter-creation-page/components/main-information-form-component/main-information-form-component.component';
import { MemoFormComponent } from '../execution-charter-creation-page/components/memo-form-component/memo-form-component.component';
import { ShipmentFormComponent } from '../execution-charter-creation-page/components/shipment-form-component/shipment-form-component.component';
import { TotalCardComponent } from '../execution-charter-creation-page/components/total-card-component/total-card-component.component';
import { WarningComponent } from '../execution-charter-creation-page/components/warning-component/warning-component.component';
import { CompanyManagerService } from './../../../core/services/company-manager.service';
import { InvoiceMarkingSearchResult } from './../../../shared/dtos/invoice-marking';
import { InvoicingStatus } from './../../../shared/enums/invoicing-status.enum';
import { PostingStatus } from './../../../shared/enums/posting-status.enum';
import { TradingService } from './../../../shared/services/http-services/trading.service';
import { TitleService } from './../../../shared/services/title.service';
import { CharterClosureStatus } from './../../../shared/enums/charter-closure-status.enum';

@Component({
    selector: 'atlas-execution-charter-details',
    templateUrl: './execution-charter-details.component.html',
    styleUrls: ['./execution-charter-details.component.scss'],
})
export class ExecutionCharterDetailsComponent extends BaseFormComponent implements OnInit {
    @ViewChild('mainInfoComponent') mainInfoComponent: MainInformationFormComponent;
    @ViewChild('additionalInfoComponent') additionalInfoComponent: AdditionalInformationFormComponent;
    @ViewChild('shipmentComponent') shipmentComponent: ShipmentFormComponent;
    @ViewChild('memoComponent') memoComponent: MemoFormComponent;
    @ViewChild('totalCardComponent') totalCardComponent: TotalCardComponent;
    @ViewChild('assignSectionComponent') assignSectionComponent: AssignedContractListFormComponent;
    @ViewChild('warningComponent') warningComponent: WarningComponent;
    @ViewChild('charterMenuBarComponent') charterMenuBarComponent: CharterMenuBarComponent;
    isCreate: boolean = false;
    charterReference: string;
    model: Charter;
    isVisible: boolean;
    company: string;
    charterId: number;
    creationDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    sectionsAssigned: AssignedSection[];
    warning: boolean = false;
    isLoading = true;
    isContractAssignedToCharter: boolean = false;
    charterStatus: string;
    dataVersionId: number;
    childFlag: number = 0;
    public response: Observable<any>;
    defaultDate = 'Mon Jan 01 0001';
    sectionToClose: any = new Array();
    destroy$ = new Subject();

    // -- FAB Management
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;

    constructor(private route: ActivatedRoute, private executionService: ExecutionService, private router: Router,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog, private location: Location,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private titleService: TitleService,
        protected lockService: LockService,
        protected tradingService: TradingService,
        protected companyManager: CompanyManagerService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

        this.charterId = this.route.snapshot.params['charterId'];
        this.company = this.route.snapshot.params['company'];
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.executionService.getCharterById(this.charterId)
            .subscribe((data) => {
                this.model = data;
                this.creationDate = data.creationDate.toDateString();
                this.createdBy = data.createdBy;
                this.modifiedDate = data.modifiedDate == null ? '' : data.modifiedDate.toDateString();
                this.modifiedBy = data.modifiedBy;
                this.charterReference = data.charterCode;
                this.mainInfoComponent.assignValues(this.model);
                this.mainInfoComponent.initForm(this.model);
                this.totalCardComponent.assignValueToControl(this.model.weightUnitId);
                this.additionalInfoComponent.assignValues(this.model);
                this.additionalInfoComponent.initForm(this.model);

                this.shipmentComponent.assignValues(this.model);
                this.shipmentComponent.initForm(this.model);
                this.memoComponent.initForm(this.model);
                this.assignSectionComponent.initForm(this.model);
                this.initFABActions();
                this.isLoading = false;
                this.titleService.setTitle(this.charterReference + ' - Charter View');
                this.charterStatus = data.charterStatusId === CharterStatus.Open ?
                    CharterStatus[CharterStatus.Open].toString() :
                    CharterStatus[CharterStatus.Closed].toString();
                this.updateCharterMenu(data.charterStatusId);
            });

        this.warning = this.route.snapshot.paramMap.get('warning') === 'true' ? true : false;

        this.subscriptions.push(
            this.charterMenuBarComponent.openCharterSubject.subscribe(() => {
                this.onReopenCharterButtonClicked();
            }),
            this.charterMenuBarComponent.closeCharterSubject.subscribe(() => {
                this.onCloseCharterButtonClicked();
            }),
        );

    }

    copyCharter() {
        this.router.navigate(['/' + this.route.snapshot.paramMap.get('company') + '/execution/charter/new', this.charterId]);
    }

    editCharter() {
        this.router.navigate(['/' + this.route.snapshot.paramMap.get('company') + '/execution/charter/edit', this.charterId]);
    }

    btnEditClick() {
        this.isVisible = true;
    }

    btnCancelClick() {
        this.location.back();

    }

    btnDiscardChange() {
        this.isVisible = false;
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: '',
                text: 'Do you want to discard the changes.',
                okButton: 'Discard anyway',
                cancelButton: 'Cancel',
            },
        });
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

    goToChartersList() {
        this.router.navigate(['/' + this.company + '/execution/charter']);
    }

    onContractAssignedForCharter(value: boolean) {
        if (value === true) {
            this.isContractAssignedToCharter = value;
        }
    }

    updateCharterMenu(charterStatusId: number) {
        this.charterMenuBarComponent.updateCharterMenu(charterStatusId);
    }

    async onCloseCharterButtonClicked() {
        this.sectionToClose.length = 0;
        this.sectionToClose = new Array();
        const charterModelToClose: Charter = this.model;
        const lockedTrades: any[] = charterModelToClose.sectionsAssigned.length > 0 ? await this.checkLockStatusForAssignedTrades(charterModelToClose.sectionsAssigned) : [];

        if (lockedTrades !== null && lockedTrades.length > 0) {
            let lockMessageCombined: string = '';
            for (let i = 0; i < lockedTrades.length; i++) {
                lockMessageCombined += lockedTrades[i].lockMessage + '<br/>';
            }
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Trade(s) Locked',
                    text: 'Not allowed. <br/>' + lockMessageCombined,
                    okButton: 'Ok',
                },
            });
        } else {
            if (charterModelToClose.sectionsAssigned.length > 0) {
                this.tradingService.
                    getAssigedSectionDetailsToCloseCharter(charterModelToClose.sectionsAssigned.map((s) => s.sectionId)).subscribe((data) => {
                        if (data && data.length > 0) {
                            let closureValidaityStatusArray: any[] = new Array<any>();
                            for (let i = 0; i < data.length; i++) {
                                const validityStatus = this.checkSectionClosureValidity(data[i], data[i].invoices);
                                if (validityStatus !== CharterClosureStatus.InvoiceNotFinalized
                                    && validityStatus !== CharterClosureStatus.UnpostedInvoice
                                    && validityStatus !== CharterClosureStatus.NoBlDateUnrelizedTrade) {
                                    this.sectionToClose.push({
                                        sectionId: charterModelToClose.sectionsAssigned[i].sectionId,
                                        sectionCode: charterModelToClose.sectionsAssigned[i].contractLabel,
                                    });
                                }
                                closureValidaityStatusArray.push({ status: validityStatus, contractLabel: data[i].contractSectionCode });
                            }
                            const closureDialog = this.displayPopUpForCharterClosure(closureValidaityStatusArray);
                            const closureValidaityStatus = closureValidaityStatusArray.map(function (a) { return a.status });
                            if (closureValidaityStatus.indexOf(CharterClosureStatus.InvoiceNotFinalized) === -1
                                && closureValidaityStatus.indexOf(CharterClosureStatus.UnpostedInvoice) === -1
                                && closureValidaityStatus.indexOf(CharterClosureStatus.NoBlDateUnrelizedTrade) === -1) {
                                closureDialog.afterClosed().toPromise().then((answer) => {
                                    if (answer) {
                                        this.closeSections(this.sectionToClose, charterModelToClose);
                                    } else {
                                        this.sectionToClose.length = 0;
                                        this.sectionToClose = new Array();
                                    }
                                });
                            }
                            else {
                                this.sectionToClose.length = 0;
                                this.sectionToClose = new Array();
                            }
                        }
                        else {
                            this.closeCharter(charterModelToClose, this.sectionToClose);
                        }
                    });
            }
            else {
                this.closeCharter(charterModelToClose, this.sectionToClose);
            }
        }
    }

    async onReopenCharterButtonClicked() {
        const charterModelToClose: Charter = this.model;
        const lockedTrades = await this.checkLockStatusForAssignedTrades(charterModelToClose.sectionsAssigned);
        if (lockedTrades !== null && lockedTrades.length > 0) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Trade(s) Locked',
                    text: 'Not allowed, ' + lockedTrades.map(function (a) { return a.lockMessage; }).toString(),
                    okButton: 'Ok',
                },
            });
        } else {
            this.executionService.openCharter([charterModelToClose.charterId]).subscribe((ok) => {
                if (ok) {
                    if (charterModelToClose.sectionsAssigned.length > 0) {
                        const sectionIdsToReopen = charterModelToClose.sectionsAssigned.map(function (a) { return a.sectionId; });
                        this.tradingService.reOpenSection(sectionIdsToReopen)
                            .subscribe((ok) => {
                                if (ok) {
                                    let title = 'Charter ' + charterModelToClose.charterCode + ' is now reopened.<br/>Trade ';
                                    title += charterModelToClose.sectionsAssigned.map(function (a) { return a.contractLabel; }).toString();
                                    title += charterModelToClose.sectionsAssigned.length > 1 ? ' are now reopened.' : ' is now reopened.';

                                    this.dialog.open(ConfirmationDialogComponent, {
                                        data: {
                                            title: 'Charter Reopened',
                                            text: title,
                                            okButton: 'Ok',
                                        },
                                    }).afterClosed().subscribe((sucess) => {
                                        if (sucess) {
                                            this.router.navigate([this.companyManager.getCurrentCompanyId() +
                                                '/execution/charter/details/' + this.charterId]);
                                        }
                                    })
                                }
                            });
                    }
                    else {
                        let title = 'Charter ' + charterModelToClose.charterCode + ' is now reopened.';

                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Success - Charter Reopened',
                                text: title,
                                okButton: 'Ok',
                            },
                        }).afterClosed().subscribe((sucess) => {
                            if (sucess) {
                                this.router.navigate([this.companyManager.getCurrentCompanyId() +
                                    '/execution/charter/details/' + this.charterId]);
                            }
                        })
                    }
                }
            });
        }
    }

    private closeCharter(charter: Charter, sectionIToClose: any[]) {
        this.executionService.closeCharter([charter.charterId])
            .subscribe((ok) => {
                if (ok) {
                    let title = 'Charter ' + charter.charterCode + ' is now closed.';
                    if (charter.sectionsAssigned.length > 0) {
                        title += '<br/> Trade ';
                        title += sectionIToClose.map(function (a) { return a.sectionCode; }).toString();
                        title += sectionIToClose.length > 1 ? ' are now closed.' : ' is now closed.';
                    }

                    const closeInfoPopup = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Success - Charter Closed',
                            text: title,
                            okButton: 'Ok',
                        },
                    });
                    closeInfoPopup.afterClosed().subscribe((answer) => {
                        this.router.navigate([this.companyManager.getCurrentCompanyId() +
                            '/execution/charter/details/' + charter.charterId]);
                    });
                }
            });
    }

    private displayPopUpForCharterClosure(closureValidaityStatus: any[]): MatDialogRef<any> {
        let confirmPopupData: any;
        let popupText: string = '';
        const blockerSections = closureValidaityStatus.filter((item) => item.status === CharterClosureStatus.NoBlDateUnrelizedTrade
            || item.status === CharterClosureStatus.InvoiceNotFinalized
            || item.status === CharterClosureStatus.UnpostedInvoice);

        let groupStatusArray = {};

        closureValidaityStatus.forEach(function (a) {
            groupStatusArray[a.status] = groupStatusArray[a.status] || [];
            groupStatusArray[a.status].push({ status: a.status, contractLabel: a.contractLabel });
        });

        if (blockerSections.length > 0) {
            if (groupStatusArray[CharterClosureStatus.InvoiceNotFinalized] !== undefined
                && groupStatusArray[CharterClosureStatus.InvoiceNotFinalized] !== null
                && groupStatusArray[CharterClosureStatus.InvoiceNotFinalized].length > 0) {
                popupText += groupStatusArray[CharterClosureStatus.InvoiceNotFinalized].map(function (x) { return x.contractLabel }).toString()
                    + this.getpopupText(CharterClosureStatus.InvoiceNotFinalized)
            }
            if (groupStatusArray[CharterClosureStatus.UnpostedInvoice] !== undefined
                && groupStatusArray[CharterClosureStatus.UnpostedInvoice] !== null
                && groupStatusArray[CharterClosureStatus.UnpostedInvoice].length > 0) {
                popupText += groupStatusArray[CharterClosureStatus.UnpostedInvoice].map(function (x) { return x.contractLabel }).toString()
                    + this.getpopupText(CharterClosureStatus.UnpostedInvoice);
            }
            if (groupStatusArray[CharterClosureStatus.NoBlDateUnrelizedTrade] !== undefined
                && groupStatusArray[CharterClosureStatus.NoBlDateUnrelizedTrade] !== null
                && groupStatusArray[CharterClosureStatus.NoBlDateUnrelizedTrade].length > 0) {
                popupText += groupStatusArray[CharterClosureStatus.NoBlDateUnrelizedTrade].map(function (x) { return x.contractLabel }).toString()
                    + this.getpopupText(CharterClosureStatus.NoBlDateUnrelizedTrade)
            }
            confirmPopupData = {
                data: {
                    title: 'Blocking - Charter closure',
                    text: popupText,
                    okButton: 'Ok',
                },
            }
        } else {
            if (groupStatusArray[CharterClosureStatus.UninvoicedCosts] !== undefined
                && groupStatusArray[CharterClosureStatus.UninvoicedCosts] !== null
                && groupStatusArray[CharterClosureStatus.UninvoicedCosts].length > 0) {
                popupText += groupStatusArray[CharterClosureStatus.UninvoicedCosts].map(function (x) { return x.contractLabel }).toString()
                    + this.getpopupText(CharterClosureStatus.UninvoicedCosts)
            }
            if (groupStatusArray[CharterClosureStatus.UncashmatchedCosts] !== undefined
                && groupStatusArray[CharterClosureStatus.UncashmatchedCosts] !== null
                && groupStatusArray[CharterClosureStatus.UncashmatchedCosts].length > 0) {
                popupText += groupStatusArray[CharterClosureStatus.UncashmatchedCosts].map(function (x) { return x.contractLabel }).toString()
                    + this.getpopupText(CharterClosureStatus.UncashmatchedCosts)
            }
            if (popupText === '') {
                popupText = 'Continue with closure?';
            } else {
                popupText = popupText + '<br/>Continue with closure?';
            }

            confirmPopupData = {
                data: {
                    title: 'Warning - Charter closure',
                    text: popupText,
                    okButton: 'Yes',
                    cancelButton: 'Cancel',
                },
            }
        }

        return this.dialog.open(ConfirmationDialogComponent, confirmPopupData);
    }

    private getpopupText(status: number): string {
        let popupText: string = '';
        switch (status) {
            case CharterClosureStatus.InvoiceNotFinalized:
                popupText = ' is not final invoiced.<br/>';
                break;
            case CharterClosureStatus.UnpostedInvoice:
                popupText = ' has unposted invoices.<br/>';
                break;
            case CharterClosureStatus.NoBlDateUnrelizedTrade:
                popupText = ' is unrealized physicals. Make the Quantity 0 or change the shipping status to close it.<br/>';
                break;
            case CharterClosureStatus.UninvoicedCosts:
                popupText = ' has cost accrual.<br/>';
                break;
            case CharterClosureStatus.UncashmatchedCosts:
                popupText = ' has cash unmatched Invoice(s).<br/>'
                break;
            default:
                break;
        }
        return popupText;
    }

    private async checkLockStatusForAssignedTrades(sectionsAssigned: Section[]): Promise<any[]> {
        const lockedTrades: any[] = new Array();
        for (let i = 0; i < sectionsAssigned.length; i++) {
            const val = await this.lockService.isLockedContractAsync(sectionsAssigned[i].sectionId);
            if (val.isLocked) {
                lockedTrades.push({
                    contractLable: sectionsAssigned[i].contractLabel,
                    sectionId: sectionsAssigned[i].sectionId,
                    lockMessage: val.message,
                });
            }
        }
        return lockedTrades;
    }

    private closeSections(sectionsToClose: any[], charter: Charter) {
        const sectionIdsToClose = new Array();
        sectionsToClose.forEach((element) => {
            sectionIdsToClose.push(element.sectionId);
        });
        this.subscriptions.push(this.tradingService.closeSection(sectionIdsToClose, this.childFlag, this.dataVersionId)
            .subscribe((ok) => {
                if (ok) {
                    this.closeCharter(charter, sectionsToClose);
                }
            }));
    }

    private checkSectionClosureValidity(closeSectionModel: Section,
        invoiceModel: InvoiceMarkingSearchResult[]): number {

        let unpostedTradeInvoiceStatusList = invoiceModel.filter((invoice) => invoice.postingStatusId !== PostingStatus.Posted);
        let cashUnMatchedInvoiceTradeList = invoiceModel.filter((invoice) => invoice.cashMatchPercentage !== 100);

        const invoicePercentage = invoiceModel !== null || invoiceModel.length > 0 ? invoiceModel.reduce(function (a, b) { return a + b.invoicePercent; }, 0) : 0;
        const costFilteredByInvoiceStatus = closeSectionModel.costs.filter((cost) => cost.invoiceStatus === InvoicingStatus.Uninvoiced);

        if (invoiceModel.length > 0
            && invoicePercentage === 100
            && unpostedTradeInvoiceStatusList.length === 0
            && cashUnMatchedInvoiceTradeList.length === 0
            && (costFilteredByInvoiceStatus === null || costFilteredByInvoiceStatus.length === 0)) {
            return CharterClosureStatus.FullyInvoiced;
        }
        else if (closeSectionModel.quantity === 0 || closeSectionModel.contractInvoiceTypeId === ContractInvoiceType.Cancellation) {
            return CharterClosureStatus.ZeroQuantity;
        }
        else if (closeSectionModel.invoicingStatusId !== InvoicingStatus.Finalized) {
            return CharterClosureStatus.InvoiceNotFinalized;
        }
        else if (unpostedTradeInvoiceStatusList.length > 0) {
            return CharterClosureStatus.UnpostedInvoice;
        }
        else if (closeSectionModel.blDate === null ||
            closeSectionModel.blDate.toDateString() === this.defaultDate) {
            return CharterClosureStatus.NoBlDateUnrelizedTrade;
        }
        else if (costFilteredByInvoiceStatus.length > 0) {
            return CharterClosureStatus.UninvoicedCosts;
        }
        else if (unpostedTradeInvoiceStatusList.length === 0 && cashUnMatchedInvoiceTradeList.length > 0) {
            return CharterClosureStatus.UncashmatchedCosts;
        }
    }
    onNewCharterClicked() {
        this.router.navigate(['/' + this.company + '/execution/charter/new']);
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
        this.fabTitle = 'Charter Display FAB mini';
        this.fabType = FABType.MiniFAB;

        const actionItemEdit: FloatingActionButtonActions = {
            icon: 'edit',
            text: 'Edit Charter',
            action: 'editCharter',
            index: 0,
            disabled: false,
        };

        const actionItemNew: FloatingActionButtonActions = {
            icon: 'add',
            text: 'New Charter',
            action: 'newCharter',
            index: 1,
            disabled: false,
        };

        this.fabMenuActions.push(actionItemNew);
        this.fabMenuActions.push(actionItemEdit);
    }

    onFabActionClicked(action: string) {
        switch (action) {

            case 'newCharter': {
                this.onNewCharterClicked();
                break;
            }
            case 'editCharter': {
                this.onEditCharterClicked();
                break;
            }
        }
    }
}
