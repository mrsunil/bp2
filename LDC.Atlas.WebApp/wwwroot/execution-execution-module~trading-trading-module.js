(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["execution-execution-module~trading-trading-module"],{

/***/ "./Client/app/shared/directives/number-validators.directive.ts":
/*!*********************************************************************!*\
  !*** ./Client/app/shared/directives/number-validators.directive.ts ***!
  \*********************************************************************/
/*! exports provided: isPositive, isDifferencePositive, isGreatherThanZero */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPositive", function() { return isPositive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDifferencePositive", function() { return isDifferencePositive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isGreatherThanZero", function() { return isGreatherThanZero; });
function isPositive() {
    return function (control) {
        if (Number(control.value) < 0) {
            return { isPositiveError: true };
        }
        return null;
    };
}
function isDifferencePositive(calculatedValue) {
    return function (control) {
        if (Number(calculatedValue) - Number(control.value) < 0) {
            return { isDifferencePositiveError: true };
        }
        return null;
    };
}
function isGreatherThanZero() {
    return function (control) {
        var value = control.value;
        if (!isNaN(value) && control.value != '' && (Number(value) <= 0)) {
            return { "isGreatherThanZeroError": true };
        }
        return null;
    };
}


/***/ }),

/***/ "./Client/app/shared/entities/charter.entity.ts":
/*!******************************************************!*\
  !*** ./Client/app/shared/entities/charter.entity.ts ***!
  \******************************************************/
/*! exports provided: Charter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Charter", function() { return Charter; });
var Charter = /** @class */ (function () {
    function Charter() {
    }
    return Charter;
}());



/***/ }),

/***/ "./Client/app/shared/entities/invoice-line-record.entity.ts":
/*!******************************************************************!*\
  !*** ./Client/app/shared/entities/invoice-line-record.entity.ts ***!
  \******************************************************************/
/*! exports provided: InvoiceLineRecord */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceLineRecord", function() { return InvoiceLineRecord; });
var InvoiceLineRecord = /** @class */ (function () {
    function InvoiceLineRecord() {
    }
    return InvoiceLineRecord;
}());



/***/ }),

/***/ "./Client/app/shared/entities/lock-functional-context.entity.ts":
/*!**********************************************************************!*\
  !*** ./Client/app/shared/entities/lock-functional-context.entity.ts ***!
  \**********************************************************************/
/*! exports provided: LockFunctionalContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LockFunctionalContext", function() { return LockFunctionalContext; });
var LockFunctionalContext;
(function (LockFunctionalContext) {
    LockFunctionalContext[LockFunctionalContext["TradeEdit"] = 100] = "TradeEdit";
    LockFunctionalContext[LockFunctionalContext["RelativeTradeEdit"] = 101] = "RelativeTradeEdit";
    LockFunctionalContext[LockFunctionalContext["TradeApproval"] = 102] = "TradeApproval";
    LockFunctionalContext[LockFunctionalContext["TradeSplit"] = 103] = "TradeSplit";
    LockFunctionalContext[LockFunctionalContext["TradeTranche"] = 104] = "TradeTranche";
    LockFunctionalContext[LockFunctionalContext["RelativeTradeSplit"] = 105] = "RelativeTradeSplit";
    LockFunctionalContext[LockFunctionalContext["RelativeTradeTranche"] = 106] = "RelativeTradeTranche";
    LockFunctionalContext[LockFunctionalContext["TradeAssignment"] = 107] = "TradeAssignment";
    LockFunctionalContext[LockFunctionalContext["TradeDeassignment"] = 108] = "TradeDeassignment";
    LockFunctionalContext[LockFunctionalContext["BulkEdition"] = 109] = "BulkEdition";
    LockFunctionalContext[LockFunctionalContext["BulkApproval"] = 110] = "BulkApproval";
    LockFunctionalContext[LockFunctionalContext["TradeReassignment"] = 111] = "TradeReassignment";
    LockFunctionalContext[LockFunctionalContext["TradeMerge"] = 112] = "TradeMerge";
    LockFunctionalContext[LockFunctionalContext["TradeBulkClosure"] = 113] = "TradeBulkClosure";
    LockFunctionalContext[LockFunctionalContext["FxDeal"] = 114] = "FxDeal";
    LockFunctionalContext[LockFunctionalContext["CharterEdit"] = 200] = "CharterEdit";
    LockFunctionalContext[LockFunctionalContext["CharterDeletion"] = 201] = "CharterDeletion";
    LockFunctionalContext[LockFunctionalContext["CharterBulkClosure"] = 202] = "CharterBulkClosure";
    LockFunctionalContext[LockFunctionalContext["ContractInvoicing"] = 300] = "ContractInvoicing";
    LockFunctionalContext[LockFunctionalContext["CostInvoicing"] = 301] = "CostInvoicing";
    LockFunctionalContext[LockFunctionalContext["GoodsAndCostsInvoicing"] = 302] = "GoodsAndCostsInvoicing";
    LockFunctionalContext[LockFunctionalContext["WashoutInvoicing"] = 303] = "WashoutInvoicing";
    LockFunctionalContext[LockFunctionalContext["ReversalInvoicing"] = 304] = "ReversalInvoicing";
    LockFunctionalContext[LockFunctionalContext["Allocation"] = 400] = "Allocation";
    LockFunctionalContext[LockFunctionalContext["RelativeAllocation"] = 401] = "RelativeAllocation";
    LockFunctionalContext[LockFunctionalContext["Deallocation"] = 402] = "Deallocation";
    LockFunctionalContext[LockFunctionalContext["BulkAllocation"] = 403] = "BulkAllocation";
    LockFunctionalContext[LockFunctionalContext["BulkDeallocation"] = 404] = "BulkDeallocation";
    LockFunctionalContext[LockFunctionalContext["RelativeDeallocation"] = 403] = "RelativeDeallocation";
    LockFunctionalContext[LockFunctionalContext["CostMatrixEdition"] = 500] = "CostMatrixEdition";
    LockFunctionalContext[LockFunctionalContext["CostMatrixDeletion"] = 501] = "CostMatrixDeletion";
    LockFunctionalContext[LockFunctionalContext["MasterDataEdition"] = 600] = "MasterDataEdition";
    LockFunctionalContext[LockFunctionalContext["UserAccountEdition"] = 700] = "UserAccountEdition";
    LockFunctionalContext[LockFunctionalContext["UserAccountDeletion"] = 701] = "UserAccountDeletion";
    LockFunctionalContext[LockFunctionalContext["UserProfileEdition"] = 800] = "UserProfileEdition";
    LockFunctionalContext[LockFunctionalContext["UserProfileDeletion"] = 801] = "UserProfileDeletion";
    LockFunctionalContext[LockFunctionalContext["AccountingDocumentEdition"] = 900] = "AccountingDocumentEdition";
    LockFunctionalContext[LockFunctionalContext["AccountingDocumentAuthorizeForPosting"] = 901] = "AccountingDocumentAuthorizeForPosting";
    LockFunctionalContext[LockFunctionalContext["AccountingDocumentReversal"] = 902] = "AccountingDocumentReversal";
    LockFunctionalContext[LockFunctionalContext["CashDocumentEdition"] = 1000] = "CashDocumentEdition";
    LockFunctionalContext[LockFunctionalContext["CashDocumentDeletion"] = 1001] = "CashDocumentDeletion";
})(LockFunctionalContext || (LockFunctionalContext = {}));


/***/ }),

/***/ "./Client/app/shared/enums/charter-status.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/charter-status.enum.ts ***!
  \********************************************************/
/*! exports provided: CharterStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CharterStatus", function() { return CharterStatus; });
var CharterStatus;
(function (CharterStatus) {
    CharterStatus[CharterStatus["Open"] = 1] = "Open";
    CharterStatus[CharterStatus["Closed"] = 2] = "Closed";
})(CharterStatus || (CharterStatus = {}));


/***/ }),

/***/ "./Client/app/shared/enums/cost-direction.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/cost-direction.enum.ts ***!
  \********************************************************/
/*! exports provided: CostDirections */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CostDirections", function() { return CostDirections; });
var CostDirections;
(function (CostDirections) {
    CostDirections[CostDirections["Payable"] = 1] = "Payable";
    CostDirections[CostDirections["Receivable"] = 2] = "Receivable";
})(CostDirections || (CostDirections = {}));


/***/ }),

/***/ "./Client/app/shared/enums/group-function-type.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/group-function-type.ts ***!
  \********************************************************/
/*! exports provided: GroupFunctionTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupFunctionTypes", function() { return GroupFunctionTypes; });
var GroupFunctionTypes;
(function (GroupFunctionTypes) {
    GroupFunctionTypes[GroupFunctionTypes["TradeBulkEdition"] = 1] = "TradeBulkEdition";
    GroupFunctionTypes[GroupFunctionTypes["TradeBulkApproval"] = 2] = "TradeBulkApproval";
    GroupFunctionTypes[GroupFunctionTypes["Costs"] = 3] = "Costs";
    GroupFunctionTypes[GroupFunctionTypes["TradeBulkClosure"] = 4] = "TradeBulkClosure";
    GroupFunctionTypes[GroupFunctionTypes["TradeBulkAllocation"] = 5] = "TradeBulkAllocation";
    GroupFunctionTypes[GroupFunctionTypes["TradeBulkDeAllocation"] = 6] = "TradeBulkDeAllocation";
})(GroupFunctionTypes || (GroupFunctionTypes = {}));


/***/ }),

/***/ "./Client/app/shared/enums/invoice-source-type.enum.ts":
/*!*************************************************************!*\
  !*** ./Client/app/shared/enums/invoice-source-type.enum.ts ***!
  \*************************************************************/
/*! exports provided: InvoiceSourceType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceSourceType", function() { return InvoiceSourceType; });
var InvoiceSourceType;
(function (InvoiceSourceType) {
    InvoiceSourceType[InvoiceSourceType["Inhouse"] = 0] = "Inhouse";
    InvoiceSourceType[InvoiceSourceType["External"] = 1] = "External";
})(InvoiceSourceType || (InvoiceSourceType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/invoicing-status.enum.ts":
/*!**********************************************************!*\
  !*** ./Client/app/shared/enums/invoicing-status.enum.ts ***!
  \**********************************************************/
/*! exports provided: InvoicingStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoicingStatus", function() { return InvoicingStatus; });
var InvoicingStatus;
(function (InvoicingStatus) {
    InvoicingStatus[InvoicingStatus["Uninvoiced"] = 1] = "Uninvoiced";
    InvoicingStatus[InvoicingStatus["FinalInvoiceRequired"] = 2] = "FinalInvoiceRequired";
    InvoicingStatus[InvoicingStatus["Finalized"] = 3] = "Finalized";
})(InvoicingStatus || (InvoicingStatus = {}));


/***/ }),

/***/ "./Client/app/shared/enums/posting-status.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/posting-status.enum.ts ***!
  \********************************************************/
/*! exports provided: PostingStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostingStatus", function() { return PostingStatus; });
var PostingStatus;
(function (PostingStatus) {
    PostingStatus[PostingStatus["Incomplete"] = 1] = "Incomplete";
    PostingStatus[PostingStatus["Held"] = 2] = "Held";
    PostingStatus[PostingStatus["MappingError"] = 3] = "MappingError";
    PostingStatus[PostingStatus["Authorized"] = 4] = "Authorized";
    PostingStatus[PostingStatus["Posted"] = 5] = "Posted";
    PostingStatus[PostingStatus["Deleted"] = 6] = "Deleted";
})(PostingStatus || (PostingStatus = {}));


/***/ }),

/***/ "./Client/app/shared/enums/quantity-to-invoice.enum.ts":
/*!*************************************************************!*\
  !*** ./Client/app/shared/enums/quantity-to-invoice.enum.ts ***!
  \*************************************************************/
/*! exports provided: QuantityToInvoiceType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuantityToInvoiceType", function() { return QuantityToInvoiceType; });
var QuantityToInvoiceType;
(function (QuantityToInvoiceType) {
    QuantityToInvoiceType[QuantityToInvoiceType["Contract"] = 0] = "Contract";
    QuantityToInvoiceType[QuantityToInvoiceType["Loaded"] = 1] = "Loaded";
    QuantityToInvoiceType[QuantityToInvoiceType["Discharged"] = 2] = "Discharged";
})(QuantityToInvoiceType || (QuantityToInvoiceType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/rate-type.enum.ts":
/*!***************************************************!*\
  !*** ./Client/app/shared/enums/rate-type.enum.ts ***!
  \***************************************************/
/*! exports provided: RateTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateTypes", function() { return RateTypes; });
var RateTypes;
(function (RateTypes) {
    RateTypes[RateTypes["Unknown"] = 0] = "Unknown";
    RateTypes[RateTypes["Amount"] = 1] = "Amount";
    RateTypes[RateTypes["Percent"] = 2] = "Percent";
    RateTypes[RateTypes["Rate"] = 3] = "Rate";
})(RateTypes || (RateTypes = {}));


/***/ }),

/***/ "./Client/app/shared/enums/shipping-type-enum.ts":
/*!*******************************************************!*\
  !*** ./Client/app/shared/enums/shipping-type-enum.ts ***!
  \*******************************************************/
/*! exports provided: ShippingType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShippingType", function() { return ShippingType; });
var ShippingType;
(function (ShippingType) {
    ShippingType[ShippingType["NoTransfer"] = 1] = "NoTransfer";
    ShippingType[ShippingType["PurchaseToSale"] = 2] = "PurchaseToSale";
    ShippingType[ShippingType["SaleToPurchase"] = 3] = "SaleToPurchase";
})(ShippingType || (ShippingType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/split-type.enum.ts":
/*!****************************************************!*\
  !*** ./Client/app/shared/enums/split-type.enum.ts ***!
  \****************************************************/
/*! exports provided: SplitType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SplitType", function() { return SplitType; });
var SplitType;
(function (SplitType) {
    SplitType[SplitType["SourceSplit"] = 1] = "SourceSplit";
    SplitType[SplitType["TargetSplit"] = 2] = "TargetSplit";
    SplitType[SplitType["Both"] = 3] = "Both";
    SplitType[SplitType["None"] = 4] = "None";
})(SplitType || (SplitType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/trade-fields.enum.ts":
/*!******************************************************!*\
  !*** ./Client/app/shared/enums/trade-fields.enum.ts ***!
  \******************************************************/
/*! exports provided: TradeFields */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeFields", function() { return TradeFields; });
var TradeFields;
(function (TradeFields) {
    TradeFields[TradeFields["ArbitrationId"] = 0] = "ArbitrationId";
    TradeFields[TradeFields["BuyerId"] = 1] = "BuyerId";
    TradeFields[TradeFields["CharterId"] = 2] = "CharterId";
    TradeFields[TradeFields["ContractDate"] = 3] = "ContractDate";
    TradeFields[TradeFields["ContractedValue"] = 4] = "ContractedValue";
    TradeFields[TradeFields["ContractStatusCode"] = 5] = "ContractStatusCode";
    TradeFields[TradeFields["ContractTermLocationId"] = 6] = "ContractTermLocationId";
    TradeFields[TradeFields["CounterpartyRef"] = 7] = "CounterpartyRef";
    TradeFields[TradeFields["CropYear"] = 8] = "CropYear";
    TradeFields[TradeFields["CurrencyCode"] = 9] = "CurrencyCode";
    TradeFields[TradeFields["DeliveryPeriodEnd"] = 10] = "DeliveryPeriodEnd";
    TradeFields[TradeFields["DeliveryPeriodStart"] = 11] = "DeliveryPeriodStart";
    TradeFields[TradeFields["DepartmentId"] = 12] = "DepartmentId";
    TradeFields[TradeFields["FirstApprovalDateTime"] = 13] = "FirstApprovalDateTime";
    TradeFields[TradeFields["MarketSectorId"] = 14] = "MarketSectorId";
    TradeFields[TradeFields["Memorandum"] = 15] = "Memorandum";
    TradeFields[TradeFields["MonthPositionIndex"] = 16] = "MonthPositionIndex";
    TradeFields[TradeFields["OriginalQuantity"] = 17] = "OriginalQuantity";
    TradeFields[TradeFields["Part2"] = 18] = "Part2";
    TradeFields[TradeFields["Part3"] = 19] = "Part3";
    TradeFields[TradeFields["Part4"] = 20] = "Part4";
    TradeFields[TradeFields["Part5"] = 21] = "Part5";
    TradeFields[TradeFields["PaymentTermId"] = 22] = "PaymentTermId";
    TradeFields[TradeFields["PeriodTypeId"] = 23] = "PeriodTypeId";
    TradeFields[TradeFields["PhysicalContractCode"] = 24] = "PhysicalContractCode";
    TradeFields[TradeFields["PortDestinationId"] = 25] = "PortDestinationId";
    TradeFields[TradeFields["PortOriginId"] = 26] = "PortOriginId";
    TradeFields[TradeFields["PositionMonthType"] = 27] = "PositionMonthType";
    TradeFields[TradeFields["PremiumDiscountBasis"] = 28] = "PremiumDiscountBasis";
    TradeFields[TradeFields["PremiumDiscountCurrency"] = 29] = "PremiumDiscountCurrency";
    TradeFields[TradeFields["PremiumDiscountValue"] = 30] = "PremiumDiscountValue";
    TradeFields[TradeFields["Price"] = 31] = "Price";
    TradeFields[TradeFields["PricingMethodId"] = 32] = "PricingMethodId";
    TradeFields[TradeFields["PrincipalCommodity"] = 33] = "PrincipalCommodity";
    TradeFields[TradeFields["Quantity"] = 34] = "Quantity";
    TradeFields[TradeFields["SellerId"] = 35] = "SellerId";
    TradeFields[TradeFields["ShippingPeriod"] = 36] = "ShippingPeriod";
    TradeFields[TradeFields["TraderId"] = 37] = "TraderId";
    TradeFields[TradeFields["Type"] = 38] = "Type";
})(TradeFields || (TradeFields = {}));


/***/ }),

/***/ "./Client/app/shared/enums/transaction-document-type.enum.ts":
/*!*******************************************************************!*\
  !*** ./Client/app/shared/enums/transaction-document-type.enum.ts ***!
  \*******************************************************************/
/*! exports provided: TransactionDocumentTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransactionDocumentTypes", function() { return TransactionDocumentTypes; });
var TransactionDocumentTypes;
(function (TransactionDocumentTypes) {
    TransactionDocumentTypes[TransactionDocumentTypes["PI/SI"] = 0] = "PI/SI";
    TransactionDocumentTypes[TransactionDocumentTypes["CN/DN"] = 1] = "CN/DN";
    TransactionDocumentTypes[TransactionDocumentTypes["Original"] = 2] = "Original";
})(TransactionDocumentTypes || (TransactionDocumentTypes = {}));


/***/ }),

/***/ "./Client/app/shared/models/allocated-trade-display-view.ts":
/*!******************************************************************!*\
  !*** ./Client/app/shared/models/allocated-trade-display-view.ts ***!
  \******************************************************************/
/*! exports provided: AllocatedTradeDisplayView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AllocatedTradeDisplayView", function() { return AllocatedTradeDisplayView; });
var AllocatedTradeDisplayView = /** @class */ (function () {
    function AllocatedTradeDisplayView(allocatedTrade) {
        if (allocatedTrade) {
            this.contractLabel = allocatedTrade.physicalContractCode;
            this.commodityCode = allocatedTrade.commodityCode;
            this.quantity = allocatedTrade.quantity;
            this.weightCode = allocatedTrade.weightCode;
            this.counterparty = allocatedTrade.counterparty;
            this.shippingPeriod = allocatedTrade.shippingPeriod;
            this.departmentCode = allocatedTrade.departmentCode;
            this.sectionId = allocatedTrade.sectionId;
            this.type = allocatedTrade.type;
            this.principalCommodity = allocatedTrade.principalCommodity;
            this.commodityOrigin = allocatedTrade.commodityOrigin;
            this.commodityGrade = allocatedTrade.commodityGrade;
            this.commodityLvl4 = allocatedTrade.commodityLvl4;
            this.commodityLvl5 = allocatedTrade.commodityLvl5;
            this.allocatedSectionId = allocatedTrade.allocatedSectionId;
            this.currencyCode = allocatedTrade.currencyCode;
        }
    }
    return AllocatedTradeDisplayView;
}());



/***/ }),

/***/ "./Client/app/shared/services/customDateAdapter.ts":
/*!*********************************************************!*\
  !*** ./Client/app/shared/services/customDateAdapter.ts ***!
  \*********************************************************/
/*! exports provided: CustomDateAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomDateAdapter", function() { return CustomDateAdapter; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material-moment-adapter */ "./node_modules/@angular/material-moment-adapter/esm5/material-moment-adapter.es5.js");
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/services/authorization.service */ "./Client/app/core/services/authorization.service.ts");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _http_services_configuration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./http-services/configuration.service */ "./Client/app/shared/services/http-services/configuration.service.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CustomDateAdapter = /** @class */ (function (_super) {
    __extends(CustomDateAdapter, _super);
    function CustomDateAdapter(securityService, configurationService, authorizationService) {
        var _this = _super.call(this, 'en-US') || this;
        _this.securityService = securityService;
        _this.configurationService = configurationService;
        _this.authorizationService = authorizationService;
        // this is the default date set to the system
        _this.customDateFormat = undefined;
        return _this;
    }
    CustomDateAdapter.prototype.format = function (date, displayFormat) {
        if (!this.customDateFormat) {
            this.getdateFormat();
        }
        return date.locale('en-US').format(this.customDateFormat);
    };
    CustomDateAdapter.prototype.getdateFormat = function () {
        this.customDateFormat = this.authorizationService.getUserDateFormat();
    };
    CustomDateAdapter = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_shared_services_security_service__WEBPACK_IMPORTED_MODULE_3__["SecurityService"],
            _http_services_configuration_service__WEBPACK_IMPORTED_MODULE_4__["ConfigurationService"],
            _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_2__["AuthorizationService"]])
    ], CustomDateAdapter);
    return CustomDateAdapter;
}(_angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_1__["MomentDateAdapter"]));



/***/ }),

/***/ "./Client/app/shared/services/execution/dtos/invoice-record.ts":
/*!*********************************************************************!*\
  !*** ./Client/app/shared/services/execution/dtos/invoice-record.ts ***!
  \*********************************************************************/
/*! exports provided: InvoiceRecord */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceRecord", function() { return InvoiceRecord; });
var InvoiceRecord = /** @class */ (function () {
    function InvoiceRecord() {
    }
    return InvoiceRecord;
}());



/***/ }),

/***/ "./Client/app/shared/services/masterdata/counterparty-data-loader.ts":
/*!***************************************************************************!*\
  !*** ./Client/app/shared/services/masterdata/counterparty-data-loader.ts ***!
  \***************************************************************************/
/*! exports provided: CounterPartyDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterPartyDataLoader", function() { return CounterPartyDataLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CounterPartyDataLoader = /** @class */ (function () {
    function CounterPartyDataLoader(masterDataService) {
        this.masterDataService = masterDataService;
    }
    CounterPartyDataLoader.prototype.getData = function (searchTerm, pagingOptions) {
        var list = this.masterDataService.getCounterparties(searchTerm, pagingOptions)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data.value;
        }));
        return list;
    };
    CounterPartyDataLoader.prototype.getDataById = function (counterpartyId) {
        var list = this.masterDataService.getCounterpartyById(counterpartyId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data.value;
        }));
        return list;
    };
    CounterPartyDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_2__["MasterdataService"]])
    ], CounterPartyDataLoader);
    return CounterPartyDataLoader;
}());



/***/ }),

/***/ "./Client/app/shared/validators/warning-messages-validator.validator.ts":
/*!******************************************************************************!*\
  !*** ./Client/app/shared/validators/warning-messages-validator.validator.ts ***!
  \******************************************************************************/
/*! exports provided: GetWarningMessages */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetWarningMessages", function() { return GetWarningMessages; });
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _trading_entities_allocation_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../trading/entities/allocation-message */ "./Client/app/trading/entities/allocation-message.ts");
/* harmony import */ var _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums/trade-fields.enum */ "./Client/app/shared/enums/trade-fields.enum.ts");
/* harmony import */ var _enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums/warning-message-type.enum */ "./Client/app/shared/enums/warning-message-type.enum.ts");




function GetWarningMessages(allocationMessages, allocationSetUpData) {
    var allocationMessage = [];
    var restrictedMessage = new _trading_entities_allocation_message__WEBPACK_IMPORTED_MODULE_1__["AllocationMessage"]();
    var warningMessage = new _trading_entities_allocation_message__WEBPACK_IMPORTED_MODULE_1__["AllocationMessage"]();
    restrictedMessage.message = '';
    warningMessage.message = '';
    var messageList = [];
    var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_0__["CommonMethods"]();
    if (allocationSetUpData && allocationSetUpData.length > 0) {
        var allocationSetupFields = allocationSetUpData.filter(function (item) { return item.differenceBlocking === true ||
            item.differenceWarning === true; });
        if (allocationSetupFields && allocationSetupFields.length > 0) {
            allocationSetupFields.forEach(function (item) {
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].ArbitrationId]) {
                    if (allocationMessages[0].arbitrationId !== allocationMessages[1].arbitrationId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Arbitration'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].BuyerId]) {
                    if (allocationMessages[0].buyerId !== allocationMessages[1].buyerId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Buyer Code'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].ContractDate]) {
                    if (allocationMessages[0].contractDate !== allocationMessages[1].contractDate) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Contract Date'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].CharterId]) {
                    if (allocationMessages[0].charterId && allocationMessages[1].charterId &&
                        allocationMessages[0].charterId !== allocationMessages[1].charterId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Charter'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].ContractedValue]) {
                    if (allocationMessages[0].contractedValue !== allocationMessages[1].contractedValue) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Contracted Value'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].ContractStatusCode]) {
                    if (allocationMessages[0].contractStatusCode !== allocationMessages[1].contractStatusCode) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Contract Status Code'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].ContractTermLocationId]) {
                    if (allocationMessages[0].contractTermLocationId !== allocationMessages[1].contractTermLocationId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Contract Term Location'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].CounterpartyRef]) {
                    if (allocationMessages[0].counterpartyRef !== allocationMessages[1].counterpartyRef) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Counterparty Ref'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].CropYear]) {
                    if (allocationMessages[0].cropYear !== allocationMessages[1].cropYear) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Crop Year'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].CurrencyCode]) {
                    if (allocationMessages[0].currencyCode !== allocationMessages[1].currencyCode) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Currency Code'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].DeliveryPeriodEnd]) {
                    if (allocationMessages[0].deliveryPeriodEnd !== allocationMessages[1].deliveryPeriodEnd) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Delivery Period End'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].DeliveryPeriodStart]) {
                    if (allocationMessages[0].deliveryPeriodStart !== allocationMessages[1].deliveryPeriodStart) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Delivery Period Start'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].DepartmentId]) {
                    if (allocationMessages[0].departmentId !== allocationMessages[1].departmentId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Department'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].FirstApprovalDateTime]) {
                    if (allocationMessages[0].firstApprovalDateTime !== allocationMessages[1].firstApprovalDateTime) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'First Approval DateTime'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].MarketSectorId]) {
                    if (allocationMessages[0].marketSectorId !== allocationMessages[1].marketSectorId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Market Sector'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Memorandum]) {
                    if (allocationMessages[0].memorandum !== allocationMessages[1].memorandum) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Memorandum'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].MonthPositionIndex]) {
                    if (allocationMessages[0].monthPositionIndex !== allocationMessages[1].monthPositionIndex) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Month Position Index'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].OriginalQuantity]) {
                    if (allocationMessages[0].originalQuantity !== allocationMessages[1].originalQuantity) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Original Quantity'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Part2]) {
                    if (allocationMessages[0].part2 !== allocationMessages[1].part2) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Cmy 2'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Part3]) {
                    if (allocationMessages[0].part3 !== allocationMessages[1].part3) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Cmy 3'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Part4]) {
                    if (allocationMessages[0].part4 !== allocationMessages[1].part4) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Cmy 4'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Part5]) {
                    if (allocationMessages[0].part5 !== allocationMessages[1].part5) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Cmy 5'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PaymentTermId]) {
                    if (allocationMessages[0].paymentTermId !== allocationMessages[1].paymentTermId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Payment Term'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PeriodTypeId]) {
                    if (allocationMessages[0].periodTypeId !== allocationMessages[1].periodTypeId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Period Type'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PhysicalContractCode]) {
                    if (allocationMessages[0].physicalContractCode !== allocationMessages[1].physicalContractCode) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Physical Contract Code'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PortDestinationId]) {
                    if (allocationMessages[0].portDestinationId !== allocationMessages[1].portDestinationId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Port Of Destination'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PortOriginId]) {
                    if (allocationMessages[0].portOriginId !== allocationMessages[1].portOriginId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Port Of Origin'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PositionMonthType]) {
                    if (allocationMessages[0].positionMonthType !== allocationMessages[1].positionMonthType) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Position Month Type'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PremiumDiscountBasis]) {
                    if (allocationMessages[0].premiumDiscountBasis !== allocationMessages[1].premiumDiscountBasis) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Premium Discount Basis'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PremiumDiscountCurrency]) {
                    if (allocationMessages[0].premiumDiscountCurrency !== allocationMessages[1].premiumDiscountCurrency) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Premium Discount Currency'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PremiumDiscountValue]) {
                    if (allocationMessages[0].premiumDiscountValue !== allocationMessages[1].premiumDiscountValue) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Premium Discount Value'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Price]) {
                    if (allocationMessages[0].price !== allocationMessages[1].price) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Price'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PricingMethodId]) {
                    if (allocationMessages[0].pricingMethodId !== allocationMessages[1].pricingMethodId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Pricing Method'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].PrincipalCommodity]) {
                    if (allocationMessages[0].principalCommodity !== allocationMessages[1].principalCommodity) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Cmy 1'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Quantity]) {
                    if (allocationMessages[0].quantity !== allocationMessages[1].quantity) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Quantity'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].SellerId]) {
                    if (allocationMessages[0].sellerId !== allocationMessages[1].sellerId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Seller Code'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].ShippingPeriod]) {
                    if (allocationMessages[0].shippingPeriod !== allocationMessages[1].shippingPeriod) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Shipping Period'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].TraderId]) {
                    if (allocationMessages[0].traderId !== allocationMessages[1].traderId) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Trader'));
                    }
                }
                if (item.fieldName === _enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"][_enums_trade_fields_enum__WEBPACK_IMPORTED_MODULE_2__["TradeFields"].Type]) {
                    if (allocationMessages[0].type !== allocationMessages[1].type) {
                        messageList.push(commonMethods.populateAllocationMessages(item.differenceBlocking, item.differenceWarning, 'Type'));
                    }
                }
            });
        }
        if (messageList && messageList.length > 0) {
            var restrictedMessageList = messageList.filter(function (item) { return item.id === _enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_3__["WarningMessageTypes"].Restricted; });
            if (restrictedMessageList && restrictedMessageList.length > 0) {
                restrictedMessage.errorTypeId = _enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_3__["WarningMessageTypes"].Restricted;
                restrictedMessage.message = restrictedMessageList.map(function (_a) {
                    var message = _a.message;
                    return message;
                }).join().replace(/^,|,$/g, '');
                restrictedMessage.message = 'Errors generated from' + ' ' + restrictedMessage.message;
                allocationMessage.push(restrictedMessage);
            }
            var warningMessageList = messageList.filter(function (item) { return item.id === _enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_3__["WarningMessageTypes"].Warning; });
            if (warningMessageList && warningMessageList.length > 0) {
                warningMessage.errorTypeId = _enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_3__["WarningMessageTypes"].Warning;
                warningMessage.message = warningMessageList.map(function (_a) {
                    var message = _a.message;
                    return message;
                }).join().replace(/^,|,$/g, '');
                warningMessage.message = 'Warnings generated from' + ' ' + warningMessage.message;
                allocationMessage.push(warningMessage);
            }
        }
    }
    return allocationMessage;
}


/***/ }),

/***/ "./Client/app/trading/components/contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator.ts":
/*!**************************************************************************************************************************************************!*\
  !*** ./Client/app/trading/components/contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator.ts ***!
  \**************************************************************************************************************************************************/
/*! exports provided: dateAfter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateAfter", function() { return dateAfter; });
/* harmony import */ var _shared_services_common_abstract_control_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../shared/services/common/abstract-control.service */ "./Client/app/shared/services/common/abstract-control.service.ts");
/* harmony import */ var _shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../shared/validators/date-validators.validator */ "./Client/app/shared/validators/date-validators.validator.ts");


function dateAfter(dateComparedFormControlName, referenceFormControlName, allowEqual) {
    if (allowEqual === void 0) { allowEqual = true; }
    return function (abstractForm) {
        var comparedDate = abstractForm.get(dateComparedFormControlName);
        var reference = abstractForm.get(referenceFormControlName);
        var res = Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_1__["isDateTwoBeforeDateOne"])(comparedDate.value, reference.value, true);
        if (!res) {
            _shared_services_common_abstract_control_service__WEBPACK_IMPORTED_MODULE_0__["AbstractControlService"].addError(comparedDate, { key: 'isBeforeDate', value: true });
            return { isBeforeDate: true };
        }
        else {
            _shared_services_common_abstract_control_service__WEBPACK_IMPORTED_MODULE_0__["AbstractControlService"].removeError(comparedDate, { key: 'isBeforeDate', value: true });
        }
        return null;
    };
}


/***/ }),

/***/ "./Client/app/trading/entities/allocation-message.ts":
/*!***********************************************************!*\
  !*** ./Client/app/trading/entities/allocation-message.ts ***!
  \***********************************************************/
/*! exports provided: AllocationMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AllocationMessage", function() { return AllocationMessage; });
var AllocationMessage = /** @class */ (function () {
    function AllocationMessage() {
    }
    return AllocationMessage;
}());



/***/ })

}]);
//# sourceMappingURL=execution-execution-module~trading-trading-module.js.map