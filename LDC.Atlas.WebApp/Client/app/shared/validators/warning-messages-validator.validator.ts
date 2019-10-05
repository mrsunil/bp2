import { CommonMethods } from '../../execution/services/execution-cash-common-methods';
import { AllocationMessage } from '../../trading/entities/allocation-message';
import { AllocationSetUp } from '../entities/allocation-set-up-entity';
import { CommonEntity } from '../entities/common-entity';
import { TradeFields } from '../enums/trade-fields.enum';
import { WarningMessageTypes } from '../enums/warning-message-type.enum';

export function GetWarningMessages(allocationMessages: AllocationMessage[], allocationSetUpData: AllocationSetUp[]) {
    const allocationMessage: AllocationMessage[] = [];
    const restrictedMessage = new AllocationMessage();
    const warningMessage = new AllocationMessage();
    restrictedMessage.message = '';
    warningMessage.message = '';
    const messageList: CommonEntity[] = [];
    const commonMethods = new CommonMethods();

    if (allocationSetUpData && allocationSetUpData.length > 0) {
        const allocationSetupFields = allocationSetUpData.filter
            ((item) => item.differenceBlocking === true ||
                item.differenceWarning === true);
        if (allocationSetupFields && allocationSetupFields.length > 0) {
            allocationSetupFields.forEach((item) => {
                if (item.fieldName === TradeFields[TradeFields.ArbitrationId]) {
                    if (allocationMessages[0].arbitrationId !== allocationMessages[1].arbitrationId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Arbitration'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.BuyerId]) {
                    if (allocationMessages[0].buyerId !== allocationMessages[1].buyerId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Buyer Code'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.ContractDate]) {
                    if (allocationMessages[0].contractDate !== allocationMessages[1].contractDate) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Contract Date'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.CharterId]) {
                    if (allocationMessages[0].charterId && allocationMessages[1].charterId &&
                        allocationMessages[0].charterId !== allocationMessages[1].charterId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Charter'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.ContractedValue]) {
                    if (allocationMessages[0].contractedValue !== allocationMessages[1].contractedValue) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Contracted Value'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.ContractStatusCode]) {
                    if (allocationMessages[0].contractStatusCode !== allocationMessages[1].contractStatusCode) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Contract Status Code'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.ContractTermLocationId]) {
                    if (allocationMessages[0].contractTermLocationId !== allocationMessages[1].contractTermLocationId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Contract Term Location'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.CounterpartyRef]) {
                    if (allocationMessages[0].counterpartyRef !== allocationMessages[1].counterpartyRef) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Counterparty Ref'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.CropYear]) {
                    if (allocationMessages[0].cropYear !== allocationMessages[1].cropYear) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Crop Year'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.CurrencyCode]) {
                    if (allocationMessages[0].currencyCode !== allocationMessages[1].currencyCode) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                            item.differenceWarning, 'Currency Code'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.DeliveryPeriodEnd]) {
                    if (allocationMessages[0].deliveryPeriodEnd !== allocationMessages[1].deliveryPeriodEnd) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Delivery Period End'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.DeliveryPeriodStart]) {
                    if (allocationMessages[0].deliveryPeriodStart !== allocationMessages[1].deliveryPeriodStart) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Delivery Period Start'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.DepartmentId]) {
                    if (allocationMessages[0].departmentId !== allocationMessages[1].departmentId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Department'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.FirstApprovalDateTime]) {
                    if (allocationMessages[0].firstApprovalDateTime !== allocationMessages[1].firstApprovalDateTime) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'First Approval DateTime'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.MarketSectorId]) {
                    if (allocationMessages[0].marketSectorId !== allocationMessages[1].marketSectorId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Market Sector'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Memorandum]) {
                    if (allocationMessages[0].memorandum !== allocationMessages[1].memorandum) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Memorandum'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.MonthPositionIndex]) {
                    if (allocationMessages[0].monthPositionIndex !== allocationMessages[1].monthPositionIndex) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Month Position Index'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.OriginalQuantity]) {
                    if (allocationMessages[0].originalQuantity !== allocationMessages[1].originalQuantity) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Original Quantity'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Part2]) {
                    if (allocationMessages[0].part2 !== allocationMessages[1].part2) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Cmy 2'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Part3]) {
                    if (allocationMessages[0].part3 !== allocationMessages[1].part3) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Cmy 3'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Part4]) {
                    if (allocationMessages[0].part4 !== allocationMessages[1].part4) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Cmy 4'));
                    }
                }
                if (item.fieldName === TradeFields[TradeFields.Part5]) {
                    if (allocationMessages[0].part5 !== allocationMessages[1].part5) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Cmy 5'));
                    }
                }
                if (item.fieldName === TradeFields[TradeFields.PaymentTermId]) {
                    if (allocationMessages[0].paymentTermId !== allocationMessages[1].paymentTermId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Payment Term'));
                    }
                }
                if (item.fieldName === TradeFields[TradeFields.PeriodTypeId]) {
                    if (allocationMessages[0].periodTypeId !== allocationMessages[1].periodTypeId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Period Type'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.PhysicalContractCode]) {
                    if (allocationMessages[0].physicalContractCode !== allocationMessages[1].physicalContractCode) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Physical Contract Code'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.PortDestinationId]) {
                    if (allocationMessages[0].portDestinationId !== allocationMessages[1].portDestinationId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Port Of Destination'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.PortOriginId]) {
                    if (allocationMessages[0].portOriginId !== allocationMessages[1].portOriginId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Port Of Origin'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.PositionMonthType]) {
                    if (allocationMessages[0].positionMonthType !== allocationMessages[1].positionMonthType) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Position Month Type'));
                    }
                }
                if (item.fieldName === TradeFields[TradeFields.PremiumDiscountBasis]) {
                    if (allocationMessages[0].premiumDiscountBasis !== allocationMessages[1].premiumDiscountBasis) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Premium Discount Basis'));
                    }
                }
                if (item.fieldName === TradeFields[TradeFields.PremiumDiscountCurrency]) {
                    if (allocationMessages[0].premiumDiscountCurrency !== allocationMessages[1].premiumDiscountCurrency) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Premium Discount Currency'));
                    }
                }
                if (item.fieldName === TradeFields[TradeFields.PremiumDiscountValue]) {
                    if (allocationMessages[0].premiumDiscountValue !== allocationMessages[1].premiumDiscountValue) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Premium Discount Value'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Price]) {
                    if (allocationMessages[0].price !== allocationMessages[1].price) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Price'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.PricingMethodId]) {
                    if (allocationMessages[0].pricingMethodId !== allocationMessages[1].pricingMethodId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Pricing Method'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.PrincipalCommodity]) {
                    if (allocationMessages[0].principalCommodity !== allocationMessages[1].principalCommodity) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Cmy 1'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Quantity]) {
                    if (allocationMessages[0].quantity !== allocationMessages[1].quantity) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Quantity'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.SellerId]) {
                    if (allocationMessages[0].sellerId !== allocationMessages[1].sellerId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Seller Code'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.ShippingPeriod]) {
                    if (allocationMessages[0].shippingPeriod !== allocationMessages[1].shippingPeriod) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Shipping Period'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.TraderId]) {
                    if (allocationMessages[0].traderId !== allocationMessages[1].traderId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Trader'));
                    }
                }

                if (item.fieldName === TradeFields[TradeFields.Type]) {
                    if (allocationMessages[0].type !== allocationMessages[1].type) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking,
                                                                                  item.differenceWarning, 'Type'));
                    }
                }
            },
            );
        }

        if (messageList && messageList.length > 0) {

            const restrictedMessageList = messageList.filter((item) => item.id === WarningMessageTypes.Restricted);
            if (restrictedMessageList && restrictedMessageList.length > 0) {
                restrictedMessage.errorTypeId = WarningMessageTypes.Restricted;
                restrictedMessage.message = restrictedMessageList.map(({ message }) => message).join().replace(/^,|,$/g, '');
                restrictedMessage.message = 'Errors generated from' + ' ' + restrictedMessage.message;
                allocationMessage.push(restrictedMessage);
            }
            const warningMessageList = messageList.filter((item) => item.id === WarningMessageTypes.Warning);
            if (warningMessageList && warningMessageList.length > 0) {
                warningMessage.errorTypeId = WarningMessageTypes.Warning;
                warningMessage.message = warningMessageList.map(({ message }) => message).join().replace(/^,|,$/g, '');
                warningMessage.message = 'Warnings generated from' + ' ' + warningMessage.message;
                allocationMessage.push(warningMessage);
            }
        }
    }
    return allocationMessage;
}
