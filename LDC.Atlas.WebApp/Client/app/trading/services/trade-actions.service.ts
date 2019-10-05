import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthorizationService } from '../../core/services/authorization.service';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { TradePropertyPrivilege } from '../../shared/entities/trade-property-privilege.entity';
import { PermissionLevels } from '../../shared/enums/permission-level.enum';
import { SecurityService } from '../../shared/services/security.service';
import { SectionReference } from '../entities/section-reference';
import { SectionTabIndex } from '../entities/section-tab-index';
@Injectable({
    providedIn: 'root',
})

export class TradeActionsService {
    public newTradeSubject = new Subject();
    public editSectionSubject = new Subject();
    public displaySectionSubject = new Subject();
    public newTradeInSnapshotSubject = new Subject();
    public editSectionInSnapshotSubject = new Subject();
    public displaySectionInSnapshotSubject = new Subject();
    public displaySectionAfterEditSubject = new Subject();

    public approveSectionSubject = new Subject();
    public unApproveSectionSubject = new Subject();
    public splitSectionSubject = new Subject();
    public trancheSectionSubject = new Subject();
    public deleteSectionSubject = new Subject();

    public reOpenSectionSubject = new Subject();
    public closeSectionSubject = new Subject();
    public cancelSectionSubject = new Subject();

    public allocateSectionSubject = new Subject();
    public allocateSectionInSnapshotSubject = new Subject();
    public deallocateSectionSubject = new Subject();

    public contractAdviceSubject = new Subject();

    public tradeImageSubject = new Subject();
    public tradeEditImageSubject = new Subject();

    public tradeGroupFunctionsSubject = new Subject();

    public tradeSaveAsFavouriteSubject = new Subject();
    public tradeSaveAsFavouriteEditSubject = new Subject();

    public reverseCancelSectionSubject = new Subject();

    constructor(private companyManager: CompanyManagerService,
        private router: Router,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService) {

        // -- Basic

        this.newTradeSubject.subscribe(() => {
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/capture']);
        });

        this.editSectionSubject.subscribe((sectionInformation: SectionTabIndex) => {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/edit',
            sectionInformation.sectionId, sectionInformation.tabIndex]);
        });

        this.displaySectionSubject.subscribe((sectionId: number) => {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/display', sectionId]);
        });

        this.displaySectionAfterEditSubject.subscribe((sectionTabIndex: SectionTabIndex) => {
            const sectionId = sectionTabIndex.sectionId;
            const tabIndex = sectionTabIndex.tabIndex;
            if (!sectionId || tabIndex < 0) { return; }
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/display', sectionId, tabIndex]);
        });

        // -- Snapshot

        this.newTradeInSnapshotSubject.subscribe((dataVersionId: number) => {
            if (!dataVersionId) { return; }
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/snapshot/'
                + dataVersionId + '/capture']);
        });

        this.editSectionInSnapshotSubject.subscribe((data: SectionReference) => {
            const sectionId = data.sectionId;
            const dataVersionId = data.dataVersionId;

            if (!sectionId || !dataVersionId) { return; }
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/snapshot/'
                + dataVersionId + '/edit', sectionId, data.selectedTab]);
        });

        this.displaySectionInSnapshotSubject.subscribe((data: SectionReference) => {
            const sectionId = data.sectionId;
            const dataVersionId = data.dataVersionId;

            if (!sectionId || !dataVersionId) { return; }
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/snapshot/'
                + dataVersionId + '/display', sectionId]);
        });

        // -- Allocation

        this.allocateSectionSubject.subscribe((sectionId: number) => {
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/allocateTrade', sectionId]);
        });

        this.allocateSectionInSnapshotSubject.subscribe((data: SectionReference) => {
            const sectionId = data.sectionId;
            const dataVersionId = data.dataVersionId;

            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/snapshot/'
                + dataVersionId + '/allocateTrade', sectionId]);
        });

        // -- Document Generation

        this.contractAdviceSubject.subscribe((sectionId: number) => {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/execution/document/generation/contractadvice/'
                    + sectionId],
            );
        });

        // -- Trade Image Edit

        this.tradeEditImageSubject.subscribe((sectionId: number) => {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/trades/display', sectionId],
                {
                    queryParams:
                    {
                        showTradeImage: true,
                    },
                    skipLocationChange: true,
                });
        });

        // Edit For Trade Save As Favourite
        this.tradeSaveAsFavouriteEditSubject.subscribe((sectionId: number) => {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/trades/display', sectionId],
                {
                    queryParams:
                    {
                        showSaveTradeAsFavourite: true,
                    },
                    skipLocationChange: true,
                });
        });

        this.tradeGroupFunctionsSubject.subscribe(() => {
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/groupfunctions']);
        });
    }

    public getTradePropertyPrivileges(): TradePropertyPrivilege {
        const company: string = this.companyManager.getCurrentCompanyId();
        const privilege: TradePropertyPrivilege = new TradePropertyPrivilege();
        this.securityService.isSecurityReady().subscribe(() => {
            privilege.hasSuperTradePrivilege = this.authorizationService.getPermissionLevel(
                company, 'Trades', 'Physicals', 'SuperTradeEdition') > PermissionLevels.None;
            privilege.invoicingStatusPrivilege = this.authorizationService.getPermissionLevel(
                company, 'Invoices', 'InvoiceCreation', 'EditInvoicingMarkingStatus') > PermissionLevels.None;
            if (this.authorizationService.isPrivilegeAllowed(company, 'Trades') &&
                this.authorizationService.isPrivilegeAllowed(company, 'TrafficTab')) {
                privilege.vesselNamePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'VesselName');
                privilege.blDatePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'BlDate');
                privilege.blReferencePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'BlReference');
            }

            if (this.authorizationService.isPrivilegeAllowed(company, 'Trades') &&
                this.authorizationService.isPrivilegeAllowed(company, 'MainTab')) {
                privilege.buyerCodePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'BuyerCode');
                privilege.sellerCodePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'SellerCode');
                privilege.commodityPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'Commodity');
                privilege.counterPartyPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'CounterPartyReference');
                privilege.cropYearPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'CropYear');
                privilege.quantityCodePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'QuantityCode');
                privilege.quantityPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'Quantity');
                privilege.quantityContractedPrivilege =
                    this.authorizationService.isPrivilegeAllowed(company, 'QuantityContracted');
                privilege.contractTermsPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'ContractTerms');
                privilege.portTermsPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PortTerms');
                privilege.arbitrationPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'Arbitration');
                privilege.currencyPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'Currency');
                privilege.priceCodePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PriceCode');
                privilege.contractPricePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'ContractPrice');
                privilege.contractValuePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'ContractValue');
                privilege.paymentTermsPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PaymentTerms');
                privilege.periodTypePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PeriodType');
                privilege.fromDatePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'FromDate');
                privilege.toDatePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'ToDate');
                privilege.positionTypePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PositionType');
                privilege.portOfOriginPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PortOfOrigin');
                privilege.portOfDestinationPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'PortOfDestination');
                privilege.businessSectorPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'MarketSector');
                privilege.memoPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'InternalMemorandum');
            }
            if (this.authorizationService.isPrivilegeAllowed(company, 'Trades') &&
                this.authorizationService.isPrivilegeAllowed(company, 'StatusTab')) {
                privilege.contractIssuedOnPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'ContractIssuedOn');
                privilege.otherReferencePrivilege = this.authorizationService.isPrivilegeAllowed(company, 'OtherReference');
            }
        });
        return privilege;
    }

}
