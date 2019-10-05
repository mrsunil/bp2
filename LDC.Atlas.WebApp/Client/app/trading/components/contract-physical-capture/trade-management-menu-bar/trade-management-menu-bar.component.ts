import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PhysicalDocumentTemplate } from '../../../../shared/entities/document-template.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { Section } from '../../../../shared/entities/section.entity';
import { ContractStatus } from '../../../../shared/enums/contract-status.enum';
import { InvoiceTypes } from '../../../../shared/enums/invoice-type.enum';
import { InvoicingStatus } from '../../../../shared/enums/invoicing-status.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { DocumentService } from '../../../../shared/services/http-services/document.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { TradeActionsService } from '../../../services/trade-actions.service';
import { TradeCostReportComponent } from '../../trade-cost-report/trade-cost-report.component';
import { TradePnlReportComponent } from '../../trade-pnl-report/trade-pnl-report.component';
import { AuthorizationService } from './../../../../core/services/authorization.service';
import { GenericReportViewerComponent } from './../../../../shared/components/generic-report-viewer/generic-report-viewer.component';
import { Company } from './../../../../shared/entities/company.entity';
import { PermissionLevels } from './../../../../shared/enums/permission-level.enum';
import { SectionReference } from './../../../entities/section-reference';

@Component({
    selector: 'atlas-trade-management-menu-bar',
    templateUrl: './trade-management-menu-bar.component.html',
    styleUrls: ['./trade-management-menu-bar.component.scss'],
})
export class TradeManagementMenuBarComponent extends BaseFormComponent implements OnInit {

    @Input() currentSection: Section = undefined;
    @Input() index: number;
    @Input() menuDisable: boolean = undefined;
    @Input() isClosed: boolean = undefined;
    @Output() readonly showDiscard = new EventEmitter<any>();
    @Output() readonly showSave = new EventEmitter<any>();
    @Input() isIntercoCounterparty: boolean;
    @Output() readonly manualIntercoCreation = new EventEmitter<any>();
    @Input() companiesForInterco: Company[];
    isApproved = false;
    isContractWithBLDate = false;
    company: string;
    physicalContractId: number;
    dataVersionId: number;
    contractSectionCode: number;
    disableCreateSplit: boolean = false;
    disableCreateTranche: boolean = false;
    disableAllocateButton: boolean = false;
    disableTradeMerge: boolean = false;
    hasDocumentPrivilege = false;
    isInvoiced = false;
    hasSuperEditionPrivilege = false;
    toolTipSplit: string = '';
    toolTipTranche: string = '';
    toolTipAllocate: string = '';
    toolTipMerge: string = '';
    // //filteredTemplates: PhysicalDocumentTemplate[] = [];
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();

    ContractStatus = ContractStatus;
    tradeApprovalPrivilege: boolean = false;
    tradeClosePrivilege: boolean = false;
    isMenuBarVisible: boolean = true;
    isTradeCancellationAllowed: boolean = false;
    blockerMessageForCancellingOfTrade: string = '';
    isCancelledSection: boolean = false;
    trancheSplitPrivilege: boolean = false;

    constructor(protected tradeActionsService: TradeActionsService,
        protected router: Router,
        private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected lockService: LockService,
        protected dialog: MatDialog,
        protected authorizationService: AuthorizationService,
        protected tradingService: TradingService,
        protected documentService: DocumentService,
        protected securityService: SecurityService) {
        super(formConfigurationProvider);
    }
    ngOnInit() {
        if (this.currentSection.isClosed === true && (this.router.url.indexOf('/trades/image/') === -1) && (this.router.url !== '/' + this.route.snapshot.params['company']
            + '/trades/display/' + this.currentSection.sectionId)) {
            if (!this.currentSection.dataVersionId) {
                this.router.navigate(['/' + this.route.snapshot.params['company']
                    + '/trades/display', this.currentSection.sectionId]);
            }
        }
        const documentType = 76;
        this.documentService.getTemplates(documentType, 'Trades').subscribe((templates) => {
            this.filteredTemplates = templates.value;
        });
        this.company = this.route.snapshot.params['company'];
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.hasDocumentPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'Documents');
        this.hasSuperEditionPrivilege = this.authorizationService.getPermissionLevel(
            this.company, 'Trades', 'Physicals', 'SuperTradeEdition') > PermissionLevels.None;
        if (this.currentSection.status === ContractStatus.Approved) {
            this.isApproved = true;
        }
        // if (this.route.snapshot.url[0].path === "edit") {
        //     this.isMenuBarVisible = true;
        // }
        if (this.currentSection.isClosed === true) {
            this.isClosed = true;
        }
        if (this.currentSection.allocatedToId && this.currentSection.allocatedToId !== 0
            && this.currentSection.blDate) {
            this.isContractWithBLDate = true;
        }
        if (this.currentSection.invoiceReference) {
            this.isInvoiced = true;
        }

        if (this.currentSection.quantity <= 0) {
            this.disableCreateSplit = true;
            this.toolTipSplit = 'Contract cannot be splitted when quantity is equal to 0';
            this.disableCreateTranche = true;
            this.toolTipTranche = 'Contract cannot be tranched when quantity is equal to 0';
            this.disableAllocateButton = true;
            this.toolTipAllocate = 'Contract cannot be allocated when quantity is equal to 0';
        }
        if (this.currentSection.allocatedToId != null) {
            this.disableCreateTranche = true;
            this.toolTipTranche = 'Contract cannot be tranched when it is allocated';
        }

        if (this.currentSection.allocatedTo &&
            this.currentSection.invoiceReference &&
            this.currentSection.invoiceTypeId === InvoiceTypes.Washout &&
            this.currentSection.invoicingStatusId === InvoicingStatus.Finalized &&
            this.currentSection.allocatedTo.invoicingStatusId === InvoicingStatus.Finalized) {
            this.disableCreateSplit = true;
            this.toolTipSplit = 'Contract cannot be splitted when it is allocated and Washout Invoiced';
        }
        if (this.currentSection.isCancelled) {
            this.isCancelledSection = true;
            this.disableCreateSplit = true;
            this.disableCreateTranche = true;
        }
        if (this.currentSection.isClosed) {
            this.disableCreateSplit = true;
            this.disableCreateTranche = true;
        }

        if (this.currentSection.sectionId && this.currentSection.dataVersionId) {
            this.subscriptions.push(
                this.tradingService.getContextualDataForContractMerge(this.currentSection.sectionId, this.currentSection.dataVersionId).subscribe((data) => {
                    if (data) {
                        this.disableTradeMerge = !(data.isAllowed);
                        this.toolTipMerge = data.message;
                    }
                }));
        }
        this.isMenuBarVisible = false;
        this.checkTradePrivilege();
        this.isCancellationOfTradeAllowed();
    }

    // Contract Menu
    onSplitButtonClicked() {
        this.tradeActionsService.splitSectionSubject.next();
    }

    onTranchButtonClicked() {
        this.tradeActionsService.trancheSectionSubject.next();
    }

    onMergeButtonClicked() {
        this.router.navigate(['/' + this.company + '/trades/tradeMerge/'
            + encodeURIComponent(String(this.currentSection.sectionId))]);
    }

    onAllocateButtonClicked() {
        if (this.dataVersionId) {
            this.tradeActionsService.allocateSectionInSnapshotSubject
                .next(new SectionReference(this.currentSection.sectionId, this.dataVersionId));
        } else {
            this.tradeActionsService.allocateSectionSubject.next(this.currentSection.sectionId);
        }
    }

    OnReportClick(data: any) {

        const openTradepnlReportDialog = this.dialog.open(GenericReportViewerComponent, {
            data:
            {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });

    }

    onDeallocateButtonClicked() {
        this.tradeActionsService.deallocateSectionSubject.next(this.currentSection.sectionId);
    }

    onApproveButtonClicked() {

        this.subscriptions.push(this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.approveSectionSubject.next(this.currentSection.sectionId);
            }
        }));
    }

    onUnApproveButtonClicked() {
        this.subscriptions.push(this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.unApproveSectionSubject.next(this.currentSection.sectionId);
            }
        }));
    }

    onDeleteButtonClicked() {
        this.subscriptions.push(this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.deleteSectionSubject.next(this.currentSection.sectionId);
            }
        }));
    }

    onReOpenButtonClicked() {
        this.subscriptions.push(this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.reOpenSectionSubject.next(this.currentSection.sectionId);
            }
        }));
    }

    onCloseButtonClicked() {
        this.subscriptions.push(this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.closeSectionSubject.next(this.currentSection.sectionId);
            }
        }));
    }

    onGenerateDocumentButtonClicked() {
        this.router.navigate(
            [this.companyManager.getCurrentCompanyId() + '/execution/document/generation/contractadvice', this.currentSection.sectionId],
        );
    }

    onSeeDocumentButtonClicked() {
        this.menuDisable = true;
        this.router.navigate(
            [this.companyManager.getCurrentCompanyId() + '/execution/document/list/', 'section', this.currentSection.sectionId],
        );
    }

    onImageButtonClicked() {
        this.tradeActionsService.tradeImageSubject.next(this.currentSection.sectionId);
    }

    onSaveAsFavoriteClicked() {
        this.tradeActionsService.tradeSaveAsFavouriteSubject.next(this.currentSection.sectionId);
    }

    contractStatusChanged(contractStatus: ContractStatus) {
        this.isApproved = true;
        this.currentSection.status = contractStatus;
        this.isCancellationOfTradeAllowed();
    }

    updateDeallocationInfo() {
        this.currentSection.allocatedTo = null;
        this.tradeActionsService.displaySectionSubject.next(this.currentSection.sectionId);
    }

    onviewPLButtonClicked() {
        const openTradepnlReportDialog = this.dialog.open(TradePnlReportComponent, {
            data:
            {
                contractSectionCode: this.currentSection.contractLabel,
                dataVersionId: this.dataVersionId,
            },
            width: '90%',
            height: '90%',
        });
    }

    onTradeCostClicked() {
        const openTradepnlReportDialog = this.dialog.open(TradeCostReportComponent, {
            data:
            {
                sectionId: this.route.snapshot.paramMap.get('sectionId'),
                contractStatus: this.currentSection.status,
                dataVersionId: this.dataVersionId,
            },
            width: '90%',
            height: '90%',
        });
    }

    checkTradePrivilege() {
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'Physicals')) {
                this.tradeApprovalPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ApproveTrade');
                this.tradeClosePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CloseTrade');
                this.trancheSplitPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CreateTrancheSplit');
            }
        });

    }

    hasAllocation(): boolean {
        if (this.currentSection.allocatedTo) {
            return true;
        }
        return false;
    }

    onDiscardButtonClicked() {
        this.showDiscard.emit();
    }

    isIntercoCreationIsAllowed(): boolean {
        let isManualInterco = true;
        if (!this.currentSection.isInterCo && this.currentSection.invoicingStatusId === InvoicingStatus.Uninvoiced
            && !this.currentSection.sectionOriginId && this.isIntercoCounterparty) {
            isManualInterco = false;
        }
        return isManualInterco;
    }

    onIntercoTradeCreation() {
        this.manualIntercoCreation.emit(true);
    }
    onCancelButtonClicked() {
        this.subscriptions.push(this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.cancelSectionSubject.next(this.currentSection.sectionId);
            }
        }));

    }

    isCancellationOfTradeAllowed() {
        if (this.currentSection.status === ContractStatus.Approved) {
            if (this.currentSection.invoicingStatusId !== InvoicingStatus.Uninvoiced) {
                this.isTradeCancellationAllowed = false;
                this.blockerMessageForCancellingOfTrade = `Not Allowed ${this.currentSection.contractLabel} is Invoiced`;

            } else if (this.currentSection.allocatedTo) {
                this.isTradeCancellationAllowed = false;
                this.blockerMessageForCancellingOfTrade = `Not Allowed ${this.currentSection.contractLabel} is allocated To ${this.currentSection.allocatedTo.contractLabel}`;
            } else if (this.currentSection.blDate) {
                this.isTradeCancellationAllowed = false;
                this.blockerMessageForCancellingOfTrade = `Not Allowed ${this.currentSection.contractLabel} has a BL Date`;
            } else {
                this.isTradeCancellationAllowed = true;
                this.blockerMessageForCancellingOfTrade = '';
            }

        }
        if (this.currentSection.status === ContractStatus.Unapproved) {
            this.isTradeCancellationAllowed = false;
            this.blockerMessageForCancellingOfTrade = `Only Approved Trade Can be Cancelled`;
        }
        if (this.currentSection.isCancelled) {
            this.isTradeCancellationAllowed = false;
            this.blockerMessageForCancellingOfTrade = `Already Cancelled Trade`;
        }
    }

    onReverseCancelButtonClicked() {
        this.lockService.isLockedContract(this.currentSection.sectionId).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.tradeActionsService.reverseCancelSectionSubject.next(this.currentSection.sectionId);
            }
        });
    }

}
