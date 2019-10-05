(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./Client/app/execution/services/execution-actions.service.ts":
/*!********************************************************************!*\
  !*** ./Client/app/execution/services/execution-actions.service.ts ***!
  \********************************************************************/
/*! exports provided: ExecutionActionsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExecutionActionsService", function() { return ExecutionActionsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ExecutionActionsService = /** @class */ (function () {
    function ExecutionActionsService(companyManager, router) {
        var _this = this;
        this.companyManager = companyManager;
        this.router = router;
        this.editCashSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.displayCashSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.charterGroupFunctionsSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.editCashSubject.subscribe(function (value) {
            _this.router.navigate(['/' + _this.companyManager.getCurrentCompanyId() + '/execution/cash/edit/'
                    + value.costDirectionId + '/', value.cashId]);
        });
        this.displayCashSubject.subscribe(function (value) {
            _this.router.navigate(['/' + _this.companyManager.getCurrentCompanyId() + '/execution/cash/display/'
                    + value.costDirectionId + '/', value.cashId]);
        });
        this.charterGroupFunctionsSubject.subscribe(function () {
            _this.router.navigate([_this.companyManager.getCurrentCompanyId() + '/execution/charter/groupfunctions']);
        });
    }
    ExecutionActionsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [_core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], ExecutionActionsService);
    return ExecutionActionsService;
}());



/***/ }),

/***/ "./Client/app/shared/entities/trade-configuration-entity.ts":
/*!******************************************************************!*\
  !*** ./Client/app/shared/entities/trade-configuration-entity.ts ***!
  \******************************************************************/
/*! exports provided: TradeConfiguration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeConfiguration", function() { return TradeConfiguration; });
var TradeConfiguration = /** @class */ (function () {
    function TradeConfiguration() {
    }
    return TradeConfiguration;
}());



/***/ }),

/***/ "./Client/app/shared/entities/trade-status.entity.ts":
/*!***********************************************************!*\
  !*** ./Client/app/shared/entities/trade-status.entity.ts ***!
  \***********************************************************/
/*! exports provided: TradeStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeStatus", function() { return TradeStatus; });
var TradeStatus = /** @class */ (function () {
    function TradeStatus(value, name) {
        this.value = value;
        this.name = name;
    }
    TradeStatus.getStatusList = function () {
        if (!this.list) {
            this.list =
                [
                    this.open,
                    this.closed,
                    this.realized,
                    this.unrealized,
                    this.zeroTonnage,
                    this.cancelled,
                ];
        }
        return this.list;
    };
    TradeStatus.getStatusStringList = function () {
        if (!this.list) {
            this.list =
                [
                    this.open,
                    this.closed,
                    this.realized,
                    this.unrealized,
                    this.zeroTonnage,
                    this.cancelled,
                ];
        }
        return this.list.map(function (item) { return item.name; });
    };
    TradeStatus.open = new TradeStatus(1, 'Open');
    TradeStatus.closed = new TradeStatus(2, 'Closed');
    TradeStatus.realized = new TradeStatus(3, 'Executed');
    TradeStatus.unrealized = new TradeStatus(4, 'Non-Executed');
    TradeStatus.zeroTonnage = new TradeStatus(5, 'Zero Tonnages');
    TradeStatus.cancelled = new TradeStatus(5, 'Cancelled');
    return TradeStatus;
}());



/***/ }),

/***/ "./Client/app/shared/enums/foreign-exchange-rate-viewmode.enum.ts":
/*!************************************************************************!*\
  !*** ./Client/app/shared/enums/foreign-exchange-rate-viewmode.enum.ts ***!
  \************************************************************************/
/*! exports provided: ForeignExchangeRateViewMode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForeignExchangeRateViewMode", function() { return ForeignExchangeRateViewMode; });
var ForeignExchangeRateViewMode;
(function (ForeignExchangeRateViewMode) {
    ForeignExchangeRateViewMode["Spot"] = "Spot";
    ForeignExchangeRateViewMode["Daily"] = "Daily";
    ForeignExchangeRateViewMode["Monthly"] = "Monthly";
})(ForeignExchangeRateViewMode || (ForeignExchangeRateViewMode = {}));


/***/ }),

/***/ "./Client/app/shared/enums/interface-status.enum.ts":
/*!**********************************************************!*\
  !*** ./Client/app/shared/enums/interface-status.enum.ts ***!
  \**********************************************************/
/*! exports provided: InterfaceStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterfaceStatus", function() { return InterfaceStatus; });
var InterfaceStatus;
(function (InterfaceStatus) {
    InterfaceStatus[InterfaceStatus["ReadyToTransmit"] = 1] = "ReadyToTransmit";
    InterfaceStatus[InterfaceStatus["StandBy"] = 2] = "StandBy";
    InterfaceStatus[InterfaceStatus["TransmitError"] = 3] = "TransmitError";
    InterfaceStatus[InterfaceStatus["Interfaced"] = 4] = "Interfaced";
    InterfaceStatus[InterfaceStatus["Error"] = 5] = "Error";
    InterfaceStatus[InterfaceStatus["Rejected"] = 6] = "Rejected";
    InterfaceStatus[InterfaceStatus["Signed"] = 7] = "Signed";
    InterfaceStatus[InterfaceStatus["Completed"] = 8] = "Completed";
    InterfaceStatus[InterfaceStatus["InterfaceReady"] = 9] = "InterfaceReady";
    InterfaceStatus[InterfaceStatus["NotPosted"] = 10] = "NotPosted";
    InterfaceStatus[InterfaceStatus["NotInterfaced"] = 11] = "NotInterfaced";
})(InterfaceStatus || (InterfaceStatus = {}));


/***/ }),

/***/ "./Client/app/shared/enums/interface-type.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/interface-type.enum.ts ***!
  \********************************************************/
/*! exports provided: InterfaceType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterfaceType", function() { return InterfaceType; });
var InterfaceType;
(function (InterfaceType) {
    InterfaceType[InterfaceType["AccountingInterface"] = 1] = "AccountingInterface";
    InterfaceType[InterfaceType["PaymentRequestInterface"] = 2] = "PaymentRequestInterface";
})(InterfaceType || (InterfaceType = {}));


/***/ }),

/***/ "./Client/app/shared/services/Interface/dto/update-interface-status-command.ts":
/*!*************************************************************************************!*\
  !*** ./Client/app/shared/services/Interface/dto/update-interface-status-command.ts ***!
  \*************************************************************************************/
/*! exports provided: UpdateInterfaceStatusCommand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateInterfaceStatusCommand", function() { return UpdateInterfaceStatusCommand; });
var UpdateInterfaceStatusCommand = /** @class */ (function () {
    function UpdateInterfaceStatusCommand() {
        this.accountingInterfaceError = [];
    }
    return UpdateInterfaceStatusCommand;
}());



/***/ }),

/***/ "./Client/app/shared/services/configuration/dtos/company-configuration-record.ts":
/*!***************************************************************************************!*\
  !*** ./Client/app/shared/services/configuration/dtos/company-configuration-record.ts ***!
  \***************************************************************************************/
/*! exports provided: CompanyConfigurationRecord */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompanyConfigurationRecord", function() { return CompanyConfigurationRecord; });
var CompanyConfigurationRecord = /** @class */ (function () {
    function CompanyConfigurationRecord() {
    }
    return CompanyConfigurationRecord;
}());



/***/ }),

/***/ "./Client/app/shared/services/http-services/accounting-interface.service.ts":
/*!**********************************************************************************!*\
  !*** ./Client/app/shared/services/http-services/accounting-interface.service.ts ***!
  \**********************************************************************************/
/*! exports provided: AccountingInterfaceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountingInterfaceService", function() { return AccountingInterfaceService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../entities/http-services/http-request-options.entity */ "./Client/app/shared/entities/http-services/http-request-options.entity.ts");
/* harmony import */ var _Interface_dto_update_interface_status_command__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Interface/dto/update-interface-status-command */ "./Client/app/shared/services/Interface/dto/update-interface-status-command.ts");
/* harmony import */ var _http_base_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http-base.service */ "./Client/app/shared/services/http-services/http-base.service.ts");
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







var AccountingInterfaceService = /** @class */ (function (_super) {
    __extends(AccountingInterfaceService, _super);
    function AccountingInterfaceService(http, companyManager) {
        var _this = _super.call(this, http) || this;
        _this.companyManager = companyManager;
        _this.accountingInterfaceControllerUrl = 'accountinginterface';
        return _this;
    }
    AccountingInterfaceService.prototype.listErrorsForErrorManagement = function () {
        var company = this.companyManager.getCurrentCompanyId();
        var options = new _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_4__["HttpRequestOptions"]();
        return this.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].accountingInterfaceServiceLink + "/" + encodeURIComponent(String(company))
            + ("/" + this.accountingInterfaceControllerUrl + "/listerrorsforerrormanagement"), options);
    };
    // Update interface status
    AccountingInterfaceService.prototype.updateAccountingErrorStatus = function (interfaceError, interfaceStatus) {
        var company = this.companyManager.getCurrentCompanyId();
        var command = this.mapToUpdateInterfaceStatusCommand(interfaceError, interfaceStatus);
        return this.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].accountingInterfaceServiceLink + "/" + encodeURIComponent(String(company))
            + ("/" + this.accountingInterfaceControllerUrl + "/updatestatusofaccountingerror"), command);
    };
    AccountingInterfaceService.prototype.mapToUpdateInterfaceStatusCommand = function (interfaceError, interfaceStatus) {
        var command = new _Interface_dto_update_interface_status_command__WEBPACK_IMPORTED_MODULE_5__["UpdateInterfaceStatusCommand"]();
        command.accountingInterfaceError = interfaceError;
        command.accountingInterfaceStatus = interfaceStatus;
        return command;
    };
    AccountingInterfaceService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"]])
    ], AccountingInterfaceService);
    return AccountingInterfaceService;
}(_http_base_service__WEBPACK_IMPORTED_MODULE_6__["HttpBaseService"]));



/***/ }),

/***/ "./Client/app/shared/services/list-and-search/fxDeal-data-loader.ts":
/*!**************************************************************************!*\
  !*** ./Client/app/shared/services/list-and-search/fxDeal-data-loader.ts ***!
  \**************************************************************************/
/*! exports provided: FxDealDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FxDealDataLoader", function() { return FxDealDataLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../dtos/list-and-search/list-and-search-filter-dto.dto */ "./Client/app/shared/dtos/list-and-search/list-and-search-filter-dto.dto.ts");
/* harmony import */ var _http_services_trading_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../http-services/trading.service */ "./Client/app/shared/services/http-services/trading.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FxDealDataLoader = /** @class */ (function () {
    function FxDealDataLoader(tradingService) {
        this.tradingService = tradingService;
    }
    FxDealDataLoader.prototype.getData = function (filters, dataVersionId, offset, limit) {
        var filtersForColumns = filters.map(function (filter) {
            return new _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__["ListAndSearchFilterDto"](filter);
        });
        var request = {
            clauses: { clauses: filtersForColumns },
            offset: offset,
            limit: limit,
            dataVersionId: dataVersionId,
        };
        var list = this.tradingService.fxDealSearch(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data;
        }));
        return list;
    };
    FxDealDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_trading_service__WEBPACK_IMPORTED_MODULE_3__["TradingService"]])
    ], FxDealDataLoader);
    return FxDealDataLoader;
}());



/***/ }),

/***/ "./Client/app/shared/services/masterdata/department-data-loader.ts":
/*!*************************************************************************!*\
  !*** ./Client/app/shared/services/masterdata/department-data-loader.ts ***!
  \*************************************************************************/
/*! exports provided: DepartmentDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DepartmentDataLoader", function() { return DepartmentDataLoader; });
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



var DepartmentDataLoader = /** @class */ (function () {
    function DepartmentDataLoader(masterDataService) {
        this.masterDataService = masterDataService;
    }
    DepartmentDataLoader.prototype.getData = function (searchTerm, pagingOptions) {
        var list = this.masterDataService.getDepartments(searchTerm, pagingOptions)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data.value;
        }));
        return list;
    };
    DepartmentDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_2__["MasterdataService"]])
    ], DepartmentDataLoader);
    return DepartmentDataLoader;
}());



/***/ }),

/***/ "./Client/app/shared/services/trading/bank-broker-contextual-data-loader.ts":
/*!**********************************************************************************!*\
  !*** ./Client/app/shared/services/trading/bank-broker-contextual-data-loader.ts ***!
  \**********************************************************************************/
/*! exports provided: BankBrokerContextualDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BankBrokerContextualDataLoader", function() { return BankBrokerContextualDataLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _http_services_trading_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../http-services/trading.service */ "./Client/app/shared/services/http-services/trading.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BankBrokerContextualDataLoader = /** @class */ (function () {
    function BankBrokerContextualDataLoader(tradingService) {
        this.tradingService = tradingService;
    }
    BankBrokerContextualDataLoader.prototype.getData = function () {
        var filtersForColumns = [];
        var request = {
            clauses: { clauses: filtersForColumns },
        };
        var list = this.tradingService.bankBrokerContextualSearch(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data.value;
        }));
        return list;
    };
    BankBrokerContextualDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_trading_service__WEBPACK_IMPORTED_MODULE_2__["TradingService"]])
    ], BankBrokerContextualDataLoader);
    return BankBrokerContextualDataLoader;
}());



/***/ })

}]);
//# sourceMappingURL=common.js.map