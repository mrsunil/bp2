(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["reporting-reporting-module"],{

/***/ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.html":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.html ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <form [formGroup]=\"reportFormGroup\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start\"\r\n             fxLayoutGap=\"1%\"\r\n             fxLayoutAlign.lt-md=\"start center\">\r\n\r\n            <mat-card fxFlex=\"50%\"\r\n                      class=\"card-title\">\r\n\r\n                <h3>Report Parameters</h3>\r\n\r\n                <div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"left start\"\r\n                         fxLayoutGap=\"10%\">\r\n                        <div fxFlex=\"25%\">\r\n                            <atlas-document-type-dropdown #DocumentTypeDropdownComponent\r\n                                                          (docTypeSelectionChanged)=\"onDocumentTypeSelectionChanged($event)\">\r\n                            </atlas-document-type-dropdown>\r\n                        </div>\r\n                        <div fxFlex=\"30%\">\r\n                            <atlas-document-status-dropdown #DocumentStatusDropdownComponent\r\n                                                            (docStatusSelectionChanged)=\"onDocumentStatusSelectionChanged($event)\">\r\n                            </atlas-document-status-dropdown>\r\n                        </div>\r\n                        <div fxFlex=\"15%\">\r\n\r\n                            <mat-checkbox [checked]=\"showDetails\"\r\n                                          (change)=\"onShowDetailsChanged($event)\">Show Details</mat-checkbox>\r\n\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </mat-card>\r\n\r\n            <mat-card fxFlex=\"50%\"\r\n                      class=\"document-dates\">\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"left start\"\r\n                         fxLayoutGap=\"5%\">\r\n                        <h3>Documents Entered Between </h3>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"left start\"\r\n                         fxLayoutGap=\"5%\">\r\n                        <atlas-date-picker isEditable=true\r\n                                           label=\"From\"\r\n                                           [fieldControl]=\"enteredDateFromCtrl\"\r\n                                           [errorMap]=\"dateErrorMap\">\r\n                        </atlas-date-picker>\r\n\r\n                        <atlas-date-picker isEditable=true\r\n                                           label=\"To\"\r\n                                           [fieldControl]=\"enteredDateToCtrl\"\r\n                                           [errorMap]=\"dateErrorMap\">\r\n                        </atlas-date-picker>\r\n                    </div>\r\n                    <br />\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"left start\"\r\n                         fxLayoutGap=\"5%\">\r\n                        <h3>Documents Amended Between </h3>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"left start\"\r\n                         fxLayoutGap=\"5%\">\r\n                        <atlas-date-picker isEditable=true\r\n                                           label=\"From\"\r\n                                           [fieldControl]=\"amendedDateFromCtrl\"\r\n                                           [errorMap]=\"dateErrorMap\">\r\n                        </atlas-date-picker>\r\n\r\n                        <atlas-date-picker isEditable=true\r\n                                           label=\"To\"\r\n                                           [fieldControl]=\"amendeddDateToCtrl\"\r\n                                           [errorMap]=\"dateErrorMap\">\r\n                        </atlas-date-picker>\r\n\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"end center\">\r\n            <button mat-raised-button\r\n                    class=\"generate-report-button\"\r\n                    (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n        </div>\r\n    </form>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [showParameters]=\"showParameters\"\r\n                                 [parameters]=\"parameters\"\r\n                                 #ssrsReportViewer>\r\n        </atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.scss":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.scss ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 0 !important; }\n\nmat-card {\n  width: 100%; }\n\n.general-filters {\n  margin-top: 2%; }\n\n.report-container {\n  height: 60vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.ts":
/*!**************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.ts ***!
  \**************************************************************************************************************/
/*! exports provided: AccountingDocumentsReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountingDocumentsReportComponent", function() { return AccountingDocumentsReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/validators/date-validators.validator */ "./Client/app/shared/validators/date-validators.validator.ts");
/* harmony import */ var _components_document_status_dropdown_document_status_dropdown_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/document-status-dropdown/document-status-dropdown.component */ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.ts");
/* harmony import */ var _components_document_type_dropdown_document_type_dropdown_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/document-type-dropdown/document-type-dropdown.component */ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var AccountingDocumentsReportComponent = /** @class */ (function () {
    function AccountingDocumentsReportComponent(formBuilder, companyManager, route) {
        this.formBuilder = formBuilder;
        this.companyManager = companyManager;
        this.route = route;
        this.showDetails = true;
        this.dateErrorMap = new Map();
        this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].reportServerLink;
        this.reportPath = 'LDC Atlas/Accounting Documents/AccountingDocument';
        this.parameters = [];
        this.showParameters = true;
        this.company = this.route.snapshot.paramMap.get('company');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.dateErrorMap
            .set('isDateValid', 'The date cannot be in the future.');
    }
    AccountingDocumentsReportComponent.prototype.ngOnInit = function () {
        this.initForm();
    };
    AccountingDocumentsReportComponent.prototype.initForm = function () {
        this.initControls();
        this.reportFormGroup = this.formBuilder.group({
            amendedDateFromCtrl: this.amendedDateFromCtrl,
            amendeddDateToCtrl: this.amendeddDateToCtrl,
            enteredDateFromCtrl: this.enteredDateFromCtrl,
            enteredDateToCtrl: this.enteredDateToCtrl,
            DocumentStatusDropdownComponent: this.DocumentStatusDropdownComponent,
            DocumentTypeDropdownComponent: this.DocumentTypeDropdownComponent,
        });
    };
    AccountingDocumentsReportComponent.prototype.initControls = function () {
        this.enteredDateFromCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](null, [Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_6__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate(), true)]);
        this.enteredDateToCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](null, [Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_6__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate(), true)]);
        this.amendedDateFromCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](null, [Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_6__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate(), true)]);
        this.amendeddDateToCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](null, [Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_6__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate(), true)]);
    };
    AccountingDocumentsReportComponent.prototype.onGenerateReportButtonClicked = function () {
        if (this.reportFormGroup.valid) {
            if (this.docStatusselected.length === 1 && this.docStatusselected[0] === 'Posted(Today)') {
                this.initControls();
            }
            this.parameters = [];
            this.parameters = this.parameters.concat(this.getBasicParameters());
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
        }
    };
    AccountingDocumentsReportComponent.prototype.getBasicParameters = function () {
        var docType = this.docTypeSelected;
        var docstatus = this.docStatusselected;
        var parameters = [
            { name: 'CompanyID', value: this.company },
        ];
        if ((this.docTypeSelected[0] !== 'All')) {
            this.docTypeSelected.forEach(function (type) {
                parameters.push({ name: 'DocumentTypes', value: type });
            });
        }
        if ((this.docStatusselected[0] !== 'All')) {
            this.docStatusselected.forEach(function (status) {
                parameters.push({ name: 'DocumentStatus', value: status });
            });
        }
        parameters.push({ name: 'ShowDetails', value: (this.showDetails === true ? 1 : 0) });
        if (this.enteredDateFromCtrl.valid && this.enteredDateFromCtrl.value) {
            var enteredFrom = this.enteredDateFromCtrl.value.format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsEnteredBetweenFrom', value: enteredFrom });
        }
        if (this.enteredDateToCtrl.valid && this.enteredDateToCtrl.value) {
            var enteredTo = this.enteredDateToCtrl.value.format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsEnteredBetweenTo', value: enteredTo });
        }
        if (this.amendedDateFromCtrl.valid && this.amendedDateFromCtrl.value) {
            var amendedFrom = this.amendedDateFromCtrl.value.format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsAmendedBetweenFrom', value: amendedFrom });
        }
        if (this.amendeddDateToCtrl.valid && this.amendeddDateToCtrl.value) {
            var amendeddTo = this.amendeddDateToCtrl.value.format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsAmendedBetweenTo', value: amendeddTo });
        }
        parameters.push({ name: 'isAllDocumentTypesSelected', value: (this.docTypeSelected[0] === 'All') ? 1 : 0 });
        parameters.push({ name: 'isAllDocumentStatusSelected', value: (this.docStatusselected[0] === 'All') ? 1 : 0 });
        return parameters;
    };
    AccountingDocumentsReportComponent.prototype.onDocumentTypeSelectionChanged = function (docType) {
        this.docTypeSelected = docType;
    };
    AccountingDocumentsReportComponent.prototype.onDocumentStatusSelectionChanged = function (docStatus) {
        this.docStatusselected = docStatus;
        if (this.docStatusselected.length === 1 && this.docStatusselected[0] === 'Posted(Today)') {
            this.initControls();
        }
    };
    AccountingDocumentsReportComponent.prototype.onShowDetailsChanged = function (event) {
        this.showDetails = event.checked;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_5__["SSRSReportViewerComponent"])
    ], AccountingDocumentsReportComponent.prototype, "ssrsReportViewer", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_components_document_type_dropdown_document_type_dropdown_component__WEBPACK_IMPORTED_MODULE_8__["DocumentTypeDropdownComponent"]),
        __metadata("design:type", String)
    ], AccountingDocumentsReportComponent.prototype, "DocumentTypeDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_components_document_status_dropdown_document_status_dropdown_component__WEBPACK_IMPORTED_MODULE_7__["DocumentStatusDropdownComponent"]),
        __metadata("design:type", String)
    ], AccountingDocumentsReportComponent.prototype, "DocumentStatusDropdownComponent", void 0);
    AccountingDocumentsReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-accounting-documents-report',
            template: __webpack_require__(/*! ./accounting-documents-report.component.html */ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.html"),
            styles: [__webpack_require__(/*! ./accounting-documents-report.component.scss */ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_4__["CompanyManagerService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], AccountingDocumentsReportComponent);
    return AccountingDocumentsReportComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.html":
/*!*************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.html ***!
  \*************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [formGroup]=\"formGroup\">\r\n    <atlas-contextual-search-multiple-autocomplete-select #documentStatusDropdownComponent\r\n                                                          [options]=\"documentStatus\"\r\n                                                          [selectedOptions]=\"[]\"\r\n                                                          [allOptionsElement]=\"allTransDocStatusOption\"\r\n                                                          [allSelected]=\"allDocumentStatusSelected\"\r\n                                                          displayCode=\"true\"\r\n                                                          valueProperty=\"enumEntityId\"\r\n                                                          codeProperty=\"enumEntityValue\"\r\n                                                          placeholder=\"Document Status\"\r\n                                                          placeholderFilter=\"Document Status\"\r\n                                                          elementName=\"Document Status\"\r\n                                                          (selectionChangedEvent)=\"onDocumentStatusChanged($event)\">\r\n    </atlas-contextual-search-multiple-autocomplete-select>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.scss":
/*!*************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.scss ***!
  \*************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.ts":
/*!***********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.ts ***!
  \***********************************************************************************************************************************************/
/*! exports provided: DocumentStatusDropdownComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentStatusDropdownComponent", function() { return DocumentStatusDropdownComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_select_multiple_autocomplete_select_multiple_autocomplete_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component */ "./Client/app/shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/services/http-services/execution.service */ "./Client/app/shared/services/http-services/execution.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component */ "./Client/app/shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component.ts");
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









var DocumentStatusDropdownComponent = /** @class */ (function (_super) {
    __extends(DocumentStatusDropdownComponent, _super);
    function DocumentStatusDropdownComponent(formBuilder, utilService, executionService, masterdataService, route, formConfigurationProvider) {
        var _this = _super.call(this) || this;
        _this.formBuilder = formBuilder;
        _this.utilService = utilService;
        _this.executionService = executionService;
        _this.masterdataService = masterdataService;
        _this.route = route;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.docStatusSelectionChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.allTransDocStatusOption = {
            enumEntityId: 0,
            enumEntityValue: 'All',
        };
        _this.postedTodayOption = {
            enumEntityId: 100,
            enumEntityValue: 'Posted(Today)',
        };
        _this.docStatusIds = [];
        _this.documentStatus = [];
        _this.allDocumentStatusSelected = true;
        return _this;
    }
    DocumentStatusDropdownComponent.prototype.ngOnInit = function () {
        //  this.initializeForm();
        this.initdocumentStatus();
        this.initForm();
    };
    DocumentStatusDropdownComponent.prototype.initdocumentStatus = function () {
        this.documentStatus = this.route.snapshot.data.masterdata.transactionDocumentStatus.filter(function (documentStatus) {
            return documentStatus.enumEntityValue !== 'Posted';
        });
        this.documentStatusDropdownComponent.options = this.documentStatus;
        this.documentStatusDropdownComponent.options.push(this.postedTodayOption);
        this.documentStatusDropdownComponent.optionsChanged();
    };
    DocumentStatusDropdownComponent.prototype.onDocumentStatusChanged = function (documentStatus) {
        if (documentStatus) {
            if (this.documentStatusDropdownComponent.allSelected) {
                this.docStatusIds.push(this.allTransDocStatusOption.enumEntityValue);
            }
            else {
                this.docStatusIds = documentStatus.map(function (documentStatu) { return documentStatu.enumEntityValue; });
            }
        }
        this.docStatusSelectionChanged.emit(this.docStatusIds);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('documentStatusDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_8__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], DocumentStatusDropdownComponent.prototype, "documentStatusDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], DocumentStatusDropdownComponent.prototype, "docStatusSelectionChanged", void 0);
    DocumentStatusDropdownComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-document-status-dropdown',
            template: __webpack_require__(/*! ./document-status-dropdown.component.html */ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.html"),
            styles: [__webpack_require__(/*! ./document-status-dropdown.component.scss */ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_7__["UtilService"],
            _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_5__["ExecutionService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__["MasterdataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__["FormConfigurationProviderService"]])
    ], DocumentStatusDropdownComponent);
    return DocumentStatusDropdownComponent;
}(_shared_components_select_multiple_autocomplete_select_multiple_autocomplete_component__WEBPACK_IMPORTED_MODULE_3__["SelectMultipleAutocompleteComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.html":
/*!*********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.html ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [formGroup]=\"formGroup\">\r\n    <atlas-contextual-search-multiple-autocomplete-select #documentTypeDropdownComponent\r\n                                                          [options]=\"documentType\"\r\n                                                          [selectedOptions]=\"[]\"\r\n                                                          [allOptionsElement]=\"allTransDocTypeOption\"\r\n                                                          [allSelected]=\"allDocumentTypeSelected\"\r\n                                                          displayCode=\"true\"\r\n                                                          valueProperty=\"transactionDocumentTypeId\"\r\n                                                          codeProperty=\"label\"\r\n                                                          placeholder=\"Document Type\"\r\n                                                          placeholderFilter=\"Document Type\"\r\n                                                          elementName=\"Document Type\"\r\n                                                          (selectionChangedEvent)=\"onDocumentTypeChanged($event)\">\r\n    </atlas-contextual-search-multiple-autocomplete-select>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.scss":
/*!*********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.scss ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.ts":
/*!*******************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.ts ***!
  \*******************************************************************************************************************************************/
/*! exports provided: DocumentTypeDropdownComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentTypeDropdownComponent", function() { return DocumentTypeDropdownComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_select_multiple_autocomplete_select_multiple_autocomplete_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component */ "./Client/app/shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/services/http-services/execution.service */ "./Client/app/shared/services/http-services/execution.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component */ "./Client/app/shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component.ts");
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









var DocumentTypeDropdownComponent = /** @class */ (function (_super) {
    __extends(DocumentTypeDropdownComponent, _super);
    function DocumentTypeDropdownComponent(formBuilder, utilService, executionService, masterdataService, route, formConfigurationProvider) {
        var _this = _super.call(this) || this;
        _this.formBuilder = formBuilder;
        _this.utilService = utilService;
        _this.executionService = executionService;
        _this.masterdataService = masterdataService;
        _this.route = route;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.docTypeSelectionChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.allTransDocTypeOption = {
            transactionDocumentTypeId: 0,
            label: 'All',
            description: 'All',
        };
        _this.docTypeIds = [];
        _this.documentType = [];
        _this.allDocumentTypeSelected = true;
        return _this;
    }
    DocumentTypeDropdownComponent.prototype.ngOnInit = function () {
        this.initdocumentStatus();
        this.initForm();
    };
    DocumentTypeDropdownComponent.prototype.initdocumentStatus = function () {
        this.documentType = this.route.snapshot.data.masterdata.transactionDocumentType.filter(function (DocumentType) {
            return DocumentType.label !== 'MC';
        });
        if (this.documentType && this.documentType.length > 8) {
            var swapRecord = this.documentType[6];
            this.documentType[6] = this.documentType[8];
            this.documentType[8] = swapRecord;
        }
        this.documentTypeDropdownComponent.options = this.documentType;
        this.documentTypeDropdownComponent.optionsChanged();
        this.initForm();
    };
    DocumentTypeDropdownComponent.prototype.onDocumentTypeChanged = function (documentType) {
        if (documentType) {
            if (this.documentTypeDropdownComponent.allSelected) {
                this.docTypeIds.push(this.allTransDocTypeOption.label);
            }
            else {
                this.docTypeIds = documentType.map(function (docType) { return docType.label; });
            }
        }
        this.docTypeSelectionChanged.emit(this.docTypeIds);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('documentTypeDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_8__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], DocumentTypeDropdownComponent.prototype, "documentTypeDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], DocumentTypeDropdownComponent.prototype, "docTypeSelectionChanged", void 0);
    DocumentTypeDropdownComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-document-type-dropdown',
            template: __webpack_require__(/*! ./document-type-dropdown.component.html */ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.html"),
            styles: [__webpack_require__(/*! ./document-type-dropdown.component.scss */ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_7__["UtilService"],
            _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_5__["ExecutionService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__["MasterdataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__["FormConfigurationProviderService"]])
    ], DocumentTypeDropdownComponent);
    return DocumentTypeDropdownComponent;
}(_shared_components_select_multiple_autocomplete_select_multiple_autocomplete_component__WEBPACK_IMPORTED_MODULE_3__["SelectMultipleAutocompleteComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.html ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayoutAlign=\"space-between center\">\r\n    <h2>{{this.dialogData.reportName}}</h2>\r\n    <button mat-button>\r\n        <mat-icon (click)=\"onCloseButtonClicked()\">close</mat-icon>\r\n    </button>\r\n</div>\r\n<div class=\"report-container-full-content\">\r\n    <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\" [reportUrl]=\"path\"\r\n                                                              [showParameters]=\"showParameters\"\r\n                                                              [parameters]=\"parameters\"\r\n                                                              #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.scss":
/*!*****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.scss ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.ts":
/*!***************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: CustomReportViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomReportViewerComponent", function() { return CustomReportViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var CustomReportViewerComponent = /** @class */ (function () {
    function CustomReportViewerComponent(thisDialogRef, data, companyManager) {
        this.thisDialogRef = thisDialogRef;
        this.data = data;
        this.companyManager = companyManager;
        this.parameters = [];
        this.showParameters = true;
        this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportServerLink;
        this.dialogData = data;
    }
    CustomReportViewerComponent.prototype.ngOnInit = function () {
        this.company = this.companyManager.getCurrentCompanyId();
        this.parameters = [];
        if (this.dialogData.dataVersionId) {
            this.parameters.push({ name: 'Database', value: this.dialogData.dataVersionId });
        }
        this.path = this.dialogData.reportPath.substring(1);
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.path, this.parameters);
    };
    CustomReportViewerComponent.prototype.onCloseButtonClicked = function () {
        this.thisDialogRef.close(true);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_4__["SSRSReportViewerComponent"])
    ], CustomReportViewerComponent.prototype, "ssrsReportViewer", void 0);
    CustomReportViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-custom-report-viewer',
            template: __webpack_require__(/*! ./custom-report-viewer.component.html */ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.html"),
            styles: [__webpack_require__(/*! ./custom-report-viewer.component.scss */ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.scss")],
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"]])
    ], CustomReportViewerComponent);
    return CustomReportViewerComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/custom-reports/custom-reports.component.html":
/*!**************************************************************************************!*\
  !*** ./Client/app/reporting/components/custom-reports/custom-reports.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card *ngIf=\"isLoading\">\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"center center\"\r\n         fxLayoutWrap\r\n         class=\"loading\">\r\n        <mat-spinner color=\"accent\"></mat-spinner>\r\n    </div>\r\n</mat-card>\r\n<div class=\"main-container\"\r\n     [ngClass]=\"{'hidden-during-loading':isLoading}\">\r\n    <mat-card class=\"custom-report-mat-card\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start none\"\r\n             class=\"search\">\r\n            <form fxFlex=\"100%\">\r\n                <mat-form-field>\r\n                    <input specialIsAlphaNumeric\r\n                           matInput\r\n                           placeholder=\"Search report name\"\r\n                           (keydown.enter)=\"onSearchButtonClicked()\"\r\n                           [formControl]=\"searchedValueCtrl\" />\r\n                </mat-form-field>\r\n            </form>\r\n            <button mat-raised-button\r\n                    (click)=\"onSearchButtonClicked()\"\r\n                    class=\"heroGradient\"\r\n                    id=\"search-button\">\r\n                <mat-icon aria-label=\"Search\"\r\n                          class=\"search-icon\">search</mat-icon>\r\n            </button>\r\n        </div>\r\n    </mat-card>\r\n    <mat-card>\r\n        <div fxLayout=\"row\"\r\n             fxLayout.xs=\"column\"\r\n             fxLayoutAlign=\"space-between left\"\r\n             fxLayoutWrap\r\n             fxLayoutGap=\"20px\"\r\n             class=\"atlas-grid-card-header\">\r\n            <h2 class=\"atlas-grid-card-title\">Reports</h2>\r\n            <atlas-ag-grid-user-preferences *ngIf=\"customReportGridOptions && customReportGridOptions.columnDefs\"\r\n                                            [gridOptions]=\"customReportGridOptions\"\r\n                                            [company]=\"company\"\r\n                                            [gridId]=\"gridCode\"\r\n                                            [showExport]=\"true\"\r\n                                            [sharingEnabled]=\"hasGridSharing\"\r\n                                            #userPreferences>\r\n            </atlas-ag-grid-user-preferences>\r\n        </div>\r\n        <div ag-grid=\"customReportGridOptions\"\r\n             class=\"ag-theme-material pointer-cursor\"\r\n             style=\"width: 100%; height: 100%\">\r\n            <ag-grid-angular style=\" height: 100%;\"\r\n                             class=\"ag-theme-material\"\r\n                             [rowData]=\"customReportGridRows\"\r\n                             [columnDefs]=\"customReportGridCols\"\r\n                             [enableColResize]=\"true\"\r\n                             [suppressSizeToFit]=false\r\n                             [pagination]=\"true\"\r\n                             [paginationPageSize]=\"10\"\r\n                             [enableSorting]=\"true\"\r\n                             domLayout=\"autoHeight\"\r\n                             (gridReady)=\"onGridReady($event)\"\r\n                             (rowClicked)=\"onCustomReportRowClicked($event)\"\r\n                             enableFilter\r\n                             [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                             (columnVisible)=\"onColumnVisibilityChanged($event)\">\r\n            </ag-grid-angular>\r\n        </div>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/custom-reports/custom-reports.component.scss":
/*!**************************************************************************************!*\
  !*** ./Client/app/reporting/components/custom-reports/custom-reports.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".custom-report-mat-card {\n  width: 50% !important; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/custom-reports/custom-reports.component.ts":
/*!************************************************************************************!*\
  !*** ./Client/app/reporting/components/custom-reports/custom-reports.component.ts ***!
  \************************************************************************************/
/*! exports provided: CustomReportsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomReportsComponent", function() { return CustomReportsComponent; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../core/services/authorization.service */ "./Client/app/core/services/authorization.service.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../shared/enums/functional-area.enum */ "./Client/app/shared/enums/functional-area.enum.ts");
/* harmony import */ var _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../shared/enums/permission-level.enum */ "./Client/app/shared/enums/permission-level.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../shared/services/http-services/document.service */ "./Client/app/shared/services/http-services/document.service.ts");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _custom_report_viewer_custom_report_viewer_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./custom-report-viewer/custom-report-viewer.component */ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

















var CustomReportsComponent = /** @class */ (function () {
    function CustomReportsComponent(securityService, route, datePipe, dialog, gridService, window, authorizationService, documentService, uiService) {
        this.securityService = securityService;
        this.route = route;
        this.datePipe = datePipe;
        this.dialog = dialog;
        this.gridService = gridService;
        this.window = window;
        this.authorizationService = authorizationService;
        this.documentService = documentService;
        this.uiService = uiService;
        this.isLoading = true;
        this.gridCode = 'customReportList';
        this.searchedValueCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_8__["AtlasFormControl"]('searchedValue');
        this.customReportGridOptions = {};
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.parameters = [];
        this.customReportReadPrivilege = {
            privilegeName: '',
            profileId: null,
            permission: _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_11__["PermissionLevels"].Read,
            privilegeParentLevelOne: '',
            privilegeParentLevelTwo: null,
        };
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }
    CustomReportsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.company = this.route.snapshot.params['company'];
        this.functionalAreas = [
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].AccountingEntries],
            },
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Charters],
            },
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Trades],
            },
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Counterparties],
            },
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].NominalAccountLedger],
            },
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Users],
            },
            {
                enumEntityId: null,
                enumEntityValue: _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Vessels],
            },
        ];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.securityService.isSecurityReady().subscribe(function () {
            _this.initCustomReportGridColumns();
            _this.getReportList();
            _this.atlasAgGridParam = _this.gridService.getAgGridParam();
        });
    };
    CustomReportsComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        params.columnDefs = this.customReportGridCols;
        this.customReportGridOptions = params;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = function () {
            _this.gridColumnApi.autoSizeAllColumns();
        };
    };
    CustomReportsComponent.prototype.onCustomReportRowClicked = function (event) {
        var openTradepnlReportDialog = this.dialog.open(_custom_report_viewer_custom_report_viewer_component__WEBPACK_IMPORTED_MODULE_16__["CustomReportViewerComponent"], {
            data: {
                reportName: event.data.name,
                reportPath: event.data.path,
            },
            width: '90%',
            height: '90%',
        });
    };
    CustomReportsComponent.prototype.initCustomReportGridColumns = function () {
        this.customReportGridCols = [
            {
                headerName: 'Report name',
                colId: 'name',
                field: 'name',
                minWidth: 150,
                maxWidth: 150,
            },
            {
                headerName: 'Report description',
                colId: 'description',
                field: 'description',
                tooltip: this.showCellValue.bind(this),
                valueFormatter: this.descriptionFormatter.bind(this),
            },
            {
                headerName: 'Report creator',
                colId: 'createdBy',
                field: 'createdBy',
            },
            {
                headerName: 'Linked menu',
                colId: 'linkedMenu',
                field: 'linkedMenu',
            },
            {
                headerName: 'Company',
                colId: 'company',
                field: 'company',
            },
            {
                headerName: 'Date of creation',
                colId: 'createdDateTime',
                field: 'createdDateTime',
                valueFormatter: this.uiService.dateFormatter,
            },
            {
                headerName: 'Date of modification',
                colId: 'modifiedDateTime',
                field: 'modifiedDateTime',
                valueFormatter: this.uiService.dateFormatter,
            },
        ];
    };
    CustomReportsComponent.prototype.showCellValue = function (params) {
        if (params) {
            return params.value;
        }
    };
    CustomReportsComponent.prototype.descriptionFormatter = function (params) {
        if (params && params.value) {
            if (params.value.length > 10) {
                return params.value.substring(0, 10);
            }
        }
    };
    CustomReportsComponent.prototype.checkIfUserHasRequiredPrivileges = function (userCompanyPrivilege) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            var userPermissionLevel = this.authorizationService.getPermissionLevel(this.company, userCompanyPrivilege.privilegeName, userCompanyPrivilege.privilegeParentLevelTwo, userCompanyPrivilege.privilegeParentLevelOne);
            if (userPermissionLevel < userCompanyPrivilege.permission) {
                return false;
            }
        }
        return true;
    };
    CustomReportsComponent.prototype.getReportList = function () {
        var _this = this;
        // temporarily hardcoded
        var documentType = 76;
        this.documentService.getTemplates(documentType).subscribe(function (data) {
            if (data) {
                for (var i = 0; i < data.value.length; i++) {
                    var split = data.value[i].path.split('/');
                    data.value[i].company = split[2];
                    data.value[i].linkedMenu = split[3];
                }
                // If user has access to particular company
                // then only related reports will be visible for user
                var companyListByAccess_1 = [];
                companyListByAccess_1.push('mc');
                _this.masterdata.companies.forEach(function (company) {
                    var isCompanyAccess = true;
                    if (_this.authorizationService.isUserAllowedForCompany(company.companyId)) {
                        companyListByAccess_1.push(company.companyId);
                    }
                });
                // If user has privilege for particular functional area
                // then only related reports will be visible for user
                var functionalAreaByAccess_1 = [];
                _this.functionalAreas.forEach(function (area) {
                    if (area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Trades]
                        || area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Charters]) {
                        _this.customReportReadPrivilege.privilegeParentLevelOne = area.enumEntityValue;
                        _this.customReportReadPrivilege.privilegeParentLevelTwo = null;
                    }
                    else if (area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Counterparties]
                        || area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].NominalAccountLedger]
                        || area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Vessels]) {
                        _this.customReportReadPrivilege.privilegeParentLevelOne = 'MasterData';
                        _this.customReportReadPrivilege.privilegeParentLevelTwo = null;
                    }
                    else if (area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].AccountingEntries]) {
                        _this.customReportReadPrivilege.privilegeParentLevelOne = 'Financials';
                        _this.customReportReadPrivilege.privilegeParentLevelTwo = area.enumEntityValue;
                    }
                    else if (area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Users]) {
                        _this.customReportReadPrivilege.privilegeParentLevelOne = 'Administration';
                        _this.customReportReadPrivilege.privilegeParentLevelTwo = area.enumEntityValue;
                    }
                    _this.customReportReadPrivilege.privilegeName = (area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Counterparties]
                        || area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].NominalAccountLedger]
                        || area.enumEntityValue === _shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"][_shared_enums_functional_area_enum__WEBPACK_IMPORTED_MODULE_10__["FunctionalArea"].Vessels])
                        ? 'MasterData' : area.enumEntityValue;
                    if (_this.checkIfUserHasRequiredPrivileges(_this.customReportReadPrivilege)) {
                        functionalAreaByAccess_1.push(area.enumEntityValue);
                    }
                });
                _this.customReportList = data.value;
                _this.customReportGridRows = _this.customReportList.filter(function (a) {
                    return companyListByAccess_1.includes(a.company) && functionalAreaByAccess_1.includes(a.linkedMenu);
                });
                if (_this.gridApi) {
                    if (_this.gridApi) {
                        _this.gridApi.sizeColumnsToFit();
                    }
                }
                _this.isLoading = false;
            }
        });
    };
    CustomReportsComponent.prototype.onSearchButtonClicked = function () {
        var reportName = this.searchedValueCtrl.value;
        this.filteredCustomReports = reportName ?
            this.customReportList.filter(function (column) { return column.name.toLowerCase().includes(reportName.toLowerCase()); })
            : this.customReportList;
        this.customReportGridRows = this.filteredCustomReports;
        this.isLoading = false;
    };
    CustomReportsComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    CustomReportsComponent.prototype.onGridSizeChanged = function (params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    };
    CustomReportsComponent.prototype.onColumnVisibilityChanged = function (column) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
        this.customReportGridOptions.columnApi.autoSizeAllColumns();
    };
    CustomReportsComponent.prototype.showOrHideColum = function (event, col) {
        var cols = this.customReportGridCols.filter(function (colf) { return colf.colId === col.colId; });
        if (cols.length === 1) {
            cols[0].hide = !(col.hide || false);
            this.gridColumnApi.setColumnVisible(col.colId, !cols[0].hide);
        }
        event.stopPropagation();
        return false;
    };
    CustomReportsComponent.prototype.onRefreshButtonClicked = function () {
        var _this = this;
        this.gridColumnApi.resetColumnState();
        this.customReportGridCols.forEach(function (colf) {
            colf.hide = !_this.gridColumnApi.getColumn(colf.colId).isVisible();
        });
        this.customReportGridOptions.columnApi.autoSizeAllColumns();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_6__["AgGridUserPreferencesComponent"])
    ], CustomReportsComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_7__["SSRSReportViewerComponent"])
    ], CustomReportsComponent.prototype, "ssrsReportViewer", void 0);
    CustomReportsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'atlas-custom-reports',
            template: __webpack_require__(/*! ./custom-reports.component.html */ "./Client/app/reporting/components/custom-reports/custom-reports.component.html"),
            styles: [__webpack_require__(/*! ./custom-reports.component.scss */ "./Client/app/reporting/components/custom-reports/custom-reports.component.scss")],
            providers: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["DatePipe"]],
        }),
        __param(5, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_9__["WINDOW"])),
        __metadata("design:paramtypes", [_shared_services_security_service__WEBPACK_IMPORTED_MODULE_14__["SecurityService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["DatePipe"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_12__["AgGridService"],
            Window,
            _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_5__["AuthorizationService"],
            _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_13__["DocumentService"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_15__["UiService"]])
    ], CustomReportsComponent);
    return CustomReportsComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.html":
/*!************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='main-container'>\r\n    <form [formGroup]=\"formGroup\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"space-around center\">\r\n            <mat-card>\r\n                <mat-card-header>\r\n                    <mat-card-title>\r\n                        <h2>General filters</h2>\r\n                    </mat-card-title>\r\n                </mat-card-header>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutGap=\"5%\">\r\n                        <atlas-date-picker isEditable=true\r\n                                           label=\"From\"\r\n                                           [fieldControl]=\"dateFromCtrl\"\r\n                                           [errorMap]=\"dateErrorMap\"\r\n                                           (dateChanged)=\"onDateChanged()\">\r\n                        </atlas-date-picker>\r\n                        <atlas-date-picker isEditable=true\r\n                                           label=\"To\"\r\n                                           [fieldControl]=\"dateToCtrl\"\r\n                                           [errorMap]=\"ToDateErrorMap\"\r\n                                           (dateChanged)=\"onDateChanged()\">\r\n                        </atlas-date-picker>\r\n                        <atlas-dropdown-select label=\"Snapshot\"\r\n                                               [fieldControl]=\"snapshotCtrl\"\r\n                                               isEditable=true\r\n                                               [options]=\"snapshotOptions\"\r\n                                               displayProperty=\"freezeDate\"\r\n                                               [selectProperties]=\"['freezeDate']\">\r\n                        </atlas-dropdown-select>\r\n                    </div>\r\n                    <mat-divider></mat-divider>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutGap=\"5%\"\r\n                         class=\"general-filters\">\r\n                        <atlas-dropdown-select label=\"Functional object\"\r\n                                               [fieldControl]=\"functionalObjectCtrl\"\r\n                                               isEditable=true\r\n                                               [options]=\"functionalObjectOptions\"\r\n                                               displayProperty=\"functionalObjectName\"\r\n                                               [selectProperties]=\"['functionalObjectName']\"\r\n                                               (optionSelected)=\"onFunctionalObjectSelected($event)\">\r\n                        </atlas-dropdown-select>\r\n                        <atlas-dropdown-select label=\"User\"\r\n                                               [fieldControl]=\"userCtrl\"\r\n                                               isEditable=true\r\n                                               [options]=\"userFilteredOptions\"\r\n                                               isAutocompleteActivated=true\r\n                                               displayProperty=\"displayName\"\r\n                                               [selectProperties]=\"['displayName']\">\r\n                        </atlas-dropdown-select>\r\n                        <atlas-dropdown-select label=\"Type of event\"\r\n                                               [options]=\"eventTypeOptions\"\r\n                                               [fieldControl]=\"eventCtrl\"\r\n                                               isEditable=true\r\n                                               (optionSelected)=\"onEventTypeSelected($event)\"\r\n                                               multiselect=true>\r\n                        </atlas-dropdown-select>\r\n                        <atlas-dropdown-select label=\"Functional context\"\r\n                                               [options]=\"functionalContextOptions\"\r\n                                               [fieldControl]=\"functionalContextCtrl\"\r\n                                               isEditable=true>\r\n                        </atlas-dropdown-select>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             *ngIf=\"predefinedKeys.length > 0\">\r\n            <mat-card>\r\n                <mat-card-header>\r\n                    <mat-card-title>\r\n                        <h2>Key fields</h2>\r\n                    </mat-card-title>\r\n                </mat-card-header>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row wrap\"\r\n                         fxLayoutGap=\"2%\">\r\n                        <atlas-form-input *ngFor=\"let key of predefinedKeys; trackBy:trackKeyFields\"\r\n                                          isEditable=true\r\n                                          [id]=\"key.fieldId\"\r\n                                          [label]=\"key.friendlyName.concat(' (', key.type, ')')\"\r\n                                          [errorMap]=\"keysErrorMap\"\r\n                                          #keyFields>\r\n                        </atlas-form-input>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutGap=\"2%\">\r\n            <mat-card *ngIf=\"additionalFilterOptions && additionalFilterOptions.length > 0\">\r\n                <mat-card-header>\r\n                    <mat-card-title>\r\n                        <h2>Additional filter</h2>\r\n                    </mat-card-title>\r\n                </mat-card-header>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutGap=\"1%\">\r\n                        <atlas-dropdown-select label=\"Key\"\r\n                                               [options]=\"additionalFilterOptions\"\r\n                                               [fieldControl]=\"additionalKeyCtrl\"\r\n                                               isEditable=true\r\n                                               displayProperty=\"fieldName\"\r\n                                               [selectProperties]=\"['tableName', 'friendlyName']\">\r\n                        </atlas-dropdown-select>\r\n                        <atlas-form-input [fieldControl]=\"oldValueCtrl\"\r\n                                          isEditable=true\r\n                                          [errorMap]=\"keysErrorMap\"\r\n                                          label=\"Old value\"\r\n                                          #additionalFilterOldValue>\r\n                        </atlas-form-input>\r\n                        <atlas-form-input [fieldControl]=\"newValueCtrl\"\r\n                                          isEditable=true\r\n                                          [errorMap]=\"keysErrorMap\"\r\n                                          label=\"New value\"\r\n                                          #additionalFilterNewValue>\r\n                        </atlas-form-input>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n            <mat-card>\r\n                <mat-card-header>\r\n                    <mat-card-title>\r\n                        <h2>Display options</h2>\r\n                    </mat-card-title>\r\n                </mat-card-header>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutGap=\"5%\">\r\n                        <atlas-dropdown-select label=\"Order by\"\r\n                                               [options]=\"orderByOptions\"\r\n                                               [fieldControl]=\"orderByCtrl\"\r\n                                               isEditable=true\r\n                                               [selectProperties]=\"['name']\">\r\n                        </atlas-dropdown-select>\r\n                        <atlas-dropdown-select label=\"Display with\"\r\n                                               [options]=\"displayWithOptions\"\r\n                                               [fieldControl]=\"displayOptionCtrl\"\r\n                                               isEditable=true\r\n                                               [selectProperties]=\"['name']\">\r\n                        </atlas-dropdown-select>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"end center\">\r\n            <button mat-raised-button\r\n                    class=\"generate-report-button\"\r\n                    (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n        </div>\r\n    </form>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 #ssrsReportViewer>\r\n        </atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.scss":
/*!************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.scss ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 0 !important; }\n\nmat-card {\n  width: 100%; }\n\n.general-filters {\n  margin-top: 2%; }\n\n.report-container {\n  height: 60vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.ts ***!
  \**********************************************************************************************************/
/*! exports provided: AuditReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditReportComponent", function() { return AuditReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_enums_atlas_service_names_enum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/enums/atlas-service-names.enum */ "./Client/app/shared/enums/atlas-service-names.enum.ts");
/* harmony import */ var _shared_enums_event_type_enum__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/enums/event-type.enum */ "./Client/app/shared/enums/event-type.enum.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_http_services_configuration_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/services/http-services/configuration.service */ "./Client/app/shared/services/http-services/configuration.service.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/services/http-services/reporting.service */ "./Client/app/shared/services/http-services/reporting.service.ts");
/* harmony import */ var _shared_services_http_services_user_identity_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/services/http-services/user-identity.service */ "./Client/app/shared/services/http-services/user-identity.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../shared/validators/date-validators.validator */ "./Client/app/shared/validators/date-validators.validator.ts");
/* harmony import */ var _entities_display_options_entity__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../entities/display-options.entity */ "./Client/app/reporting/entities/display-options.entity.ts");
/* harmony import */ var _entities_order_by_options_entity__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../entities/order-by-options.entity */ "./Client/app/reporting/entities/order-by-options.entity.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};























var AuditReportComponent = /** @class */ (function () {
    function AuditReportComponent(formBuilder, route, companyManager, freezeService, configurationService, userIdentityService, reportingService, snackbarService, utilService, titleService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.companyManager = companyManager;
        this.freezeService = freezeService;
        this.configurationService = configurationService;
        this.userIdentityService = userIdentityService;
        this.reportingService = reportingService;
        this.snackbarService = snackbarService;
        this.utilService = utilService;
        this.titleService = titleService;
        this.alphanumericPattern = '^[a-zA-Z0-9.]*$';
        this.userCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.eventCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.functionalContextCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.additionalKeyCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].reportServerLink;
        this.reportPath = 'LDC Atlas/Audit/Audit';
        this.parameters = [];
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.snapshotOptions = [];
        this.functionalObjectOptions = [];
        this.userOptions = [];
        this.userFilteredOptions = [];
        this.selectedEventTypes = [];
        this.eventTypeOptions = [];
        this.functionalContextOptions = [];
        this.additionalFilterOptions = [];
        this.displayWithOptions = [];
        this.orderByOptions = [];
        this.predefinedKeys = [];
        this.keysErrorMap = new Map();
        this.currentSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__["FreezeDisplayView"](-1, 'CURRENT');
        this.filters = [];
        this.dynamicControls = [];
        this.dateErrorMap = new Map();
        this.ToDateErrorMap = new Map();
        this.company = this.route.snapshot.paramMap.get('company');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.displayWithOptions = _entities_display_options_entity__WEBPACK_IMPORTED_MODULE_21__["DisplayOptions"].getOptionList();
        this.orderByOptions = _entities_order_by_options_entity__WEBPACK_IMPORTED_MODULE_22__["OrderByOptions"].getOptionList();
        this.eventTypeOptions = Object.values(_shared_enums_event_type_enum__WEBPACK_IMPORTED_MODULE_11__["EventType"]).filter(function (value) { return typeof value === 'string'; });
        this.functionalContextOptions = Object.values(_shared_enums_atlas_service_names_enum__WEBPACK_IMPORTED_MODULE_10__["AtlasServiceNames"]).filter(function (value) { return typeof value === 'string'; });
        this.keysErrorMap.set('pattern', 'Not accepted format');
        this.dateErrorMap
            .set('isDateValid', 'The date cannot be in the future.');
        this.ToDateErrorMap
            .set('isDateValid', 'The date cannot be in the future.')
            .set('isBeforeDateValid', 'To date cannot be before the from date');
    }
    AuditReportComponent.prototype.ngOnInit = function () {
        this.initForm();
        this.loadData();
        this.titleService.setTitle(this.route.snapshot.data.title);
    };
    AuditReportComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.keyFields.changes
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$))
            .subscribe(function (components) {
            _this.dynamicControls.forEach(function (control) {
                _this.formGroup.removeControl(control);
            });
            components.forEach(function (component) {
                var controlName = String(component.id);
                _this.dynamicControls.push(controlName);
                component.fieldControl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(_this.alphanumericPattern));
                _this.formGroup.addControl(controlName, component.fieldControl);
            });
            _this.formGroup.updateValueAndValidity();
        });
    };
    AuditReportComponent.prototype.onDateChanged = function () {
        this.setDateValidators();
    };
    AuditReportComponent.prototype.setDateValidators = function () {
        this.dateToCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_20__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate()), (Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_20__["isDateBeforeControlDate"])(moment__WEBPACK_IMPORTED_MODULE_3__(this.dateFromCtrl.value)))]));
        this.dateToCtrl.updateValueAndValidity();
    };
    AuditReportComponent.prototype.initForm = function () {
        this.initControls();
        this.subscribeForChanges();
        this.formGroup = this.formBuilder.group({
            dateFromCtrl: this.dateFromCtrl,
            dateToCtrl: this.dateToCtrl,
            snapshotCtrl: this.snapshotCtrl,
            functionalObjectCtrl: this.functionalObjectCtrl,
            userCtrl: this.userCtrl,
            eventCtrl: this.eventCtrl,
            functionalContextCtrl: this.functionalContextCtrl,
            additionalKeyCtrl: this.additionalKeyCtrl,
            oldValueCtrl: this.oldValueCtrl,
            newValueCtrl: this.newValueCtrl,
            orderByCtrl: this.orderByCtrl,
            displayOptionCtrl: this.displayOptionCtrl,
        });
    };
    AuditReportComponent.prototype.initControls = function () {
        this.dateFromCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.now, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_20__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate())]);
        this.dateToCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.now, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_20__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate())]);
        this.snapshotCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.currentSnapshot);
        this.functionalObjectCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.newValueCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(this.alphanumericPattern));
        this.oldValueCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(this.alphanumericPattern));
        this.displayOptionCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.displayWithOptions.find(function (item) { return item.name === 'Friendly name'; }));
        this.orderByCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.orderByOptions.find(function (item) { return item.name === 'Date'; }));
    };
    AuditReportComponent.prototype.subscribeForChanges = function () {
        var _this = this;
        this.userCtrl.valueChanges
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$))
            .subscribe(function (input) {
            _this.userFilteredOptions = _this.utilService.filterListforAutocomplete(input, _this.userOptions, ['displayName']);
        });
    };
    AuditReportComponent.prototype.loadData = function () {
        var _this = this;
        this.freezeService.getFreezeList()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (collection) {
            return collection.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate));
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$))
            .subscribe(function (snapshots) {
            _this.snapshotOptions = snapshots;
            _this.snapshotOptions.unshift(_this.currentSnapshot);
        });
        this.configurationService.getFunctionalObjects()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (collection) { return collection.value; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$))
            .subscribe(function (functionalObjects) {
            _this.functionalObjectOptions = functionalObjects;
        });
        this.userIdentityService.getAllUsers()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (collection) { return collection.value; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$))
            .subscribe(function (users) {
            _this.userOptions = _this.userFilteredOptions = users;
            _this.userCtrl.setValidators(Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__["inDropdownListValidator"])(_this.userOptions, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_19__["nameof"])('userId')));
        });
    };
    AuditReportComponent.prototype.getAdditionalKeys = function (functionalObject) {
        var _this = this;
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["from"])(functionalObject.tables)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["mergeMap"])(function (table) { return _this.configurationService.getApplicationTableById(table.tableId); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (table) {
            return table.fields.map(function (field) {
                var fieldView = {
                    fieldId: field.fieldId,
                    fieldName: field.fieldName,
                    friendlyName: field.friendlyName,
                    description: field.description,
                    tableName: table.tableName,
                    type: field.type,
                };
                return fieldView;
            });
        }));
    };
    AuditReportComponent.prototype.onEventTypeSelected = function (eventTypes) {
        this.selectedEventTypes = eventTypes.map(function (event) {
            if (event) {
                return _shared_enums_event_type_enum__WEBPACK_IMPORTED_MODULE_11__["EventType"][event];
            }
        });
        this.isUpdateSelected = this.selectedEventTypes.indexOf(_shared_enums_event_type_enum__WEBPACK_IMPORTED_MODULE_11__["EventType"].Update) > -1;
    };
    AuditReportComponent.prototype.onFunctionalObjectSelected = function (functionalObject) {
        var _this = this;
        if (functionalObject) {
            this.additionalFilterOptions = [];
            this.configurationService.getFunctionalObjectById(functionalObject.functionalObjectId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (object) {
                var keyFields = [];
                object.tables.forEach(function (table) {
                    keyFields = keyFields.concat(table.fields);
                });
                return keyFields;
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["mergeMap"])(function (fields) {
                _this.predefinedKeys = fields;
                return _this.getAdditionalKeys(functionalObject);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$))
                .subscribe(function (fields) {
                _this.utilService.removeItemsFromArray(fields, _this.predefinedKeys, 'fieldId');
                _this.additionalFilterOptions = _this.additionalFilterOptions.concat(fields);
                _this.utilService.sortArrayAlphabetically(_this.additionalFilterOptions, ['tableName', 'fieldName']);
            });
        }
    };
    AuditReportComponent.prototype.getKeyFieldsParameter = function () {
        var parameters = [];
        var keyFieldValues = [];
        this.keyFields.forEach(function (input, index) {
            if (input.id && input.fieldControl) {
                var keyValue = input.fieldControl.value;
                keyFieldValues.push(String(input.id).concat('=', keyValue ? String(keyValue) : ''));
            }
        });
        if (keyFieldValues && keyFieldValues.length > 0) {
            parameters.push({ name: 'KeyFields', value: keyFieldValues.join(',') });
        }
        return parameters;
    };
    AuditReportComponent.prototype.getBasicParameters = function () {
        var dateFrom = this.dateFromCtrl.value.format('YYYY-MM-DD');
        var dateTo = this.dateToCtrl.value.format('YYYY-MM-DD');
        var snapshotId = this.snapshotCtrl.value.dataVersionId;
        var functionalObjectId = this.functionalObjectCtrl.value.functionalObjectId;
        var userId = this.userCtrl.value ? this.userCtrl.value.userId : '';
        var functionalContext = this.functionalContextCtrl.value ?
            _shared_enums_atlas_service_names_enum__WEBPACK_IMPORTED_MODULE_10__["AtlasServiceNames"][_shared_enums_atlas_service_names_enum__WEBPACK_IMPORTED_MODULE_10__["AtlasServiceNames"][this.functionalContextCtrl.value]] : '';
        var orderBy = this.orderByCtrl.value.value;
        var displayOption = this.displayOptionCtrl.value.value;
        var parameters = [
            { name: 'DateFrom', value: dateFrom },
            { name: 'DateTo', value: dateTo },
            { name: 'Company', value: this.company },
            { name: 'FunctionalObject', value: functionalObjectId },
            { name: 'DisplayWith', value: displayOption },
            { name: 'OrderBy', value: orderBy },
        ];
        if (userId) {
            parameters.push({ name: 'User', value: userId });
        }
        if (functionalContext) {
            parameters.push({ name: 'FunctionalContext', value: functionalContext });
        }
        if (snapshotId > -1) {
            parameters.push({ name: 'Database', value: snapshotId });
        }
        this.selectedEventTypes.forEach(function (event) {
            parameters.push({ name: 'EventType', value: _shared_enums_event_type_enum__WEBPACK_IMPORTED_MODULE_11__["EventType"][event].toUpperCase() });
        });
        return parameters;
    };
    AuditReportComponent.prototype.getAdditionalFilterParameters = function () {
        var additionalFieldId = this.additionalKeyCtrl.value ? this.additionalKeyCtrl.value.fieldId : -1;
        var oldValue = this.oldValueCtrl.value;
        var newValue = this.newValueCtrl.value;
        var parameters = [];
        if (additionalFieldId > -1) {
            parameters.push({ name: 'AdditionalFilter', value: additionalFieldId });
        }
        parameters.push({ name: 'AdditionalFilterOldValue', value: oldValue });
        parameters.push({ name: 'AdditionalFilterNewValue', value: newValue });
        return parameters;
    };
    AuditReportComponent.prototype.onGenerateReportButtonClicked = function () {
        if (!this.formGroup || !this.formGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }
        this.parameters = [];
        this.parameters = this.parameters.concat(this.getBasicParameters(), this.getKeyFieldsParameter(), this.getAdditionalFilterParameters());
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    };
    AuditReportComponent.prototype.trackKeyFields = function (item) {
        return item.fieldId;
    };
    AuditReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('keyFields'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], AuditReportComponent.prototype, "keyFields", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__["SSRSReportViewerComponent"])
    ], AuditReportComponent.prototype, "ssrsReportViewer", void 0);
    AuditReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-audit-report',
            template: __webpack_require__(/*! ./audit-report.component.html */ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.html"),
            styles: [__webpack_require__(/*! ./audit-report.component.scss */ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_7__["CompanyManagerService"],
            _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_14__["FreezeService"],
            _shared_services_http_services_configuration_service__WEBPACK_IMPORTED_MODULE_13__["ConfigurationService"],
            _shared_services_http_services_user_identity_service__WEBPACK_IMPORTED_MODULE_16__["UserIdentityService"],
            _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_15__["ReportingService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_17__["SnackbarService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_19__["UtilService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_18__["TitleService"]])
    ], AuditReportComponent);
    return AuditReportComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/client-report-period-validator.validator.ts":
/*!*****************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/client-report-period-validator.validator.ts ***!
  \*****************************************************************************************************************************/
/*! exports provided: beforeFromDate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeFromDate", function() { return beforeFromDate; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);

var moment = moment__WEBPACK_IMPORTED_MODULE_0__;
function beforeFromDate(fromFormControlName, toFormControlName, allowEqual) {
    if (allowEqual === void 0) { allowEqual = true; }
    return function (abstractForm) {
        var fromFormControl = abstractForm.get(fromFormControlName);
        var toFormControl = abstractForm.get(toFormControlName);
        if (fromFormControl && fromFormControl.value
            && toFormControl && toFormControl.value) {
            var isDatebeforeFrom = fromFormControl.value.format('YYYY-MM-DD') > toFormControl.value.format('YYYY-MM-DD')
                ? true : false;
            if (isDatebeforeFrom) {
                toFormControl.setErrors({ isClientDateBeforeValid: true });
                return { isClientDateBeforeValid: true };
            }
            else {
                toFormControl.setErrors(null);
                return null;
            }
        }
        return null;
    };
}


/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.html":
/*!**************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/client-report.component.html ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <form [formGroup]=\"clientReportFormGroup\">\r\n        <div fxLayout=\"row wrap\"\r\n             fxLayoutAlign=\"center\"\r\n             fxLayoutGap=\"1%\"\r\n             fxLayoutAlign.lt-md=\"space-between stretch\">\r\n            <mat-card fxFlex=\"auto\">\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row wrap\"\r\n                         fxLayoutAlign=\"space-between start\"\r\n                         fxLayoutGap=\"1%\">\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start\"\r\n                             fxFlex=\"32%\">\r\n                            <mat-card-title>Period Range</mat-card-title>\r\n                            <atlas-month-date-picker isEditable=true\r\n                                                     label=\"From\"\r\n                                                     [fieldControl]=\"clientDateFromCtrl\"\r\n                                                     (monthChanged)=\"onMonthChanged()\">\r\n                            </atlas-month-date-picker>\r\n                            <atlas-month-date-picker isEditable=true\r\n                                                     label=\"To\"\r\n                                                     [errorMap]=\"periodRangeErrorMap\"\r\n                                                     [fieldControl]=\"clientDateToCtrl\"\r\n                                                     (monthChanged)=\"onMonthChanged()\">\r\n                            </atlas-month-date-picker>\r\n                        </div>\r\n                        <div fxLayout=\"column\"\r\n                             fxFlex=\"32%\">\r\n                            <mat-card-title>Report Parameters</mat-card-title>\r\n                            <div fxLayout=\"row\">\r\n                                <mat-form-field>\r\n                                    <mat-select [formControl]=\"reportStyleCtrl\"\r\n                                                [required]=\"reportStyleCtrl.isRequired\"\r\n                                                (selectionChange)=\"optionValueChanged($event)\">\r\n                                        <mat-option *ngFor=\"let reportStyle of reportStyleTypes\"\r\n                                                    [value]=\"reportStyle.value\">\r\n                                            {{reportStyle.reportStyleDescription}}\r\n                                        </mat-option>\r\n                                    </mat-select>\r\n                                    <mat-error *ngIf=\"reportStyleCtrl.hasError('required')\">\r\n                                        This field is required\r\n                                    </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <mat-slide-toggle *ngIf=\"reportStyleCtrl.value === ReportStyleType.Summary\"\r\n                                              [formControl]=\"functionalCurrencyCtrl\">Functional currency only\r\n                            </mat-slide-toggle>\r\n                            <mat-slide-toggle [formControl]=\"accrualsIncludedCtrl\">Accruals Included\r\n                            </mat-slide-toggle>\r\n                        </div>\r\n                        <div fxLayout=\"column\"\r\n                             fxFlex=\"32%\">\r\n                            <mat-card-title>Quick Filters</mat-card-title>\r\n                            <atlas-masterdata-user-preferences-input isEditable=\"true\"\r\n                                                                     [fieldControl]=\"clientAccountCtrl\"\r\n                                                                     [options]=\"filteredCounterPartyList\"\r\n                                                                     label=\"Client Account\"\r\n                                                                     displayProperty=\"counterpartyCode\"\r\n                                                                     [selectProperties]=\"['counterpartyCode', 'description']\"\r\n                                                                     [errorMap]=\"counterpartyErrorMap\"\r\n                                                                     lightBoxTitle=\"Results for Client Accounts\"\r\n                                                                     gridId=\"counterpartiesGrid\">\r\n                            </atlas-masterdata-user-preferences-input>\r\n\r\n                            <atlas-masterdata-user-preferences-input isEditable=\"true\"\r\n                                                                     [fieldControl]=\"currencyCtrl\"\r\n                                                                     [options]=\"filteredCurrencyList\"\r\n                                                                     label=\"Currency\"\r\n                                                                     displayProperty=\"currencyCode\"\r\n                                                                     [selectProperties]=\"['currencyCode', 'description']\"\r\n                                                                     [errorMap]=\"currencyErrorMap\"\r\n                                                                     lightBoxTitle=\"Results for Currencies\"\r\n                                                                     gridId=\"CurrenciesGrid\">\r\n                            </atlas-masterdata-user-preferences-input>\r\n\r\n                            <atlas-masterdata-user-preferences-input isEditable=\"true\"\r\n                                                                     [fieldControl]=\"clientDepartmentCtrl\"\r\n                                                                     [options]=\"filteredDepartmentList\"\r\n                                                                     label=\"Department\"\r\n                                                                     displayProperty=\"departmentCode\"\r\n                                                                     [selectProperties]=\"['departmentCode', 'description']\"\r\n                                                                     [errorMap]=\"departmentErrorMap\"\r\n                                                                     lightBoxTitle=\"Results for Departments\"\r\n                                                                     gridId=\"departmentsGrid\">\r\n                            </atlas-masterdata-user-preferences-input>\r\n\r\n                            <atlas-masterdata-user-preferences-input fxFlex=\"40%\"\r\n                                                                     isEditable=\"true\"\r\n                                                                     [fieldControl]=\"costTypeCtrl\"\r\n                                                                     [options]=\"filteredCostTypeList\"\r\n                                                                     label=\"Cost Type\"\r\n                                                                     displayProperty=\"costTypeCode\"\r\n                                                                     [selectProperties]=\"['costTypeCode', 'name']\"\r\n                                                                     [errorMap]=\"costTypeErrorMap\"\r\n                                                                     lightBoxTitle=\"Results for costTypes\"\r\n                                                                     gridId=\"costTypesGrid\">\r\n                            </atlas-masterdata-user-preferences-input>\r\n                        </div>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n            <mat-card fxFlex=\"260px\">\r\n                <mat-card-content>\r\n                    <div fxLayout=\"column\"\r\n                         fxLayoutAlign=\"start\"\r\n                         fxLayoutGap=\"2%\">\r\n\r\n                        <mat-card-title>Balances</mat-card-title>\r\n\r\n                        <mat-form-field>\r\n                            <mat-select [formControl]=\"balancesCtrl\"\r\n                                        [required]=\"balancesCtrl.isRequired\">\r\n                                <mat-option *ngFor=\"let balance of balancesTypes\"\r\n                                            [value]=\"balance.value\">\r\n                                    {{balance.balancesDescription}}\r\n                                </mat-option>\r\n                            </mat-select>\r\n                            <mat-error *ngIf=\"balancesCtrl.hasError('required')\">\r\n                                This field is required\r\n                            </mat-error>\r\n                        </mat-form-field>\r\n                        <mat-card-title>Matching</mat-card-title>\r\n                        <div fxLayout=\"row\">\r\n                            <mat-button-toggle-group [formControl]=\"matchingCtrl\"\r\n                                                     (change)=\"onMatchingChange($event.value)\"\r\n                                                     [required]=\"matchingCtrl.isRequired\">\r\n                                <mat-button-toggle *ngFor=\"let matching of matchingTypes\"\r\n                                                   [value]=\"matching.value\">{{matching.matchingTypeDescription}}\r\n                                </mat-button-toggle>\r\n                            </mat-button-toggle-group>\r\n                            <mat-error *ngIf=\"matchingCtrl.hasError('required')\">\r\n                                This field is required\r\n                            </mat-error>\r\n                        </div>\r\n                        <div fxLayout=\"row\">\r\n                            <mat-form-field>\r\n                                <mat-select [formControl]=\"unmatchedCtrl\">\r\n                                    <mat-option *ngFor=\"let unmatched of unmatchedTypes\"\r\n                                                [value]=\"unmatched.value\">{{unmatched.unmatchedDescription}}\r\n                                    </mat-option>\r\n                                </mat-select>\r\n                            </mat-form-field>\r\n                        </div>\r\n\r\n                    </div>\r\n\r\n                </mat-card-content>\r\n            </mat-card>\r\n            <atlas-filter-set-display fxFlex=\"auto\"\r\n                                      (filtersChanged)=onFilterSetChanged($event)\r\n                                      [columnConfiguration]=\"columnConfiguration\"\r\n                                      [gridCode]=\"gridCode\"\r\n                                      [company]=\"company\"\r\n                                      #filterSetDisplay>\r\n            </atlas-filter-set-display>\r\n        </div>\r\n    </form>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                class=\"generate-report-button\"\r\n                (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n    </div>\r\n    <mat-tab-group *ngIf=\"isTabEnalble\"\r\n                   [selectedIndex]=\"tabIndex\"\r\n                   (selectedIndexChange)=onSelectedIndexChanged($event)>\r\n        <mat-tab label=\"Overview\"></mat-tab>\r\n        <mat-tab label=\"Details\"></mat-tab>\r\n    </mat-tab-group>\r\n    <div class=\"content-tab\">\r\n        <mat-tab-group [selectedIndex]=\"tabIndex\">\r\n            <mat-tab>\r\n                <atlas-overview #overviewComponent\r\n                                [isFormValid]=\"isFormValid\"\r\n                                [clientDateFromCtrl]=\"clientDateFromCtrl\"\r\n                                [clientDateToCtrl]=\"clientDateToCtrl\"\r\n                                [clientReportFormGroup]=\"clientReportFormGroup\"\r\n                                [balancesCtrl]=\"balancesCtrl\"\r\n                                [reportStyleCtrl]=\"reportStyleCtrl\"\r\n                                [matchingCtrl]=\"matchingCtrl\"\r\n                                [unmatchedCtrl]=\"unmatchedCtrl\"\r\n                                [functionalCurrencyCtrl]=\"functionalCurrencyCtrl\"\r\n                                [accrualsIncludedCtrl]=\"accrualsIncludedCtrl\"\r\n                                [clientAccountCtrl]=\"clientAccountCtrl\"\r\n                                [currencyCtrl]=\"currencyCtrl\"\r\n                                [clientDepartmentCtrl]=\"clientDepartmentCtrl\"\r\n                                [costTypeCtrl]=\"costTypeCtrl\"\r\n                                [isTabEnalble]=\"isTabEnalble\"></atlas-overview>\r\n            </mat-tab>\r\n            <mat-tab>\r\n                <atlas-detail #detailComponent\r\n                              [isFormValid]=\"isFormValid\"\r\n                              [clientDateFromCtrl]=\"clientDateFromCtrl\"\r\n                              [clientDateToCtrl]=\"clientDateToCtrl\"\r\n                              [clientReportFormGroup]=\"clientReportFormGroup\"\r\n                              [balancesCtrl]=\"balancesCtrl\"\r\n                              [reportStyleCtrl]=\"reportStyleCtrl\"\r\n                              [matchingCtrl]=\"matchingCtrl\"\r\n                              [unmatchedCtrl]=\"unmatchedCtrl\"\r\n                              [functionalCurrencyCtrl]=\"functionalCurrencyCtrl\"\r\n                              [accrualsIncludedCtrl]=\"accrualsIncludedCtrl\"\r\n                              [clientAccountCtrl]=\"clientAccountCtrl\"\r\n                              [currencyCtrl]=\"currencyCtrl\"\r\n                              [clientDepartmentCtrl]=\"clientDepartmentCtrl\"\r\n                              [costTypeCtrl]=\"costTypeCtrl\"></atlas-detail>\r\n            </mat-tab>\r\n        </mat-tab-group>\r\n    </div>\r\n    <mat-card *ngIf=\"!isTabEnalble\">\r\n        <mat-card-content>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"end start\">\r\n                <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs && isClientReportDisplay\"\r\n                                                [gridOptions]=\"agGridOptions\"\r\n                                                [company]=\"company\"\r\n                                                [gridId]=\"gridCode\"\r\n                                                [isAutosize]=\"false\"\r\n                                                fxLayoutAlign=\"end\"\r\n                                                [sharingEnabled]=\"hasGridSharing\"\r\n                                                (exportClicked)=\"onExportButtonClickToExcel($event)\"\r\n                                                [isCustomExportEnabled]=\"true\"\r\n                                                (gridViewSelected)=\"onGridViewSelected($event)\"\r\n                                                #userPreferences>\r\n                </atlas-ag-grid-user-preferences>\r\n                <atlas-grid-enlargement *ngIf=\"agGridOptions && agGridOptions.columnDefs && isClientReportDisplay\"\r\n                                        [gridOptions]=\"agGridOptions\"\r\n                                        [userPreferencesParameters]=\"gridPreferences\"\r\n                                        [hasRangeSelectionOption]=\"true\"\r\n                                        [summableColumns]=\"allowedColumnsforQuickSum\"\r\n                                        (columnRowGroupChanged)=\"onColumnVisibilityChanged($event)\"\r\n                                        (columnVisibilityChanged)=\"onColumnVisibilityChanged($event)\"\r\n                                        (customExcelExport)=\"onExportButtonClickToExcel($event)\"\r\n                                        (dialogClose)=\"onGridEnlargementClose($event)\"\r\n                                        #gridZoom>\r\n                </atlas-grid-enlargement>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 *ngIf='isClientReportDisplay'\r\n                 class=\"quick-sum-div-height\"\r\n                 fxLayoutAlign=\"space-between center\">\r\n                <mat-slide-toggle mat-raised-button\r\n                                  (change)=\"toggleQuickSum($event.checked)\">Quick Sum Mode</mat-slide-toggle>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-around center\">\r\n\r\n                    <div *ngFor=\"let column of selectedColumnsArray\">\r\n                        <span class=\"quick-sum-span\"\r\n                              *ngIf=\"quickSumModeActivated\">{{column.name}} : {{column.sum | number }} </span>\r\n                    </div>\r\n                    <button mat-button\r\n                            (click)=\"onClearSelectionClicked()\"\r\n                            class=\"mat-button-user-margin\"\r\n                            *ngIf=\"quickSumModeActivated\">Clear Selection</button>\r\n                </div>\r\n            </div>\r\n            <div ag-grid=\"agGridOptions\"\r\n                 [ngClass]='classApplied'\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 [ngClass]=\"{'hidden-during-loading':!isClientReportDisplay}\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"agGridRows\"\r\n                                 [columnDefs]=\"agGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"100\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [gridOptions]=\"agGridOptions\"\r\n                                 [enableRangeSelection]=\"true\"\r\n                                 [groupMultiAutoColumn]=\"groupMultiAutoColumn\"\r\n                                 [rowGroupPanelShow]=\"rowGroupPanelShow\"\r\n                                 (columnVisible)=\"onColumnVisibilityChanged($event)\"\r\n                                 (columnRowGroupChanged)=\"onColumnVisibilityChanged($event)\"\r\n                                 (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\"\r\n                                 enableFilter\r\n                                 [context]=\"gridContext\"\r\n                                 [suppressAggFuncInHeader]=\"true\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                 [excelStyles]=\"excelStyles\">\r\n                </ag-grid-angular>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.scss":
/*!**************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/client-report.component.scss ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 8px 0 0 0 !important; }\n\n.quick-sum-div-height {\n  height: 25px !important; }\n\n.quick-sum-span {\n  font: 400 14px/20px Roboto, \"Helvetica Neue\", sans-serif;\n  margin-right: 4px; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.ts":
/*!************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/client-report.component.ts ***!
  \************************************************************************************************************/
/*! exports provided: ClientReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientReportComponent", function() { return ClientReportComponent; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../core/services/authorization.service */ "./Client/app/core/services/authorization.service.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/components/filter-set-display/filter-set-display.component */ "./Client/app/shared/components/filter-set-display/filter-set-display.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_user_grid_preferences_parameters_entity__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/entities/user-grid-preferences-parameters.entity */ "./Client/app/shared/entities/user-grid-preferences-parameters.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_balances_type_enum__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../shared/enums/balances-type.enum */ "./Client/app/shared/enums/balances-type.enum.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_enums_matchings_type_enum__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../shared/enums/matchings-type.enum */ "./Client/app/shared/enums/matchings-type.enum.ts");
/* harmony import */ var _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../shared/enums/report-style-type.enum */ "./Client/app/shared/enums/report-style-type.enum.ts");
/* harmony import */ var _shared_enums_unmatched_type_enum__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../../shared/enums/unmatched-type.enum */ "./Client/app/shared/enums/unmatched-type.enum.ts");
/* harmony import */ var _shared_pipes_format_date_pipe_pipe__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../../shared/pipes/format-date-pipe.pipe */ "./Client/app/shared/pipes/format-date-pipe.pipe.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../../../../shared/services/execution/dtos/transaction-report-command */ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_preaccounting_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../../../../shared/services/http-services/preaccounting.service */ "./Client/app/shared/services/http-services/preaccounting.service.ts");
/* harmony import */ var _shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../../../../../shared/services/list-and-search/clientReport-data-loader */ "./Client/app/shared/services/list-and-search/clientReport-data-loader.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _client_report_period_validator_validator__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./client-report-period-validator.validator */ "./Client/app/reporting/components/global-reports/components/client-report/client-report-period-validator.validator.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _tabs_overview_overview_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./tabs/overview/overview.component */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.ts");
/* harmony import */ var _tabs_detail_detail_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./tabs/detail/detail.component */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




































var ClientReportComponent = /** @class */ (function (_super) {
    __extends(ClientReportComponent, _super);
    function ClientReportComponent(route, formBuilder, uiService, companyManager, dataLoader, gridConfigurationProvider, utilService, formatDate, formConfigurationProvider, preaccountingService, window, datePipe, authorizationService, gridService, titleService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.uiService = uiService;
        _this.companyManager = companyManager;
        _this.dataLoader = dataLoader;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.utilService = utilService;
        _this.formatDate = formatDate;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.preaccountingService = preaccountingService;
        _this.window = window;
        _this.datePipe = datePipe;
        _this.authorizationService = authorizationService;
        _this.gridService = gridService;
        _this.titleService = titleService;
        _this.agGridOptions = {};
        _this.agGridRows = [];
        _this.isLoading = false;
        _this.gridCode = 'clientReportTransactionGrid';
        _this.isUserPreferencesDisplay = false;
        _this.isClientReportDisplay = false;
        _this.clientDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('clientDateFrom');
        _this.clientDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('clientDateTo');
        _this.balancesCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('balances');
        _this.reportStyleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('reportsStyle');
        _this.matchingCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('matchings');
        _this.unmatchedCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('unmatcheds');
        _this.functionalCurrencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('clientFunctionalCurrency');
        _this.accrualsIncludedCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('clientAccrualsIncluded');
        _this.clientAccountCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('clientAccount');
        _this.currencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('currency');
        _this.clientDepartmentCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('clientDepartment');
        _this.costTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_14__["AtlasFormControl"]('costType');
        _this.filters = [];
        _this.columnConfiguration = [];
        _this.balancesTypes = [];
        _this.reportStyleTypes = [];
        _this.unmatchedTypes = [];
        _this.matchingTypes = [];
        _this.periodRangeErrorMap = new Map();
        _this.subscriptions = [];
        _this.ReportStyleType = _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"];
        _this.counterpartyErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. Client not in the list.');
        _this.currencyErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. Currency not in the list.');
        _this.costTypeErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. Currency not in the list.');
        _this.departmentErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. Department not in the list.');
        // -- Evolutions to handle correctly GridViews
        _this.clientTransactionGridCode = 'clientReportTransactionGrid';
        _this.clientTransactionGridConfig = [];
        _this.clientTransactionQuickSumColumns = [];
        _this.clientSummaryGridCode = 'clientReportSummaryGrid';
        _this.clientSummaryGridConfig = [];
        _this.clientSummaryQuickSumColumns = [];
        // this is to resolve an issue on first filter change call. Search for A001
        _this.filtersLoadedForReport = false;
        /* quick sum */
        _this.defaultClass = 'ag-theme-material pointer-cursor';
        _this.cellSelectionClass = 'ag-theme-material pointer-cursor cell-selection';
        _this.quickSumModeActivated = false;
        _this.selectedColumnsArray = new Array();
        _this.allowedColumnsforQuickSum = [];
        _this.isFormValid = false;
        _this.isTabEnalble = false;
        _this.isGenerateButtonClicked = false;
        _this.isSummaryMode = false;
        _this.saveGridRows = [];
        _this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        _this.periodRangeErrorMap
            .set('isClientDateBeforeValid', 'Cannot be before Period From.');
        _this.masterData = _this.route.snapshot.data.masterdata;
        _this.filteredCounterPartyList = _this.masterData.counterparties;
        _this.filteredCurrencyList = _this.masterData.currencies;
        _this.filteredDepartmentList = _this.masterData.departments;
        _this.filteredCostTypeList = _this.masterData.costTypes;
        _this.userActiveDirectoryName = _this.authorizationService.getCurrentUser().samAccountName;
        return _this;
    }
    ClientReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterPartyId'));
        if (this.counterPartyId) {
            this.clientAccountControl = this.filteredCounterPartyList.find(function (clientAccount) { return clientAccount.counterpartyID === _this.counterPartyId; });
            this.clientAccountCtrl.patchValue(this.clientAccountControl);
        }
        for (var type in _shared_enums_balances_type_enum__WEBPACK_IMPORTED_MODULE_18__["BalancesType"]) {
            if (typeof _shared_enums_balances_type_enum__WEBPACK_IMPORTED_MODULE_18__["BalancesType"][type] === 'number') {
                this.balancesTypes.push({ value: _shared_enums_balances_type_enum__WEBPACK_IMPORTED_MODULE_18__["BalancesType"][type], balancesDescription: type });
            }
        }
        for (var type in _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"]) {
            if (typeof _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"][type] === 'number') {
                this.reportStyleTypes.push({ value: _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"][type], reportStyleDescription: type });
            }
        }
        for (var type in _shared_enums_unmatched_type_enum__WEBPACK_IMPORTED_MODULE_22__["UnmatchedType"]) {
            if (typeof _shared_enums_unmatched_type_enum__WEBPACK_IMPORTED_MODULE_22__["UnmatchedType"][type] === 'number') {
                this.unmatchedTypes.push({ value: _shared_enums_unmatched_type_enum__WEBPACK_IMPORTED_MODULE_22__["UnmatchedType"][type], unmatchedDescription: type });
            }
        }
        for (var type in _shared_enums_matchings_type_enum__WEBPACK_IMPORTED_MODULE_20__["MatchingsType"]) {
            if (typeof _shared_enums_matchings_type_enum__WEBPACK_IMPORTED_MODULE_20__["MatchingsType"][type] === 'number') {
                this.matchingTypes.push({ value: _shared_enums_matchings_type_enum__WEBPACK_IMPORTED_MODULE_20__["MatchingsType"][type], matchingTypeDescription: type });
            }
        }
        this.balancesCtrl.patchValue(_shared_enums_balances_type_enum__WEBPACK_IMPORTED_MODULE_18__["BalancesType"].Both);
        this.reportStyleCtrl.patchValue(_shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"].Transactions);
        this.unmatchedCtrl.patchValue(_shared_enums_unmatched_type_enum__WEBPACK_IMPORTED_MODULE_22__["UnmatchedType"].Now);
        this.matchingCtrl.patchValue(_shared_enums_matchings_type_enum__WEBPACK_IMPORTED_MODULE_20__["MatchingsType"].Unmatched);
        this.company = this.companyManager.getCurrentCompanyId();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.getFormGroup();
        this.setValidators();
        this.bindConfiguration();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe(function (data) {
            _this.accountingSetupModel = data;
            if (_this.accountingSetupModel.lastMonthClosed !== null) {
                var numberOfOpenPeriods = _this.accountingSetupModel.numberOfOpenPeriod !== null ?
                    _this.accountingSetupModel.numberOfOpenPeriod : 1;
                _this.clientDateToCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_5__(_this.accountingSetupModel.lastMonthClosed).add(numberOfOpenPeriods, 'month'));
            }
        }));
        this.clientDateFromCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_5__().year(1980).month(0).date(1));
        this.clientAccountCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCounterPartyList = _this.utilService.filterListforAutocomplete(input, _this.masterData.counterparties, ['counterpartyCode', 'description']);
        });
        this.currencyCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCurrencyList = _this.utilService.filterListforAutocomplete(input, _this.masterData.currencies, ['currencyCode', 'description']);
        });
        this.clientDepartmentCtrl.valueChanges.subscribe(function (input) {
            _this.filteredDepartmentList = _this.utilService.filterListforAutocomplete(input, _this.masterData.departments, ['departmentCode', 'description']);
        });
        this.costTypeCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCostTypeList = _this.utilService.filterListforAutocomplete(input, _this.masterData.costTypes, ['costTypeCode', 'name']);
        });
        this.loadGridConfiguration();
        // quicksum
        this.classApplied = this.defaultClass;
    };
    ClientReportComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ClientReportComponent.prototype.getFormGroup = function () {
        this.clientReportFormGroup = this.formBuilder.group({
            clientDateFromCtrl: this.clientDateFromCtrl,
            clientDateToCtrl: this.clientDateToCtrl,
            balancesCtrl: this.balancesCtrl,
            reportStyleCtrl: this.reportStyleCtrl,
            matchingCtrl: this.matchingCtrl,
            unmatchedCtrl: this.unmatchedCtrl,
            functionalCurrencyCtrl: this.functionalCurrencyCtrl,
            accrualsIncludedCtrl: this.accrualsIncludedCtrl,
            clientAccountCtrl: this.clientAccountCtrl,
            currencyCtrl: this.currencyCtrl,
            clientDepartmentCtrl: this.clientDepartmentCtrl,
            costTypeCtrl: this.costTypeCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    ClientReportComponent.prototype.setValidators = function () {
        this.clientDateFromCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.clientDateToCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.balancesCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.reportStyleCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.matchingCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.clientReportFormGroup.setValidators(Object(_client_report_period_validator_validator__WEBPACK_IMPORTED_MODULE_32__["beforeFromDate"])('clientDateFromCtrl', 'clientDateToCtrl'));
        this.clientReportFormGroup.updateValueAndValidity();
        this.clientAccountCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__["inDropdownListValidator"])(this.masterData.counterparties, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_31__["nameof"])('counterpartyCode'), true),
        ]));
        this.currencyCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__["inDropdownListValidator"])(this.masterData.currencies, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_31__["nameof"])('currencyCode'), true),
        ]));
        this.clientDepartmentCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__["inDropdownListValidator"])(this.masterData.departments, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_31__["nameof"])('departmentCode'), true),
        ]));
        this.costTypeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__["inDropdownListValidator"])(this.masterData.costTypes, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_31__["nameof"])('costTypeCode'), true),
        ]));
    };
    ClientReportComponent.prototype.onMatchingChange = function (matchingValue) {
        if (matchingValue !== 1) {
            this.unmatchedCtrl.disable();
        }
        else {
            this.unmatchedCtrl.enable();
        }
    };
    ClientReportComponent.prototype.onFilterSetChanged = function (filters) {
        this.filters = filters;
        if (!this.counterPartyId) {
            this.clientAccountCtrl.reset();
        }
        this.currencyCtrl.reset();
        this.costTypeCtrl.reset();
        this.clientDepartmentCtrl.reset();
        // -- Issue A001
        // this function is called on load. but we don't want to load the report on screen load.
        // therefor we need one way of blocking the first call on screen load but allow the rest of the time.
        // this following solution "blocks the first call"
        if (this.filtersLoadedForReport) {
            this.onGenerateReportButtonClicked();
        }
        this.filtersLoadedForReport = true;
    };
    ClientReportComponent.prototype.onGenerateReportButtonClicked = function () {
        this.isGenerateButtonClicked = true;
        if (this.clientReportFormGroup.valid) {
            if (this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"].Transactions && !this.isSummaryMode) {
                this.isTabEnalble = true;
                this.onSelectedButtonChanged(0);
                this.overviewComponent.isOverviewMode = true;
                this.detailComponent.isDetailMode = true;
            }
            else {
                this.overviewComponent.isOverviewMode = false;
                this.detailComponent.isDetailMode = false;
                this.isTabEnalble = false;
                this.toggleQuickSum(false);
                var hasQuickSearchValues = (this.clientAccountCtrl.value && this.clientAccountCtrl.valid)
                    || (this.currencyCtrl.value && this.currencyCtrl.valid)
                    || (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid)
                    || (this.costTypeCtrl.value && this.costTypeCtrl.valid);
                if (hasQuickSearchValues) {
                    var quickFilters = [];
                    if (this.clientAccountCtrl.value && this.clientAccountCtrl.valid) {
                        var clientAccountField = this.columnConfiguration.find(function (column) { return column.fieldName === 'ClientAccount'; });
                        var clientAccountFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_15__["ListAndSearchFilter"]();
                        clientAccountFilter.fieldId = clientAccountField.fieldId;
                        clientAccountFilter.fieldName = clientAccountField.fieldName;
                        clientAccountFilter.fieldFriendlyName = clientAccountField.fieldName;
                        clientAccountFilter.isActive = true;
                        clientAccountFilter.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_19__["ListAndSearchFilterType"].Picklist,
                            operator: 'eq',
                            value1: this.clientAccountCtrl.value.counterpartyCode,
                        };
                        quickFilters.push(clientAccountFilter);
                    }
                    if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                        var currencyField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Currency'; });
                        var currencyFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_15__["ListAndSearchFilter"]();
                        currencyFilter.fieldId = currencyField.fieldId;
                        currencyFilter.fieldName = currencyField.fieldName;
                        currencyFilter.fieldFriendlyName = currencyField.fieldName;
                        currencyFilter.isActive = true;
                        currencyFilter.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_19__["ListAndSearchFilterType"].Picklist,
                            operator: 'eq',
                            value1: this.currencyCtrl.value.currencyCode,
                        };
                        quickFilters.push(currencyFilter);
                    }
                    if (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid) {
                        var departmentField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Department'; });
                        var departmentFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_15__["ListAndSearchFilter"]();
                        departmentFilter.fieldId = departmentField.fieldId;
                        departmentFilter.fieldName = departmentField.fieldName;
                        departmentFilter.fieldFriendlyName = departmentField.fieldName;
                        departmentFilter.isActive = true;
                        departmentFilter.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_19__["ListAndSearchFilterType"].Picklist,
                            operator: 'eq',
                            value1: this.clientDepartmentCtrl.value.departmentCode,
                        };
                        quickFilters.push(departmentFilter);
                    }
                    if (this.costTypeCtrl.value && this.costTypeCtrl.valid) {
                        var costTypeField = this.columnConfiguration.find(function (column) { return column.fieldName === 'CostType'; });
                        var costTypeFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_15__["ListAndSearchFilter"]();
                        costTypeFilter.fieldId = costTypeField.fieldId;
                        costTypeFilter.fieldName = costTypeField.fieldName;
                        costTypeFilter.fieldFriendlyName = costTypeField.fieldName;
                        costTypeFilter.isActive = true;
                        costTypeFilter.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_19__["ListAndSearchFilterType"].Picklist,
                            operator: 'eq',
                            value1: this.costTypeCtrl.value.costTypeCode,
                        };
                        quickFilters.push(costTypeFilter);
                    }
                    this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                    this.filters = quickFilters;
                }
                var loadConfig = false;
                this.gridCode = this.clientSummaryGridCode;
                this.allowedColumnsforQuickSum = this.clientSummaryQuickSumColumns;
                if (this.clientSummaryGridConfig.length > 0) {
                    this.columnConfiguration = this.clientSummaryGridConfig;
                }
                else {
                    loadConfig = true;
                }
                if (loadConfig) {
                    this.loadGridConfiguration();
                }
                else {
                    this.initColumns(this.columnConfiguration);
                }
                this.loadData();
            }
        }
    };
    ClientReportComponent.prototype.onSelectedButtonChanged = function (tabIndex) {
        switch (tabIndex) {
            case 0: {
                this.overviewComponent.onGenerateReportButtonClicked();
                break;
            }
            case 1: {
                this.detailComponent.onGenerateReportButtonClicked();
                break;
            }
        }
    };
    ClientReportComponent.prototype.loadData = function () {
        var _this = this;
        var clientReport = this.getClientReportParameters();
        this.isLoading = true;
        this.isClientReportDisplay = false;
        this.isUserPreferencesDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (data) {
            _this.agGridRows = data.value;
            _this.saveGridRows = data.value;
            if (_this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"].Summary) {
                _this.rowGroupPanelShow = 'never';
                _this.groupMultiAutoColumn = false;
                _this.agGridCols = _this.agGridCols.map(function (col) {
                    col.rowGroup = false;
                    col.enableRowGroup = false;
                    return col;
                });
            }
            if (_this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"].Transactions) {
                _this.rowGroupPanelShow = 'always';
                _this.groupMultiAutoColumn = true;
            }
            _this.isClientReportDisplay = true;
        });
    };
    ClientReportComponent.prototype.getClientReportParameters = function () {
        var clientReport = new _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_25__["TransactionReportCommand"]();
        clientReport.accuralsIncluded = this.accrualsIncludedCtrl.value !== '' ? this.accrualsIncludedCtrl.value : null;
        clientReport.functionalCurrency = this.functionalCurrencyCtrl.value !== '' ?
            this.functionalCurrencyCtrl.value : null;
        clientReport.balanceType = this.balancesCtrl.value !== null ? this.balancesCtrl.value : null;
        clientReport.fromDate = this.clientDateFromCtrl.value !== null ? this.clientDateFromCtrl.value : null;
        clientReport.toDate = this.clientDateToCtrl.value !== null ? this.clientDateToCtrl.value : null;
        clientReport.matchingType = this.matchingCtrl.value !== null ? this.matchingCtrl.value : null;
        clientReport.unmatchedType = this.unmatchedCtrl.value !== null ? this.unmatchedCtrl.value : null;
        clientReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return clientReport;
    };
    ClientReportComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.clientSummaryGridConfig = configuration.columns;
            _this.columnConfiguration = configuration.columns;
            _this.initColumns(_this.columnConfiguration);
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser; // should handle this seperatly for both grids
            _this.gridPreferences = new _shared_entities_user_grid_preferences_parameters_entity__WEBPACK_IMPORTED_MODULE_16__["UserGridPreferencesParameters"]({
                company: _this.company,
                gridId: _this.gridCode,
                gridOptions: _this.agGridOptions,
                sharingEnabled: _this.hasGridSharing,
                hasCustomExport: true,
            });
        });
    };
    ClientReportComponent.prototype.initColumns = function (configuration) {
        var _this = this;
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(_this.utilService.convertToCamelCase(column.fieldName));
            }
        });
        this.agGridCols = configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: config.isGroup,
                enableRowGroup: config.isGroup,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                if (_this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"].Transactions) {
                    _this.clientTransactionQuickSumColumns.push(_this.utilService.convertToCamelCase(config.fieldName));
                }
                else {
                    _this.clientSummaryQuickSumColumns.push(_this.utilService.convertToCamelCase(config.fieldName));
                }
            }
            var formatter = _this.uiService.getFormattterForTypeClientReport(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = _this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = _this.checkStatutoryCurrency + ' eq';
            }
            var numericColumn = numericColumns.find(function (column) { return column === columnDef.field; });
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = _this.numberFormatter;
            }
            return columnDef;
        });
        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }
    };
    ClientReportComponent.prototype.onColumnVisibilityChanged = function (col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    };
    ClientReportComponent.prototype.numberFormatter = function (param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_9__["CommonMethods"]();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    };
    ClientReportComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = function () {
            _this.agGridColumnApi.autoSizeAllColumns();
        };
    };
    ClientReportComponent.prototype.onMonthChanged = function () {
        this.clientDateToCtrl.markAsTouched();
        this.clientDateFromCtrl.updateValueAndValidity();
        this.clientDateToCtrl.updateValueAndValidity();
    };
    // -- Quick Sum
    ClientReportComponent.prototype.toggleQuickSum = function (value) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        }
        else {
            this.classApplied = this.defaultClass;
        }
    };
    ClientReportComponent.prototype.onClearSelectionClicked = function () {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    ClientReportComponent.prototype.onRangeSelectionChanged = function (event) {
        var _this = this;
        this.selectedColumnsArray = [];
        var rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        }
        else {
            var cellInfos_1 = [];
            var selectedCells_1 = [];
            rangeSelections.forEach(function (row) {
                var cellExists = selectedCells_1.find(function (cell) { return cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId(); });
                if (cellExists === null || cellExists === undefined) {
                    selectedCells_1.push(row);
                    var obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos_1.push(obj);
                }
            });
            var sum_1 = 0;
            var columnName_1;
            var columnHeader_1;
            var selectedColumnsArray_1 = this.selectedColumnsArray;
            var allowedColumnsforQuickSum_1 = this.allowedColumnsforQuickSum;
            selectedCells_1.forEach(function (row) {
                row.columns.forEach(function (column) {
                    sum_1 = 0;
                    columnName_1 = column.getColDef().colId;
                    columnHeader_1 = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum_1.includes(columnName_1)) {
                        for (var rowIndex = 0; rowIndex < cellInfos_1.length; rowIndex++) {
                            if (cellInfos_1[rowIndex].columnName === columnName_1) {
                                var rowModel = _this.agGridApi.getModel();
                                var rowNode = rowModel.getRow(Number(cellInfos_1[rowIndex].rowIndex));
                                var value = _this.agGridApi.getValue(column, rowNode);
                                sum_1 += Number(value);
                            }
                        }
                        var columnObj = selectedColumnsArray_1.find(function (sum) { return sum.name === columnHeader_1; });
                        if (columnObj) {
                            columnObj.sum = sum_1;
                        }
                        else {
                            selectedColumnsArray_1.push({ name: columnHeader_1, sum: sum_1 });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray_1;
        }
    };
    ClientReportComponent.prototype.rangeSelectionCalculation = function (rangeSelection) {
        var _this = this;
        var sum = 0;
        var columnName;
        var columnHeader;
        this.selectedColumnsArray = [];
        var startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach(function (column) {
            columnName = column.getColDef().colId;
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    var rowModel = _this.agGridApi.getModel();
                    var rowNode = rowModel.getRow(rowIndex);
                    var value = _this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                _this.selectedColumnsArray.push({ name: columnHeader, sum: sum });
            }
        });
    };
    ClientReportComponent.prototype.onExportButtonClickToExcel = function () {
        var _this = this;
        var now = new Date();
        var todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        var params = {
            fileName: todayDate + '_' + this.company + '_' + this.gridCode + '_' + this.userActiveDirectoryName + '.xlsx',
            columnGroups: false,
        };
        this.agGridRows = this.saveGridRows;
        this.rowGroupPanelShow = 'never';
        this.groupMultiAutoColumn = false;
        var columngroup = this.agGridCols.filter(function (column) {
            return column.rowGroup === true;
        });
        this.agGridCols.forEach(function (column) {
            return columngroup.forEach(function (columnrow) {
                if (column.colId === columnrow.colId) {
                    _this.agGridOptions.columnApi.removeRowGroupColumn(columnrow.field);
                }
            });
        });
        if (this.agGridApi) {
            this.agGridApi.refreshCells({
                force: true,
            });
        }
        this.agGridOptions.api.exportDataAsExcel(params);
        this.rowGroupPanelShow = 'always';
        this.groupMultiAutoColumn = true;
        this.agGridCols.forEach(function (column) {
            return columngroup.forEach(function (columnrow) {
                if (column.colId === columnrow.colId) {
                    _this.agGridOptions.columnApi.addRowGroupColumn(columnrow.field);
                }
            });
        });
        this.agGridColumnApi.resetColumnGroupState();
    };
    ClientReportComponent.prototype.onGridViewSelected = function (gridViewId) {
        this.gridPreferences.selectedGridViewId = gridViewId;
        // this is to trigger the input setter in the enlarged grid child
        this.gridPreferences = new _shared_entities_user_grid_preferences_parameters_entity__WEBPACK_IMPORTED_MODULE_16__["UserGridPreferencesParameters"](this.gridPreferences);
    };
    ClientReportComponent.prototype.onGridEnlargementClose = function (lastUsedGridView) {
        if (lastUsedGridView && lastUsedGridView.gridViewId) {
            this.userPreferencesComponent.loadGridView(lastUsedGridView.gridViewId, false);
        }
    };
    ClientReportComponent.prototype.onSelectedIndexChanged = function (value) {
        this.tabIndex = value;
        if (this.isGenerateButtonClicked && !this.isSummaryMode) {
            this.onSelectedButtonChanged(this.tabIndex);
        }
    };
    ClientReportComponent.prototype.optionValueChanged = function (event) {
        if (event.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_21__["ReportStyleType"].Summary) {
            this.isSummaryMode = true;
            this.clientAccountCtrl.reset();
            this.costTypeCtrl.reset();
            this.currencyCtrl.reset();
            this.clientDepartmentCtrl.reset();
        }
        else {
            this.isSummaryMode = false;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatMenuTrigger"])
    ], ClientReportComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_10__["AgGridUserPreferencesComponent"])
    ], ClientReportComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('filterSetDisplay'),
        __metadata("design:type", _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_12__["FilterSetDisplayComponent"])
    ], ClientReportComponent.prototype, "filterSetDisplayComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('overviewComponent'),
        __metadata("design:type", _tabs_overview_overview_component__WEBPACK_IMPORTED_MODULE_34__["OverviewComponent"])
    ], ClientReportComponent.prototype, "overviewComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('detailComponent'),
        __metadata("design:type", _tabs_detail_detail_component__WEBPACK_IMPORTED_MODULE_35__["DetailComponent"])
    ], ClientReportComponent.prototype, "detailComponent", void 0);
    ClientReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'atlas-client-report',
            providers: [_shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_29__["ClientReportDataLoader"], _angular_common__WEBPACK_IMPORTED_MODULE_0__["DatePipe"]],
            template: __webpack_require__(/*! ./client-report.component.html */ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.html"),
            styles: [__webpack_require__(/*! ./client-report.component.scss */ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.scss")],
        }),
        __param(10, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_17__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_30__["UiService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_8__["CompanyManagerService"],
            _shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_29__["ClientReportDataLoader"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_27__["GridConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_31__["UtilService"],
            _shared_pipes_format_date_pipe_pipe__WEBPACK_IMPORTED_MODULE_23__["FormatDatePipe"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_26__["FormConfigurationProviderService"],
            _shared_services_http_services_preaccounting_service__WEBPACK_IMPORTED_MODULE_28__["PreaccountingService"],
            Window,
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["DatePipe"],
            _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_7__["AuthorizationService"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_24__["AgGridService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_33__["TitleService"]])
    ], ClientReportComponent);
    return ClientReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_11__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.html":
/*!*******************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.html ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isDetailMode\">\r\n    <mat-card>\r\n        <mat-card-content>\r\n            <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs && isClientReportDisplay\"\r\n                                            [gridOptions]=\"agGridOptions\"\r\n                                            [company]=\"company\"\r\n                                            [gridId]=\"gridCode\"\r\n                                            [isAutosize]=\"false\"\r\n                                            [isSetColumnStateEnabled]=\"false\"\r\n                                            fxLayoutAlign=\"end\"\r\n                                            [sharingEnabled]=\"hasGridSharing\"\r\n                                            #userPreferences>\r\n            </atlas-ag-grid-user-preferences>\r\n            <div fxLayout=\"row\"\r\n                 *ngIf='isClientReportDisplay'\r\n                 class=\"quick-sum-div-height\"\r\n                 fxLayoutAlign=\"space-between center\">\r\n                <mat-slide-toggle mat-raised-button\r\n                                  (change)=\"toggleQuickSum($event.checked)\">Quick Sum Mode</mat-slide-toggle>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-around center\">\r\n\r\n                    <div *ngFor=\"let column of selectedColumnsArray\">\r\n                        <span class=\"quick-sum-span\"\r\n                              *ngIf=\"quickSumModeActivated\">{{column.name}} : {{column.sum | number }} </span>\r\n                    </div>\r\n                    <button mat-button\r\n                            (click)=\"onClearSelectionClicked()\"\r\n                            class=\"mat-button-user-margin\"\r\n                            *ngIf=\"quickSumModeActivated\">Clear Selection</button>\r\n                </div>\r\n            </div>\r\n            <atlas-filter-set-display #filterSetDisplay\r\n                                      [hidden]=\"true\"></atlas-filter-set-display>\r\n            <div ag-grid=\"agGridOptions\"\r\n                 [ngClass]='classApplied'\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 [ngClass]=\"{'hidden-during-loading':!isClientReportDisplay}\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"agGridRows\"\r\n                                 [columnDefs]=\"agGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"100\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [enableRangeSelection]=\"true\"\r\n                                 (columnVisible)=\"onColumnVisibilityChanged($event)\"\r\n                                 (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\"\r\n                                 enableFilter\r\n                                 [context]=\"gridContext\"\r\n                                 [suppressAggFuncInHeader]=\"true\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                 [excelStyles]=\"excelStyles\">\r\n                </ag-grid-angular>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.scss":
/*!*******************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.scss ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.ts":
/*!*****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.ts ***!
  \*****************************************************************************************************************/
/*! exports provided: DetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailComponent", function() { return DetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../../shared/components/filter-set-display/filter-set-display.component */ "./Client/app/shared/components/filter-set-display/filter-set-display.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../../shared/enums/report-style-type.enum */ "./Client/app/shared/enums/report-style-type.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../../shared/services/execution/dtos/transaction-report-command */ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../../../shared/services/list-and-search/clientReport-data-loader */ "./Client/app/shared/services/list-and-search/clientReport-data-loader.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






















var DetailComponent = /** @class */ (function (_super) {
    __extends(DetailComponent, _super);
    function DetailComponent(route, formBuilder, uiService, companyManager, dataLoader, gridConfigurationProvider, utilService, formConfigurationProvider, window, gridService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.uiService = uiService;
        _this.companyManager = companyManager;
        _this.dataLoader = dataLoader;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.utilService = utilService;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.window = window;
        _this.gridService = gridService;
        _this.agGridOptions = {};
        _this.agGridRows = [];
        _this.isLoading = false;
        _this.gridCode = 'clientReportTransactionGrid';
        _this.isUserPreferencesDisplay = false;
        _this.isClientReportDisplay = false;
        _this.clientDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientDateFrom');
        _this.clientDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientDateTo');
        _this.balancesCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('balances');
        _this.reportStyleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('reportsStyle');
        _this.matchingCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('matchings');
        _this.unmatchedCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('unmatcheds');
        _this.functionalCurrencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientFunctionalCurrency');
        _this.accrualsIncludedCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientAccrualsIncluded');
        _this.clientAccountCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientAccount');
        _this.currencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('currency');
        _this.clientDepartmentCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientDepartment');
        _this.costTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('costType');
        _this.filters = [];
        _this.columnConfiguration = [];
        _this.subscriptions = [];
        _this.ReportStyleType = _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"];
        _this.isDetailMode = true;
        // -- Evolutions to handle correctly GridViews
        _this.clientTransactionGridCode = 'clientReportTransactionGrid';
        _this.clientTransactionGridConfig = [];
        _this.clientTransactionQuickSumColumns = [];
        _this.clientSummaryGridCode = 'clientReportSummaryGrid';
        _this.clientSummaryGridConfig = [];
        _this.clientSummaryQuickSumColumns = [];
        // this is to resolve an issue on first filter change call. Search for A001
        _this.filtersLoadedForReport = false;
        /* quick sum */
        _this.defaultClass = 'ag-theme-material pointer-cursor';
        _this.cellSelectionClass = 'ag-theme-material pointer-cursor cell-selection';
        _this.quickSumModeActivated = false;
        _this.selectedColumnsArray = new Array();
        _this.allowedColumnsforQuickSum = [];
        _this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        _this.masterData = _this.route.snapshot.data.masterdata;
        return _this;
    }
    DetailComponent.prototype.ngOnInit = function () {
        this.company = this.companyManager.getCurrentCompanyId();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.loadGridConfiguration();
        // quicksum
        this.classApplied = this.defaultClass;
    };
    DetailComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DetailComponent.prototype.onGenerateReportButtonClicked = function () {
        if (this.clientReportFormGroup.valid) {
            this.toggleQuickSum(false);
            var hasQuickSearchValues = (this.clientAccountCtrl.value && this.clientAccountCtrl.valid)
                || (this.currencyCtrl.value && this.currencyCtrl.valid)
                || (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid)
                || (this.costTypeCtrl.value && this.costTypeCtrl.valid);
            if (hasQuickSearchValues) {
                var quickFilters = [];
                if (this.clientAccountCtrl.value && this.clientAccountCtrl.valid) {
                    var clientAccountField = this.columnConfiguration.find(function (column) { return column.fieldName === 'ClientAccount'; });
                    var clientAccountFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    clientAccountFilter.fieldId = clientAccountField.fieldId;
                    clientAccountFilter.fieldName = clientAccountField.fieldName;
                    clientAccountFilter.isActive = true;
                    clientAccountFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.clientAccountCtrl.value.counterpartyCode,
                    };
                    quickFilters.push(clientAccountFilter);
                }
                if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                    var currencyField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Currency'; });
                    var currencyFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    currencyFilter.fieldId = currencyField.fieldId;
                    currencyFilter.fieldName = currencyField.fieldName;
                    currencyFilter.isActive = true;
                    currencyFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.currencyCtrl.value.currencyCode,
                    };
                    quickFilters.push(currencyFilter);
                }
                if (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid) {
                    var departmentField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Department'; });
                    var departmentFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    departmentFilter.fieldId = departmentField.fieldId;
                    departmentFilter.fieldName = departmentField.fieldName;
                    departmentFilter.isActive = true;
                    departmentFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.clientDepartmentCtrl.value.departmentCode,
                    };
                    quickFilters.push(departmentFilter);
                }
                if (this.costTypeCtrl.value && this.costTypeCtrl.valid) {
                    var costTypeField = this.columnConfiguration.find(function (column) { return column.fieldName === 'CostType'; });
                    var costTypeFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    costTypeFilter.fieldId = costTypeField.fieldId;
                    costTypeFilter.fieldName = costTypeField.fieldName;
                    costTypeFilter.isActive = true;
                    costTypeFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.costTypeCtrl.value.costTypeCode,
                    };
                    quickFilters.push(costTypeFilter);
                }
                this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                this.filters = quickFilters;
            }
            var loadConfig = false;
            this.gridCode = this.clientTransactionGridCode;
            this.allowedColumnsforQuickSum = this.clientTransactionQuickSumColumns;
            if (this.clientSummaryGridConfig.length > 0) {
                this.columnConfiguration = this.clientTransactionGridConfig;
            }
            else {
                loadConfig = true;
            }
            if (loadConfig) {
                this.loadGridConfiguration();
            }
            else {
                this.initColumns(this.columnConfiguration);
            }
            this.loadData();
        }
    };
    DetailComponent.prototype.loadData = function () {
        var _this = this;
        var clientReport = this.getClientReportParameters();
        this.isLoading = true;
        this.isClientReportDisplay = false;
        this.isUserPreferencesDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (data) {
            _this.agGridRows = data.value;
            _this.isClientReportDisplay = true;
        });
    };
    DetailComponent.prototype.getClientReportParameters = function () {
        var clientReport = new _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_16__["TransactionReportCommand"]();
        clientReport.accuralsIncluded = this.accrualsIncludedCtrl.value !== '' ? this.accrualsIncludedCtrl.value : null;
        clientReport.functionalCurrency = this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"].Summary
            && this.functionalCurrencyCtrl.value !== '' ?
            this.functionalCurrencyCtrl.value : null;
        clientReport.balanceType = this.balancesCtrl.value !== null ? this.balancesCtrl.value : null;
        clientReport.fromDate = this.clientDateFromCtrl.value !== null ? this.clientDateFromCtrl.value : null;
        clientReport.toDate = this.clientDateToCtrl.value !== null ? this.clientDateToCtrl.value : null;
        clientReport.matchingType = this.matchingCtrl.value !== null ? this.matchingCtrl.value : null;
        clientReport.unmatchedType = this.unmatchedCtrl.value !== null ? this.unmatchedCtrl.value : null;
        clientReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return clientReport;
    };
    DetailComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.clientTransactionGridConfig = configuration.columns;
            _this.columnConfiguration = configuration.columns;
            _this.initColumns(_this.columnConfiguration);
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser; // should handle this seperatly for both grids
        });
    };
    DetailComponent.prototype.initColumns = function (configuration) {
        var _this = this;
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.agGridCols = configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: false,
                enableRowGroup: false,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                if (_this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"].Transactions) {
                    _this.clientTransactionQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
                }
                else {
                    _this.clientSummaryQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
                }
            }
            var formatter = _this.uiService.getFormattterForTypeClientReport(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            // if (this.gridCode === 'clientReportTransactionGrid') {
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = _this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = _this.checkStatutoryCurrency + ' eq';
            }
            var numericColumn = numericColumns.find(function (column) { return column === columnDef.field.toLowerCase(); });
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = _this.numberFormatter;
            }
            // }
            return columnDef;
        });
        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }
    };
    DetailComponent.prototype.onColumnVisibilityChanged = function (col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    };
    DetailComponent.prototype.numberFormatter = function (param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__["CommonMethods"]();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    };
    DetailComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = function () {
            _this.agGridColumnApi.autoSizeAllColumns();
        };
    };
    // -- Quick Sum
    DetailComponent.prototype.toggleQuickSum = function (value) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        }
        else {
            this.classApplied = this.defaultClass;
        }
    };
    DetailComponent.prototype.onClearSelectionClicked = function () {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    DetailComponent.prototype.onRangeSelectionChanged = function (event) {
        var _this = this;
        this.selectedColumnsArray = [];
        var rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        }
        else {
            var cellInfos_1 = [];
            var selectedCells_1 = [];
            rangeSelections.forEach(function (row) {
                var cellExists = selectedCells_1.find(function (cell) { return cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId(); });
                if (cellExists === null || cellExists === undefined) {
                    selectedCells_1.push(row);
                    var obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos_1.push(obj);
                }
            });
            var sum_1 = 0;
            var columnName_1;
            var columnHeader_1;
            var selectedColumnsArray_1 = this.selectedColumnsArray;
            var allowedColumnsforQuickSum_1 = this.allowedColumnsforQuickSum;
            selectedCells_1.forEach(function (row) {
                row.columns.forEach(function (column) {
                    sum_1 = 0;
                    columnName_1 = column.getColDef().colId.toLowerCase();
                    columnHeader_1 = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum_1.includes(columnName_1)) {
                        for (var rowIndex = 0; rowIndex < cellInfos_1.length; rowIndex++) {
                            if (cellInfos_1[rowIndex].columnName.toLowerCase() === columnName_1) {
                                var rowModel = _this.agGridApi.getModel();
                                var rowNode = rowModel.getRow(Number(cellInfos_1[rowIndex].rowIndex));
                                var value = _this.agGridApi.getValue(column, rowNode);
                                sum_1 += Number(value);
                            }
                        }
                        var columnObj = selectedColumnsArray_1.find(function (sum) { return sum.name === columnHeader_1; });
                        if (columnObj) {
                            columnObj.sum = sum_1;
                        }
                        else {
                            selectedColumnsArray_1.push({ name: columnHeader_1, sum: sum_1 });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray_1;
        }
    };
    DetailComponent.prototype.rangeSelectionCalculation = function (rangeSelection) {
        var _this = this;
        var sum = 0;
        var columnName;
        var columnHeader;
        this.selectedColumnsArray = [];
        var startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach(function (column) {
            columnName = column.getColDef().colId.toLowerCase();
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    var rowModel = _this.agGridApi.getModel();
                    var rowNode = rowModel.getRow(rowIndex);
                    var value = _this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                _this.selectedColumnsArray.push({ name: columnHeader, sum: sum });
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], DetailComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__["AgGridUserPreferencesComponent"])
    ], DetailComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('filterSetDisplay'),
        __metadata("design:type", _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_9__["FilterSetDisplayComponent"])
    ], DetailComponent.prototype, "filterSetDisplayComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "clientDateFromCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "clientDateToCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"])
    ], DetailComponent.prototype, "clientReportFormGroup", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "balancesCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "reportStyleCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "matchingCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "unmatchedCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "functionalCurrencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "accrualsIncludedCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "clientAccountCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "currencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "clientDepartmentCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "costTypeCtrl", void 0);
    DetailComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-detail',
            template: __webpack_require__(/*! ./detail.component.html */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.html"),
            styles: [__webpack_require__(/*! ./detail.component.scss */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.scss")]
        }),
        __param(8, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_12__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_20__["UiService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__["CompanyManagerService"],
            _shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_19__["ClientReportDataLoader"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_18__["GridConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_21__["UtilService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__["FormConfigurationProviderService"],
            Window,
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_15__["AgGridService"]])
    ], DetailComponent);
    return DetailComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.html":
/*!***********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.html ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isOverviewMode\">\r\n    <mat-card>\r\n        <mat-card-content>\r\n            <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs && isClientReportDisplay\"\r\n                                            [gridOptions]=\"agGridOptions\"\r\n                                            [company]=\"company\"\r\n                                            [gridId]=\"gridCode\"\r\n                                            [isAutosize]=\"false\"\r\n                                            fxLayoutAlign=\"end\"\r\n                                            [sharingEnabled]=\"hasGridSharing\"\r\n                                            #userPreferences>\r\n            </atlas-ag-grid-user-preferences>\r\n            <div fxLayout=\"row\"\r\n                 *ngIf='isClientReportDisplay'\r\n                 class=\"quick-sum-div-height\"\r\n                 fxLayoutAlign=\"space-between center\">\r\n                <mat-slide-toggle mat-raised-button\r\n                                  (change)=\"toggleQuickSum($event.checked)\">Quick Sum Mode</mat-slide-toggle>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-around center\">\r\n\r\n                    <div *ngFor=\"let column of selectedColumnsArray\">\r\n                        <span class=\"quick-sum-span\"\r\n                              *ngIf=\"quickSumModeActivated\">{{column.name}} : {{column.sum | number }} </span>\r\n                    </div>\r\n                    <button mat-button\r\n                            (click)=\"onClearSelectionClicked()\"\r\n                            class=\"mat-button-user-margin\"\r\n                            *ngIf=\"quickSumModeActivated\">Clear Selection</button>\r\n                </div>\r\n            </div>\r\n            <atlas-filter-set-display #filterSetDisplay\r\n                                      [hidden]=\"true\"></atlas-filter-set-display>\r\n            <div ag-grid=\"agGridOptions\"\r\n                 [ngClass]='classApplied'\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 [ngClass]=\"{'hidden-during-loading':!isClientReportDisplay}\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"agGridRows\"\r\n                                 [columnDefs]=\"agGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"100\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [enableRangeSelection]=\"true\"\r\n                                 [groupMultiAutoColumn]=\"groupMultiAutoColumn\"\r\n                                 [rowGroupPanelShow]=\"rowGroupPanelShow\"\r\n                                 (columnVisible)=\"onColumnVisibilityChanged($event)\"\r\n                                 (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\"\r\n                                 enableFilter\r\n                                 [context]=\"gridContext\"\r\n                                 [suppressAggFuncInHeader]=\"true\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                 [excelStyles]=\"excelStyles\">\r\n                </ag-grid-angular>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.scss":
/*!***********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.scss ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.ts":
/*!*********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.ts ***!
  \*********************************************************************************************************************/
/*! exports provided: OverviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OverviewComponent", function() { return OverviewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../../shared/components/filter-set-display/filter-set-display.component */ "./Client/app/shared/components/filter-set-display/filter-set-display.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../../shared/enums/report-style-type.enum */ "./Client/app/shared/enums/report-style-type.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../../shared/services/execution/dtos/transaction-report-command */ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../../../shared/services/list-and-search/clientReport-data-loader */ "./Client/app/shared/services/list-and-search/clientReport-data-loader.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






















var OverviewComponent = /** @class */ (function (_super) {
    __extends(OverviewComponent, _super);
    function OverviewComponent(route, formBuilder, uiService, companyManager, dataLoader, gridConfigurationProvider, utilService, formConfigurationProvider, window, gridService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.uiService = uiService;
        _this.companyManager = companyManager;
        _this.dataLoader = dataLoader;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.utilService = utilService;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.window = window;
        _this.gridService = gridService;
        _this.agGridOptions = {};
        _this.agGridRows = [];
        _this.isLoading = false;
        _this.gridCode = 'clientReportTransactionGrid';
        _this.isUserPreferencesDisplay = false;
        _this.isClientReportDisplay = false;
        _this.isOverviewMode = true;
        _this.clientDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientDateFrom');
        _this.clientDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientDateTo');
        _this.balancesCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('balances');
        _this.reportStyleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('reportsStyle');
        _this.matchingCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('matchings');
        _this.unmatchedCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('unmatcheds');
        _this.functionalCurrencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientFunctionalCurrency');
        _this.accrualsIncludedCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientAccrualsIncluded');
        _this.clientAccountCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientAccount');
        _this.currencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('currency');
        _this.clientDepartmentCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('clientDepartment');
        _this.costTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('costType');
        _this.filters = [];
        _this.columnConfiguration = [];
        _this.subscriptions = [];
        _this.ReportStyleType = _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"];
        // -- Evolutions to handle correctly GridViews
        _this.clientTransactionGridCode = 'clientReportTransactionGrid';
        _this.clientTransactionGridConfig = [];
        _this.clientTransactionQuickSumColumns = [];
        _this.clientSummaryGridCode = 'clientReportSummaryGrid';
        _this.clientSummaryGridConfig = [];
        _this.clientSummaryQuickSumColumns = [];
        // this is to resolve an issue on first filter change call. Search for A001
        _this.filtersLoadedForReport = false;
        /* quick sum */
        _this.defaultClass = 'ag-theme-material pointer-cursor';
        _this.cellSelectionClass = 'ag-theme-material pointer-cursor cell-selection';
        _this.quickSumModeActivated = false;
        _this.selectedColumnsArray = new Array();
        _this.allowedColumnsforQuickSum = [];
        _this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        _this.masterData = _this.route.snapshot.data.masterdata;
        return _this;
    }
    OverviewComponent.prototype.ngOnInit = function () {
        this.company = this.companyManager.getCurrentCompanyId();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.loadGridConfiguration();
        // quicksum
        this.classApplied = this.defaultClass;
    };
    OverviewComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    OverviewComponent.prototype.onGenerateReportButtonClicked = function () {
        if (this.clientReportFormGroup.valid) {
            this.toggleQuickSum(false);
            var hasQuickSearchValues = (this.clientAccountCtrl.value && this.clientAccountCtrl.valid)
                || (this.currencyCtrl.value && this.currencyCtrl.valid)
                || (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid)
                || (this.costTypeCtrl.value && this.costTypeCtrl.valid);
            if (hasQuickSearchValues) {
                var quickFilters = [];
                if (this.clientAccountCtrl.value && this.clientAccountCtrl.valid) {
                    var clientAccountField = this.columnConfiguration.find(function (column) { return column.fieldName === 'ClientAccount'; });
                    var clientAccountFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    clientAccountFilter.fieldId = clientAccountField.fieldId;
                    clientAccountFilter.fieldName = clientAccountField.fieldName;
                    clientAccountFilter.isActive = true;
                    clientAccountFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.clientAccountCtrl.value.counterpartyCode,
                    };
                    quickFilters.push(clientAccountFilter);
                }
                if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                    var currencyField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Currency'; });
                    var currencyFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    currencyFilter.fieldId = currencyField.fieldId;
                    currencyFilter.fieldName = currencyField.fieldName;
                    currencyFilter.isActive = true;
                    currencyFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.currencyCtrl.value.currencyCode,
                    };
                    quickFilters.push(currencyFilter);
                }
                if (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid) {
                    var departmentField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Department'; });
                    var departmentFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    departmentFilter.fieldId = departmentField.fieldId;
                    departmentFilter.fieldName = departmentField.fieldName;
                    departmentFilter.isActive = true;
                    departmentFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.clientDepartmentCtrl.value.departmentCode,
                    };
                    quickFilters.push(departmentFilter);
                }
                if (this.costTypeCtrl.value && this.costTypeCtrl.valid) {
                    var costTypeField = this.columnConfiguration.find(function (column) { return column.fieldName === 'CostType'; });
                    var costTypeFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_11__["ListAndSearchFilter"]();
                    costTypeFilter.fieldId = costTypeField.fieldId;
                    costTypeFilter.fieldName = costTypeField.fieldName;
                    costTypeFilter.isActive = true;
                    costTypeFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.costTypeCtrl.value.costTypeCode,
                    };
                    quickFilters.push(costTypeFilter);
                }
                this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                this.filters = quickFilters;
            }
            var loadConfig = false;
            this.gridCode = this.clientTransactionGridCode;
            this.allowedColumnsforQuickSum = this.clientTransactionQuickSumColumns;
            if (this.clientSummaryGridConfig.length > 0) {
                this.columnConfiguration = this.clientTransactionGridConfig;
            }
            else {
                loadConfig = true;
            }
            if (loadConfig) {
                this.loadGridConfiguration();
            }
            else {
                this.initColumns(this.columnConfiguration);
            }
            this.loadData();
        }
    };
    OverviewComponent.prototype.loadData = function () {
        var _this = this;
        var clientReport = this.getClientReportParameters();
        this.isLoading = true;
        this.isClientReportDisplay = false;
        this.isUserPreferencesDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (data) {
            _this.agGridRows = data.value;
            if (_this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"].Transactions) {
                _this.rowGroupPanelShow = 'always';
                _this.groupMultiAutoColumn = true;
            }
            _this.isClientReportDisplay = true;
        });
    };
    OverviewComponent.prototype.getClientReportParameters = function () {
        var clientReport = new _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_16__["TransactionReportCommand"]();
        clientReport.accuralsIncluded = this.accrualsIncludedCtrl.value !== '' ? this.accrualsIncludedCtrl.value : null;
        clientReport.functionalCurrency = this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"].Summary
            && this.functionalCurrencyCtrl.value !== '' ?
            this.functionalCurrencyCtrl.value : null;
        clientReport.balanceType = this.balancesCtrl.value !== null ? this.balancesCtrl.value : null;
        clientReport.fromDate = this.clientDateFromCtrl.value !== null ? this.clientDateFromCtrl.value : null;
        clientReport.toDate = this.clientDateToCtrl.value !== null ? this.clientDateToCtrl.value : null;
        clientReport.matchingType = this.matchingCtrl.value !== null ? this.matchingCtrl.value : null;
        clientReport.unmatchedType = this.unmatchedCtrl.value !== null ? this.unmatchedCtrl.value : null;
        clientReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return clientReport;
    };
    OverviewComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.clientTransactionGridConfig = configuration.columns;
            _this.columnConfiguration = configuration.columns;
            _this.initColumns(_this.columnConfiguration);
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser; // should handle this seperatly for both grids
        });
    };
    OverviewComponent.prototype.initColumns = function (configuration) {
        var _this = this;
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.agGridCols = configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: config.isGroup,
                enableRowGroup: config.isGroup,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                if (_this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_14__["ReportStyleType"].Transactions) {
                    _this.clientTransactionQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
                }
                else {
                    _this.clientSummaryQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
                }
            }
            var formatter = _this.uiService.getFormattterForTypeClientReport(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            // if (this.gridCode === 'clientReportTransactionGrid') {
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = _this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = _this.checkStatutoryCurrency + ' eq';
            }
            var numericColumn = numericColumns.find(function (column) { return column === columnDef.field.toLowerCase(); });
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = _this.numberFormatter;
            }
            // }
            return columnDef;
        });
        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }
    };
    OverviewComponent.prototype.onColumnVisibilityChanged = function (col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    };
    OverviewComponent.prototype.numberFormatter = function (param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__["CommonMethods"]();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    };
    OverviewComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = function () {
            _this.agGridColumnApi.autoSizeAllColumns();
        };
    };
    // -- Quick Sum
    OverviewComponent.prototype.toggleQuickSum = function (value) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        }
        else {
            this.classApplied = this.defaultClass;
        }
    };
    OverviewComponent.prototype.onClearSelectionClicked = function () {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    OverviewComponent.prototype.onRangeSelectionChanged = function (event) {
        var _this = this;
        this.selectedColumnsArray = [];
        var rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        }
        else {
            var cellInfos_1 = [];
            var selectedCells_1 = [];
            rangeSelections.forEach(function (row) {
                var cellExists = selectedCells_1.find(function (cell) { return cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId(); });
                if (cellExists === null || cellExists === undefined) {
                    selectedCells_1.push(row);
                    var obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos_1.push(obj);
                }
            });
            var sum_1 = 0;
            var columnName_1;
            var columnHeader_1;
            var selectedColumnsArray_1 = this.selectedColumnsArray;
            var allowedColumnsforQuickSum_1 = this.allowedColumnsforQuickSum;
            selectedCells_1.forEach(function (row) {
                row.columns.forEach(function (column) {
                    sum_1 = 0;
                    columnName_1 = column.getColDef().colId.toLowerCase();
                    columnHeader_1 = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum_1.includes(columnName_1)) {
                        for (var rowIndex = 0; rowIndex < cellInfos_1.length; rowIndex++) {
                            if (cellInfos_1[rowIndex].columnName.toLowerCase() === columnName_1) {
                                var rowModel = _this.agGridApi.getModel();
                                var rowNode = rowModel.getRow(Number(cellInfos_1[rowIndex].rowIndex));
                                var value = _this.agGridApi.getValue(column, rowNode);
                                sum_1 += Number(value);
                            }
                        }
                        var columnObj = selectedColumnsArray_1.find(function (sum) { return sum.name === columnHeader_1; });
                        if (columnObj) {
                            columnObj.sum = sum_1;
                        }
                        else {
                            selectedColumnsArray_1.push({ name: columnHeader_1, sum: sum_1 });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray_1;
        }
    };
    OverviewComponent.prototype.rangeSelectionCalculation = function (rangeSelection) {
        var _this = this;
        var sum = 0;
        var columnName;
        var columnHeader;
        this.selectedColumnsArray = [];
        var startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach(function (column) {
            columnName = column.getColDef().colId.toLowerCase();
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    var rowModel = _this.agGridApi.getModel();
                    var rowNode = rowModel.getRow(rowIndex);
                    var value = _this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                _this.selectedColumnsArray.push({ name: columnHeader, sum: sum });
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], OverviewComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__["AgGridUserPreferencesComponent"])
    ], OverviewComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('filterSetDisplay'),
        __metadata("design:type", _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_9__["FilterSetDisplayComponent"])
    ], OverviewComponent.prototype, "filterSetDisplayComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "clientDateFromCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "clientDateToCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"])
    ], OverviewComponent.prototype, "clientReportFormGroup", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "balancesCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "reportStyleCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "matchingCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "unmatchedCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "functionalCurrencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "accrualsIncludedCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "clientAccountCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "currencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "clientDepartmentCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewComponent.prototype, "costTypeCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], OverviewComponent.prototype, "isTabEnalble", void 0);
    OverviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-overview',
            template: __webpack_require__(/*! ./overview.component.html */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.html"),
            styles: [__webpack_require__(/*! ./overview.component.scss */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.scss")]
        }),
        __param(8, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_12__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_20__["UiService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__["CompanyManagerService"],
            _shared_services_list_and_search_clientReport_data_loader__WEBPACK_IMPORTED_MODULE_19__["ClientReportDataLoader"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_18__["GridConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_21__["UtilService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__["FormConfigurationProviderService"],
            Window,
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_15__["AgGridService"]])
    ], OverviewComponent);
    return OverviewComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.html":
/*!************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.html ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container fx-exposure-report\">\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"start\"\r\n         fxLayoutAlign.lt-md=\"space-around center\"\r\n         fxLayoutGap=\"16px\">\r\n        <mat-card fxFlex=\"35%\"\r\n                  fxFlexOrder.lt-md=\"1\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>Database Selection</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"5px\">\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-between start\"\r\n                     fxLayoutGap=\"15%\">\r\n                    <atlas-dropdown-select fxFlex='40%'\r\n                                           [label]=\"'Snapshot'\"\r\n                                           [fieldControl]=\"fxExposureSnapshotCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"snapshotList\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\">\r\n                    </atlas-dropdown-select>\r\n                </div>\r\n                <div class=\"DisplayToggle\"\r\n                     fxLayout=\"row\"\r\n                     fxLayoutAlign=\"start start\">\r\n                    <mat-slide-toggle mat-raised-button\r\n                                      (change)=\"onToggleDisplay()\">Display open/Realised\r\n                    </mat-slide-toggle>\r\n                </div>\r\n\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"start end\">\r\n                    <mat-slide-toggle mat-raised-button\r\n                                      (change)=\"onToggleExcludeBankAccount()\">Exclude Bank account\r\n                    </mat-slide-toggle>\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"start end\">\r\n                    <mat-slide-toggle mat-raised-button\r\n                                      (change)=\"onToggleExcludeGLAccount()\">Exclude GL account\r\n                    </mat-slide-toggle>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n        <mat-card fxFlex=\"35%\"\r\n                  fxFlexOrder.lt-md=\"2\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>Report Criterias</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutGap=\"100%\">\r\n                    <atlas-contextual-search-multiple-autocomplete-select #currencyDropdownComponent\r\n                                                                          [options]=\"currencies\"\r\n                                                                          [selectedOptions]=\"[]\"\r\n                                                                          [allOptionsElement]=\"CurrencyAllOptions\"\r\n                                                                          [allSelected]=\"allCurrenciesSelected\"\r\n                                                                          displayCode=\"true\"\r\n                                                                          valueProperty=\"currencyCode\"\r\n                                                                          codeProperty=\"currencyCode\"\r\n                                                                          placeholder=\"Currency Code\"\r\n                                                                          placeholderFilter=\"Currency Code\"\r\n                                                                          elementName=\"Currency Code\"\r\n                                                                          (selectionChangedEvent)=\"onCurrencySelectionChanged($event)\">\r\n                    </atlas-contextual-search-multiple-autocomplete-select>\r\n                </div>\r\n\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutGap=\"100%\">\r\n                    <atlas-contextual-search-multiple-autocomplete-select #departmentDropdownComponent\r\n                                                                          [options]=\"filteredDepartments\"\r\n                                                                          [selectedOptions]=\"[]\"\r\n                                                                          [allOptionsElement]=\"departmentAllOptions\"\r\n                                                                          [allSelected]=\"allDepartmentsSelected\"\r\n                                                                          displayCode=\"true\"\r\n                                                                          valueProperty=\"departmentId\"\r\n                                                                          codeProperty=\"departmentCode\"\r\n                                                                          displayProperty=\"description\"\r\n                                                                          placeholder=\"Departments\"\r\n                                                                          placeholderFilter=\"Department\"\r\n                                                                          elementName=\"Department\"\r\n                                                                          (selectionChangedEvent)=\"onDepartmentSelectionChange($event)\">\r\n\r\n                    </atlas-contextual-search-multiple-autocomplete-select>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n\r\n        <button mat-raised-button\r\n                class=\"generate-report-button\"\r\n                (click)=\"onGenerateExcelButtonClicked()\">Detailed Excel View</button>\r\n    </div>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 [toBeDownloaded]=\"toBeDownloaded\"\r\n                                 #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.scss":
/*!************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.scss ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 0 !important; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.ts":
/*!**********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.ts ***!
  \**********************************************************************************************************************/
/*! exports provided: FxExposureReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FxExposureReportComponent", function() { return FxExposureReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component */ "./Client/app/shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var FxExposureReportComponent = /** @class */ (function () {
    function FxExposureReportComponent(freezeService, snackbarService, formBuilder, route, companyManager, formConfigurationProvider) {
        this.freezeService = freezeService;
        this.snackbarService = snackbarService;
        this.formBuilder = formBuilder;
        this.route = route;
        this.companyManager = companyManager;
        this.formConfigurationProvider = formConfigurationProvider;
        this.fxExposureSnapshotCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.companySelect = ['companyId'];
        this.columnsListDisplayProperty = ['name'];
        this.snapshotList = [];
        this.currentSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_10__["FreezeDisplayView"](-1, 'CURRENT');
        this.parameters = [];
        this.toBeDownloaded = false;
        this.isViewRealizedPhysicals = false;
        this.isDisplay = false;
        this.isExcludeBankAccount = false;
        this.isExcludeGLAccount = false;
        this.companyList = [];
        this.departments = [];
        this.filteredCompany = [];
        this.selectedCompanies = [];
        this.filteredDepartments = [];
        this.selectedFilteredDepartments = [];
        this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].reportServerLink;
        this.reportPath = 'LDC Atlas/FxExposure/FxExposureSummary';
        this.reportPathForDownload = 'LDC Atlas/FxExposure/FxExposureDetailDownload';
        this.showError = false;
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.CurrencyAllOptions = {
            currencyCode: 'All',
        };
        this.allCurrenciesSelected = true;
        this.departmentAllOptions = {
            departmentCode: 'All',
            departmentId: 0,
        };
        this.allDepartmentsSelected = true;
        // super(formConfigurationProvider);
        this.company = this.route.snapshot.paramMap.get('company');
    }
    FxExposureReportComponent.prototype.ngOnInit = function () {
        this.masterData = this.route.snapshot.data.masterdata;
        this.currencies = this.route.snapshot.data.masterdata.currencies;
        this.currencyDropdownComponent.options = this.currencies;
        this.currencyDropdownComponent.optionsChanged();
        this.filteredDepartments = this.masterData.departments;
        this.departmentDropdownComponent.options = this.filteredDepartments;
        this.departmentDropdownComponent.optionsChanged();
        this.loadSnapshots();
    };
    /*    getCompaniesList(): any[] {
            const options: Company[] = this.companyManager.getLoadedCompanies();
            return options;
        }*/
    // will be implemented when the db changes for company list is done .
    /*   onCompanySelected(data: object[]) {
           if (data) {
               this.selectedCompanies = [];
               if (data.length > 0) {
                   data.forEach((company) => { this.selectedCompanies.push(company['companyId']); });
               }
               this.reportCriterias.getDataForSelectedCompanies(this.selectedCompanies);
           }
       }*/
    FxExposureReportComponent.prototype.initializeForm = function () {
        this.fxExpouserReportFormGroup = this.formBuilder.group({});
        this.setValidators();
        return this.fxExpouserReportFormGroup;
    };
    FxExposureReportComponent.prototype.setValidators = function () {
        this.fxExposureSnapshotCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__["inDropdownListValidator"])(this.snapshotList, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_14__["nameof"])('dataVersionId')),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]));
    };
    FxExposureReportComponent.prototype.loadSnapshots = function () {
        var _this = this;
        this.freezeService.getFreezeList().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) {
            return data.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_10__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate), freeze.freezeDate, freeze.dataVersionTypeId);
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (snapshots) {
            _this.snapshotList = snapshots;
            if (snapshots.length > 0) {
                _this.fxExposureSnapshotCtrl.setValue(snapshots[0]);
            }
            _this.snapshotList.unshift(_this.currentSnapshot);
            _this.initializeForm();
        });
    };
    FxExposureReportComponent.prototype.onToggleDisplay = function () {
        this.isDisplay = !this.isDisplay;
    };
    FxExposureReportComponent.prototype.onToggleExcludeBankAccount = function () {
        this.isExcludeBankAccount = !this.isExcludeBankAccount;
    };
    FxExposureReportComponent.prototype.onToggleExcludeGLAccount = function () {
        this.isExcludeGLAccount = !this.isExcludeGLAccount;
    };
    FxExposureReportComponent.prototype.onCurrencySelectionChanged = function (selectedCurrency) {
        this.currencyValue = selectedCurrency;
    };
    FxExposureReportComponent.prototype.onDepartmentSelectionChange = function (selectedDepartment) {
        this.departments = selectedDepartment;
    };
    FxExposureReportComponent.prototype.onGenerateReportButtonClicked = function () {
        var _this = this;
        var snapshotId = this.fxExposureSnapshotCtrl.value.dataVersionId;
        if (snapshotId !== -1 && this.selectedCompanies.length > 0) {
            var freezeDate = this.fxExposureSnapshotCtrl.value;
            this.freezeService.checkFreezeForSelectedDatabase(this.selectedCompanies, freezeDate['dataVersionTypeId'], freezeDate, null, null).subscribe(function (data) {
                if (data) {
                    var missingCompanyList = void 0;
                    if (data.missingCompany) {
                        _this.showError = true;
                        missingCompanyList = data.missingCompany;
                    }
                    else {
                        _this.showError = false;
                    }
                    if (!_this.showError) {
                        _this.onGenerateReportParameter();
                        _this.toBeDownloaded = false;
                        _this.ssrsReportViewer.generateReport(_this.reportServerUrl, _this.reportPath, _this.parameters);
                    }
                    else {
                        _this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                            + missingCompanyList + ' report cannot be generated');
                    }
                }
            });
        }
        else {
            this.onGenerateReportParameter();
            this.toBeDownloaded = false;
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
        }
    };
    FxExposureReportComponent.prototype.onGenerateExcelButtonClicked = function () {
        this.onGenerateReportParameter();
        this.toBeDownloaded = true;
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPathForDownload, this.parameters);
    };
    FxExposureReportComponent.prototype.onGenerateReportParameter = function () {
        var _this = this;
        var snapshotId = this.fxExposureSnapshotCtrl.value.dataVersionId;
        this.parameters = [];
        this.parameters.push({ name: 'iCompanyName', value: this.route.snapshot.params.company });
        if (this.departments.length < this.filteredDepartments.length) {
            this.departments.forEach(function (department) {
                _this.parameters.push({ name: 'iDepartmentId', value: department.departmentId });
            });
        }
        if (this.currencyValue && this.currencyValue.length < this.currencies.length) {
            this.currencyValue.forEach(function (currency) {
                _this.parameters.push({ name: 'iCurrencyCode', value: currency.currencyCode });
            });
        }
        if (snapshotId != -1) {
            this.parameters.push({ name: 'iDataVersionId', value: snapshotId });
        }
        if (this.isDisplay) {
            this.parameters.push({ name: 'iDisplayOpenRealised', value: 1 });
        }
        if (this.isExcludeBankAccount) {
            this.parameters.push({ name: 'iExcludeBankAccount', value: 1 });
        }
        if (this.isExcludeGLAccount) {
            this.parameters.push({ name: 'iExcludeGLAccount', value: 1 });
        }
    };
    FxExposureReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__["SSRSReportViewerComponent"])
    ], FxExposureReportComponent.prototype, "ssrsReportViewer", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('currencyDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_7__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], FxExposureReportComponent.prototype, "currencyDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('departmentDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_7__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], FxExposureReportComponent.prototype, "departmentDropdownComponent", void 0);
    FxExposureReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-fx-exposure-report',
            template: __webpack_require__(/*! ./fx-exposure-report.component.html */ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.html"),
            styles: [__webpack_require__(/*! ./fx-exposure-report.component.scss */ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_12__["FreezeService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_13__["SnackbarService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_11__["FormConfigurationProviderService"]])
    ], FxExposureReportComponent);
    return FxExposureReportComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.html":
/*!**********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.html ***!
  \**********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form [formGroup]=\"formGroup\">\r\n    <mat-card>\r\n        <mat-card-title>\r\n            <h2>\r\n                Criteria\r\n            </h2>\r\n        </mat-card-title>\r\n        <mat-card-content>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"space-between-center\">\r\n                <atlas-contextual-search-multiple-autocomplete-select #currencyDropdownComponent\r\n                                                                      [options]=\"currencies\"\r\n                                                                      [selectedOptions]=\"[]\"\r\n                                                                      [allOptionsElement]=\"CurrencyAllOptions\"\r\n                                                                      [allSelected]=\"allCurrenciesSelected\"\r\n                                                                      displayCode=\"true\"\r\n                                                                      valueProperty=\"currencyCode\"\r\n                                                                      codeProperty=\"currencyCode\"\r\n                                                                      placeholder=\"Currency Code\"\r\n                                                                      placeholderFilter=\"Currency Code\"\r\n                                                                      elementName=\"Currency Code\"\r\n                                                                      (selectionChangedEvent)=\"onCurrencySelectionChanged($event)\">\r\n                </atlas-contextual-search-multiple-autocomplete-select>\r\n\r\n                <atlas-dropdown-select [label]=\"'Type of rate'\"\r\n                                       [fieldControl]=\"monthEndCtrl\"\r\n                                       isEditable=true\r\n                                       [options]=\"monthEndList\"\r\n                                       displayProperty=\"id\"\r\n                                       [selectProperties]=\"['value']\"\r\n                                       (optionSelected)=\"onChanges()\">\r\n                </atlas-dropdown-select>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</form>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.scss":
/*!**********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.scss ***!
  \**********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.ts":
/*!********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.ts ***!
  \********************************************************************************************************************************************/
/*! exports provided: CriteraComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CriteraComponent", function() { return CriteraComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component */ "./Client/app/shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component.ts");
/* harmony import */ var _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../shared/enums/foreign-exchange-rate-viewmode.enum */ "./Client/app/shared/enums/foreign-exchange-rate-viewmode.enum.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
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







var CriteraComponent = /** @class */ (function (_super) {
    __extends(CriteraComponent, _super);
    function CriteraComponent(formBuilder, route, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.route = route;
        _this.monthEndList = [];
        _this.rateSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.currencySelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.CurrencyAllOptions = {
            currencyCode: 'All',
        };
        _this.allCurrenciesSelected = true;
        return _this;
    }
    CriteraComponent.prototype.ngOnInit = function () {
        this.getFormGroup();
        this.monthEndList = this.getMonthEndList();
        this.monthEndCtrl.patchValue(this.monthEndList[0]);
        this.initCurrencies();
        this.onChanges();
    };
    CriteraComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            monthEndCtrl: this.monthEndCtrl,
        });
        this.initControls();
        return _super.prototype.getFormGroup.call(this);
    };
    CriteraComponent.prototype.initControls = function () {
        this.monthEndCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]);
    };
    CriteraComponent.prototype.initCurrencies = function () {
        this.currencies = this.route.snapshot.data.masterdata.currencies;
        this.currencyDropdownComponent.options = this.currencies;
        this.currencyDropdownComponent.optionsChanged();
    };
    CriteraComponent.prototype.getMonthEndList = function () {
        var options = [];
        var fxRateEnumArray = Object.keys(_shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_5__["ForeignExchangeRateViewMode"]).map(function (key) {
            return {
                id: key,
                value: _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_5__["ForeignExchangeRateViewMode"][key],
            };
        });
        fxRateEnumArray.forEach(function (fxRateEnumValue) {
            options.push(fxRateEnumValue);
        });
        return options;
    };
    CriteraComponent.prototype.onCurrencySelectionChanged = function (selectedCurrency) {
        this.currencySelected.emit(selectedCurrency);
        this.currencyValue = selectedCurrency;
    };
    CriteraComponent.prototype.onChanges = function () {
        var _this = this;
        this.monthEndCtrl.valueChanges.subscribe(function (value) {
            _this.rateSelected.emit(value.value);
            _this.selectedRate = value;
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('currencyDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_4__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], CriteraComponent.prototype, "currencyDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CriteraComponent.prototype, "rateSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CriteraComponent.prototype, "currencySelected", void 0);
    CriteraComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-critera',
            template: __webpack_require__(/*! ./critera.component.html */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.html"),
            styles: [__webpack_require__(/*! ./critera.component.scss */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_6__["FormConfigurationProviderService"]])
    ], CriteraComponent);
    return CriteraComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.html":
/*!********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.html ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form [formGroup]=\"formGroup\">\r\n    <mat-card>\r\n        <mat-card-title>\r\n            <h2>\r\n                Period\r\n            </h2>\r\n        </mat-card-title>\r\n        <mat-card-content>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"space-between\"\r\n                 fxLayoutGap=\"2%\">\r\n                <div fxFlex=\"15%\">\r\n                    <mat-button-toggle-group name=\"toggleStyle\"\r\n                                             [formControl]='periodCtrl'\r\n                                             (change)=\"onPeriodDataChanged()\"\r\n                                             [value]=\"setPeriodType\">\r\n                        <mat-button-toggle [disabled]=\"disableDaily\"\r\n                                           [value]=\"daily\">Daily\r\n                        </mat-button-toggle>\r\n                        <mat-button-toggle [disabled]=\"disableMonthly\"\r\n                                           [value]=\"monthly\">Monthly\r\n                        </mat-button-toggle>\r\n                    </mat-button-toggle-group>\r\n                </div>\r\n                <div class=\"from-and-to-dates\"\r\n                     fxFlex=\"40%\">\r\n                    <div fxFlex=\"50%\">\r\n                        <atlas-date-picker *ngIf=\"activateDay\"\r\n                                           isEditable=true\r\n                                           label=\"From\"\r\n                                           [fieldControl]=\"fromCtrl\"\r\n                                           (dateChanged)=\"onFromChanged()\">\r\n                        </atlas-date-picker>\r\n                        <mat-error class=\"date-error\"\r\n                                   *ngIf=\"fromCtrl.hasError('isDateAfterValid') && activateDay\">\r\n                            \"From\" date cannot be in the future\r\n                        </mat-error>\r\n                        <atlas-month-date-picker *ngIf=\"activateMonth\"\r\n                                                 isEditable=true\r\n                                                 class=\"month-date-picker\"\r\n                                                 label=\"From\"\r\n                                                 [fieldControl]=\"fromCtrl\"\r\n                                                 (monthChanged)=\"onFromChanged()\">\r\n                        </atlas-month-date-picker>\r\n                        <mat-error class=\"date-error\"\r\n                                   *ngIf=\"fromCtrl.hasError('isDateAfterValid') && activateMonth\">\r\n                            \"From\" month cannot be in the future\r\n                        </mat-error>\r\n                    </div>\r\n                    <div fxFlex=\"50%\">\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutGap=\"1%\">\r\n                            <atlas-date-picker *ngIf=\"activateDay\"\r\n                                               isEditable=true\r\n                                               label=\"To\"\r\n                                               [fieldControl]=\"toCtrl\"\r\n                                               [errorMap]=\"dailyErrorMap\"\r\n                                               (dateChanged)=\"onToChanged()\">\r\n                            </atlas-date-picker>\r\n                            <mat-error class=\"date-error\"\r\n                                       *ngIf=\"toCtrl.hasError('isDateAfterValid') && activateDay\">\r\n                                \"To\" date cannot be in the future\r\n                            </mat-error>\r\n                            <atlas-month-date-picker *ngIf=\"activateMonth\"\r\n                                                     isEditable=true\r\n                                                     class=\"month-date-picker\"\r\n                                                     label=\"To\"\r\n                                                     [fieldControl]=\"toCtrl\"\r\n                                                     (monthChanged)=\"onToChanged()\">\r\n                            </atlas-month-date-picker>\r\n                            <mat-error class=\"date-error\"\r\n                                       *ngIf=\"toCtrl.hasError('isDateAfterValid') && activateMonth\">\r\n                                \"To\" month cannot be in the future\r\n                            </mat-error>\r\n                            <mat-error class=\"date-error\"\r\n                                       *ngIf=\"toCtrl.hasError('isBeforeDateValid') && activateDay\">\r\n                                \"To\" date cannot be before the \"from\" date\r\n                            </mat-error>\r\n                            <mat-error class=\"date-error\"\r\n                                       *ngIf=\"toCtrl.hasError('isBeforeDateValid') && activateMonth\">\r\n                                \"To\" month cannot be before the \"from\" month\r\n                            </mat-error>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div fxFlex=\"45%\">\r\n                    <mat-slide-toggle [formControl]=\"showAllDatesCtrl\"\r\n                                      [disabled]=\"disableDaily\"\r\n                                      (change)=\"onShowAllDatesChanged()\">Show All Dates</mat-slide-toggle>\r\n                </div>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</form>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.scss":
/*!********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.scss ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".from-and-to-dates {\n  margin-left: 72px; }\n\n.date-error {\n  color: #DF5A4D !important;\n  font-size: 75%; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.ts":
/*!******************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.ts ***!
  \******************************************************************************************************************************************/
/*! exports provided: PeriodComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeriodComponent", function() { return PeriodComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../../shared/enums/foreign-exchange-rate-viewmode.enum */ "./Client/app/shared/enums/foreign-exchange-rate-viewmode.enum.ts");
/* harmony import */ var _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../shared/enums/freeze-type.enum */ "./Client/app/shared/enums/freeze-type.enum.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../../shared/validators/date-validators.validator */ "./Client/app/shared/validators/date-validators.validator.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
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








var moment = moment__WEBPACK_IMPORTED_MODULE_2__;

var PeriodComponent = /** @class */ (function (_super) {
    __extends(PeriodComponent, _super);
    function PeriodComponent(formBuilder, formConfigurationProviderService, companyManager) {
        var _this = _super.call(this, formConfigurationProviderService) || this;
        _this.formBuilder = formBuilder;
        _this.companyManager = companyManager;
        _this.periodSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.fromSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.toSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.showAllDatesSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.periodCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.fromCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.toCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.showAllDatesCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.disableMonthly = true;
        _this.disableDaily = true;
        _this.daily = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_5__["FreezeType"].Daily;
        _this.monthly = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_5__["FreezeType"].Monthly;
        _this.activateMonth = false;
        _this.activateDay = true;
        _this.dailyErrorMap = new Map();
        _this.monthlyErrorMap = new Map();
        _this.toDateErrorMap = new Map();
        return _this;
    }
    PeriodComponent.prototype.ngOnInit = function () {
        this.getFormGroup();
        this.fromCtrl.disable();
        this.toCtrl.disable();
    };
    PeriodComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            periodCtrl: this.periodCtrl,
            fromCtrl: this.fromCtrl,
            toCtrl: this.toCtrl,
            showAllDatesCtrl: this.showAllDatesCtrl,
        });
        return this.formGroup;
    };
    PeriodComponent.prototype.setDefaultValues = function () {
        if (this.setPeriodType === this.daily) {
            this.activateMonth = false;
            this.activateDay = true;
        }
        if (this.setPeriodType === this.monthly) {
            this.activateDay = false;
            this.activateMonth = true;
        }
    };
    PeriodComponent.prototype.setDateValidators = function () {
        this.toCtrl.clearValidators();
        this.toCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([(Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_7__["isDateBeforeControlDate"])(moment(this.fromDateSet))), Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_7__["isAfterDate"])(this.companyManager.getCurrentCompanyDate())]));
        this.toCtrl.updateValueAndValidity();
    };
    PeriodComponent.prototype.getRateSelected = function (rate) {
        this.disablePeriod(rate);
        this.setDefaultValues();
        this.formGroup.updateValueAndValidity();
        this.formGroup.reset();
    };
    PeriodComponent.prototype.disablePeriod = function (rate) {
        if (_shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_4__["ForeignExchangeRateViewMode"]) {
            switch (rate) {
                case _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_4__["ForeignExchangeRateViewMode"].Daily:
                    {
                        this.disableDaily = false;
                        this.disableMonthly = false;
                        this.fromCtrl.enable();
                        this.toCtrl.enable();
                        this.setPeriodType = this.daily;
                        this.periodCtrl.patchValue(this.daily);
                        this.fromCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_7__["isAfterDate"])(this.companyManager.getCurrentCompanyDate())]));
                        this.disableMonthly = true;
                        break;
                    }
                case _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_4__["ForeignExchangeRateViewMode"].Monthly:
                    {
                        this.disableDaily = false;
                        this.disableMonthly = false;
                        this.fromCtrl.enable();
                        this.toCtrl.enable();
                        this.setPeriodType = this.monthly;
                        this.periodCtrl.patchValue(this.monthly);
                        this.fromCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_7__["isAfterDate"])(this.companyManager.getCurrentCompanyDate())]));
                        this.disableDaily = true;
                        break;
                    }
                case _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_4__["ForeignExchangeRateViewMode"].Spot:
                    {
                        this.disableDaily = true;
                        this.disableMonthly = true;
                        this.fromCtrl.disable();
                        this.toCtrl.disable();
                        this.fromCtrl.disable();
                        this.toCtrl.disable();
                        this.setPeriodType = null;
                        this.fromCtrl.setValidators(null);
                        this.toCtrl.setValidators(null);
                        this.fromCtrl.patchValue(null);
                        this.toCtrl.patchValue(null);
                        break;
                    }
            }
            this.formGroup.updateValueAndValidity();
        }
    };
    PeriodComponent.prototype.onPeriodDataChanged = function () {
        var _this = this;
        this.periodCtrl.valueChanges.subscribe(function (periodValue) {
            _this.setDefaultValues();
            _this.periodSelected.emit(periodValue);
        });
    };
    PeriodComponent.prototype.onFromChanged = function () {
        if (this.fromCtrl.value && this.fromCtrl.valid) {
            this.setDefaultValues();
            this.fromSelected.emit(this.fromCtrl.value);
            this.fromDateSet = this.fromCtrl.value;
        }
        this.setDateValidators();
    };
    PeriodComponent.prototype.onToChanged = function () {
        if (this.toCtrl.value && this.toCtrl.valid) {
            this.setDefaultValues();
            this.toSelected.emit(this.toCtrl.value);
        }
        this.setDateValidators();
        this.formGroup.updateValueAndValidity();
    };
    PeriodComponent.prototype.onShowAllDatesChanged = function () {
        if (this.showAllDatesCtrl.value && this.showAllDatesCtrl.valid) {
            this.showAllDatesSelected.emit(this.showAllDatesCtrl.value);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], PeriodComponent.prototype, "periodSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], PeriodComponent.prototype, "fromSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], PeriodComponent.prototype, "toSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], PeriodComponent.prototype, "showAllDatesSelected", void 0);
    PeriodComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-period',
            template: __webpack_require__(/*! ./period.component.html */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.html"),
            styles: [__webpack_require__(/*! ./period.component.scss */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_6__["FormConfigurationProviderService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_8__["CompanyManagerService"]])
    ], PeriodComponent);
    return PeriodComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.html":
/*!**********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.html ***!
  \**********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form [formGroup]=\"formGroup\">\r\n    <mat-card>\r\n        <mat-card-title>\r\n            <h2>\r\n                Sort By\r\n            </h2>\r\n        </mat-card-title>\r\n        <mat-card-content>\r\n            <div fxFlex=\"50%\">\r\n                <mat-button-toggle-group class=\"sort-by\"\r\n                                         name=\"toggleStyle\"\r\n                                         [formControl]='sortByCtrl'\r\n                                         [value]=\"ReportSortType.Currency\"\r\n                                         (change)=\"onChanges()\">\r\n                    <mat-button-toggle [value]=\"ReportSortType.Currency\">{{ReportSortType[ReportSortType.Currency]}}\r\n                    </mat-button-toggle>\r\n                    <mat-button-toggle [value]=\"ReportSortType.Date\">{{ReportSortType[ReportSortType.Date]}}\r\n                    </mat-button-toggle>\r\n                </mat-button-toggle-group>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</form>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.scss":
/*!**********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.scss ***!
  \**********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".sort-by {\n  margin-bottom: 25px; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.ts":
/*!********************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.ts ***!
  \********************************************************************************************************************************************/
/*! exports provided: SortByComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SortByComponent", function() { return SortByComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../shared/enums/report-sort-type.enum */ "./Client/app/shared/enums/report-sort-type.enum.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
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





var SortByComponent = /** @class */ (function (_super) {
    __extends(SortByComponent, _super);
    function SortByComponent(formBuilder, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.sortBySelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.sortByCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.ReportSortType = _shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_2__["ReportSortType"];
        return _this;
    }
    SortByComponent.prototype.ngOnInit = function () {
        this.getFormGroup();
        this.sortByCtrl.patchValue(_shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_2__["ReportSortType"].Currency);
        this.onChanges();
    };
    SortByComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            sortByCtrl: this.sortByCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    SortByComponent.prototype.onChanges = function () {
        var _this = this;
        this.sortByCtrl.valueChanges.subscribe(function (sortByValue) {
            _this.sortBySelected.emit(sortByValue);
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], SortByComponent.prototype, "sortBySelected", void 0);
    SortByComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-sort-by',
            template: __webpack_require__(/*! ./sort-by.component.html */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.html"),
            styles: [__webpack_require__(/*! ./sort-by.component.scss */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__["FormConfigurationProviderService"]])
    ], SortByComponent);
    return SortByComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.html":
/*!****************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.html ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form [formGroup]=\"formGroup\">\r\n    <div class=\"main-container\">\r\n        <div fxLayout=\"column\">\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutGap=\"2%\"\r\n                 fxLayoutAlign=\"space-between-center\">\r\n                <div fxFlex=\"35%\">\r\n                    <atlas-critera #criteraComponent\r\n                                   (rateSelected)=\"onRateSelected($event)\"\r\n                                   (currSelected)=\"onCurrencySelected($event)\"></atlas-critera>\r\n                </div>\r\n                <div fxFlex=\"45%\">\r\n                    <atlas-period #periodComponent\r\n                                  [rateSelected]=\"rateSelected\"\r\n                                  (periodSelected)=\"onPeriodSelected($event)\"\r\n                                  (fromSelected)=\"onFromSelected($event)\"\r\n                                  (toSelected)=\"onToSelected($event)\"\r\n                                  (showAllDatesSelected)=\"onShowAllDatesSelected($event)\"></atlas-period>\r\n                </div>\r\n                <div fxFlex=\"20%\">\r\n                    <atlas-sort-by #sortByComponent\r\n                                   (sortBySelected)=\"onSortBySelected($event)\"></atlas-sort-by>\r\n                </div>\r\n            </div>\r\n            <div>\r\n                <button mat-raised-button\r\n                        class=\"generate-report-button report-button\"\r\n                        (click)=\"onGenerateReportButtonClicked(true)\">GENERATE REPORT</button>\r\n            </div>\r\n            <div class=\"report-container\">\r\n                <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                         [reportUrl]=\"reportPath\"\r\n                                         [parameters]=\"parameters\"\r\n                                         #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.scss":
/*!****************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.scss ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".report-button {\n  float: right; }\n\n.report-container {\n  height: 60vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.ts":
/*!**************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.ts ***!
  \**************************************************************************************************************************************************/
/*! exports provided: HistoricalExchangeRatesReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HistoricalExchangeRatesReportComponent", function() { return HistoricalExchangeRatesReportComponent; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/enums/foreign-exchange-rate-viewmode.enum */ "./Client/app/shared/enums/foreign-exchange-rate-viewmode.enum.ts");
/* harmony import */ var _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/enums/freeze-type.enum */ "./Client/app/shared/enums/freeze-type.enum.ts");
/* harmony import */ var _shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/enums/report-sort-type.enum */ "./Client/app/shared/enums/report-sort-type.enum.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../report-criterias/report-criterias.component */ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.ts");
/* harmony import */ var _components_critera_critera_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/critera/critera.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.ts");
/* harmony import */ var _components_period_period_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/period/period.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.ts");
/* harmony import */ var _components_sort_by_sort_by_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/sort-by/sort-by.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.ts");
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















var HistoricalExchangeRatesReportComponent = /** @class */ (function (_super) {
    __extends(HistoricalExchangeRatesReportComponent, _super);
    function HistoricalExchangeRatesReportComponent(datepipe, formBuilder, formConfigurationProvider, snackbarService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.datepipe = datepipe;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.snackbarService = snackbarService;
        _this.formComponents = [];
        _this.rateSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        _this.isGenerateButtonClicked = false;
        _this.selectedAllDates = false;
        _this.selectedSortBy = _shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_8__["ReportSortType"][_shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_8__["ReportSortType"].Currency];
        _this.ReportSortType = _shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_8__["ReportSortType"];
        _this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].reportServerLink;
        _this.reportPath = 'LDC Atlas/HistoricalFX Rate/HistoricalFXRate';
        _this.parameters = [];
        _this.monthly = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_7__["FreezeType"][_shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_7__["FreezeType"].Monthly];
        _this.daily = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_7__["FreezeType"][_shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_7__["FreezeType"].Daily];
        _this.spot = _shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_6__["ForeignExchangeRateViewMode"][_shared_enums_foreign_exchange_rate_viewmode_enum__WEBPACK_IMPORTED_MODULE_6__["ForeignExchangeRateViewMode"].Spot];
        return _this;
    }
    HistoricalExchangeRatesReportComponent.prototype.ngOnInit = function () {
        this.formGroup = this.formBuilder.group({
            criteraComponent: this.historicalRatesCriteriaComponent.getFormGroup(),
            periodComponent: this.historicalRatesPeriodComponent.getFormGroup(),
            sortByComponent: this.historicalRatesSortByComponent.getFormGroup(),
        });
        this.formComponents.push(this.historicalRatesCriteriaComponent, this.historicalRatesPeriodComponent, this.historicalRatesSortByComponent);
    };
    HistoricalExchangeRatesReportComponent.prototype.onRateSelected = function (rateSelected) {
        this.selectedRate = rateSelected;
        this.historicalRatesPeriodComponent.getRateSelected(rateSelected);
        this.setFromFormat();
    };
    HistoricalExchangeRatesReportComponent.prototype.onCurrencySelected = function (currencySelected) {
        this.selectedCurrency = currencySelected;
    };
    HistoricalExchangeRatesReportComponent.prototype.onFromSelected = function (fromSelected) {
        this.setFromFormat(fromSelected);
    };
    HistoricalExchangeRatesReportComponent.prototype.onToSelected = function (toSelected) {
        this.setToFormat(toSelected);
    };
    HistoricalExchangeRatesReportComponent.prototype.onShowAllDatesSelected = function (allDatesSelected) {
        this.selectedAllDates = allDatesSelected;
    };
    HistoricalExchangeRatesReportComponent.prototype.onSortBySelected = function (sortBySelected) {
        this.selectedSortBy = _shared_enums_report_sort_type_enum__WEBPACK_IMPORTED_MODULE_8__["ReportSortType"][sortBySelected];
    };
    HistoricalExchangeRatesReportComponent.prototype.onPeriodSelected = function (periodSelected) {
        this.selectedPeriod = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_7__["FreezeType"][periodSelected];
    };
    HistoricalExchangeRatesReportComponent.prototype.onGenerateReportButtonClicked = function (isGenerateButtonClicked) {
        if (this.formGroup.valid &&
            this.historicalRatesCriteriaComponent.currencyValue.length !== 0) {
            this.generateReport();
        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
        }
    };
    HistoricalExchangeRatesReportComponent.prototype.setFromFormat = function (from) {
        if (from) {
            this.selectedFrom = (this.selectedRate === this.monthly) ?
                this.datepipe.transform(from, 'MMM yyyy') : this.datepipe.transform(from, 'yyyy-MM-dd');
        }
        else {
            this.selectedFrom = null;
        }
    };
    HistoricalExchangeRatesReportComponent.prototype.setToFormat = function (to) {
        if (to) {
            this.selectedTo = (this.selectedRate === this.monthly) ?
                this.datepipe.transform(to, 'MMM yyyy') : this.datepipe.transform(to, 'yyyy-MM-dd');
        }
        else {
            this.selectedTo = null;
        }
    };
    HistoricalExchangeRatesReportComponent.prototype.generateReport = function () {
        this.parameters = [
            { name: 'ShowAllDates', value: this.selectedAllDates },
            { name: 'SortBy', value: this.selectedSortBy },
        ];
        this.getReportCriteria();
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    };
    HistoricalExchangeRatesReportComponent.prototype.getReportCriteria = function () {
        var _this = this;
        if (!this.historicalRatesCriteriaComponent.currencyDropdownComponent.allSelected) {
            this.historicalRatesCriteriaComponent.currencyValue.forEach(function (currency) {
                _this.parameters.push({ name: 'Currency', value: currency.currencyCode });
            });
        }
        if (this.selectedFrom) {
            this.parameters.push({ name: 'From', value: this.selectedFrom });
        }
        if (this.selectedTo) {
            this.parameters.push({ name: 'To', value: this.selectedTo });
        }
        if ((this.selectedRate) && (!(this.selectedRate === this.spot))) {
            this.parameters.push({ name: 'Period', value: this.selectedRate });
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('criteraComponent'),
        __metadata("design:type", _components_critera_critera_component__WEBPACK_IMPORTED_MODULE_12__["CriteraComponent"])
    ], HistoricalExchangeRatesReportComponent.prototype, "historicalRatesCriteriaComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('periodComponent'),
        __metadata("design:type", _components_period_period_component__WEBPACK_IMPORTED_MODULE_13__["PeriodComponent"])
    ], HistoricalExchangeRatesReportComponent.prototype, "historicalRatesPeriodComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('sortByComponent'),
        __metadata("design:type", _components_sort_by_sort_by_component__WEBPACK_IMPORTED_MODULE_14__["SortByComponent"])
    ], HistoricalExchangeRatesReportComponent.prototype, "historicalRatesSortByComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_5__["SSRSReportViewerComponent"])
    ], HistoricalExchangeRatesReportComponent.prototype, "ssrsReportViewer", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('reportCriterias'),
        __metadata("design:type", _report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_11__["ReportCriteriasComponent"])
    ], HistoricalExchangeRatesReportComponent.prototype, "reportCriterias", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        __metadata("design:type", Object)
    ], HistoricalExchangeRatesReportComponent.prototype, "rateSelected", void 0);
    HistoricalExchangeRatesReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'atlas-historical-exchange-rates-report',
            template: __webpack_require__(/*! ./historical-exchange-rates-report.component.html */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.html"),
            styles: [__webpack_require__(/*! ./historical-exchange-rates-report.component.scss */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.scss")],
            providers: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["DatePipe"]],
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_0__["DatePipe"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_9__["FormConfigurationProviderService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarService"]])
    ], HistoricalExchangeRatesReportComponent);
    return HistoricalExchangeRatesReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.html":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.html ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <form [formGroup]=\"newBizReportFormGroup\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start\"\r\n             fxLayoutGap=\"10px\"\r\n             fxLayoutAlign.lt-md=\"start center\">\r\n            <mat-card fxFlex=\"35%\">\r\n                <mat-card-header>\r\n                    <mat-card-title>\r\n                        <h2>Report Parameters</h2>\r\n                    </mat-card-title>\r\n                </mat-card-header>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutGap=\"20px\">\r\n                        <mat-form-field fxFlex=\"31%\">\r\n                            <mat-select [formControl]=\"contractDateCtrl\"\r\n                                        required=\"contractDateCtrl.isRequired\">\r\n                                <mat-option *ngFor=\"let newBizDate of newBizDateTypes\"\r\n                                            [value]=\"newBizDate.value\">\r\n                                    {{newBizDate.newBizDateTypesDescription}}</mat-option>\r\n                            </mat-select>\r\n                            <mat-error *ngIf=\"contractDateCtrl.hasError('required')\">\r\n                                This field is required\r\n                            </mat-error>\r\n                        </mat-form-field>\r\n                        <span fxLayoutGap=\"5%\">\r\n                            <div class=\"custom-form\"\r\n                                 fxFlex=\"25%\"\r\n                                 [class.isEmpty]=\"!newBizDateFromCtrl.value\"\r\n                                 [class.required-field]=\"newBizDateFromCtrl.isRequired\">\r\n                                <mat-form-field>\r\n                                    <input matInput\r\n                                           [required]=\"newBizDateFromCtrl.isRequired\"\r\n                                           [matDatepicker]=\"frompicker\"\r\n                                           placeholder=\"From\"\r\n                                           value=\"frompicker\"\r\n                                           autocomplete=\"off\"\r\n                                           [formControl]='newBizDateFromCtrl'>\r\n                                    <mat-datepicker-toggle matSuffix\r\n                                                           [for]=\"frompicker\"></mat-datepicker-toggle>\r\n                                    <mat-datepicker #frompicker></mat-datepicker>\r\n                                    <mat-error *ngIf=\"newBizDateFromCtrl.hasError('required')\">\r\n                                        This field is required\r\n                                    </mat-error>\r\n                                    <mat-error *ngIf=\"newBizDateToCtrl.hasError('isBeforeDate')\">\r\n                                        Cannot be After Period To\r\n                                    </mat-error>\r\n                                    <mat-hint *ngIf=\"newBizDateFromCtrl.isRequired\">\r\n                                        Required *\r\n                                    </mat-hint>\r\n                                </mat-form-field>\r\n                            </div>\r\n\r\n                            <div class=\"custom-form\"\r\n                                 fxFlex=\"25%\"\r\n                                 [class.isEmpty]=\"!newBizDateToCtrl.value\"\r\n                                 [class.required-field]=\"newBizDateToCtrl.isRequired\">\r\n                                <mat-form-field>\r\n                                    <input matInput\r\n                                           [required]=\"newBizDateToCtrl.isRequired\"\r\n                                           [matDatepicker]=\"topicker\"\r\n                                           placeholder=\"To\"\r\n                                           value=\"topicker\"\r\n                                           autocomplete=\"off\"\r\n                                           [formControl]='newBizDateToCtrl'>\r\n                                    <mat-datepicker-toggle matSuffix\r\n                                                           [for]=\"topicker\"></mat-datepicker-toggle>\r\n                                    <mat-datepicker #topicker></mat-datepicker>\r\n                                    <mat-error *ngIf=\"newBizDateToCtrl.hasError('required')\">\r\n                                        This field is required\r\n                                    </mat-error>\r\n                                    <mat-error *ngIf=\"newBizDateToCtrl.hasError('isBeforeDate')\">\r\n                                        Cannot be before Period From\r\n                                    </mat-error>\r\n                                    <mat-hint *ngIf=\"newBizDateToCtrl.isRequired\">\r\n                                        Required *\r\n                                    </mat-hint>\r\n                                </mat-form-field>\r\n                            </div>\r\n\r\n                        </span>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         class=\"container-custom\"\r\n                         fxLayoutGap=\"20px\">\r\n                        <atlas-masterdata-user-preferences-input fxFlex=\"30%\"\r\n                                                                 isEditable=\"true\"\r\n                                                                 [fieldControl]=\"newBizReportDepartmentCtrl\"\r\n                                                                 [options]=\"filteredDepartmentList\"\r\n                                                                 label=\"Department\"\r\n                                                                 displayProperty=\"departmentCode\"\r\n                                                                 [selectProperties]=\"['departmentCode', 'description']\"\r\n                                                                 [errorMap]=\"departmentErrorMap\"\r\n                                                                 lightBoxTitle=\"Results for Departments\"\r\n                                                                 gridId=\"departmentsGrid\">\r\n                        </atlas-masterdata-user-preferences-input>\r\n                        <mat-form-field fxFlex=\"25%\">\r\n                            <mat-select [formControl]=\"styleCtrl\"\r\n                                        placeholder=\"Style\"\r\n                                        required=\"styleCtrl.isRequired\">\r\n                                <mat-option *ngFor=\"let newBizStyle of newBizStyleTypes\"\r\n                                            [value]=\"newBizStyle.value\">\r\n                                    {{newBizStyle.newBizStyleTypesDescription}}</mat-option>\r\n                            </mat-select>\r\n                            <mat-error *ngIf=\"styleCtrl.hasError('required')\">\r\n                                This field is required\r\n                            </mat-error>\r\n                        </mat-form-field>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n            <mat-card fxFlex=\"38%\">\r\n                <mat-card-header>\r\n                    <mat-card-title>\r\n                        <h2>Report</h2>\r\n                    </mat-card-title>\r\n                </mat-card-header>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutGap=\"20px\">\r\n                        <mat-form-field fxFlex=\"52%\">\r\n                            <mat-select [formControl]=\"newContractsCtrl\"\r\n                                        placeholder=\"New Contracts\"\r\n                                        (selectionChange)='onFXDealSelected($event)'>\r\n                                <mat-option *ngFor=\"let newContractsTypes of newBiznewContractTypes\"\r\n                                            [value]=\"newContractsTypes.value\">\r\n                                    {{newContractsTypes.newBizNewContractsTypesDescription}}</mat-option>\r\n                            </mat-select>\r\n                            <mat-error *ngIf=\"newContractsCtrl.hasError('required')\">\r\n                                This field is required\r\n                            </mat-error>\r\n                        </mat-form-field>\r\n                        <atlas-dropdown-select fxFlex='48%'\r\n                                               [label]=\"'Amendments'\"\r\n                                               [options]=\"amendmentsTypeList\"\r\n                                               [fieldControl]=\"amendmentsCtrl\"\r\n                                               isEditable=true\r\n                                               (optionSelected)=\"selectionChanged($event)\"\r\n                                               [selectProperties]=\"amendmentsDisplayProperty\"\r\n                                               multiselect=true>\r\n                        </atlas-dropdown-select>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         class=\"view-realized-physicals-pnl\">\r\n                        <span fxFlex='50%'></span>\r\n                        <span fxLayoutAlign=\"right center\">\r\n                            <mat-checkbox [formControl]=\"amendmentSummaryCtrl\"\r\n                                          (change)=\"onAmendmentSummaryChanged($event)\">Amendment Summary\r\n                            </mat-checkbox>\r\n                        </span>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         class=\"container-custom\">\r\n                        <span fxFlex='50%'></span>\r\n                        <span fxLayoutAlign=\"right center\">\r\n                            <mat-checkbox [formControl]=\"amendmentDetailsCtrl\"\r\n                                          (change)=\"onAmendmentDetailsChanged($event)\">Amendment Details\r\n                            </mat-checkbox>\r\n                        </span>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n            <atlas-filter-set-display fxFlex=\"40%\"\r\n                                      [columnConfiguration]=\"columnConfiguration\"\r\n                                      [gridCode]=\"gridCode\"\r\n                                      (filtersChanged)=onFilterSetChanged($event)\r\n                                      [company]=\"company\">\r\n            </atlas-filter-set-display>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"end center\">\r\n            <button mat-raised-button\r\n                    class=\"generate-report-button\"\r\n                    (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n        </div>\r\n    </form>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 #ssrsReportViewer>\r\n        </atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.scss":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.scss ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".report-container {\n  height: 60vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.ts":
/*!**************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.ts ***!
  \**************************************************************************************************************/
/*! exports provided: NewBizReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewBizReportComponent", function() { return NewBizReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_ammendments_type_entity__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/entities/ammendments-type.entity */ "./Client/app/shared/entities/ammendments-type.entity.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_newbiz_summary_details_enum__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/enums/newbiz-summary-details.enum */ "./Client/app/shared/enums/newbiz-summary-details.enum.ts");
/* harmony import */ var _shared_enums_newBizDateType_enum__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/enums/newBizDateType.enum */ "./Client/app/shared/enums/newBizDateType.enum.ts");
/* harmony import */ var _shared_enums_newBizNewContractType_enum__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/enums/newBizNewContractType-enum */ "./Client/app/shared/enums/newBizNewContractType-enum.ts");
/* harmony import */ var _shared_enums_newBizStyleType_enum__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../shared/enums/newBizStyleType.enum */ "./Client/app/shared/enums/newBizStyleType.enum.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../shared/services/http-services/reporting.service */ "./Client/app/shared/services/http-services/reporting.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _trading_components_contract_physical_capture_form_components_shipment_period_form_shipment_period_date_validator_validator__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../../trading/components/contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator */ "./Client/app/trading/components/contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
























var NewBizReportComponent = /** @class */ (function (_super) {
    __extends(NewBizReportComponent, _super);
    function NewBizReportComponent(formBuilder, snackbarService, gridConfigurationProvider, route, utilService, reportingService, formConfigurationProvider, companyManager, window) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.snackbarService = snackbarService;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.route = route;
        _this.utilService = utilService;
        _this.reportingService = reportingService;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.companyManager = companyManager;
        _this.window = window;
        _this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        _this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].reportServerLink;
        _this.reportPath = 'LDC Atlas/Newbiz/NewBiz';
        _this.parameters = [];
        _this.newBizDateTypes = [];
        _this.newBizStyleTypes = [];
        _this.newBiznewContractTypes = [];
        _this.amendmentsTypeList = [];
        _this.amendmentsDisplayProperty = ['name'];
        _this.contractDateCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('contractDateCtrl');
        _this.newBizDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('newBizDateFromCtrl');
        _this.newBizDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('newBizDateToCtrl');
        _this.newBizReportDepartmentCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('newBizReportDepartmentCtrl');
        _this.styleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('styleCtrl');
        _this.newContractsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('newContractsCtrl');
        _this.amendmentsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('amendmentsCtrl');
        _this.amendmentSummaryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('summary');
        _this.amendmentDetailsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_11__["AtlasFormControl"]('details');
        _this.departmentErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. Department not in the list.');
        _this.selectErrorMap = new Map();
        _this.filteredQuantityCode = [];
        _this.amendmentsArray = [];
        _this.masterdataList = [_shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_12__["MasterDataProps"].WeightUnits];
        _this.amendmentSummary = true;
        _this.amendmentDetails = true;
        _this.filters = [];
        _this.gridCode = 'newBizReportGrid';
        _this.columnConfiguration = [];
        _this.company = _this.route.snapshot.paramMap.get('company');
        _this.now = _this.companyManager.getCurrentCompanyDate();
        _this.amendmentsTypeList = _shared_entities_ammendments_type_entity__WEBPACK_IMPORTED_MODULE_10__["AmendmentsType"].getAmendmentsTypeList();
        return _this;
    }
    NewBizReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredDepartmentList = this.masterData.departments;
        this.filteredQuantityCode = this.masterData.weightUnits;
        for (var type in _shared_enums_newBizDateType_enum__WEBPACK_IMPORTED_MODULE_15__["newBizDateType"]) {
            if (typeof _shared_enums_newBizDateType_enum__WEBPACK_IMPORTED_MODULE_15__["newBizDateType"][type] === 'number') {
                this.newBizDateTypes.push({ value: _shared_enums_newBizDateType_enum__WEBPACK_IMPORTED_MODULE_15__["newBizDateType"][type], newBizDateTypesDescription: type });
            }
        }
        for (var type in _shared_enums_newBizStyleType_enum__WEBPACK_IMPORTED_MODULE_17__["newBizStyleType"]) {
            if (typeof _shared_enums_newBizStyleType_enum__WEBPACK_IMPORTED_MODULE_17__["newBizStyleType"][type] === 'number') {
                this.newBizStyleTypes.push({ value: _shared_enums_newBizStyleType_enum__WEBPACK_IMPORTED_MODULE_17__["newBizStyleType"][type], newBizStyleTypesDescription: type });
            }
        }
        for (var type in _shared_enums_newBizNewContractType_enum__WEBPACK_IMPORTED_MODULE_16__["newBizNewContractType"]) {
            if (typeof _shared_enums_newBizNewContractType_enum__WEBPACK_IMPORTED_MODULE_16__["newBizNewContractType"][type] === 'number') {
                this.newBiznewContractTypes.push({ value: _shared_enums_newBizNewContractType_enum__WEBPACK_IMPORTED_MODULE_16__["newBizNewContractType"][type], newBizNewContractsTypesDescription: type });
            }
        }
        this.initializeForm();
        this.newBizReportDepartmentCtrl.valueChanges.subscribe(function (input) {
            _this.filteredDepartmentList = _this.utilService.filterListforAutocomplete(input, _this.masterData.departments, ['departmentCode', 'description']);
        });
        this.amendmentDetailsCtrl.setValue(true);
        this.amendmentSummaryCtrl.setValue(true);
        this.loadGridConfiguration();
    };
    NewBizReportComponent.prototype.setDefaultValues = function () {
        this.contractDateCtrl.patchValue(_shared_enums_newBizDateType_enum__WEBPACK_IMPORTED_MODULE_15__["newBizDateType"].ContractDate);
        this.styleCtrl.patchValue(_shared_enums_newBizStyleType_enum__WEBPACK_IMPORTED_MODULE_17__["newBizStyleType"].TradeNet);
        this.newContractsCtrl.patchValue(_shared_enums_newBizNewContractType_enum__WEBPACK_IMPORTED_MODULE_16__["newBizNewContractType"].PhysicalsFlatPriceContracts);
        var val = this.amendmentsTypeList.filter(function (status) { return status.name === 'Physicals Amendments'; });
        this.amendmentsCtrl.patchValue(val);
    };
    NewBizReportComponent.prototype.initializeForm = function () {
        this.newBizReportFormGroup = this.formBuilder.group({
            contractDateCtrl: this.contractDateCtrl,
            newBizDateFromCtrl: this.newBizDateFromCtrl,
            newBizDateToCtrl: this.newBizDateToCtrl,
            newBizReportDepartmentCtrl: this.newBizReportDepartmentCtrl,
            styleCtrl: this.styleCtrl,
            newContractsCtrl: this.newContractsCtrl,
            amendmentsCtrl: this.amendmentsCtrl,
            amendmentSummaryCtrl: this.amendmentSummaryCtrl,
            amendmentDetailsCtrl: this.amendmentDetailsCtrl,
        }, { validator: Object(_trading_components_contract_physical_capture_form_components_shipment_period_form_shipment_period_date_validator_validator__WEBPACK_IMPORTED_MODULE_23__["dateAfter"])('newBizDateToCtrl', 'newBizDateFromCtrl') });
        this.setDefaultValues();
        this.setValidators();
        return this.newBizReportFormGroup;
    };
    NewBizReportComponent.prototype.setValidators = function () {
        this.contractDateCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.newBizDateFromCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.newBizDateToCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.styleCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.newBizReportFormGroup.updateValueAndValidity();
        this.newBizReportDepartmentCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__["inDropdownListValidator"])(this.masterData.departments, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_22__["nameof"])('departmentCode'), true),
        ]));
    };
    NewBizReportComponent.prototype.onFXDealSelected = function (amendmentValue) {
        if (amendmentValue.value === _shared_enums_newBizNewContractType_enum__WEBPACK_IMPORTED_MODULE_16__["newBizNewContractType"].FXDeals) {
            var fxAmendmentsTypeList = new Array();
            this.amendmentsTypeList = fxAmendmentsTypeList;
            this.amendmentsTypeList = _shared_entities_ammendments_type_entity__WEBPACK_IMPORTED_MODULE_10__["AmendmentsType"].getFXDealAmendmentsTypeList();
            var val = this.amendmentsTypeList.filter(function (status) { return status.name === 'FX Deal Amendments'; });
            this.amendmentsCtrl.patchValue(val);
        }
        else {
            this.amendmentsTypeList = _shared_entities_ammendments_type_entity__WEBPACK_IMPORTED_MODULE_10__["AmendmentsType"].getAmendmentsTypeList();
            var val = this.amendmentsTypeList.filter(function (status) { return status.name === 'Physicals Amendments'; });
            this.amendmentsCtrl.patchValue(val);
        }
        this.amendmentDetailsCtrl.enable();
        this.amendmentSummaryCtrl.enable();
    };
    NewBizReportComponent.prototype.selectionChanged = function (amendmentVal) {
        if (amendmentVal) {
            if (amendmentVal.length === 0) {
                this.amendmentDetailsCtrl.setValue(false);
                this.amendmentSummaryCtrl.setValue(false);
                this.amendmentDetailsCtrl.disable();
                this.amendmentSummaryCtrl.disable();
            }
            else {
                this.amendmentDetailsCtrl.enable();
                this.amendmentSummaryCtrl.enable();
            }
        }
    };
    NewBizReportComponent.prototype.onFilterSetChanged = function (filters) {
        this.filters = filters;
        if (filters) {
            if (this.filters.length > 0) {
                this.onGenerateReportButtonClicked();
            }
        }
    };
    NewBizReportComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.columnConfiguration = configuration.columns;
        });
    };
    NewBizReportComponent.prototype.onAmendmentSummaryChanged = function (event) {
        this.amendmentSummary = event.checked;
    };
    NewBizReportComponent.prototype.onAmendmentDetailsChanged = function (event) {
        this.amendmentDetails = event.checked;
    };
    NewBizReportComponent.prototype.getBasicParameters = function () {
        var _this = this;
        var dateFrom = this.newBizDateFromCtrl.value.format('YYYY-MM-DD');
        var dateTo = this.newBizDateToCtrl.value.format('YYYY-MM-DD');
        var department = this.newBizReportDepartmentCtrl.value ?
            this.newBizReportDepartmentCtrl.value.departmentId : '';
        var amendments = this.amendmentsCtrl.value.map(function (status) { return status.value; });
        var options;
        if (this.amendmentSummary && this.amendmentDetails) {
            options = _shared_enums_newbiz_summary_details_enum__WEBPACK_IMPORTED_MODULE_14__["NewBizSummaryDetails"].SummaryAndDetail;
        }
        else if (this.amendmentDetails) {
            options = _shared_enums_newbiz_summary_details_enum__WEBPACK_IMPORTED_MODULE_14__["NewBizSummaryDetails"].Detail;
        }
        else if (this.amendmentSummary) {
            options = _shared_enums_newbiz_summary_details_enum__WEBPACK_IMPORTED_MODULE_14__["NewBizSummaryDetails"].Summary;
        }
        var parameters = [
            { name: 'Company', value: this.company },
            { name: 'FromDate', value: dateFrom },
            { name: 'ToDate', value: dateTo },
        ];
        if (this.amendmentsCtrl.value && this.amendmentsCtrl.value.length !== 0) {
            this.parameters.push({ name: 'Options', value: options });
        }
        if (this.contractDateCtrl.value !== '') {
            this.parameters.push({ name: 'DateType', value: this.contractDateCtrl.value });
        }
        if (department !== '') {
            this.parameters.push({ name: 'Department', value: department });
        }
        if (this.styleCtrl.value !== '') {
            this.parameters.push({ name: 'Style', value: this.styleCtrl.value });
        }
        if (this.newContractsCtrl.value !== '') {
            this.parameters.push({ name: 'NewContracts', value: this.newContractsCtrl.value });
        }
        amendments.forEach(function (id) {
            _this.parameters.push({ name: 'Amendments', value: id });
        });
        return parameters;
    };
    NewBizReportComponent.prototype.onGenerateReportButtonClicked = function () {
        var _this = this;
        if (!this.newBizReportFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }
        if (this.filters && this.filters.length > 0) {
            this.reportingService.createReportCriterias(this.gridCode, this.filters).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (filterSetId) {
                var predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                _this.generateReport(predicateId);
            });
        }
        else {
            this.generateReport();
        }
    };
    NewBizReportComponent.prototype.generateReport = function (additionalParameters) {
        if (additionalParameters === void 0) { additionalParameters = []; }
        if (this.amendmentsCtrl.value) {
            if (this.amendmentsCtrl.value.length !== 0 && this.amendmentSummary === false && this.amendmentDetails === false) {
                this.snackbarService.throwErrorSnackBar('Select atleast one AmendmentReport from list');
            }
            else {
                this.parameters = [];
                this.parameters = this.parameters.concat(additionalParameters);
                this.parameters = this.parameters.concat(this.getBasicParameters());
                this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
            }
        }
    };
    NewBizReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__["SSRSReportViewerComponent"])
    ], NewBizReportComponent.prototype, "ssrsReportViewer", void 0);
    NewBizReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-new-biz-report',
            template: __webpack_require__(/*! ./new-biz-report.component.html */ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.html"),
            styles: [__webpack_require__(/*! ./new-biz-report.component.scss */ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.scss")],
        }),
        __param(8, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_13__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_21__["SnackbarService"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_19__["GridConfigurationProviderService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_22__["UtilService"],
            _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_20__["ReportingService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_18__["FormConfigurationProviderService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            Window])
    ], NewBizReportComponent);
    return NewBizReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_7__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report-period-validator.validator.ts":
/*!*******************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report-period-validator.validator.ts ***!
  \*******************************************************************************************************************************/
/*! exports provided: beforeFromDate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeFromDate", function() { return beforeFromDate; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);

var moment = moment__WEBPACK_IMPORTED_MODULE_0__;
function beforeFromDate(fromFormControlName, toFormControlName) {
    return function (abstractForm) {
        var fromFormControl = abstractForm.get(fromFormControlName);
        var toFormControl = abstractForm.get(toFormControlName);
        if (fromFormControl && fromFormControl.value
            && toFormControl && toFormControl.value) {
            var isDatebeforeFrom = fromFormControl.value.format('YYYY-MM-DD') > toFormControl.value.format('YYYY-MM-DD')
                ? true : false;
            if (isDatebeforeFrom) {
                toFormControl.setErrors({ isClientDateBeforeValid: true });
                return { isClientDateBeforeValid: true };
            }
            else {
                toFormControl.setErrors(null);
                return null;
            }
        }
        return null;
    };
}


/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.html":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.html ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <form [formGroup]=\"nominalReportFormGroup\">\r\n        <div fxLayout=\"row wrap\">\r\n            <mat-card class=\"flex-item-marge\"\r\n                      fxFlex=\"calc(60% - 16px)\"\r\n                      fxFlex.lt-md=\"100%\">\r\n                <mat-card-content fxLayout=\"column\"\r\n                                  fxLayoutGap=\"1%\">\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"start\">\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start\"\r\n                             fxLayoutGap=\"3%\"\r\n                             fxFlex=\"50%\">\r\n                            <mat-card-title>Report Parameters</mat-card-title>\r\n                            <div fxLayout=\"column\"\r\n                                 fxLayoutAlign=\"start\"\r\n                                 fxLayoutGap=\"1%\">\r\n                                <span>\r\n                                    <mat-form-field fxFlex=\"40%\">\r\n                                        <mat-select (selectionChange)=\"optionValueChanged($event)\"\r\n                                                    [formControl]=\"reportStyleCtrl\"\r\n                                                    [required]=\"reportStyleCtrl.isRequired\"\r\n                                                    placeholder=\"Report Style\">\r\n                                            <mat-option *ngFor=\"let reportStyle of reportStyleTypes\"\r\n                                                        [value]=\"reportStyle.value\">\r\n                                                {{reportStyle.reportStyleDescription}}</mat-option>\r\n                                        </mat-select>\r\n                                        <mat-error *ngIf=\"reportStyleCtrl.hasError('required')\">\r\n                                            This field is required\r\n                                        </mat-error>\r\n                                    </mat-form-field>\r\n                                    <mat-form-field fxFlex=\"40%\">\r\n                                        <mat-select [formControl]=\"accountTypeCtrl\"\r\n                                                    [required]=\"accountTypeCtrl.isRequired\"\r\n                                                    placeholder=\"Account Type\">\r\n                                            <mat-option *ngFor=\"let accountType of nominalAccountTypes\"\r\n                                                        [value]=\"accountType.value\">\r\n                                                {{accountType.accountTypeDescription}}\r\n                                            </mat-option>\r\n                                        </mat-select>\r\n                                        <mat-error *ngIf=\"accountTypeCtrl.hasError('required')\">\r\n                                            This field is required\r\n                                        </mat-error>\r\n                                    </mat-form-field>\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"end\"\r\n                             fxFlex=\"50%\"\r\n                             class=\"documentDateField\">\r\n                            <mat-card-title>Document Date Range </mat-card-title>\r\n                            <span fxLayoutGap=\"2%\">\r\n                                <atlas-date-picker fxFlex=\"30%\"\r\n                                                   isEditable=true\r\n                                                   label=\"From\"\r\n                                                   required\r\n                                                   [fieldControl]=\"documentDateFromCtrl\"\r\n                                                   (dateChanged)=\"onDateChanged()\">\r\n                                </atlas-date-picker>\r\n                                <atlas-date-picker fxFlex=\"30%\"\r\n                                                   isEditable=true\r\n                                                   label=\"To\"\r\n                                                   required\r\n                                                   [errorMap]=\"documentRangeErrorMap\"\r\n                                                   [fieldControl]=\"documentDateToCtrl\"\r\n                                                   (dateChanged)=\"onDateChanged()\">\r\n                                </atlas-date-picker>\r\n                            </span>\r\n                        </div>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"start\"\r\n                         class=\"top-margin\">\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start\"\r\n                             fxFlex=\"58%\">\r\n                            <h3>Nominal Report Filter</h3>\r\n                            <div fxLayout=\"column\"\r\n                                 fxLayoutAlign=\"start\">\r\n                                <span fxLayoutGap=\"10%\">\r\n                                    <atlas-masterdata-user-preferences-input fxFlex=\"40%\"\r\n                                                                             class=\"contextual-search-for-nominalaccount\"\r\n                                                                             [fieldControl]=\"nominalAccountsCtrl\"\r\n                                                                             [options]=\"filteredNominalAccountList\"\r\n                                                                             label=\"Nominal Account\"\r\n                                                                             displayProperty=\"accountNumber\"\r\n                                                                             tooltip=\"detailedDescription\"\r\n                                                                             [selectProperties]=\" ['accountNumber', 'detailedDescription']\"\r\n                                                                             [errorMap]=\"nominalAccountErrorMap\"\r\n                                                                             lightBoxTitle=\"Results for Nominal Accounts\"\r\n                                                                             gridId=\"nominalAccountsGrid\">\r\n                                    </atlas-masterdata-user-preferences-input>\r\n\r\n                                    <atlas-masterdata-user-preferences-input fxFlex=\"40%\"\r\n                                                                             class=\"contextual-search-for-currency\"\r\n                                                                             [fieldControl]=\"currencyCtrl\"\r\n                                                                             [options]=\"filteredCurrencyList\"\r\n                                                                             label=\"Currency\"\r\n                                                                             displayProperty=\"currencyCode\"\r\n                                                                             tooltip=\"description\"\r\n                                                                             [selectProperties]=\"['currencyCode', 'description']\"\r\n                                                                             [errorMap]=\"currencyErrorMap\"\r\n                                                                             lightBoxTitle=\"Results for Currency\"\r\n                                                                             gridId=\"currenciesGrid\">\r\n                                    </atlas-masterdata-user-preferences-input>\r\n\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"end\"\r\n                             fxLayoutGap=\"3%\"\r\n                             fxFlex=\"50%\">\r\n                            <mat-card-title>Accounting Period Range</mat-card-title>\r\n                            <span fxLayoutGap=\"5%\">\r\n                                <atlas-month-date-picker fxFlex=\"30%\"\r\n                                                         isEditable=true\r\n                                                         label=\"From\"\r\n                                                         [fieldControl]=\"accountingDateFromCtrl\"\r\n                                                         (monthChanged)=\"onMonthChanged()\">\r\n                                </atlas-month-date-picker>\r\n                                <atlas-month-date-picker fxFlex=\"30%\"\r\n                                                         isEditable=true\r\n                                                         label=\"To\"\r\n                                                         [errorMap]=\"accountPeriodRangeErrorMap\"\r\n                                                         [fieldControl]=\"accountingDateToCtrl\"\r\n                                                         (monthChanged)=\"onMonthChanged()\">\r\n                                </atlas-month-date-picker>\r\n                            </span>\r\n                        </div>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"start\">\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"end start\"\r\n                             fxFlex=\"50%\">\r\n                            <mat-slide-toggle [formControl]=\"functionalCurrencyCtrl\"\r\n                                              *ngIf=\"reportStyleCtrl.value === ReportStyleType.Summary\">Functional\r\n                                currency only\r\n                            </mat-slide-toggle>\r\n                            <mat-slide-toggle [formControl]=\"broughtForwardCtrl\"\r\n                              (change)=\"toToggleChanged($event)\">\r\n                                Brought forward Balance required</mat-slide-toggle>\r\n                        </div>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n\r\n            <atlas-filter-set-display fxFlex=\"calc(40% - 16px)\"\r\n                                      fxFlex.lt-md=\"100%\"\r\n                                      (filtersChanged)=\"onFilterSetChanged($event)\"\r\n                                      [columnConfiguration]=\"getColumnConfig()\"\r\n                                      [gridCode]=\"getGridCode()\"\r\n                                      [company]=\"company\"\r\n                                      #filterSetDisplay>\r\n            </atlas-filter-set-display>\r\n        </div>\r\n    </form>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                (click)=\"onGenerateReportButtonClicked(true)\">GENERATE REPORT\r\n        </button>\r\n    </div>\r\n    <mat-tab-group *ngIf=\"isTabEnalble\"\r\n                   [selectedIndex]=\"tabIndex\"\r\n                   (selectedIndexChange)=onSelectedIndexChanged($event)>\r\n        <mat-tab label=\"Overview\"></mat-tab>\r\n        <mat-tab label=\"Details\"></mat-tab>\r\n    </mat-tab-group>\r\n    <div class=\"content-tab\">\r\n        <mat-tab-group [selectedIndex]=\"tabIndex\">\r\n            <mat-tab>\r\n                <atlas-overview-tab #overviewComponent\r\n                                    [isTabEnalble]=\"isTabEnalble\"\r\n                                    [reportStyleCtrl]=\"reportStyleCtrl\"\r\n                                    [reportStyleTypes]=\"reportStyleTypes\"\r\n                                    [accountTypeCtrl]=\"accountTypeCtrl\"\r\n                                    [nominalAccountTypes]=\"nominalAccountTypes\"\r\n                                    [documentDateFromCtrl]=\"documentDateFromCtrl\"\r\n                                    [documentDateToCtrl]=\"documentDateToCtrl\"\r\n                                    [accountingDateFromCtrl]=\"accountingDateFromCtrl\"\r\n                                    [accountingDateToCtrl]=\"accountingDateToCtrl\"\r\n                                    [functionalCurrencyCtrl]=\"functionalCurrencyCtrl\"\r\n                                    [currencyCtrl]=\"currencyCtrl\"\r\n                                    [nominalAccountsCtrl]=\"nominalAccountsCtrl\"\r\n                                    [nominalReportFormGroup]=\"nominalReportFormGroup\"></atlas-overview-tab>\r\n            </mat-tab>\r\n            <mat-tab>\r\n                <atlas-detail-tab #detailComponent\r\n                                  [isTabEnalble]=\"isTabEnalble\"\r\n                                  [reportStyleCtrl]=\"reportStyleCtrl\"\r\n                                  [reportStyleTypes]=\"reportStyleTypes\"\r\n                                  [accountTypeCtrl]=\"accountTypeCtrl\"\r\n                                  [nominalAccountTypes]=\"nominalAccountTypes\"\r\n                                  [documentDateFromCtrl]=\"documentDateFromCtrl\"\r\n                                  [documentDateToCtrl]=\"documentDateToCtrl\"\r\n                                  [accountingDateFromCtrl]=\"accountingDateFromCtrl\"\r\n                                  [accountingDateToCtrl]=\"accountingDateToCtrl\"\r\n                                  [functionalCurrencyCtrl]=\"functionalCurrencyCtrl\"\r\n                                  [currencyCtrl]=\"currencyCtrl\"\r\n                                  [nominalAccountsCtrl]=\"nominalAccountsCtrl\"\r\n                                  [nominalReportFormGroup]=\"nominalReportFormGroup\"></atlas-detail-tab>\r\n            </mat-tab>\r\n        </mat-tab-group>\r\n    </div>\r\n    <mat-card *ngIf=\"!isTabEnalble\">\r\n        <mat-card-content>\r\n            <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs && isNominalReportDisplay\"\r\n                                            [gridOptions]=\"agGridOptions\"\r\n                                            [company]=\"company\"\r\n                                            [gridId]=\"getGridCode()\"\r\n                                            [isAutosize]=\"false\"\r\n                                            fxLayoutAlign=\"end\"\r\n                                            [sharingEnabled]=\"hasGridSharing\"\r\n                                            #userPreferences>\r\n            </atlas-ag-grid-user-preferences>\r\n            <div fxLayout=\"row\"\r\n                 *ngIf='isNominalReportDisplay'\r\n                 class=\"quick-sum-div-height\"\r\n                 fxLayoutAlign=\"space-between center\">\r\n                <mat-slide-toggle mat-raised-button\r\n                                  (change)=\"toggleQuickSum($event.checked)\">Quick Sum Mode</mat-slide-toggle>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-around center\">\r\n\r\n                    <div *ngFor=\"let column of selectedColumnsArray\">\r\n                        <span class=\"quick-sum-span\"\r\n                              *ngIf=\"quickSumModeActivated\">{{column.name}} : {{column.sum | number }} </span>\r\n                    </div>\r\n                    <button mat-button\r\n                            (click)=\"onClearSelectionClicked()\"\r\n                            class=\"mat-button-user-margin\"\r\n                            *ngIf=\"quickSumModeActivated\">Clear Selection</button>\r\n                </div>\r\n            </div>\r\n            <div ag-grid=\"agGridOptions\"\r\n                 [ngClass]='classApplied'\r\n                 class=\"ag-theme-material pointer-cursor\"\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 [ngClass]=\"{'hidden-during-loading':!isNominalReportDisplay}\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"agGridRows\"\r\n                                 [columnDefs]=\"agGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"100\"\r\n                                 [gridOptions]=\"agGridOptions\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [enableRangeSelection]=\"true\"\r\n                                 [groupMultiAutoColumn]=\"groupMultiAutoColumn\"\r\n                                 [rowGroupPanelShow]=\"rowGroupPanelShow\"\r\n                                 (columnVisible)=\"onColumnVisibilityChanged($event)\"\r\n                                 (columnRowGroupChanged)=\"onColumnVisibilityChanged($event)\"\r\n                                 (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\"\r\n                                 enableFilter\r\n                                 [context]=\"gridContext\"\r\n                                 [suppressAggFuncInHeader]=\"true\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                 [excelStyles]=\"excelStyles\">\r\n                </ag-grid-angular>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.scss":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.scss ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".quick-sum-div-height {\n  height: 25px !important; }\n\n.quick-sum-span {\n  font: 400 14px/20px Roboto, \"Helvetica Neue\", sans-serif;\n  margin-right: 4px; }\n\nbutton.mat-raised-button {\n  margin: 0px !important; }\n\n.top-margin {\n  margin-top: 15px; }\n\ndiv.reportParameterField {\n  min-width: 63%; }\n\ndiv.documentDateField {\n  margin-left: -5.5%; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.ts":
/*!**************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.ts ***!
  \**************************************************************************************************************/
/*! exports provided: NominalReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NominalReportComponent", function() { return NominalReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/components/filter-set-display/filter-set-display.component */ "./Client/app/shared/components/filter-set-display/filter-set-display.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_user_grid_preferences_parameters_entity__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/entities/user-grid-preferences-parameters.entity */ "./Client/app/shared/entities/user-grid-preferences-parameters.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../shared/enums/nominal-account-type-enum */ "./Client/app/shared/enums/nominal-account-type-enum.ts");
/* harmony import */ var _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../shared/enums/report-style-type.enum */ "./Client/app/shared/enums/report-style-type.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../shared/services/execution/dtos/transaction-report-command */ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_http_services_preaccounting_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../../../shared/services/http-services/preaccounting.service */ "./Client/app/shared/services/http-services/preaccounting.service.ts");
/* harmony import */ var _shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../../../../shared/services/list-and-search/nominalReport-data-loader */ "./Client/app/shared/services/list-and-search/nominalReport-data-loader.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _nominal_report_period_validator_validator__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./nominal-report-period-validator.validator */ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report-period-validator.validator.ts");
/* harmony import */ var _tabs_detail_tab_detail_tab_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./tabs/detail-tab/detail-tab.component */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.ts");
/* harmony import */ var _tabs_overview_tab_overview_tab_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./tabs/overview-tab/overview-tab.component */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
































var NominalReportComponent = /** @class */ (function (_super) {
    __extends(NominalReportComponent, _super);
    function NominalReportComponent(route, formBuilder, uiService, companyManager, dataLoader, gridConfigurationProvider, utilService, masterdataService, formConfigurationProvider, preaccountingService, window, gridService, titleService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.uiService = uiService;
        _this.companyManager = companyManager;
        _this.dataLoader = dataLoader;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.preaccountingService = preaccountingService;
        _this.window = window;
        _this.gridService = gridService;
        _this.titleService = titleService;
        _this.agGridOptions = {};
        _this.agGridRows = [];
        _this.isLoading = false;
        _this.nominalTransactionGridCode = 'nominalReportTransactionGrid';
        _this.nominalTransactionGridConfig = [];
        _this.nominalTrabsactionQuickSumColumns = [];
        _this.nominalSummaryGridCode = 'nominalReportSummaryGrid';
        _this.nominalSummaryGridConfig = [];
        _this.nominalSummaryQuickSumColumns = [];
        _this.isUserPreferencesDisplay = false;
        _this.isNominalReportDisplay = false;
        _this.rowGroupPanelShow = 'onlyWhenGrouping';
        _this.isBroughtForward = false;
        _this.reportStyleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('reportStyleTypes');
        _this.reportStyleTypes = [];
        _this.accountTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('nominalAccountTypes');
        _this.nominalAccountTypes = [];
        _this.documentDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('documentFromCtrl');
        _this.documentDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('documentToCtrl');
        _this.accountingDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('accountingDateFromCtrl');
        _this.accountingDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('accountingDateToCtrl');
        _this.functionalCurrencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('nominalFunctionalCurrency');
        _this.broughtForwardCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('broughtForwardCtrl');
        _this.currencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('currencyCtrl');
        _this.nominalAccountsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('nominalAccountsCtrl');
        _this.columnConfiguration = [];
        _this.filters = [];
        _this.accountPeriodRangeErrorMap = new Map();
        _this.documentRangeErrorMap = new Map();
        _this.subscriptions = [];
        _this.isGenerateButtonClicked = false;
        _this.ReportStyleType = _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"];
        _this.isSummaryMode = false;
        _this.isTabEnalble = false;
        /* quick sum */
        _this.defaultClass = 'ag-theme-material pointer-cursor';
        _this.cellSelectionClass = 'ag-theme-material pointer-cursor cell-selection';
        _this.quickSumModeActivated = false;
        _this.selectedColumnsArray = new Array();
        _this.allowedColumnsforQuickSum = [];
        _this.currencyErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. Currency not in the list.');
        _this.nominalAccountErrorMap = new Map()
            .set('inDropdownList', 'Invalid entry. NominalAccount not in the list.');
        _this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        _this.accountPeriodRangeErrorMap
            .set('isClientDateBeforeValid', 'Cannot be before Period From.');
        _this.documentRangeErrorMap
            .set('isClientDateBeforeValid', 'Cannot be before Period From.');
        return _this;
    }
    NominalReportComponent.prototype.getColumnConfig = function () {
        this.allowedColumnsforQuickSum = this.nominalSummaryQuickSumColumns;
        return this.nominalSummaryGridConfig;
    };
    NominalReportComponent.prototype.updateGroupDisplay = function () {
        this.rowGroupPanelShow = 'never';
        this.groupMultiAutoColumn = false;
        this.agGridOptions.groupMultiAutoColumn = this.groupMultiAutoColumn;
    };
    NominalReportComponent.prototype.setColumnConfig = function (config) {
        this.rowGroupPanelShow = 'never';
        this.groupMultiAutoColumn = false;
        config = config.map(function (x) {
            x.isGroup = false;
            return x;
        });
        this.nominalSummaryGridConfig = config;
        this.agGridOptions.groupMultiAutoColumn = this.groupMultiAutoColumn;
    };
    NominalReportComponent.prototype.getGridCode = function () {
        return this.nominalSummaryGridCode;
    };
    NominalReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.titleService.setTitle(this.route.snapshot.data.title);
        for (var type in _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"]) {
            if (typeof _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"][type] === 'number') {
                this.reportStyleTypes.push({ value: _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"][type], reportStyleDescription: type });
            }
        }
        for (var type in _shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_17__["NominalAccountType"]) {
            if (typeof _shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_17__["NominalAccountType"][type] === 'number') {
                this.nominalAccountTypes.push({ value: _shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_17__["NominalAccountType"][type], accountTypeDescription: type });
            }
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.reportStyleCtrl.patchValue(_shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"].Summary);
        this.accountTypeCtrl.patchValue(_shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_17__["NominalAccountType"].Both);
        this.company = this.companyManager.getCurrentCompanyId();
        this.getFormGroup();
        this.setValidators();
        this.bindConfiguration();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.filteredCurrencyList = this.masterdata.currencies;
        this.filteredNominalAccountList = this.masterdata.nominalAccounts.map(function (nominal) {
            nominal.accountNumber = nominal.accountNumber;
            nominal.mainAccountTitle = nominal.shortDescription;
            return nominal;
        });
        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe(function (data) {
            _this.accountingSetupModel = data;
            if (_this.accountingSetupModel.lastMonthClosed !== null) {
                var numberOfOpenPeriods = _this.accountingSetupModel.numberOfOpenPeriod !== null ?
                    _this.accountingSetupModel.numberOfOpenPeriod : 1;
                _this.accountingDateToCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_4__(_this.accountingSetupModel.lastMonthClosed).add(numberOfOpenPeriods, 'month'));
                _this.onMonthChanged();
            }
        }));
        this.documentDateFromCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_4__().year(1980).month(0).date(1));
        this.documentDateToCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.accountingDateFromCtrl.setValue(this.companyManager.getCurrentCompanyDate().month(0).date(1));
        this.currencyCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCurrencyList = _this.utilService.filterListforAutocomplete(input, _this.masterdata.currencies, ['currencyCode', 'description']);
        });
        this.nominalAccountsCtrl.valueChanges.subscribe(function (input) {
            _this.filteredNominalAccountList = _this.utilService.filterListforAutocomplete(input, _this.masterdata.nominalAccounts, ['accountNumber', 'detailedDescription']);
        });
        // quicksum
        this.classApplied = this.defaultClass;
        this.loadGridConfiguration();
    };
    NominalReportComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    NominalReportComponent.prototype.getFormGroup = function () {
        this.nominalReportFormGroup = this.formBuilder.group({
            reportStyleCtrl: this.reportStyleCtrl,
            accountTypeCtrl: this.accountTypeCtrl,
            documentDateFromCtrl: this.documentDateFromCtrl,
            documentDateToCtrl: this.documentDateToCtrl,
            accountingDateFromCtrl: this.accountingDateFromCtrl,
            accountingDateToCtrl: this.accountingDateToCtrl,
            currencyCtrl: this.currencyCtrl,
            nominalAccountsCtrl: this.nominalAccountsCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    NominalReportComponent.prototype.onFilterSetChanged = function (filters) {
        this.filters = filters;
        this.onGenerateReportButtonClicked();
    };
    NominalReportComponent.prototype.onGenerateReportButtonClicked = function (isGenerateButtonClicked) {
        this.isGenerateButtonClicked = isGenerateButtonClicked;
        if (this.nominalReportFormGroup.valid && this.isGenerateButtonClicked) {
            if (this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"].Transactions && !this.isSummaryMode) {
                this.isTabEnalble = true;
                this.onSelectedButtonChanged(0);
                this.overviewComponent.isOverviewMode = true;
                this.detailComponent.isDetailMode = true;
            }
            else {
                this.isTabEnalble = false;
                this.overviewComponent.isOverviewMode = false;
                this.detailComponent.isDetailMode = false;
                this.toggleQuickSum(false);
                var hasQuickSearchValues = (this.currencyCtrl.value && this.currencyCtrl.valid)
                    || (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid);
                if (hasQuickSearchValues) {
                    var quickFilters = [];
                    if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                        var currencyField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Currency'; });
                        var currencyFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilter"]();
                        currencyFilter.fieldId = currencyField.fieldId;
                        currencyFilter.fieldName = currencyField.fieldName;
                        currencyFilter.fieldFriendlyName = currencyField.fieldName;
                        currencyFilter.isActive = true;
                        currencyFilter.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_16__["ListAndSearchFilterType"].Picklist,
                            operator: 'eq',
                            value1: this.currencyCtrl.value.currencyCode,
                        };
                        quickFilters.push(currencyFilter);
                        this.currencyCtrl.patchValue(null);
                        this.currencyCtrl.reset();
                    }
                    if (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid) {
                        var nominalAccountsField = this.columnConfiguration.find(function (column) { return column.fieldName === 'NominalAccount'; });
                        var nominalAccountsFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_13__["ListAndSearchFilter"]();
                        nominalAccountsFilter.fieldId = nominalAccountsField.fieldId;
                        nominalAccountsFilter.fieldName = nominalAccountsField.fieldName;
                        nominalAccountsFilter.fieldFriendlyName = nominalAccountsFilter.fieldName;
                        nominalAccountsFilter.isActive = true;
                        nominalAccountsFilter.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_16__["ListAndSearchFilterType"].Picklist,
                            operator: 'eq',
                            value1: this.nominalAccountsCtrl.value.accountNumber,
                        };
                        quickFilters.push(nominalAccountsFilter);
                        this.nominalAccountsCtrl.reset();
                    }
                    this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                    this.filters = quickFilters;
                }
                var columnConfig = this.getColumnConfig();
                if (columnConfig.length === 0) {
                    this.loadGridConfiguration();
                }
                else {
                    this.initColumns();
                }
                this.loadData();
            }
        }
    };
    NominalReportComponent.prototype.loadData = function () {
        var _this = this;
        var clientReport = this.getNominalReportData();
        this.isLoading = true;
        this.isNominalReportDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (data) {
            _this.agGridRows = data.value;
            _this.isNominalReportDisplay = true;
        });
    };
    NominalReportComponent.prototype.getNominalReportData = function () {
        var nominalReport = new _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_20__["TransactionReportCommand"]();
        nominalReport.functionalCurrency = this.functionalCurrencyCtrl.value !== ''
            ? this.functionalCurrencyCtrl.value : null;
        nominalReport.broughtForward = this.isBroughtForward;
        nominalReport.accountType = this.accountTypeCtrl.value !== null ? this.accountTypeCtrl.value : null;
        nominalReport.fromDate = this.accountingDateFromCtrl.value !== null ? this.accountingDateFromCtrl.value : null;
        nominalReport.toDate = this.accountingDateToCtrl.value !== null ? this.accountingDateToCtrl.value : null;
        nominalReport.documentFromDate = this.documentDateFromCtrl.value !== null ? this.documentDateFromCtrl.value : null;
        nominalReport.documentToDate = this.documentDateToCtrl.value !== null ? this.documentDateToCtrl.value : null;
        nominalReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return nominalReport;
    };
    NominalReportComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.getGridCode())
            .subscribe(function (configuration) {
            _this.setColumnConfig(configuration.columns);
            _this.columnConfiguration = configuration.columns;
            _this.initColumns();
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            _this.gridPreferences = new _shared_entities_user_grid_preferences_parameters_entity__WEBPACK_IMPORTED_MODULE_14__["UserGridPreferencesParameters"]({
                company: _this.company,
                gridId: _this.getGridCode(),
                gridOptions: _this.agGridOptions,
                sharingEnabled: _this.hasGridSharing,
            });
        });
    };
    NominalReportComponent.prototype.toToggleChanged = function (event) {
        this.isBroughtForward = event.checked;
        this.detailComponent.isBroughtForward = event.checked;
        this.overviewComponent.isBroughtForward = event.checked;
    };
    NominalReportComponent.prototype.initColumns = function () {
        var _this = this;
        this.updateGroupDisplay();
        var configuration = this.getColumnConfig();
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(_this.utilService.convertToCamelCase(column.fieldName));
            }
        });
        this.agGridCols = configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: config.isGroup,
                enableRowGroup: config.isGroup,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                _this.nominalSummaryQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
            }
            var formatter = _this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = _this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = _this.checkStatutoryCurrency + ' eq';
            }
            var numericColumn = numericColumns.find(function (column) { return column === columnDef.field; });
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = _this.numberFormatter;
            }
            return columnDef;
        });
        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }
    };
    NominalReportComponent.prototype.numberFormatter = function (param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_7__["CommonMethods"]();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    };
    NominalReportComponent.prototype.onColumnVisibilityChanged = function (col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    };
    NominalReportComponent.prototype.onGridReady = function (params) {
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.gridService.sizeColumns(this.agGridOptions);
    };
    NominalReportComponent.prototype.setValidators = function () {
        this.accountingDateFromCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.accountingDateToCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.documentDateFromCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.documentDateToCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.accountTypeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.reportStyleCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.nominalReportFormGroup.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([Object(_nominal_report_period_validator_validator__WEBPACK_IMPORTED_MODULE_29__["beforeFromDate"])('accountingDateFromCtrl', 'accountingDateToCtrl'),
            Object(_nominal_report_period_validator_validator__WEBPACK_IMPORTED_MODULE_29__["beforeFromDate"])('documentDateFromCtrl', 'documentDateToCtrl')]));
        this.nominalReportFormGroup.updateValueAndValidity();
        this.currencyCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_11__["inDropdownListValidator"])(this.masterdata.currencies, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_28__["nameof"])('currencyCode')),
        ]));
        this.nominalAccountsCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_11__["inDropdownListValidator"])(this.masterdata.nominalAccounts, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_28__["nameof"])('accountNumber')),
        ]));
    };
    NominalReportComponent.prototype.onMonthChanged = function () {
        this.accountingDateToCtrl.markAsTouched();
        this.accountingDateFromCtrl.updateValueAndValidity();
        this.accountingDateToCtrl.updateValueAndValidity();
    };
    NominalReportComponent.prototype.onDateChanged = function () {
        this.documentDateToCtrl.markAsTouched();
        this.documentDateToCtrl.updateValueAndValidity();
        this.documentDateFromCtrl.updateValueAndValidity();
    };
    // -- Quick Sum
    NominalReportComponent.prototype.toggleQuickSum = function (value) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        }
        else {
            this.classApplied = this.defaultClass;
        }
    };
    NominalReportComponent.prototype.onClearSelectionClicked = function () {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    NominalReportComponent.prototype.onRangeSelectionChanged = function (event) {
        var _this = this;
        this.selectedColumnsArray = [];
        var rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        }
        else {
            var cellInfos_1 = [];
            var selectedCells_1 = [];
            rangeSelections.forEach(function (row) {
                var cellExists = selectedCells_1.find(function (cell) { return cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId(); });
                if (cellExists === null || cellExists === undefined) {
                    selectedCells_1.push(row);
                    var obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos_1.push(obj);
                }
            });
            var sum_1 = 0;
            var columnName_1;
            var columnHeader_1;
            var selectedColumnsArray_1 = this.selectedColumnsArray;
            var allowedColumnsforQuickSum_1 = this.allowedColumnsforQuickSum;
            selectedCells_1.forEach(function (row) {
                row.columns.forEach(function (column) {
                    sum_1 = 0;
                    columnName_1 = column.getColDef().colId;
                    columnHeader_1 = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum_1.includes(columnName_1)) {
                        for (var rowIndex = 0; rowIndex < cellInfos_1.length; rowIndex++) {
                            if (cellInfos_1[rowIndex].columnName === columnName_1) {
                                var rowModel = _this.agGridApi.getModel();
                                var rowNode = rowModel.getRow(Number(cellInfos_1[rowIndex].rowIndex));
                                var value = _this.agGridApi.getValue(column, rowNode);
                                sum_1 += Number(value);
                            }
                        }
                        var columnObj = selectedColumnsArray_1.find(function (sum) { return sum.name === columnHeader_1; });
                        if (columnObj) {
                            columnObj.sum = sum_1;
                        }
                        else {
                            selectedColumnsArray_1.push({ name: columnHeader_1, sum: sum_1 });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray_1;
        }
    };
    NominalReportComponent.prototype.rangeSelectionCalculation = function (rangeSelection) {
        var _this = this;
        var sum = 0;
        var columnName;
        var columnHeader;
        this.selectedColumnsArray = [];
        var startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach(function (column) {
            columnName = column.getColDef().colId;
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    var rowModel = _this.agGridApi.getModel();
                    var rowNode = rowModel.getRow(rowIndex);
                    var value = _this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                _this.selectedColumnsArray.push({ name: columnHeader, sum: sum });
            }
        });
    };
    NominalReportComponent.prototype.onSelectedIndexChanged = function (value) {
        this.tabIndex = value;
        if (this.isGenerateButtonClicked && !this.isSummaryMode) {
            this.onSelectedButtonChanged(this.tabIndex);
        }
    };
    NominalReportComponent.prototype.optionValueChanged = function (event) {
        if (event.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_18__["ReportStyleType"].Summary) {
            this.isSummaryMode = true;
        }
        else {
            this.isSummaryMode = false;
        }
    };
    NominalReportComponent.prototype.onSelectedButtonChanged = function (tabIndex) {
        switch (tabIndex) {
            case 0: {
                this.overviewComponent.onGenerateReportButtonClicked(true);
                break;
            }
            case 1: {
                this.detailComponent.onGenerateReportButtonClicked(true);
                break;
            }
        }
    };
    NominalReportComponent.prototype.onGridViewSelected = function (gridViewId) {
        this.gridPreferences.selectedGridViewId = gridViewId;
        // this is to trigger the input setter in the enlarged grid child
        this.gridPreferences = new _shared_entities_user_grid_preferences_parameters_entity__WEBPACK_IMPORTED_MODULE_14__["UserGridPreferencesParameters"](this.gridPreferences);
    };
    NominalReportComponent.prototype.onGridEnlargementClose = function (lastUsedGridView) {
        if (lastUsedGridView && lastUsedGridView.gridViewId) {
            this.userPreferencesComponent.loadGridView(lastUsedGridView.gridViewId, false);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], NominalReportComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_8__["AgGridUserPreferencesComponent"])
    ], NominalReportComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('filterSetDisplay'),
        __metadata("design:type", _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_10__["FilterSetDisplayComponent"])
    ], NominalReportComponent.prototype, "filterSetDisplayComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('overviewComponent'),
        __metadata("design:type", _tabs_overview_tab_overview_tab_component__WEBPACK_IMPORTED_MODULE_31__["OverviewTabComponent"])
    ], NominalReportComponent.prototype, "overviewComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('detailComponent'),
        __metadata("design:type", _tabs_detail_tab_detail_tab_component__WEBPACK_IMPORTED_MODULE_30__["DetailTabComponent"])
    ], NominalReportComponent.prototype, "detailComponent", void 0);
    NominalReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-nominal-report',
            providers: [_shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_25__["NominalReportDataLoader"]],
            template: __webpack_require__(/*! ./nominal-report.component.html */ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.html"),
            styles: [__webpack_require__(/*! ./nominal-report.component.scss */ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.scss")],
        }),
        __param(10, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_15__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_27__["UiService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            _shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_25__["NominalReportDataLoader"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_22__["GridConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_28__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_23__["MasterdataService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_21__["FormConfigurationProviderService"],
            _shared_services_http_services_preaccounting_service__WEBPACK_IMPORTED_MODULE_24__["PreaccountingService"],
            Window,
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_19__["AgGridService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_26__["TitleService"]])
    ], NominalReportComponent);
    return NominalReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_9__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.html":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.html ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isDetailMode\">\r\n    <mat-card>\r\n        <mat-card-content>\r\n            <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs && isNominalReportDisplay\"\r\n                                            [gridOptions]=\"agGridOptions\"\r\n                                            [company]=\"company\"\r\n                                            [gridId]=\"getGridCode()\"\r\n                                            [isAutosize]=\"false\"\r\n                                            [isSetColumnStateEnabled]=\"false\"\r\n                                            fxLayoutAlign=\"end\"\r\n                                            [sharingEnabled]=\"hasGridSharing\"\r\n                                            #userPreferences>\r\n            </atlas-ag-grid-user-preferences>\r\n            <div fxLayout=\"row\"\r\n                 *ngIf='isNominalReportDisplay'\r\n                 class=\"quick-sum-div-height\"\r\n                 fxLayoutAlign=\"space-between center\">\r\n                <mat-slide-toggle mat-raised-button\r\n                                  (change)=\"toggleQuickSum($event.checked)\">Quick Sum Mode</mat-slide-toggle>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-around center\">\r\n\r\n                    <div *ngFor=\"let column of selectedColumnsArray\">\r\n                        <span class=\"quick-sum-span\"\r\n                              *ngIf=\"quickSumModeActivated\">{{column.name}} : {{column.sum | number }} </span>\r\n                    </div>\r\n                    <button mat-button\r\n                            (click)=\"onClearSelectionClicked()\"\r\n                            class=\"mat-button-user-margin\"\r\n                            *ngIf=\"quickSumModeActivated\">Clear Selection</button>\r\n                </div>\r\n            </div>\r\n            <div ag-grid=\"agGridOptions\"\r\n                 [ngClass]='classApplied'\r\n                 class=\"ag-theme-material pointer-cursor\"\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 [ngClass]=\"{'hidden-during-loading':!isNominalReportDisplay}\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"agGridRows\"\r\n                                 [columnDefs]=\"agGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"100\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [enableRangeSelection]=\"true\"\r\n                                 (columnVisible)=\"onColumnVisibilityChanged($event)\"\r\n                                 (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\"\r\n                                 enableFilter\r\n                                 [context]=\"gridContext\"\r\n                                 [suppressAggFuncInHeader]=\"true\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                 [excelStyles]=\"excelStyles\">\r\n                </ag-grid-angular>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.scss":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.scss ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.ts":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.ts ***!
  \**************************************************************************************************************************/
/*! exports provided: DetailTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailTabComponent", function() { return DetailTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../../shared/enums/nominal-account-type-enum */ "./Client/app/shared/enums/nominal-account-type-enum.ts");
/* harmony import */ var _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../../shared/enums/report-style-type.enum */ "./Client/app/shared/enums/report-style-type.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../../shared/services/execution/dtos/transaction-report-command */ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../../shared/services/list-and-search/nominalReport-data-loader */ "./Client/app/shared/services/list-and-search/nominalReport-data-loader.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../../../shared/entities/masterdata.entity */ "./Client/app/shared/entities/masterdata.entity.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../../../../../shared/components/filter-set-display/filter-set-display.component */ "./Client/app/shared/components/filter-set-display/filter-set-display.component.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

























var DetailTabComponent = /** @class */ (function (_super) {
    __extends(DetailTabComponent, _super);
    function DetailTabComponent(route, formBuilder, uiService, companyManager, dataLoader, gridConfigurationProvider, utilService, masterdataService, formConfigurationProvider, window, gridService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.uiService = uiService;
        _this.companyManager = companyManager;
        _this.dataLoader = dataLoader;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.window = window;
        _this.gridService = gridService;
        _this.agGridOptions = {};
        _this.agGridRows = [];
        _this.isLoading = false;
        _this.nominalTransactionGridCode = 'nominalReportTransactionGrid';
        _this.nominalTransactionGridConfig = [];
        _this.nominalTrabsactionQuickSumColumns = [];
        _this.isNominalReportDisplay = false;
        _this.isBroughtForward = false;
        _this.reportStyleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('reportStyleTypes');
        _this.reportStyleTypes = [];
        _this.accountTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('nominalAccountTypes');
        _this.nominalAccountTypes = [];
        _this.documentDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('documentFromCtrl');
        _this.documentDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('documentToCtrl');
        _this.accountingDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('accountingDateFromCtrl');
        _this.accountingDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('accountingDateToCtrl');
        _this.functionalCurrencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('nominalFunctionalCurrency');
        _this.currencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('currencyCtrl');
        _this.nominalAccountsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('nominalAccountsCtrl');
        _this.columnConfiguration = [];
        _this.filters = [];
        _this.subscriptions = [];
        _this.isGenerateButtonClicked = false;
        _this.ReportStyleType = _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__["ReportStyleType"];
        _this.isSummaryMode = false;
        _this.isDetailMode = true;
        /* quick sum */
        _this.defaultClass = 'ag-theme-material pointer-cursor';
        _this.cellSelectionClass = 'ag-theme-material pointer-cursor cell-selection';
        _this.quickSumModeActivated = false;
        _this.selectedColumnsArray = new Array();
        _this.allowedColumnsforQuickSum = [];
        _this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        return _this;
    }
    DetailTabComponent.prototype.getColumnConfig = function () {
        this.allowedColumnsforQuickSum = this.nominalTrabsactionQuickSumColumns;
        return this.nominalTransactionGridConfig;
    };
    DetailTabComponent.prototype.setColumnConfig = function (config) {
        this.nominalTransactionGridConfig = config;
    };
    DetailTabComponent.prototype.getGridCode = function () {
        return this.nominalTransactionGridCode;
    };
    DetailTabComponent.prototype.ngOnInit = function () {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.reportStyleCtrl.patchValue(_shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__["ReportStyleType"].Summary);
        this.accountTypeCtrl.patchValue(_shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_12__["NominalAccountType"].Both);
        this.company = this.companyManager.getCurrentCompanyId();
        // this.bindConfiguration();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        // quicksum
        this.classApplied = this.defaultClass;
        this.loadGridConfiguration();
    };
    DetailTabComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DetailTabComponent.prototype.onGenerateReportButtonClicked = function (isGenerateButtonClicked) {
        this.isGenerateButtonClicked = isGenerateButtonClicked;
        if (this.isGenerateButtonClicked && this.nominalReportFormGroup.valid) {
            this.toggleQuickSum(false);
            var hasQuickSearchValues = (this.currencyCtrl.value && this.currencyCtrl.valid)
                || (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid);
            if (hasQuickSearchValues) {
                var quickFilters = [];
                if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                    var currencyField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Currency'; });
                    var currencyFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilter"]();
                    currencyFilter.fieldId = currencyField.fieldId;
                    currencyFilter.fieldName = currencyField.fieldName;
                    currencyFilter.fieldFriendlyName = currencyField.fieldName;
                    currencyFilter.isActive = true;
                    currencyFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_23__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.currencyCtrl.value.currencyCode,
                    };
                    quickFilters.push(currencyFilter);
                    this.currencyCtrl.patchValue(null);
                    this.currencyCtrl.reset();
                }
                if (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid) {
                    var nominalAccountsField = this.columnConfiguration.find(function (column) { return column.fieldName === 'NominalAccount'; });
                    var nominalAccountsFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilter"]();
                    nominalAccountsFilter.fieldId = nominalAccountsField.fieldId;
                    nominalAccountsFilter.fieldName = nominalAccountsField.fieldName;
                    nominalAccountsFilter.fieldFriendlyName = nominalAccountsFilter.fieldName;
                    nominalAccountsFilter.isActive = true;
                    nominalAccountsFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_23__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.nominalAccountsCtrl.value.accountNumber,
                    };
                    quickFilters.push(nominalAccountsFilter);
                    this.nominalAccountsCtrl.reset();
                }
                this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                this.filters = quickFilters;
            }
            var columnConfig = this.getColumnConfig();
            if (columnConfig.length === 0) {
                this.loadGridConfiguration();
            }
            else {
                this.initColumns();
            }
            this.loadData();
        }
    };
    DetailTabComponent.prototype.loadData = function () {
        var _this = this;
        var clientReport = this.getNominalReportData();
        this.isLoading = true;
        this.isNominalReportDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (data) {
            _this.agGridRows = data.value;
            _this.isNominalReportDisplay = true;
        });
    };
    DetailTabComponent.prototype.getNominalReportData = function () {
        var nominalReport = new _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_15__["TransactionReportCommand"]();
        nominalReport.functionalCurrency = this.functionalCurrencyCtrl.value !== ''
            && this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__["ReportStyleType"].Summary
            ? this.functionalCurrencyCtrl.value : null;
        nominalReport.broughtForward = this.isBroughtForward;
        nominalReport.accountType = this.accountTypeCtrl.value !== null ? this.accountTypeCtrl.value : null;
        nominalReport.fromDate = this.accountingDateFromCtrl.value !== null ? this.accountingDateFromCtrl.value : null;
        nominalReport.toDate = this.accountingDateToCtrl.value !== null ? this.accountingDateToCtrl.value : null;
        nominalReport.documentFromDate = this.documentDateFromCtrl.value !== null ? this.documentDateFromCtrl.value : null;
        nominalReport.documentToDate = this.documentDateToCtrl.value !== null ? this.documentDateToCtrl.value : null;
        nominalReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return nominalReport;
    };
    DetailTabComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.getGridCode())
            .subscribe(function (configuration) {
            _this.setColumnConfig(configuration.columns);
            _this.columnConfiguration = configuration.columns;
            _this.initColumns();
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser;
        });
    };
    DetailTabComponent.prototype.initColumns = function () {
        var _this = this;
        var configuration = this.getColumnConfig();
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.agGridCols = configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: false,
                enableRowGroup: false,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                _this.nominalTrabsactionQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
            }
            var formatter = _this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = _this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = _this.checkStatutoryCurrency + ' eq';
            }
            var numericColumn = numericColumns.find(function (column) { return column === columnDef.field.toLowerCase(); });
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = _this.numberFormatter;
            }
            return columnDef;
        });
        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }
    };
    DetailTabComponent.prototype.numberFormatter = function (param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__["CommonMethods"]();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    };
    DetailTabComponent.prototype.onColumnVisibilityChanged = function (col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    };
    DetailTabComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = function () {
            _this.agGridColumnApi.autoSizeAllColumns();
        };
    };
    // -- Quick Sum
    DetailTabComponent.prototype.toggleQuickSum = function (value) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        }
        else {
            this.classApplied = this.defaultClass;
        }
    };
    DetailTabComponent.prototype.onClearSelectionClicked = function () {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    DetailTabComponent.prototype.onRangeSelectionChanged = function (event) {
        var _this = this;
        this.selectedColumnsArray = [];
        var rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        }
        else {
            var cellInfos_1 = [];
            var selectedCells_1 = [];
            rangeSelections.forEach(function (row) {
                var cellExists = selectedCells_1.find(function (cell) { return cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId(); });
                if (cellExists === null || cellExists === undefined) {
                    selectedCells_1.push(row);
                    var obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos_1.push(obj);
                }
            });
            var sum_1 = 0;
            var columnName_1;
            var columnHeader_1;
            var selectedColumnsArray_1 = this.selectedColumnsArray;
            var allowedColumnsforQuickSum_1 = this.allowedColumnsforQuickSum;
            selectedCells_1.forEach(function (row) {
                row.columns.forEach(function (column) {
                    sum_1 = 0;
                    columnName_1 = column.getColDef().colId.toLowerCase();
                    columnHeader_1 = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum_1.includes(columnName_1)) {
                        for (var rowIndex = 0; rowIndex < cellInfos_1.length; rowIndex++) {
                            if (cellInfos_1[rowIndex].columnName.toLowerCase() === columnName_1) {
                                var rowModel = _this.agGridApi.getModel();
                                var rowNode = rowModel.getRow(Number(cellInfos_1[rowIndex].rowIndex));
                                var value = _this.agGridApi.getValue(column, rowNode);
                                sum_1 += Number(value);
                            }
                        }
                        var columnObj = selectedColumnsArray_1.find(function (sum) { return sum.name === columnHeader_1; });
                        if (columnObj) {
                            columnObj.sum = sum_1;
                        }
                        else {
                            selectedColumnsArray_1.push({ name: columnHeader_1, sum: sum_1 });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray_1;
        }
    };
    DetailTabComponent.prototype.rangeSelectionCalculation = function (rangeSelection) {
        var _this = this;
        var sum = 0;
        var columnName;
        var columnHeader;
        this.selectedColumnsArray = [];
        var startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach(function (column) {
            columnName = column.getColDef().colId.toLowerCase();
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    var rowModel = _this.agGridApi.getModel();
                    var rowNode = rowModel.getRow(rowIndex);
                    var value = _this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                _this.selectedColumnsArray.push({ name: columnHeader, sum: sum });
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], DetailTabComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__["AgGridUserPreferencesComponent"])
    ], DetailTabComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('filterSetDisplay'),
        __metadata("design:type", _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_24__["FilterSetDisplayComponent"])
    ], DetailTabComponent.prototype, "filterSetDisplayComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "reportStyleCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], DetailTabComponent.prototype, "reportStyleTypes", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "accountTypeCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], DetailTabComponent.prototype, "nominalAccountTypes", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "documentDateFromCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "documentDateToCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "accountingDateFromCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "accountingDateToCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "functionalCurrencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "currencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DetailTabComponent.prototype, "nominalAccountsCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], DetailTabComponent.prototype, "columnConfiguration", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_21__["MasterData"])
    ], DetailTabComponent.prototype, "masterdata", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"])
    ], DetailTabComponent.prototype, "nominalReportFormGroup", void 0);
    DetailTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-detail-tab',
            template: __webpack_require__(/*! ./detail-tab.component.html */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.html"),
            styles: [__webpack_require__(/*! ./detail-tab.component.scss */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.scss")]
        }),
        __param(9, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_11__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_19__["UiService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__["CompanyManagerService"],
            _shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_18__["NominalReportDataLoader"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__["GridConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_20__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_22__["MasterdataService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__["FormConfigurationProviderService"],
            Window,
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_14__["AgGridService"]])
    ], DetailTabComponent);
    return DetailTabComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.html":
/*!********************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.html ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isOverviewMode\">\r\n    <mat-card>\r\n        <mat-card-content>\r\n            <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs && isNominalReportDisplay\"\r\n                                            [gridOptions]=\"agGridOptions\"\r\n                                            [company]=\"company\"\r\n                                            [gridId]=\"getGridCode()\"\r\n                                            [isAutosize]=\"false\"\r\n                                            fxLayoutAlign=\"end\"\r\n                                            [sharingEnabled]=\"hasGridSharing\"\r\n                                            #userPreferences>\r\n            </atlas-ag-grid-user-preferences>\r\n            <div fxLayout=\"row\"\r\n                 *ngIf='isNominalReportDisplay'\r\n                 class=\"quick-sum-div-height\"\r\n                 fxLayoutAlign=\"space-between center\">\r\n                <mat-slide-toggle mat-raised-button\r\n                                  (change)=\"toggleQuickSum($event.checked)\">Quick Sum Mode</mat-slide-toggle>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-around center\">\r\n\r\n                    <div *ngFor=\"let column of selectedColumnsArray\">\r\n                        <span class=\"quick-sum-span\"\r\n                              *ngIf=\"quickSumModeActivated\">{{column.name}} : {{column.sum | number }} </span>\r\n                    </div>\r\n                    <button mat-button\r\n                            (click)=\"onClearSelectionClicked()\"\r\n                            class=\"mat-button-user-margin\"\r\n                            *ngIf=\"quickSumModeActivated\">Clear Selection</button>\r\n                </div>\r\n            </div>\r\n            <div ag-grid=\"agGridOptions\"\r\n                 [ngClass]='classApplied'\r\n                 class=\"ag-theme-material pointer-cursor\"\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 [ngClass]=\"{'hidden-during-loading':!isNominalReportDisplay}\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"agGridRows\"\r\n                                 [columnDefs]=\"agGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"100\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [enableRangeSelection]=\"true\"\r\n                                 [groupMultiAutoColumn]=\"groupMultiAutoColumn\"\r\n                                 [rowGroupPanelShow]=\"rowGroupPanelShow\"\r\n                                 (columnVisible)=\"onColumnVisibilityChanged($event)\"\r\n                                 (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\"\r\n                                 enableFilter\r\n                                 [context]=\"gridContext\"\r\n                                 [suppressAggFuncInHeader]=\"true\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                 [excelStyles]=\"excelStyles\">\r\n                </ag-grid-angular>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.scss":
/*!********************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.scss ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.ts":
/*!******************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.ts ***!
  \******************************************************************************************************************************/
/*! exports provided: OverviewTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OverviewTabComponent", function() { return OverviewTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../execution/services/execution-cash-common-methods */ "./Client/app/execution/services/execution-cash-common-methods.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../../shared/enums/nominal-account-type-enum */ "./Client/app/shared/enums/nominal-account-type-enum.ts");
/* harmony import */ var _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../../shared/enums/report-style-type.enum */ "./Client/app/shared/enums/report-style-type.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../../shared/services/execution/dtos/transaction-report-command */ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../../shared/services/list-and-search/nominalReport-data-loader */ "./Client/app/shared/services/list-and-search/nominalReport-data-loader.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../../../shared/entities/masterdata.entity */ "./Client/app/shared/entities/masterdata.entity.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../../../../../shared/components/filter-set-display/filter-set-display.component */ "./Client/app/shared/components/filter-set-display/filter-set-display.component.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

























var OverviewTabComponent = /** @class */ (function (_super) {
    __extends(OverviewTabComponent, _super);
    function OverviewTabComponent(route, formBuilder, uiService, companyManager, dataLoader, gridConfigurationProvider, utilService, masterdataService, formConfigurationProvider, window, gridService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.uiService = uiService;
        _this.companyManager = companyManager;
        _this.dataLoader = dataLoader;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.window = window;
        _this.gridService = gridService;
        _this.agGridOptions = {};
        _this.agGridRows = [];
        _this.isLoading = false;
        _this.nominalTransactionGridCode = 'nominalReportTransactionGrid';
        _this.nominalTransactionGridConfig = [];
        _this.nominalTrabsactionQuickSumColumns = [];
        _this.isNominalReportDisplay = false;
        _this.rowGroupPanelShow = 'onlyWhenGrouping';
        _this.isOverviewMode = true;
        _this.isBroughtForward = false;
        _this.reportStyleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('reportStyleTypes');
        _this.reportStyleTypes = [];
        _this.accountTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('nominalAccountTypes');
        _this.nominalAccountTypes = [];
        _this.documentDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('documentFromCtrl');
        _this.documentDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('documentToCtrl');
        _this.accountingDateFromCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('accountingDateFromCtrl');
        _this.accountingDateToCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('accountingDateToCtrl');
        _this.functionalCurrencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('nominalFunctionalCurrency');
        _this.currencyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('currencyCtrl');
        _this.nominalAccountsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('nominalAccountsCtrl');
        _this.columnConfiguration = [];
        _this.filters = [];
        _this.subscriptions = [];
        _this.isGenerateButtonClicked = false;
        _this.ReportStyleType = _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__["ReportStyleType"];
        _this.isSummaryMode = false;
        /* quick sum */
        _this.defaultClass = 'ag-theme-material pointer-cursor';
        _this.cellSelectionClass = 'ag-theme-material pointer-cursor cell-selection';
        _this.quickSumModeActivated = false;
        _this.selectedColumnsArray = new Array();
        _this.allowedColumnsforQuickSum = [];
        _this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        return _this;
    }
    OverviewTabComponent.prototype.getColumnConfig = function () {
        this.allowedColumnsforQuickSum = this.nominalTrabsactionQuickSumColumns;
        return this.nominalTransactionGridConfig;
    };
    OverviewTabComponent.prototype.updateGroupDisplay = function () {
        this.rowGroupPanelShow = 'always';
        this.groupMultiAutoColumn = true;
        this.agGridOptions.groupMultiAutoColumn = this.groupMultiAutoColumn;
    };
    OverviewTabComponent.prototype.setColumnConfig = function (config) {
        this.rowGroupPanelShow = 'always';
        this.groupMultiAutoColumn = true;
        this.nominalTransactionGridConfig = config;
        this.agGridOptions.groupMultiAutoColumn = this.groupMultiAutoColumn;
    };
    OverviewTabComponent.prototype.getGridCode = function () {
        return this.nominalTransactionGridCode;
    };
    OverviewTabComponent.prototype.ngOnInit = function () {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.reportStyleCtrl.patchValue(_shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__["ReportStyleType"].Summary);
        this.accountTypeCtrl.patchValue(_shared_enums_nominal_account_type_enum__WEBPACK_IMPORTED_MODULE_12__["NominalAccountType"].Both);
        this.company = this.companyManager.getCurrentCompanyId();
        // this.bindConfiguration();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        // quicksum
        this.classApplied = this.defaultClass;
        this.loadGridConfiguration();
    };
    OverviewTabComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    OverviewTabComponent.prototype.onGenerateReportButtonClicked = function (isGenerateButtonClicked) {
        this.isGenerateButtonClicked = isGenerateButtonClicked;
        if (this.isGenerateButtonClicked && this.nominalReportFormGroup.valid) {
            this.toggleQuickSum(false);
            var hasQuickSearchValues = (this.currencyCtrl.value && this.currencyCtrl.valid)
                || (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid);
            if (hasQuickSearchValues) {
                var quickFilters = [];
                if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                    var currencyField = this.columnConfiguration.find(function (column) { return column.fieldName === 'Currency'; });
                    var currencyFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilter"]();
                    currencyFilter.fieldId = currencyField.fieldId;
                    currencyFilter.fieldName = currencyField.fieldName;
                    currencyFilter.fieldFriendlyName = currencyField.fieldName;
                    currencyFilter.isActive = true;
                    currencyFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_23__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.currencyCtrl.value.currencyCode,
                    };
                    quickFilters.push(currencyFilter);
                    this.currencyCtrl.patchValue(null);
                    this.currencyCtrl.reset();
                }
                if (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid) {
                    var nominalAccountsField = this.columnConfiguration.find(function (column) { return column.fieldName === 'NominalAccount'; });
                    var nominalAccountsFilter = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilter"]();
                    nominalAccountsFilter.fieldId = nominalAccountsField.fieldId;
                    nominalAccountsFilter.fieldName = nominalAccountsField.fieldName;
                    nominalAccountsFilter.fieldFriendlyName = nominalAccountsFilter.fieldName;
                    nominalAccountsFilter.isActive = true;
                    nominalAccountsFilter.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_23__["ListAndSearchFilterType"].Picklist,
                        operator: 'eq',
                        value1: this.nominalAccountsCtrl.value.accountNumber,
                    };
                    quickFilters.push(nominalAccountsFilter);
                    this.nominalAccountsCtrl.reset();
                }
                this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                this.filters = quickFilters;
            }
            var columnConfig = this.getColumnConfig();
            if (columnConfig.length === 0) {
                this.loadGridConfiguration();
            }
            else {
                this.initColumns();
            }
            this.loadData();
        }
    };
    OverviewTabComponent.prototype.loadData = function () {
        var _this = this;
        var clientReport = this.getNominalReportData();
        this.isLoading = true;
        this.isNominalReportDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["first"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (data) {
            _this.agGridRows = data.value;
            _this.isNominalReportDisplay = true;
        });
    };
    OverviewTabComponent.prototype.getNominalReportData = function () {
        var nominalReport = new _shared_services_execution_dtos_transaction_report_command__WEBPACK_IMPORTED_MODULE_15__["TransactionReportCommand"]();
        nominalReport.functionalCurrency = this.functionalCurrencyCtrl.value !== ''
            && this.reportStyleCtrl.value === _shared_enums_report_style_type_enum__WEBPACK_IMPORTED_MODULE_13__["ReportStyleType"].Summary
            ? this.functionalCurrencyCtrl.value : null;
        nominalReport.broughtForward = this.isBroughtForward;
        nominalReport.accountType = this.accountTypeCtrl.value !== null ? this.accountTypeCtrl.value : null;
        nominalReport.fromDate = this.accountingDateFromCtrl.value !== null ? this.accountingDateFromCtrl.value : null;
        nominalReport.toDate = this.accountingDateToCtrl.value !== null ? this.accountingDateToCtrl.value : null;
        nominalReport.documentFromDate = this.documentDateFromCtrl.value !== null ? this.documentDateFromCtrl.value : null;
        nominalReport.documentToDate = this.documentDateToCtrl.value !== null ? this.documentDateToCtrl.value : null;
        nominalReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return nominalReport;
    };
    OverviewTabComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.getGridCode())
            .subscribe(function (configuration) {
            _this.setColumnConfig(configuration.columns);
            _this.columnConfiguration = configuration.columns;
            _this.initColumns();
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser;
        });
    };
    OverviewTabComponent.prototype.initColumns = function () {
        var _this = this;
        this.updateGroupDisplay();
        var configuration = this.getColumnConfig();
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.agGridCols = configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: config.isGroup,
                enableRowGroup: config.isGroup,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                _this.nominalTrabsactionQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
            }
            var formatter = _this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = _this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = _this.checkStatutoryCurrency + ' eq';
            }
            var numericColumn = numericColumns.find(function (column) { return column === columnDef.field.toLowerCase(); });
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = _this.numberFormatter;
            }
            return columnDef;
        });
        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }
    };
    OverviewTabComponent.prototype.numberFormatter = function (param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                var commonMethods = new _execution_services_execution_cash_common_methods__WEBPACK_IMPORTED_MODULE_6__["CommonMethods"]();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    };
    OverviewTabComponent.prototype.onColumnVisibilityChanged = function (col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    };
    OverviewTabComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = function () {
            _this.agGridColumnApi.autoSizeAllColumns();
        };
    };
    // -- Quick Sum
    OverviewTabComponent.prototype.toggleQuickSum = function (value) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        }
        else {
            this.classApplied = this.defaultClass;
        }
    };
    OverviewTabComponent.prototype.onClearSelectionClicked = function () {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    OverviewTabComponent.prototype.onRangeSelectionChanged = function (event) {
        var _this = this;
        this.selectedColumnsArray = [];
        var rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        }
        else {
            var cellInfos_1 = [];
            var selectedCells_1 = [];
            rangeSelections.forEach(function (row) {
                var cellExists = selectedCells_1.find(function (cell) { return cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId(); });
                if (cellExists === null || cellExists === undefined) {
                    selectedCells_1.push(row);
                    var obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos_1.push(obj);
                }
            });
            var sum_1 = 0;
            var columnName_1;
            var columnHeader_1;
            var selectedColumnsArray_1 = this.selectedColumnsArray;
            var allowedColumnsforQuickSum_1 = this.allowedColumnsforQuickSum;
            selectedCells_1.forEach(function (row) {
                row.columns.forEach(function (column) {
                    sum_1 = 0;
                    columnName_1 = column.getColDef().colId.toLowerCase();
                    columnHeader_1 = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum_1.includes(columnName_1)) {
                        for (var rowIndex = 0; rowIndex < cellInfos_1.length; rowIndex++) {
                            if (cellInfos_1[rowIndex].columnName.toLowerCase() === columnName_1) {
                                var rowModel = _this.agGridApi.getModel();
                                var rowNode = rowModel.getRow(Number(cellInfos_1[rowIndex].rowIndex));
                                var value = _this.agGridApi.getValue(column, rowNode);
                                sum_1 += Number(value);
                            }
                        }
                        var columnObj = selectedColumnsArray_1.find(function (sum) { return sum.name === columnHeader_1; });
                        if (columnObj) {
                            columnObj.sum = sum_1;
                        }
                        else {
                            selectedColumnsArray_1.push({ name: columnHeader_1, sum: sum_1 });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray_1;
        }
    };
    OverviewTabComponent.prototype.rangeSelectionCalculation = function (rangeSelection) {
        var _this = this;
        var sum = 0;
        var columnName;
        var columnHeader;
        this.selectedColumnsArray = [];
        var startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        var allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach(function (column) {
            columnName = column.getColDef().colId.toLowerCase();
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    var rowModel = _this.agGridApi.getModel();
                    var rowNode = rowModel.getRow(rowIndex);
                    var value = _this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                _this.selectedColumnsArray.push({ name: columnHeader, sum: sum });
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], OverviewTabComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_7__["AgGridUserPreferencesComponent"])
    ], OverviewTabComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('filterSetDisplay'),
        __metadata("design:type", _shared_components_filter_set_display_filter_set_display_component__WEBPACK_IMPORTED_MODULE_24__["FilterSetDisplayComponent"])
    ], OverviewTabComponent.prototype, "filterSetDisplayComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "reportStyleCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], OverviewTabComponent.prototype, "reportStyleTypes", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "accountTypeCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], OverviewTabComponent.prototype, "nominalAccountTypes", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "documentDateFromCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "documentDateToCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "accountingDateFromCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "accountingDateToCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "functionalCurrencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "currencyCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], OverviewTabComponent.prototype, "nominalAccountsCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], OverviewTabComponent.prototype, "columnConfiguration", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_21__["MasterData"])
    ], OverviewTabComponent.prototype, "masterdata", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"])
    ], OverviewTabComponent.prototype, "nominalReportFormGroup", void 0);
    OverviewTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-overview-tab',
            template: __webpack_require__(/*! ./overview-tab.component.html */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.html"),
            styles: [__webpack_require__(/*! ./overview-tab.component.scss */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.scss")]
        }),
        __param(9, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_11__["WINDOW"])),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_19__["UiService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__["CompanyManagerService"],
            _shared_services_list_and_search_nominalReport_data_loader__WEBPACK_IMPORTED_MODULE_18__["NominalReportDataLoader"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_17__["GridConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_20__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_22__["MasterdataService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__["FormConfigurationProviderService"],
            Window,
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_14__["AgGridService"]])
    ], OverviewTabComponent);
    return OverviewTabComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-display-view.ts":
/*!************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-display-view.ts ***!
  \************************************************************************************************************************************/
/*! exports provided: LdrepDisplayView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdrepDisplayView", function() { return LdrepDisplayView; });
/* harmony import */ var _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata.entity */ "./Client/app/shared/entities/masterdata.entity.ts");
/* harmony import */ var _shared_entities_ldrep_manual_adjustment_records_entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/ldrep-manual-adjustment-records.entity */ "./Client/app/shared/entities/ldrep-manual-adjustment-records.entity.ts");
/* harmony import */ var _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/enums/date-format.enum */ "./Client/app/shared/enums/date-format.enum.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var moment = moment__WEBPACK_IMPORTED_MODULE_3__;
var LdrepDisplayView = /** @class */ (function () {
    function LdrepDisplayView(ldrep, masterdata, dateLocale) {
        this.dateLocale = dateLocale;
        if (ldrep) {
            this.manualAdjustmentId = ldrep.manualAdjustmentId;
            this.fromDateFormat = _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_2__["DateFormats"][Number(ldrep.fromDateFormat)];
            this.dateFrom = ldrep.dateFrom ? moment(ldrep.dateFrom, 'YYYY-MM-DD').toDate() : null;
            this.toDateFormat = _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_2__["DateFormats"][Number(ldrep.toDateFormat)];
            this.dateTo = ldrep.dateTo ? moment(ldrep.dateTo, 'YYYY-MM-DD').toDate() : null;
            this.departmentCode = ldrep.departmentCode;
            this.pNLType = ldrep.pnlType;
            this.realized = ldrep.realized;
            this.functionalCCYAdjustment = ldrep.functionalCCYAdjustment;
            this.statutoryCCYAdjustment = ldrep.statutoryCCYAdjustment;
            this.narrative = ldrep.narrative;
            this.charterRefrence = ldrep.charterCode;
            this.contractReference = ldrep.contractSectionCode;
            this.cmy1 = ldrep.principalCommodity;
            this.commodityId = ldrep.commodityId;
            this.cmy2 = this.getCommodity2FromCommodity1(ldrep.principalCommodity, masterdata);
            this.cmy3 = this.getCommodity3FromCommodity1(ldrep.principalCommodity, masterdata);
            this.cmy4 = this.getCommodity4FromCommodity1(ldrep.principalCommodity, masterdata);
            ;
            this.cmy5 = this.getCommodity5FromCommodity1(ldrep.principalCommodity, masterdata);
            ;
            this.cropYear = ldrep.cropYear;
        }
    }
    LdrepDisplayView.prototype.getCommodity2FromCommodity1 = function (code, masterdata) {
        var commodity = masterdata.commodities.find(function (e) { return e.commodityType === code; });
        return commodity ? commodity.commodityOrigin : '';
    };
    LdrepDisplayView.prototype.getCommodity3FromCommodity1 = function (code, masterdata) {
        var commodity = masterdata.commodities.find(function (e) { return e.commodityType === code; });
        return commodity ? commodity.commodityGrade : '';
    };
    LdrepDisplayView.prototype.getCommodity4FromCommodity1 = function (code, masterdata) {
        var commodity = masterdata.commodities.find(function (e) { return e.commodityType === code; });
        return commodity ? commodity.commodityLvl4 : '';
    };
    LdrepDisplayView.prototype.getCommodity5FromCommodity1 = function (code, masterdata) {
        var commodity = masterdata.commodities.find(function (e) { return e.commodityType === code; });
        return commodity ? commodity.commodityLvl5 : '';
    };
    LdrepDisplayView.prototype.getLdrepData = function (masterdata) {
        var local = this.dateLocale || moment.locale();
        var ldrep = new _shared_entities_ldrep_manual_adjustment_records_entity__WEBPACK_IMPORTED_MODULE_1__["LdrepManualAdjustmentRecords"]();
        ldrep.manualAdjustmentId = this.manualAdjustmentId;
        ldrep.fromDateFormat = _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_2__["DateFormats"][this.fromDateFormat];
        ldrep.dateFrom = moment.utc(moment.parseZone(this.dateFrom).format('YYYY-MM-DD')).locale(local);
        ldrep.toDateFormat = _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_2__["DateFormats"][this.toDateFormat];
        ldrep.dateTo = this.dateTo ? moment.utc(moment.parseZone(this.dateTo).format('YYYY-MM-DD')).locale(local) : null;
        ldrep.departmentId = this.getDepartmentIdFromCode(this.departmentCode, masterdata);
        ldrep.pnlTypeId = this.getPNLTypeIdFromCode(this.pNLType, masterdata);
        ldrep.realized = this.realized;
        ldrep.functionalCCYAdjustment = this.functionalCCYAdjustment;
        ldrep.statutoryCCYAdjustment = this.statutoryCCYAdjustment;
        ldrep.narrative = this.narrative;
        ldrep.charterRefrenceId = this.charterRefrenceId;
        ldrep.sectionId = this.sectionId;
        ldrep.commodityId = (typeof this.commodityId === 'string') ? this.getCommodityIdFromCode(this.commodityId, masterdata) : this.commodityId;
        ldrep.cropYear = this.cropYear;
        return ldrep;
    };
    LdrepDisplayView.prototype.getCommodityIdFromCode = function (code, masterdata) {
        var commodity = masterdata.commodities.find(function (e) { return e.commodityCode === code; });
        return commodity ? commodity.commodityId : null;
    };
    LdrepDisplayView.prototype.getDepartmentIdFromCode = function (code, masterdata) {
        var department = masterdata.departments.find(function (e) { return e.departmentCode === code; });
        return department ? department.departmentId : null;
    };
    LdrepDisplayView.prototype.getPNLTypeIdFromCode = function (code, masterdata) {
        var pnlType = masterdata.pnlTypes.find(function (e) { return e.enumEntityDescription === code; });
        return pnlType ? pnlType.enumEntityId : null;
    };
    LdrepDisplayView = __decorate([
        __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Optional"])()), __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_4__["MAT_DATE_LOCALE"])),
        __metadata("design:paramtypes", [_shared_entities_ldrep_manual_adjustment_records_entity__WEBPACK_IMPORTED_MODULE_1__["LdrepManualAdjustmentRecords"], _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_0__["MasterData"], String])
    ], LdrepDisplayView);
    return LdrepDisplayView;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.html":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.html ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <mat-button-toggle-group class=\"toggle-group\"\r\n                             [formControl]=\"dailyMonthlyToggleCtrl\"\r\n                             [value]=\"setPeriodType\"\r\n                             (change)=\"onChanges()\"\r\n                             aria-label=\"Date / Period rates to be maintained\">\r\n        <mat-button-toggle [value]=\"daily\">Daily</mat-button-toggle>\r\n        <mat-button-toggle [value]=\"monthly\">Monthly</mat-button-toggle>\r\n    </mat-button-toggle-group>\r\n</div>\r\n\r\n<div class=\"main-container\">\r\n    <mat-card fxFlex=100%>\r\n        <div fxLayout=\"row\"\r\n             class=\"search\">\r\n            <atlas-date-picker *ngIf=\"activateDay\"\r\n                               fxFlex=\"50%\"\r\n                               isEditable=true\r\n                               label=\"From\"\r\n                               [fieldControl]=\"fromDateCtrl\"\r\n                               [errorMap]=\"dailyErrorMap\"\r\n                               (dateChanged)=\"onFromChanged()\">\r\n            </atlas-date-picker>\r\n            <atlas-month-date-picker *ngIf=\"activateMonth\"\r\n                                     fxFlex=\"50%\"\r\n                                     class=\"month-date-picker\"\r\n                                     isEditable=true\r\n                                     label=\"From\"\r\n                                     [fieldControl]=\"fromDateCtrl\"\r\n                                     [errorMap]=\"monthlyErrorMap\"\r\n                                     (monthChanged)=\"onFromChanged()\">\r\n            </atlas-month-date-picker>\r\n            <atlas-date-picker *ngIf=\"activateDay\"\r\n                               fxFlex=\"50%\"\r\n                               isEditable=true\r\n                               label=\"To\"\r\n                               [fieldControl]=\"toDateCtrl\"\r\n                               [errorMap]=\"dailyErrorMap\"\r\n                               (dateChanged)=\"onToChanged()\">\r\n            </atlas-date-picker>\r\n            <atlas-month-date-picker *ngIf=\"activateMonth\"\r\n                                     fxFlex=\"50%\"\r\n                                     class=\"month-date-picker\"\r\n                                     isEditable=true\r\n                                     label=\"To\"\r\n                                     [fieldControl]=\"toDateCtrl\"\r\n                                     [errorMap]=\"monthlyErrorMap\"\r\n                                     (monthChanged)=\"onToChanged()\">\r\n            </atlas-month-date-picker>\r\n            <button mat-raised-button\r\n                    class=\"heroGradient\">\r\n                <mat-icon aria-label=\"Search\"\r\n                          (click)=\"onSearchButtonClicked()\"\r\n                          class=\"search-icon\">search</mat-icon>\r\n            </button>\r\n        </div>\r\n    </mat-card>\r\n</div>\r\n\r\n<div *ifAuthorized=\"'Reports.PLReport.EditReport',company:this.company\"\r\n     fxLayout=\"row\"\r\n     fxLayoutAlign=\"start center\"\r\n     fxLayoutGap=\"10px\"\r\n     class=\"add-line-container\">\r\n    <div fxLayout=\"column\"\r\n         fxLayoutAlign=\"start start\">\r\n        <h6 class=\"no-margin\">Add new lines:</h6>\r\n    </div>\r\n    <div fxLayout=\"column\"\r\n         fxLayoutAlign=\"start start\"\r\n         fxFlex=\"4\">\r\n        <mat-form-field>\r\n            <input matInput\r\n                   [readonly]=\"!isEditChecked\"\r\n                   [formControl]=\"addNewLineCtrl\">\r\n        </mat-form-field>\r\n    </div>\r\n    <div fxLayout=\"column\"\r\n         fxLayoutAlign=\"start start\">\r\n        <button mat-button\r\n                [disabled]=\"!isEditChecked\"\r\n                (click)=\"onProceedButtonClicked()\">PROCEED</button>\r\n    </div>\r\n    <div fxLayout=\"row \"\r\n         fxLayoutAlign=\"right\">\r\n        <mat-slide-toggle [checked]=\"isEditChecked\"\r\n                          (change)=\"onEditToggleButtonClicked($event)\"\r\n                          [formControl]=\"editToggleButtonCtrl\">Edit</mat-slide-toggle>\r\n    </div>\r\n</div>\r\n<div fxLayout=\"row\"\r\n     fxLayoutAlign=\"start none\">\r\n    <mat-card fxFlex=100%>\r\n        <mat-card-header>\r\n            <mat-card-title class=\" table-title atlas-grid-card-header\">\r\n                <h2>Manual Adjustments</h2>\r\n            </mat-card-title>\r\n            <span class=\"fill-space\"></span>\r\n            <div hidden>\r\n                <button mat-icon-button\r\n                        [matMenuTriggerFor]=\"menu1\">\r\n                    <i class=\"material-icons\">more_vert</i>\r\n                </button>\r\n                <mat-menu #menu1=\"matMenu\">\r\n                    <button mat-menu-item\r\n                            (mouseover)=\"onBulkDeleteButtonCliked()\">\r\n                        <mat-icon>delete</mat-icon><span>Delete</span>\r\n                    </button>\r\n                </mat-menu>\r\n            </div>\r\n        </mat-card-header>\r\n        <mat-card-content>\r\n            <div ag-grid=\"ldrepManualAdjustmentGridOptions\"\r\n                 class=\"ag-theme-material pointer-cursor\"\r\n                 style=\"width: 100%; height: 100%\">\r\n                <ag-grid-angular style=\" height: 100%;\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"ldrepManualAdjustmentGridRows\"\r\n                                 [columnDefs]=\"ldrepManualAdjustmentGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"10\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=autoHeight\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 (cellValueChanged)=\"onCellValueChanged($event)\"\r\n                                 [frameworkComponents]=\"gridComponents\"\r\n                                 enableFilter\r\n                                 [singleClickEdit]=true\r\n                                 [gridOptions]=\"ldrepManualAdjustmentGridOptions\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\">\r\n                </ag-grid-angular>\r\n            </div>\r\n        </mat-card-content>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"center center\"\r\n             fxLayoutWrap\r\n             *ngIf=\"isLoading\"\r\n             class=\"loading\">\r\n            <mat-spinner color=\"accent\"></mat-spinner>\r\n        </div>\r\n    </mat-card>\r\n</div>\r\n<div fxLayout=\"column\"\r\n     fxLayoutAlign=\"start end\"\r\n     class=\"scroll-style\">\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end start\">\r\n        <button mat-raised-button\r\n                type=\"button\"\r\n                [disabled]=\"!isEditChecked\"\r\n                (click)=\"onSaveButtonClick()\">\r\n            SAVE\r\n        </button>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.scss":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.scss ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".month-date-picker {\n  width: 100%; }\n\n.scroll-style {\n  height: 70vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.ts":
/*!**********************************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.ts ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: LdrepManualAdjustmentReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdrepManualAdjustmentReportComponent", function() { return LdrepManualAdjustmentReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component */ "./Client/app/shared/components/ag-contextual-menu/ag-contextual-menu.component.ts");
/* harmony import */ var _shared_components_ag_grid_checkbox_ag_grid_checkbox_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component */ "./Client/app/shared/components/ag-grid-checkbox/ag-grid-checkbox.component.ts");
/* harmony import */ var _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component */ "./Client/app/shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component.ts");
/* harmony import */ var _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component */ "./Client/app/shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_cell_editor_date_picker_cell_editor_date_picker_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component */ "./Client/app/shared/components/cell-editor-date-picker/cell-editor-date-picker.component.ts");
/* harmony import */ var _shared_components_cell_editor_month_date_picker_cell_editor_month_date_picker_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../shared/components/cell-editor-month-date-picker/cell-editor-month-date-picker.component */ "./Client/app/shared/components/cell-editor-month-date-picker/cell-editor-month-date-picker.component.ts");
/* harmony import */ var _shared_components_cell_editor_numeric_cell_editor_numeric_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component */ "./Client/app/shared/components/cell-editor-numeric/cell-editor-numeric.component.ts");
/* harmony import */ var _shared_components_cell_editor_select_cell_editor_select_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../shared/components/cell-editor-select/cell-editor-select.component */ "./Client/app/shared/components/cell-editor-select/cell-editor-select.component.ts");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_ldrep_manual_adjustment_entity__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../shared/entities/ldrep-manual-adjustment.entity */ "./Client/app/shared/entities/ldrep-manual-adjustment.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../shared/enums/date-format.enum */ "./Client/app/shared/enums/date-format.enum.ts");
/* harmony import */ var _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../../shared/enums/freeze-type.enum */ "./Client/app/shared/enums/freeze-type.enum.ts");
/* harmony import */ var _shared_numberMask__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../../shared/numberMask */ "./Client/app/shared/numberMask.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_execution_charter_data_loader__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../../../../shared/services/execution/charter-data-loader */ "./Client/app/shared/services/execution/charter-data-loader.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/execution.service */ "./Client/app/shared/services/http-services/execution.service.ts");
/* harmony import */ var _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/reporting.service */ "./Client/app/shared/services/http-services/reporting.service.ts");
/* harmony import */ var _shared_services_list_and_search_trade_data_loader__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../../../../../shared/services/list-and-search/trade-data-loader */ "./Client/app/shared/services/list-and-search/trade-data-loader.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _ldrep_display_view__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./ldrep-display-view */ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-display-view.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






























var LdrepManualAdjustmentReportComponent = /** @class */ (function (_super) {
    __extends(LdrepManualAdjustmentReportComponent, _super);
    function LdrepManualAdjustmentReportComponent(formConfigurationProvider, uiService, dialog, reportingService, executionService, snackbarService, route, companyManager, tradeDataLoader, charterDataLoader, gridService, window) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.uiService = uiService;
        _this.dialog = dialog;
        _this.reportingService = reportingService;
        _this.executionService = executionService;
        _this.snackbarService = snackbarService;
        _this.route = route;
        _this.companyManager = companyManager;
        _this.tradeDataLoader = tradeDataLoader;
        _this.charterDataLoader = charterDataLoader;
        _this.gridService = gridService;
        _this.window = window;
        _this.fromSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.toSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.periodSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.fromDateCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_15__["AtlasFormControl"]('FromDate');
        _this.toDateCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_15__["AtlasFormControl"]('ToDate');
        _this.activateDay = true;
        _this.activateMonth = false;
        _this.dailyErrorMap = new Map();
        _this.monthlyErrorMap = new Map();
        _this.addNewLineCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_15__["AtlasFormControl"]('AddNewLine');
        _this.editToggleButtonCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_15__["AtlasFormControl"]('EditToggle');
        _this.dailyMonthlyToggleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_15__["AtlasFormControl"]('DailyMonthlyToggle');
        _this.ldrepManualAdjustmentGridOptions = {
            enableSorting: true,
            enableFilter: true,
        };
        _this.isLoading = false;
        _this.isEditChecked = false;
        _this.toDateDefaultValue = new Date;
        _this.ldrepManualAdjustmentGridRows = [];
        _this.requiredString = 'Required*';
        _this.formatType = 'en-US';
        _this.dateFormats = {
            Date: _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"].Date,
            Month: _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"].Month,
        };
        _this.gridContext = {
            gridEditable: true,
        };
        _this.gridComponents = {
            atlasSelect: _shared_components_cell_editor_select_cell_editor_select_component__WEBPACK_IMPORTED_MODULE_13__["CellEditorSelectComponent"],
            atlasNumeric: _shared_components_cell_editor_numeric_cell_editor_numeric_component__WEBPACK_IMPORTED_MODULE_12__["CellEditorNumericComponent"],
            atlasCheckbox: _shared_components_ag_grid_checkbox_ag_grid_checkbox_component__WEBPACK_IMPORTED_MODULE_6__["AgGridCheckboxComponent"],
            atlasDatePicker: _shared_components_cell_editor_date_picker_cell_editor_date_picker_component__WEBPACK_IMPORTED_MODULE_10__["CellEditorDatePickerComponent"],
            atlasMonthDatePicker: _shared_components_cell_editor_month_date_picker_cell_editor_month_date_picker_component__WEBPACK_IMPORTED_MODULE_11__["CellEditorMonthDatePickerComponent"],
        };
        _this.disableMonthly = true;
        _this.disableDaily = true;
        _this.disableFrom = true;
        _this.disableTo = true;
        _this.daily = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_19__["FreezeType"].Daily;
        _this.monthly = _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_19__["FreezeType"].Monthly;
        _this.ldrepAdjustmentMenuActions = {
            deleteAdjustment: 'delete',
        };
        return _this;
    }
    LdrepManualAdjustmentReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterdata = this.route.snapshot.data.masterdata;
        this.company = this.route.snapshot.paramMap.get('company');
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.functionalCurrencyCode = this.companyConfiguration.functionalCurrencyCode;
        this.statutoryCurrencyCode = this.companyConfiguration.statutoryCurrencyCode;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.dailyMonthlyToggleCtrl.patchValue(this.daily);
        this.fromDateCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_3__(this.getYesterdayDate()));
        this.filteredCommodityList = this.masterdata.commodities;
        this.charterDataLoader.getData().subscribe(function (charter) {
            _this.filteredCharter = charter;
        });
        var filterList = [];
        this.tradeDataLoader.getData(filterList).subscribe(function (trade) {
            _this.filteredContracts = trade.value;
            _this.filteredContractForCharterOrDept = trade.value;
        });
        this.init();
        this.initLDREPAdjustmentGridColumns();
    };
    LdrepManualAdjustmentReportComponent.prototype.init = function () {
        this.ldrepAdjustmentGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.ldrepAdjustmentMenuActions.deleteAdjustment,
            },
        ];
    };
    LdrepManualAdjustmentReportComponent.prototype.onSearchButtonClicked = function () {
        if (this.fromDateCtrl.value) {
            if (this.isValid(this.toDateCtrl.value)) {
                if (this.fromDateCtrl.value <= this.toDateCtrl.value) {
                    this.search();
                }
                else {
                    this.snackbarService.throwErrorSnackBar('To date cannot be before From date.');
                    return;
                }
            }
            else {
                this.search();
            }
        }
        else {
            this.snackbarService.throwErrorSnackBar('From date is required.');
            return;
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.search = function () {
        this.isLoading = true;
        this.gridContext.gridEditable = this.isEditChecked;
        this.getAllLdrepManualAdjustments();
        this.autoSizeGrid();
    };
    LdrepManualAdjustmentReportComponent.prototype.getAllLdrepManualAdjustments = function () {
        var _this = this;
        var toDate = (this.setPeriodType === this.monthly) ? this.toDateCtrl.value.endOf('month') : this.toDateCtrl.value;
        this.subscriptions.push(this.reportingService.getAllLdrepManualAdjustments(this.fromDateCtrl.value, toDate)
            .subscribe(function (data) {
            if (data && data.value.length > 0) {
                _this.clearLdrepGrid();
                data.value.forEach(function (element) {
                    var displayCostRow = new _ldrep_display_view__WEBPACK_IMPORTED_MODULE_29__["LdrepDisplayView"](element, _this.masterdata);
                    if (_this.gridApi) {
                        _this.gridApi.updateRowData({ add: [displayCostRow] });
                    }
                });
            }
            else {
                _this.clearLdrepGrid();
                _this.snackbarService.throwErrorSnackBar('No records are available for this search criteria.');
            }
            _this.isLoading = false;
        }));
    };
    LdrepManualAdjustmentReportComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.autoSizeGrid();
    };
    LdrepManualAdjustmentReportComponent.prototype.autoSizeGrid = function () {
        var _this = this;
        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = function () {
            _this.gridColumnApi.autoSizeAllColumns();
        };
    };
    LdrepManualAdjustmentReportComponent.prototype.initLDREPAdjustmentGridColumns = function () {
        var _this = this;
        this.ldrepManualAdjustmentGridOptions = {
            context: this.gridContext,
        };
        this.ldrepManualAdjustmentGridCols = [
            {
                headerName: 'From Date Format*',
                field: 'fromDateFormat',
                colId: 'fromDateFormat',
                editable: function (params) { return _this.gridContext.gridEditable; },
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: Object.keys(this.dateFormats),
                },
                onCellValueChanged: function (params) {
                    if (params.newValue === 'Date') {
                        params.node.setDataValue('dateFrom', _this.getYesterdayDate());
                    }
                    else if (params.newValue === 'Month') {
                        params.node.setDataValue('dateFrom', moment__WEBPACK_IMPORTED_MODULE_3__(new Date()).subtract(1, 'month').startOf('month'));
                    }
                    params.node.setDataValue('toDateFormat', params.newValue);
                },
            },
            {
                headerName: 'From*',
                field: 'dateFrom',
                colId: 'dateFrom',
                editable: function (params) { return _this.gridContext.gridEditable; },
                cellEditor: 'atlasMonthDatePicker',
                cellEditorParams: {
                    mode: function (params) {
                        return _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"][params.node.data.fromDateFormat];
                    },
                },
                cellRenderer: function (params) {
                    if (params.value) {
                        var dateformat = params.node.data.fromDateFormat == _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"][_shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"].Month] ? 'MMM YYYY' : 'DD MMM YYYY';
                        return moment__WEBPACK_IMPORTED_MODULE_3__(params.value).format(dateformat);
                    }
                    return _this.requiredCell(params);
                },
                onCellValueChanged: this.onFromDateSelected.bind(this),
            },
            {
                headerName: 'To Date Format',
                field: 'toDateFormat',
                colId: 'toDateFormat',
                editable: function (params) { return _this.gridContext.gridEditable; },
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: Object.keys(this.dateFormats),
                },
                onCellValueChanged: function (params) {
                    params.node.setDataValue('dateTo', '');
                },
            },
            {
                headerName: 'To',
                field: 'dateTo',
                colId: 'dateTo',
                editable: function (params) {
                    return _this.gridContext.gridEditable && params.node.data.toDateFormat;
                },
                cellEditor: 'atlasMonthDatePicker',
                cellEditorParams: {
                    mode: function (params) {
                        return _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"][params.node.data.toDateFormat];
                    },
                    endflag: true,
                },
                cellRenderer: function (params) {
                    if (params.value) {
                        var dateformat = params.node.data.toDateFormat == _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"][_shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"].Month] ? 'MMM YYYY' : 'DD MMM YYYY';
                        return moment__WEBPACK_IMPORTED_MODULE_3__(params.value).format(dateformat);
                    }
                    return '';
                },
                onCellValueChanged: this.onToDateSelected.bind(this),
            },
            {
                headerName: 'Department*',
                field: 'departmentCode',
                colId: 'departmentCode',
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_7__["AgGridAutocompleteComponent"],
                cellRendererParams: function (params) {
                    return {
                        options: _this.masterdata.departments,
                        valueProperty: 'departmentCode',
                        codeProperty: 'departmentCode',
                        displayProperty: 'description',
                        isRequired: true,
                    };
                },
                onCellValueChanged: function (params) {
                    if (!params.data.charterId && params.data.departmentCode) {
                        _this.filteredContractForCharterOrDept = _this.filteredContracts;
                        _this.filteredContractForCharterOrDept = _this.filteredContractForCharterOrDept.filter(function (e) { return e.departmentCode === params.data.departmentCode; });
                    }
                },
            },
            {
                headerName: 'Type*',
                field: 'pNLType',
                colId: 'pNLType',
                editable: function (params) { return _this.gridContext.gridEditable; },
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.masterdata.pnlTypes.map(function (pnlType) { return pnlType.enumEntityDescription; }),
                },
            },
            {
                headerName: 'Realized',
                field: 'realized',
                colId: 'realized',
                editable: false,
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: function (params) { return !_this.gridContext.gridEditable; },
                },
            },
            {
                headerName: this.functionalCurrencyCode + ' Adjustment',
                field: 'functionalCCYAdjustment',
                colId: 'functionalCCYAdjustment',
                editable: function (params) { return _this.gridContext.gridEditable; },
                valueFormatter: this.formatValue.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: Object(_shared_numberMask__WEBPACK_IMPORTED_MODULE_20__["CustomNumberMask"])(12, 10, true),
                    isRightAligned: false,
                },
            },
            {
                headerName: this.statutoryCurrencyCode + ' Adjustment',
                field: 'statutoryCCYAdjustment',
                colId: 'statutoryCCYAdjustment',
                editable: function (params) { return _this.gridContext.gridEditable; },
                valueFormatter: this.formatValue.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: Object(_shared_numberMask__WEBPACK_IMPORTED_MODULE_20__["CustomNumberMask"])(12, 10, true),
                    isRightAligned: false,
                },
            },
            {
                headerName: 'Narrative*',
                field: 'narrative',
                colId: 'narrative',
                editable: function (params) { return _this.gridContext.gridEditable; },
                cellRenderer: this.requiredCell,
                cellEditor: 'agLargeTextCellEditor',
                cellEditorParams: {
                    maxLength: 50,
                    rows: 3,
                    cols: 50,
                },
            },
            {
                headerName: 'Charter Reference',
                colId: 'charterId',
                field: 'charterId',
                cellRendererFramework: _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_8__["AgGridContextualSearchComponent"],
                cellRendererParams: function (params) {
                    return {
                        context: {
                            componentParent: _this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'charterGrid',
                        isRequired: false,
                        displayProperty: 'charterCode',
                        valueProperty: 'charterId',
                        lightBoxTitle: 'Results for Charters',
                        options: _this.filteredCharter,
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                onCellValueChanged: function (params) { return _this.onValueSelected(params, 'charterId', 'Charter', 'charterCode', _this.filteredCharter, ''); },
                tooltip: function (params) { return _this.getTooltip(params, 'description', 'charterCode', _this.filteredCharter); },
            },
            {
                headerName: 'Contract Reference',
                colId: 'sectionId',
                field: 'sectionId',
                cellRendererFramework: _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_8__["AgGridContextualSearchComponent"],
                cellRendererParams: function (params) {
                    return {
                        context: {
                            componentParent: _this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'tradeList',
                        isRequired: false,
                        displayProperty: 'contractLabel',
                        valueProperty: 'sectionId',
                        lightBoxTitle: 'Results for Contracts',
                        dataLoader: _this.tradeDataLoader,
                        options: _this.filteredContractForCharterOrDept,
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                tooltip: function (params) {
                    return params.value ? params.value : null;
                },
                onCellValueChanged: this.onContractReferenceSelected.bind(this),
            },
            {
                headerName: 'Cmy1',
                colId: 'commodityId',
                field: 'commodityId',
                cellRendererFramework: _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_8__["AgGridContextualSearchComponent"],
                cellRendererParams: function (params) {
                    return {
                        context: {
                            componentParent: _this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'commodityGrid',
                        isRequired: false,
                        displayProperty: 'commodityCode',
                        valueProperty: 'commodityId',
                        lightBoxTitle: 'Results for Commodities',
                        options: _this.filteredCommodityList,
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                onCellValueChanged: function (params) { return _this.onValueSelected(params, 'commodityId', 'Commodity', 'commodityCode', _this.filteredCommodityList, _this.requiredString); },
                tooltip: function (params) { return _this.getTooltip(params, 'commodityDescription', 'commodityCode', _this.filteredCommodityList); },
            },
            {
                headerName: 'Cmy2',
                field: 'cmy2',
                colId: 'cmy2',
            },
            {
                headerName: 'Cmy3',
                field: 'cmy3',
                colId: 'cmy3',
            },
            {
                headerName: 'Cmy4',
                field: 'cmy4',
                colId: 'cmy4',
            },
            {
                headerName: 'Cmy5',
                field: 'cmy5',
                colId: 'cmy5',
            },
            {
                headerName: 'Crop Year',
                field: 'cropYear',
                colId: 'cropYear',
                editable: this.isCropYearEditable.bind(this),
                onCellValueChanged: function (params) { return _this.onCropYearSetValidate(params); },
            },
            {
                headerName: '',
                cellRendererFramework: _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_5__["AgContextualMenuComponent"],
                cellRendererParams: {
                    isDisabled: function (params) { return !_this.gridContext.gridEditable; },
                    menuActions: this.ldrepAdjustmentGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    };
    LdrepManualAdjustmentReportComponent.prototype.formatValue = function (param) {
        if (isNaN(param.value) || param.value === null) {
            return '';
        }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(param.value);
    };
    LdrepManualAdjustmentReportComponent.prototype.isCropYearEditable = function (params) {
        if (this.gridContext.gridEditable) {
            return params.data.sectionId ? false : true;
        }
        else {
            return false;
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onCropYearSetValidate = function (params) {
        var error = null;
        if (params.data.cropYear) {
            var reg = new RegExp(/[0-9]{4}/g);
            var reg1 = new RegExp(/^[0-9]{4}(\/[0-9]{4})/);
            var cropString = String(params.data.cropYear).match(reg1);
            var years = String(params.data.cropYear).match(reg);
            var subString = String(params.data.cropYear).includes('/', 4);
            if (years) {
                if (years.length > 1 && years.length <= 2) {
                    if (Number(years[1]) < Number(years[0])) {
                        error = { isFirstYearGreater: true };
                    }
                }
                else if (years.length > 2) {
                    error = { NotRegularFormat: true };
                }
            }
            else {
                error = { NotRegularFormat: true };
            }
            if (!cropString && years && years.length === 1) {
                error = subString ? { NotRegularFormat: true } : null;
            }
        }
        if (error) {
            if (error.NotRegularFormat) {
                params.node.setDataValue('cropYear', null);
                this.snackbarService.throwErrorSnackBar('only YYYY or YYYY/YYYY format is allowed');
            }
            else if (error.isFirstYearGreater) {
                this.snackbarService.throwErrorSnackBar('Second year entered after the “/” should always be “greater than” the first year entered before the “/”');
            }
        }
        return null;
    };
    LdrepManualAdjustmentReportComponent.prototype.onFromDateSelected = function (params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            if (params.data.dateFrom && params.data.dateTo && params.data.dateFrom > params.data.dateTo) {
                this.snackbarService.throwErrorSnackBar('From date cannot be after To date.');
                params.node.setDataValue('dateFrom', '');
            }
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onToDateSelected = function (params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            if (params.data.dateFrom && params.data.dateTo && params.data.dateFrom > params.data.dateTo) {
                this.snackbarService.throwErrorSnackBar('To date cannot be before From date.');
                params.node.setDataValue('dateTo', '');
            }
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onValueSelected = function (params, columnId, valueName, code, list, requiredString, includeEmpty) {
        if (includeEmpty === void 0) { includeEmpty = false; }
        if ((includeEmpty && params.newValue === '') || (params.newValue && params.oldValue !== params.newValue)) {
            var selected = list.find(function (obj) { return obj[code] ? obj[code].toUpperCase() === params.newValue.toUpperCase() : false; });
            if (!selected) {
                this.snackbarService.throwErrorSnackBar('Not allowed : ' + valueName + ' does not exist');
                params.node.setDataValue(columnId, requiredString);
            }
        }
        if (columnId === 'charterId') {
            if (params.data.charterId) {
                this.filteredContractForCharterOrDept = this.filteredContracts;
                var charterRefrence_1 = this.filteredCharter.find(function (e) { return e.charterId === params.data.charterId; }).charterCode;
                this.filteredContractForCharterOrDept = this.filteredContractForCharterOrDept.filter(function (e) { return e.charterReference === charterRefrence_1; });
                if (this.gridApi && this.filteredContractForCharterOrDept) {
                    this.gridApi.refreshCells({
                        rowNodes: [params.node],
                        force: true,
                    });
                }
            }
        }
        if (columnId === 'commodityId') {
            var selectedCommodity = this.filteredCommodityList.find(function (commodity) { return commodity.commodityId === params.data.commodityId; });
            if (selectedCommodity) {
                params.node.setDataValue('cmy2', selectedCommodity.commodityOrigin);
                params.node.setDataValue('cmy3', selectedCommodity.commodityGrade);
                params.node.setDataValue('cmy4', selectedCommodity.commodityLvl4);
                params.node.setDataValue('cmy5', selectedCommodity.commodityLvl5);
            }
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.getTooltip = function (params, description, code, list) {
        if (params.value && typeof params.value === 'string') {
            var selected = list.find(function (obj) { return obj[code] ? obj[code].toUpperCase() === params.value.toUpperCase() : false; });
            if (selected) {
                return selected[description];
            }
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.getYesterdayDate = function () {
        var date = new Date();
        var yesterday = new Date(date.getTime());
        yesterday.setDate(date.getDate() - 1);
        return moment__WEBPACK_IMPORTED_MODULE_3__(yesterday).startOf('day').toDate();
    };
    LdrepManualAdjustmentReportComponent.prototype.createNewRowData = function () {
        var newAdjustmentRow = new _ldrep_display_view__WEBPACK_IMPORTED_MODULE_29__["LdrepDisplayView"]();
        newAdjustmentRow.isDirty = true;
        newAdjustmentRow.fromDateFormat = _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"][_shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"].Date];
        newAdjustmentRow.toDateFormat = _shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"][_shared_enums_date_format_enum__WEBPACK_IMPORTED_MODULE_18__["DateFormats"].Date];
        newAdjustmentRow.dateFrom = this.getYesterdayDate();
        newAdjustmentRow.realized = false;
        newAdjustmentRow.functionalCCYAdjustment = 0;
        newAdjustmentRow.statutoryCCYAdjustment = 0;
        return newAdjustmentRow;
    };
    LdrepManualAdjustmentReportComponent.prototype.requiredCell = function (params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    };
    LdrepManualAdjustmentReportComponent.prototype.validate = function () {
        var isValid = true;
        this.gridApi.forEachNode(function (rowData) {
            if (rowData.data.isDirty) {
                if (!(rowData.data.fromDateFormat && rowData.data.dateFrom && rowData.data.departmentCode
                    && rowData.data.pNLType && rowData.data.narrative)) {
                    isValid = false;
                }
            }
        });
        return isValid;
    };
    LdrepManualAdjustmentReportComponent.prototype.isValid = function (value) {
        if (value === null || value === '' || value === undefined || value === 0) {
            return false;
        }
        else {
            return true;
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.handleAction = function (action, ldrep) {
        var _this = this;
        if (!this.isValid(ldrep.functionalCCYAdjustment) && !this.isValid(ldrep.statutoryCCYAdjustment)) {
            switch (action) {
                case this.ldrepAdjustmentMenuActions.deleteAdjustment:
                    var confirmDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_14__["ConfirmationDialogComponent"], {
                        data: {
                            title: 'LDREP Manual Adjustment Deletion',
                            text: 'Are you sure you want to delete the manual adjustment?',
                            okButton: 'Delete anyway',
                            cancelButton: 'Cancel',
                        },
                    });
                    var confirmationSubscription = confirmDialog.afterClosed().subscribe(function (answer) {
                        if (answer) {
                            _this.model = new _shared_entities_ldrep_manual_adjustment_entity__WEBPACK_IMPORTED_MODULE_16__["LdrepManualAdjustment"]();
                            ldrep.isDirty = true;
                            _this.model.ldrepManualAdjustmentRecords = _this.getGridData();
                            if (_this.model.ldrepManualAdjustmentRecords.length > 0) {
                                if (_this.model.ldrepManualAdjustmentRecords[0].manualAdjustmentId) {
                                    _this.subscriptions.push(_this.reportingService.deleteLdrepManualAdjustments(_this.model).subscribe(function () {
                                        _this.snackbarService.informationSnackBar('Manual adjustment deleted.');
                                        _this.gridApi.updateRowData({ remove: [ldrep] });
                                        _this.isEditChecked = false;
                                        _this.gridContext.gridEditable = false;
                                        _this.refreshGrid();
                                    }));
                                }
                                else {
                                    _this.gridApi.updateRowData({ remove: [ldrep] });
                                    _this.snackbarService.informationSnackBar('Manual adjustment deleted.');
                                }
                            }
                            else {
                                _this.gridApi.updateRowData({ remove: [ldrep] });
                                _this.snackbarService.informationSnackBar('Manual adjustment deleted.');
                            }
                        }
                    });
                    this.subscriptions.push(confirmationSubscription);
                    break;
                default: this.assertUnreachable(action);
            }
        }
        else {
            this.snackbarService.throwErrorSnackBar('Adjustment is not zero.');
            return;
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.assertUnreachable = function (x) {
        throw new Error('Unknown action');
    };
    LdrepManualAdjustmentReportComponent.prototype.onCellValueChanged = function (params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.gridColumnApi.autoSizeAllColumns();
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onBulkDeleteButtonCliked = function () {
    };
    LdrepManualAdjustmentReportComponent.prototype.onProceedButtonClicked = function () {
        var lines = this.addNewLineCtrl.value;
        for (var count = 1; count <= lines; count++) {
            var newItem = this.createNewRowData();
            var res = this.gridApi.updateRowData({ add: [newItem], addIndex: 0 });
        }
        this.addNewLineCtrl.setValue('');
        this.gridColumnApi.autoSizeAllColumns();
    };
    LdrepManualAdjustmentReportComponent.prototype.onContractReferenceSelected = function (params) {
        if (params.data.sectionId) {
            var selectedContractReference = this.filteredContracts.find(function (contract) { return contract.sectionId === params.data.sectionId; });
            if (selectedContractReference) {
                params.node.setDataValue('cropYear', selectedContractReference.cropYear);
                params.node.setDataValue('commodityId', selectedContractReference.commodity1);
                params.node.setDataValue('cmy2', selectedContractReference.commodity2);
                params.node.setDataValue('cmy3', selectedContractReference.commodity3);
                params.node.setDataValue('cmy4', selectedContractReference.commodity4);
                params.node.setDataValue('cmy5', selectedContractReference.commodity5);
            }
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.getMaxDate = function () {
        var maxDate = moment__WEBPACK_IMPORTED_MODULE_3__('9999-12-31', 'YYYY-MM-DD');
        return maxDate;
    };
    LdrepManualAdjustmentReportComponent.prototype.onSaveButtonClick = function () {
        var _this = this;
        if (!this.validate()) {
            this.snackbarService.throwErrorSnackBar('Manual adjustment record is invalid. Please resolve the errors.');
            return;
        }
        this.model = new _shared_entities_ldrep_manual_adjustment_entity__WEBPACK_IMPORTED_MODULE_16__["LdrepManualAdjustment"]();
        this.model.ldrepManualAdjustmentRecords = this.getGridData();
        // Check for duplicate adjustment data and show warning
        var rowData = [];
        this.gridApi.forEachNode(function (node) { return rowData.push(node.data); });
        var overlap_exists = [];
        if (rowData.length > 1) {
            for (var i = 0; i < rowData.length - 1; i++) {
                for (var j = i + 1; j < rowData.length; j++) {
                    var a = rowData[i];
                    var b = rowData[j];
                    var a_dateTo = a.dateTo ? a.dateTo : this.getMaxDate();
                    var b_dateTo = b.dateTo ? b.dateTo : this.getMaxDate();
                    var dates_overlap = (b.dateFrom >= a.dateFrom && b.dateFrom <= a_dateTo) ||
                        (b_dateTo >= a.dateFrom && b_dateTo <= a_dateTo);
                    if (dates_overlap
                        && a.fromDateFormat === b.fromDateFormat
                        && a.toDateFormat === b.toDateFormat
                        && a.departmentCode === b.departmentCode
                        && a.pNLType === b.pNLType
                        && a.realized === b.realized
                        && a.functionalCCYAdjustment === b.functionalCCYAdjustment
                        && a.statutoryCCYAdjustment === b.statutoryCCYAdjustment
                        && a.charterId === b.charterId
                        && a.sectionId === b.sectionId
                        && a.commodityId === b.commodityId
                        && (a.cropYear ? a.cropYear : null) === b.cropYear) {
                        overlap_exists.push([i, j]);
                    }
                }
            }
            if (overlap_exists.length > 0) {
                var confirmDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_14__["ConfirmationDialogComponent"], {
                    data: {
                        title: 'LDREP Manual Adjustment',
                        text: 'An adjustment for this period already exists. Please review your adjustment.',
                        okButton: 'Save anyway',
                        cancelButton: 'Cancel',
                    },
                });
                var confirmationSubscription = confirmDialog.afterClosed().subscribe(function (answer) {
                    if (answer) {
                        _this.save();
                    }
                });
            }
            else {
                this.save();
            }
        }
        else {
            this.save();
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.clearDirty = function () {
        this.gridApi.forEachNode(function (rowData) {
            rowData.data.isDirty = false;
        });
    };
    LdrepManualAdjustmentReportComponent.prototype.save = function () {
        var _this = this;
        if (this.model && this.model.ldrepManualAdjustmentRecords.length > 0) {
            this.subscriptions.push(this.reportingService
                .createUpdateLdrepManualAdjustment(this.model)
                .subscribe(function (data) {
                _this.snackbarService.informationSnackBar('LDREP adjustment saved successfully.');
                _this.isEditChecked = false;
                _this.gridContext.gridEditable = false;
                _this.refreshGrid();
                _this.autoSizeGrid();
                _this.clearDirty();
            }, function (err) {
                _this.isLoading = false;
                throw err;
            }));
        }
        else {
            this.snackbarService.throwErrorSnackBar('No records are available to save.');
            return;
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.getGridData = function () {
        var _this = this;
        var ldrep = new Array();
        this.gridApi.forEachNode(function (rowData) {
            var ldrepData = rowData.data;
            if (ldrepData.isDirty) {
                ldrep.push(ldrepData.getLdrepData(_this.masterdata));
            }
        });
        return ldrep;
    };
    LdrepManualAdjustmentReportComponent.prototype.onChanges = function () {
        if (this.dailyMonthlyToggleCtrl.value === this.daily) {
            this.setPeriodType = this.daily;
        }
        else if (this.dailyMonthlyToggleCtrl.value === this.monthly) {
            this.setPeriodType = this.monthly;
        }
        this.fromDateCtrl.reset();
        this.toDateCtrl.reset();
        this.setDefaultValues();
        this.onToggleChangeSetDefaultFromDateValues();
    };
    LdrepManualAdjustmentReportComponent.prototype.setDefaultValues = function () {
        if (this.setPeriodType === this.daily) {
            this.activateMonth = false;
            this.activateDay = true;
        }
        if (this.setPeriodType === this.monthly) {
            this.activateDay = false;
            this.activateMonth = true;
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onToggleChangeSetDefaultFromDateValues = function () {
        if (this.setPeriodType === this.daily) {
            this.fromDateCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_3__(this.getYesterdayDate()));
        }
        if (this.setPeriodType === this.monthly) {
            this.fromDateCtrl.setValue(moment__WEBPACK_IMPORTED_MODULE_3__(new Date()).subtract(1, 'month').startOf('month'));
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onFromChanged = function () {
        var _this = this;
        this.fromDateCtrl.valueChanges.subscribe(function (fromValue) {
            _this.setDefaultValues();
            _this.fromSelected.emit((fromValue));
            _this.fromDateSet = fromValue;
        });
    };
    LdrepManualAdjustmentReportComponent.prototype.onToChanged = function () {
        var _this = this;
        this.toDateCtrl.valueChanges.subscribe(function (toValue) {
            _this.setDefaultValues();
            _this.toSelected.emit((toValue));
        });
    };
    LdrepManualAdjustmentReportComponent.prototype.clearLdrepGrid = function () {
        if (this.gridApi) {
            this.gridApi.setRowData([]);
        }
    };
    LdrepManualAdjustmentReportComponent.prototype.onEditToggleButtonClicked = function (event) {
        this.isEditChecked = event.checked;
        this.gridContext.gridEditable = event.checked;
        this.refreshGrid();
        this.autoSizeGrid();
    };
    LdrepManualAdjustmentReportComponent.prototype.refreshGrid = function () {
        this.isLoading = true;
        this.gridApi.redrawRows();
        this.isLoading = false;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], LdrepManualAdjustmentReportComponent.prototype, "fromSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], LdrepManualAdjustmentReportComponent.prototype, "toSelected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], LdrepManualAdjustmentReportComponent.prototype, "periodSelected", void 0);
    LdrepManualAdjustmentReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-ldrep-manual-adjustment-report',
            template: __webpack_require__(/*! ./ldrep-manual-adjustment-report.component.html */ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.html"),
            styles: [__webpack_require__(/*! ./ldrep-manual-adjustment-report.component.scss */ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.scss")],
            providers: [_shared_services_list_and_search_trade_data_loader__WEBPACK_IMPORTED_MODULE_26__["TradeDataLoader"], _shared_services_execution_charter_data_loader__WEBPACK_IMPORTED_MODULE_22__["CharterDataLoader"]],
        }),
        __param(11, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_17__["WINDOW"])),
        __metadata("design:paramtypes", [_shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_23__["FormConfigurationProviderService"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_28__["UiService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_25__["ReportingService"],
            _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_24__["ExecutionService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_27__["SnackbarService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_4__["CompanyManagerService"],
            _shared_services_list_and_search_trade_data_loader__WEBPACK_IMPORTED_MODULE_26__["TradeDataLoader"],
            _shared_services_execution_charter_data_loader__WEBPACK_IMPORTED_MODULE_22__["CharterDataLoader"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_21__["AgGridService"],
            Window])
    ], LdrepManualAdjustmentReportComponent);
    return LdrepManualAdjustmentReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_9__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.html":
/*!**************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.html ***!
  \**************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='main-container'>\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"space-between stretch\"\r\n         fxLayoutAlign.lt-md=\"space-around center\"\r\n         fxLayoutGap=\"16px\">\r\n        <mat-card fxFlex=\"38%\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>Database Selection</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"5px\">\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-between start\"\r\n                     fxLayoutGap=\"15%\">\r\n                    <atlas-dropdown-select fxFlex='40%'\r\n                                           [label]=\"'Snapshot'\"\r\n                                           [fieldControl]=\"pnlSnapshotCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"snapshotList\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\"\r\n                                           (optionSelected)=\"selectionChanged($event) \"></atlas-dropdown-select>\r\n\r\n                    <atlas-dropdown-select fxFlex='40%'\r\n                                           label=\"Comparison\"\r\n                                           [fieldControl]=\"pnlComparisonSnapshotCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"comparisonSnapshotList\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\"></atlas-dropdown-select>\r\n\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-between end\"\r\n                     fxLayoutGap=\"15%\">\r\n                    <div class=\"view-realized-physicals-font\"\r\n                         fxFlex='40%'>View for Realized physicals </div>\r\n                    <atlas-dropdown-select-list fxFlex='40%'\r\n                                                [label]=\"'Company'\"\r\n                                                [fieldControl]=\"pnlcompanyCtrl\"\r\n                                                [(options)]=\"filteredCompany\"\r\n                                                [selectProperties]=\"companySelect\"\r\n                                                isEditable=true\r\n                                                (optionSelected)=\"companyOptionSelected($event)\"\r\n                                                multiselect=true>\r\n                    </atlas-dropdown-select-list>\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"space-between end\"\r\n                     fxLayoutGap=\"15%\">\r\n                    <div class=\"charterToggle\"\r\n                         fxFlex='40%'\r\n                         fxLayoutAlign=\"start start\">\r\n                        <mat-slide-toggle mat-raised-button\r\n                                          (change)=\"onToggleViewRealizedPhysicals()\">Charter\r\n                        </mat-slide-toggle>\r\n                    </div>\r\n                    <atlas-dropdown-select fxFlex='40%'\r\n                                           [label]=\"'Columns to be selected'\"\r\n                                           [options]=\"columnsList\"\r\n                                           [fieldControl]=\"columnstoSelectCtrl\"\r\n                                           isEditable=true\r\n                                           [selectProperties]=\"columnsListDisplayProperty\"\r\n                                           multiselect=true></atlas-dropdown-select>\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"start end\"\r\n                     class=\"view-realized-physicals-pnl\">\r\n                    <mat-slide-toggle fxFlex='40%'\r\n                                      mat-raised-button\r\n                                      (change)=\"onToggleIncludeDifferences()\">Include differences only\r\n                    </mat-slide-toggle>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n        <mat-card fxFlex=\"60\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>Report Criterias</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"5px\">\r\n                <atlas-report-criterias #reportCriterias></atlas-report-criterias>\r\n            </mat-card-content>\r\n        </mat-card>\r\n    </div>\r\n\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n\r\n        <button mat-raised-button\r\n                class=\"generate-report-button\"\r\n                (click)=\"onGenerateExcelButtonClicked()\">Detailed Excel View</button>\r\n    </div>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 [toBeDownloaded]=\"toBeDownloaded\"\r\n                                 #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.scss":
/*!**************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.scss ***!
  \**************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 0 !important; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.ts":
/*!************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.ts ***!
  \************************************************************************************************************************************/
/*! exports provided: PnlMovementReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PnlMovementReportComponent", function() { return PnlMovementReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_columns_list__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../shared/entities/columns.list */ "./Client/app/shared/entities/columns.list.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/reporting.service */ "./Client/app/shared/services/http-services/reporting.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../report-criterias/report-criterias.component */ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.ts");
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























var PnlMovementReportComponent = /** @class */ (function (_super) {
    __extends(PnlMovementReportComponent, _super);
    function PnlMovementReportComponent(freezeService, snackbarService, reportingService, formBuilder, route, dialog, companyManager, formConfigurationProvider, titleService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.freezeService = freezeService;
        _this.snackbarService = snackbarService;
        _this.reportingService = reportingService;
        _this.formBuilder = formBuilder;
        _this.route = route;
        _this.dialog = dialog;
        _this.companyManager = companyManager;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.titleService = titleService;
        _this.pnlSnapshotCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.pnlComparisonSnapshotCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.pnlcompanyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('companySelect');
        _this.columnstoSelectCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_12__["AtlasFormControl"]('columnsSelected');
        _this.companySelect = ['companyId'];
        _this.columnsListDisplayProperty = ['name'];
        _this.snapshotList = [];
        _this.comparisonSnapshotList = [];
        _this.currentSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_15__["FreezeDisplayView"](-1, 'CURRENT');
        _this.blankSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_15__["FreezeDisplayView"](0, '');
        _this.msg = '';
        _this.isDifference = false;
        _this.isViewRealizedPhysicals = false;
        _this.contractLimit = 500;
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_14__["MasterDataProps"].Companies,
        ];
        _this.companyList = [];
        _this.filteredCompany = [];
        _this.companiesSelectedList = [];
        _this.columnsList = [];
        _this.showError = false;
        _this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].reportServerLink;
        _this.reportPath = 'LDC Atlas/PnL/PnLMovementSummary';
        _this.reportPathForDownload = 'LDC Atlas/PnL/PnLMovementDetailDownload';
        _this.parameters = [];
        _this.toBeDownloaded = false;
        _this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        _this.company = _this.route.snapshot.paramMap.get('company');
        _this.columnsList = _shared_entities_columns_list__WEBPACK_IMPORTED_MODULE_13__["ColumnsList"].getColumnsList();
        return _this;
    }
    PnlMovementReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter(function (event) { return event.companyId !== _this.company; });
        this.pnlcompanyCtrl.patchValue(this.filteredCompany);
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.loadSnapshots();
    };
    PnlMovementReportComponent.prototype.getCompaniesList = function () {
        var options = this.companyManager.getLoadedCompanies();
        return options;
    };
    PnlMovementReportComponent.prototype.companyOptionSelected = function (companiesSelected) {
        var _this = this;
        if (companiesSelected) {
            this.companiesSelectedList = [];
            if (companiesSelected.length >= 1) {
                companiesSelected.forEach(function (company) { _this.companiesSelectedList.push(company['companyId']); });
                this.pnlComparisonSnapshotCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
            }
            else {
                this.pnlComparisonSnapshotCtrl.setValidators(null);
                this.pnlComparisonSnapshotCtrl.patchValue(null);
                this.companiesSelectedList.length = 0;
            }
            this.reportCriterias.getDataForSelectedCompanies(this.companiesSelectedList);
        }
    };
    PnlMovementReportComponent.prototype.initializeForm = function () {
        this.pnlMovementReportFormGroup = this.formBuilder.group({
            pnlSnapshotCtrl: this.pnlSnapshotCtrl,
            pnlComparisonSnapshotCtrl: this.pnlComparisonSnapshotCtrl,
            pnlcompanyCtrl: this.pnlcompanyCtrl,
            columnstoSelectCtrl: this.columnstoSelectCtrl,
        });
        this.setValidators();
        return this.pnlMovementReportFormGroup;
    };
    PnlMovementReportComponent.prototype.setValidators = function () {
        this.pnlSnapshotCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_11__["inDropdownListValidator"])(this.snapshotList, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_21__["nameof"])('dataVersionId')),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]));
    };
    PnlMovementReportComponent.prototype.loadSnapshots = function () {
        var _this = this;
        this.freezeService.getFreezeList().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (data) {
            return data.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_15__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate), freeze.freezeDate, freeze.dataVersionTypeId);
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$)).subscribe(function (snapshots) {
            _this.snapshotList = snapshots;
            if (snapshots.length > 0) {
                _this.pnlSnapshotCtrl.setValue(snapshots[0]);
            }
            _this.snapshotList.unshift(_this.currentSnapshot);
            _this.comparisonSnapshotList = _this.snapshotList
                .filter(function (p) { return (p.freezeDate !== 'CURRENT' && p.actualfreezeDate !== _this.snapshotList[1].actualfreezeDate); });
            _this.comparisonSnapshotList.push(_this.blankSnapshot);
            _this.initializeForm();
        });
    };
    PnlMovementReportComponent.prototype.selectionChanged = function (value) {
        if (value.dataVersionId === -1) {
            this.comparisonSnapshotList = this.snapshotList
                .filter(function (p) { return (p.freezeDate !== 'CURRENT'); });
            this.comparisonSnapshotList.push(this.blankSnapshot);
        }
        else {
            if (this.snapshotList.filter(function (p) { return (p.actualfreezeDate < value.actualfreezeDate); }).length > 0) {
                this.comparisonSnapshotList = this.snapshotList
                    .filter(function (p) { return (p.actualfreezeDate < value.actualfreezeDate); });
                this.comparisonSnapshotList.push(this.blankSnapshot);
            }
            else {
                this.comparisonSnapshotList = this.snapshotList
                    .filter(function (p) { return (p.actualfreezeDate < value.actualfreezeDate); });
            }
        }
    };
    PnlMovementReportComponent.prototype.onToggleIncludeDifferences = function () {
        this.isDifference = !this.isDifference;
    };
    PnlMovementReportComponent.prototype.onToggleViewRealizedPhysicals = function () {
        this.isViewRealizedPhysicals = !this.isViewRealizedPhysicals;
    };
    PnlMovementReportComponent.prototype.getReportCriterias = function () {
        var _this = this;
        var parameters = [];
        if (this.reportCriterias.profitCenterIds.length === 0) {
            this.parameters.push({ name: 'isAllProfitCenterSelected', value: 0 });
        }
        else if (!this.reportCriterias.profitCenterDropdownComponent.allSelected) {
            this.reportCriterias.profitCenterIds.forEach(function (id) {
                _this.parameters.push({ name: 'ProfitCenter', value: id });
            });
        }
        if (this.reportCriterias.selectedFilteredDepartments.length === 0) {
            this.parameters.push({ name: 'isAllDepartmentSelected', value: 0 });
        }
        else if (this.reportCriterias.selectedFilteredDepartments.length < this.reportCriterias.filteredDepartments.length) {
            this.reportCriterias.selectedFilteredDepartments.forEach(function (department) {
                _this.parameters.push({ name: 'Department', value: department.departmentId });
            });
        }
        if (this.reportCriterias.selectedFilteredContracts.length === 0) {
            this.parameters.push({ name: 'isAllContractNumberSelected', value: 0 });
        }
        else if (this.reportCriterias.selectedFilteredContracts.length < this.reportCriterias.filteredContracts.length) {
            this.reportCriterias.selectedFilteredContracts.forEach(function (contract) {
                _this.parameters.push({ name: 'ContractNumber', value: contract.sectionId });
            });
        }
        if (this.reportCriterias.charterIds.length === 0) {
            this.parameters.push({ name: 'isAllCharterSelected', value: 0 });
        }
        else if (!this.reportCriterias.charterDropdownComponent.allSelected) {
            this.reportCriterias.charterIds.forEach(function (id) {
                _this.parameters.push({ name: 'Charter', value: id });
            });
        }
        return parameters;
    };
    PnlMovementReportComponent.prototype.onGenerateReportButtonClicked = function () {
        var _this = this;
        if (this.validate()) {
            var freezeDate_1 = this.pnlSnapshotCtrl.value;
            var comparisonDBDate_1 = this.pnlComparisonSnapshotCtrl.value;
            if (this.companiesSelectedList.length > 0) {
                var snapshotId = (this.pnlSnapshotCtrl.value) ? this.pnlSnapshotCtrl.value.dataVersionId : -1;
                var comparisonDatabaseId = (this.pnlComparisonSnapshotCtrl.value) ?
                    this.pnlComparisonSnapshotCtrl.value.dataVersionId : -1;
                if (snapshotId !== -1 || comparisonDatabaseId !== -1) {
                    this.freezeService.checkFreezeForSelectedDatabase(this.companiesSelectedList, freezeDate_1['dataVersionTypeId'], freezeDate_1, comparisonDBDate_1['dataVersionTypeId'], comparisonDBDate_1).
                        subscribe(function (data) {
                        if (data) {
                            _this.missingCompanyList = [];
                            _this.showError = (data.missingCompany || data.comparisonMissingCompany) ? true : false;
                            if (data.missingCompany) {
                                _this.missingCompanyList.push(data.missingCompany);
                            }
                            if (data.comparisonMissingCompany) {
                                _this.missingCompanyList.push(data.comparisonMissingCompany);
                            }
                            if (!_this.showError && _this.missingCompanyList.length === 0) {
                                _this.CheckDataBaseForSelectedCompany(freezeDate_1, comparisonDBDate_1);
                                _this.onGenerateReportParameter();
                                _this.toBeDownloaded = false;
                                _this.ssrsReportViewer.generateReport(_this.reportServerUrl, _this.reportPath, _this.parameters);
                            }
                            else {
                                _this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                                    + _this.missingCompanyList + ' report cannot be generated');
                                _this.msg = '';
                                if (data.missingCompany) {
                                    _this.msg = 'Snapshot not present in ' + data.missingCompany;
                                }
                                if (data.comparisonMissingCompany) {
                                    _this.msg = (_this.msg) ?
                                        _this.msg + ' and Comparison db not present in ' + data.comparisonMissingCompany :
                                        'Comparison db not present in ' + data.comparisonMissingCompany;
                                }
                                _this.snackbarService.throwErrorSnackBar(_this.msg);
                            }
                        }
                    });
                }
            }
            else {
                this.CheckDataBaseForSelectedCompany(freezeDate_1, comparisonDBDate_1);
                this.onGenerateReportParameter();
                this.toBeDownloaded = false;
                this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
            }
        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
        }
    };
    PnlMovementReportComponent.prototype.CheckDataBaseForSelectedCompany = function (freezeDate, comparisonDBDate) {
        var _this = this;
        var snapshotId = (this.pnlSnapshotCtrl.value) ? this.pnlSnapshotCtrl.value.dataVersionId : -1;
        var dataVersionIdList = [];
        var compdataVersionIdList = [];
        if (comparisonDBDate && comparisonDBDate['dataVersionTypeId']) {
            compdataVersionIdList.push(comparisonDBDate['dataVersionId']);
        }
        if (snapshotId !== -1) {
            if (freezeDate) {
                dataVersionIdList.push(freezeDate['dataVersionId']);
            }
            this.freezeService.getFreezeForSelectedCompany(this.companiesSelectedList, freezeDate['dataVersionTypeId'], freezeDate).
                subscribe(function (freezeDatas) {
                if (freezeDatas && freezeDatas.length > 0) {
                    freezeDatas.forEach(function (freezeData) { dataVersionIdList.push(freezeData['dataVersionId']); });
                    _this.freezeService.getFreezeForSelectedCompany(_this.companiesSelectedList, comparisonDBDate['dataVersionTypeId'], comparisonDBDate).
                        subscribe(function (compFreezeDatas) {
                        if (compFreezeDatas && compFreezeDatas.length > 0) {
                            compFreezeDatas.forEach(function (compFreezeData) {
                                compdataVersionIdList.push(compFreezeData['dataVersionId']);
                            });
                        }
                        else {
                            _this.getPnlMovementSummaryMessage(dataVersionIdList, compdataVersionIdList);
                        }
                    });
                }
                else {
                    _this.getPnlMovementSummaryMessage(dataVersionIdList, compdataVersionIdList);
                }
            });
        }
        else {
            if (comparisonDBDate && comparisonDBDate['dataVersionTypeId']) {
                this.freezeService.getFreezeForSelectedCompany(this.companiesSelectedList, comparisonDBDate['dataVersionTypeId'], comparisonDBDate).
                    subscribe(function (compFreezeDatas) {
                    if (compFreezeDatas && compFreezeDatas.length > 0) {
                        compFreezeDatas.forEach(function (compFreezeData) {
                            compdataVersionIdList.push(compFreezeData['dataVersionId']);
                        });
                        _this.getPnlMovementSummaryMessage(dataVersionIdList, compdataVersionIdList);
                    }
                });
            }
        }
    };
    PnlMovementReportComponent.prototype.getPnlMovementSummaryMessage = function (dataVersionIdList, compdataVersionIdList) {
        var _this = this;
        this.reportingService.getPnlMovementSummaryMessage(this.companiesSelectedList, dataVersionIdList, compdataVersionIdList).
            subscribe(function (message) {
            if (message !== null) {
                var openValidationDialog = _this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_9__["ConfirmationDialogComponent"], {
                    data: {
                        title: 'Warning',
                        text: message,
                        okButton: 'OK',
                        cancelButton: 'Cancel',
                    },
                });
                openValidationDialog.afterClosed().subscribe(function (answer) {
                    if (answer) {
                        _this.onGenerateReportParameter();
                        _this.toBeDownloaded = false;
                        _this.ssrsReportViewer.generateReport(_this.reportServerUrl, _this.reportPath, _this.parameters);
                    }
                });
            }
            else {
                _this.onGenerateReportParameter();
                _this.toBeDownloaded = false;
                _this.ssrsReportViewer.generateReport(_this.reportServerUrl, _this.reportPath, _this.parameters);
            }
        });
    };
    PnlMovementReportComponent.prototype.onGenerateExcelButtonClicked = function () {
        if (this.validate()) {
            this.onGenerateReportParameter();
            this.toBeDownloaded = true;
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPathForDownload, this.parameters);
        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
        }
    };
    PnlMovementReportComponent.prototype.onGenerateReportParameter = function () {
        var _this = this;
        var comparisonSnapshotId;
        {
            var snapshotId = this.pnlSnapshotCtrl.value.dataVersionId;
            if (this.pnlComparisonSnapshotCtrl.value) {
                comparisonSnapshotId = this.pnlComparisonSnapshotCtrl.value.dataVersionId;
            }
            var isIncludeDifferences = this.isDifference ? 1 : 0;
            var viewCharter = this.isViewRealizedPhysicals ? 'C' : 'N';
            var companiesList = this.pnlcompanyCtrl.value.map(function (status) { return status.companyId; });
            this.parameters = [
                { name: 'IncludeDifferenceOnly', value: isIncludeDifferences },
                { name: 'View', value: viewCharter },
            ];
            this.parameters = this.parameters.concat(this.getReportCriterias());
            if (snapshotId !== -1) {
                this.parameters.push({ name: 'Database', value: snapshotId });
            }
            if (comparisonSnapshotId && comparisonSnapshotId > 0) {
                this.parameters.push({ name: 'CompDatabase', value: comparisonSnapshotId });
            }
            if (this.columnstoSelectCtrl.value) {
                var columnsListIds = this.columnstoSelectCtrl.value.map(function (columns) { return columns.value; });
                columnsListIds.forEach(function (id) {
                    _this.parameters.push({ name: 'ColumnsTobeSelected', value: id });
                });
            }
            if (companiesList.length === 0) {
                this.parameters.push({ name: 'Company', value: this.company });
            }
            else {
                companiesList.push(this.company);
                companiesList.forEach(function (name) {
                    _this.parameters.push({ name: 'Company', value: name });
                });
            }
            this.parameters.push({ name: 'UserLoginCompany', value: this.company });
        }
    };
    PnlMovementReportComponent.prototype.isContractLimitReached = function () {
        if (this.reportCriterias.filteredContracts.length > this.contractLimit &&
            !this.reportCriterias.contractDropdownComponent.allSelected) {
            var confirmDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_9__["ConfirmationDialogComponent"], {
                data: {
                    title: 'Limit has been reached',
                    text: "You cannot select more than " + this.contractLimit + " contracts.",
                    okButton: 'Got it',
                },
            });
            return false;
        }
        return true;
    };
    PnlMovementReportComponent.prototype.validate = function () {
        var isValid = true;
        if (!this.pnlSnapshotCtrl.value) {
            isValid = false;
        }
        if (this.companiesSelectedList.length !== 0) {
            var comparisonDBDate = this.pnlComparisonSnapshotCtrl.value;
            isValid = (comparisonDBDate && comparisonDBDate['dataVersionTypeId']) ? true : false;
        }
        else {
            isValid = true;
        }
        return isValid;
    };
    PnlMovementReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_10__["SSRSReportViewerComponent"])
    ], PnlMovementReportComponent.prototype, "ssrsReportViewer", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('reportCriterias'),
        __metadata("design:type", _report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_22__["ReportCriteriasComponent"])
    ], PnlMovementReportComponent.prototype, "reportCriterias", void 0);
    PnlMovementReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-pnl-movement-report',
            template: __webpack_require__(/*! ./pnl-movement-report.component.html */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.html"),
            styles: [__webpack_require__(/*! ./pnl-movement-report.component.scss */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_17__["FreezeService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_19__["SnackbarService"],
            _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_18__["ReportingService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_7__["CompanyManagerService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__["FormConfigurationProviderService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_20__["TitleService"]])
    ], PnlMovementReportComponent);
    return PnlMovementReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.html":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.html ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"space-between stretch\"\r\n         fxLayoutAlign.lt-md=\"space-around center\">\r\n\r\n        <mat-card class=\"database-selection\"\r\n                  fxFlex=\"35\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    Database Selection\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"5px\">\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left start\"\r\n                     fxLayoutGap=\"8px\">\r\n                    <atlas-dropdown-select fxFlex='50'\r\n                                           [label]=\"'Snapshot'\"\r\n                                           [fieldControl]=\"pnlSnapshotCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"snapshotList\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\"></atlas-dropdown-select>\r\n                    <atlas-dropdown-select-list fxFlex='50'\r\n                                                [label]=\"'Company'\"\r\n                                                [fieldControl]=\"pnlcompanyCtrl\"\r\n                                                [(options)]=\"filteredCompany\"\r\n                                                [selectProperties]=\"companySelect\"\r\n                                                isEditable=true\r\n                                                (optionSelected)=\"onCompanySelected($event)\"\r\n                                                multiselect=true>\r\n                    </atlas-dropdown-select-list>\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left start\"\r\n                     fxLayoutGap=\"8px\">\r\n                    <div fxFlex='50'\r\n                         class=\"view-realized-physicals-font\">View for Realized physicals </div>\r\n                    <atlas-dropdown-select fxFlex='50'\r\n                                           [label]=\"'Columns to be selected'\"\r\n                                           [options]=\"columnsList\"\r\n                                           [fieldControl]=\"columnstoSelectCtrl\"\r\n                                           isEditable=true\r\n                                           [selectProperties]=\"columnsListDisplayProperty\"\r\n                                           multiselect=true></atlas-dropdown-select>\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left start\"\r\n                     fxLayoutGap=\"8px\">\r\n                    <mat-slide-toggle fxFlex='50'\r\n                                      fxLayoutAlign=\"left start\"\r\n                                      mat-raised-button\r\n                                      (change)=\"onToggleViewRealizedPhysicals()\">Charter\r\n                    </mat-slide-toggle>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n\r\n\r\n        <mat-card fxFlex=\"60\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    Report Criterias\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"5px\">\r\n                <atlas-report-criterias #reportCriterias></atlas-report-criterias>\r\n            </mat-card-content>\r\n        </mat-card>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n        <button mat-raised-button\r\n                class=\"generate-report-button\"\r\n                (click)=\"onGenerateExcelButtonClicked()\">Detailed Excel View</button>\r\n    </div>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 [toBeDownloaded]=\"toBeDownloaded\"\r\n                                 #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.scss":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.scss ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 0 !important; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.ts":
/*!******************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.ts ***!
  \******************************************************************************************************************/
/*! exports provided: PnlReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PnlReportComponent", function() { return PnlReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_columns_list__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../shared/entities/columns.list */ "./Client/app/shared/entities/columns.list.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../report-criterias/report-criterias.component */ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.ts");
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




















var PnlReportComponent = /** @class */ (function (_super) {
    __extends(PnlReportComponent, _super);
    function PnlReportComponent(freezeService, snackbarService, formBuilder, route, companyManager, formConfigurationProvider, titleService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.freezeService = freezeService;
        _this.snackbarService = snackbarService;
        _this.formBuilder = formBuilder;
        _this.route = route;
        _this.companyManager = companyManager;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.titleService = titleService;
        _this.pnlSnapshotCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.pnlcompanyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('companySelect');
        _this.columnstoSelectCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_10__["AtlasFormControl"]('columnsSelected');
        _this.companySelect = ['companyId'];
        _this.columnsListDisplayProperty = ['name'];
        _this.snapshotList = [];
        _this.currentSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_13__["FreezeDisplayView"](-1, 'CURRENT');
        _this.parameters = [];
        _this.toBeDownloaded = false;
        _this.isViewRealizedPhysicals = false;
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_12__["MasterDataProps"].Companies,
        ];
        _this.companyList = [];
        _this.filteredCompany = [];
        _this.selectedCompanies = [];
        _this.columnsList = [];
        _this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].reportServerLink;
        _this.reportPath = 'LDC Atlas/PnL/PnL_Summary';
        _this.reportPathForDownload = 'LDC Atlas/PnL/PnL_Detail_Excel';
        _this.showError = false;
        _this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        _this.company = _this.route.snapshot.paramMap.get('company');
        _this.columnsList = _shared_entities_columns_list__WEBPACK_IMPORTED_MODULE_11__["ColumnsList"].getColumnsList();
        return _this;
    }
    PnlReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter(function (event) { return event.companyId !== _this.company; });
        this.pnlcompanyCtrl.patchValue(this.filteredCompany);
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.loadSnapshots();
    };
    PnlReportComponent.prototype.getCompaniesList = function () {
        var options = this.companyManager.getLoadedCompanies();
        return options;
    };
    // will be implemented when the db changes for company list is done .
    PnlReportComponent.prototype.onCompanySelected = function (data) {
        var _this = this;
        if (data) {
            this.selectedCompanies = [];
            if (data.length > 0) {
                data.forEach(function (company) { _this.selectedCompanies.push(company['companyId']); });
            }
            this.reportCriterias.getDataForSelectedCompanies(this.selectedCompanies);
        }
    };
    PnlReportComponent.prototype.initializeForm = function () {
        this.pnlReportFormGroup = this.formBuilder.group({
            pnlSnapshotCtrl: this.pnlSnapshotCtrl,
            pnlcompanyCtrl: this.pnlcompanyCtrl,
            columnstoSelectCtrl: this.columnstoSelectCtrl,
        });
        this.setValidators();
        return this.pnlReportFormGroup;
    };
    PnlReportComponent.prototype.setValidators = function () {
        this.pnlSnapshotCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_9__["inDropdownListValidator"])(this.snapshotList, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__["nameof"])('dataVersionId')),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]));
    };
    PnlReportComponent.prototype.loadSnapshots = function () {
        var _this = this;
        this.freezeService.getFreezeList().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) {
            return data.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_13__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate), freeze.freezeDate, freeze.dataVersionTypeId);
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (snapshots) {
            _this.snapshotList = snapshots;
            if (snapshots.length > 0) {
                _this.pnlSnapshotCtrl.setValue(snapshots[0]);
            }
            _this.snapshotList.unshift(_this.currentSnapshot);
            _this.initializeForm();
        });
    };
    PnlReportComponent.prototype.onToggleViewRealizedPhysicals = function () {
        this.isViewRealizedPhysicals = !this.isViewRealizedPhysicals;
    };
    PnlReportComponent.prototype.getReportCriterias = function () {
        var _this = this;
        var parameters = [];
        if (this.reportCriterias.profitCenterIds.length === 0) {
            this.parameters.push({ name: 'isAllProfitCenterSelected', value: 0 });
        }
        else if (!this.reportCriterias.profitCenterDropdownComponent.allSelected) {
            this.reportCriterias.profitCenterIds.forEach(function (id) {
                _this.parameters.push({ name: 'Profit_Center', value: id });
            });
        }
        if (this.reportCriterias.selectedFilteredDepartments.length === 0) {
            this.parameters.push({ name: 'isAllDepartmentSelected', value: 0 });
        }
        else if (this.reportCriterias.selectedFilteredDepartments.length < this.reportCriterias.filteredDepartments.length) {
            this.reportCriterias.selectedFilteredDepartments.forEach(function (department) {
                _this.parameters.push({ name: 'Department', value: department.departmentId });
            });
        }
        if (this.reportCriterias.selectedFilteredContracts.length === 0) {
            this.parameters.push({ name: 'isAllContractNumberSelected', value: 0 });
        }
        else if (this.reportCriterias.selectedFilteredContracts.length < this.reportCriterias.filteredContracts.length) {
            this.reportCriterias.selectedFilteredContracts.forEach(function (contract) {
                _this.parameters.push({ name: 'Contract_Number', value: contract.sectionId });
            });
        }
        if (this.reportCriterias.charterIds.length === 0) {
            this.parameters.push({ name: 'isAllCharterSelected', value: 0 });
        }
        else if (!this.reportCriterias.charterDropdownComponent.allSelected) {
            this.reportCriterias.charterIds.forEach(function (id) {
                _this.parameters.push({ name: 'CharterId', value: id });
            });
        }
        return parameters;
    };
    PnlReportComponent.prototype.onGenerateReportButtonClicked = function () {
        var _this = this;
        var snapshotId = this.pnlSnapshotCtrl.value.dataVersionId;
        if (snapshotId !== -1 && this.selectedCompanies.length > 0) {
            var freezeDate = this.pnlSnapshotCtrl.value;
            this.freezeService.checkFreezeForSelectedDatabase(this.selectedCompanies, freezeDate['dataVersionTypeId'], freezeDate, null, null).subscribe(function (data) {
                if (data) {
                    var missingCompanyList = void 0;
                    if (data.missingCompany) {
                        _this.showError = true;
                        missingCompanyList = data.missingCompany;
                    }
                    else {
                        _this.showError = false;
                    }
                    if (!_this.showError) {
                        _this.onGenerateReportParameter();
                        _this.toBeDownloaded = false;
                        _this.ssrsReportViewer.generateReport(_this.reportServerUrl, _this.reportPath, _this.parameters);
                    }
                    else {
                        _this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                            + missingCompanyList + ' report cannot be generated');
                    }
                }
            });
        }
        else {
            this.onGenerateReportParameter();
            this.toBeDownloaded = false;
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
        }
    };
    PnlReportComponent.prototype.onGenerateExcelButtonClicked = function () {
        this.onGenerateReportParameter();
        this.toBeDownloaded = true;
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPathForDownload, this.parameters);
    };
    PnlReportComponent.prototype.onGenerateReportParameter = function () {
        var _this = this;
        var snapshotId = this.pnlSnapshotCtrl.value.dataVersionId;
        var viewCharter = this.isViewRealizedPhysicals ? 'C' : 'N';
        var companiesList = this.pnlcompanyCtrl.value.map(function (status) { return status.companyId; });
        this.parameters = [
            { name: 'View', value: viewCharter },
        ];
        this.parameters = this.parameters.concat(this.getReportCriterias());
        if (snapshotId !== -1) {
            this.parameters.push({ name: 'LeftDataVersion', value: snapshotId });
        }
        if (this.columnstoSelectCtrl.value) {
            var columnsListIds = this.columnstoSelectCtrl.value.map(function (columns) { return columns.value; });
            columnsListIds.forEach(function (id) {
                _this.parameters.push({ name: 'ColumnsTobeSelected', value: id });
            });
        }
        if (companiesList.length === 0) {
            this.parameters.push({ name: 'CompanyId', value: this.company });
        }
        else {
            companiesList.push(this.company);
            companiesList.forEach(function (name) {
                _this.parameters.push({ name: 'CompanyId', value: name });
            });
        }
        this.parameters.push({ name: 'UserLoginCompany', value: this.company });
    };
    PnlReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_8__["SSRSReportViewerComponent"])
    ], PnlReportComponent.prototype, "ssrsReportViewer", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('reportCriterias'),
        __metadata("design:type", _report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_19__["ReportCriteriasComponent"])
    ], PnlReportComponent.prototype, "reportCriterias", void 0);
    PnlReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-pnl-report',
            template: __webpack_require__(/*! ./pnl-report.component.html */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.html"),
            styles: [__webpack_require__(/*! ./pnl-report.component.scss */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_15__["FreezeService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_16__["SnackbarService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_14__["FormConfigurationProviderService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_17__["TitleService"]])
    ], PnlReportComponent);
    return PnlReportComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_7__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.html":
/*!**********************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.html ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div matToolbarHighlight\r\n     class=\"dark-tab header-tab mat-elevation-z6\">\r\n    <div *ifAuthorized=\"'Reports.PLReport',company:this.company\"\r\n         class=\"header-tab-container\">\r\n        <mat-tab-group dynamicHeight\r\n                       (selectedTabChange)=\"getPosition($event)\"\r\n                       [(selectedIndex)]=selectedTab\r\n                       class=\"bright-tab\">\r\n            <mat-tab label=\"P&L\">\r\n                <atlas-pnl-report #pnlReportComponent>\r\n                </atlas-pnl-report>\r\n            </mat-tab>\r\n            <mat-tab label=\"P&L MOVEMENT\">\r\n                <atlas-pnl-movement-report #pnlMovementReportComponent>\r\n                </atlas-pnl-movement-report>\r\n            </mat-tab>\r\n            <mat-tab label=\"MANUAL ADJUSTMENT\">\r\n                <atlas-ldrep-manual-adjustment-report #ldrepManualAdjustmentReportComponent>\r\n                </atlas-ldrep-manual-adjustment-report>\r\n            </mat-tab>\r\n        </mat-tab-group>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.scss":
/*!**********************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.scss ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".dark-tab .mat-tab-group,\n.dark-tab .mat-tab-nav-bar {\n  width: 100%; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.ts":
/*!********************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.ts ***!
  \********************************************************************************************************/
/*! exports provided: PnlReportsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PnlReportsComponent", function() { return PnlReportsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ldrep_manual_adjustment_report_ldrep_manual_adjustment_report_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.ts");
/* harmony import */ var _pnl_movement_report_pnl_movement_report_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pnl-movement-report/pnl-movement-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.ts");
/* harmony import */ var _pnl_report_pnl_report_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pnl-report/pnl-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PnlReportsComponent = /** @class */ (function () {
    function PnlReportsComponent(route) {
        this.route = route;
        this.selectedTab = 0;
    }
    PnlReportsComponent.prototype.ngOnInit = function () {
        this.company = this.route.snapshot.paramMap.get('company');
    };
    PnlReportsComponent.prototype.getPosition = function (event) {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('pnlReportComponent'),
        __metadata("design:type", _pnl_report_pnl_report_component__WEBPACK_IMPORTED_MODULE_3__["PnlReportComponent"])
    ], PnlReportsComponent.prototype, "pnlReportComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('pnlMovementReportComponent'),
        __metadata("design:type", _pnl_movement_report_pnl_movement_report_component__WEBPACK_IMPORTED_MODULE_2__["PnlMovementReportComponent"])
    ], PnlReportsComponent.prototype, "pnlMovementReportComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ldrepManualAdjustmentReportComponent'),
        __metadata("design:type", _ldrep_manual_adjustment_report_ldrep_manual_adjustment_report_component__WEBPACK_IMPORTED_MODULE_1__["LdrepManualAdjustmentReportComponent"])
    ], PnlReportsComponent.prototype, "ldrepManualAdjustmentReportComponent", void 0);
    PnlReportsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-pnl-reports',
            template: __webpack_require__(/*! ./pnl-reports.component.html */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.html"),
            styles: [__webpack_require__(/*! ./pnl-reports.component.scss */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]])
    ], PnlReportsComponent);
    return PnlReportsComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.html":
/*!**********************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.html ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayoutAlign=\"space-between center\">\r\n    <div></div>\r\n    <button mat-button>\r\n        <mat-icon (click)=\"onCloseButtonClicked()\">close</mat-icon>\r\n    </button>\r\n</div>\r\n<div fxLayout=\"row wrap\"\r\n     fxLayoutAlign=\"space-between stretch\"\r\n     fxLayoutAlign.lt-md=\"space-around center\">{{message}}</div>\r\n<div fxLayoutAlign=\"space-between center\">\r\n    <div></div>\r\n    <button mat-button\r\n            (click)=\"onOkButtonClicked()\">OK\r\n    </button>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.scss":
/*!**********************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.scss ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.ts":
/*!********************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.ts ***!
  \********************************************************************************************************************************/
/*! exports provided: ValidationDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValidationDialogComponent", function() { return ValidationDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var ValidationDialogComponent = /** @class */ (function () {
    function ValidationDialogComponent(thisDialogRef, data) {
        this.thisDialogRef = thisDialogRef;
        this.data = data;
        this.dialogData = data;
    }
    ValidationDialogComponent.prototype.ngOnInit = function () {
        this.message = this.dialogData.message;
    };
    ValidationDialogComponent.prototype.onCloseButtonClicked = function () {
        this.thisDialogRef.close(false);
    };
    ValidationDialogComponent.prototype.onOkButtonClicked = function () {
        this.thisDialogRef.close(true);
    };
    ValidationDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-validation-dialog',
            template: __webpack_require__(/*! ./validation-dialog.component.html */ "./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.html"),
            styles: [__webpack_require__(/*! ./validation-dialog.component.scss */ "./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.scss")],
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], ValidationDialogComponent);
    return ValidationDialogComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.html":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.html ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [formGroup]=\"reportCriteriaFormGroup\"\r\n     fxLayout=\"column\"\r\n     fxLayoutGap=\"1%\">\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"left start\"\r\n         fxLayoutGap=\"5%\">\r\n        <div fxFlex=\"50%\">\r\n            <atlas-contextual-search-multiple-autocomplete-select #profitCenterDropdownComponent\r\n                                                                  [options]=\"profitCenters\"\r\n                                                                  [selectedOptions]=\"[]\"\r\n                                                                  [allOptionsElement]=\"profitCenterAllOptions\"\r\n                                                                  [allSelected]=\"allProfitCentersSelected\"\r\n                                                                  displayCode=\"true\"\r\n                                                                  valueProperty=\"profitCenterId\"\r\n                                                                  codeProperty=\"profitCenterCode\"\r\n                                                                  displayProperty=\"description\"\r\n                                                                  placeholder=\"Profit Centers\"\r\n                                                                  placeholderFilter=\"Profit Center\"\r\n                                                                  elementName=\"Profit Center\"\r\n                                                                  (selectionChangedEvent)=\"onprofitSelectionChanged($event)\">\r\n            </atlas-contextual-search-multiple-autocomplete-select>\r\n        </div>\r\n        <div fxFlex=\"50%\">\r\n            <atlas-contextual-search-multiple-autocomplete-select #charterDropdownComponent\r\n                                                                  [options]=\"filteredCharters\"\r\n                                                                  [selectedOptions]=\"[]\"\r\n                                                                  [allOptionsElement]=\"charterAllOptions\"\r\n                                                                  [allSelected]=\"allChartersSelected\"\r\n                                                                  displayCode=\"true\"\r\n                                                                  valueProperty=\"charterId\"\r\n                                                                  displayProperty=\"description\"\r\n                                                                  codeProperty=\"charterCode\"\r\n                                                                  placeholder=\"Charters\"\r\n                                                                  placeholderFilter=\"Charter\"\r\n                                                                  elementName=\"Charter\"\r\n                                                                  (selectionChangedEvent)=\"onCharterSelectionChanged($event)\">\r\n            </atlas-contextual-search-multiple-autocomplete-select>\r\n        </div>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"left start\"\r\n         fxLayoutGap=\"5%\">\r\n        <div fxFlex=\"50%\">\r\n            <atlas-contextual-search-multiple-autocomplete-select #departmentDropdownComponent\r\n                                                                  [options]=\"filteredDepartments\"\r\n                                                                  [selectedOptions]=\"[]\"\r\n                                                                  [allOptionsElement]=\"departmentAllOptions\"\r\n                                                                  [allSelected]=\"allDepartmentsSelected\"\r\n                                                                  displayCode=\"true\"\r\n                                                                  valueProperty=\"departmentId\"\r\n                                                                  codeProperty=\"departmentCode\"\r\n                                                                  displayProperty=\"description\"\r\n                                                                  placeholder=\"Departments\"\r\n                                                                  placeholderFilter=\"Department\"\r\n                                                                  elementName=\"Department\"\r\n                                                                  (selectionChangedEvent)=\"onDepartmentSelectionChanged($event)\">\r\n            </atlas-contextual-search-multiple-autocomplete-select>\r\n        </div>\r\n        <div fxFlex=\"50%\">\r\n            <atlas-contextual-search-multiple-autocomplete-select #contractDropdownComponent\r\n                                                                  [options]=\"filteredContracts\"\r\n                                                                  [selectedOptions]=\"[]\"\r\n                                                                  [allOptionsElement]=\"contractAllOptions\"\r\n                                                                  [allSelected]=\"allContractSelected\"\r\n                                                                  displayCode=\"true\"\r\n                                                                  valueProperty=\"sectionId\"\r\n                                                                  codeProperty=\"contractLabel\"\r\n                                                                  placeholder=\"Contracts\"\r\n                                                                  placeholderFilter=\"Contract Label\"\r\n                                                                  elementName='Contract'\r\n                                                                  (selectionChangedEvent)=\"onContractSelectionChanged($event)\">\r\n            </atlas-contextual-search-multiple-autocomplete-select>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.scss":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.scss ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.ts":
/*!******************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.ts ***!
  \******************************************************************************************************************/
/*! exports provided: ReportCriteriasComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportCriteriasComponent", function() { return ReportCriteriasComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/services/http-services/execution.service */ "./Client/app/shared/services/http-services/execution.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_http_services_trading_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/services/http-services/trading.service */ "./Client/app/shared/services/http-services/trading.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component */ "./Client/app/shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component.ts");
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
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};













var ReportCriteriasComponent = /** @class */ (function (_super) {
    __extends(ReportCriteriasComponent, _super);
    function ReportCriteriasComponent(formBuilder, utilService, executionService, masterdataService, tradingService, route, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.utilService = utilService;
        _this.executionService = executionService;
        _this.masterdataService = masterdataService;
        _this.tradingService = tradingService;
        _this.route = route;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.contractCodeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        _this.charterCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('charterCodeCriteria');
        _this.filteredContracts = [];
        _this.filteredCharters = [];
        _this.charters = [];
        _this.contracts = [];
        _this.departments = [];
        _this.filteredDepartments = [];
        _this.selectedFilteredDepartments = [];
        _this.profitCenterIds = [];
        _this.charterIds = [];
        _this.charterDisplayProperty = ['name'];
        _this.profitCenters = [];
        _this.contractAllOptions = {
            contractLabel: 'All',
            sectionId: 0,
        };
        _this.allContractSelected = true;
        _this.departmentAllOptions = {
            departmentCode: 'All',
            departmentId: 0,
        };
        _this.allDepartmentsSelected = true;
        _this.charterAllOptions = {
            charterCode: 'All',
            charterId: 0,
        };
        _this.allChartersSelected = true;
        _this.profitCenterAllOptions = {
            profitCenterCode: 'All',
            profitCenterId: 0,
        };
        _this.allProfitCentersSelected = true;
        _this.iscompanySelected = false;
        return _this;
    }
    ReportCriteriasComponent.prototype.ngOnInit = function () {
        this.initializeForm();
        this.company = this.route.snapshot.paramMap.get('company');
        this.initContracts();
        this.initCharters();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.departments = this.masterdata.departments;
        this.initProfitCenters();
    };
    ReportCriteriasComponent.prototype.initContracts = function () {
        var _this = this;
        this.tradingService.getAll()
            .subscribe(function (contracts) {
            _this.contracts = contracts.value;
            _this.onDepartmentSelectionChanged(_this.filteredDepartments);
        });
    };
    ReportCriteriasComponent.prototype.initProfitCenters = function () {
        var _this = this;
        this.profitCenters = this.route.snapshot.data.masterdata.profitCenters.map(function (X) { return (__assign({}, X)); });
        this.profitCenters = this.profitCenters.map(function (profitCenter) {
            profitCenter.profitCenterCode = _this.company + ' - ' + profitCenter.profitCenterCode;
            return profitCenter;
        });
        this.profitCenterDropdownComponent.options = this.profitCenters;
        this.profitCenterDropdownComponent.optionsChanged();
        this.onprofitSelectionChanged(this.profitCenters);
    };
    ReportCriteriasComponent.prototype.onprofitSelectionChanged = function (profitCenters) {
        var _this = this;
        if (profitCenters) {
            this.profitCenterIds = profitCenters.map(function (profitCenter) { return profitCenter.profitCenterId; });
            if (this.departments.length > 0) {
                this.filteredDepartments = this.departments.map(function (X) { return (__assign({}, X)); });
                this.filteredDepartments = this.filteredDepartments.filter(function (department) {
                    return _this.profitCenterIds.includes(department.profitCenterId);
                });
                this.filteredDepartments = this.filteredDepartments.map(function (department) {
                    department.departmentCode = department.companyCode + ' - ' + department.departmentCode;
                    return department;
                });
                this.departmentDropdownComponent.options = this.filteredDepartments;
                this.departmentDropdownComponent.optionsChanged();
            }
        }
    };
    ReportCriteriasComponent.prototype.initCharters = function () {
        var _this = this;
        this.charterIds = [];
        this.executionService.getCharters()
            .subscribe(function (charters) {
            var e_1, _a;
            _this.charters = charters.value;
            try {
                for (var _b = __values(_this.charters), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var charter = _c.value;
                    _this.charterIds.push(charter['charterId']);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            _this.charters = _this.charters.map(function (charter) {
                charter.charterCode = _this.company + ' - ' + charter.charterCode;
                return charter;
            });
            _this.charterDropdownComponent.options = _this.charters;
            _this.charterDropdownComponent.optionsChanged();
        });
    };
    ReportCriteriasComponent.prototype.onDepartmentSelectionChanged = function (departments) {
        this.selectedFilteredDepartments = departments ? departments : [];
        if (departments && !this.iscompanySelected) {
            var departmentsIds_1 = departments.map(function (departmentList) { return departmentList.departmentId; });
            var filteredDepartments = this.masterdata.departments.filter(function (department) {
                return departmentsIds_1.includes(department.departmentId);
            });
            var selectedDepartments_1 = filteredDepartments.map(function (department) { return department.departmentCode; });
            this.filteredContracts = this.contracts.filter(function (contract) {
                return selectedDepartments_1.includes(contract.departmentCode);
            });
            this.contractDropdownComponent.options = this.filteredContracts;
            this.contractDropdownComponent.optionsChanged();
        }
    };
    ReportCriteriasComponent.prototype.onContractSelectionChanged = function (contracts) {
        this.selectedFilteredContracts = contracts ? contracts : [];
    };
    ReportCriteriasComponent.prototype.getDataForSelectedCompanies = function (selectedCompanies) {
        var _this = this;
        this.charterIds = [];
        this.iscompanySelected = selectedCompanies.length > 0 ? true : false;
        this.subscriptions.push(Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])([
            this.masterdataService.getProfitCenterForSelectedCompanyId(selectedCompanies).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (profitCenters) {
                return profitCenters.value;
            })),
            this.masterdataService.getDepartmentsForSelectedCompanyId('', null, selectedCompanies).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (departments) {
                return departments.value;
            })),
            this.executionService.getChartersForCompanies(selectedCompanies).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (charters) {
                return charters.value;
            }))
        ])
            .subscribe(function (result) {
            var e_2, _a;
            _this.profitCenters = result[0];
            _this.departments = result[1];
            _this.charters = result[2];
            _this.profitCenters = _this.profitCenters.map(function (profitCenter) {
                profitCenter.profitCenterCode = profitCenter.companyCode + ' - ' + profitCenter.profitCenterCode;
                return profitCenter;
            });
            _this.profitCenterDropdownComponent.options = _this.profitCenters;
            _this.profitCenterDropdownComponent.optionsChanged();
            _this.onprofitSelectionChanged(_this.profitCenters);
            try {
                for (var _b = __values(_this.charters), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var charter = _c.value;
                    _this.charterIds.push(charter['charterId']);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            _this.charters = _this.charters.map(function (charter) {
                charter.charterCode = charter.company + ' - ' + charter.charterCode;
                return charter;
            });
            _this.charterDropdownComponent.options = _this.charters;
            _this.charterDropdownComponent.optionsChanged();
            if (_this.iscompanySelected) {
                _this.contractDropdownComponent.fieldControl.disable();
            }
            else {
                _this.contractDropdownComponent.fieldControl.enable();
            }
        }));
    };
    ReportCriteriasComponent.prototype.onCharterSelectionChanged = function (charters) {
        if (charters) {
            this.charterIds = charters.map(function (charter) { return charter.charterId; });
        }
    };
    ReportCriteriasComponent.prototype.initializeForm = function () {
        this.reportCriteriaFormGroup = this.formBuilder.group({
            contractCodeCtrl: this.contractCodeCtrl,
            charterCodeCtrl: this.charterCodeCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    ReportCriteriasComponent.prototype.getReportCriterias = function (params, profitCenterParam, departmentParam, contractNumberParam, charterParam) {
        if (profitCenterParam === void 0) { profitCenterParam = 'RP_LDC_LDREP_PL_Profit_Center'; }
        if (departmentParam === void 0) { departmentParam = 'RP_LDC_LDREP_PL_Department'; }
        if (contractNumberParam === void 0) { contractNumberParam = 'RP_LDC_LDREP_PL_Contract_Number'; }
        if (charterParam === void 0) { charterParam = 'RP_LDC_LDREP_PL_CharterId'; }
        if (this.profitCenterIds.length === 0) {
            params.push({ name: 'isAllProfitCenterSelected', value: 0 });
        }
        else if (!this.profitCenterDropdownComponent.allSelected) {
            this.profitCenterIds.forEach(function (id) {
                params.push({ name: profitCenterParam, value: id });
            });
        }
        if (this.selectedFilteredDepartments.length === 0) {
            params.push({ name: 'isAllDepartmentSelected', value: 0 });
        }
        else if (this.selectedFilteredDepartments.length < this.filteredDepartments.length) {
            this.selectedFilteredDepartments.forEach(function (department) {
                params.push({ name: departmentParam, value: department.departmentId });
            });
        }
        if (this.selectedFilteredContracts.length === 0) {
            params.push({ name: 'isAllContractNumberSelected', value: 0 });
        }
        else if (this.selectedFilteredContracts.length < this.filteredContracts.length) {
            this.selectedFilteredContracts.forEach(function (contract) {
                params.push({ name: contractNumberParam, value: contract.sectionId });
            });
        }
        if (this.charterIds.length === 0) {
            params.push({ name: 'isAllCharterSelected', value: 0 });
        }
        else if (!this.charterDropdownComponent.allSelected) {
            this.charterIds.forEach(function (id) {
                params.push({ name: charterParam, value: id });
            });
        }
        return params;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('departmentDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_12__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], ReportCriteriasComponent.prototype, "departmentDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('profitCenterDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_12__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], ReportCriteriasComponent.prototype, "profitCenterDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('contractDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_12__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], ReportCriteriasComponent.prototype, "contractDropdownComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('charterDropdownComponent'),
        __metadata("design:type", _shared_components_form_components_multiple_autocomplete_dropdown_contextual_search_contextual_search_multiple_autocomplete_select_component__WEBPACK_IMPORTED_MODULE_12__["ContextualSearchMultipleAutocompleteSelectComponent"])
    ], ReportCriteriasComponent.prototype, "charterDropdownComponent", void 0);
    ReportCriteriasComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-report-criterias',
            template: __webpack_require__(/*! ./report-criterias.component.html */ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.html"),
            styles: [__webpack_require__(/*! ./report-criterias.component.scss */ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__["UtilService"],
            _shared_services_http_services_execution_service__WEBPACK_IMPORTED_MODULE_8__["ExecutionService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__["MasterdataService"],
            _shared_services_http_services_trading_service__WEBPACK_IMPORTED_MODULE_10__["TradingService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationProviderService"]])
    ], ReportCriteriasComponent);
    return ReportCriteriasComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_5__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.html":
/*!****************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.html ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='main-container trade-cost-movement-report'>\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"space-between stretch\"\r\n         fxLayoutAlign.lt-md=\"space-around center\">\r\n        <mat-card fxFlex=\"45\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>Criterias</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"10px\">\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left stretch\"\r\n                     fxLayoutGap=\"5%\">\r\n\r\n\r\n                    <atlas-dropdown-select fxFlex='30%'\r\n                                           [label]=\"'Database'\"\r\n                                           [fieldControl]=\"snapshotsCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"snapshotList\"\r\n                                           [errorMap]=\"snapshotErrorMap\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\"\r\n                                           (optionSelected)=\"selectionChanged($event) \"></atlas-dropdown-select>\r\n                    <atlas-dropdown-select fxFlex='30%'\r\n                                           [label]=\"'Trade Status'\"\r\n                                           [options]=\"constractStatusList\"\r\n                                           [fieldControl]=\"contractStatusCtrl\"\r\n                                           [errorMap]=\"contractStatusErrorMap\"\r\n                                           isEditable=true\r\n                                           [selectProperties]=\"contractStatusDisplayProperty\"\r\n                                           multiselect=true></atlas-dropdown-select>\r\n\r\n                    <span fxLayoutAlign=\"left center\">\r\n                        <mat-checkbox [checked]=\"includeGoods\"\r\n                                      (change)=\"onIncludeGoodsChanged($event)\">Include Goods</mat-checkbox>\r\n                    </span>\r\n\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left stretch\"\r\n                     fxLayoutGap=\"5%\">\r\n                    <atlas-dropdown-select fxFlex='30%'\r\n                                           [label]=\"'Comparison Database'\"\r\n                                           [fieldControl]=\"comparisondbCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"comparisondbList\"\r\n                                           [errorMap]=\"comparisondbErrorMap\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\"></atlas-dropdown-select>\r\n                    <atlas-dropdown-select-list fxFlex='30%'\r\n                                                [label]=\"'Company'\"\r\n                                                [fieldControl]=\"tradeCostcompanyCtrl\"\r\n                                                [(options)]=\"filteredCompany\"\r\n                                                [selectProperties]=\"companySelect\"\r\n                                                isEditable=true\r\n                                                multiselect=true\r\n                                                (optionSelected)=\"companyOptionSelected($event)\">\r\n                    </atlas-dropdown-select-list>\r\n                    <span fxLayoutAlign=\"right center\">\r\n                        <mat-checkbox [checked]=\"excludeNoMovement\"\r\n                                      (change)=\"onNoCostMovementChanged($event)\">No Cost Movement</mat-checkbox>\r\n                    </span>\r\n                </div>\r\n            </mat-card-content>\r\n\r\n        </mat-card>\r\n        <atlas-filter-set-display fxFlex=\"50\"\r\n                                  (filtersChanged)=onFilterSetChanged($event)\r\n                                  [columnConfiguration]=\"columnConfiguration\"\r\n                                  [gridCode]=\"gridCode\"\r\n                                  [company]=\"company\">\r\n        </atlas-filter-set-display>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                class=\"generate-report-button\"\r\n                (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n    </div>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.scss":
/*!****************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.scss ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 8px 0 0 0 !important; }\n\n.report-container {\n  height: 60vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.ts":
/*!**************************************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.ts ***!
  \**************************************************************************************************************************************/
/*! exports provided: TradeCostMovementReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeCostMovementReportComponent", function() { return TradeCostMovementReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_trade_status_entity__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/entities/trade-status.entity */ "./Client/app/shared/entities/trade-status.entity.ts");
/* harmony import */ var _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/enums/freeze-type.enum */ "./Client/app/shared/enums/freeze-type.enum.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/services/http-services/reporting.service */ "./Client/app/shared/services/http-services/reporting.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



















var TradeCostMovementReportComponent = /** @class */ (function () {
    function TradeCostMovementReportComponent(freezeService, formBuilder, snackbarService, gridConfigurationProvider, companyManager, route, reportingService, titleService) {
        this.freezeService = freezeService;
        this.formBuilder = formBuilder;
        this.snackbarService = snackbarService;
        this.gridConfigurationProvider = gridConfigurationProvider;
        this.companyManager = companyManager;
        this.route = route;
        this.reportingService = reportingService;
        this.titleService = titleService;
        this.snapshotsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.contractStatusCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.comparisondbCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.tradeCostcompanyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('companySelect');
        this.companySelect = ['companyId'];
        this.includeGoods = false;
        this.excludeNoMovement = false;
        this.constractStatusList = [];
        this.contractStatusDisplayProperty = ['name'];
        this.snapshotList = [];
        this.comparisondbList = [];
        this.currentSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__["FreezeDisplayView"](-1, 'CURRENT', null, _shared_enums_freeze_type_enum__WEBPACK_IMPORTED_MODULE_11__["FreezeType"].Current);
        this.gridCode = 'tradeCostReportGrid';
        this.columnConfiguration = [];
        this.filters = [];
        this.companyList = [];
        this.filteredCompany = [];
        this.companiesSelectedList = [];
        this.showError = false;
        this.contractStatusErrorMap = new Map();
        this.snapshotErrorMap = new Map();
        this.comparisondbErrorMap = new Map();
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].reportServerLink;
        this.reportPath = 'LDC Atlas/TradeCost/TradeCostMovement';
        this.parameters = [];
        this.constractStatusList = _shared_entities_trade_status_entity__WEBPACK_IMPORTED_MODULE_10__["TradeStatus"].getStatusList();
        this.company = this.route.snapshot.paramMap.get('company');
    }
    TradeCostMovementReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter(function (event) { return event.companyId !== _this.company; });
        this.tradeCostcompanyCtrl.patchValue(this.filteredCompany);
        this.loadSnapshots();
        this.loadGridConfiguration();
        this.titleService.setTitle(this.route.snapshot.data.title);
    };
    TradeCostMovementReportComponent.prototype.getCompaniesList = function () {
        var options = this.companyManager.getLoadedCompanies();
        return options;
    };
    TradeCostMovementReportComponent.prototype.companyOptionSelected = function (companiesSelected) {
        this.companiesSelectedList = [];
        if (companiesSelected && companiesSelected.length > 0) {
            this.companiesSelectedList = companiesSelected.map(function (comp) { return comp.companyId; });
        }
        else {
        }
    };
    TradeCostMovementReportComponent.prototype.initializeForm = function () {
        this.formGroup = this.formBuilder.group({
            snapshotsCtrl: this.snapshotsCtrl,
            contractStatusCtrl: this.contractStatusCtrl,
            comparisondbCtrl: this.comparisondbCtrl,
            tradeCostcompanyCtrl: this.tradeCostcompanyCtrl,
        });
        this.setValidators();
        this.setDefaultValues();
        return this.formGroup;
    };
    TradeCostMovementReportComponent.prototype.setValidators = function () {
        this.snapshotsCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.snapshotList, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__["nameof"])('dataVersionId')),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]));
        this.comparisondbCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.comparisondbList, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__["nameof"])('dataVersionId')),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]));
        this.snapshotErrorMap.set('required', 'Please enter a value');
        this.snapshotErrorMap.set('inDropdownList', 'Please enter a value  that\'s in the list');
        this.comparisondbCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.comparisondbErrorMap.set('required', 'Please enter a value');
        this.comparisondbErrorMap.set('inDropdownList', 'Please enter a value  that\'s in the list');
        this.contractStatusCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.contractStatusErrorMap.set('required', 'Please select at least one value');
    };
    TradeCostMovementReportComponent.prototype.setDefaultValues = function () {
        this.snapshotsCtrl.patchValue(this.currentSnapshot);
        this.contractStatusCtrl.patchValue(this.constractStatusList.filter(function (status) { return status.name === 'Open'; }));
        this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
    };
    TradeCostMovementReportComponent.prototype.loadSnapshots = function () {
        var _this = this;
        this.freezeService.getFreezeList().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) {
            return data.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate), freeze.freezeDate, freeze.dataVersionTypeId);
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (snapshots) {
            _this.snapshotList = snapshots;
            _this.snapshotList.unshift(_this.currentSnapshot);
            _this.comparisondbList = _this.snapshotList
                .filter(function (p) { return (p.freezeDate !== 'CURRENT'); });
            _this.initializeForm();
        });
    };
    TradeCostMovementReportComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.columnConfiguration = configuration.columns;
        });
    };
    TradeCostMovementReportComponent.prototype.onFilterSetChanged = function (filters) {
        this.filters = filters;
        if (this.filters.length > 0) {
            this.onGenerateReportButtonClicked();
        }
    };
    TradeCostMovementReportComponent.prototype.onGenerateReportButtonClicked = function () {
        var _this = this;
        if (!this.formGroup || !this.formGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }
        if (this.companiesSelectedList.length > 0) {
            var snapshotId = (this.snapshotsCtrl.value) ? this.snapshotsCtrl.value.dataVersionId : -1;
            var comparisonDatabaseId = (this.comparisondbCtrl.value) ?
                this.comparisondbCtrl.value.dataVersionId : -1;
            if (snapshotId !== -1 || comparisonDatabaseId !== -1) {
                var freezeDate = this.snapshotsCtrl.value;
                var comparisonDBDate = this.comparisondbCtrl.value;
                this.freezeService.checkFreezeForSelectedDatabase(this.companiesSelectedList, freezeDate['dataVersionTypeId'], freezeDate, comparisonDBDate['dataVersionTypeId'], comparisonDBDate).subscribe(function (data) {
                    if (data) {
                        _this.missingCompanyList = [];
                        _this.showError = (data.missingCompany || data.comparisonMissingCompany) ? true : false;
                        if (data.comparisonMissingCompany) {
                            _this.missingCompanyList.push(data.comparisonMissingCompany);
                        }
                        if (!_this.showError && _this.missingCompanyList.length === 0) {
                            if (_this.filters && _this.filters.length > 0) {
                                _this.reportingService.createReportCriterias(_this.gridCode, _this.filters).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(_this.destroy$)).subscribe(function (filterSetId) {
                                    var predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                                    _this.generateReport(predicateId);
                                });
                            }
                            else {
                                _this.generateReport();
                            }
                        }
                        else {
                            _this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                                + _this.missingCompanyList + ' report cannot be generated');
                        }
                    }
                });
            }
        }
        else {
            if (this.filters && this.filters.length > 0) {
                this.reportingService.createReportCriterias(this.gridCode, this.filters).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (filterSetId) {
                    var predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                    _this.generateReport(predicateId);
                });
            }
            else {
                this.generateReport();
            }
        }
    };
    TradeCostMovementReportComponent.prototype.generateReport = function (additionalParameters) {
        var _this = this;
        if (additionalParameters === void 0) { additionalParameters = []; }
        var snapshotId = this.snapshotsCtrl.value.dataVersionId;
        var comparisondbtId = this.comparisondbCtrl.value.dataVersionId;
        var goodsIncluded = this.includeGoods ? 1 : 0;
        var excludeNoMovement = this.excludeNoMovement ? 1 : 0;
        var contractStatusIds = this.contractStatusCtrl.value.map(function (status) { return status.value; });
        var companiesList = this.tradeCostcompanyCtrl.value.map(function (status) { return status.companyId; });
        this.parameters = [
            { name: 'IncludeGoods', value: goodsIncluded },
            { name: 'ExcludeNoMovement', value: excludeNoMovement },
        ];
        this.parameters = this.parameters.concat(additionalParameters);
        contractStatusIds.forEach(function (id) {
            _this.parameters.push({ name: 'TradeStatus', value: id });
        });
        if (snapshotId !== -1) {
            this.parameters.push({ name: 'Database', value: snapshotId });
        }
        this.parameters.push({ name: 'ComparisonDB', value: comparisondbtId });
        if (companiesList.length === 0) {
            this.parameters.push({ name: 'Company', value: this.company });
        }
        else {
            companiesList.push(this.company);
            companiesList.forEach(function (name) {
                _this.parameters.push({ name: 'Company', value: name });
            });
        }
        this.parameters.push({ name: 'UserLoginCompany', value: this.company });
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    };
    TradeCostMovementReportComponent.prototype.onIncludeGoodsChanged = function (event) {
        this.includeGoods = event.checked;
    };
    TradeCostMovementReportComponent.prototype.onNoCostMovementChanged = function (event) {
        this.excludeNoMovement = event.checked;
    };
    TradeCostMovementReportComponent.prototype.selectionChanged = function (value) {
        if (value.dataVersionId === -1) {
            this.comparisondbList = this.snapshotList
                .filter(function (p) { return (p.freezeDate !== 'CURRENT'); });
            this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
        }
        else {
            if (this.snapshotList.filter(function (p) { return (p.actualfreezeDate < value.actualfreezeDate); }).length > 0) {
                this.comparisondbList = this.snapshotList
                    .filter(function (p) { return (p.actualfreezeDate < value.actualfreezeDate); });
                this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
            }
            else {
                this.snackbarService.throwErrorSnackBar('No Database available for comparison database. Please select any other database.');
                this.comparisondbList = this.snapshotList
                    .filter(function (p) { return (p.actualfreezeDate < value.actualfreezeDate); });
                this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
                this.comparisondbCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
            }
        }
    };
    TradeCostMovementReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_7__["SSRSReportViewerComponent"])
    ], TradeCostMovementReportComponent.prototype, "ssrsReportViewer", void 0);
    TradeCostMovementReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-trade-cost-movement-report',
            template: __webpack_require__(/*! ./trade-cost-movement-report.component.html */ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.html"),
            styles: [__webpack_require__(/*! ./trade-cost-movement-report.component.scss */ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_14__["FreezeService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_16__["SnackbarService"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_13__["GridConfigurationProviderService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_15__["ReportingService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_17__["TitleService"]])
    ], TradeCostMovementReportComponent);
    return TradeCostMovementReportComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='main-container trade-cost-report'>\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"space-between stretch\"\r\n         fxLayoutAlign.lt-md=\"space-around center\">\r\n        <mat-card fxFlex=\"45\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>Criterias</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"10px\">\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left stretch\"\r\n                     fxLayoutGap=\"5%\">\r\n                    <atlas-dropdown-select fxFlex='30%'\r\n                                           [label]=\"'Snapshot'\"\r\n                                           [fieldControl]=\"snapshotsCtrl\"\r\n                                           isEditable=true\r\n                                           [options]=\"snapshotList\"\r\n                                           [errorMap]=\"snapshotErrorMap\"\r\n                                           displayProperty=\"freezeDate\"\r\n                                           [selectProperties]=\"['freezeDate']\"></atlas-dropdown-select>\r\n                    <atlas-dropdown-select fxFlex='30%'\r\n                                           [label]=\"'Trade Status'\"\r\n                                           [options]=\"constractStatusList\"\r\n                                           [fieldControl]=\"contractStatusCtrl\"\r\n                                           [errorMap]=\"contractStatusErrorMap\"\r\n                                           isEditable=true\r\n                                           [selectProperties]=\"contractStatusDisplayProperty\"\r\n                                           multiselect=true></atlas-dropdown-select>\r\n                    <span fxLayoutAlign=\"left center\">\r\n                        <mat-checkbox [checked]=\"includeGoods\"\r\n                                      (change)=\"onIncludeGoodsChanged($event)\">Include Goods</mat-checkbox>\r\n                    </span>\r\n                </div>\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left stretch\"\r\n                     fxLayoutGap=\"5%\">\r\n                    <atlas-dropdown-select-list fxFlex='30%'\r\n                                                [label]=\"'Company'\"\r\n                                                [fieldControl]=\"tradeCostCompanyCtrl\"\r\n                                                [(options)]=\"filteredCompany\"\r\n                                                [selectProperties]=\"companySelect\"\r\n                                                isEditable=true\r\n                                                (optionSelected)=\"companyOptionSelected($event)\"\r\n                                                multiselect=true>\r\n                    </atlas-dropdown-select-list>\r\n                </div>\r\n            </mat-card-content>\r\n\r\n        </mat-card>\r\n        <atlas-filter-set-display fxFlex=\"50\"\r\n                                  (filtersChanged)=onFilterSetChanged($event)\r\n                                  [columnConfiguration]=\"columnConfiguration\"\r\n                                  [gridCode]=\"gridCode\"\r\n                                  [company]=\"company\">\r\n        </atlas-filter-set-display>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-raised-button\r\n                class=\"generate-report-button\"\r\n                (click)=\"onGenerateReportButtonClicked()\">GENERATE REPORT</button>\r\n    </div>\r\n    <div class=\"report-container\">\r\n        <atlas-ssrsreport-viewer [reportServer]=\"reportServerUrl\"\r\n                                 [reportUrl]=\"reportPath\"\r\n                                 [parameters]=\"parameters\"\r\n                                 #ssrsReportViewer></atlas-ssrsreport-viewer>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.scss":
/*!**********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.scss ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".generate-report-button {\n  margin: 8px 0 0 0 !important; }\n\n.report-container {\n  height: 60vh; }\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.ts":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.ts ***!
  \********************************************************************************************************************/
/*! exports provided: TradeCostReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeCostReportComponent", function() { return TradeCostReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component */ "./Client/app/shared/components/ssrs-report-viewer/ssrsreport-viewer.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_entities_trade_status_entity__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/entities/trade-status.entity */ "./Client/app/shared/entities/trade-status.entity.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/services/http-services/reporting.service */ "./Client/app/shared/services/http-services/reporting.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};



















var TradeCostReportComponent = /** @class */ (function () {
    function TradeCostReportComponent(freezeService, formBuilder, snackbarService, companyManager, gridConfigurationProvider, route, router, reportingService, titleService) {
        this.freezeService = freezeService;
        this.formBuilder = formBuilder;
        this.snackbarService = snackbarService;
        this.companyManager = companyManager;
        this.gridConfigurationProvider = gridConfigurationProvider;
        this.route = route;
        this.router = router;
        this.reportingService = reportingService;
        this.titleService = titleService;
        this.snapshotsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.contractStatusCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.tradeCostCompanyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_9__["AtlasFormControl"]('companySelect');
        this.companySelect = ['companyId'];
        this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_10__["MasterDataProps"].Companies,
        ];
        this.includeGoods = false;
        this.constractStatusList = [];
        this.contractStatusDisplayProperty = ['name'];
        this.snapshotList = [];
        this.currentSnapshot = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__["FreezeDisplayView"](-1, 'CURRENT');
        this.gridCode = 'tradeCostReportGrid';
        this.columnConfiguration = [];
        this.filters = [];
        this.companyList = [];
        this.filteredCompany = [];
        this.companiesSelectedList = [];
        this.showError = false;
        this.contractStatusErrorMap = new Map();
        this.snapshotErrorMap = new Map();
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.reportServerUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].reportServerLink;
        this.reportPath = 'LDC Atlas/TradeCost/TradeCost';
        this.parameters = [];
        this.constractStatusList = _shared_entities_trade_status_entity__WEBPACK_IMPORTED_MODULE_11__["TradeStatus"].getStatusList();
        this.company = this.route.snapshot.paramMap.get('company');
    }
    TradeCostReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter(function (company) { return company.companyId !== _this.company; });
        this.tradeCostCompanyCtrl.patchValue(this.filteredCompany);
        this.loadSnapshots();
        this.loadGridConfiguration();
        this.titleService.setTitle(this.route.snapshot.data.title);
    };
    TradeCostReportComponent.prototype.getCompaniesList = function () {
        var options = this.companyManager.getLoadedCompanies();
        return options;
    };
    TradeCostReportComponent.prototype.companyOptionSelected = function (companiesSelected) {
        var e_1, _a;
        this.companiesSelectedList = [];
        if (companiesSelected) {
            if (companiesSelected.length > 0) {
                try {
                    for (var companiesSelected_1 = __values(companiesSelected), companiesSelected_1_1 = companiesSelected_1.next(); !companiesSelected_1_1.done; companiesSelected_1_1 = companiesSelected_1.next()) {
                        var val = companiesSelected_1_1.value;
                        this.companiesSelectedList.push(val['companyId']);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (companiesSelected_1_1 && !companiesSelected_1_1.done && (_a = companiesSelected_1.return)) _a.call(companiesSelected_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
            }
        }
    };
    TradeCostReportComponent.prototype.initializeForm = function () {
        this.formGroup = this.formBuilder.group({
            snapshotsCtrl: this.snapshotsCtrl,
            contractStatusCtrl: this.contractStatusCtrl,
            tradeCostCompanyCtrl: this.tradeCostCompanyCtrl,
        });
        this.setValidators();
        this.setDefaultValues();
        return this.formGroup;
    };
    TradeCostReportComponent.prototype.setValidators = function () {
        this.snapshotsCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.snapshotList, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_18__["nameof"])('dataVersionId')),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]));
        this.snapshotErrorMap.set('required', 'Please enter a value');
        this.snapshotErrorMap.set('inDropdownList', 'Please enter a value  that\'s in the list');
        this.contractStatusCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required);
        this.contractStatusErrorMap.set('required', 'Please select at least one value');
    };
    TradeCostReportComponent.prototype.setDefaultValues = function () {
        this.snapshotsCtrl.patchValue(this.currentSnapshot);
        this.contractStatusCtrl.patchValue(this.constractStatusList.filter(function (status) { return status.name === 'Open'; }));
    };
    TradeCostReportComponent.prototype.loadSnapshots = function () {
        var _this = this;
        this.freezeService.getFreezeList().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) {
            return data.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_12__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate), freeze.freezeDate, freeze.dataVersionTypeId);
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (snapshots) {
            _this.snapshotList = snapshots;
            _this.snapshotList.unshift(_this.currentSnapshot);
            _this.initializeForm();
        });
    };
    TradeCostReportComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.columnConfiguration = configuration.columns;
        });
    };
    TradeCostReportComponent.prototype.onFilterSetChanged = function (filters) {
        this.filters = filters;
        if (this.filters.length > 0) {
            this.onGenerateReportButtonClicked();
        }
    };
    TradeCostReportComponent.prototype.onGenerateReportButtonClicked = function () {
        var _this = this;
        if (!this.formGroup || !this.formGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }
        var snapshotId = this.snapshotsCtrl.value.dataVersionId;
        if (this.companiesSelectedList.length > 0 && snapshotId !== -1) {
            var freezeDate = this.snapshotsCtrl.value;
            this.freezeService.checkFreezeForSelectedDatabase(this.companiesSelectedList, freezeDate['dataVersionTypeId'], freezeDate, null, null).subscribe(function (data) {
                if (data) {
                    var missingCompanyList = void 0;
                    _this.showError = data.missingCompany ? true : false;
                    if (data.missingCompany) {
                        missingCompanyList = data.missingCompany;
                    }
                    if (!_this.showError) {
                        if (_this.filters && _this.filters.length > 0) {
                            _this.reportingService.createReportCriterias(_this.gridCode, _this.filters).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(_this.destroy$)).subscribe(function (filterSetId) {
                                var predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                                _this.generateReport(predicateId);
                            });
                        }
                        else {
                            _this.generateReport();
                        }
                    }
                    else {
                        _this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                            + missingCompanyList + ' report cannot be generated');
                    }
                }
            });
        }
        else {
            if (this.filters && this.filters.length > 0) {
                this.reportingService.createReportCriterias(this.gridCode, this.filters).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (filterSetId) {
                    var predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                    _this.generateReport(predicateId);
                });
            }
            else {
                this.generateReport();
            }
        }
    };
    TradeCostReportComponent.prototype.generateReport = function (additionalParameters) {
        var _this = this;
        if (additionalParameters === void 0) { additionalParameters = []; }
        var snapshotId = this.snapshotsCtrl.value.dataVersionId;
        var goodsIncluded = this.includeGoods ? 1 : 0;
        var contractStatusIds = this.contractStatusCtrl.value.map(function (status) { return status.value; });
        var companiesList = this.tradeCostCompanyCtrl.value.map(function (status) { return status.companyId; });
        this.parameters = [
            { name: 'IncludeGoods', value: goodsIncluded },
        ];
        this.parameters = this.parameters.concat(additionalParameters);
        contractStatusIds.forEach(function (id) {
            _this.parameters.push({ name: 'TradeStatus', value: id });
        });
        if (snapshotId !== -1) {
            this.parameters.push({ name: 'Database', value: snapshotId });
        }
        if (companiesList.length === 0) {
            this.parameters.push({ name: 'Company', value: this.company });
        }
        else {
            companiesList.push(this.company);
            companiesList.forEach(function (name) {
                _this.parameters.push({ name: 'Company', value: name });
            });
        }
        this.parameters.push({ name: 'UserLoginCompany', value: this.company });
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    };
    TradeCostReportComponent.prototype.onIncludeGoodsChanged = function (event) {
        this.includeGoods = event.checked;
    };
    TradeCostReportComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('ssrsReportViewer'),
        __metadata("design:type", _shared_components_ssrs_report_viewer_ssrsreport_viewer_component__WEBPACK_IMPORTED_MODULE_7__["SSRSReportViewerComponent"])
    ], TradeCostReportComponent.prototype, "ssrsReportViewer", void 0);
    TradeCostReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-trade-cost-report',
            template: __webpack_require__(/*! ./trade-cost-report.component.html */ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.html"),
            styles: [__webpack_require__(/*! ./trade-cost-report.component.scss */ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_14__["FreezeService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_16__["SnackbarService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_13__["GridConfigurationProviderService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _shared_services_http_services_reporting_service__WEBPACK_IMPORTED_MODULE_15__["ReportingService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_17__["TitleService"]])
    ], TradeCostReportComponent);
    return TradeCostReportComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.html":
/*!************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <mat-card>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start none\"\r\n             class=\"search\">\r\n            <atlas-dropdown-select fxFlex=\"60%\"\r\n                                   [label]=\"'Database'\"\r\n                                   [fieldControl]=\"databaseCtrl\"\r\n                                   isEditable=true\r\n                                   [options]=\"databaseList\"\r\n                                   (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                                   displayProperty=\"freezeDate\"\r\n                                   [selectProperties]=\"['freezeDate']\"></atlas-dropdown-select>\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Target Weight Code\"\r\n                       [matAutocomplete]=\"quantityCode\"\r\n                       [formControl]=\"weightUnitIdCtrl\"\r\n                       (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                       [matTooltip]=\"'Weight Codes'\">\r\n                <mat-autocomplete #quantityCode=\"matAutocomplete\">\r\n                    <mat-option *ngFor=\"let qtCode of filteredQuantityCode\"\r\n                                [value]=\"qtCode.weightCode\">\r\n                        {{qtCode.weightCode}}|\r\n                        {{qtCode.description}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-error *ngIf=\"weightUnitIdCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n            </mat-form-field>\r\n            <button mat-raised-button\r\n                    class=\"heroGradient\">\r\n                <mat-icon aria-label=\"Search\"\r\n                          (click)=\"onQuickSearchButtonClicked()\"\r\n                          class=\"search-icon\">search</mat-icon>\r\n            </button>\r\n        </div>\r\n    </mat-card>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"left stretch\"\r\n         fxLayoutGap=\"5%\">\r\n        <mat-card fxFlex=\"30\">\r\n            <mat-card-header>\r\n                <mat-card-title>\r\n                    <h2>General Inclusion/Exclusion</h2>\r\n                </mat-card-title>\r\n            </mat-card-header>\r\n            <mat-card-content fxLayoutGap=\"10px\">\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"left stretch\"\r\n                     fxLayoutGap=\"5%\">\r\n                    <atlas-dropdown-select fxFlex='50%'\r\n                                           [label]=\"'Trade Status'\"\r\n                                           [options]=\"filteredContractStatusList\"\r\n                                           [fieldControl]=\"contractStatusCtrl\"\r\n                                           isEditable=true\r\n                                           [selectProperties]=\"contractStatusDisplayProperty\"\r\n                                           multiselect=true\r\n                                           (panelOpened)=\"onPanelOpened($event)\"></atlas-dropdown-select>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n    </div>\r\n    <atlas-list-and-search class=\"default-height\"\r\n                           [gridCode]=\"gridCode\"\r\n                           [searchCode]=\"searchCode\"\r\n                           [gridTitle]=\"'Trade Report'\"\r\n                           [additionalFilters]=\"additionalFilters\"\r\n                           [company]=\"company\"\r\n                           [dataLoader]=\"dataLoader\"\r\n                           [hasDeleteViewPrivilege]=\"hasDeleteViewPrivilege\"\r\n                           [dataVersionId]=\"dataVersionId!==-1?dataVersionId:null\"\r\n                           [pageSize]=\"100\"\r\n                           waitBeforeLoadingData=true\r\n                           (configurationLoaded)=\"initAdditionnalFilters()\"\r\n                           #tradeReportListAndSearchComponent>\r\n    </atlas-list-and-search>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.scss":
/*!************************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.scss ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.ts ***!
  \**********************************************************************************************************/
/*! exports provided: TradeReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeReportComponent", function() { return TradeReportComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_components_list_and_search_list_and_search_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/components/list-and-search/list-and-search.component */ "./Client/app/shared/components/list-and-search/list-and-search.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_entities_trade_status_entity__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/entities/trade-status.entity */ "./Client/app/shared/entities/trade-status.entity.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/models/freeze-display-view */ "./Client/app/shared/models/freeze-display-view.ts");
/* harmony import */ var _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/services/http-services/freeze.service */ "./Client/app/shared/services/http-services/freeze.service.ts");
/* harmony import */ var _shared_services_list_and_search_tradeReport_data_loader__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../shared/services/list-and-search/tradeReport-data-loader */ "./Client/app/shared/services/list-and-search/tradeReport-data-loader.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./../../../../../core/services/authorization.service */ "./Client/app/core/services/authorization.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};


















var TradeReportComponent = /** @class */ (function () {
    function TradeReportComponent(formBuilder, route, dataLoader, freezeService, utilService, snackbarService, authorizationService, titleService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.dataLoader = dataLoader;
        this.freezeService = freezeService;
        this.utilService = utilService;
        this.snackbarService = snackbarService;
        this.authorizationService = authorizationService;
        this.titleService = titleService;
        this.contractStatusSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.databaseCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.databaseList = [];
        this.currentDatabase = new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_11__["FreezeDisplayView"](-1, 'CURRENT');
        this.filteredQuantityCode = [];
        this.weightUnitIdCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('WeightCodeId');
        this.masterdataList = [_shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].WeightUnits];
        this.additionalFilters = [];
        this.contractStatusCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.contractStatusList = [];
        this.filteredContractStatusList = [];
        this.contractStatusDisplayProperty = ['name'];
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.gridCode = 'tradeReportList';
        this.hasDeleteViewPrivilege = false;
        this.parameters = [];
        this.company = this.route.snapshot.paramMap.get('company');
    }
    TradeReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        var e_1, _a;
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterData.counterparties;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterPartyId'));
        if (this.counterPartyId) {
            var counterparty = this.filteredCounterPartyList.find(function (cp) { return cp.counterpartyID === _this.counterPartyId; });
            if (counterparty) {
                this.searchCode = counterparty.counterpartyCode;
            }
        }
        this.contractStatusList = _shared_entities_trade_status_entity__WEBPACK_IMPORTED_MODULE_9__["TradeStatus"].getStatusList();
        this.titleService.setTitle(this.route.snapshot.data.title);
        try {
            for (var _b = __values(this.contractStatusList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var contractStatus = _c.value;
                if (contractStatus.name === 'Open' || contractStatus.name === 'Closed' ||
                    contractStatus.name === 'Zero Tonnages' || contractStatus.name === 'Cancelled') {
                    this.filteredContractStatusList.push(contractStatus);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Reports') &&
            this.authorizationService.isPrivilegeAllowed(this.company, 'TradeReport')) {
            this.hasDeleteViewPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'DeleteTradeReportView');
        }
        this.filteredQuantityCode = this.masterData.weightUnits;
        this.weightUnitIdCtrl.valueChanges.subscribe(function (input) {
            _this.filteredQuantityCode = _this.utilService.filterListforAutocomplete(input, _this.masterData.weightUnits, ['weightCode', 'description']);
        });
        this.loadSnapshots();
        this.setDefaultValues();
        this.applyFiltersForListAndSearchGrid();
    };
    TradeReportComponent.prototype.initializeForm = function () {
        this.formGroup = this.formBuilder.group({
            contractStatusCtrl: this.contractStatusCtrl,
            databaseCtrl: this.databaseCtrl,
        });
        return this.formGroup;
    };
    TradeReportComponent.prototype.loadSnapshots = function () {
        var _this = this;
        this.freezeService.getFreezeList().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) {
            return data.value.map(function (freeze) {
                return new _shared_models_freeze_display_view__WEBPACK_IMPORTED_MODULE_11__["FreezeDisplayView"](freeze.dataVersionId, _this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate));
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroy$)).subscribe(function (snapshots) {
            _this.databaseList = snapshots;
            _this.databaseList.unshift(_this.currentDatabase);
            _this.databaseCtrl.patchValue(_this.currentDatabase);
            _this.initializeForm();
        });
    };
    TradeReportComponent.prototype.setDefaultValues = function () {
        this.contractStatusCtrl.patchValue(this.filteredContractStatusList.filter(function (status) { return status.name === 'Open'; }));
        var defaultWeightUnit = this.filteredQuantityCode.find(function (weightUnit) { return weightUnit.weightCode === 'MT'; });
        this.weightUnitIdCtrl.patchValue(defaultWeightUnit ? defaultWeightUnit.weightCode : '');
    };
    TradeReportComponent.prototype.onQuickSearchButtonClicked = function () {
        this.applyFiltersForListAndSearchGrid();
    };
    TradeReportComponent.prototype.onPanelOpened = function (isPanelOpened) {
        if (isPanelOpened === false) {
            var contractStatus = [];
            contractStatus = this.contractStatusCtrl.value;
            if (contractStatus.length <= 0) {
                this.contractStatusCtrl.patchValue(this.filteredContractStatusList.filter(function (status) { return status.name === 'Open'; }));
                this.snackbarService.throwErrorSnackBar(' Select at least one option from General Inclusion/Exclusion to generate Report');
            }
            if (this.listAndSearchComponent &&
                this.listAndSearchComponent.columnConfiguration &&
                this.listAndSearchComponent.columnConfiguration.length > 0) {
                this.applyFiltersForListAndSearchGrid();
            }
            else {
                this.configurationColumns();
            }
        }
    };
    TradeReportComponent.prototype.configurationColumns = function () {
        this.listAndSearchComponent.loadGridConfiguration();
        this.applyFiltersForListAndSearchGrid();
    };
    TradeReportComponent.prototype.applyFiltersForListAndSearchGrid = function () {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        this.additionalFilters = [];
        var zeroTonnagesExist = false;
        var filterContractsStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
        filterContractsStatus.clauses = [];
        var filterZeroTonnages = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
        var filterCancelled = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
        var filterContractStatus;
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {
            var dataVersionIdField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'DataVersionId'; });
            this.dataVersionId = this.databaseCtrl.value.dataVersionId;
            var quantityCodeField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'QuantityCode'; });
            var tradeStatusField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'TradeStatus'; });
            var zeroTonnagesField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'Quantity'; });
            var isCancelledField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'isCancelled'; });
            var zeroTonnage = 0;
            var cancelled = '';
            var zeroTonnageInDecimal = '0.00';
            var cancelledExist = false;
            var contractStatusNames = this.contractStatusCtrl.value.map(function (status) { return status.name; });
            if (!this.listAndSearchComponent) {
                return;
            }
            else if (this.databaseCtrl.value && dataVersionIdField && this.dataVersionId !== -1) {
                var filterDataVersionId = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterDataVersionId.fieldId = dataVersionIdField.fieldId;
                filterDataVersionId.fieldName = dataVersionIdField.fieldName;
                filterDataVersionId.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                    operator: 'eq',
                    value1: this.dataVersionId.toString(),
                };
                filterDataVersionId.isActive = true;
                this.additionalFilters = [filterDataVersionId];
            }
            if (this.contractStatusCtrl.value) {
                if (contractStatusNames.length === 1) {
                    this.initAdditionnalFilters();
                }
                if (contractStatusNames.length > 1) {
                    try {
                        for (var contractStatusNames_1 = __values(contractStatusNames), contractStatusNames_1_1 = contractStatusNames_1.next(); !contractStatusNames_1_1.done; contractStatusNames_1_1 = contractStatusNames_1.next()) {
                            var contractStatus = contractStatusNames_1_1.value;
                            if (contractStatus === 'Zero Tonnages') {
                                zeroTonnagesExist = true;
                            }
                            else if (contractStatus === 'Cancelled') {
                                cancelledExist = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (contractStatusNames_1_1 && !contractStatusNames_1_1.done && (_a = contractStatusNames_1.return)) _a.call(contractStatusNames_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    if (this.weightUnitIdCtrl.value && quantityCodeField) {
                        var filterWeightUnit = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                        filterWeightUnit.fieldId = quantityCodeField.fieldId;
                        filterWeightUnit.fieldName = quantityCodeField.fieldName;
                        filterWeightUnit.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                            operator: 'eq',
                            value1: this.weightUnitIdCtrl.value + '%',
                        };
                        filterWeightUnit.isActive = true;
                        this.additionalFilters.push(filterWeightUnit);
                    }
                    if (zeroTonnagesExist) {
                        var filterAllContractStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                        try {
                            for (var contractStatusNames_2 = __values(contractStatusNames), contractStatusNames_2_1 = contractStatusNames_2.next(); !contractStatusNames_2_1.done; contractStatusNames_2_1 = contractStatusNames_2.next()) {
                                var contractStatus = contractStatusNames_2_1.value;
                                if (contractStatus !== 'Zero Tonnages' && tradeStatusField) {
                                    filterContractStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                                    filterContractStatus.fieldId = tradeStatusField.fieldId;
                                    filterContractStatus.fieldName = tradeStatusField.fieldName;
                                    filterContractStatus.predicate = {
                                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                                        operator: 'eq',
                                        value1: contractStatus,
                                    };
                                    filterContractStatus.isActive = true;
                                    filterContractsStatus.clauses.push(filterContractStatus);
                                }
                                else if (zeroTonnagesField) {
                                    filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                                    filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                                    filterZeroTonnages.predicate = {
                                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Numeric,
                                        operator: 'eq',
                                        value1: zeroTonnage.toString(),
                                    };
                                    filterZeroTonnages.isActive = true;
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (contractStatusNames_2_1 && !contractStatusNames_2_1.done && (_b = contractStatusNames_2.return)) _b.call(contractStatusNames_2);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        filterContractsStatus.logicalOperator = 'or';
                        if (tradeStatusField || zeroTonnagesField) {
                            if (filterContractStatus && filterZeroTonnages) {
                                filterAllContractStatus.logicalOperator = 'or';
                                filterAllContractStatus.clauses = [filterContractsStatus, filterZeroTonnages];
                                this.additionalFilters.push(filterAllContractStatus);
                            }
                            else {
                                this.additionalFilters.push(filterContractStatus ? filterContractsStatus : filterZeroTonnages);
                            }
                        }
                    }
                    else if (cancelledExist) {
                        var filterAllContractStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                        try {
                            for (var contractStatusNames_3 = __values(contractStatusNames), contractStatusNames_3_1 = contractStatusNames_3.next(); !contractStatusNames_3_1.done; contractStatusNames_3_1 = contractStatusNames_3.next()) {
                                var contractStatus = contractStatusNames_3_1.value;
                                if (contractStatus !== 'Cancelled' && tradeStatusField) {
                                    filterContractStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                                    filterContractStatus.fieldId = tradeStatusField.fieldId;
                                    filterContractStatus.fieldName = tradeStatusField.fieldName;
                                    filterContractStatus.predicate = {
                                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                                        operator: 'eq',
                                        value1: contractStatus,
                                    };
                                    filterContractStatus.isActive = true;
                                    filterContractsStatus.clauses.push(filterContractStatus);
                                }
                                else if (isCancelledField) {
                                    filterCancelled.fieldId = isCancelledField.fieldId;
                                    filterCancelled.fieldName = isCancelledField.fieldName;
                                    filterCancelled.predicate = {
                                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                                        operator: 'eq',
                                        value1: contractStatus,
                                    };
                                    filterZeroTonnages.isActive = true;
                                }
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (contractStatusNames_3_1 && !contractStatusNames_3_1.done && (_c = contractStatusNames_3.return)) _c.call(contractStatusNames_3);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        filterContractsStatus.logicalOperator = 'or';
                        if (tradeStatusField || isCancelledField) {
                            if (filterContractStatus && filterCancelled) {
                                filterAllContractStatus.logicalOperator = 'or';
                                filterAllContractStatus.clauses = [filterContractsStatus, filterCancelled];
                                this.additionalFilters.push(filterAllContractStatus);
                            }
                            else {
                                this.additionalFilters.push(filterContractStatus ? filterContractsStatus : filterCancelled);
                            }
                        }
                    }
                    else {
                        try {
                            for (var contractStatusNames_4 = __values(contractStatusNames), contractStatusNames_4_1 = contractStatusNames_4.next(); !contractStatusNames_4_1.done; contractStatusNames_4_1 = contractStatusNames_4.next()) {
                                var contractStatus = contractStatusNames_4_1.value;
                                if (tradeStatusField) {
                                    filterContractStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                                    filterContractStatus.fieldId = tradeStatusField.fieldId;
                                    filterContractStatus.fieldName = tradeStatusField.fieldName;
                                    filterContractStatus.predicate = {
                                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                                        operator: 'eq',
                                        value1: contractStatus,
                                    };
                                    filterContractStatus.isActive = true;
                                    filterContractsStatus.clauses.push(filterContractStatus);
                                }
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (contractStatusNames_4_1 && !contractStatusNames_4_1.done && (_d = contractStatusNames_4.return)) _d.call(contractStatusNames_4);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        filterContractsStatus.logicalOperator = 'or';
                        filterContractsStatus.isActive = true;
                        this.additionalFilters.push(filterContractsStatus);
                        filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                        filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                        filterZeroTonnages.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Numeric,
                            operator: 'ne',
                            value1: zeroTonnage.toString(),
                            value2: zeroTonnageInDecimal,
                        };
                        filterZeroTonnages.isActive = true;
                        this.additionalFilters.push(filterZeroTonnages);
                        filterCancelled.fieldId = isCancelledField.fieldId;
                        filterCancelled.fieldName = isCancelledField.fieldName;
                        filterCancelled.predicate = {
                            filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                            operator: 'ne',
                            value1: cancelled,
                        };
                        filterCancelled.isActive = true;
                        this.additionalFilters.push(filterCancelled);
                    }
                    this.listAndSearchComponent.additionalFilters = this.additionalFilters;
                    this.listAndSearchComponent.dataVersionId = this.dataVersionId !== -1 ? this.dataVersionId : null;
                    this.listAndSearchComponent.loadData(true);
                }
            }
            else {
                return;
            }
        }
    };
    TradeReportComponent.prototype.initAdditionnalFilters = function () {
        if (this.additionalFilters.length === 0) {
            this.additionalFilters = [];
        }
        var contractStatusNames = this.contractStatusCtrl.value.map(function (status) { return status.name; });
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {
            var quantityCodeField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'QuantityCode'; });
            var tradeStatusField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'TradeStatus'; });
            var zeroTonnagesField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'Quantity'; });
            var isCancelledField = this.listAndSearchComponent.columnConfiguration
                .find(function (column) { return column.fieldName === 'isCancelled'; });
            var zeroTonnage = 0;
            var cancelled = '';
            var zeroTonnageInDecimal = '0.00';
            var filterWeightUnit = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
            filterWeightUnit.fieldId = quantityCodeField.fieldId;
            filterWeightUnit.fieldName = quantityCodeField.fieldName;
            filterWeightUnit.predicate = {
                filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                operator: 'eq',
                value1: this.weightUnitIdCtrl.value + '%',
            };
            filterWeightUnit.isActive = true;
            this.additionalFilters.push(filterWeightUnit);
            if (contractStatusNames[0] !== 'Zero Tonnages' && contractStatusNames[0] !== 'Cancelled') {
                var filterContractStatus = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterContractStatus.fieldId = tradeStatusField.fieldId;
                filterContractStatus.fieldName = tradeStatusField.fieldName;
                filterContractStatus.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                    operator: 'eq',
                    value1: contractStatusNames[0].toString(),
                };
                filterContractStatus.isActive = true;
                this.additionalFilters.push(filterContractStatus);
                var filterZeroTonnages = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                filterZeroTonnages.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Numeric,
                    operator: 'ne',
                    value1: zeroTonnage.toString(),
                    value2: zeroTonnageInDecimal,
                };
                filterZeroTonnages.isActive = true;
                this.additionalFilters.push(filterZeroTonnages);
                var filterCancelled = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterCancelled.fieldId = isCancelledField.fieldId;
                filterCancelled.fieldName = isCancelledField.fieldName;
                filterCancelled.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                    operator: 'ne',
                    value1: cancelled,
                };
                filterCancelled.isActive = true;
                this.additionalFilters.push(filterCancelled);
            }
            else if (contractStatusNames[0] !== 'Cancelled') {
                var filterCancelled = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterCancelled.fieldId = isCancelledField.fieldId;
                filterCancelled.fieldName = isCancelledField.fieldName;
                filterCancelled.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                    operator: 'eq',
                    value1: cancelled,
                };
                filterCancelled.isActive = true;
                this.additionalFilters.push(filterCancelled);
            }
            else {
                var filterZeroTonnages = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                filterZeroTonnages.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Numeric,
                    operator: 'eq',
                    value1: zeroTonnage.toString(),
                };
                filterZeroTonnages.isActive = true;
                this.additionalFilters.push(filterZeroTonnages);
            }
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.additionalFilters = this.additionalFilters;
            this.listAndSearchComponent.loadData(true);
        }
        else {
            return;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('tradeReportListAndSearchComponent'),
        __metadata("design:type", _shared_components_list_and_search_list_and_search_component__WEBPACK_IMPORTED_MODULE_5__["ListAndSearchComponent"])
    ], TradeReportComponent.prototype, "listAndSearchComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], TradeReportComponent.prototype, "contractStatusSelected", void 0);
    TradeReportComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-trade-report',
            template: __webpack_require__(/*! ./trade-report.component.html */ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.html"),
            styles: [__webpack_require__(/*! ./trade-report.component.scss */ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.scss")],
            providers: [_shared_services_list_and_search_tradeReport_data_loader__WEBPACK_IMPORTED_MODULE_13__["TradeReportDataLoader"]],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _shared_services_list_and_search_tradeReport_data_loader__WEBPACK_IMPORTED_MODULE_13__["TradeReportDataLoader"],
            _shared_services_http_services_freeze_service__WEBPACK_IMPORTED_MODULE_12__["FreezeService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_16__["UtilService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_14__["SnackbarService"],
            _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_17__["AuthorizationService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_15__["TitleService"]])
    ], TradeReportComponent);
    return TradeReportComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/components/global-reports/global-reports.component.html":
/*!**************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/global-reports.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container hub-menu\">\r\n    <h1>Reports Panel</h1>\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"start stretch\"\r\n         fxLayoutGap=\"16px\"\r\n         class=\"hub-menu-panel\"\r\n         [hidden]=\"isLoading\">\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/tradecost')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.TradeCostReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Trade Cost</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate trade cost report</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/pnlreports')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.PLReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">P&amp;L Reports</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate P&amp;L report</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/audit')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.AuditReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Audit</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate audit report</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/clientreport')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.ClientTransactionReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Client Transaction Report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate Client Transaction report</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/nominalreport')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.NominalReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Nominal Report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate Nominal report</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/trade')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.TradeReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Trade Report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate trade report</p>\r\n        </mat-card>\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/tradecostmovement')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.TradeCostMovementReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Trade Cost Movement Report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate trade cost movement report</p>\r\n        </mat-card>\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/newbiz')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.NEWBIZReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">New Biz Report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate new biz Report</p>\r\n        </mat-card>\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/historicalrates')\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Historical Exchange Rates Report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate historical exchange rates report</p>\r\n        </mat-card>\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/fxexposurerate')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports.FxExposureReport',company:this.company\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Fx Exposure report</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate Fx Exposure report</p>\r\n        </mat-card>\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports/accountingdocumentsreport')\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Accounting documents Reports</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Generate Accounting documents Reports</p>\r\n        </mat-card>\r\n    </div>\r\n\r\n    <div *ngIf=\"isLoading\">\r\n        <mat-card>\r\n            <h2>Loading</h2>\r\n            <div class=\"custom-line-title\"></div>\r\n\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 fxLayoutGap=\"20px\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/global-reports.component.scss":
/*!**************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/global-reports.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/reporting/components/global-reports/global-reports.component.ts":
/*!************************************************************************************!*\
  !*** ./Client/app/reporting/components/global-reports/global-reports.component.ts ***!
  \************************************************************************************/
/*! exports provided: GlobalReportsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalReportsComponent", function() { return GlobalReportsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var GlobalReportsComponent = /** @class */ (function () {
    function GlobalReportsComponent(securityService, route, router, titleService) {
        this.securityService = securityService;
        this.route = route;
        this.router = router;
        this.titleService = titleService;
        this.isLoading = false;
    }
    GlobalReportsComponent.prototype.ngOnInit = function () {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
    };
    GlobalReportsComponent.prototype.onNavigateButtonClicked = function (route) {
        this.router.navigate(['/' + this.company + route]);
    };
    GlobalReportsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-global-reports',
            template: __webpack_require__(/*! ./global-reports.component.html */ "./Client/app/reporting/components/global-reports/global-reports.component.html"),
            styles: [__webpack_require__(/*! ./global-reports.component.scss */ "./Client/app/reporting/components/global-reports/global-reports.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_security_service__WEBPACK_IMPORTED_MODULE_2__["SecurityService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_3__["TitleService"]])
    ], GlobalReportsComponent);
    return GlobalReportsComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/entities/display-options.entity.ts":
/*!*****************************************************************!*\
  !*** ./Client/app/reporting/entities/display-options.entity.ts ***!
  \*****************************************************************/
/*! exports provided: DisplayOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisplayOptions", function() { return DisplayOptions; });
var DisplayOptions = /** @class */ (function () {
    function DisplayOptions(value, name) {
        this.value = value;
        this.name = name;
    }
    DisplayOptions.getOptionList = function () {
        if (!this.list) {
            this.list =
                [
                    this.friendlyName,
                    this.technicalName,
                ];
        }
        return this.list;
    };
    DisplayOptions.getOptionStringList = function () {
        if (!this.list) {
            this.list =
                [
                    this.friendlyName,
                    this.technicalName,
                ];
        }
        return this.list.map(function (item) { return item.name; });
    };
    DisplayOptions.friendlyName = new DisplayOptions(0, 'Friendly name');
    DisplayOptions.technicalName = new DisplayOptions(1, 'Technical name');
    return DisplayOptions;
}());



/***/ }),

/***/ "./Client/app/reporting/entities/order-by-options.entity.ts":
/*!******************************************************************!*\
  !*** ./Client/app/reporting/entities/order-by-options.entity.ts ***!
  \******************************************************************/
/*! exports provided: OrderByOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderByOptions", function() { return OrderByOptions; });
var OrderByOptions = /** @class */ (function () {
    function OrderByOptions(value, name) {
        this.value = value;
        this.name = name;
    }
    OrderByOptions.getOptionList = function () {
        if (!this.list) {
            this.list =
                [
                    this.date,
                ];
        }
        return this.list;
    };
    OrderByOptions.getOptionStringList = function () {
        if (!this.list) {
            this.list =
                [
                    this.date,
                ];
        }
        return this.list.map(function (item) { return item.name; });
    };
    OrderByOptions.date = new OrderByOptions(0, 'Date');
    return OrderByOptions;
}());



/***/ }),

/***/ "./Client/app/reporting/home/home.component.html":
/*!*******************************************************!*\
  !*** ./Client/app/reporting/home/home.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container hub-menu\">\r\n    <h1>Reports Panel</h1>\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayoutAlign=\"start stretch\"\r\n         fxLayoutGap=\"16px\"\r\n         class=\"hub-menu-panel\"\r\n         [hidden]=\"isLoading\">\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/globalreports')\"\r\n                  *ifAuthorized=\"'Reports.GlobalReports',company:this.company\">\r\n            <!-- remove tooltip and overlay when link implemented-->\r\n            <img mat-card-image\r\n                 src=\".\\assets\\img\\globalReport.png\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Global Reports</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Global Reports description</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/reporting/customreports')\">\r\n            <img mat-card-image\r\n                 src=\".\\assets\\img\\customReport.png\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Custom Reports</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Custom Reports Description</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"inactive-card\"\r\n                  matTooltip=\"Feature coming soon\">\r\n            <img mat-card-image\r\n                 src=\".\\assets\\img\\accountingReport.png\">\r\n            <div class=\"overlay\"></div>\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Accounting documents Reports</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Accounting documents Reports Description</p>\r\n        </mat-card>\r\n\r\n        <mat-card class=\"inactive-card\"\r\n                  matTooltip=\"Feature coming soon\">\r\n            <img mat-card-image\r\n                 src=\".\\assets\\img\\docTemplateReport.png\">\r\n            <div class=\"overlay\"></div>\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Document template builder</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">Document template builder description</p>\r\n        </mat-card>\r\n    </div>\r\n    <div *ngIf=\"isLoading\">\r\n        <mat-card>\r\n            <h2>Loading</h2>\r\n            <div class=\"custom-line-title\"></div>\r\n\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 fxLayoutGap=\"20px\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/reporting/home/home.component.scss":
/*!*******************************************************!*\
  !*** ./Client/app/reporting/home/home.component.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-card .mat-card-image:first-child {\n  border-radius: 3px 3px 0 0; }\n"

/***/ }),

/***/ "./Client/app/reporting/home/home.component.ts":
/*!*****************************************************!*\
  !*** ./Client/app/reporting/home/home.component.ts ***!
  \*****************************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HomeComponent = /** @class */ (function () {
    function HomeComponent(securityService, route, router, titleService) {
        this.securityService = securityService;
        this.route = route;
        this.router = router;
        this.titleService = titleService;
        this.isLoading = false;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle('Reports');
    };
    HomeComponent.prototype.onNavigateButtonClicked = function (route) {
        this.router.navigate(['/' + this.company + route]);
    };
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-reporting-home',
            template: __webpack_require__(/*! ./home.component.html */ "./Client/app/reporting/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.scss */ "./Client/app/reporting/home/home.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_security_service__WEBPACK_IMPORTED_MODULE_2__["SecurityService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_3__["TitleService"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/ldeom/ldeom.component.html":
/*!*********************************************************!*\
  !*** ./Client/app/reporting/ldeom/ldeom.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <mat-card>\r\n        <mat-horizontal-stepper linear\r\n                                #stepper>\r\n            <mat-step>\r\n                <ng-template matStepLabel>Accruals</ng-template>\r\n                <ag-grid-angular #agGrid\r\n                                 [gridOptions]=\"accrualGridOptions\"\r\n                                 style=\"width: 100%; height: 100%;\"\r\n                                 id=\"accrualGrid\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"accrualGridRows\"\r\n                                 [columnDefs]=\"accrualGridCols\"\r\n                                 [domLayout]=\"accrualDomLayout\"\r\n                                 (gridReady)=\"onAccrualGridReady($event)\"\r\n                                 [rowHeight]=\"atlasAgGridParam.rowHeight\">\r\n                </ag-grid-angular>\r\n                <div class=\"custom-line-footer\"></div>\r\n                <div style=\"margin:20px; text-align:right\">\r\n                    <span class=\"fill-space\"></span>\r\n                    <button mat-button\r\n                            color=\"primary\"\r\n                            routerLink=\"/reporting\">CANCEL</button>\r\n                    <button mat-button\r\n                            matStepperNext\r\n                            mat-raised-button\r\n                            color=\"accent\">Next</button>\r\n                </div>\r\n            </mat-step>\r\n            <mat-step>\r\n                <ng-template matStepLabel>Aggregations</ng-template>\r\n                <div ag-grid=\"aggregationGgridOptions\"\r\n                     class=\"ag-theme-material\"\r\n                     style=\"height: 100%\">\r\n                    <ag-grid-angular style=\"width: auto !important; height: 100%;\"\r\n                                     class=\"ag-theme-material\"\r\n                                     [rowData]=\"aggregationGridRows\"\r\n                                     [columnDefs]=\"aggregationGridCols\"\r\n                                     [domLayout]=\"aggregationDomLayout\"\r\n                                     (gridReady)=\"onAggregationGridReady($event)\"\r\n                                     [rowHeight]=\"atlasAgGridParam.rowHeight\">\r\n                    </ag-grid-angular>\r\n                </div>\r\n                <div class=\"custom-line-footer\"></div>\r\n                <div style=\"margin:20px; text-align:right\">\r\n                    <span class=\"fill-space\"></span>\r\n                    <button mat-button\r\n                            color=\"primary\"\r\n                            routerLink=\"/{{company}}/reporting\">CANCEL</button>\r\n                    <button mat-button\r\n                            matStepperPrevious>Back</button>\r\n                    <button mat-button\r\n                            (click)=\"goForward(stepper)\"\r\n                            mat-raised-button\r\n                            color=\"accent\">Next</button>\r\n                </div>\r\n            </mat-step>\r\n            <mat-step>\r\n                <ng-template matStepLabel>Summary</ng-template>\r\n                <mat-expansion-panel expanded=\"true\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            <h2>Tempory Adjustement</h2>\r\n                            <div class=\"custom-line-title\"></div>\r\n                        </mat-panel-title>\r\n                    </mat-expansion-panel-header>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"none center\">\r\n                        <div fxFlex=\"100%\">\r\n                            <label>Document Reference:</label> {{ postingResult.documentId }}\r\n                        </div>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"none center\">\r\n                        <div fxFlex=\"100%\">\r\n                            <label>Document Date:</label> {{ postingResult.documentDate | date:'dd MMM y' }}\r\n                        </div>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"none center\">\r\n                        <div fxFlex=\"100%\">\r\n                            <label>Accounting Month:</label> {{ postingResult.documentDate | date:'MMM y' }}\r\n                        </div>\r\n                    </div>\r\n                    <br>\r\n                    <br>\r\n                    <div>\r\n                        <div class=\"custom-line-footer\"></div>\r\n                        <div style=\"margin:20px; text-align:right\">\r\n                            <span class=\"fill-space\"></span>\r\n                            <button mat-button\r\n                                    matStepperPrevious>Back</button>\r\n                            <button mat-button\r\n                                    mat-raised-button\r\n                                    (click)=\"goToPreAccouting()\"\r\n                                    color=\"accent\">View TA</button>\r\n                        </div>\r\n                    </div>\r\n                </mat-expansion-panel>\r\n            </mat-step>\r\n        </mat-horizontal-stepper>\r\n    </mat-card>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/reporting/ldeom/ldeom.component.scss":
/*!*********************************************************!*\
  !*** ./Client/app/reporting/ldeom/ldeom.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".accruals-cell {\n  line-height: 30px; }\n\nlabel {\n  font-weight: bold; }\n"

/***/ }),

/***/ "./Client/app/reporting/ldeom/ldeom.component.ts":
/*!*******************************************************!*\
  !*** ./Client/app/reporting/ldeom/ldeom.component.ts ***!
  \*******************************************************/
/*! exports provided: LdeomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdeomComponent", function() { return LdeomComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _shared_entities_ldeom_accrual_entity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/entities/ldeom-accrual.entity */ "./Client/app/shared/entities/ldeom-accrual.entity.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_controlling_dtos_ldeom_posting__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/services/controlling/dtos/ldeom-posting */ "./Client/app/shared/services/controlling/dtos/ldeom-posting.ts");
/* harmony import */ var _shared_services_http_services_controlling_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/services/http-services/controlling.service */ "./Client/app/shared/services/http-services/controlling.service.ts");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var LdeomComponent = /** @class */ (function () {
    function LdeomComponent(securityService, formBuilder, controllingService, route, router, dialog, snackbarService, gridService, titleService) {
        this.securityService = securityService;
        this.formBuilder = formBuilder;
        this.controllingService = controllingService;
        this.route = route;
        this.router = router;
        this.dialog = dialog;
        this.snackbarService = snackbarService;
        this.gridService = gridService;
        this.titleService = titleService;
        this.isLinear = false;
        this.accrualDomLayout = 'autoHeight';
        this.aggregationDomLayout = 'autoHeight';
        // Posting result
        this.postingResult = new _shared_services_controlling_dtos_ldeom_posting__WEBPACK_IMPORTED_MODULE_7__["LdeomPostingResult"]();
        this.accrualGridOptions = {};
    }
    LdeomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.accrualFormGroup = this.formBuilder.group({
            empty: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
        this.aggregationFormGroup = this.formBuilder.group({
            secondCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
        });
        this.securityService.isSecurityReady().subscribe(function () {
            _this.getAccrualsData();
            _this.initAccrualsGridColumns();
            _this.getAggregationsData();
            _this.initAggregationsGridColumns();
        });
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        // this.accrualGridOptions.getRowHeight = params => {
        //     return 30;
        // }
    };
    LdeomComponent.prototype.getAccrualsData = function () {
        var _this = this;
        this.controllingService.getAccrualsForLdeomReport().subscribe(function (data) {
            _this.accrualGridRows = data.map(function (accrual) {
                var ac = new _shared_entities_ldeom_accrual_entity__WEBPACK_IMPORTED_MODULE_5__["LdeomAccrual"](accrual);
                return new _shared_entities_ldeom_accrual_entity__WEBPACK_IMPORTED_MODULE_5__["LdeomAccrual"](ac);
            });
        });
    };
    LdeomComponent.prototype.getAggregationsData = function () {
        var _this = this;
        this.controllingService.getAggregationsForLdeomReport().subscribe(function (data) {
            _this.aggregationGridRows = data;
        });
    };
    LdeomComponent.prototype.initAccrualsGridColumns = function () {
        var _this = this;
        this.accrualGridCols = [
            {
                headerName: 'Department',
                field: 'departmentCode',
                cellClass: '',
                cellStyle: function (params) { return params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? { 'line-height': '30px', 'font-weight': 'bold', 'overflow': 'visible', 'background-color': 'white !important' } : { 'line-height': '30px', 'background-color': 'white !important' }; },
                valueGetter: function (params) { return params.data.isTotalHeaderLine() ? 'Total Dept ' + params.data.departmentCode : params.data.isTotalLine() ? '' : params.data.isHeaderLine() ? params.data.departmentDescription : params.data.departmentCode; },
            },
            {
                headerName: 'Contract',
                // valueGetter: params => this.showContractLabel(params.data),
                valueGetter: function (params) { return params.data.contractLabel; },
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Cost Type',
                field: 'costType',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Quantity',
                cellClass: '',
                valueGetter: function (params) { return params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : _this.quantityFormatter(params.data.quantity); },
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Currency',
                field: 'currency',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Full Value',
                cellClass: '',
                valueGetter: function (params) { return params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : _this.currencyFormatter(params.data.fullValue); },
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Invoiced',
                cellClass: '',
                valueGetter: function (params) { return params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : _this.currencyFormatter(params.data.invoicedValue); },
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Accrue',
                cellClass: '',
                valueGetter: function (params) { return params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : _this.currencyFormatter(params.data.accrueAmount); },
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Counterparty',
                field: 'associatedClient',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Charter',
                field: 'charterReference',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
        ];
    };
    LdeomComponent.prototype.initAggregationsGridColumns = function () {
        var _this = this;
        this.aggregationGridCols = [
            {
                headerName: 'Account',
                field: 'accountReference',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Expense Code',
                field: 'expenseCode',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Dept',
                field: 'departmentCode',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Amount',
                field: 'creditDebit',
                cellClass: '',
                valueGetter: function (params) { return new String(parseFloat(params.data.amount).toFixed(2)).concat(params.data.creditDebit === 'Credit'
                    ? ' CR'
                    : '   '); },
                cellStyle: { 'textAlign': 'right', 'line-height': '30px' },
            },
            {
                headerName: 'Quantity',
                field: 'quantity',
                cellClass: '',
                cellStyle: { 'textAlign': 'right', 'line-height': '30px' },
                valueGetter: function (params) { return _this.quantityFormatter(params.data.quantity); },
            },
        ];
    };
    LdeomComponent.prototype.onAccrualGridReady = function (params) {
        var _this = this;
        this.accrualGridApi = params.api;
        this.accrualGridColumnApi = params.columnApi;
        this.accrualGridColumnApi.autoSizeAllColumns();
        window.onresize = function () {
            _this.accrualGridColumnApi.autoSizeAllColumns();
        };
    };
    LdeomComponent.prototype.onAggregationGridReady = function (params) {
        var _this = this;
        this.aggregationGridApi = params.api;
        this.aggregationGridColumnApi = params.columnApi;
        this.aggregationGridColumnApi.autoSizeAllColumns();
        window.onresize = function () {
            _this.aggregationGridColumnApi.autoSizeAllColumns();
        };
    };
    LdeomComponent.prototype.currencyFormatter = function (number) {
        if (isNaN(number) || number === null) {
            return '';
        }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    };
    LdeomComponent.prototype.quantityFormatter = function (number) {
        if (isNaN(number) || number === null) {
            return '';
        }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(number);
    };
    LdeomComponent.prototype.showContractLabel = function (accrual) {
        return accrual.costType === 'Purchase' || accrual.costType === 'Sale' ? accrual.contractLabel : '';
    };
    LdeomComponent.prototype.goForward = function (stepper) {
        var _this = this;
        var confirmDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_4__["ConfirmationDialogComponent"], {
            data: {
                title: 'LDEOM Posting',
                text: "Do you want to proceed?",
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.createPosting();
                stepper.next();
            }
        });
    };
    LdeomComponent.prototype.createPosting = function () {
        this.snackbarService.throwErrorSnackBar('Ldeom Posting was not created. Functionnality is not implemented yet');
    };
    LdeomComponent.prototype.goToPreAccouting = function () {
        this.router.navigate(['/' + this.company + '/pre-accounting/search/' + this.postingResult.documentId]);
    };
    LdeomComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atr-ldeom',
            template: __webpack_require__(/*! ./ldeom.component.html */ "./Client/app/reporting/ldeom/ldeom.component.html"),
            styles: [__webpack_require__(/*! ./ldeom.component.scss */ "./Client/app/reporting/ldeom/ldeom.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_security_service__WEBPACK_IMPORTED_MODULE_9__["SecurityService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_http_services_controlling_service__WEBPACK_IMPORTED_MODULE_8__["ControllingService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarService"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_6__["AgGridService"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_11__["TitleService"]])
    ], LdeomComponent);
    return LdeomComponent;
}());



/***/ }),

/***/ "./Client/app/reporting/reporting.module.ts":
/*!**************************************************!*\
  !*** ./Client/app/reporting/reporting.module.ts ***!
  \**************************************************/
/*! exports provided: ReportingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingModule", function() { return ReportingModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material-moment-adapter */ "./node_modules/@angular/material-moment-adapter/esm5/material-moment-adapter.es5.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_material_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/material.module */ "./Client/app/shared/material.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/shared.module */ "./Client/app/shared/shared.module.ts");
/* harmony import */ var _components_accounting_documents_report_accounting_documents_report_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/accounting-documents-report/accounting-documents-report.component */ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.ts");
/* harmony import */ var _components_accounting_documents_report_components_document_status_dropdown_document_status_dropdown_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component */ "./Client/app/reporting/components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component.ts");
/* harmony import */ var _components_accounting_documents_report_components_document_type_dropdown_document_type_dropdown_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component */ "./Client/app/reporting/components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component.ts");
/* harmony import */ var _components_custom_reports_custom_report_viewer_custom_report_viewer_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/custom-reports/custom-report-viewer/custom-report-viewer.component */ "./Client/app/reporting/components/custom-reports/custom-report-viewer/custom-report-viewer.component.ts");
/* harmony import */ var _components_custom_reports_custom_reports_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/custom-reports/custom-reports.component */ "./Client/app/reporting/components/custom-reports/custom-reports.component.ts");
/* harmony import */ var _components_global_reports_components_audit_report_audit_report_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/global-reports/components/audit-report/audit-report.component */ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.ts");
/* harmony import */ var _components_global_reports_components_client_report_client_report_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/global-reports/components/client-report/client-report.component */ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.ts");
/* harmony import */ var _components_global_reports_components_client_report_tabs_detail_detail_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/global-reports/components/client-report/tabs/detail/detail.component */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/detail/detail.component.ts");
/* harmony import */ var _components_global_reports_components_client_report_tabs_overview_overview_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/global-reports/components/client-report/tabs/overview/overview.component */ "./Client/app/reporting/components/global-reports/components/client-report/tabs/overview/overview.component.ts");
/* harmony import */ var _components_global_reports_components_fx_exposure_report_fx_exposure_report_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/global-reports/components/fx-exposure-report/fx-exposure-report.component */ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.ts");
/* harmony import */ var _components_global_reports_components_historical_exchange_rates_report_components_critera_critera_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component.ts");
/* harmony import */ var _components_global_reports_components_historical_exchange_rates_report_components_period_period_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/global-reports/components/historical-exchange-rates-report/components/period/period.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/period/period.component.ts");
/* harmony import */ var _components_global_reports_components_historical_exchange_rates_report_components_sort_by_sort_by_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component.ts");
/* harmony import */ var _components_global_reports_components_historical_exchange_rates_report_historical_exchange_rates_report_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.ts");
/* harmony import */ var _components_global_reports_components_new_biz_report_new_biz_report_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/global-reports/components/new-biz-report/new-biz-report.component */ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.ts");
/* harmony import */ var _components_global_reports_components_nominal_report_nominal_report_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/global-reports/components/nominal-report/nominal-report.component */ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.ts");
/* harmony import */ var _components_global_reports_components_nominal_report_tabs_detail_tab_detail_tab_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component.ts");
/* harmony import */ var _components_global_reports_components_nominal_report_tabs_overview_tab_overview_tab_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component */ "./Client/app/reporting/components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_ldrep_manual_adjustment_report_ldrep_manual_adjustment_report_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_pnl_movement_report_pnl_movement_report_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_pnl_report_pnl_report_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/pnl-report/pnl-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-report/pnl-report.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_pnl_reports_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/pnl-reports.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_validation_dialog_validation_dialog_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component.ts");
/* harmony import */ var _components_global_reports_components_report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./components/global-reports/components/report-criterias/report-criterias.component */ "./Client/app/reporting/components/global-reports/components/report-criterias/report-criterias.component.ts");
/* harmony import */ var _components_global_reports_components_trade_cost_movement_report_trade_cost_movement_report_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component */ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.ts");
/* harmony import */ var _components_global_reports_components_trade_cost_report_trade_cost_report_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./components/global-reports/components/trade-cost-report/trade-cost-report.component */ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.ts");
/* harmony import */ var _components_global_reports_components_trade_report_trade_report_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./components/global-reports/components/trade-report/trade-report.component */ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.ts");
/* harmony import */ var _components_global_reports_global_reports_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./components/global-reports/global-reports.component */ "./Client/app/reporting/components/global-reports/global-reports.component.ts");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./home/home.component */ "./Client/app/reporting/home/home.component.ts");
/* harmony import */ var _ldeom_ldeom_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./ldeom/ldeom.component */ "./Client/app/reporting/ldeom/ldeom.component.ts");
/* harmony import */ var _reporting_route__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./reporting.route */ "./Client/app/reporting/reporting.route.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






































var ReportingModule = /** @class */ (function () {
    function ReportingModule() {
    }
    ReportingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _shared_material_module__WEBPACK_IMPORTED_MODULE_5__["MaterialModule"],
                _reporting_route__WEBPACK_IMPORTED_MODULE_37__["ReportingRoutingModule"],
                ag_grid_angular__WEBPACK_IMPORTED_MODULE_4__["AgGridModule"].withComponents([]),
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["SharedModule"],
            ],
            entryComponents: [
                _components_global_reports_components_pnl_reports_validation_dialog_validation_dialog_component__WEBPACK_IMPORTED_MODULE_29__["ValidationDialogComponent"],
                _components_custom_reports_custom_report_viewer_custom_report_viewer_component__WEBPACK_IMPORTED_MODULE_10__["CustomReportViewerComponent"],
            ],
            declarations: [
                _home_home_component__WEBPACK_IMPORTED_MODULE_35__["HomeComponent"],
                _components_global_reports_global_reports_component__WEBPACK_IMPORTED_MODULE_34__["GlobalReportsComponent"],
                _ldeom_ldeom_component__WEBPACK_IMPORTED_MODULE_36__["LdeomComponent"],
                _components_global_reports_components_trade_cost_report_trade_cost_report_component__WEBPACK_IMPORTED_MODULE_32__["TradeCostReportComponent"],
                _components_global_reports_components_pnl_reports_pnl_report_pnl_report_component__WEBPACK_IMPORTED_MODULE_27__["PnlReportComponent"],
                _components_global_reports_components_pnl_reports_pnl_movement_report_pnl_movement_report_component__WEBPACK_IMPORTED_MODULE_26__["PnlMovementReportComponent"],
                _components_global_reports_components_report_criterias_report_criterias_component__WEBPACK_IMPORTED_MODULE_30__["ReportCriteriasComponent"],
                _components_global_reports_components_audit_report_audit_report_component__WEBPACK_IMPORTED_MODULE_12__["AuditReportComponent"],
                _components_global_reports_components_client_report_client_report_component__WEBPACK_IMPORTED_MODULE_13__["ClientReportComponent"],
                _components_global_reports_components_trade_report_trade_report_component__WEBPACK_IMPORTED_MODULE_33__["TradeReportComponent"],
                _components_global_reports_components_trade_cost_movement_report_trade_cost_movement_report_component__WEBPACK_IMPORTED_MODULE_31__["TradeCostMovementReportComponent"],
                _components_global_reports_components_nominal_report_nominal_report_component__WEBPACK_IMPORTED_MODULE_22__["NominalReportComponent"],
                _components_global_reports_components_fx_exposure_report_fx_exposure_report_component__WEBPACK_IMPORTED_MODULE_16__["FxExposureReportComponent"],
                _components_global_reports_components_historical_exchange_rates_report_historical_exchange_rates_report_component__WEBPACK_IMPORTED_MODULE_20__["HistoricalExchangeRatesReportComponent"],
                _components_global_reports_components_historical_exchange_rates_report_components_critera_critera_component__WEBPACK_IMPORTED_MODULE_17__["CriteraComponent"],
                _components_global_reports_components_historical_exchange_rates_report_components_period_period_component__WEBPACK_IMPORTED_MODULE_18__["PeriodComponent"],
                _components_global_reports_components_historical_exchange_rates_report_components_sort_by_sort_by_component__WEBPACK_IMPORTED_MODULE_19__["SortByComponent"],
                _components_global_reports_components_new_biz_report_new_biz_report_component__WEBPACK_IMPORTED_MODULE_21__["NewBizReportComponent"],
                _components_global_reports_components_pnl_reports_pnl_reports_component__WEBPACK_IMPORTED_MODULE_28__["PnlReportsComponent"],
                _components_global_reports_components_pnl_reports_ldrep_manual_adjustment_report_ldrep_manual_adjustment_report_component__WEBPACK_IMPORTED_MODULE_25__["LdrepManualAdjustmentReportComponent"],
                _components_accounting_documents_report_accounting_documents_report_component__WEBPACK_IMPORTED_MODULE_7__["AccountingDocumentsReportComponent"],
                _components_accounting_documents_report_components_document_status_dropdown_document_status_dropdown_component__WEBPACK_IMPORTED_MODULE_8__["DocumentStatusDropdownComponent"],
                _components_accounting_documents_report_components_document_type_dropdown_document_type_dropdown_component__WEBPACK_IMPORTED_MODULE_9__["DocumentTypeDropdownComponent"],
                _components_global_reports_components_pnl_reports_validation_dialog_validation_dialog_component__WEBPACK_IMPORTED_MODULE_29__["ValidationDialogComponent"],
                _components_global_reports_components_client_report_tabs_overview_overview_component__WEBPACK_IMPORTED_MODULE_15__["OverviewComponent"],
                _components_global_reports_components_client_report_tabs_detail_detail_component__WEBPACK_IMPORTED_MODULE_14__["DetailComponent"],
                _components_global_reports_components_nominal_report_tabs_detail_tab_detail_tab_component__WEBPACK_IMPORTED_MODULE_23__["DetailTabComponent"],
                _components_global_reports_components_nominal_report_tabs_overview_tab_overview_tab_component__WEBPACK_IMPORTED_MODULE_24__["OverviewTabComponent"],
                _components_custom_reports_custom_reports_component__WEBPACK_IMPORTED_MODULE_11__["CustomReportsComponent"],
                _components_custom_reports_custom_report_viewer_custom_report_viewer_component__WEBPACK_IMPORTED_MODULE_10__["CustomReportViewerComponent"],
            ],
            providers: [
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DATE_LOCALE"], useValue: 'en' },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_2__["DateAdapter"], useClass: _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_3__["MomentDateAdapter"] },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DATE_FORMATS"], useValue: _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["ATLAS_DATE_FORMATS"] },
            ],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["CUSTOM_ELEMENTS_SCHEMA"]],
        })
    ], ReportingModule);
    return ReportingModule;
}());



/***/ }),

/***/ "./Client/app/reporting/reporting.route.ts":
/*!*************************************************!*\
  !*** ./Client/app/reporting/reporting.route.ts ***!
  \*************************************************/
/*! exports provided: routes, ReportingRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingRoutingModule", function() { return ReportingRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/guards/security.guard */ "./Client/app/shared/guards/security.guard.ts");
/* harmony import */ var _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/resolvers/company-date.resolver */ "./Client/app/shared/resolvers/company-date.resolver.ts");
/* harmony import */ var _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/resolvers/form-configuration.resolver */ "./Client/app/shared/resolvers/form-configuration.resolver.ts");
/* harmony import */ var _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/resolvers/masterdata.resolver */ "./Client/app/shared/resolvers/masterdata.resolver.ts");
/* harmony import */ var _components_accounting_documents_report_accounting_documents_report_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/accounting-documents-report/accounting-documents-report.component */ "./Client/app/reporting/components/accounting-documents-report/accounting-documents-report.component.ts");
/* harmony import */ var _components_custom_reports_custom_reports_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/custom-reports/custom-reports.component */ "./Client/app/reporting/components/custom-reports/custom-reports.component.ts");
/* harmony import */ var _components_global_reports_components_audit_report_audit_report_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/global-reports/components/audit-report/audit-report.component */ "./Client/app/reporting/components/global-reports/components/audit-report/audit-report.component.ts");
/* harmony import */ var _components_global_reports_components_client_report_client_report_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/global-reports/components/client-report/client-report.component */ "./Client/app/reporting/components/global-reports/components/client-report/client-report.component.ts");
/* harmony import */ var _components_global_reports_components_fx_exposure_report_fx_exposure_report_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/global-reports/components/fx-exposure-report/fx-exposure-report.component */ "./Client/app/reporting/components/global-reports/components/fx-exposure-report/fx-exposure-report.component.ts");
/* harmony import */ var _components_global_reports_components_historical_exchange_rates_report_historical_exchange_rates_report_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component */ "./Client/app/reporting/components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component.ts");
/* harmony import */ var _components_global_reports_components_new_biz_report_new_biz_report_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/global-reports/components/new-biz-report/new-biz-report.component */ "./Client/app/reporting/components/global-reports/components/new-biz-report/new-biz-report.component.ts");
/* harmony import */ var _components_global_reports_components_nominal_report_nominal_report_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/global-reports/components/nominal-report/nominal-report.component */ "./Client/app/reporting/components/global-reports/components/nominal-report/nominal-report.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_pnl_movement_report_pnl_movement_report_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component.ts");
/* harmony import */ var _components_global_reports_components_pnl_reports_pnl_reports_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/global-reports/components/pnl-reports/pnl-reports.component */ "./Client/app/reporting/components/global-reports/components/pnl-reports/pnl-reports.component.ts");
/* harmony import */ var _components_global_reports_components_trade_cost_movement_report_trade_cost_movement_report_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component */ "./Client/app/reporting/components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component.ts");
/* harmony import */ var _components_global_reports_components_trade_cost_report_trade_cost_report_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/global-reports/components/trade-cost-report/trade-cost-report.component */ "./Client/app/reporting/components/global-reports/components/trade-cost-report/trade-cost-report.component.ts");
/* harmony import */ var _components_global_reports_components_trade_report_trade_report_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/global-reports/components/trade-report/trade-report.component */ "./Client/app/reporting/components/global-reports/components/trade-report/trade-report.component.ts");
/* harmony import */ var _components_global_reports_global_reports_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/global-reports/global-reports.component */ "./Client/app/reporting/components/global-reports/global-reports.component.ts");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./home/home.component */ "./Client/app/reporting/home/home.component.ts");
/* harmony import */ var _ldeom_ldeom_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./ldeom/ldeom.component */ "./Client/app/reporting/ldeom/ldeom.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};























var routes = [
    {
        path: '',
        component: _home_home_component__WEBPACK_IMPORTED_MODULE_21__["HomeComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'ldeom',
        component: _ldeom_ldeom_component__WEBPACK_IMPORTED_MODULE_22__["LdeomComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'ldeom',
            title: 'Ldeom',
            isHomePage: false,
            privilegeLevel1Name: null,
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports',
        component: _components_global_reports_global_reports_component__WEBPACK_IMPORTED_MODULE_20__["GlobalReportsComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'globalreports', title: 'Global Reports', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalReports',
                    permission: 1,
                    parentLevelOne: 'Reports',
                },
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/accountingdocumentsreport',
        component: _components_accounting_documents_report_accounting_documents_report_component__WEBPACK_IMPORTED_MODULE_7__["AccountingDocumentsReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'accountingdocumentsreport',
            title: 'Accounting Documents Report',
            formId: 'AccDocReport',
            isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].TransactionDocumentType,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].TransactionDocumentStatus,
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'customreports',
        component: _components_custom_reports_custom_reports_component__WEBPACK_IMPORTED_MODULE_8__["CustomReportsComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'customreports', title: 'Custom Reports', isHomePage: false, privilegeLevel1Name: null,
            // authorizations: [
            //     {
            //         privilegeName: 'CustomReports',
            //         permission: 1,
            //         parentLevelOne: 'Reports',
            //     },
            // ],
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
        },
    },
    {
        path: 'globalreports/tradecost',
        component: _components_global_reports_components_trade_cost_report_trade_cost_report_component__WEBPACK_IMPORTED_MODULE_18__["TradeCostReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'tradecost',
            title: 'Trade Cost Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'TradeCostReport',
                    permission: 1,
                    parentLevelOne: 'GlobalReports',
                    parentLevelTwo: 'Reports',
                },
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
        },
    },
    {
        path: 'globalreports/tradecostmovement',
        component: _components_global_reports_components_trade_cost_movement_report_trade_cost_movement_report_component__WEBPACK_IMPORTED_MODULE_17__["TradeCostMovementReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'tradecostmovement',
            title: 'Trade Cost Movement Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
        },
    },
    {
        path: 'globalreports/newbiz',
        component: _components_global_reports_components_new_biz_report_new_biz_report_component__WEBPACK_IMPORTED_MODULE_13__["NewBizReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'newBiz',
            title: 'New Biz Report',
            isHomePage: false,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].WeightUnits,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/pnlreports',
        component: _components_global_reports_components_pnl_reports_pnl_reports_component__WEBPACK_IMPORTED_MODULE_16__["PnlReportsComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            formId: 'PnlReports',
            animation: 'pnlreports',
            title: 'P&L Reports',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].ProfitCenters,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].PNLTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Commodities,
            ],
            authorizations: [
                {
                    privilegeName: 'PLReport',
                    permission: 1,
                    parentLevelOne: 'GlobalReports',
                    parentLevelTwo: 'Reports',
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/pnlmovementreport',
        component: _components_global_reports_components_pnl_reports_pnl_movement_report_pnl_movement_report_component__WEBPACK_IMPORTED_MODULE_15__["PnlMovementReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'pnlmovementreport',
            title: 'P&L Movement Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].ProfitCenters,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'PLMovementReport',
                    permission: 1,
                    parentLevelOne: 'GlobalReports',
                    parentLevelTwo: 'Reports',
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/audit',
        component: _components_global_reports_components_audit_report_audit_report_component__WEBPACK_IMPORTED_MODULE_9__["AuditReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'auditreport',
            title: 'Audit report',
            isHomePage: false,
            privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'AuditReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/trade',
        component: _components_global_reports_components_trade_report_trade_report_component__WEBPACK_IMPORTED_MODULE_19__["TradeReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'tradereport',
            title: 'Trade Report',
            formId: 'TradeReport',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].WeightUnits,
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/trade/:counterPartyId',
        component: _components_global_reports_components_trade_report_trade_report_component__WEBPACK_IMPORTED_MODULE_19__["TradeReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'tradereport',
            title: 'Trade Report',
            formId: 'TradeReport',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].WeightUnits,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
            ],
            authorizations: [
                {
                    privilegeName: 'TradeReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
        },
    },
    {
        path: 'globalreports/clientreport',
        component: _components_global_reports_components_client_report_client_report_component__WEBPACK_IMPORTED_MODULE_10__["ClientReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            formId: 'ClientReport',
            animation: 'clientreport',
            title: 'Client Transaction report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].CostTypes,
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
        },
    },
    {
        path: 'globalreports/clientreport/:counterPartyId',
        component: _components_global_reports_components_client_report_client_report_component__WEBPACK_IMPORTED_MODULE_10__["ClientReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            formId: 'ClientReport',
            animation: 'clientreport',
            title: 'Client Transaction report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
            ],
            authorizations: [
                {
                    privilegeName: 'ClientTransactionReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
        },
    },
    {
        path: 'globalreports/nominalreport',
        component: _components_global_reports_components_nominal_report_nominal_report_component__WEBPACK_IMPORTED_MODULE_14__["NominalReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            formId: 'NominalReport', animation: 'nominalreport', title: 'Nominal Ledger Transactional Report',
            isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'NominalReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].NominalAccounts,
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_5__["FormConfigurationResolver"],
        },
    },
    {
        path: 'globalreports/historicalrates',
        component: _components_global_reports_components_historical_exchange_rates_report_historical_exchange_rates_report_component__WEBPACK_IMPORTED_MODULE_12__["HistoricalExchangeRatesReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'historicalrates',
            title: 'Historical Exchange Rate Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
        },
    },
    {
        path: 'globalreports/fxexposurerate',
        component: _components_global_reports_components_fx_exposure_report_fx_exposure_report_component__WEBPACK_IMPORTED_MODULE_11__["FxExposureReportComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_3__["SecurityGuard"]],
        data: {
            animation: 'fxexposurerate',
            title: 'Fx Exposure Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'FxExposureReport',
                    permission: 2,
                    parentLevelOne: 'Reports',
                    parentLevelTwo: 'GlobalReports',
                },
            ],
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_4__["CompanyDateResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_6__["MasterDataResolver"],
        },
    },
];
var ReportingRoutingModule = /** @class */ (function () {
    function ReportingRoutingModule() {
    }
    ReportingRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        })
    ], ReportingRoutingModule);
    return ReportingRoutingModule;
}());



/***/ }),

/***/ "./Client/app/shared/entities/ammendments-type.entity.ts":
/*!***************************************************************!*\
  !*** ./Client/app/shared/entities/ammendments-type.entity.ts ***!
  \***************************************************************/
/*! exports provided: AmendmentsType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AmendmentsType", function() { return AmendmentsType; });
var AmendmentsType = /** @class */ (function () {
    function AmendmentsType(value, name) {
        this.value = value;
        this.name = name;
    }
    AmendmentsType.getAmendmentsTypeList = function () {
        this.list =
            [
                this.physicalAmendments,
                this.costsAmendments,
                this.invoiceGoods,
                this.invoiceCosts,
            ];
        return this.list;
    };
    AmendmentsType.getFXDealAmendmentsTypeList = function () {
        this.list =
            [
                this.fxDealAmendments,
            ];
        return this.list;
    };
    AmendmentsType.getAmendmentsTypeStringList = function () {
        if (!this.list) {
            this.list =
                [
                    this.physicalAmendments,
                    this.costsAmendments,
                    this.invoiceGoods,
                    this.invoiceCosts,
                    this.fxDealAmendments,
                ];
        }
        return this.list.map(function (item) { return item.name; });
    };
    AmendmentsType.physicalAmendments = new AmendmentsType(1, 'Physicals Amendments');
    AmendmentsType.costsAmendments = new AmendmentsType(2, 'Costs Amendments');
    AmendmentsType.invoiceGoods = new AmendmentsType(3, 'Invoices Goods');
    AmendmentsType.invoiceCosts = new AmendmentsType(4, 'Invoices Costs');
    AmendmentsType.fxDealAmendments = new AmendmentsType(5, 'FX Deal Amendments');
    return AmendmentsType;
}());



/***/ }),

/***/ "./Client/app/shared/entities/columns.list.ts":
/*!****************************************************!*\
  !*** ./Client/app/shared/entities/columns.list.ts ***!
  \****************************************************/
/*! exports provided: ColumnsList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnsList", function() { return ColumnsList; });
var ColumnsList = /** @class */ (function () {
    function ColumnsList(value, name) {
        this.value = value;
        this.name = name;
    }
    ColumnsList.getColumnsList = function () {
        if (!this.list) {
            this.list =
                [
                    this.cmy1,
                ];
        }
        return this.list;
    };
    ColumnsList.getColumnsStringList = function () {
        if (!this.list) {
            this.list =
                [
                    this.cmy1,
                ];
        }
        return this.list.map(function (item) { return item.name; });
    };
    ColumnsList.cmy1 = new ColumnsList(1, 'Cmy1');
    return ColumnsList;
}());



/***/ }),

/***/ "./Client/app/shared/entities/ldeom-accrual.entity.ts":
/*!************************************************************!*\
  !*** ./Client/app/shared/entities/ldeom-accrual.entity.ts ***!
  \************************************************************/
/*! exports provided: LdeomAccrual */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdeomAccrual", function() { return LdeomAccrual; });
var LdeomAccrual = /** @class */ (function () {
    function LdeomAccrual(ac) {
        this.departmentCode = ac.departmentCode;
        this.departmentDescription = ac.departmentDescription;
        this.contractLabel = ac.contractLabel;
        this.costType = ac.costType;
        this.quantity = ac.quantity;
        this.currency = ac.currency;
        this.fullValue = ac.fullValue;
        this.invoicedValue = ac.invoicedValue;
        this.accrueAmount = ac.accrueAmount;
        this.associatedClient = ac.associatedClient;
        this.charterReference = ac.charterReference;
    }
    LdeomAccrual.prototype.isHeaderLine = function () {
        return this.departmentDescription && this.contractLabel === null;
    };
    LdeomAccrual.prototype.isTotalHeaderLine = function () {
        return this.departmentDescription === null && this.costType === null;
    };
    LdeomAccrual.prototype.isTotalLine = function () {
        return this.costType && this.contractLabel === null;
    };
    return LdeomAccrual;
}());



/***/ }),

/***/ "./Client/app/shared/entities/ldrep-manual-adjustment-records.entity.ts":
/*!******************************************************************************!*\
  !*** ./Client/app/shared/entities/ldrep-manual-adjustment-records.entity.ts ***!
  \******************************************************************************/
/*! exports provided: LdrepManualAdjustmentRecords */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdrepManualAdjustmentRecords", function() { return LdrepManualAdjustmentRecords; });
var LdrepManualAdjustmentRecords = /** @class */ (function () {
    function LdrepManualAdjustmentRecords() {
    }
    return LdrepManualAdjustmentRecords;
}());



/***/ }),

/***/ "./Client/app/shared/entities/ldrep-manual-adjustment.entity.ts":
/*!**********************************************************************!*\
  !*** ./Client/app/shared/entities/ldrep-manual-adjustment.entity.ts ***!
  \**********************************************************************/
/*! exports provided: LdrepManualAdjustment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdrepManualAdjustment", function() { return LdrepManualAdjustment; });
var LdrepManualAdjustment = /** @class */ (function () {
    function LdrepManualAdjustment() {
        this.ldrepManualAdjustmentRecords = [];
    }
    return LdrepManualAdjustment;
}());



/***/ }),

/***/ "./Client/app/shared/enums/atlas-service-names.enum.ts":
/*!*************************************************************!*\
  !*** ./Client/app/shared/enums/atlas-service-names.enum.ts ***!
  \*************************************************************/
/*! exports provided: AtlasServiceNames */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AtlasServiceNames", function() { return AtlasServiceNames; });
var AtlasServiceNames;
(function (AtlasServiceNames) {
    AtlasServiceNames[AtlasServiceNames["Trading"] = 0] = "Trading";
    AtlasServiceNames[AtlasServiceNames["MasterData"] = 1] = "MasterData";
    AtlasServiceNames[AtlasServiceNames["Execution"] = 2] = "Execution";
    AtlasServiceNames[AtlasServiceNames["Controlling"] = 3] = "Controlling";
    AtlasServiceNames[AtlasServiceNames["UserIdentity"] = 4] = "UserIdentity";
    AtlasServiceNames[AtlasServiceNames["PreAccounting"] = 5] = "PreAccounting";
    AtlasServiceNames[AtlasServiceNames["Document"] = 6] = "Document";
    AtlasServiceNames[AtlasServiceNames["Configuration"] = 7] = "Configuration";
    AtlasServiceNames[AtlasServiceNames["Freeze"] = 8] = "Freeze";
    AtlasServiceNames[AtlasServiceNames["Reporting"] = 9] = "Reporting";
})(AtlasServiceNames || (AtlasServiceNames = {}));


/***/ }),

/***/ "./Client/app/shared/enums/balances-type.enum.ts":
/*!*******************************************************!*\
  !*** ./Client/app/shared/enums/balances-type.enum.ts ***!
  \*******************************************************/
/*! exports provided: BalancesType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BalancesType", function() { return BalancesType; });
var BalancesType;
(function (BalancesType) {
    BalancesType[BalancesType["Debitors"] = 1] = "Debitors";
    BalancesType[BalancesType["Creditors"] = 2] = "Creditors";
    BalancesType[BalancesType["Both"] = 3] = "Both";
    BalancesType[BalancesType["ToPay"] = 4] = "ToPay";
    BalancesType[BalancesType["ToReceive"] = 5] = "ToReceive";
})(BalancesType || (BalancesType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/event-type.enum.ts":
/*!****************************************************!*\
  !*** ./Client/app/shared/enums/event-type.enum.ts ***!
  \****************************************************/
/*! exports provided: EventType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventType", function() { return EventType; });
var EventType;
(function (EventType) {
    EventType[EventType["Insert"] = 0] = "Insert";
    EventType[EventType["Delete"] = 1] = "Delete";
    EventType[EventType["Update"] = 2] = "Update";
})(EventType || (EventType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/functional-area.enum.ts":
/*!*********************************************************!*\
  !*** ./Client/app/shared/enums/functional-area.enum.ts ***!
  \*********************************************************/
/*! exports provided: FunctionalArea */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionalArea", function() { return FunctionalArea; });
var FunctionalArea;
(function (FunctionalArea) {
    FunctionalArea[FunctionalArea["Trades"] = 0] = "Trades";
    FunctionalArea[FunctionalArea["Charters"] = 1] = "Charters";
    FunctionalArea[FunctionalArea["AccountingEntries"] = 2] = "AccountingEntries";
    FunctionalArea[FunctionalArea["Users"] = 3] = "Users";
    FunctionalArea[FunctionalArea["Counterparties"] = 4] = "Counterparties";
    FunctionalArea[FunctionalArea["Vessels"] = 5] = "Vessels";
    FunctionalArea[FunctionalArea["NominalAccountLedger"] = 6] = "NominalAccountLedger";
})(FunctionalArea || (FunctionalArea = {}));


/***/ }),

/***/ "./Client/app/shared/enums/matchings-type.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/matchings-type.enum.ts ***!
  \********************************************************/
/*! exports provided: MatchingsType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatchingsType", function() { return MatchingsType; });
var MatchingsType;
(function (MatchingsType) {
    MatchingsType[MatchingsType["Unmatched"] = 1] = "Unmatched";
    MatchingsType[MatchingsType["Matched"] = 2] = "Matched";
    MatchingsType[MatchingsType["Both"] = 3] = "Both";
})(MatchingsType || (MatchingsType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/newBizDateType.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/newBizDateType.enum.ts ***!
  \********************************************************/
/*! exports provided: newBizDateType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newBizDateType", function() { return newBizDateType; });
var newBizDateType;
(function (newBizDateType) {
    newBizDateType[newBizDateType["ContractDate"] = 1] = "ContractDate";
    newBizDateType[newBizDateType["CreatedDate"] = 2] = "CreatedDate";
})(newBizDateType || (newBizDateType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/newBizNewContractType-enum.ts":
/*!***************************************************************!*\
  !*** ./Client/app/shared/enums/newBizNewContractType-enum.ts ***!
  \***************************************************************/
/*! exports provided: newBizNewContractType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newBizNewContractType", function() { return newBizNewContractType; });
var newBizNewContractType;
(function (newBizNewContractType) {
    newBizNewContractType[newBizNewContractType["PhysicalsFlatPriceContracts"] = 1] = "PhysicalsFlatPriceContracts";
    newBizNewContractType[newBizNewContractType["FXDeals"] = 2] = "FXDeals";
})(newBizNewContractType || (newBizNewContractType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/newBizStyleType.enum.ts":
/*!*********************************************************!*\
  !*** ./Client/app/shared/enums/newBizStyleType.enum.ts ***!
  \*********************************************************/
/*! exports provided: newBizStyleType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newBizStyleType", function() { return newBizStyleType; });
var newBizStyleType;
(function (newBizStyleType) {
    newBizStyleType[newBizStyleType["TradeNet"] = 1] = "TradeNet";
})(newBizStyleType || (newBizStyleType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/newbiz-summary-details.enum.ts":
/*!****************************************************************!*\
  !*** ./Client/app/shared/enums/newbiz-summary-details.enum.ts ***!
  \****************************************************************/
/*! exports provided: NewBizSummaryDetails */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewBizSummaryDetails", function() { return NewBizSummaryDetails; });
var NewBizSummaryDetails;
(function (NewBizSummaryDetails) {
    NewBizSummaryDetails[NewBizSummaryDetails["Summary"] = 1] = "Summary";
    NewBizSummaryDetails[NewBizSummaryDetails["Detail"] = 2] = "Detail";
    NewBizSummaryDetails[NewBizSummaryDetails["SummaryAndDetail"] = 3] = "SummaryAndDetail";
})(NewBizSummaryDetails || (NewBizSummaryDetails = {}));


/***/ }),

/***/ "./Client/app/shared/enums/nominal-account-type-enum.ts":
/*!**************************************************************!*\
  !*** ./Client/app/shared/enums/nominal-account-type-enum.ts ***!
  \**************************************************************/
/*! exports provided: NominalAccountType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NominalAccountType", function() { return NominalAccountType; });
var NominalAccountType;
(function (NominalAccountType) {
    NominalAccountType[NominalAccountType["Both"] = 1] = "Both";
    NominalAccountType[NominalAccountType["PandL"] = 2] = "PandL";
    NominalAccountType[NominalAccountType["BS"] = 3] = "BS";
})(NominalAccountType || (NominalAccountType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/report-sort-type.enum.ts":
/*!**********************************************************!*\
  !*** ./Client/app/shared/enums/report-sort-type.enum.ts ***!
  \**********************************************************/
/*! exports provided: ReportSortType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportSortType", function() { return ReportSortType; });
var ReportSortType;
(function (ReportSortType) {
    ReportSortType[ReportSortType["Currency"] = 0] = "Currency";
    ReportSortType[ReportSortType["Date"] = 1] = "Date";
})(ReportSortType || (ReportSortType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/report-style-type.enum.ts":
/*!***********************************************************!*\
  !*** ./Client/app/shared/enums/report-style-type.enum.ts ***!
  \***********************************************************/
/*! exports provided: ReportStyleType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportStyleType", function() { return ReportStyleType; });
var ReportStyleType;
(function (ReportStyleType) {
    ReportStyleType[ReportStyleType["Transactions"] = 1] = "Transactions";
    ReportStyleType[ReportStyleType["Summary"] = 2] = "Summary";
})(ReportStyleType || (ReportStyleType = {}));


/***/ }),

/***/ "./Client/app/shared/enums/unmatched-type.enum.ts":
/*!********************************************************!*\
  !*** ./Client/app/shared/enums/unmatched-type.enum.ts ***!
  \********************************************************/
/*! exports provided: UnmatchedType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnmatchedType", function() { return UnmatchedType; });
var UnmatchedType;
(function (UnmatchedType) {
    UnmatchedType[UnmatchedType["Now"] = 1] = "Now";
    UnmatchedType[UnmatchedType["PeriodStart"] = 2] = "PeriodStart";
    UnmatchedType[UnmatchedType["PeriodEnd"] = 3] = "PeriodEnd";
})(UnmatchedType || (UnmatchedType = {}));


/***/ }),

/***/ "./Client/app/shared/services/controlling/dtos/ldeom-posting.ts":
/*!**********************************************************************!*\
  !*** ./Client/app/shared/services/controlling/dtos/ldeom-posting.ts ***!
  \**********************************************************************/
/*! exports provided: LdeomPostingResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LdeomPostingResult", function() { return LdeomPostingResult; });
var LdeomPostingResult = /** @class */ (function () {
    function LdeomPostingResult() {
    }
    return LdeomPostingResult;
}());



/***/ }),

/***/ "./Client/app/shared/services/execution/dtos/transaction-report-command.ts":
/*!*********************************************************************************!*\
  !*** ./Client/app/shared/services/execution/dtos/transaction-report-command.ts ***!
  \*********************************************************************************/
/*! exports provided: TransactionReportCommand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransactionReportCommand", function() { return TransactionReportCommand; });
var TransactionReportCommand = /** @class */ (function () {
    function TransactionReportCommand() {
    }
    return TransactionReportCommand;
}());



/***/ }),

/***/ "./Client/app/shared/services/http-services/reporting.service.ts":
/*!***********************************************************************!*\
  !*** ./Client/app/shared/services/http-services/reporting.service.ts ***!
  \***********************************************************************/
/*! exports provided: ReportingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingService", function() { return ReportingService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../dtos/list-and-search/list-and-search-filter-dto.dto */ "./Client/app/shared/dtos/list-and-search/list-and-search-filter-dto.dto.ts");
/* harmony import */ var _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../entities/http-services/http-request-options.entity */ "./Client/app/shared/entities/http-services/http-request-options.entity.ts");
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







var ReportingService = /** @class */ (function (_super) {
    __extends(ReportingService, _super);
    function ReportingService(http, companyManager) {
        var _this = _super.call(this, http) || this;
        _this.http = http;
        _this.companyManager = companyManager;
        _this.reportPredicatesControllerUrl = 'reportpredicates';
        _this.ldrepManualAdjustmentControllerUrl = 'ldrepmanualadjustment';
        _this.PnlMovementControllerUrl = 'pnlmovement';
        return _this;
    }
    ReportingService.prototype.createReportCriterias = function (gridId, filters) {
        var company = this.companyManager.getCurrentCompanyId();
        var filtersForColumns = filters.map(function (filter) {
            return new _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_4__["ListAndSearchFilterDto"](filter);
        });
        var request = {
            gridName: gridId,
            clauses: { clauses: filtersForColumns },
        };
        return this.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company)) + "/" + this.reportPredicatesControllerUrl, request);
    };
    ReportingService.prototype.createUpdateLdrepManualAdjustment = function (adjustments) {
        var company = this.companyManager.getCurrentCompanyId();
        return this.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company))
            + ("/" + this.ldrepManualAdjustmentControllerUrl + "/createupdateadjustment"), adjustments);
    };
    ReportingService.prototype.deleteLdrepManualAdjustments = function (ldrepManualAdjustment) {
        var company = this.companyManager.getCurrentCompanyId();
        var action = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company))
            + ("/" + this.ldrepManualAdjustmentControllerUrl + "/deletemanualadjustment");
        return this.post(action, ldrepManualAdjustment);
    };
    ReportingService.prototype.getAllLdrepManualAdjustments = function (fromDate, toDate) {
        var company = this.companyManager.getCurrentCompanyId();
        var options = new _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_5__["HttpRequestOptions"]();
        options.headers = this.defaultHttpHeaders;
        var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpParams"]();
        if (fromDate) {
            queryParameters = queryParameters.set('fromDate', fromDate.toISOString());
        }
        if (toDate) {
            queryParameters = queryParameters.set('toDate', toDate.toISOString());
        }
        options.params = queryParameters;
        return this.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company))
            + ("/" + this.ldrepManualAdjustmentControllerUrl + "/getldrepmanualadjustments"), options);
    };
    ReportingService.prototype.getPnlMovementSummaryMessage = function (companyList, dataVersionId, compDataVersionId) {
        var company = this.companyManager.getCurrentCompanyId();
        var options = new _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_5__["HttpRequestOptions"]();
        options.headers = this.defaultHttpHeaders;
        var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpParams"]();
        if (companyList) {
            queryParameters = queryParameters.set('companyList', companyList.toString());
        }
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionIdList', dataVersionId.toString());
        }
        if (compDataVersionId) {
            queryParameters = queryParameters.set('compDataVersionIdList', compDataVersionId.toString());
        }
        options.params = queryParameters;
        return this.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company))
            + ("/" + this.PnlMovementControllerUrl), options);
    };
    ReportingService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"]])
    ], ReportingService);
    return ReportingService;
}(_http_base_service__WEBPACK_IMPORTED_MODULE_6__["HttpBaseService"]));



/***/ }),

/***/ "./Client/app/shared/services/list-and-search/tradeReport-data-loader.ts":
/*!*******************************************************************************!*\
  !*** ./Client/app/shared/services/list-and-search/tradeReport-data-loader.ts ***!
  \*******************************************************************************/
/*! exports provided: TradeReportDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeReportDataLoader", function() { return TradeReportDataLoader; });
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




var TradeReportDataLoader = /** @class */ (function () {
    function TradeReportDataLoader(tradingService) {
        this.tradingService = tradingService;
    }
    TradeReportDataLoader.prototype.getData = function (filters, dataVersionId, offset, limit) {
        var filtersForColumns = filters.map(function (filter) {
            return new _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__["ListAndSearchFilterDto"](filter);
        });
        var request = {
            clauses: { clauses: filtersForColumns },
            offset: offset,
            limit: limit,
            dataVersionId: dataVersionId,
        };
        var list = this.tradingService.getTradeReportData(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data;
        }));
        return list;
    };
    TradeReportDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_trading_service__WEBPACK_IMPORTED_MODULE_3__["TradingService"]])
    ], TradeReportDataLoader);
    return TradeReportDataLoader;
}());



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


/***/ })

}]);
//# sourceMappingURL=reporting-reporting-module.js.map