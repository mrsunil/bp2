import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FixPricedSection } from '../../../../shared/entities/fix-priced-section.entity';
import { FuturesOptionsPricedSection } from '../../../../shared/entities/futures-options-priced-section.entity';
import { Section } from '../../../../shared/entities/section.entity';
import { ContractStatus } from '../../../../shared/enums/contract-status.enum';
import { InvoiceTypes } from '../../../../shared/enums/invoice-type.enum';
import { InvoicingStatus } from '../../../../shared/enums/invoicing-status.enum';
import { SectionTypes } from '../../../../shared/enums/section-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { TradeActionsService } from '../../../services/trade-actions.service';
import { TrancheSplitGridComponent } from '../form-components/tranche-split-grid/tranche-split-grid.component';
import { AuthorizationService } from './../../../../core/services/authorization.service';
import { ChildSectionsSearchResult } from './../../../../shared/dtos/chilesection-search-result';

@Component({
    selector: 'atlas-physical-contract-capture-form-section-tab',
    templateUrl: './physical-contract-capture-form-section-tab.component.html',
    styleUrls: ['./physical-contract-capture-form-section-tab.component.scss'],
})
export class PhysicalContractCaptureFormSectionTabComponent extends BaseFormComponent implements OnInit, OnDestroy {
    sideNavOpened: number;

    disableCreateSplit: boolean = false;
    disableCreateTranche: boolean = false;
    disableTradeMerge: boolean = false;
    model: Section;
    company: string;
    isSnapshot = false;
    isCreateMode = true;
    toolTipSplit: string = '';
    toolTipTranche: string = '';
    toolTipMerge: string = '';
    @Input() childSectionsSearchResult: ChildSectionsSearchResult[];
    @Output() readonly newSplitTrancheSideNavEvent = new EventEmitter();
    @ViewChild('TranceSplitGridFormComponent') TranceSplitGridFormComponent: TrancheSplitGridComponent;

    formComponents: BaseFormComponent[] = [];
    trancheSplitPrivilege: boolean = false;

    constructor(private route: ActivatedRoute, protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected router: Router,
        protected tradeActionsService: TradeActionsService,
        protected tradingService: TradingService,
        protected securityService: SecurityService,
        protected authorizationService: AuthorizationService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        const dataVersionId = this.route.snapshot.params['dataVersionId'];
        if (dataVersionId) {
            this.isSnapshot = true;
        }
        this.subscriptions.push(
            this.tradeActionsService.trancheSectionSubject.subscribe(() => {
                this.onTrancheSideNavOpenClicked();
            }));

        this.subscriptions.push(
            this.tradeActionsService.splitSectionSubject.subscribe(() => {
                this.onSplitSideNavOpenClicked();
            }));

        this.formComponents.push(
            this.TranceSplitGridFormComponent);
        this.checkTradePrivilege();
    }

    checkTradePrivilege() {
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'Physicals')) {
                this.trancheSplitPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CreateTrancheSplit');
            }
        });

    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            tranceSplitGridFormComponent: this.TranceSplitGridFormComponent.getFormGroup(),
        });
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit: boolean): any {
        this.isCreateMode = false;
        this.formComponents.forEach((comp) => {
            entity = comp.initForm(entity, isEdit);
        });
        this.model = entity as FixPricedSection | FuturesOptionsPricedSection;
        if (this.model.quantity <= 0) {
            this.disableCreateSplit = true;
            this.toolTipSplit = 'Contract cannot be splitted when quantity is equal to 0';
        }
        if (this.model.quantity <= 0) {
            this.disableCreateTranche = true;
            this.toolTipTranche = 'Contract cannot be tranched when quantity is equal to 0';
        }
        if (this.model.allocatedToId != null) {
            this.disableCreateTranche = true;
            this.toolTipTranche = 'Contract cannot be tranched when it is allocated';
        }
        if (this.model.allocatedTo &&
            this.model.invoiceReference &&
            this.model.invoiceTypeId === InvoiceTypes.Washout &&
            this.model.invoicingStatusId === InvoicingStatus.Finalized &&
            this.model.allocatedTo.invoicingStatusId === InvoicingStatus.Finalized) {
            this.disableCreateSplit = true;
            this.toolTipSplit = 'Contract cannot be splitted when it is allocated and Washout Invoiced';
        }
        if (this.model.sectionId && this.model.dataVersionId) {
            this.subscriptions.push(
                this.tradingService.getContextualDataForContractMerge(this.model.sectionId, this.model.dataVersionId).subscribe((data) => {
                    if (data) {
                        this.disableTradeMerge = !(data.isAllowed);
                        this.toolTipMerge = data.message;
                    }
                }));
        }
        if ((this.model.quantity > 0) && (this.model.isClosed)) {
            this.disableCreateSplit = true;
            this.disableCreateTranche = true;
        }
        return entity;
    }

    onTrancheSideNavOpenClicked() {
        this.sideNavOpened = SectionTypes.Tranche;
        this.newSplitTrancheSideNavEvent.emit(this.sideNavOpened);
    }

    onSplitSideNavOpenClicked() {
        this.sideNavOpened = SectionTypes.Split;
        this.newSplitTrancheSideNavEvent.emit(this.sideNavOpened);
    }

    contractStatusChanged(contractStatus: ContractStatus) {
        this.TranceSplitGridFormComponent.contractStatusChanged(contractStatus);
    }

    onTabSelected() {
        this.TranceSplitGridFormComponent.onTabActive();
    }

    onMergeButtonClicked() {
        this.router.navigate(['/' + this.company + '/trades/tradeMerge/'
            + encodeURIComponent(String(this.model.sectionId))]);
    }

}
