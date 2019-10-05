(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["execution-execution-module~financial-financial-module~reporting-reporting-module~trading-trading-mod~4658959d"],{

/***/ "./Client/app/execution/services/execution-cash-common-methods.ts":
/*!************************************************************************!*\
  !*** ./Client/app/execution/services/execution-cash-common-methods.ts ***!
  \************************************************************************/
/*! exports provided: CommonMethods */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommonMethods", function() { return CommonMethods; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_enums_cash_type_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/enums/cash-type.enum */ "./Client/app/shared/enums/cash-type.enum.ts");
/* harmony import */ var _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/enums/transaction-document.enum */ "./Client/app/shared/enums/transaction-document.enum.ts");
/* harmony import */ var _shared_entities_common_entity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/entities/common-entity */ "./Client/app/shared/entities/common-entity.ts");
/* harmony import */ var _shared_enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/enums/warning-message-type.enum */ "./Client/app/shared/enums/warning-message-type.enum.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CommonMethods = /** @class */ (function () {
    function CommonMethods() {
    }
    // get counterpartyid based on counterpartyCode from masterdata
    CommonMethods.prototype.getCounterpartyIdBasedOnCodeFromMasterData = function (counterpartyCode, masterData) {
        if (masterData.counterparties && masterData.counterparties.length > 0) {
            var counterparty = masterData.counterparties.filter(function (item) { return item.counterpartyCode === counterpartyCode; });
            if (counterparty.length > 0) {
                return counterparty[0].counterpartyID;
            }
        }
    };
    // get departmentcode based on departmentId from masterdata
    CommonMethods.prototype.getCounterpartyCodeBasedOnIdFromMasterData = function (counterpartyID, masterData) {
        if (masterData.counterparties && masterData.counterparties.length > 0) {
            var counterparty = masterData.counterparties.filter(function (item) { return item.counterpartyID === counterpartyID; });
            if (counterparty.length > 0) {
                return counterparty[0].counterpartyCode;
            }
        }
    };
    // get department id based on departmentcode from masterdata
    CommonMethods.prototype.getDepartmentIdBasedOnCodeFromMasterData = function (departmentCode, masterData) {
        if (masterData.departments && masterData.departments.length > 0) {
            var department = masterData.departments.filter(function (item) { return item.departmentCode === departmentCode; });
            if (department.length > 0) {
                return department[0].departmentId;
            }
        }
    };
    // get department code based on departmentId from masterdata
    CommonMethods.prototype.getDepartmentCodeBasedOnIdFromMasterData = function (departmentID, masterData) {
        if (masterData.departments && masterData.departments.length > 0) {
            var department = masterData.departments.filter(function (item) { return item.departmentId === departmentID; });
            if (department.length > 0) {
                return department[0].departmentCode;
            }
        }
    };
    // get department code and description  based on departmentId from masterdata
    CommonMethods.prototype.getDepartmentCodeDescriptionBasedOnIdFromMasterData = function (departmentID, masterData) {
        if (masterData.departments && masterData.departments.length > 0) {
            var department = masterData.departments.filter(function (item) { return item.departmentId === departmentID; });
            if (department.length > 0) {
                return department[0].departmentCode + ' | ' + department[0].description;
            }
        }
    };
    // get payementTermcode based on paymentID from Masterdata
    CommonMethods.prototype.getPaymentTermCodeBasedOnIdFromMasterData = function (paymentTermId, masterData) {
        if (masterData.paymentTerms && masterData.paymentTerms.length > 0) {
            var paymentTerm = masterData.paymentTerms.filter(function (item) { return item.paymentTermsId === paymentTermId; });
            if (paymentTerm.length > 0) {
                return paymentTerm[0].paymentTermCode;
            }
        }
    };
    // get charter code based on charterid from charterList
    CommonMethods.prototype.getCharterReferenceBasedOnIdFromCharterList = function (charterId, charters) {
        if (charters && charters.length > 0) {
            var charter = charters.filter(function (item) { return item.charterId === charterId; });
            if (charter.length > 0) {
                return charter[0].charterCode;
            }
        }
    };
    // This method returns the sign to show in the document amount with sign in
    // invoice list in pick by transaction page in cash module.
    // Here documentType are like PI,SI,CN,DN and costDirectionId is Pay/receipt
    CommonMethods.prototype.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection = function (documentType, costDirectionId, document, isLoading) {
        var signedValue = 1;
        if (documentType && costDirectionId) {
            if (documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].PurchaseInvoice || documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].CreditNote) {
                signedValue = -1;
            }
            else if (documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].SalesInvoice || documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].DebitNote) {
                signedValue = 1;
            }
            else if ((documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].JournalEntry
                || documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].CashPayment) && !isLoading) {
                signedValue = Math.sign(document.amount);
            }
            else if (documentType === _shared_enums_transaction_document_enum__WEBPACK_IMPORTED_MODULE_2__["TransactionDocument"].CashReceipt) {
                signedValue = Math.sign(document.amount) * (-1);
            }
            if (isLoading) {
                return signedValue;
            }
            else {
                return (costDirectionId === _shared_enums_cash_type_enum__WEBPACK_IMPORTED_MODULE_1__["CashType"].CashPayment) ? signedValue : -signedValue;
            }
        }
    };
    // this method will return charterid from charterlist based on charter code
    CommonMethods.prototype.getCharterIdFromCharterList = function (charterCode, charters) {
        if (charters && charters.length > 0) {
            var charter = charters.find(function (item) { return item.charterCode === charterCode; });
            if (charter) {
                return charter.charterId;
            }
        }
    };
    // this method is used to format the number to comma separated value with decimal points.
    // ex: 123456.13 => 123,456.13
    // ex: 123 => 123.00
    CommonMethods.prototype.getFormattedNumberValue = function (value, numberOfDigits) {
        if (numberOfDigits === void 0) { numberOfDigits = 2; }
        if (isNaN(value) || value === null) {
            return '';
        }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: numberOfDigits, maximumFractionDigits: numberOfDigits }).
            format(value);
    };
    // This method used while allocation of trades.
    // based on the feild setup value it will add message and error type id to the common entity.
    CommonMethods.prototype.populateAllocationMessages = function (isdifferenceBlocking, isDifferenceWarning, message) {
        var errorMessage = new _shared_entities_common_entity__WEBPACK_IMPORTED_MODULE_3__["CommonEntity"]();
        errorMessage.message = message;
        errorMessage.id = isdifferenceBlocking ? _shared_enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_4__["WarningMessageTypes"].Restricted :
            (isDifferenceWarning ? _shared_enums_warning_message_type_enum__WEBPACK_IMPORTED_MODULE_4__["WarningMessageTypes"].Warning : null);
        return errorMessage;
    };
    CommonMethods = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [])
    ], CommonMethods);
    return CommonMethods;
}());



/***/ }),

/***/ "./Client/app/shared/entities/common-entity.ts":
/*!*****************************************************!*\
  !*** ./Client/app/shared/entities/common-entity.ts ***!
  \*****************************************************/
/*! exports provided: CommonEntity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommonEntity", function() { return CommonEntity; });
var CommonEntity = /** @class */ (function () {
    function CommonEntity() {
    }
    return CommonEntity;
}());



/***/ }),

/***/ "./Client/app/shared/enums/cash-type.enum.ts":
/*!***************************************************!*\
  !*** ./Client/app/shared/enums/cash-type.enum.ts ***!
  \***************************************************/
/*! exports provided: CashType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CashType", function() { return CashType; });
var CashType;
(function (CashType) {
    CashType[CashType["CashPayment"] = 1] = "CashPayment";
    CashType[CashType["CashReceipt"] = 2] = "CashReceipt";
})(CashType || (CashType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/transaction-document.enum.ts":
/*!**************************************************************!*\
  !*** ./Client/app/shared/enums/transaction-document.enum.ts ***!
  \**************************************************************/
/*! exports provided: TransactionDocument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransactionDocument", function() { return TransactionDocument; });
var TransactionDocument;
(function (TransactionDocument) {
    TransactionDocument["PurchaseInvoice"] = "PI";
    TransactionDocument["SalesInvoice"] = "SI";
    TransactionDocument["CreditNote"] = "CN";
    TransactionDocument["DebitNote"] = "DN";
    TransactionDocument["CashPayment"] = "CP";
    TransactionDocument["CashReceipt"] = "CI";
    TransactionDocument["JournalEntry"] = "JL";
    TransactionDocument["Revaluation"] = "RV";
})(TransactionDocument || (TransactionDocument = {}));


/***/ }),

/***/ "./Client/app/shared/enums/warning-message-type.enum.ts":
/*!**************************************************************!*\
  !*** ./Client/app/shared/enums/warning-message-type.enum.ts ***!
  \**************************************************************/
/*! exports provided: WarningMessageTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WarningMessageTypes", function() { return WarningMessageTypes; });
var WarningMessageTypes;
(function (WarningMessageTypes) {
    WarningMessageTypes[WarningMessageTypes["Restricted"] = 1] = "Restricted";
    WarningMessageTypes[WarningMessageTypes["Warning"] = 2] = "Warning";
})(WarningMessageTypes || (WarningMessageTypes = {}));


/***/ }),

/***/ "./Client/app/shared/models/freeze-display-view.ts":
/*!*********************************************************!*\
  !*** ./Client/app/shared/models/freeze-display-view.ts ***!
  \*********************************************************/
/*! exports provided: FreezeDisplayView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FreezeDisplayView", function() { return FreezeDisplayView; });
var FreezeDisplayView = /** @class */ (function () {
    function FreezeDisplayView(dataVersionId, freezeDate, actualfreezeDate, dataVersionTypeId) {
        if (actualfreezeDate === void 0) { actualfreezeDate = null; }
        if (dataVersionTypeId === void 0) { dataVersionTypeId = null; }
        this.dataVersionId = dataVersionId;
        this.freezeDate = freezeDate;
        this.actualfreezeDate = actualfreezeDate;
        this.dataVersionTypeId = dataVersionTypeId;
    }
    return FreezeDisplayView;
}());



/***/ }),

/***/ "./Client/app/shared/services/execution/charter-data-loader.ts":
/*!*********************************************************************!*\
  !*** ./Client/app/shared/services/execution/charter-data-loader.ts ***!
  \*********************************************************************/
/*! exports provided: CharterDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CharterDataLoader", function() { return CharterDataLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _http_services_execution_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../http-services/execution.service */ "./Client/app/shared/services/http-services/execution.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CharterDataLoader = /** @class */ (function () {
    function CharterDataLoader(executionService) {
        this.executionService = executionService;
    }
    CharterDataLoader.prototype.getData = function () {
        var list = this.executionService.getCharters()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data.value ? data.value.sort(function (a, b) { return (a.charterCode > b.charterCode) ? 1 : -1; }) : data.value;
        }));
        return list;
    };
    CharterDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_execution_service__WEBPACK_IMPORTED_MODULE_2__["ExecutionService"]])
    ], CharterDataLoader);
    return CharterDataLoader;
}());



/***/ })

}]);
//# sourceMappingURL=execution-execution-module~financial-financial-module~reporting-reporting-module~trading-trading-mod~4658959d.js.map