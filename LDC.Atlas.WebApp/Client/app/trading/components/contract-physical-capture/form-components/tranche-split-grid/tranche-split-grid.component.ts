import { Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Observable, of, Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ListAndSearchComponent } from '../../../../../shared/components/list-and-search/list-and-search.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { Section } from '../../../../../shared/entities/section.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { ListAndSearchFilterType } from '../../../../../shared/enums/list-and-search-filter-type.enum';
import { PositionMonthTypes } from '../../../../../shared/enums/position-month-type.enum';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { ChildSectionsDataLoader } from '../../../../../shared/services/list-and-search/childSections-data-loader';
import { UtilService } from '../../../../../shared/services/util.service';
import { InvoiceStatusComponent } from '../../invoice-marking-tab/components/invoice-status/invoice-status.component';
import { AllocationInfoFormComponentComponent } from '../allocation-info-form-component/allocation-info-form-component.component';
import { InvoicingFormComponentComponent } from '../invoicing-form-component/invoicing-form-component.component';
import { ChildSectionsSearchResult } from './../../../../../shared/dtos/chilesection-search-result';
import { MasterData } from './../../../../../shared/entities/masterdata.entity';
import { ContractStatus } from './../../../../../shared/enums/contract-status.enum';
import { PricingMethods } from './../../../../../shared/enums/pricing-method.enum';
import { TradeActionsService } from './../../../../services/trade-actions.service';

@Component({
    selector: 'atlas-tranche-split-grid',
    providers: [ChildSectionsDataLoader],
    templateUrl: './tranche-split-grid.component.html',
    styleUrls: ['./tranche-split-grid.component.scss'],
})
export class TrancheSplitGridComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    @ViewChild('invoiceStatusComponent') invoiceStatusComponent: InvoiceStatusComponent;
    @ViewChild('invoiceFormComponent') invoiceFormComponent: InvoicingFormComponentComponent;
    @ViewChild('allocationInfoComponent') allocationInfoComponent: AllocationInfoFormComponentComponent;

    @Input() childSectionsSearchResult: ChildSectionsSearchResult[];

    gridCode = 'tradeChildSectionListGrid';
    additionalFilters: ListAndSearchFilter[] = [];
    isFilterDisplay: boolean = false;

    company: string;
    searchForm: FormGroup;
    dataLength = 0;
    isLoading: boolean = true;
    searchTerm: string;
    masterdata: MasterData;
    searchValueCtrl = new AtlasFormControl('SearchTrade');
    toggleClicked: boolean = false;
    contractStatus: string = null;

    gridOptions: agGrid.GridOptions = {};
    gridColumns: agGrid.ColDef[];
    autoGroupColumnDef: agGrid.ColDef[];
    trancheAndSplitRows: Section[];
    childSections: Section[];

    private getSectionSubscription: Subscription;

    componentId: string = 'trancheSplitList';
    sectionId: number;
    parentModel: Section;
    dataVersionId: number;

    gridContext: TrancheSplitGridComponent;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        private companyManager: CompanyManagerService,
        protected utilService: UtilService,
        protected router: Router,
        private route: ActivatedRoute,
        protected tradingService: TradingService,
        public dataLoader: ChildSectionsDataLoader,
        protected tradeActionsService: TradeActionsService,
        protected ngZone: NgZone,
        private gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.masterdata = this.route.snapshot.data.masterdata;
        this.gridContext = this;
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        // Override getData because data is already loaded
        this.dataLoader.getData = this.getData.bind(this);

        const filter = new ListAndSearchFilter();
        filter.fieldId = 0;
        filter.fieldName = 'sectionId';
        filter.predicate = {
            filterType: ListAndSearchFilterType.Text,
            operator: 'eq',
            value1: String(this.sectionId),
        };
        filter.isActive = true;
        this.additionalFilters.push(filter);
    }

    getData(filters: ListAndSearchFilter[],
        offset?: number,
        limit?: number): Observable<ChildSectionsSearchResult[]> {

        const current: ChildSectionsSearchResult = this.getChildSectionSearchResultFromSection(this.parentModel);

        let list: ChildSectionsSearchResult[] = [];
        if (this.childSectionsSearchResult) {
            list = this.childSectionsSearchResult;
        }

        list.unshift(current);

        list = list.sort((section1, section2) => section1.contractLabel < section2.contractLabel ? -1 : 1);

        if (this.searchValueCtrl.value) {
            list = list.filter((section: ChildSectionsSearchResult) =>
                section.contractLabel.toUpperCase().startsWith((this.searchValueCtrl.value.toString().toUpperCase())));
        }
        if (this.contractStatus) {
            // only approve child sections
            const sectionOriginId = list.find((item) => item.sectionId === this.sectionId).sectionOriginId;
            for (const val of list) {
                if (!sectionOriginId || sectionOriginId === 0) {
                    val.status = this.contractStatus;
                } else {
                    if (val.sectionId === this.sectionId || val.sectionOriginId === this.sectionId) {
                        val.status = this.contractStatus;
                    }
                }
            }
        }
        return of(list);
    }

    ngOnDestroy() {
        if (this.getSectionSubscription) {
            this.getSectionSubscription.unsubscribe();
        }
    }

    getChildSectionSearchResultFromSection(section: Section): ChildSectionsSearchResult {
        const department = this.masterdata.departments.find((dep) => dep.departmentId === section.departmentId);
        const commodity = this.masterdata.commodities.find((com) => com.commodityId === section.commodityId);
        const weightUnit = this.masterdata.weightUnits.find((unit) => unit.weightUnitId === section.weightUnitId);
        const priceUnit = this.masterdata.priceUnits.find((unit) => unit.priceUnitId === section.priceUnitId);
        const arbitration = this.masterdata.arbitrations.find((unit) => unit.arbitrationCode === section.arbitration);
        const portOrigin = this.masterdata.ports.find((unit) => unit.portCode === section.portOfOrigin);
        const portDestination = this.masterdata.ports.find((unit) => unit.portCode === section.portOfDestination);
        const periodType = this.masterdata.periodTypes.find((unit) => unit.periodTypeCode === section.periodTypeCode);
        const invoiceStatus = this.masterdata.invoiceStatus.find((unit) =>
            Number(unit.code) === section.invoicingStatusId);

        const sectionResult: ChildSectionsSearchResult = {
            contractLabel: section.contractLabel,
            sectionId: section.sectionId,
            status: section.status || section.status === 0 ? ContractStatus[section.status] : null,
            blDate: section.blDate,
            allocatedTo: section.allocatedTo ? section.allocatedTo.contractLabel : '',
            assignedCharterReference: section.assignedCharterReference,
            department: department ? department.description : '',
            departmentCode: department ? department.departmentCode : '',
            counterpartyReference: section.counterpartyReference,
            contractTerm: section.contractTerms,
            contractTermsLocation: section.contractTermsLocation,
            commodityCode: commodity ? commodity.principalCommodity : '',
            commodityOrigin: commodity ? commodity.part2 : '',
            commodityGrade: commodity ? commodity.part3 : '',
            commodityLvl4: commodity ? commodity.part4 : '',
            commodityLvl5: commodity ? commodity.part5 : '',
            weightUnit: weightUnit ? weightUnit.weightCode : '',
            quantity: section.quantity,
            currency: section.currencyCode,
            priceUnit: priceUnit ? priceUnit.priceCode : '',
            price: section.price,
            paymentTerm: section.paymentTerms,
            deliveryPeriodStartDate: section.deliveryPeriodStartDate,
            positionMonthIndex: section.positionMonthIndex,
            contractDate: section.header ? section.header.contractDate : section.contractDate,
            pricingMethod: section.pricingMethod || section.pricingMethod === 0 ? PricingMethods[section.pricingMethod] : null,
            lastModifiedBy: section.lastModifiedBy,
            physicalContractId: section.physicalContractId,
            createdDateTime: section.creationDate,
            createdBy: section.createdBy,
            modifiedDateTime: section.lastModifiedDate,
            modifiedBy: section.lastModifiedBy,
            contractType: section.contractType,
            contractId: section.contractId,
            sectionNumber: section.sectionNumber,
            firstApprovalDateTime: section.firstApprovalDateTime,
            departmentId: section.departmentId,
            buyerCode: section.buyerCode,
            buyerDescription: section.buyerDescription,
            charterDescription: section.charterDescription,
            sellerDescription: section.sellerDescription,
            paymentTermDescription: section.paymentTermDescription,
            contractTermLocationDescription: section.contractTermLocationDescription,
            currencyDescription: section.currencyDescription,
            weightUnitDescription: section.weightUnitDescription,
            priceUnitDescription: section.priceUnitDescription,
            traderDisplayName: section.traderDisplayName,
            companyId: section.companyId,
            contractTermDescription: section.contractTermDescription,
            sellerCode: section.sellerCode,
            counterparty: section.contractType === ContractTypes.Purchase
                ? section.sellerCode : section.buyerCode,
            commodityId: section.commodityId,
            originalQuantity: section.originalQuantity,
            weightUnitId: section.weightUnitId,
            toleranceMin: null,
            toleranceMax: null,
            portOriginCode: section.portOfOrigin,
            portDestinationCode: section.portOfDestination,
            positionMonthType: section.positionMonthType,
            allocationDate: section.allocationDate,
            charterAssignmentDate: section.charterAssignmentDate,
            creationDate: section.creationDate,
            lastModifiedDate: section.lastModifiedDate,
            finalInvoiceRequired: false,
            cropYear: section.cropYear,
            packingCode: section.packingCode,
            paymentTermCode: section.paymentTerms,
            contractTermCode: section.contractTerms,
            periodTypeCode: periodType ? periodType.periodTypeDescription : '',
            priceUnitId: section.priceUnitId,
            priceCode: priceUnit.priceCode,
            arbitrationCode: section.arbitration,
            premiumDiscountTypeId: section.premiumDiscountTypeId,
            premiumDiscountValue: section.premiumDiscountValue,
            premiumDiscountCurrency: section.premiumDiscountCurrency,
            premiumDiscountBasis: section.premiumDiscountBasis,
            contractedValue: section.contractedValue,
            sectionTypeId: section.sectionTypeId,
            portOfOrigin: portOrigin ? portOrigin.description : '',
            portOfDestination: portDestination ? portDestination.description : '',
            deliveryPeriodEndDate: section.deliveryPeriodEndDate,
            contractTerms: section.contractTerms,
            periodType: periodType ? periodType.periodTypeDescription : '',
            paymentTerms: section.paymentTerms,
            cropYearTo: section.cropYearTo,
            arbitration: section.arbitration,
            positionMonth: section.positionMonth,
            charterId: section.charterId,
            invoiceReference: section.invoiceReference,
            otherReference: section.otherReference,
            shippingPeriod: section.shippingPeriod,
            periodTypeId: section.periodTypeId,
            invoicingStatusId: section.invoicingStatusId,
            invoiceTypeId: section.invoiceTypeId,
            sectionOriginId: section.sectionOriginId,
            contractValue: Number(section.contractedValue),
            memo: section.memorandum,
            commodityDescription: commodity ? commodity.description : '',
            arbitrationDescription: arbitration ? arbitration.description : '',
            positionType: PositionMonthTypes[section.positionMonthType],
            portOfOriginDescription: portOrigin ? portOrigin.description : '',
            portOfDestinationDescription: portDestination ? portDestination.description : '',
            groupingNumber: this.allocationInfoComponent.groupingNumberCtrl.value,
            mainInvoiceReference: section.invoiceReference,
            mainInvoiceDate: section.invoiceDate,
            percentageInvoiced: section.totalInvoicePercent,
            invoiceValue: section.totalInvoiceValue,
            paymentDate: null,
            quantityInvoiced: section.totalInvoiceQuantity,
            invoicingStatus: invoiceStatus ? invoiceStatus.description : '',
            amendedBy: section.lastModifiedBy,
            amendedOn: section.lastModifiedDate,
            vesselName: null,
            bLReference: '',
            charterManager: '',
            counterpartyRef: section.counterpartyReference,
            contractIssuedOn: section.lastDocumentIssuedDate,
            contractTypeCode: ContractTypes[section.contractType],
            quantityCodeInvoiced: weightUnit ? weightUnit.weightCode : '',
            allocatedSectionId: section.allocatedTo ? section.allocatedTo.sectionId : null,
            estimatedMaturityDate: section.estimatedMaturityDate,
        };
        return sectionResult;

    }

    initForm(entity: Section, isEdit: boolean): any {
        this.parentModel = entity;
        this.childSections = entity.childSections;
        this.dataLength = this.childSections ? this.childSections.length : 0;
        if (this.dataLength > 0) {
            this.trancheAndSplitRows = this.childSections.map((o) => o);
        }
        this.isLoading = false;
        return entity;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
        });

        return super.getFormGroup();
    }

    onSearchButtonClick() {
        this.listAndSearchComponent.loadData(true);

    }

    contractStatusChanged(contractStatus: ContractStatus) {
        this.contractStatus = ContractStatus[contractStatus];
        this.listAndSearchComponent.loadData(true);
    }

    onTabActive() {
        if (this.listAndSearchComponent) {
            this.gridService.sizeColumns(this.listAndSearchComponent.agGridOptions);
        }
    }
}
