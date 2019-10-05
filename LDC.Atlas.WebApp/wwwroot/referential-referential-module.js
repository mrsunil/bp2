(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["referential-referential-module"],{

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.html":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.html ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-raised-button\r\n        style=\"width:55px;height:32px;\"\r\n        (click)=\"onDetailsPreviousButtonClicked()\">\r\n    APPLY\r\n</button>"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.scss":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.scss ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button.mat-raised-button {\n  margin: 2px;\n  padding: 0 5px 5px; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.ts":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.ts ***!
  \**************************************************************************************************************************/
/*! exports provided: CounterpartyApplyButtonComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyApplyButtonComponent", function() { return CounterpartyApplyButtonComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CounterpartyApplyButtonComponent = /** @class */ (function () {
    function CounterpartyApplyButtonComponent(route) {
        this.route = route;
    }
    CounterpartyApplyButtonComponent.prototype.agInit = function (params) {
        this.params = params;
        this.rowIndex = params.rowIndex;
        this.pinnedRowData = params.data;
    };
    CounterpartyApplyButtonComponent.prototype.ngOnInit = function () {
    };
    CounterpartyApplyButtonComponent.prototype.refresh = function (params) {
        return false;
    };
    CounterpartyApplyButtonComponent.prototype.onDetailsPreviousButtonClicked = function () {
        this.params.context.componentParent.updateAllRow(this.pinnedRowData);
    };
    CounterpartyApplyButtonComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-apply-button',
            template: __webpack_require__(/*! ./counterparty-apply-button.component.html */ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-apply-button.component.scss */ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], CounterpartyApplyButtonComponent);
    return CounterpartyApplyButtonComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.html":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.html ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\"\r\n     fxLayoutAlign=\"space-around start\">\r\n    <div fxLayout=\"column\"\r\n         fxFlex=\"98.5\">\r\n        <mat-card>\r\n            <mat-card-title class=\"atlas-grid-card-title mat-card-title\">Counterparties to edit</mat-card-title>\r\n            <mat-card-content>\r\n                <div ag-grid=\"detailCounterpartiesLineGridOptions\">\r\n                    <ag-grid-angular class=\"ag-theme-material atr-ag-grid\"\r\n                                     [rowData]=\"editCounterpartyDocumentLines\"\r\n                                     [columnDefs]=\"columnDefs\"\r\n                                     domLayout=\"autoHeight\"\r\n                                     (gridReady)=\"onGridReady($event)\"\r\n                                     [pinnedTopRowData]=\"pinnedTopRowData\"\r\n                                     [pagination]=\"true\"\r\n                                     [paginationPageSize]=\"15\"\r\n                                     [enableSorting]=\"true\"\r\n                                     [enableColResize]=\"false\"\r\n                                     [singleClickEdit]=true\r\n                                     [enableRangeSelection]=\"true\"\r\n                                     (cellValueChanged)=\"onCellValueChanged($event)\"\r\n                                     [rowHeight]=32>\r\n                    </ag-grid-angular>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.scss":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.scss ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "::ng-deep .ag-theme-material .ag-cell-inline-editing {\n  padding: 4px !important;\n  z-index: 0 !important; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.ts":
/*!************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.ts ***!
  \************************************************************************************************************************/
/*! exports provided: CounterpartyDetailComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyDetailComponentComponent", function() { return CounterpartyDetailComponentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component */ "./Client/app/shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component.ts");
/* harmony import */ var _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component */ "./Client/app/shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component.ts");
/* harmony import */ var _shared_entities_status_description_entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/entities/status-description.entity */ "./Client/app/shared/entities/status-description.entity.ts");
/* harmony import */ var _shared_enums_status_description__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/enums/status-description */ "./Client/app/shared/enums/status-description.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _apply_counterparty_apply_button_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./apply/counterparty-apply-button.component */ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CounterpartyDetailComponentComponent = /** @class */ (function () {
    function CounterpartyDetailComponentComponent(masterdataService, route) {
        this.masterdataService = masterdataService;
        this.route = route;
        this.agGridOptions = {};
        this.countryList = new Array();
        this.titleToView = new _shared_entities_status_description_entity__WEBPACK_IMPORTED_MODULE_4__["StatusDescriptionTypes"]();
        this.isSummaryView = false;
        this.counterpartyTradeStatusList = [];
        this.flagOnChangeValue = false;
        this.bulkEditField = 'Bulk edit row';
        this.filteredCompanies = [];
        this.selectedCompanies = [];
    }
    CounterpartyDetailComponentComponent.prototype.ngOnInit = function () {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCountry = this.masterdata.countries;
        this.filteredLdcRegion = this.masterdata.regions;
        this.filteredCounterpartyList = this.masterdata.counterparties;
        this.counterpartyTradeStatusList = this.masterdata.tradeStatus;
        this.filteredProvince = this.masterdata.provinces;
        this.filteredAddressType = this.masterdata.addressTypes;
        this.filteredCompanies = this.masterdata.companies;
        this.statusoptions = [
            {
                titleId: _shared_enums_status_description__WEBPACK_IMPORTED_MODULE_5__["StatusDescription"].StatusActive,
                StatusDescription: 'Active',
            },
            {
                titleId: _shared_enums_status_description__WEBPACK_IMPORTED_MODULE_5__["StatusDescription"].StatusInactive,
                StatusDescription: 'Inactive',
            },
        ];
        this.initializeGridColumns();
    };
    CounterpartyDetailComponentComponent.prototype.onGridReady = function (params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
    };
    CounterpartyDetailComponentComponent.prototype.contractToBeSelected = function (contracts) {
        var _this = this;
        this.editCounterpartyDocumentLines = contracts;
        this.agGridApi.sizeColumnsToFit();
        setTimeout(function () {
            _this.agGridColumnApi.autoSizeAllColumns();
        });
    };
    CounterpartyDetailComponentComponent.prototype.requiredCell = function (params) {
        if (!params.value || params.value === '') {
            return '<div class=\'document-cell-value-required\'>Required*</div>';
        }
        return params.value;
    };
    CounterpartyDetailComponentComponent.prototype.notRequiredCell = function (params) {
        return params.value;
    };
    CounterpartyDetailComponentComponent.prototype.updateAllRow = function (rowData) {
        var _this = this;
        this.columnDefs.forEach(function (columnField) {
            _this.columnName = columnField.field;
            if (rowData[_this.columnName] && rowData[_this.columnName] != _this.bulkEditField) {
                _this.agGridApi.forEachNode(function (rowNode) {
                    rowNode.setDataValue(_this.columnName, rowData[_this.columnName]);
                });
            }
        });
    };
    CounterpartyDetailComponentComponent.prototype.getPinnedTopData = function () {
        return [
            {
                rowStatus: 'Bulk edit row',
                accountReference: '',
                tradeStatusId: '',
                statusId: '',
                accountTitle: '',
                address1: '',
                address2: '',
                main: '',
                city: '',
                country: '',
                zipCode: '',
                mailEmailAddress: '',
                ldcRegion: '',
                province: '',
                addressType: '',
                headOfFamily: '',
                associatedCompanies: '',
                mdmId: '',
                mDMCategoryId: '',
                apply: ' ',
            },
        ];
    };
    CounterpartyDetailComponentComponent.prototype.onCellValueChanged = function (params) {
        if (params.colDef !== 'headOfFamily') {
            if (params.oldValue !== params.newValue) {
                params.node.data.isDirty = true;
                params.node.setDataValue('rowStatus', 'A');
            }
        }
    };
    CounterpartyDetailComponentComponent.prototype.initializeGridColumns = function () {
        var _this = this;
        this.columnDefs = [
            {
                headerName: 'Status',
                colId: 'rowStatus',
                field: 'rowStatus',
                editable: false,
                pinned: 'left',
                cellRenderer: function (params) {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">' + params.value +
                            '</mat-chip></mat-chip-list>';
                    }
                    return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">N</mat-chip></mat-chip-list>';
                },
                pinnedRowCellRenderer: function (params) {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip style="background-color:white;color:black;text-overflow:clip;">' + 'Bulk Edit Row' +
                            '</mt-chip></mat-chip-list>';
                    }
                    return '';
                },
            },
            {
                headerName: 'Account Reference',
                colId: 'accountReference',
                field: 'accountReference',
                editable: true,
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRenderer: this.requiredCell,
                pinnedRowCellRenderer: this.notRequiredCell,
            },
            {
                headerName: 'Trade Status',
                colId: 'tradeStatusId',
                field: 'tradeStatusId',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.counterpartyTradeStatusList,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.counterpartyTradeStatusList,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                },
                onCellValueChanged: function (params) {
                    if (params.data.tradeStatusId && _this.masterdata.tradeStatus) {
                        var tradeStatusValue = _this.masterdata.tradeStatus.find(function (tradeStatus) { return tradeStatus.enumEntityId === params.data.tradeStatusId; });
                        if (tradeStatusValue) {
                            params.node.setDataValue('tradeStatusId', tradeStatusValue.enumEntityId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Status',
                colId: 'statusId',
                field: 'statusId',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.statusoptions,
                    valueProperty: 'titleId',
                    codeProperty: 'titleId',
                    displayProperty: 'StatusDescription',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.statusoptions,
                    valueProperty: 'titleId',
                    codeProperty: 'titleId',
                    displayProperty: 'StatusDescription',
                },
                onCellValueChanged: function (params) {
                    if (_this.statusoptions) {
                        var StatusValue = _this.statusoptions.find(function (status) { return status.titleId === params.data.statusId; });
                        if (StatusValue) {
                            params.node.setDataValue('statusId', StatusValue.titleId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Account title',
                colId: 'accountTitle',
                field: 'accountTitle',
                editable: true,
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRenderer: this.requiredCell,
                pinnedRowCellRenderer: this.notRequiredCell,
            },
            {
                headerName: 'Address 1',
                colId: 'address1',
                field: 'address1',
                editable: true,
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
            },
            {
                headerName: 'Address 2',
                colId: 'address2',
                field: 'address2',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                editable: true,
            },
            {
                headerName: 'Main',
                colId: 'main',
                field: 'main',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },
            },
            {
                headerName: 'City',
                colId: 'city',
                field: 'city',
                editable: true,
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
            },
            {
                headerName: 'Country Code',
                field: 'country',
                colId: 'country',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCountry,
                    valueProperty: 'countryCode',
                    codeProperty: 'countryCode',
                    displayProperty: 'description',
                    isRequired: function (params) {
                        return true;
                    },
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCountry,
                    valueProperty: 'countryCode',
                    codeProperty: 'countryCode',
                    displayProperty: 'description',
                },
                onCellValueChanged: function (params) {
                    if (params.data.country && _this.masterdata.countries) {
                        var counterpartyCountryCode = _this.masterdata.countries.find(function (counterpartyCountryCode) { return counterpartyCountryCode.countryCode === params.data.country; });
                        if (counterpartyCountryCode) {
                            params.node.setDataValue('country', counterpartyCountryCode.countryCode);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Zip code',
                colId: 'zipCode',
                field: 'zipCode',
                editable: true,
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
            },
            {
                headerName: 'Main Email Address',
                colId: 'mailEmailAddress',
                field: 'mailEmailAddress',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },
            },
            {
                headerName: 'LDC Region',
                colId: 'ldcRegion',
                field: 'ldcRegion',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredLdcRegion,
                    valueProperty: 'ldcRegionId',
                    codeProperty: 'ldcRegionId',
                    displayProperty: 'description',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredLdcRegion,
                    valueProperty: 'ldcRegionId',
                    codeProperty: 'ldcRegionId',
                    displayProperty: 'description',
                },
                onCellValueChanged: function (params) {
                    if (params.data.ldcRegion && _this.masterdata.regions) {
                        var ldcRegion = _this.masterdata.regions.find(function (e) { return e.ldcRegionId === params.data.ldcRegion; });
                        if (ldcRegion) {
                            params.node.setDataValue('ldcRegion', ldcRegion.ldcRegionId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Provinces',
                field: 'province',
                colId: 'province',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredProvince,
                    valueProperty: 'provinceId',
                    codeProperty: 'provinceId',
                    displayProperty: 'description',
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredProvince,
                    valueProperty: 'provinceId',
                    codeProperty: 'provinceId',
                    displayProperty: 'description',
                },
                onCellValueChanged: function (params) {
                    if (params.data.province && _this.filteredProvince) {
                        var provinceValue = _this.filteredProvince.find(function (province) { return province.provinceId === params.data.province; });
                        if (provinceValue) {
                            params.node.setDataValue('province', provinceValue.description);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Address Type',
                field: 'addressType',
                colId: 'addressType',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredAddressType,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredAddressType,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                },
                onCellValueChanged: function (params) {
                    if (params.data.addressType && _this.filteredAddressType) {
                        var counterpartyAddressType = _this.masterdata.addressTypes.find(function (counterpartyAddressType) { return counterpartyAddressType.enumEntityId === params.data.addressType; });
                        if (counterpartyAddressType) {
                            params.node.setDataValue('addressType', counterpartyAddressType.enumEntityValue);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Head of Family',
                colId: 'headOfFamily',
                field: 'headOfFamily',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_3__["AgGridContextualSearchComponent"],
                cellRendererParams: function (params) {
                    if (Number(params.value)) {
                        var value = _this.masterdata.counterparties.find(function (headoffamilyvalue) {
                            return headoffamilyvalue.counterpartyID === Number(params.value);
                        });
                        params.setValue(value ? value.counterpartyCode : null);
                        params.data.rowStatus = 'N';
                        _this.flagOnChangeValue = true;
                    }
                    return {
                        context: {
                            componentParent: _this,
                            gridEditable: true,
                        },
                        gridId: 'counterpartiesGrid',
                        options: _this.filteredCounterpartyList,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !_this.isSummaryView,
                    };
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_3__["AgGridContextualSearchComponent"],
                pinnedRowCellRendererParams: function (params) {
                    return {
                        context: {
                            componentParent: _this,
                            gridEditable: true,
                        },
                        gridId: 'counterpartiesGrid',
                        options: _this.filteredCounterpartyList,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !_this.isSummaryView,
                    };
                },
                onCellValueChanged: function (params) {
                    if (!_this.flagOnChangeValue) {
                        params.node.setDataValue('rowStatus', 'A');
                    }
                },
            },
            {
                headerName: 'Associated Companies',
                field: 'companyId',
                colId: 'companyId',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCompanies,
                    valueProperty: 'companyId',
                    codeProperty: 'companyId',
                    displayProperty: 'companyId',
                },
                pinnedRowCellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_2__["AgGridAutocompleteComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCompanies,
                    valueProperty: 'companyId',
                    codeProperty: 'companyId',
                    displayProperty: 'companyId',
                },
                onCellValueChanged: function (params) {
                    if (params.data.associatedCompanies && _this.filteredCompanies) {
                        var associatedCompanies = _this.filteredCompanies.find(function (associatedCompanies) { return associatedCompanies.id === params.data.associatedCompanies; });
                        if (associatedCompanies) {
                            params.node.setDataValue('companyId', associatedCompanies.companyId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'MDM ID',
                colId: 'mdmId',
                field: 'mdmId',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },
            },
            {
                headerName: 'MDM Category Code',
                colId: 'mDMCategoryId',
                field: 'mDMCategoryId',
                cellStyle: function (params) {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },
            },
            {
                headerName: '',
                colId: 'apply',
                field: 'apply',
                editable: false,
                pinned: 'right',
                suppressMenu: true,
                pinnedRowCellRendererFramework: _apply_counterparty_apply_button_component__WEBPACK_IMPORTED_MODULE_7__["CounterpartyApplyButtonComponent"],
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
            },
        ];
        this.pinnedTopRowData = this.getPinnedTopData();
    };
    CounterpartyDetailComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-detail-component',
            template: __webpack_require__(/*! ./counterparty-detail-component.component.html */ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-detail-component.component.scss */ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__["MasterdataService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], CounterpartyDetailComponentComponent);
    return CounterpartyDetailComponentComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.html":
/*!****************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.html ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [class.displayMode]=\"!isEditable\"\r\n     class=\"custom-form\"\r\n     [class.isEmpty]=\"!fieldControl.value\"\r\n     [class.required-field]=\"isRequired()\">\r\n    <mat-form-field *ngIf=\"isAutocompleteActivated\">\r\n        <input matInput\r\n               #field\r\n               [formControl]=\"fieldControl\"\r\n               [matAutocomplete]=\"auto\"\r\n               (blur)=\"onBlur()\">\r\n        <mat-placeholder>\r\n            {{label}}\r\n        </mat-placeholder>\r\n        <mat-icon *ngIf=\"fieldControl.enabled && hasIcon\"\r\n                  class=\"bookmark-icon\"\r\n                  matSuffix>bookmark</mat-icon>\r\n        <mat-autocomplete #auto=\"matAutocomplete\"\r\n                          [displayWith]=\"generateDisplay.bind(this)\"\r\n                          (optionSelected)=\"onOptionSelected($event)\">\r\n            <mat-option *ngFor=\"let item of options\"\r\n                        [value]=\"item\">\r\n                {{ generateSelect(item) }}\r\n            </mat-option>\r\n        </mat-autocomplete>\r\n        <mat-error *ngIf=\"fieldControl.errors && isEditable\">{{ getErrorMessage() }}</mat-error>\r\n        <mat-hint *ngIf=\"!fieldControl.value && isEditable && !isRequired()\">\r\n            {{hint}}\r\n        </mat-hint>\r\n        <mat-hint *ngIf=\"isRequired() && isEditable && !hasWarning\">Required *</mat-hint>\r\n    </mat-form-field>\r\n\r\n    <mat-form-field *ngIf=\"!isAutocompleteActivated\">\r\n        <mat-select [formControl]=\"fieldControl\"\r\n                    (selectionChange)=\"onSelectionChanged($event)\"\r\n                    [multiple]=\"multiselect\"\r\n                    [displayWith]=\"generateSelect.bind(this)\">\r\n            <mat-option *ngFor=\"let object of options\"\r\n                        [value]=\"valueProperty ? object[valueProperty] : object\">\r\n                <span>{{ descriptionProperty ? object[descriptionProperty] : descriptionProperty }}</span>\r\n            </mat-option>\r\n        </mat-select>\r\n        <mat-error *ngIf=\"fieldControl.errors && isEditable\">{{ getErrorMessage() }}</mat-error>\r\n        <mat-placeholder>{{label}}</mat-placeholder>\r\n        <mat-hint *ngIf=\"!fieldControl.value && isEditable && !isRequired()\">\r\n            {{hint}}\r\n        </mat-hint>\r\n        <mat-hint *ngIf=\"isRequired() && isEditable && !hasWarning\">Required *</mat-hint>\r\n    </mat-form-field>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.scss":
/*!****************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.scss ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.ts":
/*!**************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.ts ***!
  \**************************************************************************************************************************************/
/*! exports provided: SelectMultiDropdownComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectMultiDropdownComponent", function() { return SelectMultiDropdownComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_components_form_components_form_component_base_form_component_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../shared/components/form-components/form-component-base/form-component-base.component */ "./Client/app/shared/components/form-components/form-component-base/form-component-base.component.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
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



var SelectMultiDropdownComponent = /** @class */ (function (_super) {
    __extends(SelectMultiDropdownComponent, _super);
    function SelectMultiDropdownComponent(utils) {
        var _this = _super.call(this, utils) || this;
        _this.utils = utils;
        _this.isAutocompleteActivated = true;
        _this.displayCode = false;
        _this.isRequiredField = false;
        _this.multiselect = false;
        _this.onClickRefreshList = false;
        _this.optionSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        return _this;
    }
    SelectMultiDropdownComponent.prototype.agInit = function (params) {
        this.params = params;
        this.options = params.options;
        this.valueProperty = params.valueProperty;
        this.codeProperty = params.codeProperty;
        this.displayProperty = params.displayProperty;
        this.multiselect = params.multiselect,
            this.descriptionProperty = params.descriptionProperty ? params.descriptionProperty : params.displayProperty;
        this.displayCode = params.displayCode ? params.displayCode : false;
    };
    SelectMultiDropdownComponent.prototype.refresh = function (params) {
        return false;
    };
    SelectMultiDropdownComponent.prototype.onOptionSelected = function (selected) {
        this.optionSelected.emit(selected.option.value);
    };
    SelectMultiDropdownComponent.prototype.onSelectionChanged = function (selected) {
        this.optionSelected.emit(selected.value);
        this.fieldControl.setValue(selected.value);
        this.params.data[this.params.colDef.field] = this.fieldControl.value;
    };
    SelectMultiDropdownComponent.prototype.onBlur = function () {
        var _this = this;
        if (typeof this.fieldControl.value === 'string' && this.displayProperty) {
            var selectedValue = this.options
                .find(function (item) { return item[_this.displayProperty] === _this.fieldControl.value; });
            if (selectedValue && selectedValue !== this.fieldControl.value) {
                this.fieldControl.setValue(selectedValue);
                this.optionSelected.emit(selectedValue);
            }
        }
    };
    SelectMultiDropdownComponent.prototype.generateSelect = function (value) {
        var _this = this;
        if (!value) {
            return '';
        }
        var object = this.valueProperty ? this.options.find(function (option) { return option[_this.valueProperty] === value; }) : null;
        value = typeof value !== 'string' && this.displayProperty ? value[this.displayProperty] : value;
        if (object && this.displayCode && this.codeProperty) {
            return object[this.codeProperty];
        }
        return this.displayProperty && object ? object[this.displayProperty] : value;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], SelectMultiDropdownComponent.prototype, "optionSelected", void 0);
    SelectMultiDropdownComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-select-multi-dropdown',
            template: __webpack_require__(/*! ./select-multi-dropdown.component.html */ "./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.html"),
            styles: [__webpack_require__(/*! ./select-multi-dropdown.component.scss */ "./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_services_util_service__WEBPACK_IMPORTED_MODULE_2__["UtilService"]])
    ], SelectMultiDropdownComponent);
    return SelectMultiDropdownComponent;
}(_shared_components_form_components_form_component_base_form_component_base_component__WEBPACK_IMPORTED_MODULE_1__["FormComponentBaseComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <mat-card>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start none\"\r\n             class=\"search\">\r\n            <atlas-masterdata-user-preferences-input fxFlex=\"60%\"\r\n                                                     isEditable=\"true\"\r\n                                                     [fieldControl]=\"accountReferenceCtrl\"\r\n                                                     (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                                                     [options]=\"filteredCounterPartyList\"\r\n                                                     label=\"Counterparty\"\r\n                                                     displayProperty=\"counterpartyCode\"\r\n                                                     [selectProperties]=\"['counterpartyCode', 'description']\"\r\n                                                     lightBoxTitle=\"Results for Counterparty\"\r\n                                                     gridId=\"counterpartiesGrid\"\r\n                                                     (optionSelected)=\"onCounterpartyIdSelected($event)\">\r\n            </atlas-masterdata-user-preferences-input>\r\n\r\n            <atlas-dropdown-select fxFlex='90%'\r\n                                   [label]=\"'Account Type'\"\r\n                                   [fieldControl]=\"counterPartyTypeCtrl\"\r\n                                   (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                                   [errorMap]=\"snapshotErrorMap\"\r\n                                   isEditable=true\r\n                                   [options]=\"filteredAccTypesList\"\r\n                                   displayProperty=\"name\"\r\n                                   [selectProperties]=\"['name']\"\r\n                                   [isAutocompleteActivated]=\"isAutoCompleteActivated\"></atlas-dropdown-select>\r\n\r\n\r\n            <button mat-raised-button\r\n                    (click)=\"onQuickSearchButtonClicked()\"\r\n                    class=\"heroGradient\">\r\n                <mat-icon aria-label=\"Search\"\r\n                          class=\"search-icon\">search</mat-icon>\r\n            </button>\r\n        </div>\r\n    </mat-card>\r\n\r\n    <atlas-filter-set-display (filtersChanged)=\"onFilterSetDetailsChange($event)\"\r\n                              [columnConfiguration]=\"columnConfiguration\"\r\n                              [gridCode]=\"gridCode\"\r\n                              [company]=\"company\">\r\n    </atlas-filter-set-display>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"start none\">\r\n        <mat-card fxFlex=\"100\">\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 *ngIf=\"isLoading\"\r\n                 class=\"loading\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n            <div ag-grid=\"counterpartyContractGridOptions\"\r\n                 class=\"ag-theme-material pointer-cursor\">\r\n                <ag-grid-angular style=\" height:100%;\"\r\n                                 class=\"ag-theme-material\"\r\n                                 [rowData]=\"counterpartyContractGridRows\"\r\n                                 [gridOptions]=\"counterpartyContractGridOptions\"\r\n                                 [columnDefs]=\"columnDefs\"\r\n                                 domLayout=\"autoHeight\"\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 rowSelection=\"multiple\"\r\n                                 [singleClickEdit]=\"true\"\r\n                                 [suppressRowClickSelection]=\"true\"\r\n                                 (rowSelected)=\"onSelectionChanged($event)\"\r\n                                 [pagination]=\"true\"\r\n                                 [paginationPageSize]=\"28\"\r\n                                 [enableSorting]=\"true\"\r\n                                 [enableColResize]=\"true\"\r\n                                 enableFilter\r\n                                 [rowHeight]=32>\r\n                </ag-grid-angular>\r\n            </div>\r\n        </mat-card>\r\n    </div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.scss":
/*!**********************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.scss ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.ts":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.ts ***!
  \********************************************************************************************************************/
/*! exports provided: CounterpartyListComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyListComponentComponent", function() { return CounterpartyListComponentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_list_and_search_list_and_search_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/components/list-and-search/list-and-search.component */ "./Client/app/shared/components/list-and-search/list-and-search.component.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_http_services_referential_counterparties_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../shared/services/http-services/referential-counterparties.service */ "./Client/app/shared/services/http-services/referential-counterparties.service.ts");
/* harmony import */ var _shared_services_list_and_search_counterparty_bulk_edit_data_loader__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../shared/services/list-and-search/counterparty-bulk-edit-data-loader */ "./Client/app/shared/services/list-and-search/counterparty-bulk-edit-data-loader.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
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



















var CounterpartyListComponentComponent = /** @class */ (function (_super) {
    __extends(CounterpartyListComponentComponent, _super);
    function CounterpartyListComponentComponent(formConfigurationProvider, formBuilder, masterdataService, companyManager, utilService, gridConfigurationProvider, route, router, uiService, referentialCounterpartiesService, dataLoader) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.formBuilder = formBuilder;
        _this.masterdataService = masterdataService;
        _this.companyManager = companyManager;
        _this.utilService = utilService;
        _this.gridConfigurationProvider = gridConfigurationProvider;
        _this.route = route;
        _this.router = router;
        _this.uiService = uiService;
        _this.referentialCounterpartiesService = referentialCounterpartiesService;
        _this.dataLoader = dataLoader;
        _this.gridCode = 'bulkEditGrid';
        _this.counterpartyContractGridOptions = {};
        _this.accountReferenceCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.counterPartyTypeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.additionalFilters = [];
        _this.columnConfiguration = [];
        _this.snapshotErrorMap = new Map();
        _this.hasGridSharing = false;
        _this.filters = [];
        _this.counterpartyTradeStatusList = [];
        _this.filteredLdcRegion = [];
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_9__["MasterDataProps"].Counterparties
        ];
        _this.isAutoCompleteActivated = true;
        _this.contractsSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        return _this;
    }
    CounterpartyListComponentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filterCounterparties();
        this.allAccTypesList = this.masterData.accountTypes;
        this.filteredAccTypesList = this.masterData.accountTypes;
        this.counterpartyTradeStatusList = this.masterData.tradeStatus;
        this.filteredLdcRegion = this.masterData.regions;
        this.counterPartyTypeCtrl.valueChanges.subscribe(function (input) {
            _this.filteredAccTypesList = _this.utilService.filterListforAutocomplete(input, _this.allAccTypesList, ['name']);
        });
        this.loadGridConfiguration();
    };
    CounterpartyListComponentComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe(function (configuration) {
            _this.columnConfiguration = configuration.columns;
            _this.initColumns(_this.columnConfiguration);
            _this.getContractsToCounterparty();
            _this.hasGridSharing = configuration.hasMultipleViewsPerUser;
        });
    };
    CounterpartyListComponentComponent.prototype.onFilterSetDetailsChange = function (filters) {
        this.filters = filters;
        this.getContractsToCounterparty();
    };
    CounterpartyListComponentComponent.prototype.getContractsToCounterparty = function () {
        var _this = this;
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        }
        else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            var filters = this.filters.map(function (x) { return (__assign({}, x)); });
            this.isLoading = true;
            if (this.accountReferenceCtrl.value && typeof this.accountReferenceCtrl.value === 'object') {
                this.accountReferenceCtrl.patchValue(this.accountReferenceCtrl.value);
            }
            if (this.counterPartyTypeCtrl.value && typeof this.counterPartyTypeCtrl.value === 'object') {
                this.counterPartyTypeCtrl.patchValue(this.counterPartyTypeCtrl.value);
            }
            var accountRefField = this.columnConfiguration
                .find(function (column) { return column.fieldName === 'AccountReference'; });
            var accountRefTypeField = this.columnConfiguration
                .find(function (column) { return column.fieldName === 'CounterpartyType'; });
            if (this.accountReferenceCtrl.value) {
                var filterAccountsRef = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_8__["ListAndSearchFilter"]();
                var filterAccountRef = void 0;
                if (accountRefField) {
                    filterAccountRef = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_8__["ListAndSearchFilter"]();
                    filterAccountRef.fieldId = accountRefField.fieldId;
                    filterAccountRef.fieldName = accountRefField.fieldName;
                    filterAccountRef.predicate = {
                        filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                        operator: 'eq',
                        value1: this.accountReferenceCtrl.value.counterpartyCode + '%',
                    };
                    filterAccountRef.isActive = true;
                    filterAccountsRef.logicalOperator = 'or';
                    filterAccountsRef.clauses = [filterAccountRef];
                    this.filters.push(filterAccountsRef);
                }
            }
            if (this.counterPartyTypeCtrl.value && accountRefTypeField) {
                var filterContractNo = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_8__["ListAndSearchFilter"]();
                filterContractNo.fieldId = accountRefTypeField.fieldId;
                filterContractNo.fieldName = accountRefTypeField.fieldName;
                filterContractNo.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_10__["ListAndSearchFilterType"].Text,
                    operator: 'eq',
                    value1: this.counterPartyTypeCtrl.value.name + '%',
                };
                filterContractNo.isActive = true;
                this.filters.push(filterContractNo);
            }
            this.dataLoader.getData(this.filters, null, null)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
                _this.isLoading = false;
            }))
                .subscribe(function (data) {
                if (data) {
                    _this.contractsCounterpartyToedit = data.value;
                    _this.counterpartyContractGridRows = _this.contractsCounterpartyToedit;
                }
            });
        }
        this.gridApi.sizeColumnsToFit();
        setTimeout(function () {
            _this.gridColumnApi.autoSizeAllColumns();
        });
    };
    CounterpartyListComponentComponent.prototype.changeTradeStatusId = function (params) {
        var tradeStatus = this.counterpartyTradeStatusList.find(function (tradeStatus) { return tradeStatus.enumEntityId === Number(params.value); });
        return tradeStatus ? tradeStatus.enumEntityValue : '';
    };
    CounterpartyListComponentComponent.prototype.changeLDCRegion = function (params) {
        var LDCRegion = this.filteredLdcRegion.find(function (LDCRegion) { return LDCRegion.ldcRegionId === Number(params.value); });
        return LDCRegion ? LDCRegion.ldcRegionCode : '';
    };
    CounterpartyListComponentComponent.prototype.initColumns = function (configuration) {
        var _this = this;
        this.columnDefs = [];
        this.columnDefs.push({
            headerName: '',
            colId: 'selection',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 40,
            pinned: 'left',
            hide: false,
        });
        var numericColumns = [];
        configuration.forEach(function (column) {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.columnDefs = this.columnDefs.concat(configuration.map(function (config) {
            var columnDef = {
                colId: _this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: _this.utilService.convertToCamelCase(config.fieldName),
                hide: !config.isVisible,
            };
            if (config.fieldName === 'TradeStatusId') {
                columnDef.valueFormatter = _this.changeTradeStatusId.bind(_this);
            }
            if (config.fieldName === 'LdcRegion') {
                columnDef.valueFormatter = _this.changeLDCRegion.bind(_this);
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
            return columnDef;
        }));
        if (this.counterpartyContractGridOptions) {
            this.counterpartyContractGridOptions.columnDefs = this.columnDefs;
        }
    };
    CounterpartyListComponentComponent.prototype.onGridReady = function (params) {
        params.columnDefs = this.counterpartyContractGridColumns;
        this.counterpartyContractGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridColumnApi.autoSizeAllColumns();
    };
    CounterpartyListComponentComponent.prototype.autoSizeContractsGrid = function () {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    };
    CounterpartyListComponentComponent.prototype.onGridSizeChanged = function (params) {
        this.autoSizeContractsGrid();
        this.gridColumnApi.autoSizeAllColumns();
    };
    CounterpartyListComponentComponent.prototype.onSelectionChanged = function (event) {
        var selectedRows = this.gridApi.getSelectedRows();
        this.selectedcontractsCounterpartyToedit = selectedRows;
        if (selectedRows) {
            this.contractsSelected.emit(true);
        }
    };
    CounterpartyListComponentComponent.prototype.filterCounterparties = function () {
        var _this = this;
        this.searchedCounterpartyCode = this.counterpartyValue;
        var counterpartyList = [];
        this.filteredCounterPartyList = this.masterData.counterparties;
        counterpartyList = this.filteredCounterPartyList;
        this.accountReferenceCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCounterPartyList = _this.utilService.filterListforAutocomplete(input, counterpartyList, ['counterpartyCode', 'description']);
            if (_this.accountReferenceCtrl.valid) {
            }
        });
    };
    CounterpartyListComponentComponent.prototype.onCounterpartyIdSelected = function (value) {
        this.counterpartyValue = this.accountReferenceCtrl.value;
    };
    CounterpartyListComponentComponent.prototype.onQuickSearchButtonClicked = function () {
        this.getContractsToCounterparty();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], CounterpartyListComponentComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('listAndSearchComponent'),
        __metadata("design:type", _shared_components_list_and_search_list_and_search_component__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchComponent"])
    ], CounterpartyListComponentComponent.prototype, "listAndSearchComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyListComponentComponent.prototype, "contractsSelected", void 0);
    CounterpartyListComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-list-component',
            template: __webpack_require__(/*! ./counterparty-list-component.component.html */ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-list-component.component.scss */ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.scss")],
            providers: [_shared_services_list_and_search_counterparty_bulk_edit_data_loader__WEBPACK_IMPORTED_MODULE_15__["ReferentialBulkEditCounterpartiesDataLoader"]],
        }),
        __metadata("design:paramtypes", [_shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_11__["FormConfigurationProviderService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_13__["MasterdataService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_5__["CompanyManagerService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_17__["UtilService"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_12__["GridConfigurationProviderService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_16__["UiService"],
            _shared_services_http_services_referential_counterparties_service__WEBPACK_IMPORTED_MODULE_14__["ReferentialCounterpartiesService"],
            _shared_services_list_and_search_counterparty_bulk_edit_data_loader__WEBPACK_IMPORTED_MODULE_15__["ReferentialBulkEditCounterpartiesDataLoader"]])
    ], CounterpartyListComponentComponent);
    return CounterpartyListComponentComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_6__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.html":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.html ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n\r\n    <h2></h2>\r\n\r\n    <mat-horizontal-stepper [linear]\r\n                            (selectionChange)=\"onChangeStepAction($event)\"\r\n                            #stepper>\r\n        <ng-template matStepperIcon=\"edit\">\r\n            <mat-icon>check</mat-icon>\r\n        </ng-template>\r\n        <mat-step>\r\n            <ng-template matStepLabel>Counterparties</ng-template>\r\n            <atlas-counterparty-list-component #counterpartyListComponent\r\n                                               (contractsSelected)=\"onContractsSelected($event)\">\r\n            </atlas-counterparty-list-component>\r\n            <div fxLayout=\"row \"\r\n                 fxLayoutAlign=\"space-between start\"\r\n                 class=\"button-details\">\r\n                <div fxLayout=\"column \"\r\n                     fxLayoutAlign=\"start \">\r\n                    <button mat-button\r\n                            (click)=\"onCounterpartiesSelectionDiscardButtonClicked()\">\r\n                        CANCEL\r\n                    </button>\r\n                </div>\r\n                <div fxLayout=\"column \"\r\n                     fxLayoutAlign=\"start \">\r\n                    <div fxLayout=\"row \"\r\n                         fxLayoutAlign=\"end start \">\r\n                        <button mat-raised-button\r\n                                (click)=\"onCounterpartiesSelectionNextButtonClicked()\">\r\n                            NEXT\r\n                        </button>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </mat-step>\r\n\r\n        <mat-step>\r\n            <ng-template matStepLabel>Details</ng-template>\r\n            <atlas-counterparty-detail-component #counterpartyDetailComponent></atlas-counterparty-detail-component>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"space-between start\"\r\n                 class=\"button-details\">\r\n                <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"start center\">\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"space-between start\">\r\n                        <button mat-button\r\n                                (click)=\"onCounterpartiesSelectionDiscardButtonClicked()\">\r\n                            CANCEL\r\n                        </button>\r\n                        <button mat-raised-button\r\n                                (click)=\"onDetailsPreviousButtonClicked()\">\r\n                            Previous\r\n                        </button>\r\n\r\n                    </div>\r\n                </div>\r\n                <div fxLayout=\"column \"\r\n                     fxLayoutAlign=\"end center\">\r\n                    <div fxLayout=\"row \"\r\n                         fxLayoutAlign=\"end start\">\r\n                        <button mat-raised-button\r\n                                (click)=\"onDetailSaveButtonClicked()\">\r\n                            Save\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </mat-step>\r\n        <mat-step>\r\n\r\n            <ng-template matStepLabel>Summary</ng-template>\r\n            <atlas-counterparty-summary-component #counterpartySummaryComponent></atlas-counterparty-summary-component>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"space-between start\"\r\n                 class=\"button-details\">\r\n                <!-- <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"start center\">\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"space-between start\">\r\n                        <button mat-button\r\n                                (click)=\"onDetailsCancelButtonClicked()\">\r\n                            CANCEL\r\n                        </button>\r\n                    </div>\r\n                </div> -->\r\n                <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"end end\">\r\n                    <div fxLayout=\"row\"\r\n                         fxLayoutAlign=\"end end\">\r\n                        <button mat-raised-button\r\n                                (click)=\"onSummaryOkButtonClicked()\">\r\n                            FINISH\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </mat-step>\r\n    </mat-horizontal-stepper>\r\n</div>\r\n<!-- <atlas-lock-interval [resourcesInformation]=\"resourcesInformation\">\r\n</atlas-lock-interval> -->"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.scss":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.scss ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.ts":
/*!************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.ts ***!
  \************************************************************************************************************************/
/*! exports provided: ReferentialBulkAmendmentComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialBulkAmendmentComponentComponent", function() { return ReferentialBulkAmendmentComponentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _detail_counterparty_detail_component_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./detail/counterparty-detail-component.component */ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.ts");
/* harmony import */ var _list_counterparty_list_component_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./list/counterparty-list-component.component */ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.ts");
/* harmony import */ var _summary_counterparty_summary_component_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./summary/counterparty-summary-component.component */ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ReferentialBulkAmendmentComponentComponent = /** @class */ (function () {
    function ReferentialBulkAmendmentComponentComponent(dialog, router, route, snackbarService, masterDataService) {
        this.dialog = dialog;
        this.router = router;
        this.route = route;
        this.snackbarService = snackbarService;
        this.masterDataService = masterDataService;
        this.isValid = false;
        this.subscriptions = [];
        this.requiredString = 'Required*';
        this.isGridValid = true;
        this.company = this.route.snapshot.paramMap.get("company");
    }
    ReferentialBulkAmendmentComponentComponent.prototype.ngOnInit = function () {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCountry = this.masterdata.countries;
        this.filteredprovinces = this.masterdata.provinces;
        this.filteredaddressTypes = this.masterdata.addressTypes;
    };
    ReferentialBulkAmendmentComponentComponent.prototype.contractsSelected = function () {
        var contracts = this.counterpartyListComponent.selectedcontractsCounterpartyToedit;
        if (contracts) {
            this.counterpartyDetailComponent.contractToBeSelected(contracts);
            this.counterpartySummaryComponent.summaryContractToBeSelected(contracts);
        }
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onContractsSelected = function (contractsSelected) {
        this.isValid = contractsSelected;
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onCancelWarning = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_2__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.router.navigate([_this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
            }
        });
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onChangeStepAction = function (event) {
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onCounterpartiesSelectionDiscardButtonClicked = function () {
        this.onCancelWarning();
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onCounterpartiesSelectionNextButtonClicked = function () {
        if (this.isValid) {
            this.contractsSelected();
            this.stepper.next();
        }
        if (!this.isValid) {
            this.snackbarService.throwErrorSnackBar('Please select a contract to proceed.');
        }
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onDetailsPreviousButtonClicked = function () {
        this.stepper.previous();
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onDetailSaveButtonClicked = function () {
        var _this = this;
        this.isGridValid = true;
        var counterpartyLines = this.counterpartyDetailComponent.editCounterpartyDocumentLines;
        this.gridData = counterpartyLines;
        this.validateGridData();
        if (this.isGridValid) {
            var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_2__["ConfirmationDialogComponent"], {
                data: {
                    title: 'Save Changes',
                    text: 'Do you want to save all the edited details?',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDiscardDialog.afterClosed().subscribe(function (answer) {
                if (answer) {
                    var counterpartyLines_1 = _this.counterpartyDetailComponent.editCounterpartyDocumentLines;
                    _this.bulkCounterparty = {};
                    _this.bulkCounterparty.counterpartyList = [];
                    counterpartyLines_1.forEach(function (cp) {
                        _this.counterparty = {};
                        _this.counterparty.counterpartyAddresses = [];
                        _this.counterparty.counterpartyCompanies = [];
                        _this.counterparty.counterpartyID = cp.counterpartyID;
                        _this.counterparty.counterpartyTradeStatusId = cp.tradeStatusId;
                        _this.counterparty.counterpartyCode = cp.accountReference;
                        _this.counterparty.accountTitle = cp.accountTitle;
                        if (cp.headOfFamily) {
                            _this.counterparty.headofFamily = _this.masterdata.counterparties.find(function (e) { return e.counterpartyCode === cp.headOfFamily; }).counterpartyID;
                        }
                        _this.masterdata.counterparties;
                        _this.counterparty.isDeactivated = cp.statusId;
                        _this.counterparty.mdmId = cp.mdmId;
                        _this.counterparty.c2CCode = cp.c2CReference;
                        _this.counterparty.createdBy = cp.createdBy;
                        _this.counterparty.createdDateTime = cp.createdOn;
                        var counterpartyAddressobj = {};
                        counterpartyAddressobj.addressId = cp.addressId;
                        counterpartyAddressobj.address1 = cp.address1;
                        counterpartyAddressobj.address2 = cp.address2;
                        counterpartyAddressobj.city = cp.city;
                        if (cp.country) {
                            counterpartyAddressobj.countryID = _this.filteredCountry.find(function (e) { return e.countryCode === cp.country; }).countryId;
                        }
                        counterpartyAddressobj.zipCode = cp.zipCode;
                        counterpartyAddressobj.ldcRegionId = cp.ldcRegion;
                        if (!_this.isEmpty(cp.province)) {
                            counterpartyAddressobj.provinceID = _this.filteredprovinces.find(function (e) { return e.description === cp.province; }).provinceId;
                        }
                        if (!_this.isEmpty(cp.addressType)) {
                            counterpartyAddressobj.addressTypeID = _this.filteredaddressTypes.find(function (e) { return e.enumEntityValue === cp.addressType; }).enumEntityId;
                        }
                        _this.counterparty.counterpartyAddresses.push(counterpartyAddressobj);
                        var counterpartyCompanyObj = {};
                        counterpartyCompanyObj.counterpartyId = cp.counterpartyID;
                        if (cp.companyId) {
                            counterpartyCompanyObj.companyId = _this.masterdata.companies.find(function (e) { return e.companyId === cp.companyId; }).id;
                        }
                        _this.counterparty.counterpartyCompanies.push(counterpartyCompanyObj);
                        _this.bulkCounterparty.counterpartyList.push(_this.counterparty);
                    });
                    _this.bulkCounterparty.isBulkUpdate = true;
                    _this.subscriptions.push(_this.masterDataService
                        .bulkUpdateCounterparty(_this.bulkCounterparty)
                        .subscribe(function (data) {
                        if (data) {
                            _this.snackbarService.informationSnackBar('Counterparty has been updated successfully.');
                            _this.counterpartySummaryComponent.summaryContractToBeSelected(counterpartyLines_1);
                            _this.stepper.next();
                        }
                    }, function (err) {
                        console.error(err);
                        _this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    }));
                }
            });
        }
    };
    ReferentialBulkAmendmentComponentComponent.prototype.validateGridData = function () {
        var _this = this;
        this.gridData.forEach(function (data) {
            if (_this.isRequiredString(data.counterpartyID) || _this.isRequiredString(data.accountReference) || _this.isRequiredString(data.tradeStatusId)
                || data.statusId === false || _this.isRequiredString(data.accountTitle) || _this.isRequiredString(data.country) || !data.ldcRegion
                || _this.isRequiredString(data.addressType)) {
                _this.isGridValid = false;
                _this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors');
            }
        });
    };
    ReferentialBulkAmendmentComponentComponent.prototype.isRequiredString = function (value) {
        return value === null || value === '' || value === this.requiredString;
    };
    ReferentialBulkAmendmentComponentComponent.prototype.isEmpty = function (value) {
        if (value === '' || value === null) {
            return true;
        }
        return false;
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onSummaryCancelButtonClicked = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_2__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.router.navigate([_this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
            }
        });
    };
    ReferentialBulkAmendmentComponentComponent.prototype.onSummaryOkButtonClicked = function () {
        this.router.navigate([this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('stepper'),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatStepper"])
    ], ReferentialBulkAmendmentComponentComponent.prototype, "stepper", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('counterpartyListComponent'),
        __metadata("design:type", _list_counterparty_list_component_component__WEBPACK_IMPORTED_MODULE_5__["CounterpartyListComponentComponent"])
    ], ReferentialBulkAmendmentComponentComponent.prototype, "counterpartyListComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('counterpartyDetailComponent'),
        __metadata("design:type", _detail_counterparty_detail_component_component__WEBPACK_IMPORTED_MODULE_4__["CounterpartyDetailComponentComponent"])
    ], ReferentialBulkAmendmentComponentComponent.prototype, "counterpartyDetailComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('counterpartySummaryComponent'),
        __metadata("design:type", _summary_counterparty_summary_component_component__WEBPACK_IMPORTED_MODULE_6__["CounterpartySummaryComponentComponent"])
    ], ReferentialBulkAmendmentComponentComponent.prototype, "counterpartySummaryComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatMenuTrigger"])
    ], ReferentialBulkAmendmentComponentComponent.prototype, "columnMenuTrigger", void 0);
    ReferentialBulkAmendmentComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-referential-bulk-amendment-component',
            template: __webpack_require__(/*! ./referential-bulk-amendment-component.component.html */ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.html"),
            styles: [__webpack_require__(/*! ./referential-bulk-amendment-component.component.scss */ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_8__["MasterdataService"]])
    ], ReferentialBulkAmendmentComponentComponent);
    return ReferentialBulkAmendmentComponentComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.html":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.html ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\"\r\n     fxLayoutAlign=\"space-around start\">\r\n    <div fxLayout=\"column\"\r\n         fxFlex=\"98.5\">\r\n        <mat-card>\r\n            <mat-card-title class=\"atlas-grid-card-title mat-card-title\">Counterparties to Summary</mat-card-title>\r\n            <mat-card-content>\r\n                <div ag-grid=\"summaryCounterpartiesLineGridOptionsCounterpartiesLineGridOptions\">\r\n                    <ag-grid-angular class=\"ag-theme-material atr-ag-grid\"\r\n                                     [rowData]=\"summaryCounterpartyDocumentLines\"\r\n                                     [columnDefs]=\"columnDefs\"\r\n                                     domLayout=\"autoHeight\"\r\n                                     (gridReady)=\"onGridReady($event)\"\r\n                                     [pagination]=\"true\"\r\n                                     [paginationPageSize]=\"15\"\r\n                                     [enableSorting]=\"true\"\r\n                                     [enableColResize]=\"false\"\r\n                                     [singleClickEdit]=true\r\n                                     (cellValueChanged)=\"onCellValueChanged($event)\"\r\n                                     [enableRangeSelection]=\"true\"\r\n                                     [rowHeight]=32>\r\n                    </ag-grid-angular>\r\n                </div>\r\n            </mat-card-content>\r\n        </mat-card>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.scss":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.scss ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.ts":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.ts ***!
  \**************************************************************************************************************************/
/*! exports provided: CounterpartySummaryComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartySummaryComponentComponent", function() { return CounterpartySummaryComponentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CounterpartySummaryComponentComponent = /** @class */ (function () {
    function CounterpartySummaryComponentComponent(route) {
        this.route = route;
        this.agGridOptions = {};
        this.countryList = new Array();
        this.mainAddress = 'Main Address';
        this.counterpartyTradeStatusList = [];
    }
    CounterpartySummaryComponentComponent.prototype.ngOnInit = function () {
        this.initializeGridColumns();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.counterpartyTradeStatusList = this.masterdata.tradeStatus;
        this.filteredLdcRegion = this.masterdata.regions;
    };
    CounterpartySummaryComponentComponent.prototype.onGridReady = function (params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
    };
    CounterpartySummaryComponentComponent.prototype.summaryContractToBeSelected = function (contracts) {
        this.summaryCounterpartyDocumentLines = contracts;
    };
    CounterpartySummaryComponentComponent.prototype.onCellValueChanged = function (params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.agGridColumnApi.autoSizeAllColumns();
            params.node.setDataValue('rowStatus', 'S');
        }
    };
    CounterpartySummaryComponentComponent.prototype.initializeGridColumns = function () {
        this.columnDefs = [
            {
                headerName: 'Status',
                colId: 'rowStatus',
                field: 'rowStatus',
                editable: false,
                pinned: 'left',
                cellRenderer: function (params) {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">' + params.value +
                            '</mat-chip></mat-chip-list>';
                    }
                    return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">S</mat-chip></mat-chip-list>';
                },
            },
            {
                headerName: 'Account Reference',
                colId: 'accountReference',
                field: 'accountReference',
            },
            {
                headerName: 'Trade Status',
                colId: 'tradeStatusId',
                field: 'tradeStatusId',
                valueFormatter: this.setTradeStatusValueCell.bind(this),
            },
            {
                headerName: 'Status',
                colId: 'statusId',
                field: 'statusId',
                valueFormatter: this.setStatusValueCell.bind(this),
            },
            {
                headerName: 'Account title',
                colId: 'accountTitle',
                field: 'accountTitle',
            },
            {
                headerName: 'Address 1',
                colId: 'address1',
                field: 'address1',
            },
            {
                headerName: 'Address 2',
                colId: 'address2',
                field: 'address2',
            },
            {
                headerName: 'Main',
                colId: 'main',
                field: 'main',
                valueFormatter: this.mainValueFormatter.bind(this),
            },
            {
                headerName: 'City',
                colId: 'city',
                field: 'city',
                editable: true,
            },
            {
                headerName: 'Country Code',
                field: 'country',
                colId: 'country',
            },
            {
                headerName: 'Zip code',
                colId: 'zipCode',
                field: 'zipCode',
                editable: true,
            },
            {
                headerName: 'Main Email Address',
                colId: 'mailEmailAddress',
                field: 'mailEmailAddress',
            },
            {
                headerName: 'LDC Region',
                colId: 'ldcRegion',
                field: 'ldcRegion',
                valueFormatter: this.ldcValueFormatter.bind(this),
            },
            {
                headerName: 'Provinces',
                colId: 'province',
                field: 'province',
            },
            {
                headerName: 'Address Type',
                colId: 'addressType',
                field: 'addressType',
            },
            {
                headerName: 'Head of Family',
                colId: 'headOfFamily',
                field: 'headOfFamily',
            },
            {
                headerName: 'Associated Companies',
                colId: 'companyId',
                field: 'companyId',
            },
            {
                headerName: 'MDM ID',
                colId: 'mdmId',
                field: 'mdmId',
            },
            {
                headerName: 'MDM Category Code',
                colId: 'MDMCategoryId',
                field: 'MDMCategoryId',
            },
        ];
    };
    CounterpartySummaryComponentComponent.prototype.setTradeStatusValueCell = function (params) {
        var tradeStatus = this.counterpartyTradeStatusList.find(function (status) { return status.enumEntityId === params.value; });
        return tradeStatus ? tradeStatus.enumEntityValue : '';
    };
    CounterpartySummaryComponentComponent.prototype.setStatusValueCell = function (params) {
        if (params.value) {
            return true;
        }
        else {
            return false;
        }
    };
    CounterpartySummaryComponentComponent.prototype.mainValueFormatter = function (params) {
        if (params.value) {
            return this.mainAddress;
        }
        return null;
    };
    CounterpartySummaryComponentComponent.prototype.ldcValueFormatter = function (params) {
        var ldcValue = this.filteredLdcRegion.find(function (value) { return value.ldcRegionId === params.value; });
        return ldcValue ? ldcValue.description : '';
    };
    CounterpartySummaryComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-summary-component',
            template: __webpack_require__(/*! ./counterparty-summary-component.component.html */ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-summary-component.component.scss */ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], CounterpartySummaryComponentComponent);
    return CounterpartySummaryComponentComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.html":
/*!*************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.html ***!
  \*************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h2>Counterparty Addresses</h2>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\"\r\n             fxLayoutAlign=\"center end\">\r\n            <mat-nav-list *ngFor=\"let counterpartyAddress of counterpartyAddresses\">\r\n                <div *ngIf=\"!counterpartyAddress.isDeleted\">\r\n                    <div fxLayout=\"column\"\r\n                         fxFlex=\"100%\">\r\n                        <div fxLayout=\"row\"\r\n                             fxLayoutAlign=\"left start\">\r\n                            <mat-list-item style=\"min-width: 450px;\"\r\n                                           (click)='onRowClicked(counterpartyAddress)'>\r\n                                <div fxLayout=\"column\">\r\n                                    <div fxLayout=\"row\">\r\n                                        <b>AddressType Code</b>\r\n                                    </div>\r\n                                    <div fxLayout=\"row\">\r\n                                        {{  counterpartyAddress.addressTypeCode}}\r\n                                    </div>\r\n                                </div>\r\n                                <span class=\"fill-space\"></span>\r\n                                <div fxLayout=\"column\">\r\n                                    <div fxLayout=\"row\">\r\n                                        <b>Address Type Name</b>\r\n                                    </div>\r\n                                    <div fxLayout=\"row\">\r\n                                        {{ counterpartyAddress.addresTypeName }}\r\n                                    </div>\r\n                                </div>\r\n                                <mat-divider class=\"charter-creation-divider\"></mat-divider>\r\n                            </mat-list-item>\r\n                            <mat-list-item (click)=\"onSetAddressFavorite(counterpartyAddress)\">\r\n                                <div fxLayout=\"column\">\r\n                                    <mat-icon [ngClass]=\"counterpartyAddress.main ? 'heart-saved' : 'heart-not-saved'\">\r\n                                        {{ counterpartyAddress.main ? 'favorite' : 'favorite_border' }}\r\n                                    </mat-icon>\r\n                                </div>\r\n                            </mat-list-item>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </mat-nav-list>\r\n            <div class=\"btn-container\"></div>\r\n            <div fxFlex=\"50\"\r\n                 fxAlignLayout=\"start end\">\r\n                <span class=\"fill-space\"></span>\r\n                <button mat-raised-button\r\n                        [disabled]=\"isAddressListDataClicked || isViewMode\"\r\n                        (click)='onNewAddressButtonClicked()'\r\n                        type=\"button\">\r\n                    ADD NEW ADDRESS\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.scss":
/*!*************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.scss ***!
  \*************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.ts":
/*!***********************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.ts ***!
  \***********************************************************************************************************************************************************/
/*! exports provided: CounterpartyAddressCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyAddressCardComponent", function() { return CounterpartyAddressCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CounterpartyAddressCardComponent = /** @class */ (function () {
    function CounterpartyAddressCardComponent(route, snackbarService) {
        this.route = route;
        this.snackbarService = snackbarService;
        this.data = [];
        this.counterpartyAddresses = [];
        this.addNewAddress = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.rowClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isAddressListDataClicked = false;
        this.isDeleteButtonEnabled = false;
        this.isViewMode = false;
    }
    CounterpartyAddressCardComponent.prototype.ngOnInit = function () {
    };
    CounterpartyAddressCardComponent.prototype.onNewAddressButtonClicked = function () {
        this.addNewAddress.emit(true);
    };
    CounterpartyAddressCardComponent.prototype.onRowClicked = function (data) {
        if (data) {
            if (data.main && !this.isViewMode) {
                this.snackbarService.throwErrorSnackBar('Main address can only be edited in Main tab.');
            }
            else {
                this.rowClicked.emit(data);
                this.isAddressListDataClicked = true;
                this.isDeleteButtonEnabled = true;
            }
        }
    };
    CounterpartyAddressCardComponent.prototype.updatingAddressListOnEditing = function (addressToBeUpdated) {
        if (addressToBeUpdated) {
            var index = -1;
            index = this.counterpartyAddresses.findIndex(function (address) { return address.randomId === addressToBeUpdated.randomId; });
            if (index != -1) {
                this.counterpartyAddresses.splice(index, 1, addressToBeUpdated);
            }
            else {
                this.counterpartyAddresses.push(addressToBeUpdated);
            }
        }
        this.isAddressListDataClicked = false;
    };
    CounterpartyAddressCardComponent.prototype.updatingAddressListOnDeletion = function (addressToBeDeleted) {
        if (addressToBeDeleted) {
            var index = -1;
            index = this.counterpartyAddresses.findIndex(function (address) { return address.randomId === addressToBeDeleted.randomId; });
            if (index != -1) {
                addressToBeDeleted.isDeactivated = true;
                addressToBeDeleted.isDeleted = true;
            }
            else {
                return '';
            }
        }
        this.isAddressListDataClicked = false;
    };
    CounterpartyAddressCardComponent.prototype.onSetAddressFavorite = function (addressFavorite) {
        if (addressFavorite && !this.isViewMode) {
            this.counterpartyAddresses.forEach(function (element) {
                if (element.randomId === addressFavorite.randomId) {
                    element.main = !element.main;
                }
                else {
                    element.main = false;
                }
            });
        }
        this.isAddressListDataClicked = false;
    };
    CounterpartyAddressCardComponent.prototype.populateValue = function () {
        var _this = this;
        this.masterdata = this.route.snapshot.data.masterdata;
        if (this.counterpartyAddresses) {
            this.counterpartyAddresses.forEach(function (address) {
                if (address.addressTypeID) {
                    address.addressTypeCode = (_this.masterdata.addressTypes.find(function (addressType) { return addressType.enumEntityId === address.addressTypeID; }).enumEntityValue);
                    address.addresTypeName = address.addressTypeCode;
                }
            });
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyAddressCardComponent.prototype, "addNewAddress", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyAddressCardComponent.prototype, "rowClicked", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('button'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], CounterpartyAddressCardComponent.prototype, "button", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyAddressCardComponent.prototype, "isViewMode", void 0);
    CounterpartyAddressCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-address-card',
            template: __webpack_require__(/*! ./counterparty-address-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-address-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_2__["SnackbarService"]])
    ], CounterpartyAddressCardComponent);
    return CounterpartyAddressCardComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.html":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.html ***!
  \***************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card *ngIf=\"editAddress || newAddressForm\">\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h2>Counterparty Address Information</h2>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <div fxLayout=\"column\"\r\n         fxLayoutAlign=\"end end\">\r\n        <button [disabled]=\"newAddressForm || isDeleteDisabled || isViewMode\"\r\n                mat-raised-button\r\n                fxFlex=\"100%\"\r\n                (click)='onDeleteButtonClicked()'\r\n                type=\"button\">\r\n            DELETE\r\n        </button>\r\n    </div>\r\n    <mat-card-content>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address Type Name\"\r\n                       [formControl]=\"addressTypeNameCtrl\">\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address 1\"\r\n                       [formControl]=\"address1Ctrl\">\r\n                <mat-error *ngIf=\"address1Ctrl.hasError('maxlength')\"> Address\r\n                    1\r\n                    should be at\r\n                    most 60 Characters long </mat-error>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address 2\"\r\n                       [formControl]=\"address2Ctrl\">\r\n                <mat-error *ngIf=\"address2Ctrl.hasError('maxlength')\"> Address\r\n                    2\r\n                    should be at\r\n                    most 60 Characters long </mat-error>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address Type Code\"\r\n                       [matAutocomplete]=\"addressCode\"\r\n                       autocomplete=\"off\"\r\n                       [formControl]=\"addressTypeCodeCtrl\">\r\n\r\n                <mat-autocomplete #addressCode=\"matAutocomplete\"\r\n                                  [panelWidth]=\"panelSize\"\r\n                                  (optionSelected)=\"onSelectionChanged($event)\">\r\n                    <mat-option *ngFor=\"let addressType of filteredAddressType\"\r\n                                [value]=\"addressType.enumEntityValue\">\r\n                        {{addressType.enumEntityId}} | {{addressType.enumEntityValue}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-error *ngIf=\"addressTypeCodeCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n                <mat-hint *ngIf=\"addressTypeCodeCtrl.isRequired\">\r\n                    Required *\r\n                </mat-hint>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"50%\">\r\n                <input matInput\r\n                       placeholder=\"Zip Code\"\r\n                       (keypress)=\"numberValidation($event)\"\r\n                       [formControl]=\"zipCodeCtrl\">\r\n                <mat-error *ngIf=\"zipCodeCtrl.hasError('maxlength')\"> Zip Code\r\n                    should be at\r\n                    most 40 Characters long </mat-error>\r\n            </mat-form-field>\r\n\r\n            <div fxFlex=\"50%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"City\"\r\n                           [formControl]=\"cityCtrl\">\r\n                    <mat-error *ngIf=\"cityCtrl.hasError('maxlength')\">City\r\n                        should be at\r\n                        most 60 Characters long </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"50%\">\r\n                <input matInput\r\n                       placeholder=\"Province\"\r\n                       [matAutocomplete]=\"provinceCode\"\r\n                       [formControl]=\"provinceCtrl\"\r\n                       autocomplete=\"off\">\r\n                <mat-autocomplete #provinceCode=\"matAutocomplete\"\r\n                                  [panelWidth]=\"panelSize\">\r\n                    <mat-option *ngFor=\"let province of filteredProvince\"\r\n                                [value]=\"province.description\">\r\n                        {{province.provinceId}} | {{province.description}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-error *ngIf=\"provinceCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n                <mat-hint *ngIf=\"provinceCtrl.isRequired\">\r\n                    Required *\r\n                </mat-hint>\r\n            </mat-form-field>\r\n\r\n            <div fxFlex=\"50%\"\r\n                 [class.isEmpty]=\"!countryCtrl.value\"\r\n                 [class.required-field]=\"countryCtrl.isRequired\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"Country\"\r\n                           [matAutocomplete]=\"countryCode\"\r\n                           [formControl]=\"countryCtrl\"\r\n                           autocomplete=\"off\">\r\n                    <mat-autocomplete #countryCode=\"matAutocomplete\"\r\n                                      [panelWidth]=\"panelSize\">\r\n                        <mat-option *ngFor=\"let country of filteredCountry\"\r\n                                    [value]=\"country.description\">\r\n                            {{country.countryId}} | {{country.description}}\r\n                        </mat-option>\r\n                    </mat-autocomplete>\r\n                    <mat-error *ngIf=\"countryCtrl.hasError('inDropdownList')\">\r\n                        Value not in list\r\n                    </mat-error>\r\n                    <mat-hint *ngIf=\"countryCtrl.isRequired\">\r\n                        Required *\r\n                    </mat-hint>\r\n                    <mat-error *ngIf=\"countryCtrl.hasError('required')\">\r\n                        This field is required\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n\r\n        <mat-list>\r\n            <mat-divider></mat-divider>\r\n        </mat-list>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"30%\">\r\n                <input matInput\r\n                       placeholder=\"Main Email Address\"\r\n                       [formControl]=\"emailCtrl\">\r\n                <mat-error *ngIf=\"emailCtrl.hasError('email')\">\r\n                    Not a valid email\r\n                </mat-error>\r\n                <mat-error *ngIf=\"emailCtrl.hasError('maxlength')\"> Email\r\n                    should be at\r\n                    most 40 Characters long </mat-error>\r\n            </mat-form-field>\r\n\r\n            <div fxFlex=\"30%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           maxlength=\"10\"\r\n                           (keypress)=\"numberValidation($event)\"\r\n                           placeholder=\"Phone Number\"\r\n                           [formControl]=\"phoneNumberCtrl\">\r\n                </mat-form-field>\r\n            </div>\r\n\r\n            <div fxFlex=\"30%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"Fax Number\"\r\n                           (keypress)=\"numberValidation($event)\"\r\n                           [formControl]=\"faxNumberCtrl\">\r\n                    <mat-error *ngIf=\"faxNumberCtrl.hasError('maxlength')\">Fax Number\r\n                        should be at\r\n                        most 40 Characters long </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"LDC Region\"\r\n                       [matAutocomplete]=\"ldcRegionCode\"\r\n                       autocomplete=\"off\"\r\n                       [formControl]=\"ldcRegionCtrl\">\r\n\r\n                <mat-autocomplete #ldcRegionCode=\"matAutocomplete\"\r\n                                  [panelWidth]=\"panelSize\">\r\n                    <mat-option *ngFor=\"let ldcRegion of filteredLdcRegion\"\r\n                                [value]=\"ldcRegion.description\">\r\n                        {{ldcRegion.ldcRegionCode}} | {{ldcRegion.description}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-error *ngIf=\"ldcRegionCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n                <mat-hint *ngIf=\"ldcRegionCtrl.isRequired\">\r\n                    Required *\r\n                </mat-hint>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"end end\"\r\n             fxLayoutGap=\"2%\">\r\n            <button mat-raised-button\r\n                    [disabled]=\"isViewMode\"\r\n                    (click)='onCancelButtonClicked()'\r\n                    type=\"button\">\r\n                CANCEL\r\n            </button>\r\n            <div fxFlex=\"15%\">\r\n                <button mat-raised-button\r\n                        [disabled]=\"isViewMode\"\r\n                        (click)='onSaveButtonClicked()'\r\n                        type=\"button\">\r\n                    SAVE\r\n                </button>\r\n            </div>\r\n        </div>\r\n\r\n    </mat-card-content>\r\n\r\n</mat-card>\r\n\r\n<atlas-empty-state *ngIf=\" !newAddressForm && !editAddress\"\r\n                   title=\"Want to see the detail of an address ?\"\r\n                   [message]=\"displayMessage\"></atlas-empty-state>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.scss":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.scss ***!
  \***************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.ts":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.ts ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: CounterpartyAddressDetailCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyAddressDetailCardComponent", function() { return CounterpartyAddressDetailCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
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












var CounterpartyAddressDetailCardComponent = /** @class */ (function (_super) {
    __extends(CounterpartyAddressDetailCardComponent, _super);
    function CounterpartyAddressDetailCardComponent(formBuilder, formConfigurationProvider, dialog, snackbarService, utilService, masterdataService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.dialog = dialog;
        _this.snackbarService = snackbarService;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.cancelAddress = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.displayMessage = 'Start by selecting one';
        _this.addressTypeNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('addressTypeNameCtrl');
        _this.address1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('address1Ctrl');
        _this.address2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('address2Ctrl');
        _this.zipCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('zipCodeCtrl');
        _this.cityCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('cityCtrl');
        _this.provinceCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('provinceCtrl');
        _this.countryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('countryCtrl');
        _this.emailCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('emailCtrl');
        _this.phoneNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('phoneNumberCtrl');
        _this.faxNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('faxNumberCtrl');
        _this.ldcRegionCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('ldcRegionCtrl');
        _this.addressTypeCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('addressTypeCodeCtrl');
        _this.isCreateOrEdit = false;
        _this.addedNewAddress = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.isNewAddress = true;
        _this.addressDeleted = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.newAddressForm = false;
        _this.editAddress = false;
        _this.isDeactivated = false;
        _this.isDeleteDisabled = false;
        _this.isViewMode = false;
        _this.isDeleted = false;
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_11__["MasterDataProps"].Province,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_11__["MasterDataProps"].Ports,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_11__["MasterDataProps"].ContractTerms,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_11__["MasterDataProps"].AddressTypes,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_11__["MasterDataProps"].LdcRegion,
        ];
        return _this;
    }
    CounterpartyAddressDetailCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.filteredAddressType = _this.masterdata.addressTypes;
            _this.addressTypeCodeCtrl.valueChanges.subscribe(function (input) {
                _this.filteredAddressType = _this.utilService.filterListforAutocomplete(input, _this.masterdata.addressTypes, ['enumEntityId', 'enumEntityValue']);
            });
            _this.filteredProvince = _this.masterdata.provinces;
            _this.provinceCtrl.valueChanges.subscribe(function (input) {
                _this.filteredProvince = _this.utilService.filterListforAutocomplete(input, _this.masterdata.provinces, ['provinceId', 'description']);
            });
            _this.filteredCountry = _this.masterdata.countries;
            _this.countryCtrl.valueChanges.subscribe(function (input) {
                _this.filteredCountry = _this.utilService.filterListforAutocomplete(input, _this.masterdata.countries, ['countryId', 'description']);
            });
            _this.filteredLdcRegion = _this.masterdata.regions;
            _this.ldcRegionCtrl.valueChanges.subscribe(function (input) {
                _this.filteredLdcRegion = _this.utilService.filterListforAutocomplete(input, _this.masterdata.regions, ['ldcRegionId', 'description']);
            });
            _this.setValidators();
        });
        this.addressTypeNameCtrl.disable();
    };
    CounterpartyAddressDetailCardComponent.prototype.initializeValues = function (counterpartyAddresses, deletionFlag) {
        this.addressData = counterpartyAddresses;
        if (counterpartyAddresses.randomId) {
            this.isNewAddress = false;
        }
        this.addressTypeNameCtrl.setValue(counterpartyAddresses.addresTypeName);
        this.address1Ctrl.setValue(counterpartyAddresses.address1);
        this.address2Ctrl.setValue(counterpartyAddresses.address2);
        this.zipCodeCtrl.setValue(counterpartyAddresses.zipCode);
        this.cityCtrl.setValue(counterpartyAddresses.city);
        if (counterpartyAddresses.provinceID) {
            this.provinceCtrl.setValue(this.filteredProvince.find(function (province) { return province.provinceId === counterpartyAddresses.provinceID; }).description);
        }
        if (counterpartyAddresses.countryID) {
            this.countryCtrl.setValue(this.filteredCountry.find(function (country) { return country.countryId === counterpartyAddresses.countryID; }).description);
        }
        this.emailCtrl.setValue(counterpartyAddresses.mail);
        this.phoneNumberCtrl.setValue(counterpartyAddresses.phoneNo);
        this.faxNumberCtrl.setValue(counterpartyAddresses.faxNo);
        if (counterpartyAddresses.addressTypeID) {
            this.addressTypeCodeCtrl.setValue(this.filteredAddressType.find(function (addressType) { return addressType.enumEntityId === counterpartyAddresses.addressTypeID; }).enumEntityValue);
        }
        if (counterpartyAddresses.ldcRegionId) {
            this.ldcRegionCtrl.setValue(this.filteredLdcRegion.find(function (region) { return region.ldcRegionId === counterpartyAddresses.ldcRegionId; }).description);
        }
        if (deletionFlag = true) {
            this.newAddressForm = false;
        }
    };
    CounterpartyAddressDetailCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            addressTypeNameCtrl: this.addressTypeNameCtrl,
            address1Ctrl: this.address1Ctrl,
            address2Ctrl: this.address2Ctrl,
            zipCodeCtrl: this.zipCodeCtrl,
            cityCtrl: this.cityCtrl,
            provinceCtrl: this.provinceCtrl,
            countryCtrl: this.countryCtrl,
            emailCtrl: this.emailCtrl,
            phoneNumberCtrl: this.phoneNumberCtrl,
            faxNumberCtrl: this.faxNumberCtrl,
            ldcRegionCtrl: this.ldcRegionCtrl,
            addressTypeCodeCtrl: this.addressTypeCodeCtrl
        });
        return _super.prototype.getFormGroup.call(this);
    };
    CounterpartyAddressDetailCardComponent.prototype.numberValidation = function (event) {
        var pattern = /[0-9]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    CounterpartyAddressDetailCardComponent.prototype.setValidators = function () {
        this.provinceCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.masterdata.provinces, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_9__["nameof"])('description')),
        ]));
        this.countryCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.masterdata.countries, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_9__["nameof"])('description')),
        ]));
        this.ldcRegionCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.masterdata.regions, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_9__["nameof"])('description')),
        ]));
        this.address1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(60)]));
        this.address2Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(60)]));
        this.cityCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(60)]));
        this.zipCodeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(40)]));
        this.emailCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(40)]));
        this.faxNumberCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(40)]));
        this.addressTypeCodeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.masterdata.addressTypes, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_9__["nameof"])('enumEntityValue')),
        ]));
    };
    CounterpartyAddressDetailCardComponent.prototype.onSelectionChanged = function (event) {
        var addressType = this.masterdata.addressTypes.find(function (addType) { return addType.enumEntityValue === event.option.value; });
        if (addressType) {
            this.addressTypeNameCtrl.patchValue(addressType.enumEntityValue);
        }
        else {
            this.addressTypeNameCtrl.patchValue('');
        }
    };
    CounterpartyAddressDetailCardComponent.prototype.onDeleteButtonClicked = function () {
        var _this = this;
        var confirmDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_5__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of the address ' + this.addressTypeCodeCtrl.value,
                okButton: 'Yes',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.addressDeleted.emit(_this.addressData);
                _this.formGroup.reset();
                _this.newAddressForm = false;
                _this.editAddress = false;
            }
        });
    };
    CounterpartyAddressDetailCardComponent.prototype.onSaveButtonClicked = function () {
        var _this = this;
        if (this.formGroup.valid) {
            var address = {
                isDeactivated: this.isDeactivated,
                counterpartyId: this.counterPartyId,
                addressId: this.addressData ? this.addressData.addressId : null,
                randomId: this.isNewAddress ? this.addressListLength + 1 : this.addressData.randomId,
                addresTypeName: this.addressTypeNameCtrl.value,
                address1: this.address1Ctrl.value,
                address2: this.address2Ctrl.value,
                city: this.cityCtrl.value,
                countryID: this.countryCtrl.value ? this.filteredCountry.find(function (country) { return country.description === _this.countryCtrl.value; }).countryId : '',
                faxNo: this.faxNumberCtrl.value,
                mail: this.emailCtrl.value,
                phoneNo: this.phoneNumberCtrl.value,
                provinceID: this.provinceCtrl.value ? this.filteredProvince.find(function (province) { return province.description === _this.provinceCtrl.value; }).provinceId : '',
                zipCode: this.zipCodeCtrl.value,
                ldcRegionId: this.ldcRegionCtrl.value ? this.filteredLdcRegion.find(function (ldcRegion) { return ldcRegion.description === _this.ldcRegionCtrl.value; }).ldcRegionId : '',
                addressTypeID: this.addressTypeCodeCtrl.value ? this.filteredAddressType.find(function (addressType) { return addressType.enumEntityValue === _this.addressTypeCodeCtrl.value; }).enumEntityId : '',
                addressTypeCode: this.addressTypeCodeCtrl.value,
                isDeleted: this.isDeleted,
                main: false,
            };
            this.addedNewAddress.emit(address);
            this.isNewAddress = true;
            this.newAddressForm = false;
            this.editAddress = false;
            this.formGroup.reset();
        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
            return;
        }
    };
    CounterpartyAddressDetailCardComponent.prototype.onCancelButtonClicked = function () {
        this.formGroup.reset();
        this.newAddressForm = false;
        this.editAddress = false;
        this.cancelAddress.emit();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyAddressDetailCardComponent.prototype, "cancelAddress", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyAddressDetailCardComponent.prototype, "addedNewAddress", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], CounterpartyAddressDetailCardComponent.prototype, "addressListLength", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyAddressDetailCardComponent.prototype, "addressDeleted", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], CounterpartyAddressDetailCardComponent.prototype, "counterPartyId", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyAddressDetailCardComponent.prototype, "isViewMode", void 0);
    CounterpartyAddressDetailCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-address-detail-card',
            template: __webpack_require__(/*! ./counterparty-address-detail-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-address-detail-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialog"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_9__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_10__["MasterdataService"]])
    ], CounterpartyAddressDetailCardComponent);
    return CounterpartyAddressDetailCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.html":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.html ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <main>\r\n        <div fxLayout=\"row\"\r\n             fxLayout.md=\"column\"\r\n             fxLayoutAlign=\"space-around start\"\r\n             class='charter-creation-margin'>\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start left\"\r\n                 fxFlex=\"48\">\r\n                <atlas-counterparty-address-card #addressComponent\r\n                                                 (addNewAddress)=\"addNewAddressCalled($event)\"\r\n                                                 (rowClicked)=\"rowClickedCalled($event)\"\r\n                                                 (cancelAddress)=\"onCancelAddress()\"\r\n                                                 [isViewMode]=\"isViewMode\">\r\n                </atlas-counterparty-address-card>\r\n            </div>\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start right\"\r\n                 fxFlex=\"49\">\r\n                <atlas-counterparty-address-detail-card #addressDetailComponent\r\n                                                        (addedNewAddress)=\"saveNewAddressCalled($event)\"\r\n                                                        (addressDeleted)=\"onAddressDeleted($event)\"\r\n                                                        [addressListLength]=\"addressListLength\"\r\n                                                        (cancelAddress)=\"onCancelAddress()\"\r\n                                                        [counterPartyId]=\"counterPartyId\"\r\n                                                        [isViewMode]=\"isViewMode\">\r\n                </atlas-counterparty-address-detail-card>\r\n            </div>\r\n        </div>\r\n    </main>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.scss":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.scss ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.ts":
/*!**********************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.ts ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureFormAddressTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureFormAddressTabComponent", function() { return CounterpartyCaptureFormAddressTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _address_detail_card_counterparty_address_detail_card_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./address-detail-card/counterparty-address-detail-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.ts");
/* harmony import */ var _address_card_counterparty_address_card_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./address-card/counterparty-address-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
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







var CounterpartyCaptureFormAddressTabComponent = /** @class */ (function (_super) {
    __extends(CounterpartyCaptureFormAddressTabComponent, _super);
    function CounterpartyCaptureFormAddressTabComponent(formBuilder, route, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.route = route;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.formComponents = [];
        _this.isViewMode = false;
        return _this;
    }
    CounterpartyCaptureFormAddressTabComponent.prototype.ngOnInit = function () {
        this.addressListLength = this.addressComponent.counterpartyAddresses.length;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
    };
    CounterpartyCaptureFormAddressTabComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            addressDetailComponent: this.addressDetailComponent.getFormGroup(),
        });
        return _super.prototype.getFormGroup.call(this);
    };
    CounterpartyCaptureFormAddressTabComponent.prototype.addNewAddressCalled = function (params) {
        if (params) {
            this.addressDetailComponent.formGroup.reset();
            this.addressDetailComponent.newAddressForm = true;
            this.addressDetailComponent.addressListLength = this.addressComponent.counterpartyAddresses.length;
        }
    };
    CounterpartyCaptureFormAddressTabComponent.prototype.rowClickedCalled = function (counterpartyAddresses) {
        if (counterpartyAddresses) {
            this.addressDetailComponent.addressListLength = this.addressComponent.counterpartyAddresses.length;
            this.addressDetailComponent.editAddress = true;
            this.addressDetailComponent.initializeValues(counterpartyAddresses, this.addressComponent.isDeleteButtonEnabled);
        }
    };
    CounterpartyCaptureFormAddressTabComponent.prototype.saveNewAddressCalled = function (address) {
        if (address) {
            this.addressComponent.updatingAddressListOnEditing(address);
        }
    };
    CounterpartyCaptureFormAddressTabComponent.prototype.onAddressDeleted = function (deletedAddress) {
        if (deletedAddress) {
            this.addressComponent.updatingAddressListOnDeletion(deletedAddress);
        }
    };
    CounterpartyCaptureFormAddressTabComponent.prototype.onCancelAddress = function () {
        this.addressComponent.isAddressListDataClicked = false;
        this.addressDetailComponent.isNewAddress = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('addressComponent'),
        __metadata("design:type", _address_card_counterparty_address_card_component__WEBPACK_IMPORTED_MODULE_2__["CounterpartyAddressCardComponent"])
    ], CounterpartyCaptureFormAddressTabComponent.prototype, "addressComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('addressDetailComponent'),
        __metadata("design:type", _address_detail_card_counterparty_address_detail_card_component__WEBPACK_IMPORTED_MODULE_1__["CounterpartyAddressDetailCardComponent"])
    ], CounterpartyCaptureFormAddressTabComponent.prototype, "addressDetailComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormAddressTabComponent.prototype, "isViewMode", void 0);
    CounterpartyCaptureFormAddressTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture-form-address-tab',
            template: __webpack_require__(/*! ./counterparty-capture-form-address-tab.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture-form-address-tab.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__["FormConfigurationProviderService"]])
    ], CounterpartyCaptureFormAddressTabComponent);
    return CounterpartyCaptureFormAddressTabComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_3__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.html":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.html ***!
  \**********************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card *ngIf=\"newBankAccountForm || editBankAccount\">\r\n    <div class=\"bankAccountDetails\">\r\n        <mat-card-content>\r\n            <mat-panel-title>\r\n                <label class=\"headerName\">{{bankAccountName}}</label>\r\n            </mat-panel-title>\r\n            <mat-accordion>\r\n                <mat-expansion-panel [expanded]=\"true\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Bank Information\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n                    <form [formGroup]=\"bankAccountFormGroup\">\r\n                        <div fxLayout=\"column\"\r\n                             fxFlex=\"100%\"\r\n                             class=\"bankInformation\">\r\n                            <div>\r\n                                <span class=\"fill-space\"></span>\r\n                                <div fxLayout=\"row\">\r\n                                    <div>\r\n                                        <mat-button-toggle-group class=\"toggle-group\"\r\n                                                                 [disabled]=\"isViewMode\"\r\n                                                                 [formControl]=\"bankAccountStatusCtrl\"\r\n                                                                 aria-label=\"Date\"\r\n                                                                 (change)='bankAccountStatusChanged()'>\r\n                                            <mat-button-toggle [value]=\"1\">Activate</mat-button-toggle>\r\n                                            <mat-button-toggle [value]=\"2\">Deactivate</mat-button-toggle>\r\n                                        </mat-button-toggle-group>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div>\r\n                                <span class=\"fill-space\"></span>\r\n                                <div fxLayout=\"row\">\r\n                                    <div>\r\n                                        <button [disabled]=\"newBankAccountForm || isDeleteDisabled || isViewMode\"\r\n                                                mat-raised-button\r\n                                                (click)='onBankAccountDeleteButtonClick()'\r\n                                                type=\"button\"\r\n                                                class=\"deleteField\">\r\n                                            Delete\r\n                                        </button>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"50%\"\r\n                                                  [fieldControl]=\"bankNameCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"bankNameCtrl.isRequired\"\r\n                                                  [label]=\"'Bank Name'\">\r\n                                    <mat-error *ngIf=\"bankNameCtrl.hasError('maxlength')\"> Bank Account\r\n                                        Bank Name should be at\r\n                                        most 40 Characters long </mat-error>\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Bank Account Description\"\r\n                                              [formControl]='bankAccountDescriptionCtrl'></textarea>\r\n                                    <mat-error *ngIf=\"bankAccountDescriptionCtrl.hasError('maxlength')\"> Bank Account\r\n                                        Description should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <b>Address</b>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 1\"\r\n                                              [formControl]='addressLine1Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"addressLine1Ctrl.hasError('maxlength')\"> Address Line 1 should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 2\"\r\n                                              [formControl]='addressLine2Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"addressLine2Ctrl.hasError('maxlength')\"> Address Line 2 should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 3\"\r\n                                              [formControl]='addressLine3Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"addressLine3Ctrl.hasError('maxlength')\"> Address Line 3 should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 4\"\r\n                                              [formControl]='addressLine4Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"addressLine4Ctrl.hasError('maxlength')\"> Address Line 4 should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"cityCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'City'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <mat-form-field fxFlex=\"30%\">\r\n                                    <input matInput\r\n                                           placeholder=\"Country\"\r\n                                           [matAutocomplete]=\"countryCode\"\r\n                                           [formControl]=\"countryCtrl\"\r\n                                           [required]=\"countryCtrl.isRequired\"\r\n                                           autocomplete=\"off\">\r\n                                    <mat-autocomplete #countryCode=\"matAutocomplete\"\r\n                                                      [panelWidth]=\"panelSize\">\r\n                                        <mat-option *ngFor=\"let country of bankCountry\"\r\n                                                    [value]=\"country.description\">\r\n                                            {{country.countryId}} | {{country.description}}\r\n                                        </mat-option>\r\n                                    </mat-autocomplete>\r\n                                    <mat-error *ngIf=\"countryCtrl.hasError('inDropdownList')\">\r\n                                        Value is not in the List\r\n                                    </mat-error>\r\n                                </mat-form-field>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"zipCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Zip Code'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankSWIFTCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"bankSWIFTCodeCtrl.isRequired\"\r\n                                                  [label]=\"'Bank SWIFT Code'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <mat-form-field fxFlex=\"30%\">\r\n                                    <input matInput\r\n                                           placeholder=\"Currency\"\r\n                                           [matAutocomplete]=\"currencyCode\"\r\n                                           [formControl]=\"accountCcyCtrl\"\r\n                                           [required]=\"accountCcyCtrl.isRequired\"\r\n                                           autocomplete=\"off\">\r\n                                    <mat-autocomplete #currencyCode=\"matAutocomplete\"\r\n                                                      [panelWidth]=\"panelSize\">\r\n                                        <mat-option *ngFor=\"let currency of accountCurrency\"\r\n                                                    [value]=\"currency.description\">\r\n                                            {{currency.currencyCode}} | {{currency.description}}\r\n                                        </mat-option>\r\n                                    </mat-autocomplete>\r\n                                    <mat-error *ngIf=\"accountCcyCtrl.hasError('inDropdownList')\">\r\n                                        Value is not in the List\r\n                                    </mat-error>\r\n                                </mat-form-field>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-dropdown-select fxFlex='30%'\r\n                                                       label=\"Bank Type\"\r\n                                                       [fieldControl]=\"bankTypeCtrl\"\r\n                                                       isEditable=\"true\"\r\n                                                       [required]=\"bankTypeCtrl.isRequired\"\r\n                                                       [options]=\"bankTypeOptions\"\r\n                                                       [displayProperty]=\"bankTypeDisplayProperty\"\r\n                                                       [selectProperties]=\"bankTypeSelectProperties\">\r\n                                </atlas-dropdown-select>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankNoCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"bankNoCtrl.isRequired\"\r\n                                                  [label]=\"'Bank No'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankBranchCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Branch '\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"accountNoCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"accountNoCtrl.isRequired\"\r\n                                                  [label]=\"'Account No'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankNccTypeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank NCC Type'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"nccCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'NCC'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"ncsCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'NCS'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"fedABACtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'FED ABA'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"chipsCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Chips'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankPhoneNumberCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Phone Number'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankTelexNumberCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Telex Number'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankFaxNumberCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Fax Number'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"interfaceCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Interface Code'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </mat-expansion-panel>\r\n                <mat-expansion-panel (opened)=\"panelOpenState = true\"\r\n                                     (closed)=\"panelOpenState = false\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Bank Intermediary Details (1)\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n                    <form [formGroup]=\"bankAccountIntermediary1FormGroup\">\r\n                        <div fxLayout=\"column\"\r\n                             fxFlex=\"100%\"\r\n                             class=\"bankIntermediaryDetails\">\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"right start\">\r\n                                <span class=\"fill-space\"></span>\r\n                                <button mat-button\r\n                                        [disabled]=\"isViewMode\"\r\n                                        type=\"button\"\r\n                                        (click)=\"onBankIntermediary1AccountDeleteButtonClick()\">\r\n                                    DELETE\r\n                                </button>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"50%\"\r\n                                                  [fieldControl]=\"intermediary1BankNameCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary1BankNameCtrl.isRequired\"\r\n                                                  [label]=\"'Intermediary Bank Name'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Bank Account Description\"\r\n                                              [formControl]='bankIntermediary1AccountDescriptionCtrl'></textarea>\r\n                                    <mat-error *ngIf=\"bankIntermediary1AccountDescriptionCtrl.hasError('maxlength')\">\r\n                                        Bank\r\n                                        Account\r\n                                        Description should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <b>Address</b>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 1\"\r\n                                              [formControl]='intermediary1AddressLine1Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary1AddressLine1Ctrl.hasError('maxlength')\"> Address\r\n                                        Line 1\r\n                                        should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 2\"\r\n                                              [formControl]='intermediary1AddressLine2Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary1AddressLine2Ctrl.hasError('maxlength')\"> Address\r\n                                        Line 2\r\n                                        should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 3\"\r\n                                              [formControl]='intermediary1AddressLine3Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary1AddressLine3Ctrl.hasError('maxlength')\"> Address Line\r\n                                        3\r\n                                        should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 4\"\r\n                                              [formControl]='intermediary1AddressLine4Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary1AddressLine4Ctrl.hasError('maxlength')\"> Address Line\r\n                                        4\r\n                                        should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1CityCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'City'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <mat-form-field fxFlex=\"30%\">\r\n                                    <input matInput\r\n                                           placeholder=\"Country\"\r\n                                           [matAutocomplete]=\"intermediary1CountryCode\"\r\n                                           [formControl]=\"intermediary1CountryCtrl\"\r\n                                           [required]=\"intermediary1CountryCtrl.isRequired\"\r\n                                           autocomplete=\"off\">\r\n                                    <mat-autocomplete #intermediary1CountryCode=\"matAutocomplete\"\r\n                                                      [panelWidth]=\"panelSize\">\r\n                                        <mat-option *ngFor=\"let country of bankIntermediary1Country\"\r\n                                                    [value]=\"country.description\">\r\n                                            {{country.countryId}} | {{country.description}}\r\n                                        </mat-option>\r\n                                    </mat-autocomplete>\r\n                                </mat-form-field>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1ZipCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Zip Code'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1BankNoCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary1BankNoCtrl.isRequired\"\r\n                                                  [label]=\"'Bank No'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-dropdown-select fxFlex='30%'\r\n                                                       label=\"Bank Type\"\r\n                                                       [fieldControl]=\"intermediary1BankTypeCtrl\"\r\n                                                       isEditable=\"true\"\r\n                                                       [required]=\"intermediary1BankTypeCtrl.isRequired\"\r\n                                                       [options]=\"bankTypeOptions\"\r\n                                                       [displayProperty]=\"bankTypeDisplayProperty\"\r\n                                                       [selectProperties]=\"bankTypeSelectProperties\">\r\n                                </atlas-dropdown-select>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1AccountNoCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary1AccountNoCtrl.isRequired\"\r\n                                                  [label]=\"'Account No'\">\r\n                                </atlas-form-input>\r\n\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field fxFlex=\"30%\">\r\n                                    <input matInput\r\n                                           placeholder=\"Currency\"\r\n                                           [matAutocomplete]=\"intermediary1currencyCode\"\r\n                                           [formControl]=\"intermediary1AccountCcyCtrl\"\r\n                                           [required]=\"intermediary1AccountCcyCtrl.isRequired\"\r\n                                           autocomplete=\"off\">\r\n                                    <mat-autocomplete #intermediary1currencyCode=\"matAutocomplete\"\r\n                                                      [panelWidth]=\"panelSize\">\r\n                                        <mat-option *ngFor=\"let currency of accountIntermediary1Currency\"\r\n                                                    [value]=\"currency.description\">\r\n                                            {{currency.currencyCode}} | {{currency.description}}\r\n                                        </mat-option>\r\n                                    </mat-autocomplete>\r\n                                </mat-form-field>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1BankSWIFTCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary1BankSWIFTCodeCtrl.isRequired\"\r\n                                                  [label]=\"'Bank SWIFT Code'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankName1Ctrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Name'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1BankBranchCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Branch'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1FEDABACtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'FED ABA'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1ChipsCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Chips'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary1BankNccTypeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank NCC Type'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"26%\"\r\n                                                  [fieldControl]=\"intermediary1NCCCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'NCC'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"26%\"\r\n                                                  [fieldControl]=\"intermediary1NCSCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'NCS'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-dropdown-select fxFlex='38%'\r\n                                                       label=\"Bank Intermediary Order\"\r\n                                                       [fieldControl]=\"bankIntermediary1OrderCtrl\"\r\n                                                       isEditable=\"true\"\r\n                                                       [options]=\"bankIntermediary1OrderOptions\"\r\n                                                       [displayProperty]=\"bankIntermediary1OrderDisplayProperty\"\r\n                                                       [selectProperties]=\"bankIntermediary1OrderSelectProperties\">\r\n                                </atlas-dropdown-select>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </mat-expansion-panel>\r\n                <mat-expansion-panel (opened)=\"panelOpenState = true\"\r\n                                     (closed)=\"panelOpenState = false\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Bank Intermediary Details (2)\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n                    <form [formGroup]=\"bankAccountIntermediary2FormGroup\">\r\n                        <div fxLayout=\"column\"\r\n                             fxFlex=\"100%\"\r\n                             class=\"BankIntermediarySecondayDetails\">\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"right start\">\r\n                                <span class=\"fill-space\"></span>\r\n                                <button mat-button\r\n                                        [disabled]=\"isViewMode\"\r\n                                        type=\"button\"\r\n                                        (click)=\"onBankIntermediary2AccountDeleteButtonClick()\">\r\n                                    DELETE\r\n                                </button>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"50%\"\r\n                                                  [fieldControl]=\"intermediary2BankNameCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary2BankNameCtrl.isRequired\"\r\n                                                  [label]=\"'Intermediary Bank Name'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Bank Account Description\"\r\n                                              [formControl]='bankIntermediary2AccountDescriptionCtrl'></textarea>\r\n                                    <mat-error *ngIf=\"bankIntermediary2AccountDescriptionCtrl.hasError('maxlength')\">\r\n                                        Bank\r\n                                        Account\r\n                                        Description should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <b>Address</b>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 1\"\r\n                                              [formControl]='intermediary2AddressLine1Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary2AddressLine1Ctrl.hasError('maxlength')\"> Address\r\n                                        Line 1\r\n                                        should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 2\"\r\n                                              [formControl]='intermediary2AddressLine2Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary2AddressLine2Ctrl.hasError('maxlength')\"> Address\r\n                                        Line 2\r\n                                        should be at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 3\"\r\n                                              [formControl]='intermediary2AddressLine3Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary2AddressLine3Ctrl.hasError('maxlength')\"> Address Line\r\n                                        3\r\n                                        should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field>\r\n                                    <textarea matInput\r\n                                              rows=\"3\"\r\n                                              placeholder=\"Address Line 4\"\r\n                                              [formControl]='intermediary2AddressLine4Ctrl'></textarea>\r\n                                    <mat-error *ngIf=\"intermediary2AddressLine4Ctrl.hasError('maxlength')\"> Address Line\r\n                                        4\r\n                                        should be\r\n                                        at\r\n                                        most 160 Characters long </mat-error>\r\n                                </mat-form-field>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2CityCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'City'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <mat-form-field fxFlex=\"30%\">\r\n                                    <input matInput\r\n                                           placeholder=\"Country\"\r\n                                           [matAutocomplete]=\"intermediary2CountryCode\"\r\n                                           [formControl]=\"intermediary2CountryCtrl\"\r\n                                           [required]=\"intermediary2CountryCtrl.isRequired\"\r\n                                           autocomplete=\"off\">\r\n                                    <mat-autocomplete #intermediary2CountryCode=\"matAutocomplete\"\r\n                                                      [panelWidth]=\"panelSize\">\r\n                                        <mat-option *ngFor=\"let country of bankIntermediary2Country\"\r\n                                                    [value]=\"country.description\">\r\n                                            {{country.countryId}} | {{country.description}}\r\n                                        </mat-option>\r\n                                    </mat-autocomplete>\r\n                                </mat-form-field>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2ZipCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Zip Code'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2BankNoCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary2BankNoCtrl.isRequired\"\r\n                                                  [label]=\"'Bank No'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-dropdown-select fxFlex='30%'\r\n                                                       label=\"Bank Type\"\r\n                                                       [fieldControl]=\"intermediary2BankTypeCtrl\"\r\n                                                       isEditable=\"true\"\r\n                                                       [required]=\"intermediary2BankTypeCtrl.isRequired\"\r\n                                                       [options]=\"bankTypeOptions\"\r\n                                                       [displayProperty]=\"bankTypeDisplayProperty\"\r\n                                                       [selectProperties]=\"bankTypeSelectProperties\">\r\n                                </atlas-dropdown-select>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2AccountNoCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary2AccountNoCtrl.isRequired\"\r\n                                                  [label]=\"'Account No'\">\r\n                                </atlas-form-input>\r\n\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <mat-form-field fxFlex=\"30%\">\r\n                                    <input matInput\r\n                                           placeholder=\"Currency\"\r\n                                           [matAutocomplete]=\"intermediary2currencyCode\"\r\n                                           [formControl]=\"intermediary2AccountCcyCtrl\"\r\n                                           [required]=\"intermediary2AccountCcyCtrl.isRequired\"\r\n                                           autocomplete=\"off\">\r\n                                    <mat-autocomplete #intermediary2currencyCode=\"matAutocomplete\"\r\n                                                      [panelWidth]=\"panelSize\">\r\n                                        <mat-option *ngFor=\"let currency of accountIntermediary2Currency\"\r\n                                                    [value]=\"currency.description\">\r\n                                            {{currency.currencyCode}} | {{currency.description}}\r\n                                        </mat-option>\r\n                                    </mat-autocomplete>\r\n                                </mat-form-field>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2BankSWIFTCodeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [required]=\"intermediary2BankSWIFTCodeCtrl.isRequired\"\r\n                                                  [label]=\"'Bank SWIFT Code'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"bankName1Ctrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Name'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2BankBranchCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank Branch'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2FEDABACtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'FED ABA'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2ChipsCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Chips'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-form-input fxFlex=\"30%\"\r\n                                                  [fieldControl]=\"intermediary2BankNccTypeCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'Bank NCC Type'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"26%\"\r\n                                                  [fieldControl]=\"intermediary2NCCCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'NCC'\">\r\n                                </atlas-form-input>\r\n                                <span class=\"fill-space\"></span>\r\n                                <atlas-form-input fxFlex=\"26%\"\r\n                                                  [fieldControl]=\"intermediary2NCSCtrl\"\r\n                                                  [isEditable]=\"true\"\r\n                                                  [label]=\"'NCS'\">\r\n                                </atlas-form-input>\r\n                            </div>\r\n                            <div fxLayout=\"row\"\r\n                                 fxLayoutAlign=\"left start\"\r\n                                 class=\"margin-top-8\">\r\n                                <atlas-dropdown-select fxFlex='38%'\r\n                                                       label=\"Bank Intermediary Order\"\r\n                                                       [fieldControl]=\"bankIntermediary2OrderCtrl\"\r\n                                                       isEditable=\"true\"\r\n                                                       [options]=\"bankIntermediary2OrderOptions\"\r\n                                                       [displayProperty]=\"bankIntermediary2OrderDisplayProperty\"\r\n                                                       [selectProperties]=\"bankIntermediary2OrderSelectProperties\">\r\n                                </atlas-dropdown-select>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </mat-expansion-panel>\r\n            </mat-accordion>\r\n            <div fxLayout=\"row\">\r\n                <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"start start\">\r\n                    <button mat-raised-button\r\n                            [disabled]=\"isViewMode\"\r\n                            type=\"button\"\r\n                            (click)=\"onBankAccountCancelButtonClick()\">\r\n                        CANCEL\r\n                    </button>\r\n                </div>\r\n                <span class=\"fill-space\"></span>\r\n                <div fxLayout=\"column\"\r\n                     fxLayoutAlign=\"end start\">\r\n                    <button mat-raised-button\r\n                            [disabled]=\"isViewMode\"\r\n                            type=\"button\"\r\n                            (click)=\"onBankAccountSaveButtonClick()\">\r\n                        SAVE\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </mat-card-content>\r\n    </div>\r\n</mat-card>\r\n<atlas-empty-state *ngIf=\"!newBankAccountForm && !editBankAccount\"\r\n                   title=\"Want to see the Detail of a Bank Account\"\r\n                   [message]=\"bankAccountEmptyMessage\"></atlas-empty-state>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.scss":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.scss ***!
  \**********************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".margin-top-8 {\n  margin-top: 8px; }\n\n.deleteField {\n  margin: 8px 0 12px 0px;\n  height: 29px;\n  border-radius: 0px;\n  width: 83px; }\n\ndiv.bankAccountDetails {\n  overflow: scroll;\n  height: 300px;\n  width: 570px; }\n\n.headerName {\n  font-weight: bolder; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.ts":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.ts ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: CounterpartyBankAccountDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyBankAccountDetailsComponent", function() { return CounterpartyBankAccountDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
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











var CounterpartyBankAccountDetailsComponent = /** @class */ (function (_super) {
    __extends(CounterpartyBankAccountDetailsComponent, _super);
    function CounterpartyBankAccountDetailsComponent(formBuilder, formConfigurationProvider, snackbarService, dialog, utilService, masterdataService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.snackbarService = snackbarService;
        _this.dialog = dialog;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.setBankAccountData = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.deleteBankAccountData = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.cancelBankAccountData = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.panelOpenState = false;
        _this.isNewBankAccount = true;
        _this.newBankAccountForm = false;
        _this.editBankAccount = false;
        _this.bankAccountEmptyMessage = "Start by Selecting One";
        _this.bankStatus = 1;
        _this.bankAccountStatusCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankAccountStatus');
        _this.bankNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankName');
        _this.bankAccountDescriptionCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankAccountDescription');
        _this.addressLine1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('addressLine1');
        _this.addressLine2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('addressLine2');
        _this.addressLine3Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('addressLine3');
        _this.addressLine4Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('addressLine4');
        _this.zipCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('zipCode');
        _this.cityCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('city');
        _this.countryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('country');
        _this.bankSWIFTCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankSWIFTCode');
        _this.accountCcyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('accountCcy');
        _this.bankTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankType');
        _this.bankNoCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankNo');
        _this.bankBranchCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankBranch');
        _this.accountNoCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('accountNo');
        _this.bankNccTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankNccType');
        _this.nccCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('ncc');
        _this.ncsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('ncs');
        _this.fedABACtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('fedABA');
        _this.chipsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('chips');
        _this.bankPhoneNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankPhoneNumber');
        _this.bankFaxNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankFaxNumber');
        _this.bankTelexNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankTelexNumber');
        _this.interfaceCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('interfaceCode');
        _this.bankIntermediary1AccountDescriptionCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankIntermediary1AccountDescription');
        _this.intermediary1BankNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1BankName');
        _this.intermediary1AddressLine1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1AddressLine1');
        _this.intermediary1AddressLine2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1AddressLine2');
        _this.intermediary1AddressLine3Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1AddressLine3');
        _this.intermediary1AddressLine4Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1AddressLine4');
        _this.intermediary1ZipCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1ZipCode');
        _this.intermediary1BankTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1BankType');
        _this.intermediary1BankNoCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1BankNo');
        _this.intermediary1CityCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1City');
        _this.intermediary1CountryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1Country');
        _this.intermediary1AccountNoCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1AccountNo');
        _this.intermediary1AccountCcyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1AccountCcy');
        _this.intermediary1BankSWIFTCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1BankSWIFTCode');
        _this.bankName1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankName1');
        _this.intermediary1BankBranchCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1BankBranch');
        _this.intermediary1FEDABACtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1FEDABA');
        _this.intermediary1ChipsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1Chips');
        _this.intermediary1NCCCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1NCC');
        _this.intermediary1NCSCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1NCS');
        _this.bankIntermediary1OrderCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankIntermediary1Order');
        _this.intermediary1BankNccTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary1BankNccType');
        _this.bankIntermediary2AccountDescriptionCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankIntermediary2AccountDescription');
        _this.intermediary2BankNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2BankName');
        _this.intermediary2AddressLine1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2AddressLine1');
        _this.intermediary2AddressLine2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2AddressLine2');
        _this.intermediary2AddressLine3Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2AddressLine3');
        _this.intermediary2AddressLine4Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2AddressLine4');
        _this.intermediary2ZipCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2ZipCode');
        _this.intermediary2BankTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2BankType');
        _this.intermediary2BankNoCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2BankNo');
        _this.intermediary2CityCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2City');
        _this.intermediary2CountryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2Country');
        _this.intermediary2AccountNoCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2AccountNo');
        _this.intermediary2AccountCcyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2AccountCcy');
        _this.intermediary2BankSWIFTCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2BankSWIFTCode');
        _this.bankName2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankName2');
        _this.intermediary2BankBranchCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2BankBranch');
        _this.intermediary2FEDABACtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2FEDABA');
        _this.intermediary2ChipsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2Chips');
        _this.intermediary2NCCCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2NCC');
        _this.intermediary2NCSCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2NCS');
        _this.bankIntermediary2OrderCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('bankIntermediary2Order');
        _this.intermediary2BankNccTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('intermediary2BankNccType');
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].Countries,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].BankTypes,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].BankNccTypes,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].Currencies,
        ];
        _this.bankTypeDisplayProperty = 'enumEntityValue';
        _this.bankTypeSelectProperties = ['enumEntityValue'];
        _this.bankTypeOptions = _this.bankType;
        _this.bankIntermediary1OrderDisplayProperty = 'bankIntermediaryOrder';
        _this.bankIntermediary1OrderSelectProperties = ['bankIntermediaryOrder'];
        _this.bankIntermediary1OrderOptions = new Array({ bankIntermediaryOrder: '1' }, { bankIntermediaryOrder: '2' });
        _this.bankIntermediary2OrderDisplayProperty = 'bankIntermediaryOrder';
        _this.bankIntermediary2OrderSelectProperties = ['bankIntermediaryOrder'];
        _this.bankIntermediary2OrderOptions = new Array({ bankIntermediaryOrder: '1' }, { bankIntermediaryOrder: '2' });
        _this.isDeleteDisabled = false;
        _this.isViewMode = false;
        return _this;
    }
    CounterpartyBankAccountDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initializeForm();
        if (this.isViewMode) {
            this.bankAccountFormGroup.disable();
            this.bankAccountIntermediary1FormGroup.disable();
            this.bankAccountIntermediary2FormGroup.disable();
        }
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.bankTypeOptions = _this.masterdata.bankTypes;
            _this.bankIntermediary1Country = _this.masterdata.countries;
            _this.bankCountry = _this.masterdata.countries;
            _this.bankIntermediary1Country = _this.masterdata.countries;
            _this.bankIntermediary2Country = _this.masterdata.countries;
            _this.accountCurrency = _this.masterdata.currencies;
            _this.accountIntermediary1Currency = _this.masterdata.currencies;
            _this.accountIntermediary2Currency = _this.masterdata.currencies;
            _this.countryCtrl.valueChanges.subscribe(function (input) {
                _this.bankCountry = _this.utilService.filterListforAutocomplete(input, _this.masterdata.countries, ['countryId', 'description']);
            });
            _this.intermediary1CountryCtrl.valueChanges.subscribe(function (input) {
                _this.bankIntermediary1Country = _this.utilService.filterListforAutocomplete(input, _this.masterdata.countries, ['countryId', 'description']);
            });
            _this.intermediary2CountryCtrl.valueChanges.subscribe(function (input) {
                _this.bankIntermediary2Country = _this.utilService.filterListforAutocomplete(input, _this.masterdata.countries, ['countryId', 'description']);
            });
            _this.accountCcyCtrl.valueChanges.subscribe(function (input) {
                _this.accountCurrency = _this.utilService.filterListforAutocomplete(input, _this.masterdata.currencies, ['currencyCode', 'description']);
            });
            _this.intermediary1AccountCcyCtrl.valueChanges.subscribe(function (input) {
                _this.accountIntermediary1Currency = _this.utilService.filterListforAutocomplete(input, _this.masterdata.currencies, ['currencyCode', 'description']);
            });
            _this.intermediary2AccountCcyCtrl.valueChanges.subscribe(function (input) {
                _this.accountIntermediary2Currency = _this.utilService.filterListforAutocomplete(input, _this.masterdata.currencies, ['currencyCode', 'description']);
            });
        });
        this.setValidators();
    };
    CounterpartyBankAccountDetailsComponent.prototype.initializeForm = function () {
        this.bankAccountFormGroup = this.formBuilder.group({
            bankAccountStatusCtrl: this.bankAccountStatusCtrl,
            bankNameCtrl: this.bankNameCtrl,
            bankAccountDescriptionCtrl: this.bankAccountDescriptionCtrl,
            addressLine1Ctrl: this.addressLine1Ctrl,
            addressLine2Ctrl: this.addressLine2Ctrl,
            addressLine3Ctrl: this.addressLine3Ctrl,
            addressLine4Ctrl: this.addressLine4Ctrl,
            zipCodeCtrl: this.zipCodeCtrl,
            cityCtrl: this.cityCtrl,
            countryCtrl: this.countryCtrl,
            bankSWIFTCodeCtrl: this.bankSWIFTCodeCtrl,
            accountCcyCtrl: this.accountCcyCtrl,
            bankTypeCtrl: this.bankTypeCtrl,
            bankNoCtrl: this.bankNoCtrl,
            bankBranchCtrl: this.bankBranchCtrl,
            accountNoCtrl: this.accountNoCtrl,
            nccCtrl: this.nccCtrl,
            ncsCtrl: this.ncsCtrl,
            fedABACtrl: this.fedABACtrl,
            chipsCtrl: this.chipsCtrl,
            bankPhoneNumberCtrl: this.bankPhoneNumberCtrl,
            bankFaxNumberCtrl: this.bankFaxNumberCtrl,
            bankTelexNumberCtrl: this.bankTelexNumberCtrl,
        });
        this.bankAccountIntermediary1FormGroup = this.formBuilder.group({
            bankIntermediary1AccountDescriptionCtrl: this.bankIntermediary1AccountDescriptionCtrl,
            intermediary1BankNameCtrl: this.intermediary1BankNameCtrl,
            intermediary1AddressLine1Ctrl: this.intermediary1AddressLine1Ctrl,
            intermediary1AddressLine2Ctrl: this.intermediary1AddressLine2Ctrl,
            intermediary1AddressLine3Ctrl: this.intermediary1AddressLine3Ctrl,
            intermediary1AddressLine4Ctrl: this.intermediary1AddressLine4Ctrl,
            intermediary1ZipCodeCtrl: this.intermediary1ZipCodeCtrl,
            intermediary1BankTypeCtrl: this.intermediary1BankTypeCtrl,
            intermediary1BankNoCtrl: this.intermediary1BankNoCtrl,
            intermediary1CityCtrl: this.intermediary1CityCtrl,
            intermediary1CountryCtrl: this.intermediary1CountryCtrl,
            intermediary1AccountNoCtrl: this.intermediary1AccountNoCtrl,
            intermediary1AccountCcyCtrl: this.intermediary1AccountCcyCtrl,
            intermediary1BankSWIFTCodeCtrl: this.intermediary1BankSWIFTCodeCtrl,
            bankName1Ctrl: this.bankName1Ctrl,
            intermediary1BankBranchCtrl: this.intermediary1BankBranchCtrl,
            intermediary1FEDABACtrl: this.intermediary1FEDABACtrl,
            intermediary1ChipsCtrl: this.intermediary1ChipsCtrl,
            intermediary1NCCCtrl: this.intermediary1NCCCtrl,
            intermediary1NCSCtrl: this.intermediary1NCSCtrl,
            bankIntermediary1OrderCtrl: this.bankIntermediary1OrderCtrl,
        });
        this.bankAccountIntermediary2FormGroup = this.formBuilder.group({
            bankIntermediary2AccountDescriptionCtrl: this.bankIntermediary2AccountDescriptionCtrl,
            intermediary2BankNameCtrl: this.intermediary2BankNameCtrl,
            intermediary2AddressLine1Ctrl: this.intermediary2AddressLine1Ctrl,
            intermediary2AddressLine2Ctrl: this.intermediary2AddressLine2Ctrl,
            intermediary2AddressLine3Ctrl: this.intermediary2AddressLine3Ctrl,
            intermediary2AddressLine4Ctrl: this.intermediary2AddressLine4Ctrl,
            intermediary2ZipCodeCtrl: this.intermediary2ZipCodeCtrl,
            intermediary2BankTypeCtrl: this.intermediary2BankTypeCtrl,
            intermediary2BankNoCtrl: this.intermediary2BankNoCtrl,
            intermediary2CityCtrl: this.intermediary2CityCtrl,
            intermediary2CountryCtrl: this.intermediary2CountryCtrl,
            intermediary2AccountNoCtrl: this.intermediary2AccountNoCtrl,
            intermediary2AccountCcyCtrl: this.intermediary2AccountCcyCtrl,
            intermediary2BankSWIFTCodeCtrl: this.intermediary2BankSWIFTCodeCtrl,
            bankName2Ctrl: this.bankName2Ctrl,
            intermediary2BankBranchCtrl: this.intermediary2BankBranchCtrl,
            intermediary2FEDABACtrl: this.intermediary2FEDABACtrl,
            intermediary2ChipsCtrl: this.intermediary2ChipsCtrl,
            intermediary2NCCCtrl: this.intermediary2NCCCtrl,
            intermediary2NCSCtrl: this.intermediary2NCSCtrl,
            bankIntermediary2OrderCtrl: this.bankIntermediary2OrderCtrl,
        });
    };
    CounterpartyBankAccountDetailsComponent.prototype.setValidators = function () {
        this.bankNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.bankNoCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.countryCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.bankSWIFTCodeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.accountCcyCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.accountNoCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.bankTypeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.bankNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(40)]));
        this.bankAccountDescriptionCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.addressLine1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.addressLine2Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.intermediary1BankNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(40)]));
        this.bankIntermediary1AccountDescriptionCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.intermediary1AddressLine1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.intermediary1AddressLine2Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.intermediary2BankNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(40)]));
        this.bankIntermediary2AccountDescriptionCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.intermediary2AddressLine1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.intermediary2AddressLine2Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(160)]));
        this.bankAccountFormGroup.updateValueAndValidity();
    };
    CounterpartyBankAccountDetailsComponent.prototype.bankAccountStatusChanged = function () {
        this.bankStatus = this.bankAccountStatusCtrl.value;
    };
    CounterpartyBankAccountDetailsComponent.prototype.saveBankAccount = function () {
        var _this = this;
        var bankAccount = {
            bankAccountId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountId : null,
            randomId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.randomId,
            bankAccountStatusID: this.bankStatus,
            bankName: this.bankNameCtrl.value,
            bankAccountDesc: this.bankAccountDescriptionCtrl.value,
            bankAddressLine1: this.addressLine1Ctrl.value,
            bankAddressLine2: this.addressLine2Ctrl.value,
            bankAddressLine3: this.addressLine3Ctrl.value,
            bankAddressLine4: this.addressLine4Ctrl.value,
            bankZIPCode: this.zipCodeCtrl.value,
            bankCity: this.cityCtrl.value,
            bankCountryKey: this.countryCtrl.value ? this.bankCountry.find(function (country) { return country.description === _this.countryCtrl.value; }).countryId : '',
            bankSwiftCode: this.bankSWIFTCodeCtrl.value,
            accountCCY: this.accountCcyCtrl.value ? this.accountCurrency.find(function (currency) { return currency.description === _this.accountCcyCtrl.value; }).currencyCode : '',
            bankTypeID: this.bankTypeCtrl.value ? this.bankTypeCtrl.value.enumEntityId : '',
            bankKey: this.bankNoCtrl.value,
            bankBranch: this.bankBranchCtrl.value,
            accountNo: this.accountNoCtrl.value,
            ncc: this.nccCtrl.value,
            ncs: this.ncsCtrl.value,
            fedaba: this.fedABACtrl.value,
            chips: this.chipsCtrl.value,
            interfaceCode: this.interfaceCodeCtrl.value,
            bankPhoneNo: this.bankPhoneNumberCtrl.value,
            bankFaxNo: this.bankFaxNumberCtrl.value,
            bankTelexNo: this.bankTelexNumberCtrl.value,
            externalReference: "",
            mdmID: null,
            counterpartyId: this.bankAccountDisplay ? this.bankAccountDisplay.counterpartyId : null,
            bankAccountDefault: false,
            bankAccountIntermediary: false,
            bankNccType: this.bankNccTypeCtrl.value,
            isDeactivated: (this.bankStatus == 1) ? false : true,
            tempBankAccountId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.tempBankAccountId,
        };
        bankAccount.bankAccountIntermediary1 = {
            bankAccountIntermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary1 ? this.bankAccountDisplay.bankAccountIntermediary1.bankAccountIntermediaryId : null : null,
            intermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary1 ? this.bankAccountDisplay.bankAccountIntermediary1.intermediaryId : null : null,
            bankAccountId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary1 ? this.bankAccountDisplay.bankAccountIntermediary1.bankAccountId : null : null,
            parentBankAccountId: bankAccount.bankAccountId,
            bankAccountDesc: this.bankIntermediary1AccountDescriptionCtrl.value,
            bankName: this.intermediary1BankNameCtrl.value,
            bankAddressLine1: this.intermediary1AddressLine1Ctrl.value,
            bankAddressLine2: this.intermediary1AddressLine2Ctrl.value,
            bankAddressLine3: this.intermediary1AddressLine3Ctrl.value,
            bankAddressLine4: this.intermediary1AddressLine4Ctrl.value,
            bankZIPCode: this.intermediary1ZipCodeCtrl.value,
            bankCity: this.intermediary1CityCtrl.value,
            bankCountryKey: this.intermediary1CountryCtrl.value ? this.bankIntermediary1Country.find(function (country) { return country.description === _this.intermediary1CountryCtrl.value; }).countryId : '',
            accountNo: this.intermediary1AccountNoCtrl.value,
            accountCCY: this.intermediary1AccountCcyCtrl.value ? this.accountIntermediary1Currency.find(function (currency) { return currency.description === _this.intermediary1AccountCcyCtrl.value; }).currencyCode : '',
            bankTypeID: this.intermediary1BankTypeCtrl.value ? this.intermediary1BankTypeCtrl.value.enumEntityId : '',
            bankKey: this.intermediary1BankNoCtrl.value,
            bankAccountStatusID: this.bankStatus,
            externalReference: "",
            mdmID: null,
            counterpartyId: bankAccount.counterpartyId,
            bankAccountDefault: false,
            bankAccountIntermediary: false,
            bankSwiftCode: this.intermediary1BankSWIFTCodeCtrl.value,
            bankBranch: this.intermediary1BankBranchCtrl.value,
            fedaba: this.intermediary1FEDABACtrl.value,
            chips: this.intermediary1ChipsCtrl.value,
            ncc: this.intermediary1NCCCtrl.value,
            ncs: this.intermediary1NCSCtrl.value,
            order: this.bankIntermediary1OrderCtrl.value ? this.bankIntermediary1OrderCtrl.value.bankIntermediaryOrder : '',
            bankNccType: this.intermediary1BankNccTypeCtrl.value,
            tempParentBankAccountId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.tempBankAccountId,
        };
        bankAccount.bankAccountIntermediary2 = {
            bankAccountIntermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary2 ? this.bankAccountDisplay.bankAccountIntermediary2.bankAccountIntermediaryId : null : null,
            intermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary2 ? this.bankAccountDisplay.bankAccountIntermediary2.intermediaryId : null : null,
            bankAccountId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary2 ? this.bankAccountDisplay.bankAccountIntermediary2.bankAccountId : null : null,
            parentBankAccountId: bankAccount.bankAccountId,
            bankAccountDesc: this.bankIntermediary2AccountDescriptionCtrl.value,
            bankName: this.intermediary2BankNameCtrl.value,
            bankAddressLine1: this.intermediary2AddressLine1Ctrl.value,
            bankAddressLine2: this.intermediary2AddressLine2Ctrl.value,
            bankAddressLine3: this.intermediary2AddressLine3Ctrl.value,
            bankAddressLine4: this.intermediary2AddressLine4Ctrl.value,
            bankZIPCode: this.intermediary2ZipCodeCtrl.value,
            bankCity: this.intermediary2CityCtrl.value,
            bankCountryKey: this.intermediary2CountryCtrl.value ? this.bankIntermediary2Country.find(function (country) { return country.description === _this.intermediary2CountryCtrl.value; }).countryId : '',
            accountNo: this.intermediary2AccountNoCtrl.value,
            accountCCY: this.intermediary2AccountCcyCtrl.value ? this.accountIntermediary2Currency.find(function (currency) { return currency.description === _this.intermediary2AccountCcyCtrl.value; }).currencyCode : '',
            bankTypeID: this.intermediary2BankTypeCtrl.value ? this.intermediary2BankTypeCtrl.value.enumEntityId : '',
            bankKey: this.intermediary2BankNoCtrl.value,
            bankAccountStatusID: this.bankStatus,
            externalReference: "",
            mdmID: null,
            counterpartyId: bankAccount.counterpartyId,
            bankAccountDefault: false,
            bankAccountIntermediary: false,
            bankSwiftCode: this.intermediary2BankSWIFTCodeCtrl.value,
            bankBranch: this.intermediary2BankBranchCtrl.value,
            fedaba: this.intermediary2FEDABACtrl.value,
            chips: this.intermediary2ChipsCtrl.value,
            ncc: this.intermediary2NCCCtrl.value,
            ncs: this.intermediary2NCSCtrl.value,
            order: this.bankIntermediary2OrderCtrl.value ? this.bankIntermediary2OrderCtrl.value.bankIntermediaryOrder : '',
            bankNccType: this.intermediary2BankNccTypeCtrl.value,
            tempParentBankAccountId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.tempBankAccountId,
        };
        this.setBankAccountData.emit(bankAccount);
    };
    CounterpartyBankAccountDetailsComponent.prototype.unloadNotification = function ($event) {
        var _this = this;
        if (this.bankAccountFormGroup.dirty ||
            this.bankAccountIntermediary1FormGroup.dirty ||
            this.bankAccountIntermediary2FormGroup.dirty) {
            var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationDialogComponent"], {
                data: {
                    title: 'Discard Changes',
                    text: 'Do you want to save the details',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDiscardDialog.afterClosed().subscribe(function (answer) {
                if (answer) {
                    _this.onBankAccountSaveButtonClick();
                }
            });
            $event.returnValue = true;
        }
    };
    CounterpartyBankAccountDetailsComponent.prototype.onBankAccountDeleteButtonClick = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Bank Account ' + this.bankName1Ctrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.deleteBankAccountData.emit(_this.bankAccountDisplay);
                _this.bankAccountFormGroup.reset();
                _this.bankAccountIntermediary1FormGroup.reset();
                _this.bankAccountIntermediary2FormGroup.reset();
                _this.newBankAccountForm = false;
                _this.editBankAccount = false;
            }
        });
    };
    CounterpartyBankAccountDetailsComponent.prototype.onBankIntermediary1AccountDeleteButtonClick = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Bank Account ' + this.intermediary1BankNameCtrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.bankAccountIntermediary1FormGroup.reset();
            }
        });
    };
    CounterpartyBankAccountDetailsComponent.prototype.onBankIntermediary2AccountDeleteButtonClick = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Bank Account ' + this.intermediary2BankNameCtrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.bankAccountIntermediary2FormGroup.reset();
            }
        });
    };
    CounterpartyBankAccountDetailsComponent.prototype.onBankAccountSaveButtonClick = function () {
        if (this.bankAccountFormGroup.valid &&
            this.bankAccountIntermediary1FormGroup.valid &&
            this.bankAccountIntermediary2FormGroup.valid) {
            this.saveBankAccount();
            this.bankAccountFormGroup.reset();
            this.bankAccountIntermediary1FormGroup.reset();
            this.bankAccountIntermediary2FormGroup.reset();
            this.newBankAccountForm = false;
            this.editBankAccount = false;
        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
            return;
        }
    };
    CounterpartyBankAccountDetailsComponent.prototype.onBankAccountCancelButtonClick = function () {
        this.bankAccountFormGroup.reset();
        this.bankAccountIntermediary1FormGroup.reset();
        this.bankAccountIntermediary2FormGroup.reset();
        this.newBankAccountForm = false;
        this.editBankAccount = false;
        this.cancelBankAccountData.emit();
    };
    CounterpartyBankAccountDetailsComponent.prototype.getBankAccountData = function (data, deletionFlag) {
        if (data) {
            this.bankAccountDisplay = data;
            this.bankAccountName = this.bankAccountDisplay.bankName;
            if (data.randomId) {
                this.isNewBankAccount = false;
            }
            if (data.isDeactivated) {
                data.bankAccountStatusID = 2;
            }
            else {
                data.bankAccountStatusID = 1;
            }
            this.bankAccountStatusCtrl.patchValue(data.bankAccountStatusID);
            this.bankStatus = data.bankAccountStatusID;
            this.bankNameCtrl.patchValue(data.bankName);
            this.bankAccountDescriptionCtrl.patchValue(data.bankAccountDesc);
            this.addressLine1Ctrl.patchValue(data.bankAddressLine1);
            this.addressLine2Ctrl.patchValue(data.bankAddressLine2);
            this.addressLine3Ctrl.patchValue(data.bankAddressLine3);
            this.addressLine4Ctrl.patchValue(data.bankAddressLine4);
            this.zipCodeCtrl.patchValue(data.bankZIPCode);
            this.cityCtrl.patchValue(data.bankCity);
            if (data.bankCountryKey) {
                this.countryCtrl.patchValue(this.bankCountry.find(function (country) { return country.countryId === data.bankCountryKey; }).description);
            }
            this.bankSWIFTCodeCtrl.patchValue(data.bankSwiftCode);
            if (data.accountCCY) {
                this.accountCcyCtrl.patchValue(this.accountCurrency.find(function (currency) { return currency.currencyCode === data.accountCCY; }).description);
            }
            this.bankTypeCtrl.patchValue(this.bankTypeOptions.find(function (item) { return item.enumEntityId === data.bankTypeID; }));
            this.bankNoCtrl.patchValue(data.bankKey);
            this.bankBranchCtrl.patchValue(data.bankBranch);
            this.accountNoCtrl.patchValue(data.accountNo);
            this.nccCtrl.patchValue(data.ncc);
            this.ncsCtrl.patchValue(data.ncs);
            this.fedABACtrl.patchValue(data.fedaba);
            this.chipsCtrl.patchValue(data.chips);
            this.interfaceCodeCtrl.patchValue(data.interfaceCode);
            this.bankPhoneNumberCtrl.patchValue(data.bankPhoneNo);
            this.bankFaxNumberCtrl.patchValue(data.bankFaxNo);
            this.bankTelexNumberCtrl.patchValue(data.bankTelexNo);
            this.bankNccTypeCtrl.patchValue(data.bankNccType);
            this.bankIntermediary1AccountDescriptionCtrl.patchValue(data.bankAccountIntermediary1.bankAccountDesc);
            this.intermediary1BankNameCtrl.patchValue(data.bankAccountIntermediary1.bankName);
            this.intermediary1AddressLine1Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine1);
            this.intermediary1AddressLine2Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine2);
            this.intermediary1AddressLine3Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine3);
            this.intermediary1AddressLine4Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine4);
            this.intermediary1ZipCodeCtrl.patchValue(data.bankAccountIntermediary1.bankZIPCode);
            this.intermediary1BankTypeCtrl.patchValue(this.bankTypeOptions.find(function (item) { return item.enumEntityId === data.bankTypeID; }));
            this.intermediary1BankNoCtrl.patchValue(data.bankAccountIntermediary1.bankKey);
            this.intermediary1CityCtrl.patchValue(data.bankAccountIntermediary1.bankCity);
            if (data.bankAccountIntermediary1.bankCountryKey) {
                this.intermediary1CountryCtrl.patchValue(this.bankIntermediary1Country.find(function (country) { return country.countryId === data.bankAccountIntermediary1.bankCountryKey; }).description);
            }
            this.intermediary1AccountNoCtrl.patchValue(data.bankAccountIntermediary1.accountNo);
            if (data.bankAccountIntermediary1.accountCCY) {
                this.intermediary1AccountCcyCtrl.patchValue(this.accountIntermediary1Currency.find(function (currency) { return currency.currencyCode === data.bankAccountIntermediary1.accountCCY; }).description);
            }
            this.intermediary1BankSWIFTCodeCtrl.patchValue(data.bankAccountIntermediary1.bankSwiftCode);
            this.bankName1Ctrl.patchValue(data.bankName);
            this.intermediary1BankBranchCtrl.patchValue(data.bankAccountIntermediary1.bankBranch);
            this.intermediary1FEDABACtrl.patchValue(data.bankAccountIntermediary1.fedaba);
            this.intermediary1ChipsCtrl.patchValue(data.bankAccountIntermediary1.chips);
            this.intermediary1BankNccTypeCtrl.patchValue(data.bankAccountIntermediary1.bankNccType);
            this.intermediary1NCCCtrl.patchValue(data.bankAccountIntermediary1.ncc);
            this.intermediary1NCSCtrl.patchValue(data.bankAccountIntermediary1.ncs);
            this.bankIntermediary1OrderCtrl.patchValue(this.bankIntermediary1OrderOptions[data.bankAccountIntermediary1.order - 1]);
            this.bankIntermediary2AccountDescriptionCtrl.patchValue(data.bankAccountIntermediary2.bankAccountDesc);
            this.intermediary2BankNameCtrl.patchValue(data.bankAccountIntermediary2.bankName);
            this.intermediary2AddressLine1Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine1);
            this.intermediary2AddressLine2Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine2);
            this.intermediary2AddressLine3Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine3);
            this.intermediary2AddressLine4Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine4);
            this.intermediary2ZipCodeCtrl.patchValue(data.bankAccountIntermediary2.bankZIPCode);
            this.intermediary2BankTypeCtrl.patchValue(this.bankTypeOptions.find(function (item) { return item.enumEntityId === data.bankTypeID; }));
            this.intermediary2BankNoCtrl.patchValue(data.bankAccountIntermediary2.bankKey);
            this.intermediary2CityCtrl.patchValue(data.bankAccountIntermediary2.bankCity);
            if (data.bankAccountIntermediary2.bankCountryKey) {
                this.intermediary2CountryCtrl.patchValue(this.bankIntermediary2Country.find(function (country) { return country.countryId === data.bankAccountIntermediary2.bankCountryKey; }).description);
            }
            this.intermediary2AccountNoCtrl.patchValue(data.bankAccountIntermediary2.accountNo);
            if (data.bankAccountIntermediary2.accountCCY) {
                this.intermediary2AccountCcyCtrl.patchValue(this.accountIntermediary2Currency.find(function (currency) { return currency.currencyCode === data.bankAccountIntermediary2.accountCCY; }).description);
            }
            this.intermediary2BankSWIFTCodeCtrl.patchValue(data.bankAccountIntermediary2.bankSwiftCode);
            this.bankName1Ctrl.patchValue(data.bankName);
            this.intermediary2BankBranchCtrl.patchValue(data.bankAccountIntermediary2.bankBranch);
            this.intermediary2FEDABACtrl.patchValue(data.bankAccountIntermediary2.fedaba);
            this.intermediary2ChipsCtrl.patchValue(data.bankAccountIntermediary2.chips);
            this.intermediary2BankNccTypeCtrl.patchValue(data.bankAccountIntermediary2.bankNccType);
            this.intermediary2NCCCtrl.patchValue(data.bankAccountIntermediary2.ncc);
            this.intermediary2NCSCtrl.patchValue(data.bankAccountIntermediary2.ncs);
            this.bankIntermediary2OrderCtrl.patchValue(this.bankIntermediary2OrderOptions[data.bankAccountIntermediary2.order - 1]);
        }
        if (deletionFlag = true) {
            this.newBankAccountForm = false;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyBankAccountDetailsComponent.prototype, "setBankAccountData", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyBankAccountDetailsComponent.prototype, "deleteBankAccountData", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyBankAccountDetailsComponent.prototype, "cancelBankAccountData", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], CounterpartyBankAccountDetailsComponent.prototype, "bankAccountListLength", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyBankAccountDetailsComponent.prototype, "isViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('window:beforeunload', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CounterpartyBankAccountDetailsComponent.prototype, "unloadNotification", null);
    CounterpartyBankAccountDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-bank-account-details',
            template: __webpack_require__(/*! ./counterparty-bank-account-details.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-bank-account-details.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialog"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_10__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__["MasterdataService"]])
    ], CounterpartyBankAccountDetailsComponent);
    return CounterpartyBankAccountDetailsComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.html":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.html ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Counterparty Bank Accounts</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\"\r\n             fxLayoutAlign=\"center end\">\r\n            <mat-nav-list *ngFor=\"let data of bankAccountsData\">\r\n                <div *ngIf=\"!data.isDeleted\">\r\n                    <div fxLayout=\"column\">\r\n                        <div fxLayout=\"row\"\r\n                             fxLayoutAlign=\"left start\">\r\n                            <mat-list-item style=\"width: 510px;\"\r\n                                           (click)=\"onSetBankAccountData(data)\">\r\n                                <div fxLayout=\"column\"\r\n                                     style=\"width: 240px;\">\r\n                                    <div fxLayout=\"row\">\r\n                                        <b>Bank Name</b>\r\n                                    </div>\r\n                                    <div fxLayout=\"row\">\r\n                                        {{ data.bankName }}\r\n                                    </div>\r\n                                </div>\r\n                                <span class=\"fill-space\"\r\n                                      style=\" flex: 0.1 1 auto;\"></span>\r\n                                <div fxLayout=\"column\">\r\n                                    <div fxLayout=\"row\">\r\n                                        <b>Currency</b>\r\n                                    </div>\r\n                                    <div fxLayout=\"row\">\r\n                                        {{ data.accountCCY}}\r\n                                    </div>\r\n                                </div>\r\n                                <span class=\"fill-space\"\r\n                                      style=\" flex: 0.1 1 auto;\"></span>\r\n                                <div fxLayout=\"column\">\r\n                                    <div fxLayout=\"row\">\r\n                                        <b>Status</b>\r\n                                    </div>\r\n                                    <div fxLayout=\"row\">\r\n                                        {{ (data.isDeactivated) ? 'Deactivated' : 'Activated' }}\r\n                                    </div>\r\n                                </div>\r\n                            </mat-list-item>\r\n                            <mat-list-item (click)=\"onSetBankAccountFavorite(data)\">\r\n                                <div fxLayout=\"column\">\r\n                                    <mat-icon [ngClass]=\"data.bankAccountDefault ? 'heart-saved' : 'heart-not-saved'\">\r\n                                        {{ data.bankAccountDefault ? 'favorite' : 'favorite_border' }}\r\n                                    </mat-icon>\r\n                                </div>\r\n                            </mat-list-item>\r\n                        </div>\r\n                    </div>\r\n                    <mat-divider class=\"charter-creation-divider\"></mat-divider>\r\n                </div>\r\n            </mat-nav-list>\r\n            <div class=\"btn-container\"></div>\r\n            <div fxFlex=\"50\"\r\n                 fxAlignLayout=\"start end\">\r\n                <span class=\"fill-space\"></span>\r\n                <button mat-raised-button\r\n                        [disabled]=\"isAddNewBankAccountDisabled || isViewMode\"\r\n                        (click)=\"onAddNewBankAccountButtonClick()\"\r\n                        type=\"button\">\r\n                    ADD NEW BANK ACCOUNT\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.scss":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.scss ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-raised-button {\n  font-weight: 900;\n  background: #fefcfe;\n  color: #060606; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.ts":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.ts ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: CounterpartyBankAccountListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyBankAccountListComponent", function() { return CounterpartyBankAccountListComponent; });
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

var CounterpartyBankAccountListComponent = /** @class */ (function () {
    function CounterpartyBankAccountListComponent() {
        this.addNewflag = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.setBankData = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.bankAccountsData = [];
        this.isAddNewBankAccountDisabled = false;
        this.isDeleteBankAccountDisabled = false;
        this.favoriteFlag = false;
        this.isViewMode = false;
    }
    CounterpartyBankAccountListComponent.prototype.ngOnInit = function () {
    };
    CounterpartyBankAccountListComponent.prototype.onAddNewBankAccountButtonClick = function () {
        this.addNewflag.emit(true);
    };
    CounterpartyBankAccountListComponent.prototype.onSetBankAccountData = function (bankData) {
        if (bankData) {
            this.isAddNewBankAccountDisabled = true;
            this.isDeleteBankAccountDisabled = true;
            this.setBankData.emit(bankData);
        }
    };
    CounterpartyBankAccountListComponent.prototype.updatingBankAccountListOnEditing = function (bankAccountUpdated) {
        if (bankAccountUpdated) {
            var index = -1;
            index = this.bankAccountsData.findIndex(function (bank) { return bank.randomId === bankAccountUpdated.randomId; });
            if (this.bankAccountsData && this.bankAccountsData.length > 0) {
                bankAccountUpdated.counterpartyId = this.bankAccountsData[0].counterpartyId;
            }
            if (index != -1) {
                this.bankAccountsData.splice(index, 1, bankAccountUpdated);
            }
            else {
                this.bankAccountsData.push(bankAccountUpdated);
            }
        }
        this.isAddNewBankAccountDisabled = false;
    };
    CounterpartyBankAccountListComponent.prototype.deletingBankAccountListOnDeletion = function (bankAccountDeleted) {
        if (bankAccountDeleted) {
            var index = -1;
            index = this.bankAccountsData.findIndex(function (bank) { return bank.randomId === bankAccountDeleted.randomId; });
            if (index != -1) {
                bankAccountDeleted.isDeleted = true;
            }
            else {
                return '';
            }
        }
        this.isAddNewBankAccountDisabled = false;
    };
    CounterpartyBankAccountListComponent.prototype.onSetBankAccountFavorite = function (bankAccountFavorite) {
        if (bankAccountFavorite && !this.isViewMode) {
            this.bankAccountsData.forEach(function (element) {
                if (element.bankKey === bankAccountFavorite.bankKey
                    && element.counterpartyId === bankAccountFavorite.counterpartyId && element.accountCCY === bankAccountFavorite.accountCCY) {
                    element.bankAccountDefault = !element.bankAccountDefault;
                }
                else if (element.accountCCY === bankAccountFavorite.accountCCY
                    && element.counterpartyId === bankAccountFavorite.counterpartyId) {
                    element.bankAccountDefault = false;
                }
            });
        }
        this.isAddNewBankAccountDisabled = false;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyBankAccountListComponent.prototype, "addNewflag", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyBankAccountListComponent.prototype, "setBankData", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyBankAccountListComponent.prototype, "isViewMode", void 0);
    CounterpartyBankAccountListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-bank-account-list',
            template: __webpack_require__(/*! ./counterparty-bank-account-list.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-bank-account-list.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], CounterpartyBankAccountListComponent);
    return CounterpartyBankAccountListComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.html":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.html ***!
  \**********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <main>\r\n        <div fxLayout=\"row\"\r\n             fxLayout.md=\"column\"\r\n             fxLayoutAlign=\"space-around start\"\r\n             class='charter-creation-margin'>\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start left\"\r\n                 fxFlex=\"48\">\r\n                <atlas-counterparty-bank-account-list #bankAccountListComponent\r\n                                                      (addNewflag)=\"addNewBankAccount($event)\"\r\n                                                      (setBankData)=\"setBankAccount($event)\"\r\n                                                      (cancelBankAccountData)=\"onCancelBankAccountData()\"\r\n                                                      [isViewMode]=\"isViewMode\">\r\n\r\n                </atlas-counterparty-bank-account-list>\r\n            </div>\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start right\"\r\n                 fxFlex=\"49\">\r\n                <atlas-counterparty-bank-account-details #bankAccountDetailsComponent\r\n                                                         (setBankAccountData)=\"onSetBankAccountData($event)\"\r\n                                                         (deleteBankAccountData)=\"onBankAccountDeleted($event)\"\r\n                                                         (cancelBankAccountData)=\"onCancelBankAccountData()\"\r\n                                                         [bankAccountListLength]=\"bankAccountListLength\"\r\n                                                         [isViewMode]=\"isViewMode\">\r\n                </atlas-counterparty-bank-account-details>\r\n            </div>\r\n        </div>\r\n    </main>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.scss":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.scss ***!
  \**********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".width-card {\n  width: 530px; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.ts":
/*!********************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.ts ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureFormBankAccountTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureFormBankAccountTabComponent", function() { return CounterpartyCaptureFormBankAccountTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _bank_account_list_counterparty_bank_account_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bank-account-list/counterparty-bank-account-list.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.ts");
/* harmony import */ var _bank_account_details_counterparty_bank_account_details_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bank-account-details/counterparty-bank-account-details.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.ts");
/* harmony import */ var _shared_enums_bank_type_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../shared/enums/bank-type.enum */ "./Client/app/shared/enums/bank-type.enum.ts");
/* harmony import */ var _shared_enums_status_enum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/enums/status.enum */ "./Client/app/shared/enums/status.enum.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CounterpartyCaptureFormBankAccountTabComponent = /** @class */ (function () {
    function CounterpartyCaptureFormBankAccountTabComponent() {
        this.isViewMode = false;
    }
    CounterpartyCaptureFormBankAccountTabComponent.prototype.ngOnInit = function () {
        this.bankAccountListLength = this.bankAccountListComponent.bankAccountsData.length;
    };
    CounterpartyCaptureFormBankAccountTabComponent.prototype.onSetBankAccountData = function (newBankAccount) {
        if (newBankAccount) {
            newBankAccount.evalue = _shared_enums_bank_type_enum__WEBPACK_IMPORTED_MODULE_3__["BankTypes"][newBankAccount.bankTypeID];
            newBankAccount.stausValue = _shared_enums_status_enum__WEBPACK_IMPORTED_MODULE_4__["Status"][newBankAccount.bankAccountStatusID];
            this.bankAccountListComponent.updatingBankAccountListOnEditing(newBankAccount);
        }
    };
    CounterpartyCaptureFormBankAccountTabComponent.prototype.addNewBankAccount = function (addNewData) {
        if (addNewData) {
            this.bankAccountDetailsComponent.newBankAccountForm = true;
            this.bankAccountDetailsComponent.bankAccountFormGroup.reset();
            this.bankAccountDetailsComponent.bankAccountIntermediary1FormGroup.reset();
            this.bankAccountDetailsComponent.bankAccountIntermediary2FormGroup.reset();
            this.bankAccountDetailsComponent.bankAccountListLength = this.bankAccountListComponent.bankAccountsData.length;
            this.bankAccountDetailsComponent.bankAccountStatusCtrl.patchValue('1');
        }
    };
    CounterpartyCaptureFormBankAccountTabComponent.prototype.setBankAccount = function (data) {
        if (data) {
            this.bankAccountDisplay = data;
            this.bankAccountDetailsComponent.editBankAccount = true;
            this.bankAccountDetailsComponent.getBankAccountData(this.bankAccountDisplay, this.bankAccountListComponent.isDeleteBankAccountDisabled);
            this.bankAccountDetailsComponent.bankAccountListLength = this.bankAccountListComponent.bankAccountsData.length;
        }
    };
    CounterpartyCaptureFormBankAccountTabComponent.prototype.onBankAccountDeleted = function (deletedBankAccount) {
        if (deletedBankAccount) {
            this.bankAccountListComponent.deletingBankAccountListOnDeletion(deletedBankAccount);
        }
    };
    CounterpartyCaptureFormBankAccountTabComponent.prototype.onCancelBankAccountData = function () {
        this.bankAccountListComponent.isAddNewBankAccountDisabled = false;
        this.bankAccountDetailsComponent.isNewBankAccount = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('bankAccountListComponent'),
        __metadata("design:type", _bank_account_list_counterparty_bank_account_list_component__WEBPACK_IMPORTED_MODULE_1__["CounterpartyBankAccountListComponent"])
    ], CounterpartyCaptureFormBankAccountTabComponent.prototype, "bankAccountListComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('bankAccountDetailsComponent'),
        __metadata("design:type", _bank_account_details_counterparty_bank_account_details_component__WEBPACK_IMPORTED_MODULE_2__["CounterpartyBankAccountDetailsComponent"])
    ], CounterpartyCaptureFormBankAccountTabComponent.prototype, "bankAccountDetailsComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormBankAccountTabComponent.prototype, "isViewMode", void 0);
    CounterpartyCaptureFormBankAccountTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture-form-bank-account-tab',
            template: __webpack_require__(/*! ./counterparty-capture-form-bank-account-tab.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture-form-bank-account-tab.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], CounterpartyCaptureFormBankAccountTabComponent);
    return CounterpartyCaptureFormBankAccountTabComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.html":
/*!**************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.html ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card *ngIf=\"newContactForm || editContact\">\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h2>\r\n                <atlas-dropdown-select fxFlex='20%'\r\n                                       label=\"Title\"\r\n                                       [fieldControl]=\"titleDesignationCtrl\"\r\n                                       isEditable=\"true\"\r\n                                       [options]=\"options\"\r\n                                       [displayProperty]=\"displayProperty\"\r\n                                       [selectProperties]=\"selectProperties\"></atlas-dropdown-select>\r\n                <span class=\"fill-space\"></span>\r\n\r\n                <atlas-form-input fxFlex=\"50%\"\r\n                                  [fieldControl]=\"contactNameCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [required]=\"contactNameCtrl.isRequired\"\r\n                                  label=\"Contact Name\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n            </h2>\r\n\r\n            <div fxFlex=\"20%\"\r\n                 fxLayout=\"row\"\r\n                 fxAlignLayout=\"start end\">\r\n                <button [disabled]=\"newContactForm || isDeleteDisabled || isViewMode\"\r\n                        mat-raised-button\r\n                        (click)='deleteContact()'\r\n                        type=\"button\">\r\n                    DELETE\r\n                </button>\r\n            </div>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\">\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"surNameCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Sur Name\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"firstNameCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"First Name\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"extraInitialsCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Extra Initials\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n\r\n            </div>\r\n\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"60%\"\r\n                                  [fieldControl]=\"jobTitleRelationShipCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Job Title/Relationship\"\r\n                                  [errorMap]=\"inputErrorMapforJobTitleRelationShip\">\r\n                </atlas-form-input>\r\n\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"40%\"\r\n                                  [fieldControl]=\"domainCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Domain\"\r\n                                  [errorMap]=\"inputErrorMapforDomain\">\r\n                </atlas-form-input>\r\n\r\n\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">Address\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"100%\"\r\n                                  [fieldControl]=\"address1Ctrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Address 1\">\r\n                </atlas-form-input>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"100%\"\r\n                                  [fieldControl]=\"address2Ctrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Address 2\">\r\n                </atlas-form-input>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"zipCodeCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  style=\"margin-right: 10px\"\r\n                                  label=\"Zip Code\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"cityCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  style=\"margin-right: 10px\"\r\n                                  label=\"City\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"Country\"\r\n                           [matAutocomplete]=\"countryCode\"\r\n                           [formControl]=\"countryCtrl\"\r\n                           autocomplete=\"off\">\r\n                    <mat-autocomplete #countryCode=\"matAutocomplete\"\r\n                                      [panelWidth]=\"panelSize\">\r\n                        <mat-option *ngFor=\"let country of filteredCountry\"\r\n                                    [value]=\"country.description\">\r\n                            {{country.countryId}} | {{country.description}}\r\n                        </mat-option>\r\n                    </mat-autocomplete>\r\n                    <mat-error *ngIf=\"countryCtrl.hasError('inDropdownList')\">\r\n                        Value not in list\r\n                    </mat-error>\r\n                    <mat-hint *ngIf=\"countryCtrl.isRequired\">\r\n                        Required *\r\n                    </mat-hint>\r\n                    <mat-error *ngIf=\"countryCtrl.hasError('required')\">\r\n                        This field is required\r\n                    </mat-error>\r\n                </mat-form-field>\r\n                <span class=\"fill-space\"></span>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"100%\"\r\n                                  [fieldControl]=\"emailAddressCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Email Address\">\r\n                </atlas-form-input>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"phoneNumberCtrl\"\r\n                                  (keypress)=\"phoneNoValidation($event)\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMapforPhoneNumnber\"\r\n                                  label=\"Phone No.\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"mobilePhoneNumberCtrl\"\r\n                                  (keypress)=\"phoneNoValidation($event)\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  label=\"Mobile Phone No.\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"privatePhoneNumberCtrl\"\r\n                                  (keypress)=\"phoneNoValidation($event)\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMapforPrivatePhoneNumber\"\r\n                                  label=\"Private Phone No.\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <mat-form-field>\r\n                    <textarea matInput\r\n                              rows=\"5\"\r\n                              placeholder=\"Communications\"\r\n                              [formControl]='communicationsCtrl'></textarea>\r\n                    <mat-error *ngIf=\"communicationsCtrl.hasError('maxlength')\">\r\n                        Communications memorandum should be at most 2000 Characters long.\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n            <div fxFlex=\"100%\">\r\n                <div class=\"btn-container\">\r\n                    <div fxFlex=\"50\"\r\n                         fxLayout=\"row\"\r\n                         fxAlignLayout=\"start start\">\r\n                        <button mat-raised-button\r\n                                [disabled]=\"isViewMode\"\r\n                                type=\"button\"\r\n                                (click)=\"onCancelButtonClicked()\">\r\n                            cancel\r\n                        </button>\r\n                    </div>\r\n                    <div fxFlex=\"50\"\r\n                         fxLayout=\"row\"\r\n                         fxAlignLayout=\"start end\">\r\n                        <span class=\"fill-space\"></span>\r\n\r\n                        <button mat-raised-button\r\n                                [disabled]=\"isViewMode\"\r\n                                type=\"button\"\r\n                                (click)=\"onSaveButtonClicked()\">\r\n                            save\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>\r\n\r\n<atlas-empty-state *ngIf=\"!newContactForm && !editContact\"\r\n                   title=\"Want to see the Detail of a Contact\"\r\n                   [message]=\"contactEmptyMessage\"></atlas-empty-state>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.scss":
/*!**************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.scss ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.ts":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.ts ***!
  \************************************************************************************************************************************************************/
/*! exports provided: ContactDetailCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactDetailCardComponent", function() { return ContactDetailCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/enums/title-designation */ "./Client/app/shared/enums/title-designation.ts");
/* harmony import */ var _shared_entities_title_designation_entity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../shared/entities/title-designation.entity */ "./Client/app/shared/entities/title-designation.entity.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
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














var ContactDetailCardComponent = /** @class */ (function (_super) {
    __extends(ContactDetailCardComponent, _super);
    function ContactDetailCardComponent(formBuilder, formConfigurationProvider, snackbarService, dialog, utilService, masterdataService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.snackbarService = snackbarService;
        _this.dialog = dialog;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.cancelContact = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.contactNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('ContactName');
        _this.titleDesignationCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('TitleDesignation');
        _this.surNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('SurName');
        _this.firstNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('FirstName');
        _this.extraInitialsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('ExtraInitials');
        _this.jobTitleRelationShipCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('JobTitleRelationShip');
        _this.domainCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Domain');
        _this.address1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Address1');
        _this.address2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Address2');
        _this.zipCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('ZipCode');
        _this.cityCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('City');
        _this.countryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Country');
        _this.emailAddressCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('EmailAddress');
        _this.phoneNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('PhoneNumber');
        _this.mobilePhoneNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('MobilePhoneNumber');
        _this.privatePhoneNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('PrivatePhoneNumber');
        _this.communicationsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Communications');
        _this.displayProperty = 'titleDesignation';
        _this.selectProperties = ['titleDesignation'];
        _this.titleToView = new _shared_entities_title_designation_entity__WEBPACK_IMPORTED_MODULE_6__["TitleDesignationTypes"]();
        _this.newContactForm = false;
        _this.contactCreated = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.contactDeleted = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.isViewMode = false;
        _this.contactEmptyMessage = "Start by Selecting One";
        _this.editContact = false;
        _this.isEditMode = false;
        _this.isNewContact = true;
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_12__["MasterDataProps"].Countries,
        ];
        _this.isDeleted = false;
        _this.isDeleteDisabled = false;
        _this.inputErrorMap = new Map();
        _this.inputErrorMapforPhoneNumnber = new Map();
        _this.inputErrorMapforJobTitleRelationShip = new Map();
        _this.inputErrorMapforDomain = new Map();
        _this.inputErrorMapforPrivatePhoneNumber = new Map();
        _this.inputErrorMap.set('maxlength', 'Maximum 10 digits Allowed');
        _this.inputErrorMapforPhoneNumnber.set('maxlength', 'Maximum 16 digits Allowed');
        _this.inputErrorMapforJobTitleRelationShip.set('maxlength', 'Maximum 50 digits Allowed');
        _this.inputErrorMapforDomain.set('maxlength', 'Maximum 50 digits Allowed');
        _this.inputErrorMapforPrivatePhoneNumber.set('maxlenght', 'Maximum 16 didgits Allowed');
        return _this;
    }
    ContactDetailCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isEditMode = true;
        if (!this.isEditMode) {
            this.formGroup.disable();
        }
        this.options = [
            {
                titleId: _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_5__["TitleDesignation"].Mr,
                titleDesignation: 'Mr.',
            },
            {
                titleId: _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_5__["TitleDesignation"].Mrs,
                titleDesignation: 'Mrs.',
            },
            {
                titleId: _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_5__["TitleDesignation"].Ms,
                titleDesignation: 'Ms.',
            },
        ];
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.filteredCountry = _this.masterdata.countries;
        });
        this.countryCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCountry = _this.utilService.filterListforAutocomplete(input, _this.masterdata.countries, ['countryId', 'description']);
        });
        this.setValidators();
    };
    ContactDetailCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            contactNameCtrl: this.contactNameCtrl,
            titleDesignationCtrl: this.titleDesignationCtrl,
            surNameCtrl: this.surNameCtrl,
            firstNameCtrl: this.firstNameCtrl,
            extraInitialsCtrl: this.extraInitialsCtrl,
            jobTitleRelationShipCtrl: this.jobTitleRelationShipCtrl,
            domainCtrl: this.domainCtrl,
            address1Ctrl: this.address1Ctrl,
            address2Ctrl: this.address2Ctrl,
            zipCodeCtrl: this.zipCodeCtrl,
            cityCtrl: this.cityCtrl,
            countryCtrl: this.countryCtrl,
            emailAddressCtrl: this.emailAddressCtrl,
            phoneNumberCtrl: this.phoneNumberCtrl,
            mobilePhoneNumberCtrl: this.mobilePhoneNumberCtrl,
            privatePhoneNumberCtrl: this.privatePhoneNumberCtrl,
            communicationsCtrl: this.communicationsCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    ContactDetailCardComponent.prototype.setValidators = function () {
        this.contactNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z ]*$')]));
        this.firstNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z ]*$')]));
        this.jobTitleRelationShipCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(50), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z ]*$')]));
        this.domainCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(50), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z ]*$')]));
        this.phoneNumberCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(16)]));
        this.privatePhoneNumberCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(16)]));
        this.mobilePhoneNumberCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(10)]));
        this.emailAddressCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.com')]));
        this.surNameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z ]*$')]));
        this.communicationsCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(2000)]));
        this.extraInitialsCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern('^[a-zA-Z ]*$')]));
        this.countryCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_13__["inDropdownListValidator"])(this.masterdata.countries, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_10__["nameof"])('description')),
        ]));
        this.formGroup.updateValueAndValidity();
    };
    ContactDetailCardComponent.prototype.phoneNoValidation = function (event) {
        var pattern = /[0-9]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    ContactDetailCardComponent.prototype.deleteContact = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_8__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Contact ' + this.contactNameCtrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.contactDeleted.emit(_this.contactToDisplay);
                _this.formGroup.reset();
                _this.newContactForm = false;
                _this.editContact = false;
            }
        });
    };
    ContactDetailCardComponent.prototype.setContactInformationOnDisplayCard = function (contact, deletionFlag) {
        if (contact) {
            this.contactToDisplay = contact;
            if (contact.randomId) {
                this.isNewContact = false;
            }
            this.firstNameCtrl.patchValue(contact.firstName);
            if (contact.title) {
                this.titleDesignationCtrl.patchValue(this.options.find(function (item) { return item.titleId === contact.title; }));
            }
            this.contactNameCtrl.patchValue(contact.contactName);
            this.surNameCtrl.patchValue(contact.surname);
            this.extraInitialsCtrl.patchValue(contact.extraInitials);
            this.jobTitleRelationShipCtrl.patchValue(contact.jobRole);
            this.domainCtrl.patchValue(contact.domain);
            this.address1Ctrl.patchValue(contact.address1);
            this.address2Ctrl.patchValue(contact.address2);
            this.zipCodeCtrl.patchValue(contact.zipCode);
            if (contact.countryId) {
                this.countryCtrl.patchValue(this.filteredCountry.find(function (country) { return country.countryId === contact.countryId; }).description);
            }
            this.cityCtrl.patchValue(contact.city);
            this.emailAddressCtrl.patchValue(contact.email);
            this.phoneNumberCtrl.patchValue(contact.phoneNo);
            this.privatePhoneNumberCtrl.patchValue(contact.privatePhoneNo);
            this.mobilePhoneNumberCtrl.patchValue(contact.mobilePhoneNo);
            this.communicationsCtrl.patchValue(contact.communications);
        }
        if (deletionFlag = true) {
            this.newContactForm = false;
        }
    };
    ContactDetailCardComponent.prototype.onSaveButtonClicked = function () {
        var _this = this;
        if (this.formGroup.valid) {
            var contact = {
                contactId: this.contactToDisplay ? this.contactToDisplay.contactId : null,
                randomId: this.isNewContact ? this.contactListLength + 1 : this.contactToDisplay.randomId,
                firstName: this.firstNameCtrl.value,
                title: this.titleDesignationCtrl.value ? this.titleDesignationCtrl.value.titleId : null,
                contactName: this.contactNameCtrl.value,
                surname: this.surNameCtrl.value,
                extraInitials: this.extraInitialsCtrl.value,
                jobRole: this.jobTitleRelationShipCtrl.value,
                domain: this.domainCtrl.value,
                address1: this.address1Ctrl.value,
                address2: this.address2Ctrl.value,
                zipCode: this.zipCodeCtrl.value,
                city: this.cityCtrl.value,
                countryId: this.countryCtrl.value ? this.filteredCountry.find(function (country) { return country.description === _this.countryCtrl.value; }).countryId : '',
                email: this.emailAddressCtrl.value,
                phoneNo: this.phoneNumberCtrl.value,
                mobilePhoneNo: this.mobilePhoneNumberCtrl.value,
                privatePhoneNo: this.privatePhoneNumberCtrl.value,
                communications: this.communicationsCtrl.value,
                counterpartyId: this.counterPartyId,
                main: false,
                isDeleted: this.isDeleted,
            };
            this.contactCreated.emit(contact);
            this.formGroup.reset();
            this.isNewContact = true;
            this.newContactForm = false;
            this.editContact = false;
        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
            return;
        }
    };
    ContactDetailCardComponent.prototype.onCancelButtonClicked = function () {
        this.formGroup.reset();
        this.newContactForm = false;
        this.editContact = false;
        this.cancelContact.emit();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ContactDetailCardComponent.prototype, "cancelContact", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ContactDetailCardComponent.prototype, "contactCreated", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ContactDetailCardComponent.prototype, "contactDeleted", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ContactDetailCardComponent.prototype, "contactListLength", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ContactDetailCardComponent.prototype, "isViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ContactDetailCardComponent.prototype, "counterPartyId", void 0);
    ContactDetailCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-contact-detail-card',
            template: __webpack_require__(/*! ./contact-detail-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.html"),
            styles: [__webpack_require__(/*! ./contact-detail-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_4__["FormConfigurationProviderService"], _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_9__["MatDialog"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_10__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_11__["MasterdataService"]])
    ], ContactDetailCardComponent);
    return ContactDetailCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.html":
/*!*****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.html ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h2>Counterparty Contacts</h2>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\"\r\n             fxLayoutAlign=\"center end\">\r\n            <mat-nav-list *ngFor=\"let contact of contactData\">\r\n                <div *ngIf=\"!contact.isDeleted\">\r\n                    <div fxLayout=\"column\"\r\n                         fxFlex=\"100%\">\r\n                        <div fxLayout=\"row\"\r\n                             fxLayoutAlign=\"left start\">\r\n                            <mat-list-item style=\"min-width: 450px;\"\r\n                                           (click)=\"onOpenContact(contact)\">\r\n                                <div fxLayout=\"column\"\r\n                                     fxFlex=\"100\">\r\n                                    <div fxLayout=\"row\"\r\n                                         fxLayoutAlign=\"left start\"\r\n                                         fxLayoutGap=\"35px\">\r\n                                        <div fxLayout=\"column\">\r\n                                            <div fxLayout=\"row\">\r\n                                                <b>Title</b>\r\n                                            </div>\r\n                                            <div fxLayout=\"row\">\r\n                                                {{ contact.titleValue }}\r\n                                            </div>\r\n                                        </div>\r\n                                        <div fxLayout=\"column\">\r\n                                            <div fxLayout=\"row\">\r\n                                                <b>First Name</b>\r\n                                            </div>\r\n                                            <div fxLayout=\"row\">\r\n                                                {{ contact.firstName }}\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <mat-divider class=\"charter-creation-divider\"></mat-divider>\r\n                            </mat-list-item>\r\n                            <mat-list-item (click)=\"onSetContactFavorite(contact)\">\r\n                                <div fxLayout=\"column\">\r\n                                    <mat-icon [ngClass]=\"contact.isFavorite ? 'heart-saved' : 'heart-not-saved'\">\r\n                                        {{ contact.isFavorite ? 'favorite' : 'favorite_border' }}\r\n                                    </mat-icon>\r\n                                </div>\r\n                            </mat-list-item>\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n            </mat-nav-list>\r\n            <div class=\"btn-container\"></div>\r\n            <div fxFlex=\"50\"\r\n                 fxAlignLayout=\"start end\">\r\n                <span class=\"fill-space\"></span>\r\n                <button mat-raised-button\r\n                        type=\"button\"\r\n                        [disabled]=\"isContactListDataClicked || isViewMode\"\r\n                        (click)=\"onAddNewContact()\">\r\n                    ADD NEW Contact\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.scss":
/*!*****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.scss ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.ts":
/*!***************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.ts ***!
  \***************************************************************************************************************************************************/
/*! exports provided: ContactCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactCardComponent", function() { return ContactCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/enums/title-designation */ "./Client/app/shared/enums/title-designation.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContactCardComponent = /** @class */ (function () {
    function ContactCardComponent() {
        this.contactData = [];
        this.addNewContact = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.contactDetails = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isContactListDataClicked = false;
        this.isDeleteButtonEnabled = false;
        this.isViewMode = false;
    }
    ContactCardComponent.prototype.ngOnInit = function () {
        this.options = [
            {
                titleId: _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_1__["TitleDesignation"].Mr,
                titleDesignation: 'Mr.',
            },
            {
                titleId: _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_1__["TitleDesignation"].Mrs,
                titleDesignation: 'Mrs.',
            },
            {
                titleId: _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_1__["TitleDesignation"].Ms,
                titleDesignation: 'Ms.',
            },
        ];
    };
    ContactCardComponent.prototype.onOpenContact = function (contact) {
        this.isContactListDataClicked = true;
        this.isDeleteButtonEnabled = true;
        this.contactDetails.emit(contact);
    };
    ContactCardComponent.prototype.onAddNewContact = function () {
        this.addNewContact.emit(true);
    };
    ContactCardComponent.prototype.updatingContactListOnEditing = function (contactToBeUpdated) {
        if (contactToBeUpdated) {
            var index = -1;
            index = this.contactData.findIndex(function (contact) { return contact.randomId === contactToBeUpdated.randomId; });
            if (index != -1) {
                this.contactData.splice(index, 1, contactToBeUpdated);
            }
            else {
                this.contactData.push(contactToBeUpdated);
            }
        }
        this.isContactListDataClicked = false;
    };
    ContactCardComponent.prototype.updatingContactListOnDeletion = function (contactToBeDeleted) {
        if (contactToBeDeleted) {
            var index = -1;
            index = this.contactData.findIndex(function (contact) { return contact.randomId === contactToBeDeleted.randomId; });
            if (index != -1) {
                contactToBeDeleted.isDeleted = true;
                contactToBeDeleted.isDeactivated = true;
            }
            else {
                return '';
            }
        }
        this.isContactListDataClicked = false;
    };
    ContactCardComponent.prototype.onSetContactFavorite = function (contactFavorite) {
        if (contactFavorite && !this.isViewMode) {
            this.contactData.forEach(function (element) {
                if (element.randomId === contactFavorite.randomId) {
                    element.isFavorite = true;
                }
                else {
                    element.isFavorite = false;
                }
            });
        }
        this.isContactListDataClicked = false;
    };
    ContactCardComponent.prototype.populateValue = function () {
        var _this = this;
        if (this.contactData) {
            this.contactData.forEach(function (contact) {
                if (contact.title) {
                    contact.titleValue = _this.options.find(function (c) { return c.titleId == contact.title; }).titleDesignation;
                }
            });
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ContactCardComponent.prototype, "addNewContact", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ContactCardComponent.prototype, "contactDetails", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ContactCardComponent.prototype, "isViewMode", void 0);
    ContactCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-contact-card',
            template: __webpack_require__(/*! ./contact-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.html"),
            styles: [__webpack_require__(/*! ./contact-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ContactCardComponent);
    return ContactCardComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.html":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.html ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <main>\r\n        <div fxLayout=\"row\"\r\n             fxLayout.md=\"column\"\r\n             fxLayoutAlign=\"space-around start\"\r\n             class='charter-creation-margin'>\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start left\"\r\n                 fxFlex=\"48\">\r\n                <atlas-counterparty-contact-card #contactCardComponent\r\n                                                 (addNewContact)=\"onAddNewContactClicked($event)\"\r\n                                                 (contactDetails)=\"onContactListClicked($event)\"\r\n                                                 (cancelContact)=\"onCancelContact()\"\r\n                                                 [isViewMode]=\"isViewMode\">\r\n                </atlas-counterparty-contact-card>\r\n\r\n            </div>\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start right\"\r\n                 fxFlex=\"49\">\r\n                <atlas-counterparty-contact-detail-card #contactDetailCardComponent\r\n                                                        (contactCreated)=\"onNewContactCreated($event)\"\r\n                                                        (contactDeleted)=\"onContactDeleted($event)\"\r\n                                                        (cancelContact)=\"onCancelContact()\"\r\n                                                        [contactListLength]=\"contactListLength\"\r\n                                                        [counterPartyId]=\"counterPartyId\"\r\n                                                        [isViewMode]=\"isViewMode\">\r\n                </atlas-counterparty-contact-detail-card>\r\n            </div>\r\n        </div>\r\n    </main>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.scss":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.scss ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.ts":
/*!**********************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.ts ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureFormContactTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureFormContactTabComponent", function() { return CounterpartyCaptureFormContactTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _contact_detail_card_contact_detail_card_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contact-detail-card/contact-detail-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.ts");
/* harmony import */ var _contact_list_card_contact_card_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact-list-card/contact-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.ts");
/* harmony import */ var _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../.././../../../shared/enums/title-designation */ "./Client/app/shared/enums/title-designation.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../.././../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../.././../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
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








var CounterpartyCaptureFormContactTabComponent = /** @class */ (function (_super) {
    __extends(CounterpartyCaptureFormContactTabComponent, _super);
    function CounterpartyCaptureFormContactTabComponent(route, formBuilder, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.newContact = false;
        _this.isViewMode = false;
        return _this;
    }
    CounterpartyCaptureFormContactTabComponent.prototype.ngOnInit = function () {
        this.contactListLength = this.contactCardComponent.contactData.length;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
    };
    CounterpartyCaptureFormContactTabComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            contactDetailCardComponent: this.contactDetailCardComponent.getFormGroup(),
        });
        return _super.prototype.getFormGroup.call(this);
    };
    CounterpartyCaptureFormContactTabComponent.prototype.onAddNewContactClicked = function (value) {
        if (value === true) {
            this.contactDetailCardComponent.newContactForm = true;
            this.contactDetailCardComponent.formGroup.reset();
            this.contactDetailCardComponent.contactListLength = this.contactCardComponent.contactData.length;
        }
    };
    CounterpartyCaptureFormContactTabComponent.prototype.onContactListClicked = function (contact) {
        if (contact) {
            this.contactToDisplay = contact;
            this.contactDetailCardComponent.editContact = true;
            this.contactDetailCardComponent.setContactInformationOnDisplayCard(this.contactToDisplay, this.contactCardComponent.isDeleteButtonEnabled);
            this.contactDetailCardComponent.contactListLength = this.contactCardComponent.contactData.length;
        }
    };
    CounterpartyCaptureFormContactTabComponent.prototype.onNewContactCreated = function (newContact) {
        if (newContact) {
            newContact.titleValue = _shared_enums_title_designation__WEBPACK_IMPORTED_MODULE_3__["TitleDesignation"][newContact.title];
            this.contactCardComponent.updatingContactListOnEditing(newContact);
        }
    };
    CounterpartyCaptureFormContactTabComponent.prototype.onContactDeleted = function (deletedContact) {
        if (deletedContact) {
            this.contactCardComponent.updatingContactListOnDeletion(deletedContact);
        }
    };
    CounterpartyCaptureFormContactTabComponent.prototype.onCancelContact = function () {
        this.contactCardComponent.isContactListDataClicked = false;
        this.contactDetailCardComponent.isNewContact = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormContactTabComponent.prototype, "isViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('contactDetailCardComponent'),
        __metadata("design:type", _contact_detail_card_contact_detail_card_component__WEBPACK_IMPORTED_MODULE_1__["ContactDetailCardComponent"])
    ], CounterpartyCaptureFormContactTabComponent.prototype, "contactDetailCardComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('contactCardComponent'),
        __metadata("design:type", _contact_list_card_contact_card_component__WEBPACK_IMPORTED_MODULE_2__["ContactCardComponent"])
    ], CounterpartyCaptureFormContactTabComponent.prototype, "contactCardComponent", void 0);
    CounterpartyCaptureFormContactTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture-form-contact-tab',
            template: __webpack_require__(/*! ./counterparty-capture-form-contact-tab.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture-form-contact-tab.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"], _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_6__["FormConfigurationProviderService"]])
    ], CounterpartyCaptureFormContactTabComponent);
    return CounterpartyCaptureFormContactTabComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_7__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.html":
/*!*******************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.html ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-sidenav-container>\r\n    <mat-sidenav-content>\r\n        <div *ngIf=\"isLoading\">\r\n            <mat-card>\r\n                <h2>Loading</h2>\r\n                <div class=\"custom-line-title\"></div>\r\n\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"center center\"\r\n                     fxLayoutWrap\r\n                     fxLayoutGap=\"20px\">\r\n                    <mat-spinner color=\"accent\"></mat-spinner>\r\n                </div>\r\n            </mat-card>\r\n        </div>\r\n        <form [ngClass]=\"{'hidden-during-loading':isLoading}\"\r\n              [formGroup]=\"captureCounterpartyFormGroup\">\r\n            <atlas-counterparty-header #headerComponent\r\n                                       [isCreateMode]=\"isCreateMode\"\r\n                                       [isEditMode]=\"isEditMode\">\r\n            </atlas-counterparty-header>\r\n            <atlas-counterparty-management-menu-bar #menuComponent\r\n                                                    (localViewMode)=\"onLocalViewModeCalled($event)\"\r\n                                                    (saveMethod)=\"OnSaveMethodCalled()\"\r\n                                                    [isCreateMode]=\"isCreateMode\"\r\n                                                    [isViewMode]=\"isViewMode\">\r\n            </atlas-counterparty-management-menu-bar>\r\n\r\n            <div class=\"main-container\">\r\n                <main>\r\n\r\n                    <mat-tab-group dynamicHeight\r\n                                   [(selectedIndex)]=selectedTab\r\n                                   class=\"bright-tab\">\r\n                        <mat-tab label=\"MAIN\">\r\n                            <atlas-counterparty-capture-form-main-tab #mainTabComponent\r\n                                                                      [isViewMode]=\"isViewMode\"\r\n                                                                      [isEditMode]=\"isEditMode\"\r\n                                                                      [mappedData]=\"mappedData\">\r\n                            </atlas-counterparty-capture-form-main-tab>\r\n                        </mat-tab>\r\n                        <mat-tab label=\"ADDRESS\">\r\n                            <atlas-counterparty-capture-form-address-tab #addressTabComponent\r\n                                                                         [isViewMode]=\"isViewMode\">\r\n                            </atlas-counterparty-capture-form-address-tab>\r\n                        </mat-tab>\r\n                        <mat-tab label=\"CONTACT\">\r\n                            <atlas-counterparty-capture-form-contact-tab #contactTabComponent\r\n                                                                         [isViewMode]=\"isViewMode\">\r\n                            </atlas-counterparty-capture-form-contact-tab>\r\n                        </mat-tab>\r\n                        <mat-tab label=\"BANK ACCOUNTS\">\r\n                            <atlas-counterparty-capture-form-bank-account-tab #bankAccountTabComponent\r\n                                                                              [isViewMode]=\"isViewMode\">\r\n                            </atlas-counterparty-capture-form-bank-account-tab>\r\n                        </mat-tab>\r\n                        <mat-tab label=\"TAX INFO\">\r\n                            <atlas-counterparty-capture-form-tax-info-tab #taxInfoTabComponent\r\n                                                                          [isViewMode]=\"isViewMode\">\r\n                            </atlas-counterparty-capture-form-tax-info-tab>\r\n                        </mat-tab>\r\n                        <mat-tab label=\"REPORTS\">\r\n                            <atlas-counterparty-capture-form-report-tab #reportTabComponent\r\n                                                                        [counterPartyId]=\"counterPartyId\"\r\n                                                                        [isCreateMode]=\"isCreateMode\">\r\n                            </atlas-counterparty-capture-form-report-tab>\r\n                        </mat-tab>\r\n                    </mat-tab-group>\r\n                </main>\r\n\r\n                <mat-divider class=\"trade-capture-divider\"></mat-divider>\r\n                <div class=\"btn-container\">\r\n                    <div fxFlex=\"50\"\r\n                         fxLayout=\"row\"\r\n                         fxAlignLayout=\"start start\">\r\n                        <button mat-button\r\n                                type=\"button\"\r\n                                [disabled]=\"isShow\"\r\n                                (click)=\"onCancelButtonClicked()\">\r\n                            cancel\r\n                        </button>\r\n                    </div>\r\n                    <div fxFlex=\"50\"\r\n                         fxLayout=\"row\"\r\n                         fxAlignLayout=\"start end\">\r\n                        <span class=\"fill-space\"></span>\r\n\r\n                        <button mat-raised-button\r\n                                type=\"button\"\r\n                                (click)=\"onSaveButtonClicked()\"\r\n                                [disabled]=\"saveInProgress || isViewMode\">\r\n                            save\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </mat-sidenav-content>\r\n    <atlas-lock-interval [resourcesInformation]=\"resourcesInformation\">\r\n    </atlas-lock-interval>\r\n</mat-sidenav-container>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.scss":
/*!*******************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.scss ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.ts":
/*!*****************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.ts ***!
  \*****************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureComponent", function() { return CounterpartyCaptureComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_entities_counterparty_entity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/entities/counterparty.entity */ "./Client/app/shared/entities/counterparty.entity.ts");
/* harmony import */ var _main_tab_counterparty_capture_form_main_tab_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./main-tab/counterparty-capture-form-main-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.ts");
/* harmony import */ var _address_tab_counterparty_capture_form_address_tab_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./address-tab/counterparty-capture-form-address-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.ts");
/* harmony import */ var _contact_tab_counterparty_capture_form_contact_tab_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./contact-tab/counterparty-capture-form-contact-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.ts");
/* harmony import */ var _bank_account_tab_counterparty_capture_form_bank_account_tab_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./bank-account-tab/counterparty-capture-form-bank-account-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.ts");
/* harmony import */ var _tax_info_tab_counterparty_capture_form_tax_info_tab_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./tax-info-tab/counterparty-capture-form-tax-info-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.ts");
/* harmony import */ var _report_tab_counterparty_capture_form_report_tab_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./report-tab/counterparty-capture-form-report-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _counterparty_header_counterparty_header_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./counterparty-header/counterparty-header.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../core/services/authorization.service */ "./Client/app/core/services/authorization.service.ts");
/* harmony import */ var _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./../../../../shared/enums/permission-level.enum */ "./Client/app/shared/enums/permission-level.enum.ts");
/* harmony import */ var _counterparty_management_menu_bar_counterparty_management_menu_bar_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./counterparty-management-menu-bar/counterparty-management-menu-bar.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.ts");
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
























var CounterpartyCaptureComponent = /** @class */ (function (_super) {
    __extends(CounterpartyCaptureComponent, _super);
    function CounterpartyCaptureComponent(formBuilder, cdr, formConfigurationProvider, route, titleService, dialog, masterDataService, utilService, companyManager, router, snackbarService, securityService, authorizationService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.cdr = cdr;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.route = route;
        _this.titleService = titleService;
        _this.dialog = dialog;
        _this.masterDataService = masterDataService;
        _this.utilService = utilService;
        _this.companyManager = companyManager;
        _this.router = router;
        _this.snackbarService = snackbarService;
        _this.securityService = securityService;
        _this.authorizationService = authorizationService;
        _this.selectedTab = 0;
        _this.isLoading = false;
        _this.isShow = true;
        _this.isEdit = false;
        _this.counterpartyStatus = '';
        _this.onValidationState = false;
        _this.counterPartyStatusTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_4__["AtlasFormControl"]('counterPartyStatusTypeCtrl');
        _this.subscriptions = [];
        _this.resourcesInformation = new Array();
        _this.isCreateMode = false;
        _this.isEditMode = false;
        _this.isViewMode = false;
        _this.isEditExceptionPrivilege = false;
        _this.isReadWritePermission = false;
        _this.counterpartyAddresses = [];
        _this.mappedData = [];
        return _this;
    }
    CounterpartyCaptureComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isLoading = true;
        this.company = this.route.snapshot.params['company'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCompany = this.masterdata.companies;
        this.companyId = this.filteredCompany.find(function (company) { return company.companyId === _this.company; }).id;
        this.securityService.isSecurityReady().subscribe(function () {
            if (_this.authorizationService.isPrivilegeAllowed(_this.company, 'Referential')) {
                var permissionLevel = void 0;
                permissionLevel = _this.authorizationService.getPermissionLevel(_this.company, 'TradingAndExecution', 'Referential');
                if (permissionLevel == _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_22__["PermissionLevels"].ReadWrite) {
                    _this.menuComponent.isEditCounterpartyPrivilege = _this.authorizationService.isPrivilegeAllowed(_this.company, 'TradingAndExecution');
                }
            }
            if (_this.authorizationService.isPrivilegeAllowed(_this.company, 'Referential')
                && _this.authorizationService.isPrivilegeAllowed(_this.company, 'TradingAndExecution')) {
                _this.isEditExceptionPrivilege = _this.authorizationService.isPrivilegeAllowed(_this.company, 'EditCounterparty');
            }
            if (!_this.authorizationService.isAdministrator(_this.company)) {
                _this.addressTabComponent.addressDetailComponent.isDeleteDisabled = true;
                _this.bankAccountTabComponent.bankAccountDetailsComponent.isDeleteDisabled = true;
                _this.contactTabComponent.contactDetailCardComponent.isDeleteDisabled = true;
                _this.taxInfoTabComponent.isDeleteDisabled = true;
            }
            else {
                _this.mainTabComponent.informationCardComponent.isAdmin = true;
                _this.mainTabComponent.thirdSystemCodesCardComponent.isAdmin = true;
                _this.headerComponent.isAdmin = true;
                _this.addressTabComponent.addressDetailComponent.isDeleteDisabled = false;
                _this.bankAccountTabComponent.bankAccountDetailsComponent.isDeleteDisabled = false;
                _this.contactTabComponent.contactDetailCardComponent.isDeleteDisabled = false;
                _this.taxInfoTabComponent.isDeleteDisabled = false;
            }
        });
        this.captureCounterpartyFormGroup = this.formBuilder.group({
            headerGroup: this.headerComponent.getFormGroup(),
            mainTabComponent: this.mainTabComponent.getFormGroup(),
            addressTabComponent: this.addressTabComponent.getFormGroup(),
            contactTabComponent: this.contactTabComponent.getFormGroup(),
        });
        if (this.route.snapshot.data.formId === 'CounterPartyCapture') {
            this.isCreateMode = true;
        }
        if (this.route.snapshot.data.formId === 'CounterPartyDisplay') {
            this.isViewMode = true;
            this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
            this.captureCounterpartyFormGroup.disable();
        }
        if (this.route.snapshot.data.formId === 'CounterPartyEdit') {
            this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
            this.isEditMode = true;
        }
        if (this.counterPartyId && this.counterPartyId > 0) {
            if (!this.isViewMode) {
                this.titleService.setTitle("Counterparty Edit");
            }
            else {
                this.titleService.setTitle("Counterparty View");
            }
            this.masterDataService
                .getCounterpartyById(this.counterPartyId)
                .subscribe(function (data) {
                var counterparty = data;
                if (counterparty) {
                    _this.fillValues(counterparty);
                }
            });
        }
        else {
            this.isLoading = false;
            this.titleService.setTitle("Capture Counterparty");
        }
        this.masterDataService
            .getMdmCategoryAccountTypeMapping()
            .subscribe(function (data) {
            _this.mappedData = data.value;
        });
        this.cdr.detectChanges();
    };
    CounterpartyCaptureComponent.prototype.fillValues = function (counterparty) {
        var _this = this;
        this.model = counterparty;
        this.headerComponent.accountRefCtrl.patchValue(this.model.counterpartyCode);
        this.headerComponent.accountTitleCtrl.patchValue(this.model.description);
        this.headerComponent.creationDateCtrl.patchValue(counterparty.createdDateTime.toDateString());
        this.headerComponent.createdByCtrl.patchValue(counterparty.createdBy);
        this.model.counterpartyCompanies.forEach(function (comp) {
            if (comp.companyId === _this.companyId) {
                _this.headerComponent.isDeactivated = comp.isDeactivated;
            }
        });
        if (counterparty.modifiedDateTime) {
            this.headerComponent.lastAmendedByCtrl.patchValue(counterparty.modifiedDateTime.toDateString());
            this.headerComponent.isShowLastAmendedBy = true;
            this.headerComponent.modifiedDateCtrl.patchValue(counterparty.modifiedBy);
        }
        this.model.associatedCompanies = this.model.counterpartyCompanies;
        this.mainTabComponent.informationCardComponent.populateValue(this.model);
        this.mainTabComponent.informationCardComponent.nameCtrl.patchValue(this.model.description);
        this.mainTabComponent.informationCardComponent.accountTypeCtrl.patchValue(this.model.accountTypeName);
        this.mainTabComponent.informationCardComponent.departmentCtrl.patchValue(this.model.departmentCode);
        this.mainTabComponent.informationCardComponent.departmentDescriptionCtrl.patchValue(this.model.departmentName);
        this.mainTabComponent.informationCardComponent.fiscalRegCtrl.patchValue(this.model.fiscalRegistrationNumber);
        this.updateRandomId(this.model);
        this.mainAddress = this.model.counterpartyAddresses.find(function (address) { return address.main; });
        if (!this.mainAddress && this.model.counterpartyAddresses && this.model.counterpartyAddresses.length > 0) {
            this.mainAddress = this.model.counterpartyAddresses[0];
        }
        if (this.mainAddress) {
            this.mainTabComponent.mainAddressCardComponent.populateValues(this.mainAddress);
            this.mainTabComponent.mainAddressCardComponent.addressTypeCodeCtrl.patchValue(this.mainAddress.addressTypeCode);
            this.mainTabComponent.mainAddressCardComponent.addressTypeNameCtrl.patchValue(this.mainAddress.addressTypeCode);
            this.mainTabComponent.mainAddressCardComponent.address1Ctrl.patchValue(this.mainAddress.address1);
            this.mainTabComponent.mainAddressCardComponent.address2Ctrl.patchValue(this.mainAddress.address2);
            this.mainTabComponent.mainAddressCardComponent.zipCodeCtrl.patchValue(this.mainAddress.zipCode);
            this.mainTabComponent.mainAddressCardComponent.cityCtrl.patchValue(this.mainAddress.city);
            this.mainTabComponent.mainAddressCardComponent.emailCtrl.patchValue(this.mainAddress.mail);
            this.mainTabComponent.mainAddressCardComponent.phoneNumberCtrl.patchValue(this.mainAddress.phoneNo);
            this.mainTabComponent.mainAddressCardComponent.faxNumberCtrl.patchValue(this.mainAddress.faxNo);
            this.mainTabComponent.mainAddressCardComponent.ldcRegionCtrl.patchValue(this.mainAddress.ldcRegionCode);
            this.mainTabComponent.mainAddressCardComponent.provinceCtrl.patchValue(this.model.provinceName);
            this.mainTabComponent.mainAddressCardComponent.countryCtrl.patchValue(this.model.countryName);
        }
        this.addressTabComponent.addressComponent.counterpartyAddresses = this.model.counterpartyAddresses;
        this.addressTabComponent.addressComponent.populateValue();
        this.contactTabComponent.contactCardComponent.contactData = this.model.counterpartyContacts;
        this.contactTabComponent.contactCardComponent.populateValue();
        this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData = this.model.counterpartyBankAccounts;
        if (this.model.counterpartyBankAccountIntermediaries) {
            if (this.model.counterpartyBankAccountIntermediaries[0]) {
                this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary1 = this.model.counterpartyBankAccountIntermediaries[0];
            }
            if (this.model.counterpartyBankAccountIntermediaries[1]) {
                this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary2 = this.model.counterpartyBankAccountIntermediaries[1];
            }
        }
        this.taxInfoTabComponent.counterpartyTaxes = this.model.counterpartyTaxes;
        this.taxInfoTabComponent.initTaxsGridRows();
        this.mainTabComponent.thirdSystemCodesCardComponent.populateValue(this.model);
        this.mainTabComponent.alternateMailingCardComponent.populateValue(this.model);
        this.mainTabComponent.customerDefaultCardComponent.populateContractTermValue(this.model);
        this.isLoading = false;
    };
    CounterpartyCaptureComponent.prototype.updateRandomId = function (model) {
        if (model) {
            var counter_1 = 1;
            if (model.counterpartyAddresses) {
                model.counterpartyAddresses.forEach(function (address) {
                    address.randomId = counter_1;
                    counter_1++;
                });
            }
            if (model.counterpartyContacts) {
                counter_1 = 1;
                model.counterpartyContacts.forEach(function (contact) {
                    contact.randomId = counter_1;
                    counter_1++;
                });
            }
            if (model.counterpartyBankAccounts) {
                counter_1 = 1;
                model.counterpartyBankAccounts.forEach(function (bankAccount) {
                    bankAccount.randomId = counter_1;
                    counter_1++;
                });
            }
        }
    };
    CounterpartyCaptureComponent.prototype.ngOnDestroy = function () {
    };
    CounterpartyCaptureComponent.prototype.onSaveButtonClicked = function () {
        var _this = this;
        this.saveInProgress = true;
        this.onValidationState = true;
        this.utilService.updateFormGroupValidity(this.captureCounterpartyFormGroup);
        if (this.captureCounterpartyFormGroup.pending) {
            this.captureCounterpartyFormGroup.statusChanges.subscribe(function () {
                if (_this.onValidationState) {
                    _this.onValidationState = false;
                    _this.handleSave();
                }
            });
        }
        else {
            this.onValidationState = false;
            this.handleSave();
        }
    };
    CounterpartyCaptureComponent.prototype.handleSave = function () {
        var _this = this;
        try {
            if (!this.headerComponent.formGroup.valid) {
                this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
                this.saveInProgress = false;
                return;
            }
            if (!this.mainTabComponent.formGroup.valid) {
                this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
                this.saveInProgress = false;
                return;
            }
            if (!this.taxInfoTabComponent.validate()) {
                this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
                this.saveInProgress = false;
                return;
            }
            if (!this.model) {
                this.model = new _shared_entities_counterparty_entity__WEBPACK_IMPORTED_MODULE_7__["Counterparty"]();
            }
            this.model.counterpartyAddresses = [];
            this.headerComponent.populateEntity(this.model);
            this.mainTabComponent.informationCardComponent.populateEntity(this.model);
            if (this.model.counterpartyCompanies.length == 0) {
                this.snackbarService.throwErrorSnackBar('please select the associated company.');
                this.saveInProgress = false;
                return;
            }
            this.mainTabComponent.mainAddressCardComponent.updateEntity(this.model, this.mainAddress);
            this.mainTabComponent.customerDefaultCardComponent.populateEntity(this.model);
            this.mainTabComponent.alternateMailingCardComponent.populateEntity(this.model);
            this.mainTabComponent.thirdSystemCodesCardComponent.populateEntity(this.model);
            if (this.addressTabComponent.addressComponent.counterpartyAddresses && this.addressTabComponent.addressComponent.counterpartyAddresses.length > 0) {
                var counter_2 = 0;
                this.addressTabComponent.addressComponent.counterpartyAddresses.forEach(function (address) {
                    if (_this.model.counterpartyAddresses.find(function (add) { return add.addressId == address.addressId &&
                        add.randomId == address.randomId && !address.isDeactivated; })) {
                        if (address.main) {
                            _this.counterpartyAddresses[counter_2] = _this.model.counterpartyAddresses[0];
                        }
                        else {
                            _this.model.counterpartyAddresses[0].main = false;
                            _this.counterpartyAddresses[counter_2] = _this.model.counterpartyAddresses[0];
                        }
                    }
                    else {
                        _this.counterpartyAddresses.push(address);
                    }
                    counter_2++;
                });
                this.model.counterpartyAddresses = this.counterpartyAddresses;
            }
            this.model.counterpartyContacts = this.contactTabComponent.contactCardComponent.contactData;
            this.model.counterpartyBankAccounts = this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData;
            if (this.model.counterpartyBankAccounts && this.model.counterpartyBankAccounts.length > 0) {
                this.model.counterpartyBankAccountIntermediaries = [];
                this.model.counterpartyBankAccountIntermediaries.push(this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary1);
                this.model.counterpartyBankAccountIntermediaries.push(this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary2);
            }
            else {
                this.model.counterpartyBankAccountIntermediaries = [];
            }
            this.model.counterpartyTaxes = this.taxInfoTabComponent.counterpartyTaxes;
            this.updateCounerpartyId(this.model);
            this.subscriptions.push(this.masterDataService
                .addOrUpdateCounterparty(this.model)
                .subscribe(function (data) {
                if (data) {
                    _this.saveInProgress = false;
                    if (_this.isCreateMode) {
                        _this.snackbarService.informationSnackBar('Counterparty has been created successfully.');
                    }
                    else if (_this.isEditMode) {
                        _this.snackbarService.informationSnackBar('Counterparty has been updated successfully.');
                    }
                    _this.goToCounterPartyDetails(data[0]);
                }
                else {
                    _this.saveInProgress = false;
                }
            }, function (err) {
                _this.saveInProgress = false;
                console.error(err);
                _this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
            }));
        }
        catch (ex) {
            this.saveInProgress = false;
            console.error(ex);
        }
    };
    CounterpartyCaptureComponent.prototype.updateCounerpartyId = function (model) {
        var _this = this;
        if (model.counterpartyID) {
            if (model.counterpartyAccountTypes) {
                model.counterpartyAccountTypes.forEach(function (obj) {
                    obj.counterpartyID = model.counterpartyID;
                });
            }
            if (model.counterpartyCompanies) {
                model.counterpartyCompanies.forEach(function (obj) {
                    obj.counterpartyId = model.counterpartyID;
                    if (obj.companyId === _this.companyId) {
                        obj.c2CCode = model.c2CCode;
                        obj.isDeactivated = model.isDeactivated;
                    }
                });
                model.isDeactivated = false;
                model.c2CCode = '';
            }
            if (model.counterpartyContacts) {
                model.counterpartyContacts.forEach(function (obj) {
                    obj.counterpartyId = model.counterpartyID;
                    obj.main = obj.isFavorite;
                });
            }
            if (model.counterpartyAddresses) {
                model.counterpartyAddresses.forEach(function (obj) {
                    obj.counterpartyId = model.counterpartyID;
                    obj.main = obj.main;
                });
            }
            if (model.counterpartyBankAccounts) {
                model.counterpartyBankAccounts.forEach(function (obj) {
                    obj.counterpartyId = model.counterpartyID;
                });
            }
            if (model.counterpartyTaxes) {
                model.counterpartyTaxes.forEach(function (obj) {
                    obj.counterpartyId = model.counterpartyID;
                });
            }
            if (model.counterpartyMdmCategory) {
                model.counterpartyMdmCategory.forEach(function (obj) {
                    obj.counterpartyID = model.counterpartyID;
                });
            }
        }
    };
    CounterpartyCaptureComponent.prototype.OnSaveMethodCalled = function () {
        this.onSaveButtonClicked();
    };
    CounterpartyCaptureComponent.prototype.onLocalViewModeCalled = function (event) {
        var _this = this;
        if (event && event.value && event.value === "Local") {
            if (this.model.associatedCompanies && this.model.associatedCompanies.length > 0) {
                var company = this.model.associatedCompanies.find(function (c) { return c.companyName == _this.company; });
                if (company) {
                    this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue(company.c2CCode);
                }
                else {
                    this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue('');
                }
            }
            else {
                this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue('');
            }
        }
        else {
            this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue('');
        }
        if (event && event.value && event.value === "Local" &&
            this.isEditMode && this.isEditExceptionPrivilege) {
            this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.enable();
            this.mainTabComponent.informationCardComponent.departmentCtrl.enable();
            this.headerComponent.isLocalViewMode = true;
        }
        else {
            this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.disable();
            this.mainTabComponent.informationCardComponent.departmentCtrl.disable();
            this.headerComponent.isLocalViewMode = false;
        }
    };
    CounterpartyCaptureComponent.prototype.goToCounterPartyDetails = function (counterPartyId) {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                '/referential/counterparty/display', counterPartyId]);
    };
    CounterpartyCaptureComponent.prototype.onCancelButtonClicked = function () {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                '/referential/tradeexecution/counterparties']);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('headerComponent'),
        __metadata("design:type", _counterparty_header_counterparty_header_component__WEBPACK_IMPORTED_MODULE_16__["CounterpartyHeaderComponent"])
    ], CounterpartyCaptureComponent.prototype, "headerComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('menuComponent'),
        __metadata("design:type", _counterparty_management_menu_bar_counterparty_management_menu_bar_component__WEBPACK_IMPORTED_MODULE_23__["CounterpartyManagementMenuBarComponent"])
    ], CounterpartyCaptureComponent.prototype, "menuComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('mainTabComponent'),
        __metadata("design:type", _main_tab_counterparty_capture_form_main_tab_component__WEBPACK_IMPORTED_MODULE_8__["CounterpartyCaptureFormMainTabComponent"])
    ], CounterpartyCaptureComponent.prototype, "mainTabComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('addressTabComponent'),
        __metadata("design:type", _address_tab_counterparty_capture_form_address_tab_component__WEBPACK_IMPORTED_MODULE_9__["CounterpartyCaptureFormAddressTabComponent"])
    ], CounterpartyCaptureComponent.prototype, "addressTabComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('contactTabComponent'),
        __metadata("design:type", _contact_tab_counterparty_capture_form_contact_tab_component__WEBPACK_IMPORTED_MODULE_10__["CounterpartyCaptureFormContactTabComponent"])
    ], CounterpartyCaptureComponent.prototype, "contactTabComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('bankAccountTabComponent'),
        __metadata("design:type", _bank_account_tab_counterparty_capture_form_bank_account_tab_component__WEBPACK_IMPORTED_MODULE_11__["CounterpartyCaptureFormBankAccountTabComponent"])
    ], CounterpartyCaptureComponent.prototype, "bankAccountTabComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('taxInfoTabComponent'),
        __metadata("design:type", _tax_info_tab_counterparty_capture_form_tax_info_tab_component__WEBPACK_IMPORTED_MODULE_12__["CounterpartyCaptureFormTaxInfoTabComponent"])
    ], CounterpartyCaptureComponent.prototype, "taxInfoTabComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('reportTabComponent'),
        __metadata("design:type", _report_tab_counterparty_capture_form_report_tab_component__WEBPACK_IMPORTED_MODULE_13__["CounterpartyCaptureFormReportTabComponent"])
    ], CounterpartyCaptureComponent.prototype, "reportTabComponent", void 0);
    CounterpartyCaptureComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture',
            template: __webpack_require__(/*! ./counterparty-capture.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_15__["FormConfigurationProviderService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_2__["TitleService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialog"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_5__["MasterdataService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_17__["UtilService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_18__["CompanyManagerService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_19__["SnackbarService"],
            _shared_services_security_service__WEBPACK_IMPORTED_MODULE_20__["SecurityService"], _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_21__["AuthorizationService"]])
    ], CounterpartyCaptureComponent);
    return CounterpartyCaptureComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_14__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.html":
/*!**************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.html ***!
  \**************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"header-background\">\r\n    <div class=\"header-content\">\r\n        <div [formGroup]=\"headerFormGroup\">\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start center\"\r\n                 fxLayoutGap=\"1px\">\r\n                <h2>\r\n                    <atlas-form-input fxFlex=\"90%\"\r\n                                      [fieldControl]=\"accountRefCtrl\"\r\n                                      [errorMap]=\"accountrefErrorMap\"\r\n                                      [isEditable]=\"true\"\r\n                                      [required]=\"accountRefCtrl.isRequired\"\r\n                                      label=\"Account Ref\">\r\n                    </atlas-form-input>\r\n                    <h1> : </h1>\r\n                    <atlas-form-input fxFlex=\"320px\"\r\n                                      [fieldControl]=\"accountTitleCtrl\"\r\n                                      [isEditable]=\"true\"\r\n                                      [required]=\"accountTitleCtrl.isRequired\"\r\n                                      label=\"Account Title\">\r\n                    </atlas-form-input>\r\n                </h2>\r\n                <mat-button-toggle-group class=\"toggle-group\"\r\n                                         aria-label=\"Date\"\r\n                                         selected\r\n                                         disabled>\r\n                    <mat-button-toggle [value]=\"0\"\r\n                                       [checked]=\"!isDeactivated\">Active</mat-button-toggle>\r\n                    <mat-button-toggle [value]=\"1\"\r\n                                       [checked]=\"isDeactivated\">Inactive</mat-button-toggle>\r\n                </mat-button-toggle-group>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start end\"\r\n                 fxLayoutGap=\"16px\">\r\n                <atlas-form-input fxFlex=\"20%\"\r\n                                  [fieldControl]=\"createdByCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Created By\">\r\n                </atlas-form-input>\r\n                <atlas-form-input fxFlex=\"20%\"\r\n                                  [fieldControl]=\"creationDateCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"On\">\r\n                </atlas-form-input>\r\n                <atlas-form-input *ngIf=\"isShowLastAmendedBy\"\r\n                                  fxFlex=\"20%\"\r\n                                  [fieldControl]=\"lastAmendedByCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Last Amended By\">\r\n                </atlas-form-input>\r\n                <atlas-form-input *ngIf=\"isShowLastAmendedBy\"\r\n                                  fxFlex=\"20%\"\r\n                                  [fieldControl]=\"modifiedDateCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"On\">\r\n                </atlas-form-input>\r\n\r\n                <mat-button-toggle-group fxLayoutAlign=\"start end\"\r\n                                         *ngIf=\"isLocalViewMode\"\r\n                                         aria-label=\"Date\"\r\n                                         (change)='onStatusChanged($event.value)'>\r\n                    <mat-button-toggle [value]=\"0\"\r\n                                       [checked]=\"!isDeactivated\">Activate</mat-button-toggle>\r\n                    <mat-button-toggle [value]=\"1\"\r\n                                       [checked]=\"isDeactivated\">Deactivate</mat-button-toggle>\r\n                </mat-button-toggle-group>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</header>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.scss":
/*!**************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.scss ***!
  \**************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host ::ng-deep .mat-form-field-appearance-legacy .mat-form-field-infix {\n  margin-right: -1px !important; }\n\n:host ::ng-deep .mat-input-element:disabled {\n  color: rgba(0, 0, 0, 0.87) !important;\n  font-weight: bolder; }\n\n:host ::ng-deep .mat-chip.mat-standard-chip.mat-chip-selected.mat-chip.mat-standard-chip {\n  background-color: #009cb9;\n  color: white;\n  margin-left: 10% !important; }\n\n:host ::ng-deep .mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline {\n  background-image: linear-gradient(to right, #fefcfe 0%, #fefcfe 33%, transparent 0%);\n  background-size: 4px 100%;\n  background-repeat: repeat-x; }\n\n:host ::ng-deep .mat-form-field-flex {\n  margin-right: -60px !important; }\n\n:host ::ng-deep h1 {\n  font-size: 1.4em !important;\n  margin-left: -20px !important;\n  margin-right: 10px !important;\n  margin-bottom: 27px !important; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.ts":
/*!************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.ts ***!
  \************************************************************************************************************************************************/
/*! exports provided: CounterpartyHeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyHeaderComponent", function() { return CounterpartyHeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../.././../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../.././../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../.././../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
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





var CounterpartyHeaderComponent = /** @class */ (function (_super) {
    __extends(CounterpartyHeaderComponent, _super);
    function CounterpartyHeaderComponent(formBuilder, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.accountRefCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('AccountRef');
        _this.accountTitleCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('AccountTitle');
        _this.createdByCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('CreatedBy');
        _this.creationDateCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('CreationDate');
        _this.lastAmendedByCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('LastAmendedBy');
        _this.modifiedDateCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('ModifiedDate');
        _this.counterpartyStatusCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_2__["AtlasFormControl"]('counterpartyStatus');
        _this.isDeactivated = false;
        _this.isEditMode = false;
        _this.isLocalViewMode = false;
        _this.isAdmin = false;
        _this.isShowLastAmendedBy = true;
        _this.accountrefErrorMap = new Map()
            .set('required', 'Required*')
            .set('maxlength', 'Maximum 10 charcters Allowed');
        return _this;
    }
    CounterpartyHeaderComponent.prototype.ngOnInit = function () {
        if (this.isEditMode && this.isAdmin) {
            this.isLocalViewMode = true;
        }
        this.headerFormGroup = this.formBuilder.group({
            accountRefCtrl: this.accountRefCtrl,
            accountTitleCtrl: this.accountTitleCtrl,
            createdByCtrl: this.createdByCtrl,
            creationDateCtrl: this.creationDateCtrl,
            lastAmendedByCtrl: this.lastAmendedByCtrl,
            modifiedDateCtrl: this.modifiedDateCtrl
        });
        this.accountTitleCtrl.disable();
        this.createdByCtrl.disable();
        this.creationDateCtrl.disable();
        this.lastAmendedByCtrl.disable();
        this.modifiedDateCtrl.disable();
        if (this.isEditMode) {
            this.createdByCtrl.disable();
            this.creationDateCtrl.disable();
        }
        else {
            this.isLocalViewMode = true;
        }
        this.isLocalViewMode = false;
        this.setValidators();
        this.isShowLastAmendedBy = (this.lastAmendedByCtrl.value) ? true : false;
    };
    CounterpartyHeaderComponent.prototype.setValidators = function () {
        this.accountRefCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(10)]));
        this.formGroup.updateValueAndValidity();
    };
    CounterpartyHeaderComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            accountRefCtrl: this.accountRefCtrl,
            accountTitleCtrl: this.accountTitleCtrl,
            createdByCtrl: this.createdByCtrl,
            creationDateCtrl: this.creationDateCtrl,
            lastAmendedByCtrl: this.lastAmendedByCtrl,
            modifiedDateCtrl: this.modifiedDateCtrl
        });
        return _super.prototype.getFormGroup.call(this);
    };
    CounterpartyHeaderComponent.prototype.onStatusChanged = function (event) {
        this.isDeactivated = (Number(event) == 0) ? false : true;
    };
    CounterpartyHeaderComponent.prototype.populateEntity = function (model) {
        model.counterpartyCode = this.accountRefCtrl.value;
        // model.createdBy = this.createdByCtrl.value;
        // model.createdDateTime = this.creationDateCtrl.value;
        model.isDeactivated = this.isDeactivated;
    };
    CounterpartyHeaderComponent.prototype.ngOnDestroy = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyHeaderComponent.prototype, "isEditMode", void 0);
    CounterpartyHeaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-header',
            template: __webpack_require__(/*! ./counterparty-header.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-header.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"]])
    ], CounterpartyHeaderComponent);
    return CounterpartyHeaderComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_1__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.html":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.html ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar class=\"menu-bar mat-elevation-z6\">\r\n    <div class=\"toolbar-div\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start center\"\r\n             fxFlex=\"100\"\r\n             fxLayoutGap=\"100px\">\r\n            <mat-button-toggle-group class=\"toggle-group toggle-button-counterparty\"\r\n                                     (change)=\"onViewModeChanged($event)\"\r\n                                     aria-label=\"Contract Type\"\r\n                                     [value]=\"selectedCounterpartyDisplayVal\">\r\n                <mat-button-toggle value=\"Global\"\r\n                                   [checked]=\"true\">\r\n                    Global View Mode\r\n                </mat-button-toggle>\r\n                <mat-button-toggle value=\"Local\">\r\n                    Local View Mode\r\n                </mat-button-toggle>\r\n                <mat-button-toggle [matMenuTriggerFor]=\"reports\"\r\n                                   value=\"Local\">\r\n                    Reports\r\n                </mat-button-toggle>\r\n                <mat-menu #reports=\"matMenu\"\r\n                          [overlapTrigger]=\"false\"\r\n                          xPosition=\"after\">\r\n                    <span *ngFor=\"let item of filteredTemplates\">\r\n                        <button mat-button\r\n                                (click)=\"OnReportClick(item)\">\r\n                            {{item.name}}\r\n                        </button>\r\n                    </span>\r\n                </mat-menu>\r\n            </mat-button-toggle-group>\r\n        </div>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"end end\"\r\n             fxFlex=\"100\"\r\n             fxLayoutGap=\"100px\">\r\n            <a (click)=\"onDiscardButtonClicked()\"\r\n               *ngIf=\"!isViewMode\"\r\n               matTooltip=\"Discard the changes\"\r\n               class=\"menu-bar-action-icon\">\r\n                <mat-icon class=\"white-icon\">backspace</mat-icon>\r\n            </a>\r\n\r\n            <a (click)=\"onSaveCounterPartyButtonClicked()\"\r\n               *ngIf=\"!isViewMode || isCreateMode\"\r\n               matTooltip=\"Save the Counterparty\"\r\n               class=\"menu-bar-action-icon\">\r\n                <mat-icon class=\"white-icon\">save</mat-icon>\r\n            </a>\r\n\r\n            <a (click)=\"onEditCounterPartyButtonClicked()\"\r\n               *ngIf=\"isViewMode && isEditCounterpartyPrivilege && !isCreateMode\"\r\n               matTooltip=\"Edit the Counterparty\"\r\n               class=\"menu-bar-action-icon\">\r\n                <mat-icon>create</mat-icon>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</mat-toolbar>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.scss":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.scss ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-toolbar {\n  height: 56px !important;\n  background-color: white !important; }\n\n:host ::ng-deep .mat-toolbar.mat-toolbar .mat-icon {\n  margin-top: 7px !important; }\n\n:host ::ng-deep .menu-bar .menu-bar-action-icon {\n  margin: 7px !important; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.ts":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.ts ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: CounterpartyManagementMenuBarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyManagementMenuBarComponent", function() { return CounterpartyManagementMenuBarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_generic_report_viewer_generic_report_viewer_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/components/generic-report-viewer/generic-report-viewer.component */ "./Client/app/shared/components/generic-report-viewer/generic-report-viewer.component.ts");
/* harmony import */ var _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/services/http-services/document.service */ "./Client/app/shared/services/http-services/document.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CounterpartyManagementMenuBarComponent = /** @class */ (function () {
    function CounterpartyManagementMenuBarComponent(route, router, companyManager, documentService, dialog) {
        this.route = route;
        this.router = router;
        this.companyManager = companyManager;
        this.documentService = documentService;
        this.dialog = dialog;
        this.isEditCounterpartyPrivilege = false;
        this.isCreateMode = false;
        this.isViewMode = false;
        this.localViewMode = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.saveMethod = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isAdmin = false;
        this.selectedCounterpartyDisplayVal = true;
        this.filteredTemplates = new Array();
    }
    CounterpartyManagementMenuBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.counterpartyID = Number(this.route.snapshot.paramMap.get('counterpartyID'));
        var documentType = 76;
        this.documentService.getTemplates(documentType, 'Counterparties').subscribe(function (templates) {
            _this.filteredTemplates = templates.value;
        });
    };
    CounterpartyManagementMenuBarComponent.prototype.onEditCounterPartyButtonClicked = function () {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/edit', this.counterpartyID]);
    };
    CounterpartyManagementMenuBarComponent.prototype.onDiscardButtonClicked = function () {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/display', this.counterpartyID]);
    };
    CounterpartyManagementMenuBarComponent.prototype.onSaveCounterPartyButtonClicked = function () {
        this.saveMethod.emit(true);
    };
    CounterpartyManagementMenuBarComponent.prototype.OnReportClick = function (data) {
        var openTradepnlReportDialog = this.dialog.open(_shared_components_generic_report_viewer_generic_report_viewer_component__WEBPACK_IMPORTED_MODULE_4__["GenericReportViewerComponent"], {
            data: {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });
    };
    CounterpartyManagementMenuBarComponent.prototype.onViewModeChanged = function (event) {
        if (!this.isAdmin) {
            this.localViewMode.emit(event);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyManagementMenuBarComponent.prototype, "isCreateMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyManagementMenuBarComponent.prototype, "isViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyManagementMenuBarComponent.prototype, "localViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], CounterpartyManagementMenuBarComponent.prototype, "saveMethod", void 0);
    CounterpartyManagementMenuBarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-management-menu-bar',
            template: __webpack_require__(/*! ./counterparty-management-menu-bar.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-management-menu-bar.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"],
            _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_5__["DocumentService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"]])
    ], CounterpartyManagementMenuBarComponent);
    return CounterpartyManagementMenuBarComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.html":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.html ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Alternate Mailing Address</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\">\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input style=\"margin-right: 10px;\"\r\n                                  fxFlex=\"40%\"\r\n                                  [fieldControl]=\"alternateMailingAdd1Ctrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  label=\"Alternate Email Address\">\r\n                </atlas-form-input>\r\n\r\n                <atlas-form-input fxFlex=\"40%\"\r\n                                  [fieldControl]=\"alternateMailingAdd2Ctrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  label=\"Alternate Email Address\">\r\n                </atlas-form-input>\r\n\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input style=\"margin-right: 10px;\"\r\n                                  fxFlex=\"40%\"\r\n                                  [fieldControl]=\"alternateMailingAdd3Ctrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  label=\"Alternate Email Address\">\r\n                </atlas-form-input>\r\n\r\n                <atlas-form-input fxFlex=\"40%\"\r\n                                  [fieldControl]=\"alternateMailingAdd4Ctrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  label=\"Alternate Email Address\">\r\n                </atlas-form-input>\r\n            </div>\r\n        </div>\r\n\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.scss":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.scss ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.ts":
/*!***************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.ts ***!
  \***************************************************************************************************************************************************************/
/*! exports provided: AlternateMailingCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlternateMailingCardComponent", function() { return AlternateMailingCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
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





var AlternateMailingCardComponent = /** @class */ (function (_super) {
    __extends(AlternateMailingCardComponent, _super);
    function AlternateMailingCardComponent(formBuilder, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.alternateMailingAdd1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AlternateMailingAddress1');
        _this.alternateMailingAdd2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AlternateMailingAddress2');
        _this.alternateMailingAdd3Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AlternateMailingAddress3');
        _this.alternateMailingAdd4Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AlternateMailingAddress4');
        _this.inputErrorMap = new Map();
        _this.inputErrorMap.set('email', 'Not a valid email');
        return _this;
    }
    AlternateMailingCardComponent.prototype.ngOnInit = function () {
        this.setValidators();
    };
    AlternateMailingCardComponent.prototype.setValidators = function () {
        this.alternateMailingAdd1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(160)]));
        this.alternateMailingAdd2Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(160)]));
        this.alternateMailingAdd3Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(160)]));
        this.alternateMailingAdd4Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(160)]));
    };
    AlternateMailingCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            alternateMailingAdd1Ctrl: this.alternateMailingAdd1Ctrl,
            alternateMailingAdd2Ctrl: this.alternateMailingAdd2Ctrl,
            alternateMailingAdd3Ctrl: this.alternateMailingAdd3Ctrl,
            alternateMailingAdd4Ctrl: this.alternateMailingAdd4Ctrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    AlternateMailingCardComponent.prototype.populateValue = function (model) {
        this.alternateMailingAdd1Ctrl.patchValue(model.alternateMailingAddress1);
        this.alternateMailingAdd2Ctrl.patchValue(model.alternateMailingAddress2);
        this.alternateMailingAdd3Ctrl.patchValue(model.alternateMailingAddress3);
        this.alternateMailingAdd4Ctrl.patchValue(model.alternateMailingAddress4);
    };
    AlternateMailingCardComponent.prototype.populateEntity = function (model) {
        model.alternateMailingAddress1 = this.alternateMailingAdd1Ctrl.value;
        model.alternateMailingAddress2 = this.alternateMailingAdd2Ctrl.value;
        model.alternateMailingAddress3 = this.alternateMailingAdd3Ctrl.value;
        model.alternateMailingAddress4 = this.alternateMailingAdd4Ctrl.value;
    };
    AlternateMailingCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-alternate-mailing-card',
            template: __webpack_require__(/*! ./alternate-mailing-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.html"),
            styles: [__webpack_require__(/*! ./alternate-mailing-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"], _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"]])
    ], AlternateMailingCardComponent);
    return AlternateMailingCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.html":
/*!******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.html ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\"\r\n     fxLayout=\"row\">\r\n    <main>\r\n        <div fxLayout=\"column\"\r\n             fxFlex=\"50%\"\r\n             style=\"padding-right: 28px\">\r\n\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start left\"\r\n                 fxFlex=\"57\">\r\n\r\n                <atlas-information-card #informationCardComponent\r\n                                        [isViewMode]=\"isViewMode\"\r\n                                        [isEditMode]=\"isEditMode\"\r\n                                        (selectedAccountTypesOptions)=\"onSelectedAccountTypesOptions($event)\">\r\n                </atlas-information-card>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start right\"\r\n                 fxFlex=\"50\">\r\n                <atlas-third-system-codes-card #thirdSystemCodesCardComponent\r\n                                               [isEditMode]=\"isEditMode\"\r\n                                               (selectedMdmCodesOptions)=\"onSelectedMdmCodesOptions($event)\">\r\n                </atlas-third-system-codes-card>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start right\"\r\n                 fxFlex=\"50\">\r\n\r\n                <atlas-alternate-mailing-card #alternateMailingCardComponent></atlas-alternate-mailing-card>\r\n\r\n            </div>\r\n        </div>\r\n\r\n        <div fxLayout=\"column\"\r\n             fxLayout.md=\"column\"\r\n             fxFlex=\"50%\"\r\n             fxLayoutAlign=\"space-around start\"\r\n             class='charter-creation-margin'>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start left\"\r\n                 fxFlex=\"100%\">\r\n                <atlas-main-address-card #mainAddressCardComponent></atlas-main-address-card>\r\n            </div>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"start right\"\r\n                 fxFlex=\"100%\">\r\n                <atlas-customer-default-card #customerDefaultCardComponent></atlas-customer-default-card>\r\n            </div>\r\n        </div>\r\n    </main>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.scss":
/*!******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.scss ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host ::ng-deep .mat-card {\n  width: 500px !important; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.ts":
/*!****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.ts ***!
  \****************************************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureFormMainTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureFormMainTabComponent", function() { return CounterpartyCaptureFormMainTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _information_card_information_card_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./information-card/information-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.ts");
/* harmony import */ var _main_address_card_main_address_card_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main-address-card/main-address-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.ts");
/* harmony import */ var _customer_default_card_customer_default_card_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./customer-default-card/customer-default-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.ts");
/* harmony import */ var _third_system_codes_card_third_system_codes_card_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./third-system-codes-card/third-system-codes-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.ts");
/* harmony import */ var _alternate_mailing_card_alternate_mailing_card_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./alternate-mailing-card/alternate-mailing-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
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










var CounterpartyCaptureFormMainTabComponent = /** @class */ (function (_super) {
    __extends(CounterpartyCaptureFormMainTabComponent, _super);
    function CounterpartyCaptureFormMainTabComponent(route, formBuilder, formConfigurationProvider) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.isViewMode = false;
        _this.isEditMode = false;
        _this.mappedData = [];
        return _this;
    }
    CounterpartyCaptureFormMainTabComponent.prototype.ngOnInit = function () {
        this.masterdata = this.route.snapshot.data.masterdata;
    };
    CounterpartyCaptureFormMainTabComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            informationCardComponent: this.informationCardComponent.getFormGroup(),
            mainAddressCardComponent: this.mainAddressCardComponent.getFormGroup(),
            thirdSystemCodesCardComponent: this.thirdSystemCodesCardComponent.getFormGroup(),
            alternateMailingCardComponent: this.alternateMailingCardComponent.getFormGroup(),
            customerDefaultCardComponent: this.customerDefaultCardComponent.getFormGroup(),
        });
        return _super.prototype.getFormGroup.call(this);
    };
    CounterpartyCaptureFormMainTabComponent.prototype.onSelectedAccountTypesOptions = function (event) {
        var _this = this;
        var selectedCodes = [];
        var selected = event;
        this.mappedData.forEach(function (accountType) {
            selected.forEach(function (accType) {
                if (accType.accountTypeId == accountType.accountTypeID) {
                    var code = selectedCodes.find((function (c) { return c.mdmCategoryID == accountType.mdmCategoryID; }));
                    if (!code) {
                        var mdmCategory = {};
                        mdmCategory.mdmCategoryID = accountType.mdmCategoryID;
                        selectedCodes.push(mdmCategory);
                    }
                }
            });
        });
        this.filteredMdmCategories = [];
        selectedCodes.forEach(function (obj) {
            var mdmCode = _this.masterdata.mdmCategories.find(function (c) { return c.mdmCategoryId === obj.mdmCategoryID; });
            if (mdmCode) {
                _this.filteredMdmCategories.push(mdmCode);
            }
        });
        this.thirdSystemCodesCardComponent.mdmCategoryCodeCtrl.patchValue(this.filteredMdmCategories);
    };
    CounterpartyCaptureFormMainTabComponent.prototype.onSelectedMdmCodesOptions = function (event) {
        var _this = this;
        var selectedAccountTypes = [];
        var selected = event;
        this.mappedData.forEach(function (mdmCodes) {
            selected.forEach(function (mdmCode) {
                if (mdmCode.mdmCategoryId == mdmCodes.mdmCategoryID) {
                    var code = selectedAccountTypes.find((function (c) { return c.accountTypeId == mdmCodes.accountTypeID; }));
                    if (!code) {
                        var accountTypeObj = {};
                        accountTypeObj.accountTypeId = mdmCodes.accountTypeID;
                        selectedAccountTypes.push(accountTypeObj);
                    }
                }
            });
        });
        this.filteredAccountTypes = [];
        selectedAccountTypes.forEach(function (obj) {
            var accType = _this.masterdata.accountTypes.find(function (c) { return c.accountTypeId === obj.accountTypeId; });
            if (accType) {
                _this.filteredAccountTypes.push(accType);
            }
        });
        this.informationCardComponent.accountTypeCtrl.patchValue(this.filteredAccountTypes);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('informationCardComponent'),
        __metadata("design:type", _information_card_information_card_component__WEBPACK_IMPORTED_MODULE_1__["InformationCardComponent"])
    ], CounterpartyCaptureFormMainTabComponent.prototype, "informationCardComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('mainAddressCardComponent'),
        __metadata("design:type", _main_address_card_main_address_card_component__WEBPACK_IMPORTED_MODULE_2__["MainAddressCardComponent"])
    ], CounterpartyCaptureFormMainTabComponent.prototype, "mainAddressCardComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('thirdSystemCodesCardComponent'),
        __metadata("design:type", _third_system_codes_card_third_system_codes_card_component__WEBPACK_IMPORTED_MODULE_4__["ThirdSystemCodesCardComponent"])
    ], CounterpartyCaptureFormMainTabComponent.prototype, "thirdSystemCodesCardComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('alternateMailingCardComponent'),
        __metadata("design:type", _alternate_mailing_card_alternate_mailing_card_component__WEBPACK_IMPORTED_MODULE_5__["AlternateMailingCardComponent"])
    ], CounterpartyCaptureFormMainTabComponent.prototype, "alternateMailingCardComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('customerDefaultCardComponent'),
        __metadata("design:type", _customer_default_card_customer_default_card_component__WEBPACK_IMPORTED_MODULE_3__["CustomerDefaultCardComponent"])
    ], CounterpartyCaptureFormMainTabComponent.prototype, "customerDefaultCardComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormMainTabComponent.prototype, "isViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormMainTabComponent.prototype, "isEditMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], CounterpartyCaptureFormMainTabComponent.prototype, "mappedData", void 0);
    CounterpartyCaptureFormMainTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture-form-main-tab',
            template: __webpack_require__(/*! ./counterparty-capture-form-main-tab.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture-form-main-tab.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormBuilder"], _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationProviderService"]])
    ], CounterpartyCaptureFormMainTabComponent);
    return CounterpartyCaptureFormMainTabComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_6__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.html":
/*!***************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.html ***!
  \***************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Customer's Default</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <div fxFlex=\"50%\">\r\n                <atlas-masterdata-user-preferences-input class=\"contextual-search-for-contract-terms\"\r\n                                                         isEditable=\"true\"\r\n                                                         [fieldControl]=\"contractTermsCtrl\"\r\n                                                         label=\"Contract Terms\"\r\n                                                         [options]=\"filteredContractTerms\"\r\n                                                         displayProperty=\"contractTermCode\"\r\n                                                         [selectProperties]=\"['contractTermCode', 'description']\"\r\n                                                         lightBoxTitle=\"Results for Contract Terms\"\r\n                                                         gridId=\"contractTermsGrid\">\r\n                </atlas-masterdata-user-preferences-input>\r\n            </div>\r\n\r\n            <div fxFlex=\"50%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"Introductory Brocker\"\r\n                           [formControl]=\"introductoryBrockerCtrl\">\r\n                    <mat-error *ngIf=\"introductoryBrockerCtrl.hasError('maxlength')\">\r\n                        Maximum 160 charcters Allowed\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.scss":
/*!***************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.scss ***!
  \***************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.ts":
/*!*************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.ts ***!
  \*************************************************************************************************************************************************************/
/*! exports provided: CustomerDefaultCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomerDefaultCardComponent", function() { return CustomerDefaultCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
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










var CustomerDefaultCardComponent = /** @class */ (function (_super) {
    __extends(CustomerDefaultCardComponent, _super);
    function CustomerDefaultCardComponent(formBuilder, formConfigurationProvider, utilService, route, masterdataService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.utilService = utilService;
        _this.route = route;
        _this.masterdataService = masterdataService;
        _this.contractTermsCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('contractTermsCtrl');
        _this.introductoryBrockerCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('introductoryBrockerCtrl');
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__["MasterDataProps"].ContractTerms
        ];
        return _this;
    }
    CustomerDefaultCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.filteredContractTerms = _this.masterdata.contractTerms;
            _this.contractTermsCtrl.valueChanges.subscribe(function (input) {
                _this.filteredContractTerms = _this.utilService.filterListforAutocomplete(input, _this.masterdata.contractTerms, ['contractTermCode', 'description']);
            });
            _this.setValidators();
        });
    };
    CustomerDefaultCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            contractTermsCtrl: this.contractTermsCtrl,
            introductoryBrockerCtrl: this.introductoryBrockerCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    CustomerDefaultCardComponent.prototype.setValidators = function () {
        this.contractTermsCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_8__["inDropdownListValidator"])(this.masterdata.contractTerms, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('contractTermCode')),
        ]));
        this.introductoryBrockerCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(160)]));
    };
    CustomerDefaultCardComponent.prototype.populateEntity = function (model) {
        model.contractTermId = (this.contractTermsCtrl.value) ? this.contractTermsCtrl.value.contractTermId : null;
        model.introductoryBrocker = this.introductoryBrockerCtrl.value;
    };
    CustomerDefaultCardComponent.prototype.populateContractTermValue = function (model) {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredContractTerms = this.masterdata.contractTerms;
        if (model.contractTermId) {
            this.contractTermControl = this.filteredContractTerms.find(function (contractTerm) { return contractTerm.contractTermId === model.contractTermId; });
            this.contractTermsCtrl.patchValue(this.contractTermControl);
        }
        if (model.introductoryBrocker) {
            this.introductoryBrockerCtrl.patchValue(model.introductoryBrocker);
        }
    };
    CustomerDefaultCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-customer-default-card',
            template: __webpack_require__(/*! ./customer-default-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.html"),
            styles: [__webpack_require__(/*! ./customer-default-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__["UtilService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_6__["MasterdataService"]])
    ], CustomerDefaultCardComponent);
    return CustomerDefaultCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.html":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.html ***!
  \*****************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Associate Counterparties To Company</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\">\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-dropdown-select-list fxFlex='50%'\r\n                                            fxLayout=\"row\"\r\n                                            fxLayoutAlign=\"start left\"\r\n                                            label=\"Available Companies\"\r\n                                            [fieldControl]=\"counterpartyCompaniesCtrl\"\r\n                                            isEditable=\"false\"\r\n                                            [readonly]=\"true\"\r\n                                            [(options)]=\"counterpartCompanyList\"\r\n                                            isEditable=true\r\n                                            [selectProperties]=\"counterpartyCompany\"\r\n                                            (optionSelected)=\"optionSelected($event)\"\r\n                                            [defaultSelected]=\"matrixData\"\r\n                                            multiselect=true>\r\n                </atlas-dropdown-select-list>\r\n                <atlas-dropdown-select-list fxLayout=\"row\"\r\n                                            fxLayoutAlign=\"start end\"\r\n                                            fxFlex='50%'\r\n                                            label=\"Associated Companies\"\r\n                                            [fieldControl]=\"counterpartyAssociateCompanyCtrl\"\r\n                                            isEditable=\"false\"\r\n                                            [readonly]=\"true\"\r\n                                            [(options)]=\"associateCompany\"\r\n                                            isEditable=true\r\n                                            selected=\"true\"\r\n                                            [selectProperties]=\"counterpartyAssociate\"\r\n                                            [defaultSelected]=\"associateCompany\"\r\n                                            [checked]=\"true\"\r\n                                            multiselect=true>\r\n                </atlas-dropdown-select-list>\r\n            </div>\r\n        </div>\r\n        <div class=\"btn-container\">\r\n            <div fxFlex=\"50\"\r\n                 fxLayout=\"row\"\r\n                 fxAlignLayout=\"start start\">\r\n                <button mat-button\r\n                        type=\"button\"\r\n                        (click)=\"onCancelButtonClicked()\">\r\n                    cancel\r\n                </button>\r\n            </div>\r\n            <div fxFlex=\"50\"\r\n                 fxLayout=\"row\"\r\n                 fxAlignLayout=\"start end\">\r\n                <span class=\"fill-space\"></span>\r\n                <button mat-raised-button\r\n                        type=\"button\"\r\n                        (click)=\"onSaveButtonClicked()\">\r\n                    save\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.scss":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.scss ***!
  \*****************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.ts":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.ts ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: AssociatedCounterpartiesCompanyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssociatedCounterpartiesCompanyComponent", function() { return AssociatedCounterpartiesCompanyComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
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








var AssociatedCounterpartiesCompanyComponent = /** @class */ (function (_super) {
    __extends(AssociatedCounterpartiesCompanyComponent, _super);
    function AssociatedCounterpartiesCompanyComponent(thisDialogRef, data, formConfigurationProvider, masterdataService, formBuilder) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.thisDialogRef = thisDialogRef;
        _this.data = data;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.masterdataService = masterdataService;
        _this.formBuilder = formBuilder;
        _this.counterpartyCompaniesCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('CounterpartyCompany');
        _this.counterpartyAssociateCompanyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('CounterpartyAssociateCompany');
        _this.counterpartCompanyList = [];
        _this.filteredCompany = [];
        _this.associateCompany = [];
        _this.counterpartyCompany = ['companyId'];
        _this.counterpartyAssociate = ['companyId'];
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].Companies
        ];
        _this.matrixData = [];
        return _this;
    }
    AssociatedCounterpartiesCompanyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.filteredCompany = _this.masterdata.companies;
            _this.counterpartCompanyList = _this.filteredCompany;
            _this.data.matrixData.forEach(function (row) {
                var availableCompany = _this.counterpartCompanyList.find(function (company) { return company.companyId === row.companyName; });
                _this.matrixData.push(availableCompany);
            });
        });
    };
    AssociatedCounterpartiesCompanyComponent.prototype.optionSelected = function (data) {
        var _this = this;
        this.associateCompany = [];
        data.forEach(function (element) {
            _this.associateCompany.push(element);
        });
    };
    AssociatedCounterpartiesCompanyComponent.prototype.onSaveButtonClicked = function () {
        this.thisDialogRef.close(this.associateCompany);
    };
    AssociatedCounterpartiesCompanyComponent.prototype.onCancelButtonClicked = function () {
        this.associateCompany = [];
        this.thisDialogRef.close('true');
    };
    AssociatedCounterpartiesCompanyComponent.prototype.getAssociatedCompanies = function () {
        return this.associateCompany;
    };
    AssociatedCounterpartiesCompanyComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-associated-counterparties-company',
            template: __webpack_require__(/*! ./associated-counterparties-company.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.html"),
            styles: [__webpack_require__(/*! ./associated-counterparties-company.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_7__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_7__["MatDialogRef"], Object, _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"], _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_4__["MasterdataService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"]])
    ], AssociatedCounterpartiesCompanyComponent);
    return AssociatedCounterpartiesCompanyComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.html":
/*!*****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.html ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Information</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\">\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"100%\"\r\n                                  [fieldControl]=\"nameCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"nameErrorMap\"\r\n                                  [required]=\"nameCtrl.isRequired\"\r\n                                  label=\"Name\"\r\n                                  [readonly]=\"true\">\r\n                </atlas-form-input>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-dropdown-select-list fxFlex='100%'\r\n                                            label=\"Account Type Name\"\r\n                                            [fieldControl]=\"accountTypeCtrl\"\r\n                                            [readonly]=\"true\"\r\n                                            [options]=\"accountTypes\"\r\n                                            [required]=\"accountTypeCtrl.isRequired\"\r\n                                            isEditable=\"true\"\r\n                                            (optionSelected)=\"optionSelected($event)\"\r\n                                            [selectProperties]=\"accountTypesSelect\"\r\n                                            [defaultSelected]=\"checkedAccountTypes\"\r\n                                            multiselect=\"true\">\r\n                </atlas-dropdown-select-list>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n\r\n                <mat-form-field style=\"max-width: 130px;\">\r\n                    <input matInput\r\n                           placeholder=\"Account Manager\"\r\n                           [matAutocomplete]=\"accountManager\"\r\n                           [formControl]=\"accountManagerCtrl\"\r\n                           [matTooltip]=\"'Account Manager'\"\r\n                           autocomplete=\"off\">\r\n                    <mat-autocomplete #accountManager=\"matAutocomplete\"\r\n                                      [panelWidth]=\"panelSize\">\r\n                        <mat-option *ngFor=\"let accountManager of filteredAccountManagers\"\r\n                                    [value]=\"accountManager.samAccountName\">\r\n                            {{ accountManager.samAccountName }} | {{accountManager.displayName}}\r\n                        </mat-option>\r\n                    </mat-autocomplete>\r\n\r\n                    <mat-error *ngIf=\"accountManagerCtrl.hasError('inDropdownList')\">\r\n                        Account Manager is not in the List\r\n                    </mat-error>\r\n                </mat-form-field>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-dropdown-select fxFlex='25%'\r\n                                       label=\"Trade Status\"\r\n                                       [fieldControl]=\"tradeStatusCtrl\"\r\n                                       [readonly]=\"true\"\r\n                                       [options]=\"counterpartyTradeStatusList\"\r\n                                       [required]=\"tradeStatusCtrl.isRequired\"\r\n                                       isEditable=\"true\"\r\n                                       [selectProperties]=\"counterpartyTradeStatusDisplayProperty\">\r\n                </atlas-dropdown-select>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-masterdata-user-preferences-input fxFlex=\"25%\"\r\n                                                         isEditable=\"true\"\r\n                                                         [fieldControl]=\"headOfFamilyCtrl\"\r\n                                                         [options]=\"headofFamily\"\r\n                                                         label=\"Head of Family\"\r\n                                                         displayProperty=\"counterpartyCode\"\r\n                                                         [selectProperties]=\"['counterpartyCode', 'description']\"\r\n                                                         [errorMap]=\"counterpartyErrorMap\"\r\n                                                         lightBoxTitle=\"Results for Counterparty\"\r\n                                                         gridId=\"counterpartiesGrid\"\r\n                                                         (optionSelected)=\"onCounterpartyIdSelected($event)\">\r\n                </atlas-masterdata-user-preferences-input>\r\n                <span class=\"fill-space\"></span>\r\n            </div>\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"Department\"\r\n                           [matAutocomplete]=\"departmentCode\"\r\n                           [formControl]=\"departmentCtrl\"\r\n                           autocomplete=\"off\">\r\n                    <mat-autocomplete #departmentCode=\"matAutocomplete\"\r\n                                      [panelWidth]=\"panelSize\"\r\n                                      (optionSelected)=\"onSelectionChanged($event)\">\r\n                        <mat-option *ngFor=\"let department of filteredDepartments\"\r\n                                    [value]=\"department.departmentCode\">\r\n                            {{department.departmentCode}} | {{department.description}}\r\n                        </mat-option>\r\n                    </mat-autocomplete>\r\n                    <mat-error *ngIf=\"departmentCtrl.hasError('inDropdownList')\">\r\n                        value is not in the List\r\n                    </mat-error>\r\n                </mat-form-field>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"departmentDescriptionCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Description\"\r\n                                  [readonly]=\"true\">\r\n                </atlas-form-input>\r\n                <atlas-form-input fxFlex=\"35%\"\r\n                                  [fieldControl]=\"fiscalRegCtrl\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Fiscal Registration Number\">\r\n                </atlas-form-input>\r\n            </div>\r\n            <div FxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"60%\"\r\n                                  [fieldControl]=\"associatedCompaniesCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [required]=\"associatedCompaniesCtrl.isRequired\"\r\n                                  label=\"Associated Companies\"\r\n                                  [readonly]=\"true\">\r\n                </atlas-form-input>\r\n                <button (click)=\"onChangeButtonClicked()\"\r\n                        [disabled]=\"isViewMode || !isAdmin\"\r\n                        mat-raised-button\r\n                        type=\"button\">\r\n                    Change\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.scss":
/*!*****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.scss ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.ts":
/*!***************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.ts ***!
  \***************************************************************************************************************************************************/
/*! exports provided: InformationCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InformationCardComponent", function() { return InformationCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_trading_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/trading.service */ "./Client/app/shared/services/http-services/trading.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_services_masterdata_department_data_loader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/services/masterdata/department-data-loader */ "./Client/app/shared/services/masterdata/department-data-loader.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _associated_company_associated_counterparties_company_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./associated-company/associated-counterparties-company.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.ts");
/* harmony import */ var _shared_entities_counterparty_company_entity__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../../shared/entities/counterparty-company.entity */ "./Client/app/shared/entities/counterparty-company.entity.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
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















var InformationCardComponent = /** @class */ (function (_super) {
    __extends(InformationCardComponent, _super);
    function InformationCardComponent(formBuilder, formConfigurationProvider, tradingService, utilService, departmentDataLoader, route, masterdataService, dialog) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.tradingService = tradingService;
        _this.utilService = utilService;
        _this.departmentDataLoader = departmentDataLoader;
        _this.route = route;
        _this.masterdataService = masterdataService;
        _this.dialog = dialog;
        _this.nameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Name');
        _this.accountTypeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AccountType');
        _this.accountManagerCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AccountManager');
        _this.tradeStatusCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('tradeStatus');
        _this.headOfFamilyCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('HeadOfFamily');
        _this.departmentCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('Department');
        _this.departmentDescriptionCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('DepartmentDescription');
        _this.fiscalRegCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('FiscalReg');
        _this.associatedCompaniesCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('AssociatedCompanies');
        _this.accountManagers = [];
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].Province,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].Ports,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].AccountTypes,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].ContractTerms,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].Departments,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].TradeStatus
        ];
        _this.accountTypesSelect = ['name'];
        _this.headOfFamilySelect = ['counterpartyCode'];
        _this.counterpartyTradeStatusList = [];
        _this.counterpartyTradeStatusDisplayProperty = ['enumEntityValue'];
        _this.isViewMode = false;
        _this.isEditMode = false;
        _this.selectedAccountTypesOptions = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.isAdmin = false;
        _this.inputErrorMap = new Map();
        _this.nameErrorMap = new Map();
        _this.headOfFamilyErrorMap = new Map()
            .set('inDropdownList', 'Counterparty not in the list.');
        _this.counterpartyErrorMap = new Map()
            .set('inDropdownList', 'Counterparty not in the list.');
        _this.inputErrorMap.set('maxlength', 'Maximum 20 charcters Allowed');
        _this.nameErrorMap.set('maxlength', 'Maximum 200 charcters Allowed');
        return _this;
    }
    InformationCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.associatedCompaniesCtrl.disable();
        if (this.isEditMode && !this.isAdmin) {
            this.nameCtrl.disable();
            this.tradeStatusCtrl.disable();
        }
        this.tradingService.getAllTraders()
            .subscribe(function (traders) {
            _this.accountManagers = _this.filteredAccountManagers = traders.value;
            _this.accountManagerCtrl.valueChanges.subscribe(function (input) {
                _this.filteredAccountManagers = _this.utilService.filterListforAutocomplete(input, _this.accountManagers, ['samAccountName', 'firstName', 'lastName']);
            });
            _this.setValidatorsforAccount();
        });
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.accountTypes = _this.masterdata.accountTypes;
            _this.filteredDepartments = _this.masterdata.departments;
            _this.departmentCtrl.valueChanges.subscribe(function (input) {
                _this.filteredDepartments = _this.utilService.filterListforAutocomplete(input, _this.masterdata.departments, ['departmentCode', 'description']);
            });
            _this.headofFamily = _this.masterdata.counterparties;
            _this.counterpartyTradeStatusList = _this.masterdata.tradeStatus;
            _this.headOfFamilyFiltered = _this.headofFamily;
            _this.headOfFamilyCtrl.valueChanges.subscribe(function (input) {
                _this.headOfFamilyFiltered = _this.utilService.filterListforAutocomplete(input, _this.headofFamily, ['counterpartyCode', 'description']);
            });
            _this.setDefaultTrade();
            _this.setValidators();
        });
    };
    InformationCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            nameCtrl: this.nameCtrl,
            accountTypeCtrl: this.accountTypeCtrl,
            accountManagerCtrl: this.accountManagerCtrl,
            tradeStatusCtrl: this.tradeStatusCtrl,
            headOfFamilyCtrl: this.headOfFamilyCtrl,
            departmentCtrl: this.departmentCtrl,
            departmentDescriptionCtrl: this.departmentDescriptionCtrl,
            fiscalRegCtrl: this.fiscalRegCtrl,
            associatedCompaniesCtrl: this.associatedCompaniesCtrl,
        });
        this.associatedCompaniesCtrl.disable();
        return _super.prototype.getFormGroup.call(this);
    };
    InformationCardComponent.prototype.optionSelected = function (data) {
        var _this = this;
        this.selectedAccountTypes = [];
        data.forEach(function (element) {
            _this.selectedAccountTypes.push(element);
        });
        this.selectedAccountTypesOptions.emit(this.selectedAccountTypes);
    };
    InformationCardComponent.prototype.onCounterpartyIdSelected = function (value) {
        this.headOfFamilyCtrl.patchValue(this.headOfFamilyCtrl.value);
    };
    InformationCardComponent.prototype.onChangeButtonClicked = function () {
        var _this = this;
        var openCostMatrixDialog = this.dialog.open(_associated_company_associated_counterparties_company_component__WEBPACK_IMPORTED_MODULE_12__["AssociatedCounterpartiesCompanyComponent"], {
            width: '45%',
            data: {
                matrixData: this.associatedCompanies,
            },
        });
        openCostMatrixDialog.afterClosed().subscribe(function (selectedCompanies) {
            if (selectedCompanies !== null &&
                typeof (selectedCompanies) === "object" &&
                selectedCompanies.length > 0) {
                var associateCompanies_1 = '';
                selectedCompanies.forEach(function (element) {
                    if (element.companyId) {
                        associateCompanies_1 = element.companyId + ', ' + associateCompanies_1;
                    }
                });
                if (associateCompanies_1 != '') {
                    associateCompanies_1 = associateCompanies_1.trim();
                    associateCompanies_1 = associateCompanies_1.substr(0, associateCompanies_1.length - 1);
                    _this.associatedCompaniesCtrl.patchValue(associateCompanies_1);
                }
            }
        });
    };
    InformationCardComponent.prototype.onSelectionChanged = function (event) {
        var selectedDepartment = this.masterdata.departments.find(function (department) { return department.departmentCode === event.option.value; });
        if (selectedDepartment) {
            this.departmentDescriptionCtrl.patchValue(selectedDepartment.description);
        }
        else {
            this.departmentDescriptionCtrl.patchValue('');
        }
    };
    InformationCardComponent.prototype.getDepartmentId = function (code) {
        var selectedDepartment = this.masterdata.departments.find(function (department) { return department.departmentCode === code; });
        if (selectedDepartment) {
            return selectedDepartment.departmentId;
        }
        return null;
    };
    InformationCardComponent.prototype.setValidatorsforAccount = function () {
        this.accountManagerCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_6__["inDropdownListValidator"])(this.filteredAccountManagers, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('samAccountName')),
        ]));
    };
    InformationCardComponent.prototype.setValidators = function () {
        this.departmentCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].compose([
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_6__["inDropdownListValidator"])(this.masterdata.departments, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('departmentCode')),
        ]));
        this.nameCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].maxLength(200)]));
        this.tradeStatusCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].required]));
        this.associatedCompaniesCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].required]));
        this.fiscalRegCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_10__["Validators"].maxLength(20)]));
        this.formGroup.updateValueAndValidity();
    };
    InformationCardComponent.prototype.displayAccountManager = function (userId) {
        if (userId) {
            var selectedUser = this.accountManagers.find(function (user) { return user.userId === userId; });
            if (selectedUser) {
                return selectedUser.displayName;
            }
        }
        return '';
    };
    ;
    InformationCardComponent.prototype.getAccountManager = function (name) {
        if (name) {
            var selectedUser = this.accountManagers.find(function (user) { return user.samAccountName === name; });
            if (selectedUser) {
                return selectedUser.userId;
            }
        }
        return null;
    };
    ;
    InformationCardComponent.prototype.setDefaultTrade = function () {
        this.tradeStatusCtrl.patchValue(this.counterpartyTradeStatusList.find(function (status) {
            return status.enumEntityValue === 'Trade';
        }));
    };
    InformationCardComponent.prototype.getTradeId = function (name) {
        if (name) {
            var selectedTrade = this.counterpartyTradeStatusList.find(function (trade) { return trade.enumEntityValue === name; });
            if (selectedTrade) {
                return selectedTrade.enumEntityId;
            }
        }
        return null;
    };
    InformationCardComponent.prototype.getHeadOfFamily = function (name) {
        if (name) {
            var selectedHeadOfFamily = this.headofFamily.find(function (family) { return family.name === name; });
            if (selectedHeadOfFamily) {
                return selectedHeadOfFamily.counterpartyID;
            }
        }
        return null;
    };
    InformationCardComponent.prototype.getAssociatedCompanies = function (model, selectedNames) {
        var _this = this;
        var associatedCompanies = [];
        if (selectedNames) {
            var selectedNameList = selectedNames.split(",");
            if (selectedNameList && selectedNameList.length > 0) {
                selectedNameList.forEach(function (company) {
                    var selectedCompany = _this.masterdata.companies.find(function (comp) { return comp.companyId === company.trim(); });
                    if (selectedCompany) {
                        var counterpartyCompany = new _shared_entities_counterparty_company_entity__WEBPACK_IMPORTED_MODULE_13__["CounterpartyCompany"]();
                        counterpartyCompany.companyId = selectedCompany.id;
                        counterpartyCompany.isDeactivated = false;
                        associatedCompanies.push(counterpartyCompany);
                    }
                });
                var availableCompanies = this.masterdata.companies;
                availableCompanies.forEach(function (company) {
                    var selectedCompany = associatedCompanies.find(function (comp) { return comp.companyId === company.id; });
                    if (!selectedCompany) {
                        var counterpartyCompany = new _shared_entities_counterparty_company_entity__WEBPACK_IMPORTED_MODULE_13__["CounterpartyCompany"]();
                        counterpartyCompany.companyId = company.id;
                        counterpartyCompany.isDeactivated = true;
                        associatedCompanies.push(counterpartyCompany);
                    }
                });
            }
            if (associatedCompanies && associatedCompanies.length > 0 &&
                model.counterpartyCompanies && model.counterpartyCompanies.length > 0) {
                associatedCompanies.forEach(function (company) {
                    var selectedCompany = model.counterpartyCompanies.find(function (comp) { return comp.companyId === company.companyId; });
                    if (selectedCompany) {
                        company.c2CCode = selectedCompany.c2CCode;
                    }
                });
            }
        }
        return associatedCompanies;
    };
    InformationCardComponent.prototype.getAssociatedCompanyNameById = function (id) {
        var companyName = "";
        var selectedCompany = this.masterdata.companies.find(function (comp) { return comp.companyId === ""; });
        if (selectedCompany) {
            companyName = selectedCompany.companyId;
        }
        return companyName;
    };
    InformationCardComponent.prototype.populateEntity = function (model) {
        model.name = this.nameCtrl.value;
        model.description = this.nameCtrl.value;
        model.counterpartyAccountTypes = this.accountTypeCtrl.value;
        model.acManagerId = this.getAccountManager(this.accountManagerCtrl.value);
        model.counterpartyTradeStatusId = this.tradeStatusCtrl.value.enumEntityId;
        model.headofFamily = (this.headOfFamilyCtrl.value) ? this.headOfFamilyCtrl.value.counterpartyID : null;
        model.departmentId = this.getDepartmentId(this.departmentCtrl.value);
        model.fiscalRegistrationNumber = this.fiscalRegCtrl.value;
        model.counterpartyCompanies = this.getAssociatedCompanies(model, this.associatedCompaniesCtrl.value);
    };
    InformationCardComponent.prototype.populateValue = function (model) {
        var _this = this;
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCountry = this.masterdata.countries;
        this.filteredProvince = this.masterdata.provinces;
        this.filteredDepartments = this.masterdata.departments;
        this.filteredCompany = this.masterdata.companies;
        this.filteredAccountManagers = this.accountManagers;
        this.headOfFamilyFiltered = this.masterdata.counterparties;
        this.filteredAccountTypes = this.masterdata.accountTypes;
        this.counterpartyTradeStatusList = this.masterdata.tradeStatus;
        if (model.countryId) {
            var country = this.filteredCountry.find(function (country) { return country.countryId === model.countryId; });
            if (country) {
                model.countryName = country.description;
            }
        }
        if (model.provinceId) {
            var province = this.filteredProvince.find(function (province) { return province.provinceId === model.provinceId; });
            if (province) {
                model.provinceName = province.description;
            }
        }
        if (model.departmentId) {
            var department = this.filteredDepartments.find(function (department) { return department.departmentId === model.departmentId; });
            if (department) {
                model.departmentCode = department.departmentCode;
                model.departmentName = department.description;
            }
            else {
                model.departmentName = '';
            }
        }
        else {
            model.departmentName = '';
        }
        if (model.associatedCompanies) {
            this.associatedCompanies = model.associatedCompanies;
            var companyName_1 = "";
            model.associatedCompanies.forEach(function (comp) {
                if (!comp.isDeactivated) {
                    var company = _this.filteredCompany.find(function (company) { return company.id === comp.companyId; });
                    if (company) {
                        comp.companyName = company.companyId;
                    }
                    companyName_1 = comp.companyName + "," + companyName_1;
                }
            });
            companyName_1 = companyName_1.substr(0, companyName_1.length - 1);
            this.associatedCompaniesCtrl.patchValue(companyName_1);
        }
        if (model.headofFamily) {
            this.headofFamilyControl = this.headOfFamilyFiltered.find(function (headValue) { return headValue.counterpartyID === model.headofFamily; });
            this.headOfFamilyCtrl.patchValue(this.headofFamilyControl);
        }
        if (model.counterpartyAccountTypes) {
            this.checkedAccountTypes = [];
            this.selectedAccountTypes = [];
            model.counterpartyAccountTypes.forEach(function (element) {
                var accountType = _this.filteredAccountTypes.find(function (accountType) { return accountType.accountTypeId === element.accountTypeId; });
                if (accountType) {
                    element.name = accountType.name;
                    _this.checkedAccountTypes.push(accountType);
                    _this.selectedAccountTypes.push(element);
                }
            });
            this.accountTypeCtrl.patchValue(this.checkedAccountTypes);
        }
        if (model.counterpartyTradeStatusId) {
            var tradeStatus_1 = this.counterpartyTradeStatusList.find(function (status) {
                return status.enumEntityId === model.counterpartyTradeStatusId;
            });
            if (tradeStatus_1) {
                this.tradeStatusCtrl.patchValue(this.counterpartyTradeStatusList.find(function (status) {
                    return status.enumEntityValue === tradeStatus_1.enumEntityValue;
                }));
            }
        }
        this.tradingService.getAllTraders()
            .subscribe(function (traders) {
            if (traders.value) {
                _this.filteredAccountManagers = traders.value;
                if (model.acManagerId && _this.filteredAccountManagers) {
                    var acManager = _this.filteredAccountManagers.find(function (manager) { return manager.userId === model.acManagerId; });
                    if (acManager) {
                        model.acManagerName = acManager.samAccountName;
                        _this.accountManagerCtrl.patchValue(model.acManagerName);
                    }
                    else {
                        _this.accountManagerCtrl.patchValue('');
                    }
                }
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('associatedCounterpartiesCompanyComponent'),
        __metadata("design:type", _associated_company_associated_counterparties_company_component__WEBPACK_IMPORTED_MODULE_12__["AssociatedCounterpartiesCompanyComponent"])
    ], InformationCardComponent.prototype, "associatedCounterpartiesCompanyComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], InformationCardComponent.prototype, "isViewMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], InformationCardComponent.prototype, "isEditMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], InformationCardComponent.prototype, "selectedAccountTypesOptions", void 0);
    InformationCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-information-card',
            template: __webpack_require__(/*! ./information-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.html"),
            styles: [__webpack_require__(/*! ./information-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.scss")],
            providers: [_shared_services_masterdata_department_data_loader__WEBPACK_IMPORTED_MODULE_7__["DepartmentDataLoader"]],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_10__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"],
            _shared_services_http_services_trading_service__WEBPACK_IMPORTED_MODULE_4__["TradingService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_5__["UtilService"],
            _shared_services_masterdata_department_data_loader__WEBPACK_IMPORTED_MODULE_7__["DepartmentDataLoader"],
            _angular_router__WEBPACK_IMPORTED_MODULE_14__["ActivatedRoute"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__["MasterdataService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_11__["MatDialog"]])
    ], InformationCardComponent);
    return InformationCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.html":
/*!*******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.html ***!
  \*******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card style=\"width: 400px\">\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Counterparty Main Address</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n\r\n    <mat-card-content>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address Type Name\"\r\n                       [formControl]=\"addressTypeNameCtrl\">\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address 1\"\r\n                       [formControl]=\"address1Ctrl\">\r\n                <mat-error *ngIf=\"address1Ctrl.hasError('maxlength')\">\r\n                    Maximum 60 charcters Allowed\r\n                </mat-error>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address 2\"\r\n                       [formControl]=\"address2Ctrl\">\r\n                <mat-error *ngIf=\"address2Ctrl.hasError('maxlength')\">\r\n                    Maximum 60 charcters Allowed\r\n                </mat-error>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"Address Type Code\"\r\n                       [matAutocomplete]=\"addressCode\"\r\n                       autocomplete=\"off\"\r\n                       [formControl]=\"addressTypeCodeCtrl\">\r\n\r\n                <mat-autocomplete #addressCode=\"matAutocomplete\"\r\n                                  [panelWidth]=\"panelSize\"\r\n                                  (optionSelected)=\"onSelectionChanged($event)\">\r\n                    <mat-option *ngFor=\"let addressType of filteredAddressType\"\r\n                                [value]=\"addressType.enumEntityValue\">\r\n                        {{addressType.enumEntityId}} | {{addressType.enumEntityValue}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-hint *ngIf=\"addressTypeCodeCtrl.isRequired\">\r\n                    Required *\r\n                </mat-hint>\r\n                <mat-error *ngIf=\"addressTypeCodeCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"50%\">\r\n                <input matInput\r\n                       placeholder=\"Zip Code\"\r\n                       (keypress)=\"numberValidation($event)\"\r\n                       [formControl]=\"zipCodeCtrl\">\r\n                <mat-error *ngIf=\"zipCodeCtrl.hasError('maxlength')\">\r\n                    Maximum 40 digits Allowed\r\n                </mat-error>\r\n            </mat-form-field>\r\n\r\n            <div fxFlex=\"50%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"City\"\r\n                           [formControl]=\"cityCtrl\">\r\n                    <mat-error *ngIf=\"cityCtrl.hasError('maxlength')\">\r\n                        Maximum 60 charcters Allowed\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"50%\"\r\n                            [class.isEmpty]=\"!provinceCtrl.value\"\r\n                            [class.required-field]=\"provinceCtrl.isRequired\">\r\n                <input matInput\r\n                       placeholder=\"Province\"\r\n                       [matAutocomplete]=\"provinceCode\"\r\n                       [formControl]=\"provinceCtrl\"\r\n                       [required]=\"provinceCtrl.isRequired\"\r\n                       autocomplete=\"off\">\r\n                <mat-autocomplete #provinceCode=\"matAutocomplete\"\r\n                                  [panelWidth]=\"panelSize\">\r\n                    <mat-option *ngFor=\"let province of filteredProvince\"\r\n                                [value]=\"province.description\">\r\n                        {{province.provinceId}} | {{province.description}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-hint *ngIf=\"provinceCtrl.isRequired\">\r\n                    Required *\r\n                </mat-hint>\r\n                <mat-error *ngIf=\"provinceCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n            </mat-form-field>\r\n\r\n            <div fxFlex=\"50%\"\r\n                 [class.isEmpty]=\"!countryCtrl.value\"\r\n                 [class.required-field]=\"countryCtrl.isRequired\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           placeholder=\"Country\"\r\n                           [matAutocomplete]=\"countryCode\"\r\n                           [formControl]=\"countryCtrl\"\r\n                           [required]=\"countryCtrl.isRequired\"\r\n                           autocomplete=\"off\">\r\n                    <mat-autocomplete #countryCode=\"matAutocomplete\"\r\n                                      [panelWidth]=\"panelSize\">\r\n                        <mat-option *ngFor=\"let country of filteredCountry\"\r\n                                    [value]=\"country.description\">\r\n                            {{country.countryId}} | {{country.description}}\r\n                        </mat-option>\r\n                    </mat-autocomplete>\r\n                    <mat-error *ngIf=\"countryCtrl.hasError('inDropdownList')\">\r\n                        Value not in list\r\n                    </mat-error>\r\n                    <mat-hint *ngIf=\"countryCtrl.isRequired\">\r\n                        Required *\r\n                    </mat-hint>\r\n                    <mat-error *ngIf=\"countryCtrl.hasError('required')\">\r\n                        This field is required\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n\r\n        <mat-list>\r\n            <mat-divider></mat-divider>\r\n        </mat-list>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field fxFlex=\"30%\">\r\n                <input matInput\r\n                       placeholder=\"Main Email Address\"\r\n                       [formControl]=\"emailCtrl\">\r\n                <mat-error *ngIf=\"emailCtrl.hasError('email')\">\r\n                    Not a valid email\r\n                </mat-error>\r\n                <mat-error *ngIf=\"emailCtrl.hasError('maxlength')\">\r\n                    Maximum 40 charcters Allowed\r\n                </mat-error>\r\n            </mat-form-field>\r\n\r\n            <div fxFlex=\"30%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           (keypress)=\"numberValidation($event)\"\r\n                           placeholder=\"Phone Number\"\r\n                           [formControl]=\"phoneNumberCtrl\">\r\n                    <mat-error *ngIf=\"phoneNumberCtrl.hasError('maxlength')\">\r\n                        Maximum 10 digits Allowed\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n\r\n            <div fxFlex=\"30%\">\r\n                <mat-form-field>\r\n                    <input matInput\r\n                           (keypress)=\"numberValidation($event)\"\r\n                           placeholder=\"Fax Number\"\r\n                           [formControl]=\"faxNumberCtrl\">\r\n                    <mat-error *ngIf=\"faxNumberCtrl.hasError('maxlength')\">\r\n                        Maximum 40 digits Allowed\r\n                    </mat-error>\r\n                </mat-form-field>\r\n            </div>\r\n        </div>\r\n\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"left start\"\r\n             fxLayoutGap=\"5%\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       placeholder=\"LDC Region\"\r\n                       [matAutocomplete]=\"ldcRegionCode\"\r\n                       autocomplete=\"off\"\r\n                       [formControl]=\"ldcRegionCtrl\">\r\n\r\n                <mat-autocomplete #ldcRegionCode=\"matAutocomplete\"\r\n                                  [panelWidth]=\"panelSize\">\r\n                    <mat-option *ngFor=\"let ldcRegion of filteredLdcRegion\"\r\n                                [value]=\"ldcRegion.description\">\r\n                        {{ldcRegion.ldcRegionCode}} | {{ldcRegion.description}}\r\n                    </mat-option>\r\n                </mat-autocomplete>\r\n                <mat-hint *ngIf=\"ldcRegionCtrl.isRequired\">\r\n                    Required *\r\n                </mat-hint>\r\n                <mat-error *ngIf=\"ldcRegionCtrl.hasError('inDropdownList')\">\r\n                    Value not in list\r\n                </mat-error>\r\n            </mat-form-field>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.scss":
/*!*******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.scss ***!
  \*******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.ts":
/*!*****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.ts ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: MainAddressCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainAddressCardComponent", function() { return MainAddressCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/directives/autocomplete-dropdown.directive */ "./Client/app/shared/directives/autocomplete-dropdown.directive.ts");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
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












var MainAddressCardComponent = /** @class */ (function (_super) {
    __extends(MainAddressCardComponent, _super);
    function MainAddressCardComponent(formBuilder, formConfigurationProvider, dialog, route, snackbarService, utilService, masterdataService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.dialog = dialog;
        _this.route = route;
        _this.snackbarService = snackbarService;
        _this.utilService = utilService;
        _this.masterdataService = masterdataService;
        _this.addressTypeNameCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('addressTypeNameCtrl');
        _this.address1Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('address1Ctrl');
        _this.address2Ctrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('address2Ctrl');
        _this.zipCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('zipCodeCtrl');
        _this.cityCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('cityCtrl');
        _this.provinceCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('provinceCtrl');
        _this.countryCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('countryCtrl');
        _this.emailCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('emailCtrl');
        _this.phoneNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('phoneNumberCtrl');
        _this.faxNumberCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('faxNumberCtrl');
        _this.ldcRegionCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('ldcRegionCtrl');
        _this.addressTypeCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_6__["AtlasFormControl"]('addressTypeCodeCtrl');
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__["MasterDataProps"].Province,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__["MasterDataProps"].Ports,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__["MasterDataProps"].ContractTerms,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_7__["MasterDataProps"].AddressTypes,
        ];
        return _this;
    }
    MainAddressCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.filteredProvince = _this.masterdata.provinces;
            _this.provinceCtrl.valueChanges.subscribe(function (input) {
                _this.filteredProvince = _this.utilService.filterListforAutocomplete(input, _this.masterdata.provinces, ['provinceId', 'description']);
            });
            _this.filteredCountry = _this.masterdata.countries;
            _this.countryCtrl.valueChanges.subscribe(function (input) {
                _this.filteredCountry = _this.utilService.filterListforAutocomplete(input, _this.masterdata.countries, ['countryId', 'description']);
            });
            _this.filteredAddressType = _this.masterdata.addressTypes;
            _this.addressTypeCodeCtrl.valueChanges.subscribe(function (input) {
                _this.filteredAddressType = _this.utilService.filterListforAutocomplete(input, _this.masterdata.addressTypes, ['enumEntityId', 'enumEntityValue']);
            });
            _this.filteredLdcRegion = _this.masterdata.regions;
            _this.ldcRegionCtrl.valueChanges.subscribe(function (input) {
                _this.filteredLdcRegion = _this.utilService.filterListforAutocomplete(input, _this.masterdata.regions, ['ldcRegionCode', 'description']);
            });
            _this.setValidators();
        });
        this.addressTypeNameCtrl.disable();
    };
    MainAddressCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            addressTypeNameCtrl: this.addressTypeNameCtrl,
            address1Ctrl: this.address1Ctrl,
            address2Ctrl: this.address2Ctrl,
            zipCodeCtrl: this.zipCodeCtrl,
            cityCtrl: this.cityCtrl,
            provinceCtrl: this.provinceCtrl,
            countryCtrl: this.countryCtrl,
            emailCtrl: this.emailCtrl,
            phoneNumberCtrl: this.phoneNumberCtrl,
            faxNumberCtrl: this.faxNumberCtrl,
            ldcRegionCtrl: this.ldcRegionCtrl,
            addressTypeCodeCtrl: this.addressTypeCodeCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    MainAddressCardComponent.prototype.numberValidation = function (event) {
        var pattern = /[0-9]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    MainAddressCardComponent.prototype.setValidators = function () {
        this.provinceCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_5__["inDropdownListValidator"])(this.masterdata.provinces, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__["nameof"])('description')),
        ]));
        this.countryCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_5__["inDropdownListValidator"])(this.masterdata.countries, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__["nameof"])('description')),
        ]));
        this.ldcRegionCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_5__["inDropdownListValidator"])(this.masterdata.regions, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__["nameof"])('ldcRegionCode')),
        ]));
        this.addressTypeCodeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
            Object(_shared_directives_autocomplete_dropdown_directive__WEBPACK_IMPORTED_MODULE_5__["inDropdownListValidator"])(this.masterdata.addressTypes, Object(_shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__["nameof"])('enumEntityValue')),
        ]));
        this.address1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(60)]));
        this.address2Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(60)]));
        this.cityCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(60)]));
        this.zipCodeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(40)]));
        this.emailCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].email, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(40)]));
        this.faxNumberCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(40)]));
        this.phoneNumberCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(10)]));
        this.formGroup.updateValueAndValidity();
    };
    MainAddressCardComponent.prototype.onSelectionChanged = function (event) {
        var addressType = this.masterdata.addressTypes.find(function (addType) { return addType.enumEntityValue === event.option.value; });
        if (addressType) {
            this.addressTypeNameCtrl.patchValue(addressType.enumEntityValue);
        }
        else {
            this.addressTypeNameCtrl.patchValue('');
        }
    };
    MainAddressCardComponent.prototype.getCountryId = function (name) {
        if (name) {
            var country = this.masterdata.countries.find(function (cn) { return cn.description === name; });
            if (country) {
                return country.countryId;
            }
        }
        return 0;
    };
    MainAddressCardComponent.prototype.getAddressTypeCodeId = function (name) {
        if (name) {
            var addressType = this.masterdata.addressTypes.find(function (cn) { return cn.enumEntityValue === name; });
            if (addressType) {
                return addressType.enumEntityId;
            }
        }
        return 0;
    };
    MainAddressCardComponent.prototype.getLdcRegionId = function (name) {
        if (name) {
            var ldcRegion = this.masterdata.regions.find(function (cn) { return cn.description === name; });
            if (ldcRegion) {
                return ldcRegion.ldcRegionId;
            }
        }
        return 0;
    };
    MainAddressCardComponent.prototype.getProvinceId = function (name) {
        if (name) {
            var province = this.masterdata.provinces.find(function (p) { return p.description === name; });
            if (province) {
                return province.provinceId;
            }
        }
        return 0;
    };
    MainAddressCardComponent.prototype.updateEntity = function (model, mainAddress) {
        var counterpartyAddress = {};
        counterpartyAddress.address1 = this.address1Ctrl.value;
        counterpartyAddress.address2 = this.address2Ctrl.value;
        counterpartyAddress.addressTypeID = this.getAddressTypeCodeId(this.addressTypeCodeCtrl.value);
        counterpartyAddress.addresTypeName = this.addressTypeNameCtrl.value;
        counterpartyAddress.zipCode = this.zipCodeCtrl.value;
        counterpartyAddress.city = this.cityCtrl.value;
        counterpartyAddress.provinceID = this.getProvinceId(this.provinceCtrl.value);
        counterpartyAddress.countryID = this.getCountryId(this.countryCtrl.value);
        counterpartyAddress.mail = this.emailCtrl.value;
        counterpartyAddress.phoneNo = this.phoneNumberCtrl.value;
        counterpartyAddress.faxNo = this.faxNumberCtrl.value;
        counterpartyAddress.ldcRegionId = this.getLdcRegionId(this.ldcRegionCtrl.value);
        counterpartyAddress.main = true;
        if (mainAddress) {
            counterpartyAddress.addressId = mainAddress.addressId;
            counterpartyAddress.randomId = mainAddress.randomId;
        }
        model.countryId = this.getCountryId(this.countryCtrl.value);
        model.provinceId = this.getProvinceId(this.provinceCtrl.value);
        model.counterpartyAddresses.push(counterpartyAddress);
    };
    MainAddressCardComponent.prototype.populateValues = function (model) {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredLdcRegion = this.masterdata.regions;
        this.filteredAddressType = this.masterdata.addressTypes;
        if (model.ldcRegionId) {
            var ldcRegion = this.filteredLdcRegion.find(function (region) { return region.ldcRegionId === model.ldcRegionId; });
            if (ldcRegion) {
                model.ldcRegionCode = ldcRegion.ldcRegionCode;
            }
        }
        if (model.addressTypeID) {
            var address = this.filteredAddressType.find(function (addressType) { return addressType.enumEntityId === model.addressTypeID; });
            if (address) {
                model.addressTypeCode = address.enumEntityValue;
            }
        }
    };
    MainAddressCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-main-address-card',
            template: __webpack_require__(/*! ./main-address-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.html"),
            styles: [__webpack_require__(/*! ./main-address-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.scss")],
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_8__["FormConfigurationProviderService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_11__["UtilService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_9__["MasterdataService"]])
    ], MainAddressCardComponent);
    return MainAddressCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_4__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.html":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.html ***!
  \*******************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\r\n    <mat-card-header>\r\n        <mat-card-title>\r\n            <h3>Third System Party Codes</h3>\r\n        </mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div fxLayout=\"column\">\r\n            <div fxFlex=\"100%\"\r\n                 fxLayout=\"row\">\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"mdmIdCtrl\"\r\n                                  (keypress)=\"mdmIdValidation($event)\"\r\n                                  [errorMap]=\"numberErrorMap\"\r\n                                  (blur)=\"onBlur()\"\r\n                                  [isEditable]=\"true\"\r\n                                  label=\"Mdm Id\">\r\n                </atlas-form-input>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-dropdown-select-list fxFlex='100%'\r\n                                            label=\"Mdm Category Code\"\r\n                                            [fieldControl]=\"mdmCategoryCodeCtrl\"\r\n                                            [readonly]=\"true\"\r\n                                            [options]=\"mdmCategories\"\r\n                                            isEditable=\"true\"\r\n                                            (optionSelected)=\"optionSelected($event)\"\r\n                                            [selectProperties]=\"mdmCategoriesSelect\"\r\n                                            [defaultSelected]=\"checkedMdmCategories\"\r\n                                            multiselect=\"true\">\r\n                </atlas-dropdown-select-list>\r\n                <span class=\"fill-space\"></span>\r\n                <atlas-form-input fxFlex=\"30%\"\r\n                                  [fieldControl]=\"c2cCodeCtrl\"\r\n                                  [isEditable]=\"true\"\r\n                                  [errorMap]=\"inputErrorMap\"\r\n                                  label=\"C2C Code\">\r\n                </atlas-form-input>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.scss":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.scss ***!
  \*******************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.ts":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.ts ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: ThirdSystemCodesCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThirdSystemCodesCardComponent", function() { return ThirdSystemCodesCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/entities/atlas-form-control */ "./Client/app/shared/entities/atlas-form-control.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
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










var ThirdSystemCodesCardComponent = /** @class */ (function (_super) {
    __extends(ThirdSystemCodesCardComponent, _super);
    function ThirdSystemCodesCardComponent(formBuilder, formConfigurationProvider, utilService, route, snackbarService, masterdataService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formBuilder = formBuilder;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.utilService = utilService;
        _this.route = route;
        _this.snackbarService = snackbarService;
        _this.masterdataService = masterdataService;
        _this.mdmIdCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('MdmId');
        _this.mdmCategoryCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('MdmCategoryCode');
        _this.c2cCodeCtrl = new _shared_entities_atlas_form_control__WEBPACK_IMPORTED_MODULE_1__["AtlasFormControl"]('C2cCode');
        _this.mdmCategoriesSelect = ['mdmCategoryCode'];
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].Counterparties,
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].MdmCategories
        ];
        _this.isEditMode = false;
        _this.isAdmin = false;
        _this.inputErrorMap = new Map();
        _this.numberErrorMap = new Map();
        _this.selectedMdmCodesOptions = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        _this.inputErrorMap.set('maxlength', 'Maximum 9 charcters Allowed');
        _this.numberErrorMap.set('maxlength', 'Maximum 9 digits Allowed');
        return _this;
    }
    ThirdSystemCodesCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
        if (this.isEditMode && !this.isAdmin) {
            this.mdmIdCtrl.disable();
            this.mdmCategoryCodeCtrl.disable();
        }
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe(function (data) {
            _this.masterdata = data;
            _this.filteredMdmCategories = _this.masterdata.mdmCategories;
            _this.mdmCategories = _this.masterdata.mdmCategories;
        });
        this.setValidators();
    };
    ThirdSystemCodesCardComponent.prototype.setValidators = function () {
        this.c2cCodeCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].maxLength(9)]));
        this.mdmIdCtrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].maxLength(9)]));
    };
    ThirdSystemCodesCardComponent.prototype.mdmIdValidation = function (event) {
        var pattern = /[0-9]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    ThirdSystemCodesCardComponent.prototype.onBlur = function () {
        var _this = this;
        if (this.mdmIdCtrl.value) {
            if (this.counterPartyId) {
                var mdmID = this.masterdata.counterparties.find(function (value) {
                    return value.mdmId === Number(_this.mdmIdCtrl.value) &&
                        value.counterpartyID !== _this.counterPartyId;
                });
                if (mdmID) {
                    this.snackbarService.informationSnackBar('MDM ID should be unique');
                    this.mdmIdCtrl.patchValue(null);
                }
            }
            else {
                var mdmID = this.masterdata.counterparties.find(function (value) {
                    return value.mdmId === Number(_this.mdmIdCtrl.value);
                });
                if (mdmID) {
                    this.snackbarService.informationSnackBar('MDM ID should be unique');
                    this.mdmIdCtrl.patchValue(null);
                }
            }
        }
    };
    ThirdSystemCodesCardComponent.prototype.getValues = function (model) {
        model.mdmId = this.mdmIdCtrl.value;
    };
    ThirdSystemCodesCardComponent.prototype.getFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            mdmIdCtrl: this.mdmIdCtrl,
            mdmCategoryCodeCtrl: this.mdmCategoryCodeCtrl,
            c2cCodeCtrl: this.c2cCodeCtrl,
        });
        return _super.prototype.getFormGroup.call(this);
    };
    ThirdSystemCodesCardComponent.prototype.populateEntity = function (model) {
        model.c2CCode = this.c2cCodeCtrl.value;
        model.mdmId = this.mdmIdCtrl.value;
        model.counterpartyMdmCategory = this.mdmCategoryCodeCtrl.value;
    };
    ThirdSystemCodesCardComponent.prototype.optionSelected = function (data) {
        var _this = this;
        this.selectedMdmCategories = [];
        data.forEach(function (element) {
            _this.selectedMdmCategories.push(element);
        });
        this.selectedMdmCodesOptions.emit(this.selectedMdmCategories);
    };
    ThirdSystemCodesCardComponent.prototype.populateValue = function (model) {
        var _this = this;
        if (model.mdmId) {
            this.mdmIdCtrl.patchValue(model.mdmId);
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredMdmCategories = this.masterdata.mdmCategories;
        if (model.counterpartyMdmCategory) {
            this.checkedMdmCategories = [];
            this.selectedMdmCategories = [];
            model.counterpartyMdmCategory.forEach(function (element) {
                var mdmCategory = _this.filteredMdmCategories.find(function (mdmCategory) { return mdmCategory.mdmCategoryId === element.mdmCategoryID; });
                if (mdmCategory) {
                    element.mdmCategoryCode = mdmCategory.mdmCategoryCode;
                    _this.checkedMdmCategories.push(mdmCategory);
                    _this.selectedMdmCategories.push(element);
                }
            });
            this.mdmCategoryCodeCtrl.patchValue(this.checkedMdmCategories);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ThirdSystemCodesCardComponent.prototype, "isEditMode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ThirdSystemCodesCardComponent.prototype, "selectedMdmCodesOptions", void 0);
    ThirdSystemCodesCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-third-system-codes-card',
            template: __webpack_require__(/*! ./third-system-codes-card.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.html"),
            styles: [__webpack_require__(/*! ./third-system-codes-card.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormBuilder"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_3__["FormConfigurationProviderService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_6__["UtilService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_8__["SnackbarService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_4__["MasterdataService"]])
    ], ThirdSystemCodesCardComponent);
    return ThirdSystemCodesCardComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_2__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.html":
/*!**********************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.html ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n    <mat-card>\r\n        <div fxLayout=\"row\"\r\n             fxLayout.md=\"column\"\r\n             fxLayoutAlign=\"start\"\r\n             fxFlex=\"50%\">\r\n            <div fxLayout=\"column\"\r\n                 fxLayoutAlign=\"start start\">\r\n                <div fxLayout=\"row \"\r\n                     fxLayoutAlign=\"start start\">\r\n                    <span class=\"fill-space\"></span>\r\n                    <button mat-raised-button\r\n                            [disabled]=\"isCreateMode\"\r\n                            type=\"button\"\r\n                            (click)=\"navigateCListReport()\">\r\n                        CLIST REPORTS\r\n                    </button>\r\n                </div>\r\n                <div fxLayout=\"row \"\r\n                     fxLayoutAlign=\"start start\">\r\n                    <button mat-raised-button\r\n                            [disabled]=\"isCreateMode\"\r\n                            type=\"button\"\r\n                            (click)=\"navigateTradeReport()\">\r\n                        TRADE REPORTS\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.scss":
/*!**********************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.scss ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.ts":
/*!********************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.ts ***!
  \********************************************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureFormReportTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureFormReportTabComponent", function() { return CounterpartyCaptureFormReportTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../app/core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CounterpartyCaptureFormReportTabComponent = /** @class */ (function () {
    function CounterpartyCaptureFormReportTabComponent(companyManager, router) {
        this.companyManager = companyManager;
        this.router = router;
        this.isCreateMode = false;
    }
    CounterpartyCaptureFormReportTabComponent.prototype.ngOnInit = function () {
    };
    CounterpartyCaptureFormReportTabComponent.prototype.navigateCListReport = function () {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                '/reporting/globalreports/clientreport', this.counterPartyId]);
    };
    CounterpartyCaptureFormReportTabComponent.prototype.navigateTradeReport = function () {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                '/reporting/globalreports/trade', this.counterPartyId]);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], CounterpartyCaptureFormReportTabComponent.prototype, "counterPartyId", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormReportTabComponent.prototype, "isCreateMode", void 0);
    CounterpartyCaptureFormReportTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture-form-report-tab',
            template: __webpack_require__(/*! ./counterparty-capture-form-report-tab.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture-form-report-tab.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [_app_core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_2__["CompanyManagerService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], CounterpartyCaptureFormReportTabComponent);
    return CounterpartyCaptureFormReportTabComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.html":
/*!**************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.html ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\">\r\n    <div fxLayout=\"row\"\r\n         fxFlex=\"50%\">\r\n        <h2 class=\"atlas-grid-card-title\"> VAT Registrations numbers</h2>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayout.md=\"column\"\r\n         fxLayoutAlign=\"end\"\r\n         fxFlex=\"50%\">\r\n        <div fxLayout=\"row \"\r\n             fxLayoutAlign=\"start end \">\r\n            <div fxLayout=\"row \"\r\n                 fxLayoutAlign=\"end start \">\r\n                <button mat-button\r\n                        [disabled]=\"isViewMode\"\r\n                        type=\"button\"\r\n                        (click)=\"onAddRowButtonClicked()\">Add New VAT</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div>\r\n    <mat-card>\r\n        <mat-card-content>\r\n            <div ag-grid=\"taxGridOptions\"\r\n                 class=\"ag-theme-material pointer-cursor\"\r\n                 style=\"width:100%; height: 100%;\">\r\n                <ag-grid-angular style=\"height: 100%; width:100%; \"\r\n                                 ag-grid=\"taxGridOptions\"\r\n                                 [rowData]=\"counterpartyTaxes\"\r\n                                 [columnDefs]=\"taxGridCols\"\r\n                                 [enableColResize]=\"true\"\r\n                                 [suppressDragLeaveHidesColumns]=\"true\"\r\n                                 [enableSorting]=\"true\"\r\n                                 domLayout=\"autoHeight\"\r\n                                 enableFilter\r\n                                 (gridReady)=\"onGridReady($event)\"\r\n                                 [gridOptions]=\"taxGridOptions\"\r\n                                 [singleClickEdit]=\"true\">\r\n                </ag-grid-angular>\r\n            </div>\r\n        </mat-card-content>\r\n    </mat-card>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.scss":
/*!**************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.scss ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.ts":
/*!************************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.ts ***!
  \************************************************************************************************************************************************************/
/*! exports provided: CounterpartyCaptureFormTaxInfoTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCaptureFormTaxInfoTabComponent", function() { return CounterpartyCaptureFormTaxInfoTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _tax_ag_grid_row__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tax-ag-grid-row */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-ag-grid-row.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component */ "./Client/app/shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component.ts");
/* harmony import */ var _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component */ "./Client/app/shared/components/ag-contextual-menu/ag-contextual-menu.component.ts");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _tax_grid_action_tax_grid_action_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./tax-grid-action/tax-grid-action.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.ts");
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












var CounterpartyCaptureFormTaxInfoTabComponent = /** @class */ (function (_super) {
    __extends(CounterpartyCaptureFormTaxInfoTabComponent, _super);
    function CounterpartyCaptureFormTaxInfoTabComponent(route, formConfigurationProvider, masterdataService, snackbarService, dialog) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.route = route;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.masterdataService = masterdataService;
        _this.snackbarService = snackbarService;
        _this.dialog = dialog;
        _this.taxGridOptions = {};
        _this.countryList = new Array();
        _this.gridContext = {
            gridEditable: true,
        };
        _this.gridContext1 = {
            gridEditable: false,
        };
        _this.checkIfFavorite = false;
        _this.taxMenuActions = {
            deleteTax: 'delete',
        };
        _this.agGridOptions = {};
        _this.sideNavOpened = false;
        _this.isDeleteDisabled = false;
        _this.isViewMode = false;
        _this.taxGridOptions = {
            context: { componentParent: _this },
        };
        return _this;
    }
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.company = this.route.snapshot.params['company'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.masterdata.countries.forEach(function (element) {
            _this.countryList.push(element.countryCode);
        });
        this.init();
        this.initializeGridColumns();
        this.initTaxsGridRows();
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.init = function () {
        var newTaxRow = new _tax_ag_grid_row__WEBPACK_IMPORTED_MODULE_2__["TaxListDisplayView"]();
        this.taxGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.taxMenuActions.deleteTax,
                disabled: this.isDeleteDisabled,
            },
        ];
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.updateAllRow = function (rowIndex) {
        if (!this.isViewMode) {
            this.gridApi.forEachNode(function (rowNode, index) {
                rowNode.setDataValue("main", false);
                if (index == rowIndex) {
                    rowNode.data.main = true;
                }
            });
        }
        this.gridApi.refreshView();
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.onGridReady = function (params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.gridApi = this.agGridOptions.api;
        this.gridColumnApi = this.agGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.onAddRowButtonClicked = function () {
        var newItem = this.createNewRowData();
        var res = this.gridApi.updateRowData({ add: [newItem] });
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.createNewRowData = function () {
        var newTaxRow = new _tax_ag_grid_row__WEBPACK_IMPORTED_MODULE_2__["TaxListDisplayView"]();
        return newTaxRow;
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.initTaxsGridRows = function () {
        if (this.counterpartyTaxes) {
            this.counterpartyTaxes = this.counterpartyTaxes.filter(function (p) { return p.isDeactivated === false; });
        }
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.isGridEditable = function (params) {
        return params.context.gridEditable;
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.requiredCell = function (params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.handleAction = function (action, tax) {
        var _this = this;
        switch (action) {
            case this.taxMenuActions.deleteTax:
                var confirmDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationDialogComponent"], {
                    data: {
                        title: 'Tax Deletion',
                        text: 'Do you confirm the deletion?',
                        okButton: 'Yes',
                        cancelButton: 'No',
                    },
                });
                var confirmationDeleteSubscription = confirmDialog.afterClosed().subscribe(function (answer) {
                    if (answer) {
                        _this.gridApi.updateRowData({ remove: [tax] });
                        _this.taxGridOptions.api.refreshView();
                        _this.counterpartyTaxes.forEach(function (row) {
                            if (row.counterpartyTaxId === tax.counterpartyTaxId) {
                                row.isDeactivated = true;
                            }
                        });
                    }
                });
                this.subscriptions.push(confirmationDeleteSubscription);
                break;
            default: this.assertUnreachable(action);
        }
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.assertUnreachable = function (x) {
        throw new Error('Unknown action');
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.initializeGridColumns = function () {
        this.taxGridOptions = {
            context: this.isViewMode ? this.gridContext1 : this.gridContext,
        };
        this.taxGridCols = [
            {
                headerName: 'VAT Registration',
                field: 'vatRegistrationNumber',
                colId: 'vatRegistrationNumber',
                width: 300,
                minWidth: 300,
                maxWidth: 300,
                editable: this.isViewMode ? false : true,
                cellRenderer: this.requiredCell,
            },
            {
                headerName: 'Country Code',
                field: 'countryId',
                colId: 'countryId',
                width: 600,
                minWidth: 600,
                maxWidth: 600,
                cellRendererFramework: _shared_components_ag_grid_autocomplete_ag_grid_autocomplete_component__WEBPACK_IMPORTED_MODULE_5__["AgGridAutocompleteComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.countries,
                    valueProperty: 'countryId',
                    codeProperty: 'description',
                    displayProperty: 'countryCode',
                    isRequired: function (params) {
                        return true;
                    },
                },
                onCellValueChanged: function (params) {
                },
            },
            {
                headerName: '',
                field: 'main',
                cellRendererFramework: _tax_grid_action_tax_grid_action_component__WEBPACK_IMPORTED_MODULE_11__["TaxGridActionComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
                width: 100,
                minWidth: 100,
                maxWidth: 100,
            },
            {
                headerName: '',
                field: 'isDeactivated',
                colId: 'isDeactivated',
                hide: this.isViewMode ? true : false,
                cellRendererFramework: _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_6__["AgContextualMenuComponent"],
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.isViewMode ? this.gridContext1 : this.gridContext,
                    },
                    menuActions: this.taxGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                width: 100,
                minWidth: 100,
                maxWidth: 100,
            },
        ];
    };
    CounterpartyCaptureFormTaxInfoTabComponent.prototype.validate = function () {
        var _this = this;
        var isValid = true;
        var counterpartyTaxesValidations = this.counterpartyTaxes;
        this.counterpartyTaxes = [];
        this.gridApi.forEachNode(function (rowData) {
            if (!(rowData.data.vatRegistrationNumber && rowData.data.countryId)) {
                isValid = false;
            }
            else {
                var taxListDisplayView = new _tax_ag_grid_row__WEBPACK_IMPORTED_MODULE_2__["TaxListDisplayView"]();
                taxListDisplayView.counterpartyTaxId = rowData.data.counterpartyTaxId;
                taxListDisplayView.vatRegistrationNumber = rowData.data.vatRegistrationNumber;
                taxListDisplayView.countryId = rowData.data.countryId;
                taxListDisplayView.main = rowData.data.main;
                _this.counterpartyTaxes.push(taxListDisplayView);
            }
        });
        if (counterpartyTaxesValidations && counterpartyTaxesValidations.length > 0 &&
            this.counterpartyTaxes && this.counterpartyTaxes.length > 0) {
            counterpartyTaxesValidations.forEach(function (obj) {
                var objExists = _this.counterpartyTaxes.find(function (cp) { return cp.counterpartyTaxId === obj.counterpartyTaxId; });
                if (!objExists && obj.isDeactivated) {
                    _this.counterpartyTaxes.push(obj);
                }
            });
        }
        return isValid;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], CounterpartyCaptureFormTaxInfoTabComponent.prototype, "isViewMode", void 0);
    CounterpartyCaptureFormTaxInfoTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-counterparty-capture-form-tax-info-tab',
            template: __webpack_require__(/*! ./counterparty-capture-form-tax-info-tab.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.html"),
            styles: [__webpack_require__(/*! ./counterparty-capture-form-tax-info-tab.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_9__["FormConfigurationProviderService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_3__["MasterdataService"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_10__["SnackbarService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialog"]])
    ], CounterpartyCaptureFormTaxInfoTabComponent);
    return CounterpartyCaptureFormTaxInfoTabComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_8__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-ag-grid-row.ts":
/*!***************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-ag-grid-row.ts ***!
  \***************************************************************************************************************************/
/*! exports provided: TaxListDisplayView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxListDisplayView", function() { return TaxListDisplayView; });
var TaxListDisplayView = /** @class */ (function () {
    function TaxListDisplayView() {
    }
    return TaxListDisplayView;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.html":
/*!*******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.html ***!
  \*******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-icon-button\r\n        type=\"button\"\r\n        (click)='setFavorite(rowIndex)'\r\n        matTooltip=\"Make favorite\">\r\n    <mat-icon [ngClass]=\"isFavorite ? 'heart-saved' : 'heart-not-saved'\">\r\n        {{isFavorite ? 'favorite' : 'favorite_border'}}\r\n    </mat-icon>\r\n</button>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.scss":
/*!*******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.scss ***!
  \*******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.ts":
/*!*****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.ts ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: TaxGridActionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxGridActionComponent", function() { return TaxGridActionComponent; });
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

var TaxGridActionComponent = /** @class */ (function () {
    function TaxGridActionComponent() {
        this.isFavorite = false;
    }
    TaxGridActionComponent.prototype.agInit = function (params) {
        this.params = params;
        this.rowIndex = params.rowIndex;
        this.cellValue = params.value;
        this.params.value ? this.isFavorite = true : this.isFavorite = false;
    };
    TaxGridActionComponent.prototype.ngOnInit = function () {
    };
    TaxGridActionComponent.prototype.setFavorite = function (rowIndex) {
        this.params.context.componentParent.updateAllRow(rowIndex);
    };
    TaxGridActionComponent.prototype.refresh = function (params) {
        return false;
    };
    TaxGridActionComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-tax-grid-action',
            template: __webpack_require__(/*! ./tax-grid-action.component.html */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.html"),
            styles: [__webpack_require__(/*! ./tax-grid-action.component.scss */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], TaxGridActionComponent);
    return TaxGridActionComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.html":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/referential-counterparties.component.html ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<atlas-referential-counterparty-tab #referentialComponent\r\n                                    (localViewMode)=\"onLocalViewModeCalled($event)\">\r\n</atlas-referential-counterparty-tab>\r\n\r\n<div class=\"main-container\">\r\n    <mat-card>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start none\"\r\n             class=\"search\">\r\n            <atlas-masterdata-user-preferences-input fxFlex=\"60%\"\r\n                                                     isEditable=\"true\"\r\n                                                     [fieldControl]=\"accountReferenceCtrl\"\r\n                                                     (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                                                     [options]=\"filteredCounterPartyList\"\r\n                                                     label=\"Counterparty\"\r\n                                                     displayProperty=\"counterpartyCode\"\r\n                                                     [selectProperties]=\"['counterpartyCode', 'description']\"\r\n                                                     [errorMap]=\"counterpartyErrorMap\"\r\n                                                     lightBoxTitle=\"Results for Counterparty\"\r\n                                                     gridId=\"counterpartiesGrid\"\r\n                                                     (optionSelected)=\"onCounterpartyIdSelected($event)\">\r\n            </atlas-masterdata-user-preferences-input>\r\n\r\n            <atlas-dropdown-select fxFlex='90%'\r\n                                   [label]=\"'Account Type'\"\r\n                                   [fieldControl]=\"counterPartyTypeCtrl\"\r\n                                   (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                                   [errorMap]=\"snapshotErrorMap\"\r\n                                   isEditable=true\r\n                                   [options]=\"filteredAccTypesList\"\r\n                                   displayProperty=\"name\"\r\n                                   [selectProperties]=\"['name']\"\r\n                                   [isAutocompleteActivated]=\"isAutoCompleteActivated\"></atlas-dropdown-select>\r\n\r\n\r\n            <button mat-raised-button\r\n                    (click)=\"onQuickSearchButtonClicked()\"\r\n                    class=\"heroGradient\">\r\n                <mat-icon aria-label=\"Search\"\r\n                          class=\"search-icon\">search</mat-icon>\r\n            </button>\r\n        </div>\r\n    </mat-card>\r\n    <atlas-list-and-search [gridCode]=\"gridCode\"\r\n                           [gridTitle]=\"'Counterparties'\"\r\n                           [company]=\"company\"\r\n                           (rowClicked)=\"onCounterPartyRowClicked($event)\"\r\n                           (configurationLoaded)=\"onConfigurationLoaded()\"\r\n                           [additionalFilters]=\"additionalFilters\"\r\n                           [dataLoader]=\"dataLoader\"\r\n                           [pageSize]=\"100\"\r\n                           [hasQuickSum]=\"false\"\r\n                           [hasGrouping]=\"true\"\r\n                           toogleText=\"Show Duplicate Counterparty data\"\r\n                           #listAndSearchComponent\r\n                           class=\"default-height\">\r\n    </atlas-list-and-search>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.scss":
/*!****************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/referential-counterparties.component.scss ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.ts":
/*!**************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparties/referential-counterparties.component.ts ***!
  \**************************************************************************************************************/
/*! exports provided: ReferentialCounterpartiesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialCounterpartiesComponent", function() { return ReferentialCounterpartiesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/base-form-component/base-form-component.component */ "./Client/app/shared/components/base-form-component/base-form-component.component.ts");
/* harmony import */ var _shared_components_list_and_search_list_and_search_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/components/list-and-search/list-and-search.component */ "./Client/app/shared/components/list-and-search/list-and-search.component.ts");
/* harmony import */ var _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/entities/list-and-search/list-and-search-filter.entity */ "./Client/app/shared/entities/list-and-search/list-and-search-filter.entity.ts");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/enums/list-and-search-filter-type.enum */ "./Client/app/shared/enums/list-and-search-filter-type.enum.ts");
/* harmony import */ var _shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../shared/services/form-configuration-provider.service */ "./Client/app/shared/services/form-configuration-provider.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_list_and_search_referentialCounterparties_data_loader__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../shared/services/list-and-search/referentialCounterparties-data-loader */ "./Client/app/shared/services/list-and-search/referentialCounterparties-data-loader.ts");
/* harmony import */ var _shared_services_title_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../shared/services/title.service */ "./Client/app/shared/services/title.service.ts");
/* harmony import */ var _shared_services_util_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../shared/services/util.service */ "./Client/app/shared/services/util.service.ts");
/* harmony import */ var _referential_counterparty_tab_referential_counterparty_tab_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../referential-counterparty-tab/referential-counterparty-tab.component */ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.ts");
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
















var ReferentialCounterpartiesComponent = /** @class */ (function (_super) {
    __extends(ReferentialCounterpartiesComponent, _super);
    function ReferentialCounterpartiesComponent(formConfigurationProvider, formBuilder, masterdataService, companyManager, utilService, route, router, dataLoader, titleService) {
        var _this = _super.call(this, formConfigurationProvider) || this;
        _this.formConfigurationProvider = formConfigurationProvider;
        _this.formBuilder = formBuilder;
        _this.masterdataService = masterdataService;
        _this.companyManager = companyManager;
        _this.utilService = utilService;
        _this.route = route;
        _this.router = router;
        _this.dataLoader = dataLoader;
        _this.titleService = titleService;
        _this.gridCode = 'referentialCounterPartiesGrid';
        _this.accountReferenceCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.counterPartyTypeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        _this.additionalFilters = [];
        _this.snapshotErrorMap = new Map();
        _this.masterdataList = [
            _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_8__["MasterDataProps"].Counterparties
        ];
        _this.counterpartyErrorMap = new Map()
            .set('required', 'Required *')
            .set('inDropdownList', 'Invalid entry. Client not in the list.');
        _this.isAutoCompleteActivated = true;
        _this.isLocalViewModeSelected = false;
        return _this;
    }
    ReferentialCounterpartiesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.masterData = this.route.snapshot.data.masterdata;
        this.filterCounterparties();
        this.allAccTypesList = this.masterData.accountTypes;
        this.filteredAccTypesList = this.masterData.accountTypes;
        this.counterPartyTypeCtrl.valueChanges.subscribe(function (input) {
            _this.filteredAccTypesList = _this.utilService.filterListforAutocomplete(input, _this.allAccTypesList, ['name']);
        });
    };
    ReferentialCounterpartiesComponent.prototype.filterCounterparties = function () {
        var _this = this;
        this.searchedCounterpartyCode = this.counterpartyValue;
        var counterpartyList = [];
        this.filteredCounterPartyList = this.masterData.counterparties;
        counterpartyList = this.filteredCounterPartyList;
        this.accountReferenceCtrl.valueChanges.subscribe(function (input) {
            _this.filteredCounterPartyList = _this.utilService.filterListforAutocomplete(input, counterpartyList, ['counterpartyCode', 'description']);
            if (_this.accountReferenceCtrl.valid) {
                // this.onCounterpartyIdSelected(this.accountReferenceCtrl.value);
            }
        });
    };
    ReferentialCounterpartiesComponent.prototype.onCounterpartyIdSelected = function (value) {
        this.counterpartyValue = this.accountReferenceCtrl.value;
    };
    ReferentialCounterpartiesComponent.prototype.onQuickSearchButtonClicked = function () {
        if (this.accountReferenceCtrl.value && typeof this.accountReferenceCtrl.value === 'object') {
            this.accountReferenceCtrl.patchValue(this.accountReferenceCtrl.value);
        }
        if (this.counterPartyTypeCtrl.value && typeof this.counterPartyTypeCtrl.value === 'object') {
            this.counterPartyTypeCtrl.patchValue(this.counterPartyTypeCtrl.value);
        }
        if (!this.listAndSearchComponent) {
            return;
        }
        this.additionalFilters = [];
        var accountRefField = this.listAndSearchComponent.columnConfiguration
            .find(function (column) { return column.fieldName === 'CounterpartyCode'; });
        var accountRefTypeField = this.listAndSearchComponent.columnConfiguration
            .find(function (column) { return column.fieldName === 'CounterpartyType'; });
        if (this.accountReferenceCtrl.value) {
            var filterAccountsRef = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
            var filterAccountRef = void 0;
            if (accountRefField) {
                filterAccountRef = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
                filterAccountRef.fieldId = accountRefField.fieldId;
                filterAccountRef.fieldName = accountRefField.fieldName;
                filterAccountRef.predicate = {
                    filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_9__["ListAndSearchFilterType"].Text,
                    operator: 'eq',
                    value1: this.accountReferenceCtrl.value.counterpartyCode + '%',
                };
                filterAccountRef.isActive = true;
                filterAccountsRef.logicalOperator = 'or';
                filterAccountsRef.clauses = [filterAccountRef];
                this.additionalFilters.push(filterAccountsRef);
            }
        }
        if (this.counterPartyTypeCtrl.value && accountRefTypeField) {
            var filterContractNo = new _shared_entities_list_and_search_list_and_search_filter_entity__WEBPACK_IMPORTED_MODULE_7__["ListAndSearchFilter"]();
            filterContractNo.fieldId = accountRefTypeField.fieldId;
            filterContractNo.fieldName = accountRefTypeField.fieldName;
            filterContractNo.predicate = {
                filterType: _shared_enums_list_and_search_filter_type_enum__WEBPACK_IMPORTED_MODULE_9__["ListAndSearchFilterType"].Text,
                operator: 'eq',
                value1: this.counterPartyTypeCtrl.value.name + '%',
            };
            filterContractNo.isActive = true;
            this.additionalFilters.push(filterContractNo);
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    };
    ReferentialCounterpartiesComponent.prototype.onCounterPartyRowClicked = function (event) {
        if (event) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/display',
                event.data.counterpartyID]);
        }
    };
    ReferentialCounterpartiesComponent.prototype.onLocalViewModeCalled = function (event) {
        if (event && event === 1) {
            this.isLocalViewModeSelected = true;
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('c2CCode', true);
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('tradeStatus', true);
        }
        else {
            this.isLocalViewModeSelected = false;
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('c2CCode', false);
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('tradeStatus', false);
        }
        this.listAndSearchComponent.loadData(true);
    };
    ReferentialCounterpartiesComponent.prototype.onConfigurationLoaded = function () {
        var _this = this;
        this.listAndSearchComponent.columnConfiguration.filter(function (colProperties) {
            return colProperties.fieldName === 'C2CCode' || colProperties.fieldName === 'TradeStatus' || colProperties.fieldName === 'IsDeactivated';
        }).forEach(function (colProperties) { return colProperties.isVisible = _this.isLocalViewModeSelected; });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuTrigger"])
    ], ReferentialCounterpartiesComponent.prototype, "columnMenuTrigger", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('listAndSearchComponent'),
        __metadata("design:type", _shared_components_list_and_search_list_and_search_component__WEBPACK_IMPORTED_MODULE_6__["ListAndSearchComponent"])
    ], ReferentialCounterpartiesComponent.prototype, "listAndSearchComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('referentialComponent'),
        __metadata("design:type", _referential_counterparty_tab_referential_counterparty_tab_component__WEBPACK_IMPORTED_MODULE_15__["ReferentialCounterpartyTabComponent"])
    ], ReferentialCounterpartiesComponent.prototype, "referentialComponent", void 0);
    ReferentialCounterpartiesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-referential-counterparties',
            providers: [_shared_services_list_and_search_referentialCounterparties_data_loader__WEBPACK_IMPORTED_MODULE_12__["ReferentialCounterpartiesDataLoader"]],
            template: __webpack_require__(/*! ./referential-counterparties.component.html */ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.html"),
            styles: [__webpack_require__(/*! ./referential-counterparties.component.scss */ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_form_configuration_provider_service__WEBPACK_IMPORTED_MODULE_10__["FormConfigurationProviderService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_11__["MasterdataService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_4__["CompanyManagerService"],
            _shared_services_util_service__WEBPACK_IMPORTED_MODULE_14__["UtilService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _shared_services_list_and_search_referentialCounterparties_data_loader__WEBPACK_IMPORTED_MODULE_12__["ReferentialCounterpartiesDataLoader"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_13__["TitleService"]])
    ], ReferentialCounterpartiesComponent);
    return ReferentialCounterpartiesComponent;
}(_shared_components_base_form_component_base_form_component_component__WEBPACK_IMPORTED_MODULE_5__["BaseFormComponent"]));



/***/ }),

/***/ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.html":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.html ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div matToolbarHighlight\r\n     class=\"dark-tab header-tab mat-elevation-z6\">\r\n    <div class=\"header-tab-container\"\r\n         *ngIf=\"isEditCounterpartyPrivilege\">\r\n        <button mat-raised-button\r\n                class=\"fab-text-button\"\r\n                color=\"accent\"\r\n                [matMenuTriggerFor]=\"menu\">\r\n            <mat-icon class=\"material-icons\">add</mat-icon>\r\n            COUNTERPARTY ACTIONS\r\n        </button>\r\n        <mat-menu #menu=\"matMenu\"\r\n                  class=\"floating-menu has-header\">\r\n            <button mat-menu-item\r\n                    class=\"menu-header\">\r\n                <mat-icon class=\"material-icons\">add</mat-icon>\r\n                <span>COUNTERPARTY ACTIONS</span>\r\n            </button>\r\n            <button mat-menu-item\r\n                    (click)=\"onCreateCounterpartyButtonClicked()\">\r\n                <mat-icon class=\"material-icons\">add</mat-icon>\r\n                Create Counterparty\r\n            </button>\r\n            <button mat-menu-item\r\n                    (click)=\"onCreateBulkCounterpartyButtonClicked()\">\r\n                <mat-icon class=\"material-icons\">add</mat-icon>\r\n                Bulk Amendment\r\n            </button>\r\n        </mat-menu>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"start center\"\r\n         fxLayoutGap=\"1%\">\r\n        <mat-tab-group (selectedIndexChange)=\"onSelectModeChanged($event)\"\r\n                       aria-label=\"Contract Type\"\r\n                       mat-align-tabs=\"start\"\r\n                       [value]=\"selectedCounterpartyDisplayVal\">\r\n            <mat-tab value=\"Global\"\r\n                     [checked]=\"true\"\r\n                     label=\"Global View Mode\">\r\n            </mat-tab>\r\n            <mat-tab value=\"Local\"\r\n                     label=\"Local View Mode\">\r\n            </mat-tab>\r\n            <mat-tab>\r\n                <ng-template mat-tab-label>\r\n                    <label [matMenuTriggerFor]=\"reports\"\r\n                           (click)=\"$event.stopPropagation()\">\r\n                        Reports\r\n                    </label>\r\n                    <mat-menu #reports=\"matMenu\"\r\n                              [overlapTrigger]=\"false\"\r\n                              xPosition=\"after\">\r\n                        <span *ngFor=\"let item of filteredTemplates\">\r\n                            <button mat-button\r\n                                    (click)=\"OnReportClick(item)\">\r\n                                {{item.name}}\r\n                            </button>\r\n                        </span>\r\n                    </mat-menu>\r\n                </ng-template>\r\n            </mat-tab>\r\n        </mat-tab-group>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.scss":
/*!********************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.scss ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".header-tab {\n  margin-bottom: 40px; }\n\n.menu-header {\n  background-color: #53c234;\n  color: white; }\n\n.menu-header mat-icon {\n    color: white; }\n\n.menu-header:hover {\n  background-color: #53c234;\n  color: white; }\n\n.menu-header:hover mat-icon {\n    color: white; }\n\n.floating-menu {\n  top: -1px; }\n\n.toggle-button-counterparty {\n  margin-left: 77px;\n  margin-top: 60px; }\n\n.mat-button-toggle.mat-button-toggle-checked {\n  background-color: #53c234 !important;\n  color: white !important; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.ts":
/*!******************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.ts ***!
  \******************************************************************************************************************/
/*! exports provided: ReferentialCounterpartyTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialCounterpartyTabComponent", function() { return ReferentialCounterpartyTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_services_security_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/services/security.service */ "./Client/app/shared/services/security.service.ts");
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/services/authorization.service */ "./Client/app/core/services/authorization.service.ts");
/* harmony import */ var _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/enums/permission-level.enum */ "./Client/app/shared/enums/permission-level.enum.ts");
/* harmony import */ var _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/services/http-services/document.service */ "./Client/app/shared/services/http-services/document.service.ts");
/* harmony import */ var _shared_components_generic_report_viewer_generic_report_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/components/generic-report-viewer/generic-report-viewer.component */ "./Client/app/shared/components/generic-report-viewer/generic-report-viewer.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ReferentialCounterpartyTabComponent = /** @class */ (function () {
    function ReferentialCounterpartyTabComponent(route, router, securityService, authorizationService, companyManager, documentService, dialog) {
        this.route = route;
        this.router = router;
        this.securityService = securityService;
        this.authorizationService = authorizationService;
        this.companyManager = companyManager;
        this.documentService = documentService;
        this.dialog = dialog;
        this.isEditCounterpartyPrivilege = false;
        this.localViewMode = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.filteredTemplates = new Array();
    }
    ReferentialCounterpartyTabComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.company = this.route.snapshot.paramMap.get('company');
        this.selectedCounterpartyDisplayVal = 'Global view Mode';
        this.securityService.isSecurityReady().subscribe(function () {
            if (_this.authorizationService.isPrivilegeAllowed(_this.company, 'Referential')) {
                var permissionLevel = void 0;
                permissionLevel = _this.authorizationService.getPermissionLevel(_this.company, 'TradingAndExecution', 'Referential');
                if (permissionLevel == _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_5__["PermissionLevels"].ReadWrite) {
                    _this.isEditCounterpartyPrivilege = _this.authorizationService.isPrivilegeAllowed(_this.company, 'TradingAndExecution');
                }
            }
        });
        var documentType = 76;
        this.documentService.getTemplates(documentType, 'Counterparties').subscribe(function (templates) {
            _this.filteredTemplates = templates.value;
        });
    };
    ReferentialCounterpartyTabComponent.prototype.onCreateCounterpartyButtonClicked = function () {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/capture']);
    };
    ReferentialCounterpartyTabComponent.prototype.onCreateBulkCounterpartyButtonClicked = function () {
        this.router.navigate([this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
    };
    ReferentialCounterpartyTabComponent.prototype.onSelectModeChanged = function (event) {
        this.localViewMode.emit(event);
    };
    ReferentialCounterpartyTabComponent.prototype.OnReportClick = function (data) {
        var openTradepnlReportDialog = this.dialog.open(_shared_components_generic_report_viewer_generic_report_viewer_component__WEBPACK_IMPORTED_MODULE_7__["GenericReportViewerComponent"], {
            data: {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ReferentialCounterpartyTabComponent.prototype, "localViewMode", void 0);
    ReferentialCounterpartyTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-referential-counterparty-tab',
            template: __webpack_require__(/*! ./referential-counterparty-tab.component.html */ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.html"),
            styles: [__webpack_require__(/*! ./referential-counterparty-tab.component.scss */ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _shared_services_security_service__WEBPACK_IMPORTED_MODULE_3__["SecurityService"], _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_4__["AuthorizationService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_2__["CompanyManagerService"], _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_6__["DocumentService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDialog"]])
    ], ReferentialCounterpartyTabComponent);
    return ReferentialCounterpartyTabComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.html":
/*!******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.html ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>{{popupTitle}} {{dialogData.masterdataName}} to companies</h2>\r\n<mat-dialog-content class=\"mat-dialog-content\">\r\n    <div fxLayout=\"column\"\r\n         fxLayoutAlign=\"start\">\r\n    </div>\r\n    <div>\r\n        <div ag-grid=\"agGridOptions\">\r\n            <ag-grid-angular class=\"ag-theme-material\"\r\n                             domLayout=autoHeight\r\n                             (gridReady)=\"onGridReady($event)\"\r\n                             [rowData]=\"agGridRows\"\r\n                             [columnDefs]=\"companyGridCols\"\r\n                             [gridOptions]=\"agGridOptions\"\r\n                             [enableColResize]=\"true\"\r\n                             [pagination]=\"true\"\r\n                             rowSelection=\"multiple\"\r\n                             [enableSorting]=\"true\"\r\n                             [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                             [headerHeight]=\"atlasAgGridParam.headerHeight\">\r\n            </ag-grid-angular>\r\n        </div>\r\n    </div>\r\n    <div fxLayout=\"row\"\r\n         fxLayoutAlign=\"end center\">\r\n        <button mat-button\r\n                (click)=\"onCancelButtonClicked()\">Cancel</button>\r\n        <button mat-button\r\n                (click)=\"onSaveButtonClicked()\">Save</button>\r\n    </div>\r\n</mat-dialog-content>\r\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.scss":
/*!******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.scss ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.ts":
/*!****************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.ts ***!
  \****************************************************************************************************************************************************/
/*! exports provided: AssignMasterdataDialogBoxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssignMasterdataDialogBoxComponent", function() { return AssignMasterdataDialogBoxComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_components_ag_grid_checkbox_tri_state_ag_grid_checkbox_tri_state_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../shared/components/ag-grid/checkbox-tri-state/ag-grid-checkbox-tri-state.component */ "./Client/app/shared/components/ag-grid/checkbox-tri-state/ag-grid-checkbox-tri-state.component.ts");
/* harmony import */ var _referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./referential-masterdata-menu-actions.enum */ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/referential-masterdata-menu-actions.enum.ts");
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







var AssignMasterdataDialogBoxComponent = /** @class */ (function () {
    function AssignMasterdataDialogBoxComponent(companyManager, agGridService, thisDialogRef, masterDataService, data) {
        this.companyManager = companyManager;
        this.agGridService = agGridService;
        this.thisDialogRef = thisDialogRef;
        this.masterDataService = masterDataService;
        this.data = data;
        this.agGridOptions = {};
        this.companyGridCols = [];
        this.company = this.companyManager.getCurrentCompanyId();
        this.dialogData = data;
        this.popupTitle = this.dialogData.actionType === 'assign' ? 'Assign' : 'Deactivate';
    }
    AssignMasterdataDialogBoxComponent.prototype.ngOnInit = function () {
        this.atlasAgGridParam = this.agGridService.getAgGridParam();
        this.initCompanyGridCols();
        this.getData();
    };
    AssignMasterdataDialogBoxComponent.prototype.getData = function () {
        var _this = this;
        switch (this.dialogData.actionType) {
            case _referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_6__["ReferentialMasterdataMenuActions"].assign:
                this.masterDataService.getMasterDataAssignments(this.data.masterdataName, this.data.selected).subscribe(function (companyAssignments) {
                    _this.agGridRows = companyAssignments;
                    _this.agGridRows.forEach(function (row) {
                        row.originalAssignmentState = row.assignmentState;
                        row.isTouched = false;
                    });
                });
                break;
            case _referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_6__["ReferentialMasterdataMenuActions"].deactivate:
                this.masterDataService.getMasterDataActivated(this.data.masterdataName, this.data.selected).subscribe(function (companyActivations) {
                    _this.agGridRows = companyActivations;
                    _this.agGridRows.forEach(function (row) {
                        row.originalActivationState = row.activationState;
                        row.isTouched = false;
                    });
                });
                break;
        }
    };
    AssignMasterdataDialogBoxComponent.prototype.onGridReady = function (params) {
        this.agGridOptions = params;
        params.columnDefs = this.companyGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.columnAPI = this.agGridOptions.columnApi;
        this.agGridService.sizeColumns(this.agGridOptions);
    };
    AssignMasterdataDialogBoxComponent.prototype.onSaveButtonClicked = function () {
        this.thisDialogRef.close(this.agGridRows.filter(function (row) { return row.isTouched; }));
    };
    AssignMasterdataDialogBoxComponent.prototype.onCancelButtonClicked = function () {
        this.thisDialogRef.close(false);
    };
    AssignMasterdataDialogBoxComponent.prototype.initCompanyGridCols = function () {
        var fieldState;
        var originalFieldState;
        var headerName = '';
        var fixWidth;
        switch (this.dialogData.actionType) {
            case _referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_6__["ReferentialMasterdataMenuActions"].assign:
                fieldState = 'assignmentState';
                originalFieldState = 'originalAssignmentState';
                fixWidth = 60;
                break;
            case _referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_6__["ReferentialMasterdataMenuActions"].deactivate:
                fieldState = 'activationState';
                originalFieldState = 'originalActivationState';
                headerName = 'Is Active';
                fixWidth = 120;
                break;
        }
        this.companyGridCols = [
            {
                headerName: headerName,
                colId: 'selection',
                field: fieldState,
                cellRendererFramework: _shared_components_ag_grid_checkbox_tri_state_ag_grid_checkbox_tri_state_component__WEBPACK_IMPORTED_MODULE_5__["AgGridCheckboxTriStateComponent"],
                cellRendererParams: {
                    disabled: false,
                    originalCheckStatusField: originalFieldState,
                    onCellValueChanged: function (params) { params.data.isTouched = true; },
                },
                minWidth: fixWidth,
                maxWidth: fixWidth,
                pinned: 'left',
            },
            {
                headerName: 'Company',
                colId: 'companyCode',
                field: 'companyCode',
            },
        ];
    };
    AssignMasterdataDialogBoxComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-assign-masterdata-dialog-box',
            template: __webpack_require__(/*! ./assign-masterdata-dialog-box.component.html */ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.html"),
            styles: [__webpack_require__(/*! ./assign-masterdata-dialog-box.component.scss */ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.scss")],
        }),
        __param(4, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_2__["CompanyManagerService"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_3__["AgGridService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_4__["MasterdataService"], Object])
    ], AssignMasterdataDialogBoxComponent);
    return AssignMasterdataDialogBoxComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/referential-masterdata-menu-actions.enum.ts":
/*!******************************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/referential-masterdata-menu-actions.enum.ts ***!
  \******************************************************************************************************************************************************/
/*! exports provided: ReferentialMasterdataMenuActions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialMasterdataMenuActions", function() { return ReferentialMasterdataMenuActions; });
var ReferentialMasterdataMenuActions;
(function (ReferentialMasterdataMenuActions) {
    ReferentialMasterdataMenuActions["deleteRows"] = "delete";
    ReferentialMasterdataMenuActions["assign"] = "assign";
    ReferentialMasterdataMenuActions["deactivate"] = "deactivate";
})(ReferentialMasterdataMenuActions || (ReferentialMasterdataMenuActions = {}));


/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.html":
/*!******************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.html ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div matToolbarHighlight\r\n     class=\"dark-tab header-tab mat-elevation-z6\">\r\n    <div class=\"header-tab-container\">\r\n        <nav mat-tab-nav-bar>\r\n            <a mat-tab-link\r\n               (click)=\"onSelectedIndexChanged('global')\"\r\n               [active]=\"viewModeGlobal\"\r\n               *ngIf=\"isGlobal\">\r\n                Global View Mode\r\n            </a>\r\n            <a mat-tab-link\r\n               (click)=\"onSelectedIndexChanged('local')\"\r\n               [active]=\"!viewModeGlobal\"\r\n               *ngIf=\"isLocal\">\r\n                Local View Mode\r\n            </a>\r\n            <a mat-tab-link\r\n               [matMenuTriggerFor]=\"reports\"\r\n               [disabled]=\"menuDisable\"\r\n               *ngIf=\"isReportVisible\">\r\n                Reports\r\n            </a>\r\n            <mat-menu #reports=\"matMenu\"\r\n                      [overlapTrigger]=\"false\"\r\n                      xPosition=\"after\">\r\n                <span *ngFor=\"let item of filteredTemplates\">\r\n                    <button mat-button\r\n                            (click)=\"onReportClick(item)\">\r\n                        {{item.name}}\r\n                    </button>\r\n                </span>\r\n            </mat-menu>\r\n        </nav>\r\n    </div>\r\n</div>\r\n<div class=\"main-container\">\r\n    <mat-card>\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"start none\"\r\n             class=\"search\">\r\n            <mat-form-field>\r\n                <input matInput\r\n                       [formControl]=\"masterDataCodeCtrl\"\r\n                       placeholder=\"Code\"\r\n                       autocomplete=\"off\"\r\n                       (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                       #message>\r\n            </mat-form-field>\r\n            <mat-form-field>\r\n                <input matInput\r\n                       [formControl]=\"masterDataDescriptionCtrl\"\r\n                       placeholder=\"Description\"\r\n                       autocomplete=\"off\"\r\n                       (keydown.enter)=\"onQuickSearchButtonClicked()\"\r\n                       #action>\r\n            </mat-form-field>\r\n            <button mat-raised-button\r\n                    (click)=\"onQuickSearchButtonClicked()\"\r\n                    class=\"heroGradient\">\r\n                <mat-icon aria-label=\"Search\"\r\n                          class=\"search-icon\">search</mat-icon>\r\n            </button>\r\n        </div>\r\n    </mat-card>\r\n    <mat-card *ngIf=\"!isLoading\">\r\n        <div fxLayout=\"row\"\r\n             fxLayout.xs=\"column\"\r\n             fxLayoutAlign=\"space-between center\"\r\n             fxLayoutWrap\r\n             fxLayoutGap=\"20px\"\r\n             class=\"atlas-grid-card-header\">\r\n            <mat-card-title class=\"no-margin\">{{ masterdataFriendlyName }}</mat-card-title>\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"end end\">\r\n                <div *ngIf=\"!isEdit\">\r\n                    <button *ngIf=\"(((this.isLocal && !this.isGlobal) && !this.viewModeGlobal)\r\n                                    || ((this.isLocal && this.isGlobal) && this.viewModeGlobal)\r\n                                    || ((!this.isLocal && this.isGlobal) && this.viewModeGlobal))\"\r\n                            mat-button\r\n                            (click)=\"handleSelectedMasterdataAction(userMenuActions.assign)\"\r\n                            matTooltip=\"assign all selected masterdatas\">\r\n                        Assign Selected\r\n                    </button>\r\n                    <button *ngIf=\"(((this.isLocal && !this.isGlobal) && !this.viewModeGlobal)\r\n                                     || ((this.isLocal && this.isGlobal) && this.viewModeGlobal)\r\n                                      ||((!this.isLocal && this.isGlobal) && this.viewModeGlobal))\"\r\n                            mat-button\r\n                            (click)=\"handleSelectedMasterdataAction(userMenuActions.deactivate)\"\r\n                            matTooltip=\"deactivate all selected masterdatas\">\r\n                        Deactivate Selected\r\n                    </button>\r\n                    <button *ngIf=\"viewModeGlobal\"\r\n                            mat-button\r\n                            (click)=\"handleSelectedMasterdataAction(userMenuActions.deleteRows)\"\r\n                            matTooltip=\"delete all selected masterdatas\">\r\n                        Delete Selected\r\n                    </button></div>\r\n                <atlas-ag-grid-user-preferences *ngIf=\"agGridOptions && agGridOptions.columnDefs\"\r\n                                                [gridOptions]=\"agGridOptions\"\r\n                                                [company]=\"company\"\r\n                                                [gridId]=\"gridCode\"\r\n                                                [showExport]=\"true\"\r\n                                                [sharingEnabled]=\"hasGridSharing\"\r\n                                                #userPreferences>\r\n                </atlas-ag-grid-user-preferences>\r\n            </div>\r\n        </div>\r\n        <div ag-grid=\"agGridOptions\"\r\n             style=\"width: 100%; height: 100%\">\r\n            <ag-grid-angular style=\" height: 100%;\"\r\n                             class=\"ag-theme-material\"\r\n                             domLayout=autoHeight\r\n                             [rowData]=\"agGridRows\"\r\n                             [columnDefs]=\"agGridCols\"\r\n                             [gridOptions]=\"agGridOptions\"\r\n                             [enableColResize]=\"true\"\r\n                             [pagination]=\"true\"\r\n                             rowSelection=\"multiple\"\r\n                             [paginationPageSize]=\"pageSize\"\r\n                             [enableSorting]=\"true\"\r\n                             [rowHeight]=\"atlasAgGridParam.rowHeight\"\r\n                             [headerHeight]=\"atlasAgGridParam.headerHeight\"\r\n                             [frameworkComponents]=\"gridComponents\"\r\n                             (firstDataRendered)=\"onFirstDataRendered()\"\r\n                             (cellValueChanged)=\"onCellValueChanged($event)\"\r\n                             (columnVisible)=\"onColumnVisibilityChanged($event)\">\r\n            </ag-grid-angular>\r\n        </div>\r\n        <atlas-floating-action-button [fabTitle]=\"fabTitle\"\r\n                                      [fabType]=\"fabType\"\r\n                                      [fabActions]=\"fabMenuActions\"\r\n                                      [isParentLoaded]=\"!isLoading\"\r\n                                      (fabActionClicked)=\"onFabActionClicked($event)\">\r\n        </atlas-floating-action-button>\r\n    </mat-card>\r\n    <mat-card *ngIf=\"isLoading\">\r\n        <div fxLayout=\"row\"\r\n             fxLayoutAlign=\"center center\"\r\n             fxLayoutWrap\r\n             class=\"loading\">\r\n            <mat-spinner color=\"accent\"></mat-spinner>\r\n        </div>\r\n    </mat-card>\r\n</div>\r\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.scss":
/*!******************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.scss ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".no-margin {\n  margin: 0 !important; }\n\n.atlas-grid-card-header button.mat-button {\n  margin: 0 !important; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.ts":
/*!****************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.ts ***!
  \****************************************************************************************************************************/
/*! exports provided: ReferentialMasterDataComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialMasterDataComponentComponent", function() { return ReferentialMasterDataComponentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/components/ag-contextual-menu/ag-contextual-menu.component */ "./Client/app/shared/components/ag-contextual-menu/ag-contextual-menu.component.ts");
/* harmony import */ var _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component */ "./Client/app/shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component.ts");
/* harmony import */ var _shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/components/confirmation-dialog/confirmation-dialog.component */ "./Client/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts");
/* harmony import */ var _shared_components_floating_action_button_floating_action_button_type_enum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../shared/components/floating-action-button/floating-action-button-type.enum */ "./Client/app/shared/components/floating-action-button/floating-action-button-type.enum.ts");
/* harmony import */ var _shared_entities_masterdata_deletion_result_entity__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../shared/entities/masterdata-deletion-result.entity */ "./Client/app/shared/entities/masterdata-deletion-result.entity.ts");
/* harmony import */ var _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../shared/entities/masterdata.entity */ "./Client/app/shared/entities/masterdata.entity.ts");
/* harmony import */ var _shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../shared/entities/window-injection-token */ "./Client/app/shared/entities/window-injection-token.ts");
/* harmony import */ var _shared_enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../shared/enums/masterdata-operation-status.entity */ "./Client/app/shared/enums/masterdata-operation-status.entity.ts");
/* harmony import */ var _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../shared/services/ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../shared/services/grid-configuration-provider.service */ "./Client/app/shared/services/grid-configuration-provider.service.ts");
/* harmony import */ var _shared_services_grid_grid_actions_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../shared/services/grid/grid-actions.service */ "./Client/app/shared/services/grid/grid-actions.service.ts");
/* harmony import */ var _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../shared/services/http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _shared_services_masterdata_management_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../shared/services/masterdata-management.service */ "./Client/app/shared/services/masterdata-management.service.ts");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _shared_components_cell_editor_numeric_cell_editor_atlas_numeric_cell_editor_atlas_numeric_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./../../../shared/components/cell-editor-numeric/cell-editor-atlas-numeric/cell-editor-atlas-numeric.component */ "./Client/app/shared/components/cell-editor-numeric/cell-editor-atlas-numeric/cell-editor-atlas-numeric.component.ts");
/* harmony import */ var _shared_components_generic_report_viewer_generic_report_viewer_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./../../../shared/components/generic-report-viewer/generic-report-viewer.component */ "./Client/app/shared/components/generic-report-viewer/generic-report-viewer.component.ts");
/* harmony import */ var _shared_entities_field_errors_entity__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./../../../shared/entities/field-errors.entity */ "./Client/app/shared/entities/field-errors.entity.ts");
/* harmony import */ var _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./../../../shared/services/http-services/document.service */ "./Client/app/shared/services/http-services/document.service.ts");
/* harmony import */ var _shared_services_http_services_grid_configuration_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./../../../shared/services/http-services/grid-configuration.service */ "./Client/app/shared/services/http-services/grid-configuration.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./../../../shared/services/snackbar.service */ "./Client/app/shared/services/snackbar.service.ts");
/* harmony import */ var _assign_masterdata_dialog_box_assign_masterdata_dialog_box_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./assign-masterdata-dialog-box/assign-masterdata-dialog-box.component */ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.ts");
/* harmony import */ var _assign_masterdata_dialog_box_referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./assign-masterdata-dialog-box/referential-masterdata-menu-actions.enum */ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/referential-masterdata-menu-actions.enum.ts");
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
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};





























var ReferentialMasterDataComponentComponent = /** @class */ (function () {
    function ReferentialMasterDataComponentComponent(window, route, gridConfigurationProvider, gridConfigurationService, uiService, masterdataService, masterdataManagementService, companyManager, gridService, gridActions, dialog, snackbarService, documentService) {
        var _this = this;
        this.window = window;
        this.route = route;
        this.gridConfigurationProvider = gridConfigurationProvider;
        this.gridConfigurationService = gridConfigurationService;
        this.uiService = uiService;
        this.masterdataService = masterdataService;
        this.masterdataManagementService = masterdataManagementService;
        this.companyManager = companyManager;
        this.gridService = gridService;
        this.gridActions = gridActions;
        this.dialog = dialog;
        this.snackbarService = snackbarService;
        this.documentService = documentService;
        this.isLoading = true;
        this.isReportVisible = false;
        this.agGridOptions = {};
        this.masterDataCodeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.masterDataDescriptionCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.columnConfiguration = [];
        this.gridContextualMenuActions = [];
        this.userMenuActions = _assign_masterdata_dialog_box_referential_masterdata_menu_actions_enum__WEBPACK_IMPORTED_MODULE_28__["ReferentialMasterdataMenuActions"];
        this.isEdit = false;
        this.fabMenuActions = [];
        this.filteredTemplates = new Array();
        this.pageSize = 10;
        this.isFilterSetDisplay = true;
        this.gridComponents = {
            atlasNumericCellEditor: _shared_components_cell_editor_numeric_cell_editor_atlas_numeric_cell_editor_atlas_numeric_component__WEBPACK_IMPORTED_MODULE_21__["CellEditorAtlasNumericComponent"],
        };
        this.onSelectedIndexChanged = function (navViewMode) {
            _this.viewMode = navViewMode;
            _this.viewModeGlobal = navViewMode === 'global';
            _this.getData();
            _this.initFABActions();
        };
    }
    ReferentialMasterDataComponentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterdataName = this.route.snapshot.paramMap.get('name');
        this.masterdataFriendlyName = this.uiService.getMasterDataFriendlyName(this.masterdataName);
        this.isLocal = this.masterdataManagementService.isLocalLevel(this.masterdataName);
        this.isGlobal = this.masterdataManagementService.isGlobalLevel(this.masterdataName);
        if (this.isGlobal) {
            this.viewModeGlobal = true;
        }
        var documentType = 76;
        if (this.masterdataFriendlyName.trim() === 'Vessel Information') {
            this.isReportVisible = true;
            this.documentService.getTemplates(documentType, 'Vessels').subscribe(function (templates) {
                _this.filteredTemplates = templates.value;
            });
        }
        else if (this.masterdataFriendlyName.trim() === 'Nominal Account Ledger') {
            this.isReportVisible = true;
            this.documentService.getTemplates(documentType, 'NominalAccountLedger').subscribe(function (templates) {
                _this.filteredTemplates = templates.value;
            });
        }
        // Resolver put all masterdata in masterdata's variable
        this.masterdata = this.route.snapshot.data.masterdata;
        this.gridCode = this.masterdataManagementService.getGridName(this.masterdataName);
        this.companyConfiguration = this.companyManager.getCurrentCompany();
        this.company = this.companyConfiguration ? this.companyConfiguration.companyId : null;
        this.validations = this.masterdataManagementService.getValidationForMasterData(this.masterdataName);
        this.gridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.userMenuActions.deleteRows,
                disabled: function () { return !_this.isOperatorAvailable() || _this.isEdit; },
            },
        ];
        if (this.isLocal && this.isGlobal) {
            this.gridContextualMenuActions.push({
                icon: 'sync_alt',
                text: 'Assign',
                action: this.userMenuActions.assign,
                disabled: function () { return !_this.isOperatorAvailable() || _this.isEdit; },
            });
            this.gridContextualMenuActions.push({
                icon: 'block',
                text: 'Deactivate',
                action: this.userMenuActions.deactivate,
                disabled: function () { return !_this.isOperatorAvailable() || _this.isEdit; },
            });
        }
        this.loadGridConfiguration();
        this.getData();
        this.initFABActions();
    };
    ReferentialMasterDataComponentComponent.prototype.onReportClick = function (data) {
        var openTradepnlReportDialog = this.dialog.open(_shared_components_generic_report_viewer_generic_report_viewer_component__WEBPACK_IMPORTED_MODULE_22__["GenericReportViewerComponent"], {
            data: {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });
    };
    ReferentialMasterDataComponentComponent.prototype.loadGridConfiguration = function () {
        var _this = this;
        this.isLoading = true;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["forkJoin"])([this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode),
            this.gridConfigurationService.getColumnExceptions(this.gridCode)])
            .subscribe(function (_a) {
            var _b = __read(_a, 2), configuration = _b[0], columnExceptions = _b[1];
            _this.columnExceptions = columnExceptions;
            _this.columnConfiguration = configuration.columns;
            _this.gridActions.getColumns(_this.columnConfiguration, _this.gridCode, _this.company)
                .subscribe(function (columns) {
                // Deep copy is needed. We need a full separated copy
                _this.pristineColumns = columns.map(function (col) { return (__assign({}, col)); });
                // selection column
                columns.unshift({
                    headerName: '',
                    colId: 'selection',
                    checkboxSelection: function () { return _this.isOperatorAvailable() && !_this.isEdit; },
                    minWidth: 40,
                    maxWidth: 40,
                    pinned: 'left',
                    hide: false,
                });
                if (_this.gridContextualMenuActions && _this.gridContextualMenuActions.length > 0) {
                    columns.push({
                        colId: 'menuAction',
                        headerName: '',
                        cellRendererFramework: _shared_components_ag_contextual_menu_ag_contextual_menu_component__WEBPACK_IMPORTED_MODULE_7__["AgContextualMenuComponent"],
                        cellRendererParams: {
                            context: {
                                componentParent: _this,
                            },
                            menuActions: _this.gridContextualMenuActions,
                        },
                        cellClass: 'ag-contextual-menu',
                        maxWidth: 80,
                    });
                }
                _this.agGridCols = columns.map(function (column) {
                    if (column.cellRendererFramework) {
                        column.cellRendererParams.disabled = function () { return !_this.isColumnEditable(column.colId); };
                        if (!column.onCellValueChanged) {
                            // The onCellValueChanged Event defined in the html is not automatically applied on cell Renderers
                            // We need to apply it manually
                            column.onCellValueChanged = _this.onCellValueChanged;
                        }
                        column.editable = false;
                    }
                    else {
                        column.editable = function () { return _this.isColumnEditable(column.colId); };
                    }
                    return column;
                });
                // Set default order by column
                var columnProperties = _this.gridActions.getGridPropertyForMasterData(_this.masterdataName);
                if (columnProperties) {
                    var getColumn = _this.agGridCols.find(function (column) { return column.field === columnProperties.orderBy; });
                    if (getColumn) {
                        getColumn.sort = 'asc';
                    }
                }
                if (_this.agGridApi) {
                    _this.agGridApi.setColumnDefs(_this.agGridCols);
                }
                if (_this.agGridOptions) {
                    _this.agGridOptions.columnDefs = _this.agGridCols;
                }
                if (_this.agGridRows) { // If data and config are loaded
                    _this.isLoading = false;
                }
            });
        });
    };
    ReferentialMasterDataComponentComponent.prototype.onFirstDataRendered = function () {
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.gridService.sizeColumns(this.agGridOptions);
    };
    ReferentialMasterDataComponentComponent.prototype.isColumnEditable = function (colId) {
        var column = this.pristineColumns.find(function (col) { return col.colId === colId; });
        if (column && !this.viewModeGlobal) {
            var columnException = this.columnExceptions.find(function (col) { return col.fieldName === column.field; });
            if (columnException) {
                return this.isEdit;
            }
        }
        return column && (this.viewModeGlobal ? column.editable : false) && this.isEdit;
    };
    ReferentialMasterDataComponentComponent.prototype.getData = function (code, description) {
        var _this = this;
        this.isLoading = true;
        this.masterdataService.getFullMasterData(this.masterdataName, this.company, this.viewModeGlobal, code, description)
            .subscribe(function (data) {
            _this.agGridRows = data[_this.masterdataName];
            // Deep copy is needed. We need a full separated copy
            _this.pristineRows = data[_this.masterdataName].map(function (row) { return (__assign({}, row)); });
            if (_this.agGridApi) {
                _this.agGridApi.setRowData(_this.agGridRows);
                _this.agGridApi.redrawRows();
            }
            if (_this.agGridCols) { // If data and config are loaded
                _this.isLoading = false;
            }
        });
    };
    ReferentialMasterDataComponentComponent.prototype.onColumnVisibilityChanged = function (column) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
    };
    ReferentialMasterDataComponentComponent.prototype.onDiscardButtonClick = function () {
        var _this = this;
        var confirmDiscardDialog = this.dialog.open(_shared_components_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_9__["ConfirmationDialogComponent"], {
            data: {
                title: 'Discard Changes',
                text: 'You have some modifications pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe(function (answer) {
            if (answer) {
                _this.isEdit = false;
                if (_this.agGridOptions) {
                    _this.initFABActions();
                    // Deep copy is needed. We need a full separated copy
                    _this.agGridRows = _this.pristineRows.map(function (row) { return (__assign({}, row)); });
                    _this.agGridOptions.api.refreshCells();
                }
            }
        });
    };
    ReferentialMasterDataComponentComponent.prototype.onAssignActionClick = function (action, masterdatas) {
        var _this = this;
        var technicalId = this.gridActions.getGridPropertyForMasterData(this.masterdataName).id;
        var selected = masterdatas.map(function (row) { return row[technicalId]; });
        var dialogRef = this.dialog.open(_assign_masterdata_dialog_box_assign_masterdata_dialog_box_component__WEBPACK_IMPORTED_MODULE_27__["AssignMasterdataDialogBoxComponent"], {
            width: '600px',
            data: {
                masterdataName: this.masterdataName,
                actionType: action,
                selected: selected,
            },
        });
        dialogRef.afterClosed().subscribe(function (answer) {
            if (answer) {
                if (answer.length > 0) {
                    _this.isLoading = true;
                    var saveObservable = void 0;
                    var successMessage_1;
                    switch (action) {
                        case _this.userMenuActions.assign:
                            saveObservable = _this.masterdataService.assignMasterData(_this.masterdataName, answer, selected);
                            successMessage_1 = 'Assignment successful';
                            break;
                        case _this.userMenuActions.deactivate:
                            saveObservable = _this.masterdataService.activateMasterData(_this.masterdataName, answer, selected);
                            successMessage_1 = 'Deactivation successful';
                            break;
                    }
                    saveObservable
                        .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["finalize"])(function () {
                        _this.isLoading = false;
                    }))
                        .subscribe(function () {
                        _this.snackbarService.informationSnackBar(successMessage_1);
                    }, function (error) {
                        if (error && error.status === 400 && error.error && error.error.detail) {
                            _this.snackbarService.throwErrorSnackBar(error.error.detail, true);
                        }
                        else {
                            throw error;
                        }
                    });
                }
                else {
                    _this.snackbarService.throwErrorSnackBar('No changes detected');
                }
            }
        });
    };
    ReferentialMasterDataComponentComponent.prototype.onEditMasterDataButtonClicked = function () {
        this.isEdit = true;
        if (this.agGridApi) {
            this.agGridApi.redrawRows();
        }
        this.initFABActions();
    };
    ReferentialMasterDataComponentComponent.prototype.onAddMasterDataButtonClicked = function () {
        var newItem = {};
        newItem.isNew = true;
        this.agGridRows.push(newItem);
        this.agGridApi.updateRowData({ add: [newItem], addIndex: 0 });
    };
    ReferentialMasterDataComponentComponent.prototype.onSaveButtonClick = function () {
        var _this = this;
        this.isLoading = true;
        var masterdataUpdate = new _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_12__["MasterData"]();
        masterdataUpdate[this.masterdataName] = this.agGridRows.filter(function (line) { return line.isDirty === true && line.isNew !== true; });
        var masterdataCreate = new _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_12__["MasterData"]();
        masterdataCreate[this.masterdataName] = this.agGridRows.filter(function (line) { return line.isNew === true; });
        this.agGridRows.forEach(function (row) {
            row['invalid'] = []; // reset errors
        });
        var isValid = this.isDataValid(masterdataUpdate[this.masterdataName].concat(masterdataCreate[this.masterdataName]));
        if (this.agGridOptions && this.agGridOptions.api) {
            this.agGridOptions.api.refreshCells();
        }
        if (!isValid) {
            this.isLoading = false;
            return;
        }
        var updateMasterDataObservable = masterdataUpdate[this.masterdataName].length > 0 ?
            this.masterdataService.updateMasterData(masterdataUpdate, this.masterdataName, this.viewModeGlobal, this.company) : Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(null);
        var createMasterDataObservable = masterdataCreate[this.masterdataName].length > 0 ?
            this.masterdataService.createMasterData(masterdataCreate, this.masterdataName, this.company) : Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(null);
        updateMasterDataObservable.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["concatMap"])(function () { return createMasterDataObservable; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["finalize"])(function () {
            _this.isLoading = false;
            _this.initFABActions();
        })).subscribe(function () {
            _this.isEdit = false;
            _this.getData();
            if (_this.agGridApi) {
                _this.agGridApi.redrawRows();
            }
            _this.snackbarService.informationSnackBar('Row(s) updated');
        }, function (error) {
            if (error && error.error) {
                _this.snackbarService.throwErrorSnackBar(error.error.detail);
            }
        });
    };
    ReferentialMasterDataComponentComponent.prototype.handleSelectedMasterdataAction = function (action) {
        var selectedMasterdata = this.agGridApi.getSelectedRows();
        if (selectedMasterdata && selectedMasterdata.length > 0) {
            this.handleActionForRows(action, selectedMasterdata);
        }
        else {
            this.snackbarService.informationSnackBar('Please select some rows');
        }
    };
    // contextual action menu on one row
    ReferentialMasterDataComponentComponent.prototype.handleAction = function (action, masterdata) {
        this.handleActionForRows(action, [masterdata]);
    };
    ReferentialMasterDataComponentComponent.prototype.handleActionForRows = function (action, masterdata) {
        switch (action) {
            case this.userMenuActions.deleteRows:
                this.deleteMasterData(masterdata);
                break;
            case this.userMenuActions.assign:
            case this.userMenuActions.deactivate:
                this.onAssignActionClick(action, masterdata);
                break;
            default:
                throw new Error("Action " + action + " not recognized");
        }
    };
    ReferentialMasterDataComponentComponent.prototype.deleteMasterData = function (masterdataItemOrArray) {
        var _this = this;
        this.isLoading = false;
        var masterdataToDelete = new _shared_entities_masterdata_entity__WEBPACK_IMPORTED_MODULE_12__["MasterData"]();
        masterdataToDelete[this.masterdataName] = masterdataItemOrArray;
        var technicalId = this.gridActions.getGridPropertyForMasterData(this.masterdataName).id;
        var listId = masterdataToDelete[this.masterdataName].map(function (val) { return val[technicalId]; });
        this.masterdataService.deleteMasterData(listId, this.masterdataName, this.company)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (data) { return data.value.map(function (result) {
            return new _shared_entities_masterdata_deletion_result_entity__WEBPACK_IMPORTED_MODULE_11__["MasterDataDeletionResult"](result.id, result.code, result.masterDataOperationStatus);
        }); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["finalize"])(function () {
            _this.isLoading = false;
        }))
            .subscribe(function (masterDataDeletionResult) {
            _this.getData();
            _this.postActionCleanUp();
            var rowsUpdatedWithSuccess = masterDataDeletionResult
                .filter(function (result) { return result.masterDataOperationStatus === _shared_enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_14__["MasterDataOperationStatus"].Success; });
            var rowsUpdatedWithError = masterDataDeletionResult
                .filter(function (result) { return result.masterDataOperationStatus !== _shared_enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_14__["MasterDataOperationStatus"].Success; });
            var snackBarMessage = rowsUpdatedWithSuccess.length + " item(s) have been successfuly deleted \n";
            if (rowsUpdatedWithError.length !== 0) {
                snackBarMessage += rowsUpdatedWithError.length + "  row(s) with error: \n";
                rowsUpdatedWithError.forEach(function (masterdataOperationStatus) {
                    snackBarMessage +=
                        "Code: " + masterdataOperationStatus.code + " Status: " + masterdataOperationStatus.toUserFriendlyMessage() + " \n";
                });
            }
            _this.snackbarService.informationSnackBar(snackBarMessage);
        });
    };
    ReferentialMasterDataComponentComponent.prototype.isDataValid = function (masterDataList) {
        var errorMessage = this.getErrorMessage(masterDataList);
        var isValid = !errorMessage || errorMessage.length === 0;
        if (!isValid) {
            this.snackbarService.throwErrorSnackBar('Some data are not valid : ' + errorMessage, true);
        }
        return isValid;
    };
    ReferentialMasterDataComponentComponent.prototype.postActionCleanUp = function () {
        this.isEdit = false;
        this.isLoading = false;
        this.initFABActions();
        if (this.agGridApi) {
            this.agGridApi.redrawRows();
        }
    };
    ReferentialMasterDataComponentComponent.prototype.getErrorMessage = function (masterDataList) {
        var _this = this;
        var errorUnicity = this.masterdataManagementService.getUnicityValidationErrors(this.agGridRows, this.validations.unique);
        var errors = new _shared_entities_field_errors_entity__WEBPACK_IMPORTED_MODULE_23__["FieldErrors"]();
        masterDataList.forEach(function (row) {
            var rowErrors = _this.masterdataManagementService.getRowValidationErrors(_this.validations, row, _this.masterdata);
            if (rowErrors) {
                errors.concatDistinct(rowErrors);
            }
        });
        var errorMessage = errorUnicity.map(function (error) { return 'The ' + error.name + ' cannot have duplicated values : '
            + error.values.join(', '); }).join('. ');
        if (errorMessage.length > 0) {
            errorMessage = errorMessage + '. ';
        }
        errorMessage = errorMessage + errors.toString();
        return errorMessage;
    };
    ReferentialMasterDataComponentComponent.prototype.onCellValueChanged = function (params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
        }
    };
    ReferentialMasterDataComponentComponent.prototype.onQuickSearchButtonClicked = function () {
        var code = this.masterDataCodeCtrl.value === '' ? null : this.masterDataCodeCtrl.value;
        var description = this.masterDataDescriptionCtrl.value === '' ?
            null : this.masterDataDescriptionCtrl.value;
        this.getData(code, description);
    };
    ReferentialMasterDataComponentComponent.prototype.initFABActions = function () {
        this.fabTitle = 'Manage Master Data';
        this.fabType = _shared_components_floating_action_button_floating_action_button_type_enum__WEBPACK_IMPORTED_MODULE_10__["FABType"].MiniFAB;
        this.fabMenuActions = [];
        var isDisabled = !this.isOperatorAvailable();
        if (!this.isEdit) {
            var editMasterData = {
                icon: 'edit',
                text: 'Edit Master Data',
                action: 'editMasterData',
                disabled: false,
                index: 0,
            };
            this.fabMenuActions.push(editMasterData);
        }
        else {
            var saveChanges = {
                icon: 'save',
                text: 'Save Changes',
                action: 'saveChanges',
                disabled: false,
                index: 0,
            };
            var addMasterData = {
                icon: 'add',
                text: 'Add Master Data',
                action: 'addMasterData',
                disabled: isDisabled,
                index: 1,
            };
            var discardChanges = {
                icon: 'clear',
                text: 'Discard Changes',
                action: 'discardChanges',
                disabled: false,
                index: 2,
            };
            if (this.isOperatorAvailable()) {
                this.fabMenuActions.push(addMasterData);
            }
            this.fabMenuActions.push(discardChanges);
            this.fabMenuActions.push(saveChanges);
        }
    };
    ReferentialMasterDataComponentComponent.prototype.onFabActionClicked = function (action) {
        switch (action) {
            case 'editMasterData': {
                this.onEditMasterDataButtonClicked();
                break;
            }
            case 'saveChanges': {
                this.onSaveButtonClick();
                break;
            }
            case 'addMasterData': {
                this.onAddMasterDataButtonClicked();
                break;
            }
            case 'discardChanges': {
                this.onDiscardButtonClick();
                break;
            }
            default: {
                break;
            }
        }
    };
    ReferentialMasterDataComponentComponent.prototype.isOperatorAvailable = function () {
        return (((this.isLocal && !this.isGlobal) && !this.viewModeGlobal) // company level (only)
            || ((this.isLocal && this.isGlobal) && this.viewModeGlobal) // master level
            || ((!this.isLocal && this.isGlobal) && this.viewModeGlobal)); // global level
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('userPreferences'),
        __metadata("design:type", _shared_components_ag_grid_user_preferences_ag_grid_user_preferences_component__WEBPACK_IMPORTED_MODULE_8__["AgGridUserPreferencesComponent"])
    ], ReferentialMasterDataComponentComponent.prototype, "userPreferencesComponent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ReferentialMasterDataComponentComponent.prototype, "gridCode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ReferentialMasterDataComponentComponent.prototype, "company", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ReferentialMasterDataComponentComponent.prototype, "pageSize", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ReferentialMasterDataComponentComponent.prototype, "isFilterSetDisplay", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ReferentialMasterDataComponentComponent.prototype, "gridTitle", void 0);
    ReferentialMasterDataComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-referential-component',
            template: __webpack_require__(/*! ./referential-master-data-component.component.html */ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.html"),
            styles: [__webpack_require__(/*! ./referential-master-data-component.component.scss */ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.scss")],
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_shared_entities_window_injection_token__WEBPACK_IMPORTED_MODULE_13__["WINDOW"])),
        __metadata("design:paramtypes", [Window,
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _shared_services_grid_configuration_provider_service__WEBPACK_IMPORTED_MODULE_16__["GridConfigurationProviderService"],
            _shared_services_http_services_grid_configuration_service__WEBPACK_IMPORTED_MODULE_25__["GridConfigurationService"],
            _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_20__["UiService"],
            _shared_services_http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_18__["MasterdataService"],
            _shared_services_masterdata_management_service__WEBPACK_IMPORTED_MODULE_19__["MasterdataManagementService"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_6__["CompanyManagerService"],
            _shared_services_ag_grid_service__WEBPACK_IMPORTED_MODULE_15__["AgGridService"],
            _shared_services_grid_grid_actions_service__WEBPACK_IMPORTED_MODULE_17__["GridActionsService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_26__["SnackbarService"],
            _shared_services_http_services_document_service__WEBPACK_IMPORTED_MODULE_24__["DocumentService"]])
    ], ReferentialMasterDataComponentComponent);
    return ReferentialMasterDataComponentComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.html":
/*!****************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.html ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container hub-menu\">\r\n    <div fxLayout=\"row wrap\"\r\n         fxLayout.lt-md=\"column\"\r\n         fxLayoutAlign=\"start start\"\r\n         fxLayoutAlign.lt-md=\"start center\"\r\n         fxLayoutGap=\"16px\"\r\n         fxLayoutGap.lt-md=\"0px\"\r\n         class=\"hub-menu-panel\"\r\n         [hidden]=\"isLoading\">\r\n        <div *ngFor=\"let menu of menus\">\r\n            <!-- Temporary ifAuthorized-->\r\n            <mat-card class=\"active-card\"\r\n                      *ifAuthorized=\"menu.authorized !== '' ? menu.authorized : 'Referential', company:this.company\">\r\n                <!-- remove tooltip and overlay when link implemented-->\r\n                <img mat-card-image\r\n                     [src]=\"menu.imageUrl\"\r\n                     alt=\"menu picture\" />\r\n                <mat-card-title>\r\n                    {{menu.title}}\r\n                </mat-card-title>\r\n                <mat-card-content>\r\n                    <div fxLayout=\"column\"\r\n                         fxLayoutAlign=\"space-between stretch\"\r\n                         fxLayoutGap=\"8px\"\r\n                         fxLayoutGap.lt-md=\"0\"\r\n                         class=\"hub-menu-panel\"\r\n                         [hidden]=\"isLoading\">\r\n                        <div *ngFor=\"let menuChild of menu.childrens\">\r\n                            <a class=\"no-margin\"\r\n                               (click)=\"onNavigateButtonClicked(menu.navigateUrl + menuChild.navigateUrl)\">\r\n                                {{ menuChild.title }}\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                </mat-card-content>\r\n            </mat-card>\r\n        </div>\r\n        <div *ngIf=\"isLoading\">\r\n            <mat-card>\r\n                <h2>Loading</h2>\r\n                <div class=\"custom-line-title\"></div>\r\n\r\n                <div fxLayout=\"row\"\r\n                     fxLayoutAlign=\"center center\"\r\n                     fxLayoutWrap\r\n                     fxLayoutGap=\"20px\">\r\n                    <mat-spinner color=\"accent\"></mat-spinner>\r\n                </div>\r\n            </mat-card>\r\n        </div>\r\n    </div>\r\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.scss":
/*!****************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.scss ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".hub-menu .hub-menu-panel {\n  max-height: none !important;\n  height: 100%; }\n"

/***/ }),

/***/ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.ts":
/*!**************************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.ts ***!
  \**************************************************************************************************************************************/
/*! exports provided: ReferentialMasterDataMenuComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialMasterDataMenuComponentComponent", function() { return ReferentialMasterDataMenuComponentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_masterdata_management_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/services/masterdata-management.service */ "./Client/app/shared/services/masterdata-management.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ReferentialMasterDataMenuComponentComponent = /** @class */ (function () {
    function ReferentialMasterDataMenuComponentComponent(masterdataService, route, router) {
        this.masterdataService = masterdataService;
        this.route = route;
        this.router = router;
        this.isLoading = false;
    }
    ReferentialMasterDataMenuComponentComponent.prototype.ngOnInit = function () {
        this.company = this.route.snapshot.paramMap.get('company');
        this.menus = this.masterdataService.menus;
    };
    ReferentialMasterDataMenuComponentComponent.prototype.onNavigateButtonClicked = function (route) {
        this.router.navigate(['/' + this.company + route]);
    };
    ReferentialMasterDataMenuComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-referential-master-data-menu-component',
            template: __webpack_require__(/*! ./referential-master-data-menu-component.component.html */ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.html"),
            styles: [__webpack_require__(/*! ./referential-master-data-menu-component.component.scss */ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_masterdata_management_service__WEBPACK_IMPORTED_MODULE_2__["MasterdataManagementService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], ReferentialMasterDataMenuComponentComponent);
    return ReferentialMasterDataMenuComponentComponent;
}());



/***/ }),

/***/ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.html":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.html ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container hub-menu\">\r\n    <div fxLayout=\"row\"\r\n         fxLayout.sm=\"row wrap\"\r\n         fxLayout.xs=\"column\"\r\n         fxLayoutAlign=\"space-between stretch\"\r\n         fxLayoutAlign.sm=\"space-around stretch\"\r\n         fxLayoutAlign.xs=\"center center\"\r\n         fxLayoutGap=\"16px\"\r\n         fxLayoutGap.sm=\"0\"\r\n         class=\"hub-menu-panel\"\r\n         [hidden]=\"isLoading\">\r\n\r\n        <mat-card class=\"active-card\"\r\n                  (click)=\"onNavigateButtonClicked('/referential/tradeexecution/counterparties')\">\r\n            <mat-card-title>\r\n                <h2 class=\"no-margin\">Counterparties</h2>\r\n            </mat-card-title>\r\n            <p class=\"no-margin\">To Manage Counterparty Details</p>\r\n        </mat-card>\r\n    </div>\r\n\r\n    <div *ngIf=\"isLoading\">\r\n        <mat-card>\r\n            <h2>Loading</h2>\r\n            <div class=\"custom-line-title\"></div>\r\n\r\n            <div fxLayout=\"row\"\r\n                 fxLayoutAlign=\"center center\"\r\n                 fxLayoutWrap\r\n                 fxLayoutGap=\"20px\">\r\n                <mat-spinner color=\"accent\"></mat-spinner>\r\n            </div>\r\n        </mat-card>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.scss":
/*!**************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.scss ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.ts":
/*!************************************************************************************************************************!*\
  !*** ./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.ts ***!
  \************************************************************************************************************************/
/*! exports provided: TradingAndExecutionComponentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradingAndExecutionComponentComponent", function() { return TradingAndExecutionComponentComponent; });
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




var TradingAndExecutionComponentComponent = /** @class */ (function () {
    function TradingAndExecutionComponentComponent(securityService, route, router, titleService) {
        this.securityService = securityService;
        this.route = route;
        this.router = router;
        this.titleService = titleService;
        this.isLoading = false;
    }
    TradingAndExecutionComponentComponent.prototype.ngOnInit = function () {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle('Referential - Trading And Execution');
    };
    TradingAndExecutionComponentComponent.prototype.onNavigateButtonClicked = function (route) {
        this.router.navigate(['/' + this.company + route]);
    };
    TradingAndExecutionComponentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'atlas-trading-and-execution-component',
            template: __webpack_require__(/*! ./trading-and-execution-component.component.html */ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.html"),
            styles: [__webpack_require__(/*! ./trading-and-execution-component.component.scss */ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.scss")],
        }),
        __metadata("design:paramtypes", [_shared_services_security_service__WEBPACK_IMPORTED_MODULE_2__["SecurityService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _shared_services_title_service__WEBPACK_IMPORTED_MODULE_3__["TitleService"]])
    ], TradingAndExecutionComponentComponent);
    return TradingAndExecutionComponentComponent;
}());



/***/ }),

/***/ "./Client/app/referential/referential.module.ts":
/*!******************************************************!*\
  !*** ./Client/app/referential/referential.module.ts ***!
  \******************************************************/
/*! exports provided: ReferentialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialModule", function() { return ReferentialModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material-moment-adapter */ "./node_modules/@angular/material-moment-adapter/esm5/material-moment-adapter.es5.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_material_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/material.module */ "./Client/app/shared/material.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/shared.module */ "./Client/app/shared/shared.module.ts");
/* harmony import */ var _components_referential_bulk_amendment_detail_apply_counterparty_apply_button_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component */ "./Client/app/referential/components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component.ts");
/* harmony import */ var _components_referential_bulk_amendment_detail_counterparty_detail_component_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/referential-bulk-amendment/detail/counterparty-detail-component.component */ "./Client/app/referential/components/referential-bulk-amendment/detail/counterparty-detail-component.component.ts");
/* harmony import */ var _components_referential_bulk_amendment_detail_select_multi_dropdown_select_multi_dropdown_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component */ "./Client/app/referential/components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component.ts");
/* harmony import */ var _components_referential_bulk_amendment_list_counterparty_list_component_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/referential-bulk-amendment/list/counterparty-list-component.component */ "./Client/app/referential/components/referential-bulk-amendment/list/counterparty-list-component.component.ts");
/* harmony import */ var _components_referential_bulk_amendment_referential_bulk_amendment_component_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/referential-bulk-amendment/referential-bulk-amendment-component.component */ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.ts");
/* harmony import */ var _components_referential_bulk_amendment_summary_counterparty_summary_component_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/referential-bulk-amendment/summary/counterparty-summary-component.component */ "./Client/app/referential/components/referential-bulk-amendment/summary/counterparty-summary-component.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_address_tab_address_card_counterparty_address_card_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_address_tab_address_detail_card_counterparty_address_detail_card_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_address_tab_counterparty_capture_form_address_tab_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_bank_account_tab_bank_account_details_counterparty_bank_account_details_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_bank_account_tab_bank_account_list_counterparty_bank_account_list_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_bank_account_tab_counterparty_capture_form_bank_account_tab_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_contact_tab_contact_detail_card_contact_detail_card_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_contact_tab_contact_list_card_contact_card_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_contact_tab_counterparty_capture_form_contact_tab_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_counterparty_capture_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/counterparty-capture.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_counterparty_header_counterparty_header_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_counterparty_management_menu_bar_counterparty_management_menu_bar_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_alternate_mailing_card_alternate_mailing_card_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_counterparty_capture_form_main_tab_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_customer_default_card_customer_default_card_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_information_card_associated_company_associated_counterparties_company_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_information_card_information_card_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_main_address_card_main_address_card_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_main_tab_third_system_codes_card_third_system_codes_card_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_report_tab_counterparty_capture_form_report_tab_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_tax_info_tab_counterparty_capture_form_tax_info_tab_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_tax_info_tab_tax_grid_action_tax_grid_action_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component.ts");
/* harmony import */ var _components_referential_counterparties_referential_counterparties_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./components/referential-counterparties/referential-counterparties.component */ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.ts");
/* harmony import */ var _components_referential_counterparty_tab_referential_counterparty_tab_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./components/referential-counterparty-tab/referential-counterparty-tab.component */ "./Client/app/referential/components/referential-counterparty-tab/referential-counterparty-tab.component.ts");
/* harmony import */ var _components_referential_master_data_component_assign_masterdata_dialog_box_assign_masterdata_dialog_box_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component */ "./Client/app/referential/components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component.ts");
/* harmony import */ var _components_referential_master_data_component_referential_master_data_component_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./components/referential-master-data-component/referential-master-data-component.component */ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.ts");
/* harmony import */ var _components_referential_master_data_menu_component_referential_master_data_menu_component_component__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./components/referential-master-data-menu-component/referential-master-data-menu-component.component */ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.ts");
/* harmony import */ var _components_trading_and_execution_component_trading_and_execution_component_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./components/trading-and-execution-component/trading-and-execution-component.component */ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.ts");
/* harmony import */ var _referential_route__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./referential.route */ "./Client/app/referential/referential.route.ts");
/* harmony import */ var _resolvers_referential_master_data_title_resolver__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./resolvers/referential-master-data-title.resolver */ "./Client/app/referential/resolvers/referential-master-data-title.resolver.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











































var ReferentialModule = /** @class */ (function () {
    function ReferentialModule() {
    }
    ReferentialModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _shared_material_module__WEBPACK_IMPORTED_MODULE_5__["MaterialModule"],
                _referential_route__WEBPACK_IMPORTED_MODULE_41__["ReferentialRoutingModule"],
                ag_grid_angular__WEBPACK_IMPORTED_MODULE_4__["AgGridModule"].withComponents([]),
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["SharedModule"],
            ],
            entryComponents: [
                _components_referential_counterparties_counterparty_capture_tax_info_tab_tax_grid_action_tax_grid_action_component__WEBPACK_IMPORTED_MODULE_34__["TaxGridActionComponent"],
                _components_referential_bulk_amendment_detail_select_multi_dropdown_select_multi_dropdown_component__WEBPACK_IMPORTED_MODULE_9__["SelectMultiDropdownComponent"],
                _components_referential_bulk_amendment_detail_apply_counterparty_apply_button_component__WEBPACK_IMPORTED_MODULE_7__["CounterpartyApplyButtonComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_information_card_associated_company_associated_counterparties_company_component__WEBPACK_IMPORTED_MODULE_28__["AssociatedCounterpartiesCompanyComponent"],
                _components_referential_master_data_component_assign_masterdata_dialog_box_assign_masterdata_dialog_box_component__WEBPACK_IMPORTED_MODULE_37__["AssignMasterdataDialogBoxComponent"],
            ],
            declarations: [
                _components_referential_master_data_menu_component_referential_master_data_menu_component_component__WEBPACK_IMPORTED_MODULE_39__["ReferentialMasterDataMenuComponentComponent"],
                _components_trading_and_execution_component_trading_and_execution_component_component__WEBPACK_IMPORTED_MODULE_40__["TradingAndExecutionComponentComponent"],
                _components_referential_counterparties_referential_counterparties_component__WEBPACK_IMPORTED_MODULE_35__["ReferentialCounterpartiesComponent"],
                _components_referential_counterparty_tab_referential_counterparty_tab_component__WEBPACK_IMPORTED_MODULE_36__["ReferentialCounterpartyTabComponent"],
                _components_referential_counterparties_counterparty_capture_counterparty_capture_component__WEBPACK_IMPORTED_MODULE_22__["CounterpartyCaptureComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_counterparty_capture_form_main_tab_component__WEBPACK_IMPORTED_MODULE_26__["CounterpartyCaptureFormMainTabComponent"],
                _components_referential_counterparties_counterparty_capture_address_tab_counterparty_capture_form_address_tab_component__WEBPACK_IMPORTED_MODULE_15__["CounterpartyCaptureFormAddressTabComponent"],
                _components_referential_counterparties_counterparty_capture_contact_tab_counterparty_capture_form_contact_tab_component__WEBPACK_IMPORTED_MODULE_21__["CounterpartyCaptureFormContactTabComponent"],
                _components_referential_counterparties_counterparty_capture_bank_account_tab_counterparty_capture_form_bank_account_tab_component__WEBPACK_IMPORTED_MODULE_18__["CounterpartyCaptureFormBankAccountTabComponent"],
                _components_referential_counterparties_counterparty_capture_tax_info_tab_counterparty_capture_form_tax_info_tab_component__WEBPACK_IMPORTED_MODULE_33__["CounterpartyCaptureFormTaxInfoTabComponent"],
                _components_referential_counterparties_counterparty_capture_report_tab_counterparty_capture_form_report_tab_component__WEBPACK_IMPORTED_MODULE_32__["CounterpartyCaptureFormReportTabComponent"],
                _components_referential_counterparties_counterparty_capture_address_tab_address_card_counterparty_address_card_component__WEBPACK_IMPORTED_MODULE_13__["CounterpartyAddressCardComponent"],
                _components_referential_counterparties_counterparty_capture_address_tab_address_detail_card_counterparty_address_detail_card_component__WEBPACK_IMPORTED_MODULE_14__["CounterpartyAddressDetailCardComponent"],
                _components_referential_counterparties_counterparty_capture_contact_tab_contact_list_card_contact_card_component__WEBPACK_IMPORTED_MODULE_20__["ContactCardComponent"],
                _components_referential_counterparties_counterparty_capture_contact_tab_contact_detail_card_contact_detail_card_component__WEBPACK_IMPORTED_MODULE_19__["ContactDetailCardComponent"],
                _components_referential_counterparties_counterparty_capture_bank_account_tab_bank_account_list_counterparty_bank_account_list_component__WEBPACK_IMPORTED_MODULE_17__["CounterpartyBankAccountListComponent"],
                _components_referential_counterparties_counterparty_capture_tax_info_tab_tax_grid_action_tax_grid_action_component__WEBPACK_IMPORTED_MODULE_34__["TaxGridActionComponent"],
                _components_referential_bulk_amendment_detail_apply_counterparty_apply_button_component__WEBPACK_IMPORTED_MODULE_7__["CounterpartyApplyButtonComponent"],
                _components_referential_counterparties_counterparty_capture_bank_account_tab_bank_account_details_counterparty_bank_account_details_component__WEBPACK_IMPORTED_MODULE_16__["CounterpartyBankAccountDetailsComponent"],
                _components_referential_counterparties_counterparty_capture_tax_info_tab_tax_grid_action_tax_grid_action_component__WEBPACK_IMPORTED_MODULE_34__["TaxGridActionComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_information_card_information_card_component__WEBPACK_IMPORTED_MODULE_29__["InformationCardComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_main_address_card_main_address_card_component__WEBPACK_IMPORTED_MODULE_30__["MainAddressCardComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_third_system_codes_card_third_system_codes_card_component__WEBPACK_IMPORTED_MODULE_31__["ThirdSystemCodesCardComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_alternate_mailing_card_alternate_mailing_card_component__WEBPACK_IMPORTED_MODULE_25__["AlternateMailingCardComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_customer_default_card_customer_default_card_component__WEBPACK_IMPORTED_MODULE_27__["CustomerDefaultCardComponent"],
                _components_referential_counterparties_counterparty_capture_counterparty_header_counterparty_header_component__WEBPACK_IMPORTED_MODULE_23__["CounterpartyHeaderComponent"],
                _components_referential_counterparties_counterparty_capture_counterparty_management_menu_bar_counterparty_management_menu_bar_component__WEBPACK_IMPORTED_MODULE_24__["CounterpartyManagementMenuBarComponent"],
                _components_referential_counterparties_counterparty_capture_main_tab_information_card_associated_company_associated_counterparties_company_component__WEBPACK_IMPORTED_MODULE_28__["AssociatedCounterpartiesCompanyComponent"],
                _components_referential_counterparties_counterparty_capture_bank_account_tab_bank_account_details_counterparty_bank_account_details_component__WEBPACK_IMPORTED_MODULE_16__["CounterpartyBankAccountDetailsComponent"],
                _components_referential_master_data_component_referential_master_data_component_component__WEBPACK_IMPORTED_MODULE_38__["ReferentialMasterDataComponentComponent"],
                _components_referential_bulk_amendment_referential_bulk_amendment_component_component__WEBPACK_IMPORTED_MODULE_11__["ReferentialBulkAmendmentComponentComponent"],
                _components_referential_bulk_amendment_list_counterparty_list_component_component__WEBPACK_IMPORTED_MODULE_10__["CounterpartyListComponentComponent"],
                _components_referential_bulk_amendment_detail_counterparty_detail_component_component__WEBPACK_IMPORTED_MODULE_8__["CounterpartyDetailComponentComponent"],
                _components_referential_bulk_amendment_summary_counterparty_summary_component_component__WEBPACK_IMPORTED_MODULE_12__["CounterpartySummaryComponentComponent"],
                _components_referential_bulk_amendment_detail_apply_counterparty_apply_button_component__WEBPACK_IMPORTED_MODULE_7__["CounterpartyApplyButtonComponent"],
                _components_referential_bulk_amendment_detail_select_multi_dropdown_select_multi_dropdown_component__WEBPACK_IMPORTED_MODULE_9__["SelectMultiDropdownComponent"],
                _components_referential_master_data_component_assign_masterdata_dialog_box_assign_masterdata_dialog_box_component__WEBPACK_IMPORTED_MODULE_37__["AssignMasterdataDialogBoxComponent"],
            ],
            providers: [
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DATE_LOCALE"], useValue: 'en' },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_2__["DateAdapter"], useClass: _angular_material_moment_adapter__WEBPACK_IMPORTED_MODULE_3__["MomentDateAdapter"] },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DATE_FORMATS"], useValue: _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["ATLAS_DATE_FORMATS"] },
                _resolvers_referential_master_data_title_resolver__WEBPACK_IMPORTED_MODULE_42__["ReferentialMasterDataTitleResolver"],
            ],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["CUSTOM_ELEMENTS_SCHEMA"]],
        })
    ], ReferentialModule);
    return ReferentialModule;
}());



/***/ }),

/***/ "./Client/app/referential/referential.route.ts":
/*!*****************************************************!*\
  !*** ./Client/app/referential/referential.route.ts ***!
  \*****************************************************/
/*! exports provided: routes, ReferentialRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialRoutingModule", function() { return ReferentialRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/enums/permission-level.enum */ "./Client/app/shared/enums/permission-level.enum.ts");
/* harmony import */ var _shared_guards_can_deactivate_guard_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/guards/can-deactivate-guard.service */ "./Client/app/shared/guards/can-deactivate-guard.service.ts");
/* harmony import */ var _shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/guards/security.guard */ "./Client/app/shared/guards/security.guard.ts");
/* harmony import */ var _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/resolvers/company-date.resolver */ "./Client/app/shared/resolvers/company-date.resolver.ts");
/* harmony import */ var _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/resolvers/form-configuration.resolver */ "./Client/app/shared/resolvers/form-configuration.resolver.ts");
/* harmony import */ var _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../shared/resolvers/masterdata.resolver */ "./Client/app/shared/resolvers/masterdata.resolver.ts");
/* harmony import */ var _components_referential_bulk_amendment_referential_bulk_amendment_component_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/referential-bulk-amendment/referential-bulk-amendment-component.component */ "./Client/app/referential/components/referential-bulk-amendment/referential-bulk-amendment-component.component.ts");
/* harmony import */ var _components_referential_counterparties_counterparty_capture_counterparty_capture_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/referential-counterparties/counterparty-capture/counterparty-capture.component */ "./Client/app/referential/components/referential-counterparties/counterparty-capture/counterparty-capture.component.ts");
/* harmony import */ var _components_referential_counterparties_referential_counterparties_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/referential-counterparties/referential-counterparties.component */ "./Client/app/referential/components/referential-counterparties/referential-counterparties.component.ts");
/* harmony import */ var _components_referential_master_data_component_referential_master_data_component_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/referential-master-data-component/referential-master-data-component.component */ "./Client/app/referential/components/referential-master-data-component/referential-master-data-component.component.ts");
/* harmony import */ var _components_referential_master_data_menu_component_referential_master_data_menu_component_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/referential-master-data-menu-component/referential-master-data-menu-component.component */ "./Client/app/referential/components/referential-master-data-menu-component/referential-master-data-menu-component.component.ts");
/* harmony import */ var _components_trading_and_execution_component_trading_and_execution_component_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/trading-and-execution-component/trading-and-execution-component.component */ "./Client/app/referential/components/trading-and-execution-component/trading-and-execution-component.component.ts");
/* harmony import */ var _resolvers_referential_master_data_title_resolver__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./resolvers/referential-master-data-title.resolver */ "./Client/app/referential/resolvers/referential-master-data-title.resolver.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















var routes = [
    {
        path: '',
        component: _components_referential_master_data_menu_component_referential_master_data_menu_component_component__WEBPACK_IMPORTED_MODULE_13__["ReferentialMasterDataMenuComponentComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'tradeexecution',
        component: _components_trading_and_execution_component_trading_and_execution_component_component__WEBPACK_IMPORTED_MODULE_14__["TradingAndExecutionComponentComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        data: {
            animation: 'tradeexecution',
            title: 'Referential',
            isHomePage: false,
            privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: _shared_enums_permission_level_enum__WEBPACK_IMPORTED_MODULE_3__["PermissionLevels"].Read,
                    parentLevelOne: 'Referential',
                },
            ],
        },
        resolve: {
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'masterdata/counterparties',
        component: _components_referential_counterparties_referential_counterparties_component__WEBPACK_IMPORTED_MODULE_11__["ReferentialCounterpartiesComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        data: {
            animation: 'counterparties',
            title: 'Counterparties', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AccountTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Countries,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].LdcRegion,
            ],
        },
        resolve: {
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'tradeexecution/counterparties/bulkamendment',
        component: _components_referential_bulk_amendment_referential_bulk_amendment_component_component__WEBPACK_IMPORTED_MODULE_9__["ReferentialBulkAmendmentComponentComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        data: {
            animation: 'counterparties',
            title: 'Counterparties', isHomePage: true, privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Countries,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AccountTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].LdcRegion,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].TradeStatus,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Province,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AddressTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 2,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationResolver"],
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'counterparty/display/:counterpartyID',
        component: _components_referential_counterparties_counterparty_capture_counterparty_capture_component__WEBPACK_IMPORTED_MODULE_10__["CounterpartyCaptureComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        canDeactivate: [_shared_guards_can_deactivate_guard_service__WEBPACK_IMPORTED_MODULE_4__["CanDeactivateGuard"]],
        data: {
            animation: 'counterpartyDisplay',
            title: 'Counterparty View',
            formId: 'CounterPartyDisplay', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AccountTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AddressTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].ContractTerms,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Countries,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].LdcRegion,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Province,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].TradeStatus,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Traders,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].MdmCategories,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 1,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'counterparty/edit/:counterpartyID',
        component: _components_referential_counterparties_counterparty_capture_counterparty_capture_component__WEBPACK_IMPORTED_MODULE_10__["CounterpartyCaptureComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        canDeactivate: [_shared_guards_can_deactivate_guard_service__WEBPACK_IMPORTED_MODULE_4__["CanDeactivateGuard"]],
        data: {
            animation: 'counterpartyDisplay',
            title: 'Counterparty Edit',
            formId: 'CounterPartyEdit', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AccountTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].AddressTypes,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].ContractTerms,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Countries,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Departments,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].LdcRegion,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Province,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].TradeStatus,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Traders,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].MdmCategories,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 2,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'counterparty/capture',
        component: _components_referential_counterparties_counterparty_capture_counterparty_capture_component__WEBPACK_IMPORTED_MODULE_10__["CounterpartyCaptureComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        canDeactivate: [_shared_guards_can_deactivate_guard_service__WEBPACK_IMPORTED_MODULE_4__["CanDeactivateGuard"]],
        data: {
            animation: 'counterpartyDisplay',
            title: 'Counterparty Create',
            formId: 'CounterPartyCapture', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Province,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Countries,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].LdcRegion,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Currencies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].ContractTerms,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Companies,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].Counterparties,
                _shared_entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_2__["MasterDataProps"].MdmCategories,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 2,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__["MasterDataResolver"],
            formConfiguration: _shared_resolvers_form_configuration_resolver__WEBPACK_IMPORTED_MODULE_7__["FormConfigurationResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
        },
    },
    {
        path: 'masterdata/:name',
        component: _components_referential_master_data_component_referential_master_data_component_component__WEBPACK_IMPORTED_MODULE_12__["ReferentialMasterDataComponentComponent"],
        canActivate: [_shared_guards_security_guard__WEBPACK_IMPORTED_MODULE_5__["SecurityGuard"]],
        data: {
            formId: 'MasterDataCapture', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [],
        },
        resolve: {
            masterdata: _shared_resolvers_masterdata_resolver__WEBPACK_IMPORTED_MODULE_8__["MasterDataResolver"],
            companyDate: _shared_resolvers_company_date_resolver__WEBPACK_IMPORTED_MODULE_6__["CompanyDateResolver"],
            overrideTitle: _resolvers_referential_master_data_title_resolver__WEBPACK_IMPORTED_MODULE_15__["ReferentialMasterDataTitleResolver"],
        },
    },
];
var ReferentialRoutingModule = /** @class */ (function () {
    function ReferentialRoutingModule() {
    }
    ReferentialRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        })
    ], ReferentialRoutingModule);
    return ReferentialRoutingModule;
}());



/***/ }),

/***/ "./Client/app/referential/resolvers/referential-master-data-title.resolver.ts":
/*!************************************************************************************!*\
  !*** ./Client/app/referential/resolvers/referential-master-data-title.resolver.ts ***!
  \************************************************************************************/
/*! exports provided: ReferentialMasterDataTitleResolver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialMasterDataTitleResolver", function() { return ReferentialMasterDataTitleResolver; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_services_ui_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/ui.service */ "./Client/app/shared/services/ui.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ReferentialMasterDataTitleResolver = /** @class */ (function () {
    function ReferentialMasterDataTitleResolver(uiService) {
        this.uiService = uiService;
    }
    ReferentialMasterDataTitleResolver.prototype.resolve = function (route) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(this.uiService.getMasterDataFriendlyName(route.params['name']));
    };
    ReferentialMasterDataTitleResolver = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_shared_services_ui_service__WEBPACK_IMPORTED_MODULE_2__["UiService"]])
    ], ReferentialMasterDataTitleResolver);
    return ReferentialMasterDataTitleResolver;
}());



/***/ }),

/***/ "./Client/app/shared/entities/counterparty-company.entity.ts":
/*!*******************************************************************!*\
  !*** ./Client/app/shared/entities/counterparty-company.entity.ts ***!
  \*******************************************************************/
/*! exports provided: CounterpartyCompany */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CounterpartyCompany", function() { return CounterpartyCompany; });
var CounterpartyCompany = /** @class */ (function () {
    function CounterpartyCompany() {
    }
    return CounterpartyCompany;
}());



/***/ }),

/***/ "./Client/app/shared/entities/counterparty.entity.ts":
/*!***********************************************************!*\
  !*** ./Client/app/shared/entities/counterparty.entity.ts ***!
  \***********************************************************/
/*! exports provided: Counterparty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Counterparty", function() { return Counterparty; });
var Counterparty = /** @class */ (function () {
    function Counterparty() {
    }
    return Counterparty;
}());



/***/ }),

/***/ "./Client/app/shared/entities/field-errors.entity.ts":
/*!***********************************************************!*\
  !*** ./Client/app/shared/entities/field-errors.entity.ts ***!
  \***********************************************************/
/*! exports provided: FieldErrors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FieldErrors", function() { return FieldErrors; });
var FieldErrors = /** @class */ (function () {
    function FieldErrors() {
        this.empty = [];
        this.tooLong = [];
        this.doesNotExists = [];
    }
    FieldErrors.prototype.concatDistinct = function (fieldError) {
        var _this = this;
        fieldError.empty.forEach(function (error) {
            if (!_this.empty.find(function (err) { return err === error; })) {
                _this.empty.push(error);
            }
        });
        fieldError.tooLong.forEach(function (error) {
            if (!_this.tooLong.find(function (err) { return err.name === error.name; })) {
                _this.tooLong.push(error);
            }
        });
        fieldError.doesNotExists.forEach(function (error) {
            var errorsForSameField = _this.doesNotExists.find(function (err) { return err.name === error.name; });
            if (!errorsForSameField) {
                _this.doesNotExists.push(error);
            }
            else {
                error.values.forEach(function (value) {
                    if (errorsForSameField.values.indexOf(value) === -1) {
                        errorsForSameField.values.push(value);
                    }
                });
            }
        });
    };
    FieldErrors.prototype.toString = function () {
        var errorMessage = '';
        if (this.empty.length > 0) {
            errorMessage += 'Those fields cannot be empty : ' + this.empty.join(', ') + '. ';
        }
        this.tooLong.forEach(function (error) { return errorMessage += 'The ' + error.name + ' cannot be longer than '
            + error.maxLength + ' characters. '; });
        this.doesNotExists.forEach(function (error) { return errorMessage += '"' + error.values.map(function (value) { return '"' + value + '"'; }).join(', ')
            + '" are not valid ' + error.name + '. '; });
        return errorMessage;
    };
    return FieldErrors;
}());



/***/ }),

/***/ "./Client/app/shared/entities/field-validation.entity.ts":
/*!***************************************************************!*\
  !*** ./Client/app/shared/entities/field-validation.entity.ts ***!
  \***************************************************************/
/*! exports provided: FieldValidation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FieldValidation", function() { return FieldValidation; });
var FieldValidation = /** @class */ (function () {
    function FieldValidation() {
        this.required = [];
        this.maxLength = [];
        this.shouldExist = [];
        this.unique = [];
    }
    return FieldValidation;
}());



/***/ }),

/***/ "./Client/app/shared/entities/masterdata-deletion-result.entity.ts":
/*!*************************************************************************!*\
  !*** ./Client/app/shared/entities/masterdata-deletion-result.entity.ts ***!
  \*************************************************************************/
/*! exports provided: MasterDataDeletionResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MasterDataDeletionResult", function() { return MasterDataDeletionResult; });
/* harmony import */ var _enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/masterdata-operation-status.entity */ "./Client/app/shared/enums/masterdata-operation-status.entity.ts");

var MasterDataDeletionResult = /** @class */ (function () {
    function MasterDataDeletionResult(id, code, masterDataOperationStatus) {
        this.id = id;
        this.code = code;
        this.masterDataOperationStatus = masterDataOperationStatus;
    }
    MasterDataDeletionResult.prototype.toUserFriendlyMessage = function () {
        switch (this.masterDataOperationStatus) {
            case _enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_0__["MasterDataOperationStatus"].Success:
                return 'Masterdata has been successfully deleted.';
            case _enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_0__["MasterDataOperationStatus"].ForeignKeyViolation:
                return 'Masterdata cannot be deleted because it is assigned to and used in one or more companies.';
            case _enums_masterdata_operation_status_entity__WEBPACK_IMPORTED_MODULE_0__["MasterDataOperationStatus"].RessourceNotFound:
                return 'Masterdata could not be found.';
            default:
                return 'Unknown error';
        }
    };
    return MasterDataDeletionResult;
}());



/***/ }),

/***/ "./Client/app/shared/entities/status-description.entity.ts":
/*!*****************************************************************!*\
  !*** ./Client/app/shared/entities/status-description.entity.ts ***!
  \*****************************************************************/
/*! exports provided: StatusDescriptionTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatusDescriptionTypes", function() { return StatusDescriptionTypes; });
var StatusDescriptionTypes = /** @class */ (function () {
    function StatusDescriptionTypes(titleId, StatusDescription) {
        if (titleId === void 0) { titleId = null; }
        if (StatusDescription === void 0) { StatusDescription = null; }
        this.titleId = titleId;
        this.StatusDescription = StatusDescription;
    }
    return StatusDescriptionTypes;
}());



/***/ }),

/***/ "./Client/app/shared/entities/title-designation.entity.ts":
/*!****************************************************************!*\
  !*** ./Client/app/shared/entities/title-designation.entity.ts ***!
  \****************************************************************/
/*! exports provided: TitleDesignationTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TitleDesignationTypes", function() { return TitleDesignationTypes; });
var TitleDesignationTypes = /** @class */ (function () {
    function TitleDesignationTypes(titleId, titleDesignation) {
        if (titleId === void 0) { titleId = null; }
        if (titleDesignation === void 0) { titleDesignation = null; }
        this.titleId = titleId;
        this.titleDesignation = titleDesignation;
    }
    return TitleDesignationTypes;
}());



/***/ }),

/***/ "./Client/app/shared/enums/bank-type.enum.ts":
/*!***************************************************!*\
  !*** ./Client/app/shared/enums/bank-type.enum.ts ***!
  \***************************************************/
/*! exports provided: BankTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BankTypes", function() { return BankTypes; });
var BankTypes;
(function (BankTypes) {
    BankTypes[BankTypes["IBAN"] = 1] = "IBAN";
    BankTypes[BankTypes["Other"] = 2] = "Other";
})(BankTypes || (BankTypes = {}));


/***/ }),

/***/ "./Client/app/shared/enums/masterdata-operation-status.entity.ts":
/*!***********************************************************************!*\
  !*** ./Client/app/shared/enums/masterdata-operation-status.entity.ts ***!
  \***********************************************************************/
/*! exports provided: MasterDataOperationStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MasterDataOperationStatus", function() { return MasterDataOperationStatus; });
var MasterDataOperationStatus;
(function (MasterDataOperationStatus) {
    MasterDataOperationStatus[MasterDataOperationStatus["None"] = 0] = "None";
    MasterDataOperationStatus[MasterDataOperationStatus["Success"] = 1] = "Success";
    MasterDataOperationStatus[MasterDataOperationStatus["UnknownError"] = 2] = "UnknownError";
    MasterDataOperationStatus[MasterDataOperationStatus["ForeignKeyViolation"] = 3] = "ForeignKeyViolation";
    MasterDataOperationStatus[MasterDataOperationStatus["RessourceNotFound"] = 4] = "RessourceNotFound";
})(MasterDataOperationStatus || (MasterDataOperationStatus = {}));


/***/ }),

/***/ "./Client/app/shared/enums/status-description.ts":
/*!*******************************************************!*\
  !*** ./Client/app/shared/enums/status-description.ts ***!
  \*******************************************************/
/*! exports provided: StatusDescription */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatusDescription", function() { return StatusDescription; });
var StatusDescription;
(function (StatusDescription) {
    StatusDescription[StatusDescription["StatusInactive"] = 0] = "StatusInactive";
    StatusDescription[StatusDescription["StatusActive"] = 1] = "StatusActive";
})(StatusDescription || (StatusDescription = {}));


/***/ }),

/***/ "./Client/app/shared/enums/status.enum.ts":
/*!************************************************!*\
  !*** ./Client/app/shared/enums/status.enum.ts ***!
  \************************************************/
/*! exports provided: Status */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Status", function() { return Status; });
var Status;
(function (Status) {
    Status[Status["Activated"] = 1] = "Activated";
    Status[Status["Deactivated"] = 2] = "Deactivated";
})(Status || (Status = {}));


/***/ }),

/***/ "./Client/app/shared/enums/title-designation.ts":
/*!******************************************************!*\
  !*** ./Client/app/shared/enums/title-designation.ts ***!
  \******************************************************/
/*! exports provided: TitleDesignation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TitleDesignation", function() { return TitleDesignation; });
var TitleDesignation;
(function (TitleDesignation) {
    TitleDesignation[TitleDesignation["Mr"] = 1] = "Mr";
    TitleDesignation[TitleDesignation["Mrs"] = 2] = "Mrs";
    TitleDesignation[TitleDesignation["Ms"] = 3] = "Ms";
})(TitleDesignation || (TitleDesignation = {}));


/***/ }),

/***/ "./Client/app/shared/services/grid/grid-actions.service.ts":
/*!*****************************************************************!*\
  !*** ./Client/app/shared/services/grid/grid-actions.service.ts ***!
  \*****************************************************************/
/*! exports provided: GridActionsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GridActionsService", function() { return GridActionsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_components_ag_grid_checkbox_ag_grid_checkbox_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component */ "./Client/app/shared/components/ag-grid-checkbox/ag-grid-checkbox.component.ts");
/* harmony import */ var _components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/ag-grid/contextual-search/ag-grid-contextual-search.component */ "./Client/app/shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component.ts");
/* harmony import */ var _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _ag_grid_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ag-grid.service */ "./Client/app/shared/services/ag-grid.service.ts");
/* harmony import */ var _http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../http-services/masterdata.service */ "./Client/app/shared/services/http-services/masterdata.service.ts");
/* harmony import */ var _ui_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ui.service */ "./Client/app/shared/services/ui.service.ts");
/* harmony import */ var _util_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../util.service */ "./Client/app/shared/services/util.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var GridActionsService = /** @class */ (function () {
    function GridActionsService(gridService, utilService, uiService, masterdataService) {
        this.gridService = gridService;
        this.utilService = utilService;
        this.uiService = uiService;
        this.masterdataService = masterdataService;
    }
    GridActionsService.prototype.getColumns = function (configuration, gridCode, company) {
        var _this = this;
        var observableBatch = [];
        configuration.filter(function (opt) { return opt.gridType === 'masterdata'; }).map(function (config) {
            var columnDef = _this.getColDef(config);
            observableBatch.push(_this.masterdataService.getFullMasterData(config.optionSet, company, false).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (data) {
                var gridProps = _this.getGridPropertyForMasterData(config.optionSet);
                columnDef.editable = config.isEditable;
                columnDef.cellRendererFramework = _components_ag_grid_contextual_search_ag_grid_contextual_search_component__WEBPACK_IMPORTED_MODULE_4__["AgGridContextualSearchComponent"];
                columnDef.cellRendererParams = {
                    context: {
                        componentParent: _this,
                        gridEditable: config.isEditable,
                    },
                    gridId: gridProps.gridCode,
                    options: data[config.optionSet],
                    isRequired: false,
                    displayProperty: gridProps.display,
                    valueProperty: gridProps.value,
                    lightBoxTitle: 'Results for ' + config.optionSet,
                    showContextualSearchIcon: true,
                };
                return columnDef;
            })));
            return observableBatch;
        });
        var ColDef = configuration.filter(function (opt) { return opt.gridType !== 'masterdata'; }).map(function (config) {
            var columnDef = _this.getColDef(config);
            if (config.gridType === 'numeric') {
                columnDef.valueFormatter = _this.numberFormatter;
            }
            if (config.gridType === 'boolean') {
                columnDef.cellRendererFramework = _shared_components_ag_grid_checkbox_ag_grid_checkbox_component__WEBPACK_IMPORTED_MODULE_3__["AgGridCheckboxComponent"];
                columnDef.cellRendererParams = {
                    disabled: config.isEditable,
                };
            }
            var dateGetter = _this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = config.gridType === 'month' ? 'monthFormat' : 'dateFormat';
                columnDef.valueGetter = dateGetter;
                columnDef.cellEditor = 'atlasMonthDatePicker';
            }
            var formatter = _this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            columnDef.editable = config.isEditable;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(columnDef);
        });
        var completeColDef = ColDef.concat(observableBatch);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["forkJoin"])(completeColDef);
    };
    GridActionsService.prototype.numberFormatter = function (params) {
        var data = '';
        if (params && params.value) {
            data = new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params.value);
        }
        return data;
    };
    GridActionsService.prototype.isGridCheckboxEditable = function (params) {
        return !(params.context.gridEditable);
    };
    GridActionsService.prototype.isGridEditable = function (params) {
        return params.context.gridEditable;
    };
    GridActionsService.prototype.getColDef = function (configuration) {
        var field = this.utilService.convertToCamelCase(configuration.fieldName);
        return {
            colId: field,
            headerName: configuration.friendlyName,
            field: field,
            width: 100,
            hide: !configuration.isVisible,
            rowGroup: configuration.isGroup,
            enableRowGroup: configuration.isGroup,
            cellClassRules: {
                'ag-grid-invalid-mandatory-field': (function (params) { return params.data.invalid && params.data.invalid[field]; }),
            },
        };
    };
    GridActionsService.prototype.getGridPropertyForMasterData = function (masterdataname) {
        var props;
        switch (masterdataname) {
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].Commodities: {
                props = {
                    id: 'commodityId',
                    display: 'principalCommodity',
                    value: 'commodityId',
                    description: '',
                    orderBy: 'principalCommodity',
                    gridCode: 'commodityCodesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].ProfitCenters: {
                props = {
                    id: 'profitCenterId',
                    display: 'profitCenterCode',
                    value: 'profitCenterId',
                    description: '',
                    orderBy: 'profitCenterCode',
                    gridCode: 'profitCenterMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].NominalAccounts: {
                props = {
                    id: 'nominalAccountId',
                    display: 'mainAccountTitle',
                    value: 'nominalAccountId',
                    description: '',
                    orderBy: 'mainAccountTitle',
                    gridCode: 'nominalAccountMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].CostTypes: {
                props = {
                    id: 'costTypeId',
                    display: 'costTypeCode',
                    value: 'costTypeId',
                    description: '',
                    orderBy: 'costTypeCode',
                    gridCode: 'costTypesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].BusinessSectors: {
                props = {
                    id: 'sectorId',
                    display: 'sectorCode',
                    value: 'sectorId',
                    description: '',
                    orderBy: 'sectorCode',
                    gridCode: 'businessSectorsMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].PriceUnits: {
                props = {
                    id: 'priceUnitId',
                    display: 'priceCode',
                    value: 'priceUnitId',
                    description: '',
                    orderBy: 'priceCode',
                    gridCode: 'priceCodesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].WeightUnits: {
                props = {
                    id: 'weightUnitId',
                    display: 'weightCode',
                    value: 'weightUnitId',
                    description: '',
                    orderBy: '',
                    gridCode: 'weightCodesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].LdcRegion: {
                props = {
                    id: 'ldcRegionCode',
                    display: 'ldcRegionCode',
                    value: 'ldcRegionCode',
                    description: '',
                    orderBy: 'ldcRegionCode',
                    gridCode: 'regionsMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].CommodityTypes: {
                props = {
                    id: 'commodityTypeId',
                    display: 'code',
                    value: '',
                    description: '',
                    orderBy: 'code',
                    gridCode: 'commodityTypesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].Currencies: {
                props = {
                    id: 'currencyCode',
                    display: 'currencyCode',
                    value: 'currencyCode',
                    description: '',
                    orderBy: 'currencyCode',
                    gridCode: 'currencyCodesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].Countries: {
                props = {
                    id: 'countryId',
                    display: 'countryCode',
                    value: 'countryId',
                    description: '',
                    orderBy: 'countryCode',
                    gridCode: 'countryCodesMasterData',
                };
                break;
            }
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_5__["MasterDataProps"].Province: {
                props = {
                    id: 'provinceId',
                    display: '',
                    value: '',
                    description: '',
                    orderBy: 'stateCode',
                    gridCode: 'provincesMasterData',
                };
                break;
            }
            default: {
                break;
            }
        }
        return props;
    };
    GridActionsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [_ag_grid_service__WEBPACK_IMPORTED_MODULE_6__["AgGridService"],
            _util_service__WEBPACK_IMPORTED_MODULE_9__["UtilService"],
            _ui_service__WEBPACK_IMPORTED_MODULE_8__["UiService"],
            _http_services_masterdata_service__WEBPACK_IMPORTED_MODULE_7__["MasterdataService"]])
    ], GridActionsService);
    return GridActionsService;
}());



/***/ }),

/***/ "./Client/app/shared/services/http-services/referential-counterparties.service.ts":
/*!****************************************************************************************!*\
  !*** ./Client/app/shared/services/http-services/referential-counterparties.service.ts ***!
  \****************************************************************************************/
/*! exports provided: ReferentialCounterpartiesService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialCounterpartiesService", function() { return ReferentialCounterpartiesService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../environments/environment */ "./Client/environments/environment.ts");
/* harmony import */ var _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/company-manager.service */ "./Client/app/core/services/company-manager.service.ts");
/* harmony import */ var _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../entities/http-services/http-request-options.entity */ "./Client/app/shared/entities/http-services/http-request-options.entity.ts");
/* harmony import */ var _http_base_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./http-base.service */ "./Client/app/shared/services/http-services/http-base.service.ts");
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






var ReferentialCounterpartiesService = /** @class */ (function (_super) {
    __extends(ReferentialCounterpartiesService, _super);
    function ReferentialCounterpartiesService(http, companyManager) {
        var _this = _super.call(this, http) || this;
        _this.companyManager = companyManager;
        _this.clientDetailsControllerUrl = 'clientDetails';
        return _this;
    }
    ReferentialCounterpartiesService.prototype.search = function (request, showDuplicateCounterpartyData) {
        var company = this.companyManager.getCurrentCompanyId();
        var options = new _entities_http_services_http_request_options_entity__WEBPACK_IMPORTED_MODULE_4__["HttpRequestOptions"]();
        options.headers = this.defaultHttpHeaders;
        var queryParameters = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpParams"]();
        queryParameters = queryParameters.set('showDuplicateCounterpartyData', showDuplicateCounterpartyData.toString());
        options.params = queryParameters;
        return this.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company)) + "/" + this.clientDetailsControllerUrl + "/search", request, options);
    };
    ReferentialCounterpartiesService.prototype.getBulkEditdata = function (request) {
        var company = this.companyManager.getCurrentCompanyId();
        return this.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].reportingServiceLink + "/" + encodeURIComponent(String(company)) + "/" + this.clientDetailsControllerUrl + "/getBulkEditdata", request);
    };
    ReferentialCounterpartiesService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"],
            _core_services_company_manager_service__WEBPACK_IMPORTED_MODULE_3__["CompanyManagerService"]])
    ], ReferentialCounterpartiesService);
    return ReferentialCounterpartiesService;
}(_http_base_service__WEBPACK_IMPORTED_MODULE_5__["HttpBaseService"]));



/***/ }),

/***/ "./Client/app/shared/services/list-and-search/counterparty-bulk-edit-data-loader.ts":
/*!******************************************************************************************!*\
  !*** ./Client/app/shared/services/list-and-search/counterparty-bulk-edit-data-loader.ts ***!
  \******************************************************************************************/
/*! exports provided: ReferentialBulkEditCounterpartiesDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialBulkEditCounterpartiesDataLoader", function() { return ReferentialBulkEditCounterpartiesDataLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../dtos/list-and-search/list-and-search-filter-dto.dto */ "./Client/app/shared/dtos/list-and-search/list-and-search-filter-dto.dto.ts");
/* harmony import */ var _http_services_referential_counterparties_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../http-services/referential-counterparties.service */ "./Client/app/shared/services/http-services/referential-counterparties.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ReferentialBulkEditCounterpartiesDataLoader = /** @class */ (function () {
    function ReferentialBulkEditCounterpartiesDataLoader(referentialCounterpartiesService) {
        this.referentialCounterpartiesService = referentialCounterpartiesService;
    }
    ReferentialBulkEditCounterpartiesDataLoader.prototype.getData = function (filters, offset, limit) {
        var filtersForColumns = filters.map(function (filter) {
            return new _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__["ListAndSearchFilterDto"](filter);
        });
        var request = {
            clauses: { clauses: filtersForColumns },
            offset: offset,
            limit: limit,
        };
        var list = this.referentialCounterpartiesService.getBulkEditdata(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data;
        }));
        return list;
    };
    ReferentialBulkEditCounterpartiesDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_referential_counterparties_service__WEBPACK_IMPORTED_MODULE_3__["ReferentialCounterpartiesService"]])
    ], ReferentialBulkEditCounterpartiesDataLoader);
    return ReferentialBulkEditCounterpartiesDataLoader;
}());



/***/ }),

/***/ "./Client/app/shared/services/list-and-search/referentialCounterparties-data-loader.ts":
/*!*********************************************************************************************!*\
  !*** ./Client/app/shared/services/list-and-search/referentialCounterparties-data-loader.ts ***!
  \*********************************************************************************************/
/*! exports provided: ReferentialCounterpartiesDataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReferentialCounterpartiesDataLoader", function() { return ReferentialCounterpartiesDataLoader; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../dtos/list-and-search/list-and-search-filter-dto.dto */ "./Client/app/shared/dtos/list-and-search/list-and-search-filter-dto.dto.ts");
/* harmony import */ var _http_services_referential_counterparties_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../http-services/referential-counterparties.service */ "./Client/app/shared/services/http-services/referential-counterparties.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ReferentialCounterpartiesDataLoader = /** @class */ (function () {
    function ReferentialCounterpartiesDataLoader(referentialCounterpartiesService) {
        this.referentialCounterpartiesService = referentialCounterpartiesService;
    }
    ReferentialCounterpartiesDataLoader.prototype.getData = function (filters, dataVersionId, offset, limit, showDuplicateCounterpartyData) {
        if (showDuplicateCounterpartyData === void 0) { showDuplicateCounterpartyData = false; }
        var filtersForColumns = filters.map(function (filter) {
            return new _dtos_list_and_search_list_and_search_filter_dto_dto__WEBPACK_IMPORTED_MODULE_2__["ListAndSearchFilterDto"](filter);
        });
        var request = {
            clauses: { clauses: filtersForColumns },
            offset: offset,
            limit: limit,
        };
        var list = this.referentialCounterpartiesService.search(request, showDuplicateCounterpartyData)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (data) {
            return data.value;
        }));
        return list;
    };
    ReferentialCounterpartiesDataLoader = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_http_services_referential_counterparties_service__WEBPACK_IMPORTED_MODULE_3__["ReferentialCounterpartiesService"]])
    ], ReferentialCounterpartiesDataLoader);
    return ReferentialCounterpartiesDataLoader;
}());



/***/ }),

/***/ "./Client/app/shared/services/masterdata-management.service.ts":
/*!*********************************************************************!*\
  !*** ./Client/app/shared/services/masterdata-management.service.ts ***!
  \*********************************************************************/
/*! exports provided: MasterdataManagementService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MasterdataManagementService", function() { return MasterdataManagementService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _entities_field_errors_entity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../entities/field-errors.entity */ "./Client/app/shared/entities/field-errors.entity.ts");
/* harmony import */ var _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../entities/masterdata-props.entity */ "./Client/app/shared/entities/masterdata-props.entity.ts");
/* harmony import */ var _entities_field_validation_entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../entities/field-validation.entity */ "./Client/app/shared/entities/field-validation.entity.ts");
/* harmony import */ var _util_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util.service */ "./Client/app/shared/services/util.service.ts");
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






var MasterdataManagementService = /** @class */ (function () {
    function MasterdataManagementService(router) {
        this.router = router;
        this.menus = [
            {
                title: 'Global',
                index: 0,
                imageUrl: './assets/img/Global.png',
                authorized: '',
                navigateUrl: '/referential/masterdata/',
                privilege: '',
                childrens: [
                    {
                        title: 'Commodity Types',
                        index: 0,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].CommodityTypes,
                        privilege: '',
                        gridCode: 'commodityTypesMasterData',
                        isLocal: false,
                        isGlobal: true,
                    },
                    {
                        title: 'Country Codes',
                        index: 1,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Countries,
                        privilege: '',
                        gridCode: 'countryCodesMasterData',
                        isLocal: false,
                        isGlobal: true,
                    },
                    {
                        title: 'Currency Codes',
                        index: 2,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Currencies,
                        privilege: '',
                        gridCode: 'currencyCodesMasterData',
                        isLocal: false,
                        isGlobal: true,
                    },
                    {
                        title: 'Provinces',
                        index: 3,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Province,
                        privilege: '',
                        gridCode: 'provincesMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Regions',
                        index: 4,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].LdcRegion,
                        privilege: '',
                        gridCode: 'regionsMasterData',
                        isLocal: false,
                        isGlobal: true,
                    },
                ],
            },
            {
                title: 'Trading & Execution',
                index: 1,
                imageUrl: './assets/img/TradingExecution.png',
                authorized: '',
                navigateUrl: '/referential/masterdata/',
                privilege: '',
                childrens: [
                    {
                        title: 'Arbitration Codes',
                        index: 0,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Arbitrations,
                        privilege: '',
                        gridCode: 'arbitrationCodeMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Business Sector',
                        index: 1,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].BusinessSectors,
                        privilege: '',
                        gridCode: 'businessSectorsMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Commodity Codes',
                        index: 2,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Commodities,
                        privilege: '',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Contract Terms',
                        index: 3,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].ContractTerms,
                        privilege: '',
                        gridCode: 'contractTermsMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Counterparties',
                        index: 4,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Counterparties,
                        privilege: '',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'FX Deal Type',
                        index: 5,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].FxDealType,
                        privilege: '',
                        gridCode: 'fxTradeTypeMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Payment Terms',
                        index: 6,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].PaymentTerms,
                        privilege: '',
                        gridCode: 'paymentTermsMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Period Types',
                        index: 7,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].PeriodTypes,
                        privilege: '',
                        gridCode: 'periodTypeMasterData',
                        isLocal: false,
                        isGlobal: true,
                    },
                    {
                        title: 'Port Codes',
                        index: 8,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Ports,
                        privilege: '',
                        gridCode: 'portCodeMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Price Codes',
                        index: 9,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].PriceUnits,
                        privilege: '',
                        gridCode: 'priceCodesMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Shipping Types',
                        index: 10,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].ShippingTypes,
                        privilege: '',
                        gridCode: 'shippingStatusMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Transport Types',
                        index: 11,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].TransportTypes,
                        privilege: '',
                        isLocal: true,
                        isGlobal: true,
                        gridCode: 'transportTypesMasterData',
                    },
                    {
                        title: 'Vessel Information',
                        index: 12,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Vessels,
                        privilege: '',
                        gridCode: 'vesselMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Weight Codes',
                        index: 13,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].WeightUnits,
                        privilege: '',
                        gridCode: 'weightCodesMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                ],
            },
            {
                title: 'Finance',
                index: 2,
                imageUrl: './assets/img/Business.png',
                authorized: '',
                navigateUrl: '/referential/masterdata/',
                privilege: '',
                childrens: [
                    {
                        title: 'Cost Types',
                        index: 0,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].CostTypes,
                        privilege: '',
                        gridCode: 'costTypesMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Departments',
                        index: 1,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Departments,
                        privilege: '',
                        gridCode: 'departmentMasterData',
                        isLocal: true,
                        isGlobal: false,
                    },
                    {
                        title: 'Nominal Account Ledger',
                        index: 2,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].NominalAccounts,
                        privilege: '',
                        gridCode: 'nominalAccountMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Profit Centers',
                        index: 3,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].ProfitCenters,
                        privilege: '',
                        gridCode: 'profitCenterMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                    {
                        title: 'Tax Codes',
                        index: 4,
                        navigateUrl: _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].TaxCode,
                        privilege: '',
                        gridCode: 'taxCodesMasterData',
                        isLocal: true,
                        isGlobal: true,
                    },
                ],
            },
        ];
    }
    MasterdataManagementService.prototype.searchGridName = function (targets, matchNavigateUrl) {
        var e_1, _a;
        var selected = targets.find(function (target) { return target.navigateUrl === matchNavigateUrl; });
        if (selected) {
            return selected.gridCode;
        }
        else {
            try {
                for (var targets_1 = __values(targets), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
                    var target = targets_1_1.value;
                    if (target.childrens) {
                        var gridCode = this.searchGridName(target.childrens, matchNavigateUrl);
                        if (gridCode) {
                            return gridCode;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (targets_1_1 && !targets_1_1.done && (_a = targets_1.return)) _a.call(targets_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    MasterdataManagementService.prototype.isLocal = function (targets, masterdata) {
        var e_2, _a, e_3, _b;
        try {
            for (var targets_2 = __values(targets), targets_2_1 = targets_2.next(); !targets_2_1.done; targets_2_1 = targets_2.next()) {
                var target = targets_2_1.value;
                if (target.childrens) {
                    try {
                        for (var _c = __values(target.childrens), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var child = _d.value;
                            if (child.navigateUrl === masterdata) {
                                return child.isLocal;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (targets_2_1 && !targets_2_1.done && (_a = targets_2.return)) _a.call(targets_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    MasterdataManagementService.prototype.isGlobal = function (targets, masterdata) {
        var e_4, _a, e_5, _b;
        try {
            for (var targets_3 = __values(targets), targets_3_1 = targets_3.next(); !targets_3_1.done; targets_3_1 = targets_3.next()) {
                var target = targets_3_1.value;
                if (target.childrens) {
                    try {
                        for (var _c = __values(target.childrens), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var child = _d.value;
                            if (child.navigateUrl === masterdata) {
                                return child.isGlobal;
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (targets_3_1 && !targets_3_1.done && (_a = targets_3.return)) _a.call(targets_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    MasterdataManagementService.prototype.getGridName = function (navigateUrl) {
        return this.searchGridName(this.menus, navigateUrl);
    };
    MasterdataManagementService.prototype.isLocalLevel = function (navigateUrl) {
        return this.isLocal(this.menus, navigateUrl);
    };
    MasterdataManagementService.prototype.isGlobalLevel = function (navigateUrl) {
        return this.isGlobal(this.menus, navigateUrl);
    };
    MasterdataManagementService.prototype.getValidationForMasterData = function (masterDataName) {
        var validation = new _entities_field_validation_entity__WEBPACK_IMPORTED_MODULE_4__["FieldValidation"]();
        switch (masterDataName) {
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].CommodityTypes:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('code') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('code'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 }
                ];
                // The below line is here as exemple but should not be applied
                // validation.shouldExist = [{ name: 'code', masterData: MasterDataProps.Commodities, property: 'commodityCode' }];
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('code')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Countries:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('countryCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('countryCode'), maxLength: 3 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('countryCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].ContractTerms:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('contractTermCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('contractTermCode'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 }
                ];
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('contractTermCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].PaymentTerms:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('paymentTermCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('creditHow') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('paymentTermCode'), maxLength: 8 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('creditHow'), maxLength: 1 }
                ];
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('paymentTermCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].BusinessSectors:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('sectorCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('sectorCode'), maxLength: 4 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 60 }
                ];
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('sectorCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Vessels:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('vesselName') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('imo') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('vesselName'), maxLength: 30 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('imo'), maxLength: 7 }
                ];
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('vesselName')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].PriceUnits:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('priceCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('conversionFactor') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('priceCode'), maxLength: 6 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('mdmId'), maxLength: 5 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('conversionFactor'), maxLength: 13 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('weightCode'), maxLength: 6 }
                ];
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('priceCode'), Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('mdmId')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].ShippingStatus:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('shippingStatusCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('shippingStatusCode'), maxLength: 2 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('shippingStatusCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].WeightUnits:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('weightCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('conversionFactor') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('weightCode'), maxLength: 6 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('conversionFactor'), maxLength: 13 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('weightCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].CostTypes:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('costTypeCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('name') },
                    // { name: nameof<CostType>('nominalAccountCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('otherAcc') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('accrue') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('costTypeCode'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('name'), maxLength: 40 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('nominalAccountCode'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('altCode'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('accrue'), maxLength: 30 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('sectionCode'), maxLength: 5 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('interfaceCode'), maxLength: 30 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('objectCode'), maxLength: 5 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('costTypeCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Ports:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('portCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('countryId') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('mDMId'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('portCode'), maxLength: 10 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 60 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('countryId'), maxLength: 3 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('type'), maxLength: 5 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('provinceId'), maxLength: 2 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('portCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].Arbitrations:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('arbitrationCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('arbitrationCode'), maxLength: 8 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('arbitrationCode')];
                break;
            case _entities_masterdata_props_entity__WEBPACK_IMPORTED_MODULE_3__["MasterDataProps"].PeriodTypes:
                validation.required = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('periodTypeCode') },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description') }
                ];
                validation.maxLength = [
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('periodTypeCode'), maxLength: 1 },
                    { name: Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('description'), maxLength: 50 }
                ];
                // Other max-length to add
                validation.unique = [Object(_util_service__WEBPACK_IMPORTED_MODULE_5__["nameof"])('periodTypeCode')];
                break;
        }
        return validation;
    };
    MasterdataManagementService.prototype.getRowValidationErrors = function (fieldValidations, row, masterData) {
        var errors = new _entities_field_errors_entity__WEBPACK_IMPORTED_MODULE_2__["FieldErrors"]();
        // Required fields
        var fieldsRequiredAndEmpty = this.getFieldsRequiredAndEmpty(row, fieldValidations.required);
        if (fieldsRequiredAndEmpty) {
            errors.empty = fieldsRequiredAndEmpty;
        }
        // maxLength
        var fieldsTooLong = this.getFieldsTooLong(row, fieldValidations.maxLength);
        if (fieldsTooLong) {
            errors.tooLong = fieldsTooLong;
        }
        // in dropdown list
        fieldValidations.shouldExist.forEach(function (shouldExist) {
            var value = row[shouldExist.name];
            if (!masterData[shouldExist.masterData]
                .find(function (masterdataList) {
                return (shouldExist.property ? masterdataList[shouldExist.property] : masterdataList) === value;
            })) {
                // Does not exists
                var errorsForSameField = errors.doesNotExists
                    .find(function (err) { return err.name === shouldExist.name; });
                if (!errorsForSameField) {
                    errors.doesNotExists.push({ name: shouldExist.name, values: [value] });
                }
                else {
                    if (errorsForSameField.values.indexOf(value) === -1) {
                        errorsForSameField.values.push(value);
                    }
                }
            }
        });
        return errors;
    };
    MasterdataManagementService.prototype.getUnicityValidationErrors = function (list, unique) {
        var duplicate = [];
        list.forEach(function (item) {
            unique.forEach(function (uniqueField) {
                var uniqueFieldValue = item[uniqueField];
                if (uniqueFieldValue &&
                    list.filter(function (itemInFilter) { return itemInFilter[uniqueField]; })
                        .filter(function (itemInFilter) { return itemInFilter[uniqueField].toLowerCase() === item[uniqueField].toLowerCase(); }).length > 1) {
                    var errorsForSameField = duplicate.find(function (duplicateError) { return duplicateError.name === uniqueField; });
                    if (errorsForSameField) {
                        if (errorsForSameField.values.indexOf(item[uniqueField]) === -1) {
                            errorsForSameField.values.push(item[uniqueField]);
                        }
                    }
                    else {
                        duplicate.push({ name: uniqueField, values: [item[uniqueField]] });
                    }
                    if (!item['invalid']) {
                        item['invalid'] = {};
                    }
                    item['invalid'][uniqueField] = true;
                }
            });
        });
        return duplicate;
    };
    MasterdataManagementService.prototype.getFieldsRequiredAndEmpty = function (object, properties) {
        var fieldInError = [];
        properties.forEach(function (property) {
            if (!object[property.name] || object[property.name].toString().trim().length === 0) {
                fieldInError.push(property.name);
                if (!object['invalid']) {
                    object['invalid'] = {};
                }
                object['invalid'][property.name] = true;
            }
        });
        if (fieldInError.length > 0) {
            return fieldInError;
        }
    };
    MasterdataManagementService.prototype.getFieldsTooLong = function (object, properties) {
        var fieldInError = [];
        properties.forEach(function (property) {
            if (object[property.name] && object[property.name].length > property.maxLength) {
                fieldInError.push(property);
                if (!object['invalid']) {
                    object['invalid'] = {};
                }
                object['invalid'][property.name] = true;
            }
        });
        if (fieldInError.length > 0) {
            return fieldInError;
        }
    };
    MasterdataManagementService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], MasterdataManagementService);
    return MasterdataManagementService;
}());



/***/ })

}]);
//# sourceMappingURL=referential-referential-module.js.map