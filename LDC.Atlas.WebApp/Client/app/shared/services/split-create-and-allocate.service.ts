import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { Charter } from '../entities/charter.entity';
import { SectionReference } from '../entities/section-reference.entity';
import { SectionTraffic } from '../entities/section-traffic.entity';
import { Section } from '../entities/section.entity';
import { SectionTypes } from '../enums/section-type.enum';
import { AssignedSectionView } from '../models/assigned-section-display-view';
import { TrancheSplitView } from '../models/tranche-split-display-view';
import { ChildSectionsSearchResult } from '../dtos/chilesection-search-result';
import { AllocateSectionCommand } from './execution/dtos/allocate-section-command';
import { ExecutionService } from './http-services/execution.service';
import { TradingService } from './http-services/trading.service';
import { SnackbarService } from './snackbar.service';
import { TrancheSplitCreationResult } from './trading/dtos/section';
import { ContractInvoiceType } from '../enums/contract-invoice-type.enum';
@Injectable()
export class SplitCreateAndAllocateService {

    messageOnAllocation: string = '';
    referenceGroupNumber: string = '';
    washoutRequired: boolean = false;

    constructor(private executionService: ExecutionService,
        protected snackbarService: SnackbarService,
        protected tradingService: TradingService,
        protected router: Router,
        protected companyManager: CompanyManagerService) { }

    async createSplitOfAssignedSections(sectionsToSplitAndAssign: AssignedSectionView[], charterId: number = null, isWashoutRequired?: boolean): Promise<boolean> {
        let repeateSectionArray: number[] = [];
        // Loop through sections to split
        // For each section, wait for iteration to be over before moving to the next one
        this.washoutRequired = isWashoutRequired;
        const createSplitOfAssignedSectionsPromises: Array<Promise<boolean>> = sectionsToSplitAndAssign
            .map((section) => this.createSplitOfAssignedSection(section, charterId, repeateSectionArray));
        return Promise.all(createSplitOfAssignedSectionsPromises).then(() => {
            return true;
        });
    }

    async createSplitOfAssignedSection(assignedSection: AssignedSectionView, charterId: number = null, repeateSectionArray: number[]): Promise<boolean> {
        // Get section
        return this.tradingService.getSection(assignedSection.sectionId, 0)
            .toPromise()
            .then((assignedSectionData: Section) => {
                // Get children
                return this.tradingService.getChildSections(assignedSection.sectionId).toPromise()
                    .then((childSections: ChildSectionsSearchResult[]) => {
                        assignedSectionData.childSections = childSections.map((childSectionResult) => {
                            const childSection = new Section();
                            childSection.setSectionFromChildSectionsSearchResult(
                                childSectionResult, assignedSection.sectionId);
                            return childSection;
                        });
                        let isSplitRequired: boolean = false;
                        // Define the call to save the split of the section
                        const saveSplitPromises: Array<Promise<TrancheSplitCreationResult>> = [];
                        if (assignedSectionData.quantity !== assignedSection.quantity) {
                            isSplitRequired = true;

                            saveSplitPromises.push(this.createAndSaveSplitWhenAssigningCharter(
                                assignedSectionData, assignedSection.quantity, childSections, repeateSectionArray));
                        }

                        // If section is allocated, allocated section sould be splitted and assigned to charter too
                        let allocatedContractSectionId: number;
                        const allocation: SectionReference = {
                            contractLabel: null,
                            sectionId: null,
                            invoicingStatusId: null,
                            sectionNumberId: null,
                            sectionTypeId: null,
                        };
                        Object.assign(allocation, assignedSectionData.allocatedTo);
                        if (assignedSection.allocatedSectionId) {
                            allocation.sectionId = assignedSection.allocatedSectionId;
                        }
                        if (allocation.sectionId) {
                            allocatedContractSectionId = allocation.sectionId;
                            // Get allocated section
                            return this.tradingService.getSection(allocatedContractSectionId, 0)
                                .toPromise()
                                .then((allocatedSection) => {
                                    const sectionTrafficList: SectionTraffic[] = [];
                                    // get allocated section Children
                                    return this.tradingService.getChildSections(allocatedContractSectionId)
                                        .toPromise()
                                        .then((allocatedChildSections: ChildSectionsSearchResult[]) => {
                                            allocatedSection.childSections = allocatedChildSections.map((childSectionResult) => {
                                                const childSection = new Section();
                                                childSection.setSectionFromChildSectionsSearchResult(
                                                    childSectionResult, allocatedContractSectionId);
                                                return childSection;
                                            });
                                            if (allocatedSection.quantity !== assignedSection.quantity) {
                                                // Define the call to save the split of the allocated section
                                                saveSplitPromises.push(
                                                    this.createAndSaveSplitWhenAssigningCharter(
                                                        allocatedSection, assignedSection.quantity, allocatedChildSections, repeateSectionArray));
                                                if (isSplitRequired) {
                                                    // Call the save functions and handle result (including allocation)
                                                    return this.handleSavePromises(saveSplitPromises, charterId, assignedSection, true);
                                                } else {
                                                    const sectionTraffic = this.getSectionTraffic(
                                                        assignedSectionData.sectionId,
                                                        assignedSection.blDate,
                                                        assignedSection.blRef,
                                                        assignedSection.vessel,
                                                        assignedSection.portDestination,
                                                        assignedSection.portOrigin);
                                                    sectionTrafficList.push(sectionTraffic);
                                                    return this.handleSavePromises(
                                                        saveSplitPromises, charterId,
                                                        assignedSection, true, sectionTrafficList);
                                                }
                                            } else {
                                                if (isSplitRequired) {
                                                    const sectionTraffic = this.getSectionTraffic(
                                                        allocatedSection.sectionId,
                                                        assignedSection.blDate,
                                                        assignedSection.blRef,
                                                        assignedSection.vessel,
                                                        assignedSection.portDestination,
                                                        assignedSection.portOrigin);
                                                    sectionTrafficList.push(sectionTraffic);
                                                    // Call the save functions and handle result (including allocation)
                                                    return this.handleSavePromises(
                                                        saveSplitPromises, charterId,
                                                        assignedSection, true, sectionTrafficList);
                                                } else {
                                                    const sectionTrafficForAllocated = this.getSectionTraffic(
                                                        allocatedSection.sectionId, assignedSection.blDate,
                                                        assignedSection.blRef, assignedSection.vessel,
                                                        assignedSection.portDestination, assignedSection.portOrigin);
                                                    sectionTrafficList.push(sectionTrafficForAllocated);
                                                    const sectionTraffic = this.getSectionTraffic(
                                                        assignedSectionData.sectionId, assignedSection.blDate,
                                                        assignedSection.blRef, assignedSection.vessel,
                                                        assignedSection.portDestination, assignedSection.portOrigin);
                                                    sectionTrafficList.push(sectionTraffic);
                                                    // Call the save functions and handle result (including allocation)
                                                    return this.handleSavePromises(
                                                        saveSplitPromises, charterId,
                                                        assignedSection, true, sectionTrafficList);
                                                }
                                            }
                                        });
                                });
                        } else {
                            const sectionTrafficList: SectionTraffic[] = [];
                            if (isSplitRequired) {
                                return this.handleSavePromises(saveSplitPromises, charterId, assignedSection, false);
                            } else {
                                const sectionTraffic = this.getSectionTraffic(
                                    assignedSectionData.sectionId, assignedSection.blDate, assignedSection.blRef, assignedSection.vessel,
                                    assignedSection.portDestination, assignedSection.portOrigin);
                                sectionTrafficList.push(sectionTraffic);
                                // Call the save functions and handle result
                                return this.handleSavePromises(saveSplitPromises, charterId, assignedSection, false, sectionTrafficList);
                            }
                        }
                    });
            });
    }

    async handleSavePromises(
        saveSplitPromises: Array<Promise<TrancheSplitCreationResult>>,
        charterId: number,
        assignedSection: AssignedSectionView,
        shouldAllocate: boolean,
        sectionTrafficList: SectionTraffic[] = []): Promise<boolean> {

        return Promise.all(saveSplitPromises)
            .then(
                (splitsCreated: TrancheSplitView[]) => {
                    // get the ids of the splits created
                    const sectionTrafficListForAllocated: SectionTraffic[] = [];

                    splitsCreated.forEach((split) => {
                        const sectionTraffic = this.getSectionTraffic(
                            split.sectionId, assignedSection.blDate, assignedSection.blRef,
                            assignedSection.vessel, assignedSection.portDestination, assignedSection.portOrigin);
                        sectionTrafficListForAllocated.push(sectionTraffic);
                    });
                    if (sectionTrafficList.length > 0) {
                        sectionTrafficList.forEach((sectionId) => sectionTrafficListForAllocated.push(sectionId));
                    }

                    const assignAndAllocate: Array<Promise<(Charter | any)>> = [];

                    // Define the call to assign the splits to the charter
                    assignAndAllocate.push(this.assignCharterToSections(sectionTrafficListForAllocated, charterId));

                    if (shouldAllocate) {

                        const splitsToAllocate: TrancheSplitCreationResult[] = [];
                        splitsCreated.forEach((newSplits) => splitsToAllocate.push(new TrancheSplitCreationResult(newSplits.sectionId, newSplits.contractLabel)));
                        if (sectionTrafficList.length > 0) {
                            sectionTrafficList.forEach((sectionTraffic) => splitsToAllocate.push(
                                new TrancheSplitCreationResult(sectionTraffic.sectionId)));
                        }
                        // Define the call to allocate the splits together
                        assignAndAllocate.push(this.allocateSections(splitsToAllocate, assignedSection.quantity));
                    }

                    // Check everything is completed
                    return Promise.all(assignAndAllocate).then((results) => {

                        return true;
                    });
                });
    }

    private async allocateSections(allocateSectionResult: TrancheSplitCreationResult[],
        quantity: number) {

        if (allocateSectionResult.length !== 2) {
            throw new Error('Something went wrong when allocating splits');
        }

        const allocateSection: AllocateSectionCommand = new AllocateSectionCommand();
        allocateSection.sectionId = allocateSectionResult[0].sectionId;
        allocateSection.allocatedSectionId = allocateSectionResult[1].sectionId;
        allocateSection.quantity = quantity;
        allocateSection.shippingType = 1;
        if (this.washoutRequired) {
            allocateSection.contractInvoiceTypeId = ContractInvoiceType.Washout;
        }

        return this.executionService.allocate(allocateSection).toPromise().then((groupNumber: number) => {
            this.messageOnAllocation = this.messageOnAllocation + `the trade  ${allocateSectionResult[0].contractLabel}
            has been properly allocated to ${allocateSectionResult[1].contractLabel} with the number ${groupNumber.toString()} `;
            this.referenceGroupNumber = groupNumber.toString();
            return true;
        });
    }

    assignCharterToSections(sectionTrafficList: SectionTraffic[], charterId: number): Promise<Charter> {
        if (!charterId) {
            throw new Error('Charter not defined');
        }
        return this.executionService.assignSectionsToCharter(charterId, sectionTrafficList)
            .toPromise().then((charter: Charter) => {
                return charter;
            });
    }

    async createAndSaveSplitWhenAssigningCharter(
        section: Section, quantity: number,
        childSections: ChildSectionsSearchResult[], repeateSectionArray: number[]): Promise<TrancheSplitCreationResult> {
        section.childSections.push(this.getNewChildSectionAfterAssignToCharter(section, quantity, childSections, repeateSectionArray));
        return this.saveCreatedSectionSplit(section, quantity);
    }

    async saveCreatedSectionSplit(createdSectionSplit: Section, quantity: number): Promise<TrancheSplitCreationResult> {
        var start = new Date().getTime();

        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > 500) {
                break;
            }
        }
        return this.tradingService.createTrancheSplit(createdSectionSplit, SectionTypes.Split).toPromise()
            .then((splitCreated: TrancheSplitCreationResult[]) => {
                if (splitCreated.length !== 1) {
                    if (splitCreated.length === 0) {
                        throw new Error('No split created for section');
                    } else {
                        throw new Error('Too many splits created');
                    }
                }
                return splitCreated[0];
            });
    }

    removeAllocation(section: Section): Section {
        section.sectionId = null;
        section.allocatedToId = null;
        section.allocatedTo = null;
        section.allocationDate = null;
        return section;
    }

    getNewChildSectionAfterAssignToCharter(section: Section, quantity: number,
        physicalContractSections: ChildSectionsSearchResult[], repeateSectionArray: number[]): Section {

        const childSectionSplit2: TrancheSplitView = new TrancheSplitView(section, quantity);

        let childSectionSplit: Section = new Section();
        Object.assign(childSectionSplit, section);
        Object.assign(childSectionSplit.childSections, section.childSections);
        childSectionSplit.childSections = [];
        childSectionSplit.quantity = quantity;
        childSectionSplit = this.removeAllocation(childSectionSplit);
        childSectionSplit.sectionTypeId = SectionTypes.Split;
        childSectionSplit.sectionOriginId = section.sectionId;
        childSectionSplit.sectionId = 0;
        childSectionSplit.contractedValue = (section.price * quantity).toString();

        repeateSectionArray.push(childSectionSplit.contractId);

        const physicalContractId: string = section.contractLabel.split('.')[0];
        let childSectionNumberId: string;
        const sectionNumberId = this.findLatestContractLabelForSplit(section, physicalContractSections);
        childSectionNumberId = this.generateSectionNumberForSplit(sectionNumberId);

        let loopCount = repeateSectionArray.filter(contractId => contractId == childSectionSplit.contractId).length;


        if (loopCount > 1) {
            for (let index = 1; index < loopCount; index++) {
                childSectionNumberId = this.generateSectionNumberForSplit(childSectionNumberId);
            }
        }

        if (childSectionNumberId.length === 0) {
            throw new Error('Could not generate contract reference');
        }

        childSectionSplit.contractLabel = physicalContractId + '.' + childSectionNumberId;
        childSectionSplit.sectionNumber = childSectionNumberId;
        childSectionSplit.originalQuantity = childSectionSplit.quantity;

        return childSectionSplit;
    }

    findLatestContractLabelForSplit(section: Section, childSections: ChildSectionsSearchResult[]): string {
        let filterSplitsInTranche: ChildSectionsSearchResult[];
        const findFirstChar = section.sectionNumber.charAt(0);
        filterSplitsInTranche = childSections.filter((childSection) => {
            const sectionNumber = childSection.contractLabel.split('.')[1];
            return sectionNumber.charAt(0) === findFirstChar;
        });

        let contractLabels = [section.contractLabel];
        contractLabels = contractLabels.concat(filterSplitsInTranche.map((child) => child.contractLabel));

        const orderedTranche = contractLabels.sort((contractLabel1, contractLabel2) => {
            if (contractLabel1 > contractLabel2) { return 1; } else { return -1; }
        });
        return orderedTranche[orderedTranche.length - 1].split('.')[1];
    }

    findLatestContractLabelForTranche(section: Section, childSections: ChildSectionsSearchResult[]) {
        let contractLabels = [section.contractLabel];
        contractLabels = contractLabels.concat(childSections.map((child) => child.contractLabel));

        const orderedTranche = contractLabels.sort((contractLabel1, contractLabel2) => {
            if (contractLabel1 > contractLabel2) { return 1; } else { return -1; }
        });
        return orderedTranche[orderedTranche.length - 1].split('.')[1];
    }

    private generateSectionNumberForSplit(latestSectionId: string): string {
        const startIndex: number = 1;
        const endIndex: number = 4;
        const numberToGenerate: number = Number(latestSectionId.substring(startIndex, endIndex)) + 1;
        let digitsToIncrement: string = numberToGenerate.toString();
        digitsToIncrement = digitsToIncrement.padStart(endIndex - startIndex, '0');
        return numberToGenerate > 999 ? '' : latestSectionId.charAt(0) + digitsToIncrement;
    }

    getSections(trancheSplitList: TrancheSplitView[]): Section[] {
        let childSectionList: Section[];
        childSectionList = [];
        trancheSplitList.forEach((section) => {
            const childSection: Section = this.getSection(section);
            childSectionList.push(childSection);
        });

        return childSectionList;
    }

    getSection(section: TrancheSplitView): Section {
        const childSection: Section = new Section();
        childSection.contractType = section.contractType;
        childSection.contractLabel = section.contractLabel;
        childSection.contractId = section.contractId;
        childSection.commodityId = section.commodityId;
        childSection.sectionNumber = section.sectionNumber;
        childSection.status = section.status;
        childSection.firstApprovalDateTime = section.firstApprovalDateTime;
        childSection.departmentId = section.departmentId;
        childSection.buyerCode = section.buyerCode;
        childSection.sellerCode = section.sellerCode;
        childSection.counterpartyReference = section.counterpartyReference;
        childSection.originalQuantity = section.originalQuantity;
        childSection.quantity = section.quantity;
        childSection.portOfOrigin = section.portOfOrigin;
        childSection.portOfDestination = section.portOfDestination;
        childSection.deliveryPeriodStartDate = section.deliveryPeriodStartDate;
        childSection.deliveryPeriodEndDate = section.deliveryPeriodEndDate;
        childSection.positionMonthType = section.positionMonthType;
        childSection.positionMonthIndex = section.positionMonthIndex;
        childSection.cropYear = section.cropYear;
        childSection.packingCode = section.packingCode;
        childSection.contractTerms = section.contractTerms;
        childSection.contractTermsLocation = section.contractTermsLocation;
        childSection.periodTypeId = section.periodTypeId;
        childSection.arbitration = section.arbitration;
        childSection.pricingMethod = section.pricingMethod;
        childSection.paymentTerms = section.paymentTerms;
        childSection.currencyCode = section.currency;
        childSection.price = section.price;
        childSection.blDate = section.blDate;
        childSection.assignedCharterReference = section.assignedCharterReference;
        childSection.charterAssignmentDate = section.charterAssignmentDate;
        childSection.createdBy = section.createdBy;
        childSection.creationDate = section.creationDate;
        childSection.lastModifiedBy = section.lastModifiedBy;
        childSection.lastModifiedDate = section.lastModifiedDate;
        childSection.header = section.header;
        childSection.sectionOriginId = section.sectionOriginId;
        childSection.contractLabelOrigin = section.contractLabelOrigin;
        childSection.premiumDiscountValue = section.premiumDiscountValue;
        childSection.premiumDiscountCurrency = section.premiumDiscountCurrency;
        childSection.premiumDiscountBasis = section.premiumDiscountBasis;
        childSection.memorandum = section.memorandum;
        childSection.contractedValue = section.contractedValue;
        childSection.weightUnitId = section.weightUnitId;
        childSection.priceUnitId = section.priceUnitId;
        childSection.marketSectorId = section.marketSectorId;
        childSection.sectionTypeId = section.sectionTypeId;
        childSection.costs = section.costs;
        return childSection;
    }

    getSectionTraffic(
        sectionId: number, blDate: Date, blRef: string,
        vessel: string, portDestination: string, portOfOrigin: string): SectionTraffic {

        const sectionTraffic: SectionTraffic = new SectionTraffic();
        sectionTraffic.sectionId = sectionId;
        sectionTraffic.blDate = blDate;
        sectionTraffic.blReference = blRef;
        sectionTraffic.vesselCode = vessel;
        sectionTraffic.portDestination = portDestination;
        sectionTraffic.portOrigin = portOfOrigin;

        return sectionTraffic;
    }
}
