(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["hidden-hidden-module"],{

/***/ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.html":
/*!*************************************************************************************************************!*\
  !*** ./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.html ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container ux-component-list\">\r\n    <div layout=\"row\" layout-fill>\r\n        <header color=\"accent\">\r\n            <div class=\"docs-header-section\">\r\n                <div class=\"docs-header-headline\">\r\n                    <h1> Background Process </h1>\r\n                </div>\r\n                <mat-card>\r\n                    <div>\r\n                        Filter options\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayout.md=\"column\"\r\n                         fxLayoutAlign=\"space-around start\"\r\n                         class=\"top-section\">\r\n                        <!-- Left -->\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start left\"\r\n                             fxFlex=\"40\">\r\n                            <mat-form-field>\r\n                                <input matInput [matDatepicker]=\"pickerDateBegin\"\r\n                                       placeholder=\"Choose a begining date\"\r\n                                       (dateInput)=\"addDateBegin('input', $event)\">\r\n                                <mat-datepicker-toggle matSuffix [for]=\"pickerDateBegin\"></mat-datepicker-toggle>\r\n                                <mat-datepicker #pickerDateBegin></mat-datepicker>\r\n                            </mat-form-field>\r\n                        </div>\r\n                        <!-- Right -->\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start right\"\r\n                             fxFlex=\"40\">\r\n                            <mat-form-field>\r\n                                <input matInput [matDatepicker]=\"pickerDateEnd\"\r\n                                       placeholder=\"Choose an ending date\"\r\n                                       (dateInput)=\"addDateEnd('input', $event)\">\r\n                                <mat-datepicker-toggle matSuffix [for]=\"pickerDateEnd\"></mat-datepicker-toggle>\r\n                                <mat-datepicker #pickerDateEnd></mat-datepicker>\r\n                            </mat-form-field>\r\n                        </div>\r\n                    </div>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayout.md=\"column\"\r\n                         fxLayoutAlign=\"space-around start\"\r\n                         class=\"top-section\">\r\n                        <!-- Left -->\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start left\"\r\n                             fxFlex=\"40\">\r\n                            <mat-form-field color=\"accent\">\r\n                                <mat-select [multiple]=\"true\"\r\n                                            placeholder=\"Choose the process name for filtering\"\r\n                                            [formControl]=\"formCtrlName\">\r\n                                    <mat-option *ngFor=\"let name of allProcessName\"\r\n                                                [value]=\"name\">\r\n                                        <span style=\"color:black\">{{ name }}</span>\r\n                                    </mat-option>\r\n                                </mat-select>\r\n                            </mat-form-field>\r\n                        </div>\r\n                        <!-- Right -->\r\n                        <div fxLayout=\"column\"\r\n                             fxLayoutAlign=\"start right\"\r\n                             fxFlex=\"40\">\r\n                            <mat-form-field color=\"accent\" *ngIf=\"loadingStatus\">\r\n                                <mat-select [multiple]=\"true\"\r\n                                            placeholder=\"Choose the status for filtering\"\r\n                                            [formControl]=\"formCtrlStatus\">\r\n                                    <mat-option *ngFor=\"let option of allStatus\"\r\n                                                [value]=\"option\">\r\n                                        <span style=\"color:black\">{{ option.enumEntityValue }}</span>\r\n                                    </mat-option>\r\n                                </mat-select>\r\n                            </mat-form-field>\r\n                        </div>\r\n                    </div>\r\n                </mat-card>             \r\n                <button mat-button (click)=\"onFilterButtonClicked()\" style=\"left:1030px\">\r\n                        Apply Filter\r\n                </button>\r\n                <div ag-grid=\"displayErrorMessage\" class=\"ag-theme-material pointer-cursor\" *ngIf=\"isFiltered\">\r\n                    <ag-grid-angular class=\"ag-theme-material\"\r\n                                         [rowData]=\"processMessageGridRows\"\r\n                                         [columnDefs]=\"processMessageGridColumns\"\r\n                                         domLayout=autoHeight\r\n                                         [pagination]=\"true\"\r\n                                         [paginationPageSize]=\"10\"\r\n                                         [enableSorting]=\"true\"\r\n                                         [enableColResize]=\"true\"\r\n                                         [context]=\"gridContext\"\r\n                                         enableFilter\r\n                                         [rowHeight]=\"atlasAgGridParam.rowHeight\">\r\n                    </ag-grid-angular>\r\n                </div>\r\n            </div>\r\n        </header>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.scss":
/*!*************************************************************************************************************!*\
  !*** ./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.scss ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.ts":
/*!***********************************************************************************************************!*\
  !*** ./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.ts ***!
  \***********************************************************************************************************/
/*! exports provided: BackgroundInterfaceErrorsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BackgroundInterfaceErrorsComponent", function() { return BackgroundInterfaceErrorsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _shared_services_http_services_http_base_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/services/http-services/http-base.service */ "./Client/app/shared/services/http-services/http-base.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_http_services_preaccounting_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/services/http-services/preaccounting.service */ "./Client/app/shared/services/http-services/preaccounting.service.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/entities/masterdata.entity */ "./Client/app/shared/entities/masterdata.entity.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/components/ag-contextual-menu/ag-contextual-menu.component */ "./Client/app/shared/components/ag-contextual-menu/ag-contextual-menu.component.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
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











var BackgroundInterfaceErrorsComponent = /** @class */ (function (_super) {
    __extends(BackgroundInterfaceErrorsComponent, _super);
    function BackgroundInterfaceErrorsComponent(http, snackbarService, preaccountingService, masterdataService, gridService) {
        var _this = _super.call(this, http) || this;
        _this.http = http;
        _this.snackbarService = snackbarService;
        _this.preaccountingService = preaccountingService;
        _this.masterdataService = masterdataService;
        _this.gridService = gridService;
        _this.accountingDocumentsControllerUrl = 'AccountingDocuments';
        _this.userMenuActions = {
            launchRetry: 'retry',
        };
        _this.dateBegin = new Date();
        _this.dateEnd = new Date();
        _this.formCtrlName = new _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"]();
        _this.formCtrlStatus = new _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"]();
        _this.loadingStatus = false;
        _this.allStatus = [];
        _this.masterData = new _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_7__["MasterData"]();
        _this.isFiltered = false;
        return _this;
    }
    BackgroundInterfaceErrorsComponent.prototype.ngOnInit = function () {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.userGridContextualMenuActions = [
            {
                icon: 'settings_backup_restore',
                text: 'Launch Retry',
                action: this.userMenuActions.launchRetry,
            },
        ];
        this.processMessageGridColumns = [
            { headerName: 'Name', field: 'name' },
            { headerName: 'Content', field: 'content' },
            { headerName: 'CreatedDateTime', field: 'createdDateTime' },
            { headerName: 'Status', field: 'status' },
            { headerName: 'Retry', field: 'retry' },
            {
                headerName: '',
                cellRendererFramework: _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_9__["AgContextualMenuComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.userGridContextualMenuActions,
                },
            },
            { headerName: 'Error', field: 'error' }
        ];
        this.initFilterName();
        this.initFilterStatus();
        this.dateBegin.setFullYear(1, 1, 1);
        this.dateEnd.setFullYear(9000, 12, 12);
    };
    BackgroundInterfaceErrorsComponent.prototype.handleAction = function (action, message) {
        var _this = this;
        switch (action) {
            case this.userMenuActions.launchRetry:
                if (message) {
                    if (message.messageId) {
                        console.log(message);
                        this.preaccountingService.updateProcessRetry(message.messageId).subscribe(function () {
                            _this.snackbarService.informationSnackBar('Process has been reset successfully.');
                            _this.loadData();
                        });
                    }
                }
                break;
            default: // throw Action not recognized exception
                break;
        }
    };
    BackgroundInterfaceErrorsComponent.prototype.initFilterName = function () {
        this.allProcessName = [
            'AtlasPostingProcessor',
            'AtlasAuditProcessor',
            'AtlasPaymentRequestInterfaceProcessor',
            'AtlasAccountingDocumentProcessor',
            'AtlasAccountingInterfaceProcessor',
            'AtlasRecalculationProcessor'
        ];
        this.formCtrlName.patchValue([]);
    };
    BackgroundInterfaceErrorsComponent.prototype.initFilterStatus = function () {
        var _this = this;
        this.masterdataService.getMasterData([_shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_6__["MasterDataProps"].ProcessStatuses]).subscribe(function (masterData) {
            _this.allStatus = masterData.processStatuses;
            _this.loadingStatus = true;
        });
    };
    BackgroundInterfaceErrorsComponent.prototype.onFilterButtonClicked = function () {
        this.isFiltered = true;
        this.loadData();
    };
    BackgroundInterfaceErrorsComponent.prototype.addDateEnd = function (type, event) {
        this.dateEnd = event.value;
    };
    BackgroundInterfaceErrorsComponent.prototype.addDateBegin = function (type, event) {
        this.dateBegin = event.value;
    };
    BackgroundInterfaceErrorsComponent.prototype.loadData = function () {
        var _this = this;
        if (!this.formCtrlStatus.value) {
            this.statusList = this.allStatus.map(function (option) { return option.enumEntityId; });
        }
        else {
            this.statusList = this.formCtrlStatus.value.map(function (option) { return option.enumEntityId; });
        }
        if (!this.formCtrlName.value || this.formCtrlName.value.length == 0) {
            this.selectedProcessName = this.allProcessName;
        }
        else {
            this.selectedProcessName = this.formCtrlName.value;
        }
        this.preaccountingService.getErrorMessages(this.selectedProcessName, this.statusList, this.dateBegin, this.dateEnd, this.userName).subscribe(function (data) {
            if (data) {
                _this.processMessageGridRows = data;
            }
        });
    };
    BackgroundInterfaceErrorsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-background-interface-errors',
            template: __webpack_require__(/*! ./background-interface-errors.component.html */ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.html"),
            styles: [__webpack_require__(/*! ./background-interface-errors.component.scss */ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarService"], _shared_services_http_services_preaccounting_service__WEBPACK_IMPORTED_MODULE_4__["PreaccountingService"], _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_3__["MasterdataService"], _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_5__["AgGridService"]])
    ], BackgroundInterfaceErrorsComponent);
    return BackgroundInterfaceErrorsComponent;
}(_shared_services_http_services_http_base_service__WEBPACK_IMPORTED_MODULE_2__["HttpBaseService"]));



/***/ }),

/***/ "./Client/app/hidden/hidden.module.ts":
/*!********************************************!*\
  !*** ./Client/app/hidden/hidden.module.ts ***!
  \********************************************/
/*! exports provided: HiddenModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HiddenModule", function() { return HiddenModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material-moment-adapter */ "./node_modules/@angular/material-moment-adapter/esm5/material-moment-adapter.es5.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _shared_material_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/material.module */ "./Client/app/shared/material.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/shared.module */ "./Client/app/shared/shared.module.ts");
/* harmony import */ var _components_background_interface_errors_background_interface_errors_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/background-interface-errors/background-interface-errors.component */ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.ts");
/* harmony import */ var _hidden_route__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./hidden.route */ "./Client/app/hidden/hidden.route.ts");
/* harmony import */ var _ux_components_custom_form_inputs_custom_form_inputs_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ux-components/custom-form-inputs/custom-form-inputs.component */ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.ts");
/* harmony import */ var _ux_components_ux_components_list_ux_components_list_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ux-components/ux-components-list/ux-components-list.component */ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.ts");
/* harmony import */ var _ux_components_ux_components_list_ux_dialog_list_search_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ux-components/ux-components-list/ux-dialog-list-search.component */ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.ts");
/* harmony import */ var _ux_components_ux_components_list_ux_dialog_text_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ux-components/ux-components-list/ux-dialog-text.component */ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.ts");
/* harmony import */ var _ux_components_ux_layout_template_ux_layout_template_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ux-components/ux-layout-template/ux-layout-template.component */ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var HiddenModule = /** @class */ (function () {
    function HiddenModule() {
    }
    HiddenModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _shared_material_module__WEBPACK_IMPORTED_MODULE_6__["MaterialModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
                ag_grid_angular__WEBPACK_IMPORTED_MODULE_5__["AgGridModule"].withComponents([]),
                _hidden_route__WEBPACK_IMPORTED_MODULE_9__["HiddenRoutingModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"],
            ],
            declarations: [
                _ux_components_ux_components_list_ux_components_list_component__WEBPACK_IMPORTED_MODULE_11__["UxComponentsListComponent"],
                _ux_components_ux_layout_template_ux_layout_template_component__WEBPACK_IMPORTED_MODULE_14__["UxLayoutTemplateComponent"],
                _ux_components_ux_components_list_ux_dialog_text_component__WEBPACK_IMPORTED_MODULE_13__["DialogComponent"],
                _ux_components_custom_form_inputs_custom_form_inputs_component__WEBPACK_IMPORTED_MODULE_10__["CustomFormInputsComponent"],
                _ux_components_ux_components_list_ux_dialog_list_search_component__WEBPACK_IMPORTED_MODULE_12__["ListSearchDialogComponent"],
                _components_background_interface_errors_background_interface_errors_component__WEBPACK_IMPORTED_MODULE_8__["BackgroundInterfaceErrorsComponent"],
            ],
            entryComponents: [_ux_components_ux_components_list_ux_dialog_text_component__WEBPACK_IMPORTED_MODULE_13__["DialogComponent"], _ux_components_ux_components_list_ux_dialog_list_search_component__WEBPACK_IMPORTED_MODULE_12__["ListSearchDialogComponent"]],
            providers: [
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MAT_DATE_LOCALE"], useValue: 'en' },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_3__["DateAdapter"], useClass: _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_4__["MomentDateAdapter"] },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_3__["MAT_DATE_FORMATS"], useValue: _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["ATLAS_DATE_FORMATS"] },
            ],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["CUSTOM_ELEMENTS_SCHEMA"]],
        })
    ], HiddenModule);
    return HiddenModule;
}());



/***/ }),

/***/ "./Client/app/hidden/hidden.route.ts":
/*!*******************************************!*\
  !*** ./Client/app/hidden/hidden.route.ts ***!
  \*******************************************/
/*! exports provided: routes, HiddenRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HiddenRoutingModule", function() { return HiddenRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/guards/security.guard */ "./Client/app/shared/guards/security.guard.ts");
/* harmony import */ var _ux_components_custom_form_inputs_custom_form_inputs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ux-components/custom-form-inputs/custom-form-inputs.component */ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.ts");
/* harmony import */ var _ux_components_ux_components_list_ux_components_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ux-components/ux-components-list/ux-components-list.component */ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.ts");
/* harmony import */ var _ux_components_ux_layout_template_ux_layout_template_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ux-components/ux-layout-template/ux-layout-template.component */ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.ts");
/* harmony import */ var _components_background_interface_errors_background_interface_errors_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/background-interface-errors/background-interface-errors.component */ "./Client/app/hidden/components/background-interface-errors/background-interface-errors.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var routes = [
    {
        path: 'ux/components-list', pathMatch: 'full',
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_2__["SecurityGuard"]],
        component: _ux_components_ux_components_list_ux_components_list_component__WEBPACK_IMPORTED_MODULE_4__["UxComponentsListComponent"],
    },
    {
        path: 'ux/layout-template', pathMatch: 'full',
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_2__["SecurityGuard"]],
        component: _ux_components_ux_layout_template_ux_layout_template_component__WEBPACK_IMPORTED_MODULE_5__["UxLayoutTemplateComponent"],
    },
    {
        path: 'ux/custom-form-inputs', pathMatch: 'full',
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_2__["SecurityGuard"]],
        component: _ux_components_custom_form_inputs_custom_form_inputs_component__WEBPACK_IMPORTED_MODULE_3__["CustomFormInputsComponent"],
    },
    {
        path: 'background-interface-error', pathMatch: 'full',
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_2__["SecurityGuard"]],
        component: _components_background_interface_errors_background_interface_errors_component__WEBPACK_IMPORTED_MODULE_6__["BackgroundInterfaceErrorsComponent"],
    },
];
var HiddenRoutingModule = /** @class */ (function () {
    function HiddenRoutingModule() {
    }
    HiddenRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        })
    ], HiddenRoutingModule);
    return HiddenRoutingModule;
}());



/***/ }),

/***/ "./Client/app/hidden/mock-data-provider.service.ts":
/*!*********************************************************!*\
  !*** ./Client/app/hidden/mock-data-provider.service.ts ***!
  \*********************************************************/
/*! exports provided: MockDataProviderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MockDataProviderService", function() { return MockDataProviderService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_components_row_selection_button_row_selection_button_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/components/row-selection-button/row-selection-button.component */ "./Client/app/shared/components/row-selection-button/row-selection-button.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MockDataProviderService = /** @class */ (function () {
    function MockDataProviderService() {
        this.columnDefs = [
            {
                headerName: 'Make',
                field: 'make',
                checkboxSelection: true,
                headerCheckboxSelection: true,
                suppressMovable: true,
                colId: 'make',
                hide: false,
            },
            {
                headerName: 'Model',
                field: 'model',
                suppressMovable: true,
                colId: 'model',
                hide: false,
            },
            {
                headerName: 'Price',
                field: 'price',
                suppressMovable: true,
                colId: 'price',
                hide: false,
            },
            {
                headerName: '',
                cellRendererFramework: _shared_components_row_selection_button_row_selection_button_component__WEBPACK_IMPORTED_MODULE_1__["RowSelectionButton"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
                maxWidth: 80,
                hide: false,
            },
        ];
    }
    MockDataProviderService.prototype.getColumnDef = function () {
        return this.columnDefs;
    };
    MockDataProviderService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [])
    ], MockDataProviderService);
    return MockDataProviderService;
}());



/***/ }),

/***/ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.html":
/*!**********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card class=\"margin-12\">\r\n    <h2>Custom input components</h2>\r\n</mat-card>\r\n\r\n<form [formGroup]=\"componentsFormTest\">\r\n\r\n    <!-- INPUT -->\r\n    <mat-card class=\"margin-12\">\r\n        <h3>Input Component</h3>\r\n        <!-- Input settings -->\r\n        <mat-form-field class=\"medium-field\">\r\n            <input [formControl]=\"inputControl\"\r\n                   matInput>\r\n            <mat-placeholder>Set value</mat-placeholder>\r\n        </mat-form-field>\r\n        <mat-form-field class=\"medium-field\">\r\n            <input [formControl]=\"inputLabel\"\r\n                   matInput>\r\n            <mat-placeholder>Set label</mat-placeholder>\r\n        </mat-form-field>\r\n        <mat-checkbox #inputCheck\r\n                      [checked]=\"isInputChecked\"\r\n                      (change)=\"changeInputToRequired($event)\">Required\r\n        </mat-checkbox>\r\n        <mat-checkbox #inputWarningCheck\r\n                      (change)=\"changeInputToWarning($event)\">Warning\r\n        </mat-checkbox>\r\n        <div style=\"margin:20px; text-align:right\">\r\n            <span class=\"fill-space\"></span>\r\n            <button mat-raised-button\r\n                    (click)=\"changeModeInput()\">{{inputMode}}</button>\r\n        </div>\r\n        <div class=\"custom-line-footer\"></div>\r\n        <br>\r\n        <!-- Custom Input component -->\r\n        <atlas-form-input [fieldControl]=\"inputControl\"\r\n                          [isEditable]=\"isInputEditable\"\r\n                          [label]=\"inputLabel.value\"\r\n                          [errorMap]=\"inputErrorMap \"\r\n                          [hint]=\"customHint\"\r\n                          [hasWarning]=\"isInputWarning\"\r\n                          [warningMessage]=\"'This is a warning !'\">\r\n        </atlas-form-input>\r\n    </mat-card>\r\n\r\n\r\n    <!-- TOGGLE BUTTONS -->\r\n    <mat-card class=\"margin-12\">\r\n        <!--Toggle settings -->\r\n        <h3>Toggle Component</h3>\r\n        <mat-form-field class=\"medium-field\">\r\n            <input [formControl]=\"inputLabelForGroup\"\r\n                   matInput>\r\n            <mat-placeholder>Group Label</mat-placeholder>\r\n        </mat-form-field>\r\n        <mat-form-field class=\"medium-field\">\r\n            <input [formControl]=\"inputLabelForButton\"\r\n                   matInput>\r\n            <mat-placeholder>New button label</mat-placeholder>\r\n        </mat-form-field>\r\n        <button mat-button\r\n                (click)=\"addToggleButton($event)\">Add button</button>\r\n\r\n        <div style=\"margin:20px; text-align:right\">\r\n            <span class=\"fill-space\"></span>\r\n            <button mat-raised-button\r\n                    (click)=\"changeModeToggle()\">{{toggleMode}}</button>\r\n        </div>\r\n        <div class=\"custom-line-footer\"></div>\r\n        <br>\r\n        <!-- Custom Toggle component -->\r\n        <atlas-form-toggle [fieldControl]=\"toggleControl\"\r\n                           [label]=\"inputLabelForGroup.value\"\r\n                           [isEditable]=\"isToggleEditable\"\r\n                           [valueLabelMap]=\"valueLabelForButtons\">\r\n        </atlas-form-toggle>\r\n    </mat-card>\r\n\r\n\r\n    <!-- DATE PICKER -->\r\n    <mat-card class=\"margin-12\">\r\n        <h3>Date Picker Component</h3>\r\n        <!--Date picker settings -->\r\n        <mat-form-field class=\"medium-field\">\r\n            <input [formControl]=\"dateLabel\"\r\n                   matInput>\r\n            <mat-placeholder>Set label</mat-placeholder>\r\n        </mat-form-field>\r\n        <mat-form-field class=\"medium-field\">\r\n            <input matInput\r\n                   [matDatepicker]=\"picker\"\r\n                   autocomplete=\"off\"\r\n                   [formControl]=\"dateControl\">\r\n            <mat-placeholder>Set date</mat-placeholder>\r\n            <mat-datepicker-toggle matSuffix\r\n                                   [for]=\"picker\"></mat-datepicker-toggle>\r\n            <mat-datepicker #picker></mat-datepicker>\r\n        </mat-form-field>\r\n        <mat-checkbox #dateCheck\r\n                      [checked]=\"isDateChecked\"\r\n                      (change)=\"changeDatePickerToRequired($event)\">Required\r\n        </mat-checkbox>\r\n        <div style=\"margin:20px; text-align:right\">\r\n            <span class=\"fill-space\"></span>\r\n            <button mat-raised-button\r\n                    (click)=\"changeModeDate()\">{{dateMode}}</button>\r\n        </div>\r\n        <div class=\"custom-line-footer\"></div>\r\n        <br>\r\n        <!-- Custom Date Picker component -->\r\n        <atlas-date-picker [isEditable]=\"isDateEditable\"\r\n                           [label]=\"dateLabel.value\"\r\n                           [fieldControl]=\"dateControl\"\r\n                           [errorMap]=\"dateErrorMap\">\r\n        </atlas-date-picker>\r\n    </mat-card>\r\n\r\n\r\n    <!-- SELECT AUTOCOMPLETE -->\r\n    <mat-card class=\"margin-12\">\r\n        <h3>Select Autocomplete Component</h3>\r\n        <!-- Select/Autocomplete settings -->\r\n        Change mode: <button mat-button\r\n                (click)=\"changeModeAutocompleteDropdown()\">\r\n            {{autocompleteDropdownMode}}\r\n        </button><br>\r\n        <mat-form-field class=\"medium-field\">\r\n            <input [formControl]=\"selectLabel\"\r\n                   matInput>\r\n            <mat-placeholder>Set label</mat-placeholder>\r\n        </mat-form-field>\r\n        <mat-checkbox #selectCheck\r\n                      [checked]=\"isSelectChecked\"\r\n                      (change)=\"changeSelectToRequired($event)\">Required\r\n        </mat-checkbox>\r\n        <div style=\"margin:20px; text-align:right\">\r\n            <span class=\"fill-space\"></span>\r\n            <button mat-raised-button\r\n                    (click)=\"changeModeSelect()\">{{selectMode}}</button>\r\n        </div>\r\n        <div class=\"custom-line-footer\"></div>\r\n        <br>\r\n        <!-- List select custom component -->\r\n        <atlas-dropdown-select [isEditable]=\"isSelectEditable\"\r\n                               [label]=\"selectLabel.value\"\r\n                               [fieldControl]=\"selectControl\"\r\n                               [options]=\"selectOptions\"\r\n                               [displayProperty]=\"displayProperty\"\r\n                               [selectProperties]=\"selectProperties\"\r\n                               [isAutocompleteActivated]=\"isAutocompleteActivated\"\r\n                               [errorMap]=\"selectErrorMap\"\r\n                               [hint]=\"customHint\">\r\n        </atlas-dropdown-select>\r\n    </mat-card>\r\n\r\n    <!-- MASTERDATA AUTOCOMPLETE + CONTEXTUAL SEARCH -->\r\n    <mat-card class=\"margin-12\">\r\n        <h3>Masterdata Autocomplete with Contextual Search Component</h3>\r\n\r\n        <atlas-masterdata-input isEditable=\"true\"\r\n                                [fieldControl]=\"masterdataControl\"\r\n                                [options]=\"filteredMasterdata\"\r\n                                label=\"Vessel\"\r\n                                displayProperty=\"vesselName\"\r\n                                [selectProperties]=\"['vesselName', 'description']\"\r\n                                [errorMap]=\"vesselErrorMap\"\r\n                                lightBoxTitle=\"Results for vessels\"\r\n                                gridId=\"charterVesselGrid\">\r\n        </atlas-masterdata-input>\r\n    </mat-card>\r\n\r\n    <div>\r\n        <div class=\"custom-line-footer\"></div>\r\n        <div style=\"margin:20px; text-align:right\">\r\n            <span class=\"fill-space\"></span>\r\n            <button type=\"submit\"\r\n                    mat-raised-button\r\n                    color=\"accent\"\r\n                    [disabled]=\"!componentsFormTest.valid\">VALIDATED</button>\r\n        </div>\r\n    </div>\r\n</form>"

/***/ }),

/***/ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.scss":
/*!**********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.ts":
/*!********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.ts ***!
  \********************************************************************************************/
/*! exports provided: CustomFormInputsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomFormInputsComponent", function() { return CustomFormInputsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/validators/date-validators.validator */ "./Client/app/shared/validators/date-validators.validator.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CustomFormInputsComponent = /** @class */ (function () {
    function CustomFormInputsComponent(formBuilder, utilService, companyManager) {
        this.formBuilder = formBuilder;
        this.utilService = utilService;
        this.companyManager = companyManager;
        // Input
        this.isInputEditable = true;
        this.inputMode = 'Edit mode';
        this.inputControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(5),
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].email,
        ]); // Validators.required,
        this.inputErrorMap = new Map();
        this.customHint = 'This is a hint';
        this.inputLabel = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        // Toggle
        this.isToggleEditable = true;
        this.toggleMode = 'Edit mode';
        this.inputLabelForGroup = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('Buttons');
        this.inputLabelForButton = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.toggleControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('first value', [
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
        ]);
        this.valueLabelForButtons = new Map();
        // Date picker
        this.isDateEditable = true;
        this.dateMode = 'Edit mode';
        this.dateLabel = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.dateControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]({ value: '', disabled: false }, [
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
            Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_5__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate()),
        ]);
        this.dateErrorMap = new Map();
        this.vesselErrorMap = new Map();
        // Select
        this.isSelectEditable = true;
        this.selectMode = 'Edit mode';
        this.autocompleteDropdownMode = 'Autocomplete mode';
        this.selectLabel = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.selectControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]); // dropdown: use inDropdownListValidator()  //[Validators.required]
        this.masterdataControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.options = [];
        this.masterdataOptions = [];
        this.isAutocompleteActivated = true;
        this.selectErrorMap = new Map();
        this.displayProperty = 'code';
        this.selectProperties = ['code', 'description'];
        this.inputErrorMap
            .set('required', 'Required *')
            .set('minlength', 'Input length should be at least 5 character long')
            .set('email', 'Not a valid email');
        this.dateErrorMap
            .set('required', 'Required *')
            .set('isDateValid', 'The date cannot be in the future')
            .set('minlength', 'Input length should be at least 5 character long');
        this.selectErrorMap
            .set('isDateValid', 'This date is invalid')
            .set('required', 'Required *');
        this.vesselErrorMap
            .set('required', 'Required *')
            .set('inDropdownList', 'Value not is list');
    }
    CustomFormInputsComponent.prototype.ngOnInit = function () {
        this.initializeForm();
        this.listenToChanges();
    };
    CustomFormInputsComponent.prototype.initializeForm = function () {
        this.componentsFormTest = this.formBuilder.group({
            inputControl: this.inputControl,
            toggleControl: this.toggleControl,
            dateControl: this.dateControl,
            selectControl: this.selectControl,
            masterdataControl: this.masterdataControl,
        });
        this.options = new Array({ code: '01', description: 'Rice' }, { code: '02', description: 'Grains' }, { code: '03', description: 'Coffee' });
        this.masterdataOptions = new Array({ vesselId: 1, vesselName: 'Toyota', description: 'Celica', flag: 1, built: '12', imo: '9161510', displayName: '12' }, { vesselId: 1, vesselName: 'Ford', description: 'Mondeo', flag: 2, built: '13', imo: '8974192', displayName: '13' }, { vesselId: 1, vesselName: 'Porsche', description: 'Boxter', flag: 3, built: '14', imo: '8502200', displayName: '14' });
        this.filteredMasterdata = this.masterdataOptions;
        // Initialize two toggle buttons
        this.valueLabelForButtons.set('first value', 'first label');
        this.valueLabelForButtons.set('second value', 'second label');
        this.isInputChecked =
            this.inputControl.errors && this.inputControl.errors.required;
        this.isDateChecked =
            this.dateControl.errors && this.dateControl.errors.required;
        this.isSelectChecked =
            this.selectControl.errors && this.selectControl.errors.required;
    };
    CustomFormInputsComponent.prototype.listenToChanges = function () {
        var _this = this;
        this.selectControl.valueChanges
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["startWith"])(null), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (input) {
            if (_this.isAutocompleteActivated === true &&
                input &&
                !_this.isInstanceOf(input)) {
                return _this.utilService.filterCollectionByMultipleValues(_this.options, { code: input, description: input });
            }
            else {
                return _this.options;
            }
        })).subscribe(function (value) { return _this.selectOptions = value; });
        this.masterdataControl.valueChanges
            .subscribe(function (input) {
            _this.filteredMasterdata = _this.utilService.filterListforAutocomplete(input, _this.masterdataOptions, ['vesselCode', 'description']);
        });
    };
    CustomFormInputsComponent.prototype.getFilteredOptions = function (input) {
        var options = this.options.filter(function (item) {
            return (item.code.toLowerCase().startsWith(input.toLowerCase()) ||
                item.code.toLowerCase().startsWith(input.toLowerCase()));
        });
        return options;
    };
    CustomFormInputsComponent.prototype.isInstanceOf = function (obj) {
        // tslint:disable-next-line:no-angle-bracket-type-assertion
        return obj.code !== undefined;
    };
    CustomFormInputsComponent.prototype.changeModeInput = function () {
        this.isInputEditable = !this.isInputEditable;
        this.inputMode = this.isInputEditable ? 'Edit mode' : 'Display mode';
    };
    CustomFormInputsComponent.prototype.changeInputToRequired = function (event) {
        var value = event.checked;
        if (value) {
            this.inputControl.setValidators([
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(5),
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].email,
            ]);
        }
        else {
            this.inputControl.setValidators([
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(5),
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].email,
            ]);
        }
        this.inputControl.updateValueAndValidity();
    };
    CustomFormInputsComponent.prototype.changeModeToggle = function () {
        this.isToggleEditable = !this.isToggleEditable;
        this.toggleMode = this.isToggleEditable ? 'Edit mode' : 'Display mode';
    };
    CustomFormInputsComponent.prototype.addToggleButton = function (event) {
        this.valueLabelForButtons.set(this.inputLabelForButton.value, this.inputLabelForButton.value);
        this.inputLabelForButton.setValue('');
    };
    CustomFormInputsComponent.prototype.changeModeDate = function () {
        this.isDateEditable = !this.isDateEditable;
        this.dateMode = this.isDateEditable ? 'Edit mode' : 'Display mode';
    };
    CustomFormInputsComponent.prototype.changeDatePickerToRequired = function (event) {
        var value = event.checked;
        if (value) {
            this.dateControl.setValidators([
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_5__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate()),
            ]);
        }
        else {
            this.dateControl.setValidators([Object(_shared_validators_date_validators_validator__WEBPACK_IMPORTED_MODULE_5__["isBeforeDate"])(this.companyManager.getCurrentCompanyDate())]);
        }
        this.dateControl.updateValueAndValidity();
    };
    CustomFormInputsComponent.prototype.changeModeSelect = function () {
        this.isSelectEditable = !this.isSelectEditable;
        this.selectMode = this.isSelectEditable ? 'Edit mode' : 'Display mode';
    };
    CustomFormInputsComponent.prototype.changeModeAutocompleteDropdown = function () {
        this.isAutocompleteActivated = !this.isAutocompleteActivated;
        if (this.isAutocompleteActivated) {
            this.autocompleteDropdownMode = 'Autocomplete mode';
        }
        else {
            this.autocompleteDropdownMode = 'Dropdown mode';
        }
    };
    CustomFormInputsComponent.prototype.changeSelectToRequired = function (event) {
        var value = event.checked;
        if (value) {
            this.selectControl.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]);
        }
        else {
            this.selectControl.clearValidators();
        }
        this.selectControl.updateValueAndValidity();
    };
    CustomFormInputsComponent.prototype.updateSelectFieldControl = function (value) {
        this.selectControl.setValue(value);
    };
    CustomFormInputsComponent.prototype.changeInputToWarning = function (event) {
        this.isInputWarning = event.checked ? true : false;
    };
    CustomFormInputsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-test',
            template: __webpack_require__(/*! ./custom-form-inputs.component.html */ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.html"),
            styles: [__webpack_require__(/*! ./custom-form-inputs.component.scss */ "./Client/app/hidden/ux-components/custom-form-inputs/custom-form-inputs.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_4__["UtilService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"]])
    ], CustomFormInputsComponent);
    return CustomFormInputsComponent;
}());



/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/translations/en.json":
/*!*********************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/translations/en.json ***!
  \*********************************************************************************/
/*! exports provided: TITLE_PAGE, INPUT_LABEL, SECTION, TOOGLE, TOOGLE_SELECTED, MESSAGE, ACTION, SELECT, MORE_FILTERS, APPLY_FILTERS, EMAIL_FIELD, You must enter a value, Not a valid email, COMPLEXE_VALUE_FIELD, AUTOCOMPLETE_FIELD, DROPDOWN_FIELD, DATE_PICKER_FIELD, BUTTONS_BOX, FLOATING_ACTION_BUTTON_BOX, BUTTON_LABEL, TOOLTIP_BOX, EMPTY_STATE_BOX_1, EMPTY_STATE_BOX_2, EMPTY_STATE_BOX_3, STEPPER, NAME, USERNAME, ADDRESS, CITY, COUNTRY, BACK, NEXT, RESET, PROGRESS_BOX, CHECKBOX, CARD, DIALOG_BOX, DIALOG_CLOSED, CONTEXTUAL_SEARCH_BOX, COMMODITY_INPUT_BOX, LIST_AND_SEARCH, NO_DEFAULT_SET, SAVE, EDIT_CRITERIAS, FILTER_SET_NAME, REQUIRED, SHARE_WITH_ALL_USERS, SHARE WITH ALL COMPANIES, SAVE_AS_NEW_FILTER_SET, QUICK_SUM_MODE, CLEAR_SELECTION, make, model, price, Child 1, Child 2, Child 3, Ag-Grid Examples, Enable Range Selection, Clear Selection, Bright Tab, First, Second, Third, Number 1, Number 2, Number 3, Dark Tab - for topbar, trade type, Label of the button, Content 1, Content 2, Content 3, Admin Tab - for topbar, The background image needs to be defined in the css class admin-tab, default */
/***/ (function(module) {

module.exports = {"TITLE_PAGE":"Title page","INPUT_LABEL":"Input label","SECTION":"Section","TOOGLE":"toogle","TOOGLE_SELECTED":"toogle selected","MESSAGE":"Message","ACTION":"Action","SELECT":{"FIELD_NAME":"Select","OPTION":"My favourite field"},"MORE_FILTERS":"+ MORE FILTERS","APPLY_FILTERS":"Apply filters","EMAIL_FIELD":{"FIELD_NAME":"Enter your email"},"You must enter a value":"You must enter a value","Not a valid email":"Not a valid email","COMPLEXE_VALUE_FIELD":"Complexe value entry","AUTOCOMPLETE_FIELD":"Autocomplete","DROPDOWN_FIELD":{"FIELD_NAME":"Dropdown field","OPTION":"Option"},"DATE_PICKER_FIELD":"Date picker field","BUTTONS_BOX":{"TITLE":"Buttons","BASIC":"Basic button","RAISED":"Raised button"},"FLOATING_ACTION_BUTTON_BOX":{"TITLE":"Floating Action button","CUSTOMIZE":"Customize the trade","CLOSE":"Close trade","NEW_CALL_OFF":"New call of","ASSIGN":"Assign to charter","SPLIT":"Split trade","ALLOCATE":"Allocate trade"},"BUTTON_LABEL":"Label of the button","TOOLTIP_BOX":{"TITLE":"Tooltip","TEST":"Have a tooltip !","FIELD":"Field with","TOOLTIP":"This is a tooltip"},"EMPTY_STATE_BOX_1":{"TITLE":"No result for ABC","MESSAGE":"Try another search"},"EMPTY_STATE_BOX_2":{"TITLE":"Title of the card","MESSAGE":"Message of the empty state"},"EMPTY_STATE_BOX_3":{"TITLE":"No result for P00003","MESSAGE":"Try another search"},"STEPPER":{"PERSONAL_INFO":"Personnal information","FILL_OUT_ADDRESS":"Fill out your address","DONE":"Done","END_MESSAGE":"Congratulation<br/>You are now done"},"NAME":"Name","USERNAME":"Username","ADDRESS":"Address","CITY":"City","COUNTRY":"Country","BACK":"Back","NEXT":"Next","RESET":"Reset","PROGRESS_BOX":{"TITLE":"Progress indicator","INDETERMINATE":"Indeterminate loading","DETERMINATE":"Determinate loading"},"CHECKBOX":{"PARENT":"Parent Checkbox","CHILD1":"Child 1","CHILD2":"Child 2","CHILD3":"Child 3","INDETERMINATE":"Indeterminate","RADIO_BUTTON":"radio-button","SLIDE_TOOGLE":"Slide Toogle"},"CARD":{"1":"Card 1","2":"Card 2","3":"Card 3","4":"Card 4"},"DIALOG_BOX":{"TITLE":"Dialog box","FIELD_NAME":"What's your name","OPEN_DIALOG":"OPEN DIALOGUE","GREETINGS":"Hi","QUESTION":"What's your favourite animal?","CHOICE":"You chose:"},"DIALOG_CLOSED":"The dialog was closed","CONTEXTUAL_SEARCH_BOX":{"TITLE":"Contextual search","FIELD_NAME":"Vessel name","LIGHTBOX":{"TITLE":"Lightbox title","MAKE":"Make","MODEL":"Model","PRICE":"Price","DISCARD":"Discard"}},"COMMODITY_INPUT_BOX":{"TITLE":"Commodity Input","INVALID":"Please enter a valid commodity","GRID":{"TITLE":"Contextual search grid for commodities","DISCARD":"Discard","COMMODITY_DESCRIPTION":"Commodity description","AUTHORISE_COLUMN":"Authorise this column","AUTHORISE_ALL_COLUMNS":"Authorise all columns","FILTER":"Filter","CONTAINS":"Contains","NOT_CONTAINS":"Not contains","EQUALS":"Equals","NOT_EQUALS":"Not equal","START_WITH":"Starts with","ENDS_WITH":"Ends with"}},"LIST_AND_SEARCH":"List & Search","NO_DEFAULT_SET":"No Default Set","SAVE":"Save","EDIT_CRITERIAS":"EDIT CRITERIAS","FILTER_SET_NAME":"Filter Set Name","REQUIRED":"Required*","SHARE_WITH_ALL_USERS":"Share with all users","SHARE WITH ALL COMPANIES":"Share with all companies","SAVE_AS_NEW_FILTER_SET":"SAVE AS NEW FILTER SET","QUICK_SUM_MODE":"Quick Sum Mode","CLEAR_SELECTION":"CLEAR SELECTION","make":"Make","model":"Model","price":"Price","Child 1":"Child 1","Child 2":"Child 2","Child 3":"Child 3","Ag-Grid Examples":"Ag-Grid Examples","Enable Range Selection":"Enable Range Selection","Clear Selection":"Clear Selection","Bright Tab":"Bright Tab","First":"First","Second":"Second","Third":"Thrid","Number 1":"Number 1","Number 2":"Number 2","Number 3":"Number 3","Dark Tab - for topbar":"Dark Tab - for topbar","trade type":"trade type","Label of the button":"Label of the button","Content 1":"Content 1","Content 2":"Content 2","Content 3":"Content 3","Admin Tab - for topbar":"Admin Tab - for topbar","The background image needs to be defined in the css class admin-tab":"The background image needs to be defined in the css class 'admin-tab'"};

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/translations/fr.json":
/*!*********************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/translations/fr.json ***!
  \*********************************************************************************/
/*! exports provided: TITLE_PAGE, INPUT_LABEL, SECTION, TOOGLE, TOOGLE_SELECTED, MESSAGE, ACTION, SELECT, MORE_FILTERS, APPLY_FILTERS, EMAIL_FIELD, You must enter a value, Not a valid email, COMPLEXE_VALUE_FIELD, AUTOCOMPLETE_FIELD, DROPDOWN_FIELD, DATE_PICKER_FIELD, BUTTONS_BOX, FLOATING_ACTION_BUTTON_BOX, BUTTON_LABEL, TOOLTIP_BOX, EMPTY_STATE_BOX_1, EMPTY_STATE_BOX_2, EMPTY_STATE_BOX_3, STEPPER, NAME, USERNAME, ADDRESS, CITY, COUNTRY, BACK, NEXT, RESET, PROGRESS_BOX, CHECKBOX, CARD, DIALOG_BOX, DIALOG_CLOSED, CONTEXTUAL_SEARCH_BOX, COMMODITY_INPUT_BOX, LIST_AND_SEARCH, NO_DEFAULT_SET, SAVE, EDIT_CRITERIAS, FILTER_SET_NAME, REQUIRED, SHARE_WITH_ALL_USERS, SHARE WITH ALL COMPANIES, SAVE_AS_NEW_FILTER_SET, QUICK_SUM_MODE, CLEAR_SELECTION, make, model, price, Child 1, Child 2, Child 3, Ag-Grid Examples, Enable Range Selection, Clear Selection, Bright Tab, First, Second, Third, Number 1, Number 2, Number 3, Dark Tab - for topbar, trade type, Label of the button, Content 1, Content 2, Content 3, Admin Tab - for topbar, The background image needs to be defined in the css class admin-tab, default */
/***/ (function(module) {

module.exports = {"TITLE_PAGE":"Titre de la page","INPUT_LABEL":"Champ d'entrée","SECTION":"Section","TOOGLE":"interrupteur","TOOGLE_SELECTED":"interrupteur sélectionné","MESSAGE":"Message","ACTION":"Action","SELECT":{"FIELD_NAME":"Sélectionner","OPTION":"Mon champ favori"},"MORE_FILTERS":"+ PLUS DE FILTRES","APPLY_FILTERS":"Appliquer les filtres","EMAIL_FIELD":{"FIELD_NAME":"Renseigner votre adresse mail"},"You must enter a value":"Champ obligatoire","Not a valid email":"Email invalide","COMPLEXE_VALUE_FIELD":"Valeur complexe","AUTOCOMPLETE_FIELD":"Autocomplétion","DROPDOWN_FIELD":{"FIELD_NAME":"Menu déroulant","OPTION":"Option"},"DATE_PICKER_FIELD":"Champ de date","BUTTONS_BOX":{"TITLE":"Boutons","BASIC":"Bouton basique","RAISED":"Bouton en relief"},"FLOATING_ACTION_BUTTON_BOX":{"TITLE":"Bouton d'action flottant","CUSTOMIZE":"Personaliser l'échange","CLOSE":"Terminer l'échange","NEW_CALL_OFF":"Nouveu contrat","ASSIGN":"Assigner au fret","SPLIT":"Diviser l'échange","ALLOCATE":"Localiser l'échange"},"BUTTON_LABEL":"Label du bouton","TOOLTIP_BOX":{"TITLE":"Outil de tips","TEST":"Testez l'outil de tips","FIELD":"Champ avec l'outil","TOOLTIP":"Ceci est un outil de tips"},"EMPTY_STATE_BOX_1":{"TITLE":"Pas de résultat pour ABC","MESSAGE":"Essayer une autre recherche"},"EMPTY_STATE_BOX_2":{"TITLE":"Titre de la carte","MESSAGE":"Message de l'état vide"},"EMPTY_STATE_BOX_3":{"TITLE":"Pas de résultat pour P00003","MESSAGE":"Essayer une autre recherche"},"STEPPER":{"PERSONAL_INFO":"Informations personnelles","FILL_OUT_ADDRESS":"Renseigner votre adresse","DONE":"Terminé","END_MESSAGE":"Félicitations<br/>Vous avez terminé"},"NAME":"Nom","USERNAME":"Nom d'utilisateur","ADDRESS":"Adresse","CITY":"Ville","COUNTRY":"Pays","BACK":"Retour","NEXT":"Suivant","RESET":"Réinit","PROGRESS_BOX":{"TITLE":"Indicateur de progression","INDETERMINATE":"Chargement indéterminé","DETERMINATE":"Chargement déterminé"},"CHECKBOX":{"PARENT":"Checkbox Parent","CHILD1":"Enfant 1","CHILD2":"Enfant 2","CHILD3":"Enfant 3","INDETERMINATE":"Indeterminé","RADIO_BUTTON":"bouton radio","SLIDE_TOOGLE":"Interrupteur glissant"},"CARD":{"1":"Carte 1","2":"Carte 2","3":"Carte 3","4":"Carte 4"},"DIALOG_BOX":{"TITLE":"Boîte de dialogue","FIELD_NAME":"Comment tu t'appelles?","OPEN_DIALOG":"OUVRIR DIALOGUE","GREETINGS":"Salut","QUESTION":"Quel est ton animal favori?","CHOICE":"Vous avez choisi:"},"DIALOG_CLOSED":"La boîte de dialogue a été fermée","CONTEXTUAL_SEARCH_BOX":{"TITLE":"Recherche contexuelle","FIELD_NAME":"Nom du navire","LIGHTBOX":{"TITLE":"Titre de la lightbox","MAKE":"Marque","MODEL":"Modèle","PRICE":"Prix","DISCARD":"Rejeter"}},"COMMODITY_INPUT_BOX":{"TITLE":"Saisie de marchandise","INVALID":"Veuillez saisir un nom de marchandise correct","GRID":{"TITLE":"Grille de recherche contextuelle pour la marchandise","DISCARD":"Rejeter","COMMODITY_DESCRIPTION":"Description de la marchandise","AUTHORISE_COLUMN":"Autoriser cette colonne","AUTHORISE_ALL_COLUMNS":"Autoriser toutes les colonnes","FILTER":"Filtre","CONTAINS":"Contient","NOT_CONTAINS":"Ne contient pas","EQUALS":"Egal","NOT_EQUALS":"Non égal","START_WITH":"Commence par","ENDS_WITH":"Termine par"}},"LIST_AND_SEARCH":"Lister & Rechercher","NO_DEFAULT_SET":"Pas de configuration par défaut","SAVE":"Enregistrer","EDIT_CRITERIAS":"EDITER LES CRITERES","FILTER_SET_NAME":"Nom du filtre","REQUIRED":"Requis*","SHARE_WITH_ALL_USERS":"Partager avec tous les utilisateurs","SHARE WITH ALL COMPANIES":"Partager avec toutes les compagnies","SAVE_AS_NEW_FILTER_SET":"ENREGISTER EN TANT QUE NOUVEAU FILTRE","QUICK_SUM_MODE":"Mode Somme Rapide","CLEAR_SELECTION":"NETTOYER LA SELECTION","make":"Marque","model":"Modèle","price":"Prix","Child 1":"Enfant 1","Child 2":"Enfant 2","Child 3":"Enfant 3","Ag-Grid Examples":"Exemple d'Ag-grid","Enable Range Selection":"Autoriser la sélection d'intervalles","Clear Selection":"Nettoyer la sélection","Bright Tab":"Onglet brillant","First":"Premier","Second":"Second","Third":"Troisième","Number 1":"Numéro 1","Number 2":"Numéro 2","Number 3":"Numéro 3","Dark Tab - for topbar":"Onglet sombre - Pour la barre supérieure","trade type":"type d'échange","Label of the button":"Label du bouton","Content 1":"Contenu 1","Content 2":"Contenu 2","Content 3":"Contenu 3","Admin Tab - for topbar":"Onglet Admin - Pour la barre supérieure","The background image needs to be defined in the css class admin-tab":"L'image de fond doit être définie dans la classe css 'admin-tab'"};

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.html":
/*!**********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"screenfullwidth\">\r\n    <div class=\"main-container ux-component-list\">\r\n        <div layout=\"row\"\r\n             layout-fill>\r\n            <header color=\"accent\">\r\n                <div class=\"docs-header-section\">\r\n                    <div class=\"docs-header-headline\">\r\n                        <select #languageSelection\r\n                                (change)=\"translateService.use(languageSelection.value)\">\r\n                            <option *ngFor=\"let language of translateService.getLangs()\"\r\n                                    [value]=\"language\"\r\n                                    [selected]=\"language === translateService.currentLang\">\r\n                                {{ language }}\r\n                            </option>\r\n                        </select>\r\n\r\n                        <h1>{{'TITLE_PAGE'|translate}}</h1>\r\n                    </div>\r\n\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\" none\">\r\n                        <mat-form-field flex=\"50\">\r\n                            <input matInput\r\n                                   placeholder=\"{{'INPUT_LABEL' | translate}}\">\r\n                        </mat-form-field>\r\n                        <mat-form-field flex=\"20\">\r\n                            <input matInput\r\n                                   placeholder=\"{{'INPUT_LABEL' | translate}}\">\r\n                        </mat-form-field>\r\n                        <mat-form-field flex=\"30\">\r\n                            <input matInput\r\n                                   placeholder=\"{{'INPUT_LABEL' | translate}}\">\r\n                        </mat-form-field>\r\n                    </div>\r\n                </div>\r\n            </header>\r\n        </div>\r\n\r\n        <div layout=\"row\"\r\n             layout-margin>\r\n            <section>\r\n                <h2> Section</h2>\r\n            </section>\r\n            <section>\r\n                <mat-button-toggle-group class=\"toggle-group\"\r\n                                         name=\"fontStyle\"\r\n                                         aria-label=\"Font Style\">\r\n                    <mat-button-toggle value=\"\"\r\n                                       selected>{{'TOOGLE' | translate}}</mat-button-toggle>\r\n                    <mat-button-toggle value=\"\">{{'TOOGLE' | translate}}</mat-button-toggle>\r\n                </mat-button-toggle-group>\r\n            </section>\r\n            <!-- <mat-divider></mat-divider> -->\r\n            <mat-list>\r\n                <!-- search -->\r\n                <mat-card>\r\n\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"start none\"\r\n                         class=\"search\">\r\n                        <mat-form-field>\r\n                            <input matInput\r\n                                   value=\"\"\r\n                                   placeholder=\"{{'MESSAGE' | translate}}\"\r\n                                   #message>\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field>\r\n                            <input matInput\r\n                                   value=\"\"\r\n                                   placeholder=\"{{'ACTION' | translate}}\"\r\n                                   #action>\r\n                        </mat-form-field>\r\n                        <button mat-raised-button\r\n                                color=\"accent\">ok</button>\r\n                    </div>\r\n                </mat-card>\r\n                <mat-card class=\"search-filter\">\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"space-between start\"\r\n                         class=\"head-filter \">\r\n                        <div>\r\n                            <mat-form-field>\r\n                                <mat-select placeholder=\"{{'SELECT.FIELD_NAME' | translate}}\">\r\n                                    <mat-option value=\"option\">{{'SELECT.OPTION' | translate}}</mat-option>\r\n                                </mat-select>\r\n                            </mat-form-field>\r\n                        </div>\r\n                        <div class=\"more-filter\">\r\n                            <button mat-button\r\n                                    color=\"pink\">{{'MORE_FILTERS' | translate}}</button>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <mat-divider></mat-divider>\r\n\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"space-between none\"\r\n                         class=\"mt-1\">\r\n                        <button mat-button>{{'APPLY_FILTERS' | translate}}</button>\r\n                        <div class=\"button-row\">\r\n\r\n                            <button mat-icon-button=\"\">\r\n                                <span class=\"mat-button-wrapper\">\r\n                                    <mat-icon _ngcontent-c58=\"\"\r\n                                              class=\"mat-icon material-icons\"\r\n                                              role=\"img\"\r\n                                              aria-hidden=\"true\">delete_outlin</mat-icon>\r\n                                </span>\r\n                            </button>\r\n                            <button mat-icon-button=\"\">\r\n                                <span class=\"mat-button-wrapper\">\r\n                                    <mat-icon class=\"mat-icon material-icons\"\r\n                                              role=\"img\"\r\n                                              aria-hidden=\"true\">share</mat-icon>\r\n                                </span>\r\n                            </button>\r\n                            <button mat-icon-button=\"\">\r\n                                <span class=\"mat-button-wrapper\">\r\n                                    <mat-icon class=\"mat-icon material-icons\"\r\n                                              role=\"img\"\r\n                                              aria-hidden=\"true\">save_outlin</mat-icon>\r\n                                </span>\r\n                            </button>\r\n                            <button mat-icon-button=\"\">\r\n                                <span class=\"mat-button-wrapper\">\r\n                                    <mat-icon role=\"img\"\r\n                                              aria-hidden=\"true\">favorite_outlin</mat-icon>\r\n                                </span>\r\n                            </button>\r\n\r\n                        </div>\r\n                    </div>\r\n                </mat-card>\r\n                <mat-card>\r\n                    <mat-form-field>\r\n                        <input matInput\r\n                               placeholder=\"{{'EMAIL_FIELD.FIELD_NAME' | translate}}\"\r\n                               [formControl]=\"email\"\r\n                               required>\r\n                        <span *ngIf=\"email.touched && email.invalid\"\r\n                              matSuffix>\r\n                            <mat-icon>error</mat-icon>\r\n                        </span>\r\n                        <span *ngIf=\"email.touched && email.valid\"\r\n                              matSuffix>\r\n                            <mat-icon>check_circle</mat-icon>\r\n                        </span>\r\n                        <mat-error *ngIf=\"email.invalid\">{{getErrorMessage() | translate}}</mat-error>\r\n                    </mat-form-field>\r\n                    <mat-form-field>\r\n                        <input matInput\r\n                               placeholder=\"{{'COMPLEXE_VALUE_FIELD' | translate}}\">\r\n                        <mat-icon matSuffix>help</mat-icon>\r\n                    </mat-form-field>\r\n\r\n                    <mat-form-field class=\"example-full-width\">\r\n                        <input type=\"text\"\r\n                               placeholder=\"{{'AUTOCOMPLETE_FIELD' | translate}}\"\r\n                               aria-label=\"Assignee\"\r\n                               matInput\r\n                               [formControl]=\"myControl\"\r\n                               [matAutocomplete]=\"auto\">\r\n                        <mat-autocomplete #auto=\"matAutocomplete\"\r\n                                          [displayWith]=\"displayFn\">\r\n                            <mat-option *ngFor=\"let option of filteredOptions | async\"\r\n                                        [value]=\"option\">\r\n                                {{option.name}}\r\n                            </mat-option>\r\n                        </mat-autocomplete>\r\n                    </mat-form-field>\r\n\r\n                    <mat-form-field>\r\n                        <mat-select placeholder=\"{{'DROPDOWN_FIELD.FIELD_NAME' | translate}}\">\r\n                            <mat-option value=\"option\"\r\n                                        style=\"padding-top: 10px\">{{'DROPDOWN_FIELD.OPTION' | translate}}</mat-option>\r\n                        </mat-select>\r\n                    </mat-form-field>\r\n\r\n                    <mat-form-field>\r\n                        <input matInput\r\n                               [matDatepicker]=\"picker\"\r\n                               placeholder=\"{{'DATE_PICKER_FIELD' | translate}}\">\r\n                        <mat-datepicker-toggle matSuffix\r\n                                               [for]=\"picker\"></mat-datepicker-toggle>\r\n                        <mat-datepicker #picker></mat-datepicker>\r\n                    </mat-form-field>\r\n                </mat-card>\r\n            </mat-list>\r\n\r\n\r\n\r\n            <div fxLayout=\"row\">\r\n                <div fxFlex=\"100\">\r\n                    <mat-card>\r\n                        <mat-chip-list>\r\n                            <mat-chip>chips</mat-chip>\r\n                            <mat-chip color=\"primary\"\r\n                                      selected>Primary fish</mat-chip>\r\n                            <mat-chip color=\"accent\"\r\n                                      selected>Accent fish</mat-chip>\r\n                            <mat-chip color=\"accent\"\r\n                                      selected>\r\n                                <mat-icon>help</mat-icon> chips with icon\r\n                            </mat-chip>\r\n                            <mat-chip color=\"lemon\"\r\n                                      selected>Lemon Chip</mat-chip>\r\n                            <mat-chip color=\"energy\"\r\n                                      selected>Energy Chip</mat-chip>\r\n                            <mat-chip color=\"apricot\"\r\n                                      selected>Apricot</mat-chip>\r\n                            <mat-chip color=\"coral\"\r\n                                      selected>Coral</mat-chip>\r\n                            <mat-chip color=\"cherry\"\r\n                                      selected>Cherry Pink</mat-chip>\r\n                            <mat-chip color=\"violine\"\r\n                                      selected>Violine</mat-chip>\r\n                            <mat-chip color=\"royal\"\r\n                                      selected>Royal</mat-chip>\r\n                            <mat-chip color=\"grass\"\r\n                                      selected>Grass</mat-chip>\r\n                            <mat-chip color=\"aqua\"\r\n                                      selected>Aqua</mat-chip>\r\n                            <mat-chip color=\"duck\"\r\n                                      selected>Duck</mat-chip>\r\n                        </mat-chip-list>\r\n                    </mat-card>\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <!-- chips -->\r\n            <!-- <mat-grid-list cols=\"4\"\r\n\t\t\t               class=\"docs-component-overview\"\r\n                           gutterSize=\"24px\"> -->\r\n\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutGap=\"24px\">\r\n                <!-- button -->\r\n                <div fxFlex=\"33\">\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <h2>{{'BUTTONS_BOX.TITLE'| translate}}</h2>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <!-- star button -->\r\n                            <button mat-button>{{'BUTTONS_BOX.BASIC'| translate}}</button>\r\n                            <button mat-raised-button>{{'BUTTONS_BOX.RAISED'| translate}}</button>\r\n                            <!-- end button -->\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n                <div fxFlex=\"33\">\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <h2>{{'FLOATING_ACTION_BUTTON_BOX.TITLE' | translate}}</h2>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <!-- start floating -->\r\n                            <button mat-fab\r\n                                    class=\"floating-menu\"\r\n                                    color=\"accent\"\r\n                                    [matMenuTriggerFor]=\"menu\">\r\n                                <mat-icon class=\"mdc-fab__icon material-icons\">add</mat-icon>\r\n                            </button>\r\n                            <mat-menu #menu=\"matMenu\"\r\n                                      class=\"floating-menu\">\r\n                                <h5>\r\n                                    <mat-icon class=\"mdc-fab__icon material-icons\">edit</mat-icon>\r\n                                    <span>{{'FLOATING_ACTION_BUTTON_BOX.CUSTOMIZE' | translate}} </span>\r\n                                </h5>\r\n                                <button mat-menu-item>\r\n                                    <mat-icon>lock_outline</mat-icon>\r\n                                    <span>{{'FLOATING_ACTION_BUTTON_BOX.CLOSE' | translate}}</span>\r\n                                </button>\r\n                                <button mat-menu-item>\r\n                                    <mat-icon>not_interested_outlined</mat-icon>\r\n                                    <span>{{'FLOATING_ACTION_BUTTON_BOX.NEW_CALL_OFF' | translate}}</span>\r\n                                </button>\r\n                                <button mat-menu-item>\r\n                                    <mat-icon>directions_boat</mat-icon>\r\n                                    <span>{{'FLOATING_ACTION_BUTTON_BOX.ASSIGN' | translate}}</span>\r\n                                </button>\r\n                                <button mat-menu-item>\r\n                                    <mat-icon>call_split</mat-icon>\r\n                                    <span>{{'FLOATING_ACTION_BUTTON_BOX.SPLIT' | translate}}</span>\r\n                                </button>\r\n                                <button mat-menu-item>\r\n                                    <mat-icon>placet</mat-icon>\r\n                                    <span>{{'FLOATING_ACTION_BUTTON_BOX.ALLOCATE' | translate}}</span>\r\n                                </button>\r\n                            </mat-menu>\r\n                            <button mat-fab\r\n                                    class=\"fab-menu\"\r\n                                    color=\"primary\">\r\n                                <mat-icon class=\"mdc-fab__icon material-icons\">add</mat-icon>\r\n                            </button>\r\n                            <button mat-raised-button\r\n                                    class=\"fab-text-button\"\r\n                                    color=\"accent\">\r\n                                <mat-icon class=\"mdc-fab__icon material-icons\">add</mat-icon>\r\n                                {{'BUTTON_LABEL' | translate}}\r\n                            </button>\r\n\r\n                            <!-- end floating -->\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n                <div fxFlex=\"33\">\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <h2>{{'TOOLTIP_BOX.TITLE' | translate}}</h2>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n\r\n                            <section class=\"matTooltip\">\r\n                                <span>{{'TOOLTIP_BOX.TEST' | translate}}</span>\r\n                                <mat-icon matTooltip=\"{{'TOOLTIP_BOX.TOOLTIP' | translate}}\">error</mat-icon>\r\n                            </section>\r\n\r\n                            <section>\r\n                                <mat-form-field class=\"mat-form-field\">\r\n                                    <input matInput\r\n                                           placeholder=\"{{'TOOLTIP_BOX.FIELD' | translate}} \">\r\n                                    <mat-icon matSuffix\r\n                                              matTooltip=\"{{'TOOLTIP_BOX.TOOLTIP' | translate}}\">error</mat-icon>\r\n                                </mat-form-field>\r\n                            </section>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <!-- EMPTY STATE -->\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutGap=\"24px\">\r\n                <div fxFlex=\"50\">\r\n                    <atlas-empty-state title=\"{{'EMPTY_STATE_BOX_1.TITLE' | translate}}\"\r\n                                       message=\"{{'EMPTY_STATE_BOX_1.MESSAGE' | translate}}\"></atlas-empty-state>\r\n                </div>\r\n\r\n                <div fxFlex=\"25\">\r\n                    <atlas-empty-state title=\"{{'EMPTY_STATE_BOX_2.TITLE' | translate}}\"\r\n                                       message=\"{{'EMPTY_STATE_BOX_2.MESSAGE' | translate}}\"></atlas-empty-state>\r\n                </div>\r\n                <div fxFlex=\"25\">\r\n                    <atlas-empty-state title=\"{{'EMPTY_STATE_BOX_3.TITLE' | translate}}\"\r\n                                       message=\"{{'EMPTY_STATE_BOX_3.MESSAGE' | translate}}\"></atlas-empty-state>\r\n                </div>\r\n            </div>\r\n\r\n            <div fxLayout=\"row\">\r\n                <div fxFlex>\r\n                    <mat-card>\r\n                        <mat-horizontal-stepper #stepper\r\n                                                color=\"accent\">\r\n                            <mat-step>\r\n                                <ng-template matStepLabel>{{'STEPPER.PERSONAL_INFO' | translate}}</ng-template>\r\n                                <div fxLayout=\"row\"\r\n                                     fxLayoutAlign=\"center center\">\r\n                                    <div fxFlex=\"30%\">\r\n                                        <form class=\"form-control\">\r\n                                            <mat-form-field>\r\n                                                <input type=\"text\"\r\n                                                       placeholder=\"{{'NAME' | translate}}\"\r\n                                                       matInput>\r\n                                            </mat-form-field>\r\n                                            <mat-form-field>\r\n                                                <input type=\"text\"\r\n                                                       placeholder=\"{{'USERNAME' | translate}}\"\r\n                                                       matInput>\r\n                                            </mat-form-field>\r\n                                            <div class=\"full-width\"\r\n                                                 align=\"end\">\r\n                                                <button mat-raised-button\r\n                                                        matStepperNext>{{'NEXT' | translate}}</button>\r\n                                            </div>\r\n                                        </form>\r\n                                    </div>\r\n                                </div>\r\n                            </mat-step>\r\n                            <mat-step>\r\n                                <ng-template matStepLabel>{{'STEPPER.FILL_OUT_ADDRESS' | translate}}</ng-template>\r\n                                <div fxLayout=\"row\"\r\n                                     fxLayoutAlign=\"center center\">\r\n                                    <div fxFlex=\"30%\">\r\n                                        <form>\r\n                                            <mat-form-field style=\"position: relative !important;\">\r\n                                                <input matInput\r\n                                                       placeholder=\"{{'ADDRESS' | translate}}\">\r\n                                            </mat-form-field>\r\n                                            <mat-form-field>\r\n                                                <input type=\"text\"\r\n                                                       placeholder=\"{{'CITY' | translate}}\"\r\n                                                       matInput>\r\n                                            </mat-form-field>\r\n                                            <mat-form-field>\r\n                                                <input type=\"text\"\r\n                                                       placeholder=\"{{'COUNTRY' | translate}}\"\r\n                                                       matInput>\r\n                                            </mat-form-field>\r\n                                            <div class=\"full-width\"\r\n                                                 align=\"end\">\r\n                                                <button mat-button\r\n                                                        matStepperPrevious>{{'BACK' | translate}}</button>\r\n                                                <button mat-raised-button\r\n                                                        matStepperNext>{{'NEXT' | translate}}</button>\r\n                                            </div>\r\n                                        </form>\r\n                                    </div>\r\n                                </div>\r\n                            </mat-step>\r\n                            <mat-step>\r\n                                <ng-template matStepLabel>{{'STEPPER.DONE' | translate}}</ng-template>\r\n                                <div fxLayout=\"row\"\r\n                                     fxLayoutAlign=\"center center\">\r\n                                    <div fxFlex=\"30%\">\r\n                                        <h2 [innerHTML]=\"'STEPPER.END_MESSAGE' | translate\">\r\n                                        </h2>\r\n                                        <div class=\"full-width\"\r\n                                             align=\"end\">\r\n                                            <button mat-button\r\n                                                    matStepperPrevious>{{'BACK' | translate}}</button>\r\n                                            <button mat-raised-button\r\n                                                    (click)=\"stepper.reset()\">{{'RESET' | translate}}</button>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </mat-step>\r\n                        </mat-horizontal-stepper>\r\n                    </mat-card>\r\n                </div>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutap=\"24px\">\r\n                <!-- progress bar -->\r\n                <div fxFlex=\"33\">\r\n                    <mat-card>\r\n                        <h2>{{'PROGRESS_BOX.TITLE' | translate}}</h2>\r\n                        <mat-card-content>\r\n                            <h3>{{'PROGRESS_BOX.INDETERMINATE' | translate}}</h3>\r\n                            <mat-progress-spinner color=\"accent\"\r\n                                                  mode=\"indeterminate\"></mat-progress-spinner>\r\n                            <mat-progress-bar color=\"accent\"\r\n                                              mode=\"indeterminate\"></mat-progress-bar>\r\n                        </mat-card-content>\r\n                        <mat-card-content>\r\n                            <h3>{{'PROGRESS_BOX.DETERMINATE' | translate}}</h3>\r\n                            <mat-progress-spinner color=\"accent\"\r\n                                                  mode=\"determinate\"\r\n                                                  value=\"34\"></mat-progress-spinner>\r\n\r\n                            <mat-progress-bar color=\"accent\"\r\n                                              mode=\"determinate\"\r\n                                              value=\"40\"></mat-progress-bar>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n                <div fxFlex=\"33\"\r\n                     fxLayoutAlign=\"center center\">\r\n                    <mat-button-toggle-group class=\"toggle-group\"\r\n                                             name=\"fontStyle\"\r\n                                             aria-label=\"Font Style\">\r\n                        <mat-button-toggle value=\"\">{{'TOOGLE' | translate}}</mat-button-toggle>\r\n                        <mat-button-toggle value=\"\">{{'TOOGLE_SELECTED' | translate}}\r\n                        </mat-button-toggle>\r\n                        <mat-button-toggle value=\"\">{{'TOOGLE' | translate}}</mat-button-toggle>\r\n                    </mat-button-toggle-group>\r\n                </div>\r\n                <!-- Form Controls -->\r\n                <div fxFlex=\"33\">\r\n                    <mat-card>\r\n                        <mat-card-content>\r\n                            <div class=\"form-control\">\r\n                                <section>\r\n                                    <mat-checkbox [(ngModel)]=\"selectedAll\"\r\n                                                  (change)=\"selectAll();\"\r\n                                                  [(indeterminate)]=\"indeterminate\">{{'CHECKBOX.PARENT'|translate}}\r\n                                    </mat-checkbox>\r\n                                </section>\r\n                                <mat-divider></mat-divider>\r\n                                <section>\r\n                                    <mat-checkbox *ngFor=\"let n of names\"\r\n                                                  [(ngModel)]=\"n.selected\"\r\n                                                  (change)=\"checkIfAllSelected();checkIfOneSelected()\">\r\n                                        {{n.name | translate}}\r\n                                    </mat-checkbox>\r\n\r\n                                    <mat-checkbox class=\"\"\r\n                                                  [(ngModel)]=\"indeterminate\">{{'CHECKBOX.INDETERMINATE'|translate}}\r\n                                    </mat-checkbox>\r\n                                </section>\r\n\r\n                                <section>\r\n                                    <mat-radio-group>\r\n                                        <mat-radio-button value=\"radio1\">{{'CHECKBOX.RADIO_BUTTON'|translate}}\r\n                                        </mat-radio-button>\r\n                                        <mat-radio-button value=\"radio2\">{{'CHECKBOX.RADIO_BUTTON'|translate}}\r\n                                        </mat-radio-button>\r\n                                    </mat-radio-group>\r\n                                </section>\r\n                                <hr>\r\n                                <section>\r\n                                    <mat-slide-toggle>{{'CHECKBOX.SLIDE_TOOGLE'|translate}}</mat-slide-toggle>\r\n                                </section>\r\n                            </div>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n            </div>\r\n\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"space-around center\"\r\n                 fxLayoutGap=\"24px\"\r\n                 fxLayout.xs=\"column\">\r\n\r\n                <div flex=\"30\"\r\n                     fxFlexOrder.xs=\"2\">\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <h2>{{'CARD.1' | translate}}</h2>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <p>Lorem ipsum dolor sit amet consecte tur adipisicing elit. Earum molestiae aut adipisci\r\n                                autem est, dicta\r\n                                excepturi quam alias, sed libero voluptates rerum. Quam distinctio libero est aut\r\n                                reprehenderit at error? </p>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n                <div flex=\"30\">\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <h2>{{'CARD.2' | translate}}</h2>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut ad eius, libero eaque\r\n                                impedit saepe natus quasi\r\n                                odio minus sint iste nesciunt. Voluptates, corrupti asperiores numquam dolorem hic\r\n                                deleniti aut?</p>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n                <div flex=\"30\">\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <h2>{{'CARD.3' | translate}}</h2>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem voluptatum, nam,\r\n                                nesciunt ex quod quam ea\r\n                                ipsam excepturi, dolorum ducimus quasi impedit perferendis repellat dolores deserunt\r\n                                minima cum. Consequatur,\r\n                                cupiditate.\r\n                            </p>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n            </div>\r\n            <div fxFill>\r\n                <mat-card>\r\n                    <mat-card-header>\r\n                        <h2>{{'CARD.4' | translate}}</h2>\r\n                    </mat-card-header>\r\n                    <mat-card-content>\r\n                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem voluptatum, nam,\r\n                            nesciunt ex quod quam ea\r\n                            ipsam excepturi, dolorum ducimus quasi impedit perferendis repellat dolores deserunt minima\r\n                            cum. Consequatur,\r\n                            cupiditate.\r\n                        </p>\r\n                    </mat-card-content>\r\n                </mat-card>\r\n            </div>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"space-around center\">\r\n            <div fxFlex=\"33\">\r\n                <mat-card>\r\n                    <mat-card-header>\r\n                        <h2>{{'DIALOG_BOX.TITLE' | translate}}</h2>\r\n                    </mat-card-header>\r\n                    <mat-card-content>\r\n                        <mat-form-field>\r\n                            <input matInput\r\n                                   [(ngModel)]='fname'\r\n                                   placeholder=\"{{'DIALOG_BOX.FIELD_NAME' | translate}}\">\r\n                        </mat-form-field>\r\n                        <button mat-raised-button\r\n                                (click)=\"openAddFileDialog()\">{{'DIALOG_BOX.OPEN_DIALOG' | translate}}</button>\r\n                    </mat-card-content>\r\n                    <li *ngIf=\"animal\"\r\n                        class=\"display_animal\">\r\n                        {{'DIALOG_BOX.CHOICE' | translate}}\r\n                        <i>{{animal}}</i>\r\n                    </li>\r\n                </mat-card>\r\n            </div>\r\n            <div fxFlex=\"33\">\r\n                <!-- Contextual Search -->\r\n                <mat-card>\r\n                    <mat-card-header>\r\n                        <h1>{{'CONTEXTUAL_SEARCH_BOX.TITLE' | translate}}</h1>\r\n                    </mat-card-header>\r\n                    <mat-card-content>\r\n                        <mat-form-field>\r\n                            <input matInput\r\n                                   placeholder=\"{{'CONTEXTUAL_SEARCH_BOX.FIELD_NAME' | translate}}\">\r\n                            <mat-icon matSuffix\r\n                                      class=\"compass-icon\"\r\n                                      (click)=\"openDialog()\">explore</mat-icon>\r\n                        </mat-form-field>\r\n                    </mat-card-content>\r\n                </mat-card>\r\n                <mat-card>\r\n                    <mat-card-header>\r\n                        <h2>{{'COMMODITY_INPUT_BOX.TITLE'|translate}}</h2>\r\n                    </mat-card-header>\r\n                    <mat-card-content>\r\n                        <atlas-commodity-input></atlas-commodity-input>\r\n                    </mat-card-content>\r\n                </mat-card>\r\n            </div>\r\n        </div>\r\n        <!-- List & Search -->\r\n        <div>\r\n            <h4>{{'LIST_AND_SEARCH'|translate}}</h4>\r\n            <atlas-list-and-search class=\"default-height\"></atlas-list-and-search>\r\n        </div>\r\n        <div fxLayout=\"row\">\r\n            <div fxFlex>\r\n                <mat-card>\r\n                    <mat-card-header>{{'Ag-Grid Examples'|translate}}</mat-card-header>\r\n                    <div fxLayout=\"row\"\r\n                         fxLayout.xs=\"column\"\r\n                         fxLayoutAlign=\"space-between right\"\r\n                         fxLayoutWrap\r\n                         fxLayoutGap=\"20px\">\r\n                        <div fxFlex=\"10%\"\r\n                             fxFlex.xs=\"10%\"\r\n                             fxFlex.sm=\"10%\">\r\n                            <button mat-icon-button>\r\n                                <mat-icon>settings_backup_restore</mat-icon>\r\n                            </button>\r\n                            <button mat-icon-button\r\n                                    [matMenuTriggerFor]=\"menuAggrid\">\r\n                                <mat-icon>reorder</mat-icon>\r\n                            </button>\r\n                            <button mat-icon-button>\r\n                                <mat-icon>\r\n                                    more_vert</mat-icon>\r\n                            </button>\r\n                            <div>\r\n                                <mat-menu class=\"no-overflow\"\r\n                                          #menuAggrid=\"matMenu\">\r\n                                    <div fxLayout=\"column\"\r\n                                         fxLayoutWrap\r\n                                         fxLayoutGap=\"20px\">\r\n                                        <div *ngFor=\"let col of columnDefs\"\r\n                                             fxFlex=\"100%\"\r\n                                             fxFlex.xs=\"100%\"\r\n                                             fxFlex.sm=\"100%\">\r\n                                            <mat-checkbox [checked]=\"!col.hide\"\r\n                                                          (click)=\"showOrHideColum($event, col)\"\r\n                                                          *ngIf=\"col.headerName != ''\">{{col.headerName}}\r\n                                            </mat-checkbox>\r\n                                        </div>\r\n                                    </div>\r\n                                </mat-menu>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!--Buttons-->\r\n                    <div style='padding-bottom: 15px'\r\n                         fxLayout='row'\r\n                         fxLayoutAlign=\"space-between center\">\r\n                        <mat-slide-toggle mat-raised-button\r\n                                          (change)=\"toggleQuickSum()\">{{'Enable Range Selection'|translate}}\r\n                        </mat-slide-toggle>\r\n                        <div fxLayout='row'\r\n                             fxLayoutAlign=\"space-around center\">\r\n\r\n                            <div *ngFor=\"let column of selectedColumnsArray\">\r\n                                <span style=\"padding-right: 20px;\"\r\n                                      *ngIf=\"column.sum!=0 && quickSumModeActivated\">{{column.name}} :\r\n                                    {{column.sum}}</span>\r\n                            </div>\r\n                            <button mat-button\r\n                                    (click)=\"onClearRange()\"\r\n                                    *ngIf=\"quickSumModeActivated\">{{'Clear Selection'|translate}}</button>\r\n                        </div>\r\n                    </div>\r\n                    <!--Ag grid -->\r\n                    <ag-grid-angular *ngIf=\"!quickSumModeActivated\"\r\n                                     class=\"ag-theme-material\"\r\n                                     style=\"height: 500px;\"\r\n                                     [enableSorting]=\"true\"\r\n                                     [rowData]=\"rowData | async\"\r\n                                     [columnDefs]=\"columnDefs\"\r\n                                     rowSelection=\"multiple\"\r\n                                     [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                     rowMultiSelectWithClick=\"true\"\r\n                                     (columnVisible)=\"onAddOrDeleteColumn($event)\"\r\n                                     (gridReady)=\"onGridReady($event)\">\r\n                    </ag-grid-angular>\r\n\r\n                    <ag-grid-angular *ngIf=\"quickSumModeActivated\"\r\n                                     style=\"height: 500px;\"\r\n                                     class=\"ag-theme-material\"\r\n                                     [enableSorting]=\"true\"\r\n                                     [rowData]=\"rowData | async\"\r\n                                     [columnDefs]=\"columnDefs\"\r\n                                     [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                                     rowSelection=\"multiple\"\r\n                                     [enableRangeSelection]=\"true\"\r\n                                     (gridReady)=\"onGridReady($event)\"\r\n                                     (columnVisible)=\"onAddOrDeleteColumn($event)\"\r\n                                     (rangeSelectionChanged)=\"onRangeSelectionChanged($event)\">\r\n                    </ag-grid-angular>\r\n                </mat-card>\r\n            </div>\r\n        </div>\r\n        <!-- TAB STYLING  -->\r\n        <!-- Tab in the page content is a bright tab -->\r\n        <h2>{{'Bright Tab'|translate}}</h2>\r\n        <mat-tab-group class=\"bright-tab\">\r\n            <mat-tab label=\"{{'First'|translate}}\">\r\n                {{'Number 1'|translate}}\r\n            </mat-tab>\r\n            <mat-tab label=\"{{'Second'|translate}}\">\r\n                {{'Number 2'|translate}}\r\n            </mat-tab>\r\n            <mat-tab label=\"{{'Third'|translate}}\">\r\n                {{'Number 3'|translate}}\r\n            </mat-tab>\r\n        </mat-tab-group>\r\n        <br>\r\n        <!-- Tab in the page content is a dark tab -->\r\n        <h2>{{'Dark Tab - for topbar'|translate}}</h2>\r\n        <div class=\"dark-tab header-tab mat-elevation-z6\">\r\n            <div class=\"header-tab-container\">\r\n                <mat-tab-group [selectedIndex]=selectedIndex\r\n                               (selectedIndexChange)=onSelectedIndexChanged($event)\r\n                               backgroundColor=\"primary\">\r\n                    <mat-tab label=\"{{'trade type'|translate}}\"></mat-tab>\r\n                    <mat-tab label=\"{{'trade type'|translate}}\"></mat-tab>\r\n                    <mat-tab label=\"{{'trade type'|translate}}\"></mat-tab>\r\n                </mat-tab-group>\r\n                <span class=\"fill-space\"></span>\r\n                <!-- Add FAB extanded if needed -->\r\n                <button mat-raised-button\r\n                        class=\"fab-text-button\"\r\n                        color=\"accent\">\r\n                    <mat-icon class=\"mdc-fab__icon material-icons\">add</mat-icon>\r\n                    {{'Label of the button'|translate}}\r\n                </button>\r\n            </div>\r\n        </div>\r\n        <div class=\"content-tab\">\r\n            <mat-tab-group [selectedIndex]=selectedIndex>\r\n                <mat-tab> {{'Content 1'|translate}}\r\n                    <mat-card fxFlex=\"100\">\r\n                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur facilis molestiae quasi fugit\r\n                        natus iure repellat, ipsa eum explicabo autem modi! Molestias delectus repudiandae dicta\r\n                        sapiente, et doloremque consequuntur perspiciatis?\r\n                    </mat-card>\r\n                </mat-tab>\r\n                <mat-tab> {{'Content 2'|translate}} </mat-tab>\r\n                <mat-tab> {{'Content 3'|translate}} </mat-tab>\r\n            </mat-tab-group>\r\n        </div>\r\n        <br>\r\n        <!-- Tab in the page content is a admin tab -->\r\n        <h2>{{'Admin Tab - for topbar'|translate}}</h2>\r\n        <p>{{'The background image needs to be defined in the css class admin-tab'|translate}}</p>\r\n        <div class=\"admin-tab header-tab mat-elevation-z6\">\r\n            <div class=\"header-tab-container\">\r\n                <mat-tab-group [selectedIndex]=selectedIndex\r\n                               (selectedIndexChange)=onSelectedIndexChanged($event)>\r\n                    <mat-tab label=\"{{'trade type'|translate}}\"></mat-tab>\r\n                    <mat-tab label=\"{{'trade type'|translate}}\"></mat-tab>\r\n                    <mat-tab label=\"{{'trade type'|translate}}\"></mat-tab>\r\n                </mat-tab-group>\r\n                <span class=\"fill-space\"></span>\r\n            </div>\r\n        </div>\r\n        <div class=\"content-tab\">\r\n            <mat-tab-group [selectedIndex]=selectedIndex>\r\n                <mat-tab> {{'Content 1'|translate}}\r\n                    <mat-card fxFlex=\"100\">\r\n                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur facilis molestiae quasi fugit\r\n                        natus iure repellat, ipsa eum explicabo autem modi! Molestias delectus repudiandae dicta\r\n                        sapiente, et doloremque consequuntur perspiciatis?\r\n                    </mat-card>\r\n                </mat-tab>\r\n                <mat-tab> {{'Content 2'|translate}} </mat-tab>\r\n                <mat-tab> {{'Content 3'|translate}} </mat-tab>\r\n            </mat-tab-group>\r\n        </div>\r\n        <div>\r\n            <atlas-picklist></atlas-picklist>\r\n        </div>\r\n\r\n        <div>\r\n            <atlas-floating-action-button [fabTitle]=\"fabTitle\"\r\n                                          [fabType]=\"fabType\"\r\n                                          [fabActions]=\"fabMenuActions\"\r\n                                          [isLoaded]=\"true\"\r\n                                          (fabActionClicked)=\"onFabActionClicked($event)\">\r\n            </atlas-floating-action-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.scss":
/*!**********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  margin: 20px; }\n\n.steppers li.active .circle,\n.steppers li.complete .circle {\n  background: green; }\n\n.example-section {\n  margin: 10px; }\n\n.mat-basic-chip {\n  background-color: #e0e0e0;\n  color: rgba(0, 0, 0, 0.87);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  display: inline-flex;\n  padding: 7px 12px;\n  border-radius: 24px;\n  align-items: center;\n  cursor: default;\n  margin: 4px; }\n\n.mat-checkbox,\n.mat-radio-button {\n  margin: 10px; }\n\n.example-empty-state {\n  background-image: url(); }\n\n::ng-deep.ag-icon.ag-icon-checkbox-checked {\n  background-image: url(\"/assets/checkbox.svg\") !important; }\n\n::ng-deep.ag-icon.ag-icon-checkbox-unchecked {\n  background-image: url(\"/assets/check_box_unchecked.svg\") !important;\n  background-size: 24px 24px; }\n\nli.display_animal {\n  margin-top: 10px;\n  list-style-type: none; }\n"

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.ts":
/*!********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.ts ***!
  \********************************************************************************************/
/*! exports provided: UxComponentsListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UxComponentsListComponent", function() { return UxComponentsListComponent; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var ag_grid_enterprise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ag-grid-enterprise */ "./node_modules/ag-grid-enterprise/main.js");
/* harmony import */ var ag_grid_enterprise__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ag_grid_enterprise__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_atlas_translation_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../core/services/atlas-translation.service */ "./Client/app/core/services/atlas-translation.service.ts");
/* harmony import */ var _shared_components_floating_action_button_floating_action_button_type_enum__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/components/floating-action-button/floating-action-button-type.enum */ "./Client/app/shared/components/floating-action-button/floating-action-button-type.enum.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _mock_data_provider_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../mock-data-provider.service */ "./Client/app/hidden/mock-data-provider.service.ts");
/* harmony import */ var _translations_en_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./translations/en.json */ "./Client/app/hidden/ux-components/ux-components-list/translations/en.json");
var _translations_en_json__WEBPACK_IMPORTED_MODULE_12___namespace = /*#__PURE__*/Object.assign({}, _translations_en_json__WEBPACK_IMPORTED_MODULE_12__, {"default": _translations_en_json__WEBPACK_IMPORTED_MODULE_12__});
/* harmony import */ var _translations_fr_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./translations/fr.json */ "./Client/app/hidden/ux-components/ux-components-list/translations/fr.json");
var _translations_fr_json__WEBPACK_IMPORTED_MODULE_13___namespace = /*#__PURE__*/Object.assign({}, _translations_fr_json__WEBPACK_IMPORTED_MODULE_13__, {"default": _translations_fr_json__WEBPACK_IMPORTED_MODULE_13__});
/* harmony import */ var _ux_dialog_list_search_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ux-dialog-list-search.component */ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.ts");
/* harmony import */ var _ux_dialog_text_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ux-dialog-text.component */ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
















var UxComponentsListComponent = /** @class */ (function () {
    function UxComponentsListComponent(http, dialog, gridService, translateService, atlasTranslationService, agGridDataProvider) {
        var _this = this;
        this.http = http;
        this.dialog = dialog;
        this.gridService = gridService;
        this.translateService = translateService;
        this.atlasTranslationService = atlasTranslationService;
        this.agGridDataProvider = agGridDataProvider;
        // --String ressources
        this.translationRessourceMap = new Map([
            ['DIALOG_CLOSED', ''],
        ]);
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["Subject"]();
        this.links = ['First', 'Second', 'Third'];
        this.activeLink = this.links[0];
        this.selectedIndex = 0;
        this.quickSumModeActivated = false;
        this.selectedColumnsArray = new Array();
        /**
         * For Autocomplete
         */
        this.myControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]();
        this.options = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
        /**
         *  For custom input
         */
        this.email = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email]);
        translateService.setTranslation('en', _translations_en_json__WEBPACK_IMPORTED_MODULE_12__, true);
        translateService.setTranslation('fr', _translations_fr_json__WEBPACK_IMPORTED_MODULE_13__, true);
        this.names = [
            { name: 'Child 1', selected: false },
            { name: 'Child 2', selected: false },
            { name: 'Child 3', selected: false },
        ];
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        translateService.onLangChange
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["concatMap"])(function (event) { return _this.getTranslatedColumnDefs(); }))
            .subscribe(function () {
            _this.atlasTranslationService.getTranslatedRessourceMap(_this.translationRessourceMap);
            _this.gridApi.refreshHeader();
        });
    }
    UxComponentsListComponent.prototype.onGridReady = function (params) {
        var _this = this;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.getTranslatedColumnDefs()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroy$)).subscribe(function () {
            _this.gridApi.refreshHeader();
        });
    };
    UxComponentsListComponent.prototype.showOrHideColum = function (event, col) {
        this.gridColumnApi.setColumnVisible(col.colId, col.hide || false);
        event.stopPropagation();
        return false;
    };
    UxComponentsListComponent.prototype.onAddOrDeleteColumn = function (event) {
        var cols = this.columnDefs.filter(function (col) { return col.colId === event.column.colId; });
        if (cols.length !== 1) {
            return;
        }
        cols[0].hide = !event.visible;
    };
    UxComponentsListComponent.prototype.onRangeSelectionChanged = function (event) {
        this.selectedColumnsArray = [];
        var rangeSelections = this.gridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        var firstRange = rangeSelections[0];
        var startRow = Math.min(firstRange.start.rowIndex, firstRange.end.rowIndex);
        var endRow = Math.max(firstRange.start.rowIndex, firstRange.end.rowIndex);
        var api = this.gridApi;
        var columnIndex = 0;
        var sum = 0;
        var columnName;
        var selectedColumnsArray = this.selectedColumnsArray;
        firstRange.columns.forEach(function (column) {
            sum = 0;
            for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                columnName = column.colDef.headerName;
                var rowModel = api.getModel();
                var rowNode = rowModel.getRow(rowIndex);
                var value = api.getValue(column, rowNode);
                if (typeof value === 'number') {
                    sum += value;
                }
            }
            selectedColumnsArray.push({ name: columnName, sum: sum });
        });
        this.selectedColumnsArray = selectedColumnsArray;
    };
    UxComponentsListComponent.prototype.toggleQuickSum = function () {
        this.quickSumModeActivated = !this.quickSumModeActivated;
        this.selectedColumnsArray = [];
    };
    UxComponentsListComponent.prototype.onClearRange = function () {
        this.gridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    };
    UxComponentsListComponent.prototype.applyFilter = function (filterValue) {
        this.gridApi.setQuickFilter(filterValue.trim().toLowerCase());
    };
    UxComponentsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.atlasTranslationService.getTranslatedRessourceMap(this.translationRessourceMap);
        // for ag-grid
        this.columnDefs = this.agGridDataProvider.getColumnDef();
        this.rowData = this.http.get('https://api.myjson.com/bins/15psn9');
        /**
         * For Autocomplete
         */
        this.filteredOptions = this.myControl.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["startWith"])(''), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["map"])(function (value) { return (typeof value === 'string' ? value : value.name); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["map"])(function (name) { return (name ? _this._filter(name) : _this.options.slice()); }));
        // For FAB
        this.initFAB();
    };
    UxComponentsListComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
    };
    /**
     * For Autocomplete
     */
    UxComponentsListComponent.prototype.displayFn = function (user) {
        return user ? user.name : undefined;
    };
    UxComponentsListComponent.prototype._filter = function (name) {
        var filterValue = name.toLowerCase();
        return this.options.filter(function (option) { return option.name.toLowerCase().indexOf(filterValue) === 0; });
    };
    UxComponentsListComponent.prototype.getErrorMessage = function () {
        return this.email.hasError('required')
            ? 'You must enter a value'
            : this.email.hasError('email')
                ? 'Not a valid email'
                : '';
    };
    /**
     *  For checkbox
     */
    UxComponentsListComponent.prototype.selectAll = function () {
        for (var i = 0; i < this.names.length; i++) {
            this.names[i].selected = this.selectedAll;
        }
    };
    UxComponentsListComponent.prototype.checkIfAllSelected = function () {
        this.selectedAll = this.names.every(function (item) {
            return item.selected === true;
        });
    };
    UxComponentsListComponent.prototype.checkIfOneSelected = function () {
        if (this.selectedAll === true) {
            this.indeterminate = false;
        }
        else {
            this.indeterminate = this.names.some(function (item) {
                return item.selected === true;
            });
        }
    };
    UxComponentsListComponent.prototype.openAddFileDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_ux_dialog_text_component__WEBPACK_IMPORTED_MODULE_15__["DialogComponent"], {
            width: '250px',
            data: { fname: this.fname, animal: this.animal },
        });
        dialogRef.afterClosed()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroy$)).subscribe(function (result) {
            console.log(_this.translationRessourceMap['DIALOG_CLOSED']);
            _this.animal = result;
        });
    };
    UxComponentsListComponent.prototype.openDialog = function () {
        var dialogRef = this.dialog.open(_ux_dialog_list_search_component__WEBPACK_IMPORTED_MODULE_14__["ListSearchDialogComponent"], {
            width: '80%',
        });
    };
    // for tab matching index
    UxComponentsListComponent.prototype.onSelectedIndexChanged = function (value) {
        this.selectedIndex = value;
    };
    /**
     * For FAB
     */
    UxComponentsListComponent.prototype.initFAB = function () {
        this.fabTitle = 'FAB Button';
        this.fabType = _shared_components_floating_action_button_floating_action_button_type_enum__WEBPACK_IMPORTED_MODULE_9__["FABType"].MiniFAB;
        this.fabMenuActions = [
            {
                icon: 'edit',
                text: 'Edit Trade',
                action: 'editTrade',
                disabled: false,
                index: 1,
            },
            {
                icon: 'add',
                text: 'Create Trade',
                action: 'createTrade',
                disabled: false,
                index: 0,
            },
        ];
    };
    UxComponentsListComponent.prototype.onFabActionClicked = function (action) {
        switch (action) {
            case 'createTrade': {
                console.log('createTrade');
                break;
            }
            case 'editTrade': {
                console.log('editTrade');
                break;
            }
        }
    };
    UxComponentsListComponent.prototype.getTranslatedColumnDefs = function () {
        var _this = this;
        var observableList = [];
        this.columnDefs.forEach(function (column) {
            if (column.colId) {
                var headerToTranslate = column.colId;
                observableList.push(_this.translateService.get(headerToTranslate));
            }
        });
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["forkJoin"])(observableList).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["map"])(function (result) {
            for (var i = 0; i < _this.columnDefs.length; i++) {
                if (_this.columnDefs[i].colId) {
                    var headerNameTranslation = result[i];
                    _this.gridApi.getColumnDef(_this.columnDefs[i].colId).headerName = headerNameTranslation;
                }
            }
            return _this.columnDefs;
        }));
    };
    UxComponentsListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'atlas-ux-components-list',
            template: __webpack_require__(/*! ./ux-components-list.component.html */ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.html"),
            styles: [__webpack_require__(/*! ./ux-components-list.component.scss */ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"],
            _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialog"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_10__["AgGridService"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"],
            _core_services_atlas_translation_service__WEBPACK_IMPORTED_MODULE_8__["AtlasTranslationService"],
            _mock_data_provider_service__WEBPACK_IMPORTED_MODULE_11__["MockDataProviderService"]])
    ], UxComponentsListComponent);
    return UxComponentsListComponent;
}());



/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.html":
/*!*************************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.html ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 mat-dialog-title>Lightbox Title\r\n    <button mat-icon-button\r\n            mat-dialog-close\r\n            class=\"close-dialog-btn\">\r\n        <mat-icon aria-label=\"Closing button\">clear</mat-icon>\r\n    </button></h1>\r\n\r\n<mat-dialog-content>\r\n    <ag-grid-angular style=\"height: 500px;\"\r\n                     class=\"ag-theme-material\"\r\n                     [rowData]=\"rowData\"\r\n                     [columnDefs]=\"columnDefs\"\r\n                     [rowHeight]=\"24\">\r\n    </ag-grid-angular>\r\n</mat-dialog-content>\r\n\r\n\r\n<mat-divider></mat-divider>\r\n\r\n<mat-dialog-actions>\r\n    <button mat-button\r\n            mat-dialog-close>discard</button>\r\n</mat-dialog-actions>\r\n"

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.ts":
/*!***********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.ts ***!
  \***********************************************************************************************/
/*! exports provided: ListSearchDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListSearchDialogComponent", function() { return ListSearchDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ListSearchDialogComponent = /** @class */ (function () {
    function ListSearchDialogComponent() {
        this.rowData = [
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'Porsche', model: 'Boxter', price: 72000 },
        ];
        this.columnDefs = [
            { headerName: 'Make', field: 'make' },
            { headerName: 'Model', field: 'model' },
            { headerName: 'Price', field: 'price' },
            { checkboxSelection: true },
        ];
    }
    ListSearchDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-list-search-dialog',
            template: __webpack_require__(/*! ./ux-dialog-list-search.component.html */ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-list-search.component.html"),
        }),
        __metadata("design:paramtypes", [])
    ], ListSearchDialogComponent);
    return ListSearchDialogComponent;
}());



/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.html":
/*!******************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>{{'DIALOG_BOX.GREETINGS' | translate}} {{data.fname}}</h1>\r\n<div mat-dialog-content>\r\n    <p>{{'DIALOG_BOX.QUESTION' | translate}}</p>\r\n    <mat-form-field>\r\n        <input matInput\r\n               [(ngModel)]=\"data.animal\"\r\n               required>\r\n    </mat-form-field>\r\n</div>\r\n<mat-dialog-actions>\r\n    <button mat-raised-button\r\n            type=\"button\"\r\n            [mat-dialog-close]=\"data.animal\">Ok</button>\r\n</mat-dialog-actions>\r\n"

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.ts":
/*!****************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.ts ***!
  \****************************************************************************************/
/*! exports provided: DialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogComponent", function() { return DialogComponent; });
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


var DialogComponent = /** @class */ (function () {
    function DialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.hide = false;
    }
    DialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atr-ux-components-list',
            template: __webpack_require__(/*! ./ux-dialog-text.component.html */ "./Client/app/hidden/ux-components/ux-components-list/ux-dialog-text.component.html"),
            styles: [__webpack_require__(/*! ./ux-components-list.component.scss */ "./Client/app/hidden/ux-components/ux-components-list/ux-components-list.component.scss")],
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], DialogComponent);
    return DialogComponent;
}());



/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.html":
/*!**********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"header-background\"\r\n        style=\"background-image:url(http://www.almowatine.com/wp-content/uploads/2017/10/Le-Maroc-d%C3%A9tiendra-un-appel-doffres-pour-lachat-de-bl%C3%A9-am%C3%A9ricain.jpg)\">\r\n    <div class=\"header-container\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"center start\">\r\n            <h1>Trade Capture</h1>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"center start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-button-toggle-group class=\"toggle-group\"\r\n                                     name=\"toggleStyle\"\r\n                                     aria-label=\"Example button\">\r\n                <mat-button-toggle value=\"\">toggle</mat-button-toggle>\r\n                <mat-button-toggle value=\"\">toggle</mat-button-toggle>\r\n            </mat-button-toggle-group>\r\n            <mat-form-field fxFlex=\"25%\">\r\n                <input matInput\r\n                       placeholder=\"Contract Reference\"\r\n                       value=\"XXXXXXXXXXXXXxx\">\r\n            </mat-form-field>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"center start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"10%\">\r\n                <input matInput\r\n                       placeholder=\"Contract Reference\"\r\n                       value=\"XXXXXXXXXXXXXxx\">\r\n            </mat-form-field>\r\n            <mat-form-field fxFlex=\"10%\">\r\n                <input matInput\r\n                       placeholder=\"Contract Reference\"\r\n                       value=\"XXXXXXXXXXXXXxx\">\r\n            </mat-form-field>\r\n            <mat-form-field fxFlex=\"10%\">\r\n                <input matInput\r\n                       placeholder=\"Contract Reference\"\r\n                       value=\"XXXXXXXXXXXXXxx\">\r\n            </mat-form-field>\r\n        </div>\r\n    </div>\r\n</header>\r\n<main>\r\n    <mat-tab-group dynamicHeight>\r\n        <mat-tab label=\"LAYOUT 2 COLUMNS\">\r\n            <!-- Layout divided by column -->\r\n            <!-- container -->\r\n            <div fxLayout=\"row\"\r\n                 fxLayout.md=\"column\"\r\n                 fxLayoutAlign=\"space-between\"\r\n                 fxLayoutGap=\"5%\">\r\n                <!-- Left -->\r\n                <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"start center\"\r\n                     fxFlex=\"45\"\r\n                     fxFlexOffset=\"5%\">\r\n                    <mat-card fxFlexOffset=\"5%\">\r\n                        <mat-card-header>\r\n                            <mat-card-title>\r\n                                <h2>Counterparty</h2>\r\n                            </mat-card-title>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <p>\r\n                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius\r\n                                tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium.\r\n                                Quaerat quod nemo rem.\r\n                            </p>\r\n                            <mat-form-field class=\"mat-form-field\">\r\n                                <input matInput\r\n                                       placeholder=\"Input\"\r\n                                       placeholder=\"Field with \">\r\n                                <mat-icon matSuffix\r\n                                          matTooltip=\"This is a tooltip\">error</mat-icon>\r\n                            </mat-form-field>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                    <mat-card>\r\n                        <mat-card-header>\r\n                            <mat-card-title>\r\n                                <h2>Quantity</h2>\r\n                            </mat-card-title>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <p>\r\n                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius\r\n                                tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium.\r\n                                Quaerat quod nemo rem.\r\n                            </p>\r\n                            <mat-form-field class=\"mat-form-field\">\r\n                                <input matInput\r\n                                       placeholder=\"Input\"\r\n                                       placeholder=\"Field with \">\r\n                                <mat-icon matSuffix\r\n                                          matTooltip=\"This is a tooltip\">error</mat-icon>\r\n                            </mat-form-field>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n                <!-- Rigth -->\r\n                <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"start center\"\r\n                     fxFlex=\"45\">\r\n                    <mat-card fxFlexOffset=\"5%\"\r\n                              fxFlexOffset.md=\"0\"\r\n                              fxFlexOffset.xs=\"0\">\r\n                        <mat-card-header>\r\n                            <mat-card-title>\r\n                                <h2>Commodity</h2>\r\n                            </mat-card-title>\r\n                        </mat-card-header>\r\n                        <mat-card-content>\r\n                            <div fxLayout=\"row\">\r\n                                <img mat-card-sm-image\r\n                                     src=\"https://material.angular.io/assets/img/examples/shiba1.jpg\"\r\n                                     fxFlexOffset=\"2%\">\r\n                                <div fxLayout=\"column\"\r\n                                     fxFlexOffset=\"2%\">\r\n                                    <h4 class=\"no-margin\">RIC_ING_WWW_2347</h4>\r\n                                    <p class=\"no-margin\">\r\n                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad doloremque maxime inventore quo nulla doloribus dolore\r\n                                    </p>\r\n                                </div>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutGap=\"5%\">\r\n                                <div fxLayout=\"column\">\r\n                                    <h5 class=\"no-margin data-label \"\r\n                                        fxFlexOffset=\"30% \">Code value</h5>\r\n                                    <p class=\"no-margin \">XXXXXXX</p>\r\n                                </div>\r\n                                <div fxLayout=\"column \"\r\n                                     fxFlexOffset=\"1% \">\r\n                                    <h5 class=\"no-margin data-label \"\r\n                                        fxFlexOffset=\"30% \">Code value</h5>\r\n                                    <p class=\"no-margin \">XXXXXXX</p>\r\n                                </div>\r\n                            </div>\r\n                        </mat-card-content>\r\n                    </mat-card>\r\n                </div>\r\n            </div>\r\n\r\n            <mat-divider></mat-divider>\r\n            <div fxLayout=\"row \"\r\n                 fxLayoutAlign=\"space-between center \">\r\n                <div fxLayout=\"column \"\r\n                     fxLayoutAlign=\"start start \">\r\n                    <button mat-button\r\n                            fxFlexOffset=\"20% \">cancel</button>\r\n                </div>\r\n                <div fxLayout=\"column \"\r\n                     fxLayoutAlign=\"start end \">\r\n                    <div fxLayout=\"row \"\r\n                         fxLayoutAlign=\"end start \"\r\n                         fxFlexOffset=\"20% \">\r\n                        <button mat-button>add costs</button>\r\n                        <button mat-raised-button>save</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n        </mat-tab>\r\n\r\n    </mat-tab-group>\r\n</main>"

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.scss":
/*!**********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "main {\n  margin: 50px; }\n\n.example-card {\n  max-width: 100%; }\n\n.header-background {\n  background: bottom/cover url(\"/assets/img/empty-status.png\"); }\n\n.no-margin {\n  margin: 0; }\n\n.data-label {\n  color: #928D8F; }\n"

/***/ }),

/***/ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.ts":
/*!********************************************************************************************!*\
  !*** ./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.ts ***!
  \********************************************************************************************/
/*! exports provided: UxLayoutTemplateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UxLayoutTemplateComponent", function() { return UxLayoutTemplateComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UxLayoutTemplateComponent = /** @class */ (function () {
    function UxLayoutTemplateComponent() {
    }
    UxLayoutTemplateComponent.prototype.ngOnInit = function () {
    };
    UxLayoutTemplateComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atr-ux-layout-template',
            template: __webpack_require__(/*! ./ux-layout-template.component.html */ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.html"),
            styles: [__webpack_require__(/*! ./ux-layout-template.component.scss */ "./Client/app/hidden/ux-components/ux-layout-template/ux-layout-template.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], UxLayoutTemplateComponent);
    return UxLayoutTemplateComponent;
}());

// <mat-tab label="Layout with row wrap">
// <!-- Layout by row wrap -->
// <div fxLayout="row wrap ">
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="2" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Counterparty</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium. Quaerat quod nemo rem.
//                 </p>
//                 <mat-form-field class="mat-form-field ">
//                     <input matInput placeholder="Input " placeholder="Field with ">
//                     <mat-icon matSuffix matTooltip="This is a tooltip ">error</mat-icon>
//                 </mat-form-field>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="5" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Commodity</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad doloremque maxime inventore quo nulla doloribus dolore, veritatis ipsam nisi quae, incidunt animi repudiandae dolorum? Molestiae illo odio quis placeat rerum.
//                 </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="2" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Quantity</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium. Quaerat quod nemo rem.
//                 </p>
//                 <mat-form-field class="mat-form-field ">
//                     <input matInput placeholder="Input " placeholder="Field with ">
//                     <mat-icon matSuffix matTooltip="This is a tooltip ">error</mat-icon>
//                 </mat-form-field>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="5" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Test</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium. Quaerat quod nemo rem.
//                 </p>
//                 <mat-form-field class="mat-form-field ">
//                     <input matInput placeholder="Input " placeholder="Field with ">
//                     <mat-icon matSuffix matTooltip="This is a tooltip ">error</mat-icon>
//                 </mat-form-field>
//             </mat-card-content>
//         </mat-card>
//     </div>
// </div>
// </mat-tab>
// <mat-tab label="Flex Order Layout">
// <!-- Layout with card order -->
// <div fxLayout="row" fxLayout.xs="column" class="container-lg" fxLayoutGap="5%">
//     <div fxFlex="20" fxFlexOrder.xs="2">
//         <mat-card>
//             <mat-card-header>
//                 <h2>1</h2>
//             </mat-card-header>
//             <mat-card-content>
//                 <p> fxFlex="20" </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="30">
//         <mat-card>
//             <mat-card-header>
//                 <h2>2</h2>
//             </mat-card-header>
//             <mat-card-content>
//                 <p> fxFlex="30" </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="50">
//         <mat-card>
//             <mat-card-header>
//                 <h2>3</h2>
//             </mat-card-header>
//             <mat-card-content>
//                 <p> fxFlex="50" </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
// </div>
// </mat-tab>


/***/ })

}]);
//# sourceMappingURL=hidden-hidden-module.js.map