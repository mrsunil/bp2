import { Injectable } from '@angular/core';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { cropYearValidation } from '../../trading/Library/trading-businessrules';
import { Commodity } from '../entities/commodity.entity';
import { EnumEntity } from '../entities/enum-entity.entity';
import { TradePropertyPrivilege } from '../entities/trade-property-privilege.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { isDateTwoBeforeDateOne } from '../validators/date-validators.validator';
import { SnackbarService } from './snackbar.service';

const moment = _moment;

@Injectable()

export class TradeEditService {

    constructor(private companyManager: CompanyManagerService,
        private snackbarService: SnackbarService) { }

    // Bulk edit privileges validation

    public isGridEditableAfterInvoicing(params): boolean {
        params.data.isInvoiced = false;
        params.data.invoicingConditionErrorMessage = null;
        if (params.data.invoicingStatusId === InvoiceStatus.NotInvoiced || params.data.invoicingStatusId === '') {
            params.data.isInvoiced = false;
            params.data.invoicingConditionErrorMessage = null;
            return true;
        } else {
            params.data.isInvoiced = true;
            params.data.invoicingConditionErrorMessage = 'Not Allowed to Edit: Trade is [Invoiced]';
            return false;
        }
    }

    public isTradeAChildTrade(params): boolean {
        params.data.isChildTrade = (params.data.sectionOriginId) ? true : false;
        return !params.data.isChildTrade;
    }

    public isGridCellEditable(params: any, privileges: TradePropertyPrivilege, lockedContracts: EnumEntity[]): boolean {
        if (params.data.isCancelled) {
            return false;
        }
        if (params.data.isClosed) {
            return false;
        }
        if (lockedContracts) {
            const lockedContract = lockedContracts.find((item) => item.enumEntityId === params.data.sectionId);
            // selected contract is locked  by the user. So make grideditable to false;
            if (lockedContract) {
                return false;
            }
        }
        if (params.context.componentParent.isSummaryView === false) {
            if (params.colDef.colId === 'contractDate' || params.colDef.colId === 'userId') {
                return this.isTradeAChildTrade(params);
            }
            if (params.colDef.colId === 'departmentId' || params.colDef.colId === 'departmentDescription') {
                return this.isGridEditableAfterInvoicedorAllocated(params);
            }
            if (params.colDef.colId === 'buyerCounterpartyId' || params.colDef.colId === 'buyerDescription') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.buyerCodePrivilege) {
                        params.data.buyerErrorMessage = 'Not Allowed to Edit Buyer';
                        return false;
                    } else
                        if (params.data.contractType === 'Purchase') {
                            if (params.data.invoicingStatusId !== InvoiceStatus.NotInvoiced) {
                                return this.isGridEditableAfterInvoicing(params);
                            } else {
                                return this.isCounterpartyEditable(params);
                            }
                        } else {
                            return true;
                        }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'sellerCounterpartyId' || params.colDef.colId === 'sellerDescription') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.sellerCodePrivilege) {
                        params.data.sellerErrorMessage = 'Not Allowed to Edit Seller';
                        return false;
                    } else
                        if (params.data.contractType === 'Sale') {
                            if (params.data.invoicingStatusId !== InvoiceStatus.NotInvoiced) {
                                return this.isGridEditableAfterInvoicing(params);
                            } else {
                                return this.isCounterpartyEditable(params);
                            }
                        } else { return true; }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'counterpartyReference') {
                if (!privileges.counterPartyPrivilege) {
                    params.data.counterpartyErrorMessage = 'Not Allowed to Edit counterparty Reference';
                    return false;
                } else {
                    params.data.counterpartyErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'commodityId' || params.colDef.colId === 'commodity2'
                || params.colDef.colId === 'commodity3' || params.colDef.colId === 'commodity4' || params.colDef.colId === 'commodity5') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.commodityPrivilege) {
                        params.data.commodityErrorMessage = 'Not Allowed to Edit commodity';
                        return false;
                    } else {
                        return this.isGridEditableAfterInvoicing(params);
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'cropYear') {
                if (!privileges.cropYearPrivilege) {
                    params.data.cropYearErrorMessage = 'Not Allowed to Edit crop year';
                    return false;
                } else {
                    params.data.cropYearErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'contractTermId' || params.colDef.colId === 'contractTermDescription') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.contractTermsPrivilege) {
                        params.data.contractTermsErrorMessage = 'Not Allowed to Edit Contract Terms';
                        return false;
                    } else {
                        return this.isGridEditableAfterInvoicing(params);
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'portTermId') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.portTermsPrivilege) {
                        params.data.portTermsErrorMessage = 'Not Allowed to Edit Port Terms';
                        return false;
                    } else {
                        return this.isGridEditableAfterInvoicing(params);
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'arbitrationId' || params.colDef.colId === 'arbitrationDescription') {
                if (!privileges.arbitrationPrivilege) {
                    params.data.arbitrationErrorMessage = 'Not Allowed to Edit Arbitrations';
                    return false;
                } else {
                    params.data.arbitrationErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'currencyCode' || params.colDef.colId === 'currencyDescription') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.currencyPrivilege) {
                        params.data.currencyErrorMessage = 'Not Allowed to Edit Currency Code';
                        return false;
                    } else {
                        return this.isGridEditableAfterInvoicing(params);
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'priceUnitId') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.priceCodePrivilege) {
                        params.data.priceCodeErrorMessage = 'Not Allowed to Edit Price Code';
                        return false;
                    } else {
                        return this.isGridEditableAfterInvoicing(params);
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'contractPrice') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.contractPricePrivilege) {
                        params.data.contractPriceErrorMessage = 'Not Allowed to Edit Contract Price';
                        return false;
                    } else {
                        return this.isGridEditableAfterInvoicing(params);
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'paymentTermsId') {
                if (!privileges.paymentTermsPrivilege) {
                    params.data.paymentTermsErrorMessage = 'Not Allowed to Edit Payment Terms';
                    return false;
                } else {
                    params.data.paymentTermsErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'periodTypeId') {
                if (!privileges.hasSuperTradePrivilege) {
                    if (!privileges.periodTypePrivilege) {
                        params.data.periodTypeErrorMessage = 'Not Allowed to Edit Period Type';
                        return false;
                    } else {
                        params.data.periodTypeErrorMessage = null;
                        return true;
                    }
                } else {
                    return true;
                }
            }
            if (params.colDef.colId === 'deliveryPeriodStart') {
                if (!privileges.fromDatePrivilege) {
                    params.data.fromDateErrorMessage = 'Not Allowed to Edit Shipment From Date';
                    return false;
                } else {
                    return this.isPeriodEditableBasedonBldate(params);
                }
            }
            if (params.colDef.colId === 'deliveryPeriodEnd') {
                if (!privileges.toDatePrivilege) {
                    params.data.toDateErrorMessage = 'Not Allowed to Edit Shipment To Date';
                    return false;
                } else {
                    return this.isPeriodEditableBasedonBldate(params);
                }
            }
            if (params.colDef.colId === 'positionMonthType') {
                if (!privileges.positionTypePrivilege) {
                    params.data.positionTypeErrorMessage = 'Not Allowed to Edit Position Month Type';
                    return false;
                } else {
                    params.data.positionTypeErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'portOriginId') {
                if (!privileges.portOfOriginPrivilege) {
                    params.data.portOfOriginErrorMessage = 'Not Allowed to Edit Port of Origin';
                    return false;
                } else {
                    params.data.portOfOriginErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'portDestinationId') {
                if (!privileges.portOfDestinationPrivilege) {
                    params.data.portOfDestinationErrorMessage = 'Not Allowed to Edit Port of Destination';
                    return false;
                } else {
                    params.data.portOfDestinationErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'businessSectorId' || params.colDef.colId === 'businessSectorDescription') {
                if (!privileges.businessSectorPrivilege) {
                    params.data.businessSectorErrorMessage = 'Not Allowed to Edit Business Sector';
                    return false;
                } else {
                    return this.isGridEditableAfterInvoicing(params);
                }
            }
            if (params.colDef.colId === 'memorandum') {
                if (!privileges.memoPrivilege) {
                    params.data.memoErrorMessage = 'Not Allowed to Edit Internal Memorandum';
                    return false;
                } else {
                    params.data.memoErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'contractIssuedDate') {
                if (!privileges.contractIssuedOnPrivilege) {
                    params.data.contractIssuedErrorMessage = 'Not Allowed to Edit Contract issued Date';
                    return false;
                } else {
                    params.data.contractIssuedErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'vesselId') {
                if (!privileges.vesselNamePrivilege) {
                    params.data.vesselNameErrorMessage = 'Not Allowed to Edit Vessel';
                    return false;
                } else {
                    params.data.vesselNameErrorMessage = null;
                    return true;
                }
            }
            if (params.colDef.colId === 'blDate') {
                if (!privileges.blDatePrivilege) {
                    params.data.blDateErrorMessage = 'Not Allowed to Edit BL Date';
                    return false;
                } else {
                    return this.isBLDateCellEditable(params, privileges);
                }

            }
            if (params.colDef.colId === 'blReference') {
                if (!privileges.blReferencePrivilege) {
                    params.data.blReferenceErrorMessage = 'Not Allowed to Edit BL Reference';
                    return false;
                } else {
                    params.data.blReferenceErrorMessage = null;
                    return true;
                }
            }

            if (params.colDef.colId === 'otherReference') {
                if (!privileges.otherReferencePrivilege) {
                    params.data.otherReferenceErrorMessage = 'Not Allowed to Edit Other Reference';
                    return false;
                } else {
                    params.data.otherReferenceErrorMessage = null;
                    return true;
                }
            }

            if (params.colDef.colId === 'premiumDiscountTypeId') {
                if (!privileges.hasSuperTradePrivilege) {
                    return this.isGridEditableAfterInvoicing(params);
                } else {
                    return true;
                }
            }
            return true;
        } else { return false; }
    }

    // BR implementation for commodity
    public onCommodityValueChange(params: any, code: string, list: Commodity[]) {
        const selectedCommodity = list.find(
            (commodity) => commodity.commodityId === params.data.commodityId);
        if (params.data.commodityId !== params.value) {
            if (params.data.commodityId) {
                params.node.setDataValue('commodity2', selectedCommodity.part2);
                params.node.setDataValue('commodity3', selectedCommodity.part3);
                params.node.setDataValue('commodity4', selectedCommodity.part4);
                params.node.setDataValue('commodity5', selectedCommodity.part5);
                params.node.setDataValue('arbitrationCode', selectedCommodity.arbitrationCode);
                params.node.setDataValue('currencyCode', selectedCommodity.currency);
                params.node.setDataValue('priceUnitId', selectedCommodity.priceUnitId);
                params.node.setDataValue('rowStatus', 'A');
                params.data.commodityChange = true;
            }
        }
    }

    // BR implementation for Crop Year
    public isCropYearValid(params: any) {
        let error = null;
        let result = null;
        let notValid = false;
        params.data.cropYearValidationMessage = null;
        params.data.validationError = false;
        const cropYearFromat = new RegExp(/^([0-9]{4})(\/([0-9]{4}))?$/);
        const isformatValid = cropYearFromat.test(params.data.cropYear);
        if (!isformatValid) {
            error = { NotRegularFormat: true };
            params.data.validationError = true;
            params.data.cropYearValidationMessage = 'only YYYY or YYYY/YYYY format is allowed';
        } else {
            if (params.data.cropYear && params.data.contractDate && isformatValid) {
                const reg = new RegExp(/[0-9]{4}/g);
                const years = String(params.data.cropYear).match(reg);
                const contractDate = moment(params.data.contractDate);
                result = cropYearValidation(years, contractDate);
            }
            if (result < 1) {
                params.data.validationError = true;
                switch (result) {
                    case 0:
                        error = { isFirstYearGreater: true };
                        notValid = true;
                        params.data.cropYearValidationMessage
                            = 'Second year entered after the “/” should always be “greater than” the first year entered before the “/”';
                        break;
                    case -1:
                        error = { isYearOutOfRange: true };
                        notValid = true;
                        params.data.cropYearValidationMessage = 'Crop year should be within +/- 5 years from the contract date';
                        break;
                }
            } else {
                params.node.setDataValue('rowStatus', 'A');
            }
        }
        return null;
    }

    // Validation for Date Range
    public isDateInRange(value, start, stop) {
        return value >= start && value <= stop;
    }

    isBLDateCellEditable(params: any, privileges: TradePropertyPrivilege): boolean {
        params.data.isEditable = true;
        params.data.blDateEditableMessage = null;
        if (params.data.invoicingStatusId === '' && params.data.allocatedSectionId === '') {
            return params.data.isEditable;
        }
        if (params.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
            if (params.data.allocatedSectionId === null) {
                if (params.data.contractType === 'Sale') {
                    params.data.blDateEditableMessage = 'BL Date cannot be added to unallocated sale';
                    params.data.isEditable = false;
                } else {
                    params.data.blDateEditableMessage = null;
                    params.data.isEditable = true;
                }
            } else {
                params.data.blDateEditableMessage = null;
                params.data.isEditable = true;
            }
        } else {
            if (privileges && !privileges.hasSuperTradePrivilege) {
                params.data.blDateEditableMessage = 'Not Allowed to Edit: Trade is [Invoiced]';
                params.data.isEditable = false;
            } else {
                return true;
            }
        }
        return params.data.isEditable;
    }

    // BR implementation for BL date
    public blDateValidation(params: any): boolean {
        this.isBLDateCellEditable(params, null);
        if (!params.data.isEditable) {
            return params.data.blDateEditableMessage;
        } else {
            const companyDate = new Date(this.companyManager.getCurrentCompanyDate().toLocaleString().valueOf());
            const contractDate = new Date(params.data.contractDate);
            params.data.blDateValidationStyleChange = false;
            params.data.blDateErrorMessage = null;
            params.data.validationError = false;
            params.data.blDateWarning = false;
            if (params.data.blDate) {
                const blDate = new Date(params.data.blDate);
                const futureDate = isDateTwoBeforeDateOne(companyDate, blDate, true);
                const beforeContractDate = isDateTwoBeforeDateOne(contractDate, params.data.blDate);
                if (!futureDate) {
                    params.data.blDateValidationStyleChange = true;
                    params.data.validationError = true;
                    params.data.blDateErrorMessage = 'BL Date cannot be in future';
                } else if (beforeContractDate) {
                    params.data.validationError = false;
                    params.data.blDateWarning = true;
                    params.data.blDateValidationStyleChange = false;
                    params.data.blDateErrorMessage = 'BL Date cannot be before contract date';
                } else {
                    params.data.blDateValidationStyleChange = false;
                    params.data.blDateErrorMessage = null;
                }
            }

            return params.data.blDateErrorMessage;
        }
    }

    // BR implementation for Shipment Period
    public shipmentPeriodValidation(params: any) {
        const shipmentFromDate = new Date(params.data.deliveryPeriodStart);
        const shipmentToDate = new Date(params.data.deliveryPeriodEnd);
        params.data.shipmentPeriodValidationStyleChange = false;
        params.data.toolTipMessage = null;
        params.data.validationError = false;
        const result = isDateTwoBeforeDateOne(shipmentToDate, shipmentFromDate, true);
        params.data.shipmentPeriodValidationStyleChange = result;
        params.data.validationError = !result;
        return params.data.shipmentPeriodValidationStyleChange;
    }

    isPeriodEditableBasedonBldate(params): boolean {
        params.data.isPeriodEditable = false;
        params.data.periodEditableConditionErrorMessage = null;
        if (params.data.blDate) {
            params.data.isPeriodEditable = false;
            params.data.periodEditableConditionErrorMessage = 'Not Allowed to Edit: Trade is having [BL Date]';
        } else {
            params.data.isPeriodEditable = true;
            params.data.periodEditableConditionErrorMessage = null;
        }
        return params.data.isPeriodEditable;
    }

    // BR implementation for Shipment Period(From Date)
    public ShipmentFromDateValidationMessage(params: any) {
        this.shipmentPeriodValidation(params);
        this.isPeriodEditableBasedonBldate(params);
        if (!params.data.isPeriodEditable) {
            return params.data.periodEditableConditionErrorMessage;
        } else {
            params.data.shipmentFromMessage = (!params.data.shipmentPeriodValidationStyleChange)
                ? 'Cannot be After Period To' : null;
            return params.data.shipmentFromMessage;
        }
    }

    // BR implementation for Shipment Period(To Date)
    public ShipmentToDateValidationMessage(params: any) {
        this.shipmentPeriodValidation(params);
        this.isPeriodEditableBasedonBldate(params);
        if (!params.data.isPeriodEditable) {
            return params.data.periodEditableConditionErrorMessage;
        } else {
            params.data.shipmentToMessage = (!params.data.shipmentPeriodValidationStyleChange)
                ? 'Cannot be before Period From' : null;
            return params.data.shipmentToMessage;
        }
    }

    // Disable cell based on allocation and invoicing
    isGridEditableAfterInvoicedorAllocated(params): boolean {
        params.data.isInvoicedorAllocated = false;
        params.data.invoicingAllocationConditionErrorMessage = null;
        if (params.data.invoicingStatusId === '' && params.data.allocatedSectionId === '') {
            return !params.data.isInvoicedorAllocated;
        }
        if (params.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
            if (params.data.allocatedSectionId !== null) {
                params.data.isInvoicedorAllocated = true;
                params.data.invoicingAllocationConditionErrorMessage = 'Not Allowed to Edit: Trade is [Allocated]';
            } else {
                params.data.isInvoicedorAllocated = false;
                params.data.invoicingAllocationConditionErrorMessage = null;
            }
        } else {
            params.data.isInvoicedorAllocated = true;
            params.data.invoicingAllocationConditionErrorMessage = 'Not Allowed to Edit: Trade is [Invoiced]';
        }
        return !params.data.isInvoicedorAllocated;
    }

    isCounterpartyEditable(params): boolean {
        if (params.data.contractType === 'Purchase') {
            params.data.isbuyerCounterpartyEditable = false;
            params.data.isSellerCounterpartyEditable = true;
            params.data.isbuyerCounterpartyErrorMessage = 'Not Allowed to Edit: Trade is having Contract Type [Purchase]';
            return params.data.isbuyerCounterpartyEditable;
        } else if (params.data.contractType === 'Sale') {
            params.data.isSellerCounterpartyEditable = false;
            params.data.isbuyerCounterpartyEditable = true;
            params.data.issellerCounterpartyErrorMessage = 'Not Allowed to Edit: Trade is having Contract Type [Sale]';
            return params.data.isSellerCounterpartyEditable;
        }
    }
}
