import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material'
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component'
import { CharterSelectionBulkClosureComponent } from './charter-selection-bulk-closure/charter-selection-bulk-closure.component';
import { Charter } from '../../../../shared/entities/charter.entity';
import { CharterBulkClosureMatrixComponent } from './charter-bulk-closure-matrix/charter-bulk-closure-matrix.component';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { Subscription, Subject } from 'rxjs';
import { CharterBulkClosure } from '../../../../shared/entities/charter-bulk-closure.entity';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { Section } from '../../../../shared/entities/section.entity';
import { InvoiceMarkingSearchResult } from '../../../../shared/dtos/invoice-marking';
import { PostingStatus } from '../../../../shared/enums/posting-status.enum';
import { InvoicingStatus } from '../../../../shared/enums/invoicing-status.enum';
import { ContractInvoiceType } from '../../../../shared/enums/contract-invoice-type.enum';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { map, takeUntil } from 'rxjs/operators';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { CharterBulkClosureSummaryComponent } from './charter-bulk-closure-summary/charter-bulk-closure-summary.component';
import { CharterClosureStatus } from '../../../../shared/enums/charter-closure-status.enum';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity'

@Component({
    selector: 'atlas-execution-charter-bulk-closure-function',
    templateUrl: './execution-charter-bulk-closure-function.component.html',
    styleUrls: ['./execution-charter-bulk-closure-function.component.scss']
})
export class ExecutionCharterBulkClosureFunctionComponent implements OnInit, OnDestroy {

    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('chartersSelected') chartersSelected: CharterSelectionBulkClosureComponent;
    @ViewChild('charterBulkClosureMatrix') charterBulkClosureMatrix: CharterBulkClosureMatrixComponent;
    @ViewChild('charterBulkClosureSummary') charterBulkClosureSummary: CharterBulkClosureSummaryComponent

    isChartersNextDisabled: boolean = true;
    isCharterConfirmClosureDisabled: boolean = true;
    selectedCharterIds: number[] = [];
    closureCharterIds: number[] = [];
    charterBulkClosure: CharterBulkClosure[];
    isLoading = false;
    assigneSectionIds: number[] = [];
    closureSectionIds: number[] = [];
    defaultDate = 'Mon Jan 01 0001';
    currentStep: number = 0;
    chartersForBulkClosure: CharterBulkClosure[] = [];
    chartersLength: number;
    selectChartersForSummaryScreen: CharterBulkClosure[] = [];
    isCharterCloseGridReady: boolean = false;
    subscriptions: Subscription[] = [];

    destroy$ = new Subject();
    step: number = 1;

    constructor(private router: Router, private companyManager: CompanyManagerService,
        protected dialog: MatDialog, protected executionService: ExecutionService, protected tradingService: TradingService,
        protected lockService: LockService) { }

    ngOnInit() {

    }
    onCharterSelectionPreviousButtonClicked() {
        this.router.navigate([this.companyManager.getCurrentCompanyId() + '/execution/charter/groupfunctions']);
    }

    discardButtonDialog() {
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
                window.location.reload();
            }
        });
    }

    onCharterSelectionNextButtonClicked() {
        const selectedCharters = this.chartersSelected.selectedCharterForBulkFunctions as Charter[];
        this.chartersLength = selectedCharters.length;
        this.selectedCharterIds = [];
        this.selectedCharterIds = selectedCharters.map((element) => {
            return element.charterId
        });

        if (this.selectedCharterIds) {
            this.executionService.getAssignedSectionsForCharterList(this.selectedCharterIds)
                .subscribe((data: CharterBulkClosure[]) => {
                    if (data) {
                        this.charterBulkClosure = data;
                        this.charterBulkClosure.forEach((charter) => {
                            this.checkCharterLocked(charter);
                        });
                        this.step = 2;
                        this.stepper.next();
                    }

                });
        } else {
            return '';
        }
    }


    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    onCharterSelectionDiscardButtonClicked() {
        if (!this.isChartersNextDisabled) {
            this.discardButtonDialog();

        }
        else {
            window.location.reload();
        }
    }

    onCharterSelected(charterSelected: boolean) {
        if (charterSelected) {
            this.isChartersNextDisabled = false
        }
        else {
            this.isChartersNextDisabled = true;
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification(event) {
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    ngOnDestroy(): void {

        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }


    checkCharterLocked(charter: CharterBulkClosure) {
        this.lockService.isLockedCharter(charter.charterId).pipe(
            takeUntil(this.destroy$),
        ).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                charter.category = 'red'
                charter.message = 'Charter is Already Blocked';
                this.checkTradeAvailableForClosure(charter);
            }
            else {
                this.subscriptions.push(this.lockService.lockCharter(charter.charterId, LockFunctionalContext.CharterBulkClosure).pipe(
                    takeUntil(this.destroy$),
                ).subscribe(
                    (data) => {
                        this.checkTradeAvailableForClosure(charter);
                    }
                )
                )

            }
        });
    }

    checkTradeAvailableForClosure(charter: CharterBulkClosure) {
        let charterForClose = new CharterBulkClosure();
        charterForClose.charterId = charter.charterId;
        charterForClose.charterCode = charter.charterCode;
        charterForClose.dataVersionId = charter.dataVersionId;
        charterForClose.statusId = charter.statusId;
        charterForClose.category = charter.category ? charter.category : 'green';
        charterForClose.message = charter.message ? charter.message : '';
        charterForClose.description = charter.description;
        charterForClose.vesselName = charter.vesselName;
        charterForClose.sectionsAssigned = [];
        if (charter.sectionsAssigned.length > 0) {
            this.tradingService.getAssigedSectionDetailsToCloseCharter(charter.sectionsAssigned.map((s) => s.sectionId))
                .subscribe((data) => {
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            charterForClose.sectionsAssigned.push(charter.sectionsAssigned.find((x) => x.sectionId == data[i].sectionId));
                            this.lockService.isLockedContract(data[i].sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {

                                if (lock.isLocked) {
                                    charterForClose.sectionsAssigned[i].category = 'red';
                                    charterForClose.sectionsAssigned[i].message = 'Locked by ' + lock.message.split(' ')[7];
                                    charterForClose.category = 'red'
                                }
                                else {
                                    this.subscriptions.push(this.lockService.lockContract(data[i].sectionId, LockFunctionalContext.CharterBulkClosure).subscribe((res) => { }));
                                    const validityStatus = this.checkSectionClosureValidity(data[i], data[i].invoices);
                                    switch (validityStatus) {
                                        case CharterClosureStatus.FullyInvoiced:
                                        case CharterClosureStatus.CancelledShipping:
                                        case CharterClosureStatus.ZeroQuantity:
                                            charterForClose.sectionsAssigned[i].category = 'green';
                                            break;
                                        case CharterClosureStatus.UnpostedInvoice:
                                            charterForClose.sectionsAssigned[i].category = 'red';
                                            charterForClose.sectionsAssigned[i].message = 'Invoices not posted';
                                            charterForClose.category = 'red';
                                            break;
                                        case CharterClosureStatus.InvoiceNotFinalized:
                                            charterForClose.sectionsAssigned[i].category = 'red';
                                            charterForClose.sectionsAssigned[i].message = 'Cargo Accrual';
                                            charterForClose.category = 'red';
                                            break;
                                        case CharterClosureStatus.NoBlDateUnrelizedTrade:
                                            charterForClose.sectionsAssigned[i].category = 'red';
                                            charterForClose.sectionsAssigned[i].message = 'No BL date, Unrealized Contract';
                                            charterForClose.category = 'red';
                                            break;
                                        case CharterClosureStatus.UninvoicedCosts:
                                            charterForClose.sectionsAssigned[i].category = 'orange';
                                            charterForClose.sectionsAssigned[i].message = 'Cost Accrual';
                                            if (charterForClose.category != 'red') {
                                                charterForClose.category = 'orange'
                                            }
                                            break;
                                        case CharterClosureStatus.UncashmatchedCosts:
                                            charterForClose.sectionsAssigned[i].category = 'orange';
                                            charterForClose.sectionsAssigned[i].message = 'Invoices not cash matched';
                                            if (charterForClose.category != 'red') {
                                                charterForClose.category = 'orange';
                                            }
                                            break;
                                    }
                                }
                                if (i + 1 === data.length) {
                                    this.chartersForBulkClosure.push(charterForClose);

                                }
                            });
                        }
                    }
                    else {
                        this.chartersForBulkClosure.push(charterForClose);
                    }
                });
        }
        else {
            this.chartersForBulkClosure.push(charterForClose);
        }
    }


    checkSectionClosureValidity(closeSectionModel: Section,
        invoiceModel: InvoiceMarkingSearchResult[]): CharterClosureStatus {
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
        else if (closeSectionModel.blDate === null ||
            closeSectionModel.blDate.toDateString() === this.defaultDate) {
            return CharterClosureStatus.NoBlDateUnrelizedTrade;
        }
        else if (closeSectionModel.invoicingStatusId !== InvoicingStatus.Finalized) {
            return CharterClosureStatus.InvoiceNotFinalized;
        }
        else if (unpostedTradeInvoiceStatusList.length > 0) {
            return CharterClosureStatus.UnpostedInvoice;
        }
        else if (costFilteredByInvoiceStatus.length > 0) {
            return CharterClosureStatus.UninvoicedCosts;
        }
        else if (unpostedTradeInvoiceStatusList.length === 0 && cashUnMatchedInvoiceTradeList.length > 0) {
            return CharterClosureStatus.UncashmatchedCosts;
        }
    }

    onBulkClosureConfirmButtonClicked() {
        this.charterClosureSelected();
    }

    charterClosureSelected() {
        const selectedChartersForClosure = this.charterBulkClosureMatrix.chartersForConfirmClosure as CharterBulkClosure[];
        this.closureCharterIds = selectedChartersForClosure.map((charter) => charter.charterId);
        this.closureSectionIds = [];
        selectedChartersForClosure.filter((element) => {
            if (element.sectionsAssigned) {
                element.sectionsAssigned.filter((section) => {
                    this.closureSectionIds.push(section.sectionId);
                })

            }
        });
        if (this.closureSectionIds.length > 0) {
            this.tradingService.closeSection(this.closureSectionIds).subscribe((ok) => {
                if (ok) {
                    this.executionService.closeCharter(this.closureCharterIds).subscribe((closedCharters: CharterBulkClosure[]) => {
                        if (closedCharters) {
                            this.selectChartersForSummaryScreen = closedCharters
                            this.charterBulkClosureSummary.charterForClosureSummary(this.selectChartersForSummaryScreen);
                            this.stepper.next();
                        }
                    });
                }
            })
        }


        else {
            this.executionService.closeCharter(this.closureCharterIds).subscribe((closedCharters: CharterBulkClosure[]) => {
                if (closedCharters) {
                    this.selectChartersForSummaryScreen = closedCharters
                    this.charterBulkClosureSummary.charterForClosureSummary(this.selectChartersForSummaryScreen);
                    this.stepper.next();
                }
            })
        }


    }

    onClosureMatrixPreviousButtonClicked() {
        this.stepper.previous();
        this.chartersForBulkClosure = [];
        this.charterBulkClosureMatrix.isGridReady = false;
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    onClosureMatrixDiscardButtonClicked() {
        if (!this.isCharterConfirmClosureDisabled) {
            this.discardButtonFromDetailsStepperDialog()
        }
        else {
            this.lockService.cleanSessionLocks().subscribe(() => {
            });
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/execution/charter']);

        }
    }

    onCharterClose(charterForClosure: boolean) {
        if (charterForClosure) {
            this.isCharterConfirmClosureDisabled = false;
        }
        else {
            this.isCharterConfirmClosureDisabled = true;
        }
    }

    onCharterCloseGridReady(isCharterCloseGridReady: boolean) {
        this.isCharterCloseGridReady = true;
    }

    onFinishButtonClicked() {
        this.router.navigate([this.companyManager.getCurrentCompanyId() + '/execution/charter']);
    }

    discardButtonFromDetailsStepperDialog() {
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

                this.lockService.cleanSessionLocks().subscribe(() => {
                });
                this.router.navigate([this.companyManager.getCurrentCompanyId() + '/execution/charter']);

            }
        });
    }

}
