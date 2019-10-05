import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessSector } from '../entities/business-sector-entity';
import { ContractTerm } from '../entities/contract-term.entity';
import { FieldErrors } from '../entities/field-errors.entity';
import { MasterDataProps } from '../entities/masterdata-props.entity';
import { Menu } from '../entities/menu.entity';
import { PaymentTerm } from '../entities/payment-term.entity';
import { PeriodType } from '../entities/period-type.entity';
import { Vessel } from '../entities/vessel.entity';
import { Arbitration } from './../entities/arbitration.entity';
import { CommodityTypes } from './../entities/commodityTypes.entity';
import { CostType } from './../entities/cost-type.entity';
import { Country } from './../entities/country.entity';
import { FieldValidation } from './../entities/field-validation.entity';
import { MasterData } from './../entities/masterdata.entity';
import { Port } from './../entities/port.entity';
import { PriceUnit } from './../entities/price-unit.entity';
import { ShippingStatus } from './../entities/shipping-status.entity';
import { WeightUnit } from './../entities/weight-unit.entity';
import { nameof } from './util.service';
@Injectable({
    providedIn: 'root',
})

export class MasterdataManagementService {

    constructor(private router: Router) { }

    public menus: Menu[] = [
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
                    navigateUrl: MasterDataProps.CommodityTypes,
                    privilege: '',
                    gridCode: 'commodityTypesMasterData',
                    isLocal: false,
                    isGlobal: true,
                },
                {
                    title: 'Country Codes',
                    index: 1,
                    navigateUrl: MasterDataProps.Countries,
                    privilege: '',
                    gridCode: 'countryCodesMasterData',
                    isLocal: false,
                    isGlobal: true,
                },
                {
                    title: 'Currency Codes',
                    index: 2,
                    navigateUrl: MasterDataProps.Currencies,
                    privilege: '',
                    gridCode: 'currencyCodesMasterData',
                    isLocal: false,
                    isGlobal: true,
                },
                {
                    title: 'Provinces',
                    index: 3,
                    navigateUrl: MasterDataProps.Province,
                    privilege: '',
                    gridCode: 'provincesMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Regions',
                    index: 4,
                    navigateUrl: MasterDataProps.LdcRegion,
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
                    navigateUrl: MasterDataProps.Arbitrations,
                    privilege: '',
                    gridCode: 'arbitrationCodeMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Business Sector',
                    index: 1,
                    navigateUrl: MasterDataProps.BusinessSectors,
                    privilege: '',
                    gridCode: 'businessSectorsMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Commodity Codes',
                    index: 2,
                    navigateUrl: MasterDataProps.Commodities,
                    privilege: '',
                    gridCode: 'commodityCodesMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Contract Terms',
                    index: 3,
                    navigateUrl: MasterDataProps.ContractTerms,
                    privilege: '',
                    gridCode: 'contractTermsMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Counterparties',
                    index: 4,
                    navigateUrl: MasterDataProps.Counterparties,
                    privilege: '',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'FX Deal Type',
                    index: 5,
                    navigateUrl: MasterDataProps.FxDealType,
                    privilege: '',
                    gridCode: 'fxTradeTypeMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Payment Terms',
                    index: 6,
                    navigateUrl: MasterDataProps.PaymentTerms,
                    privilege: '',
                    gridCode: 'paymentTermsMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Period Types',
                    index: 7,
                    navigateUrl: MasterDataProps.PeriodTypes,
                    privilege: '',
                    gridCode: 'periodTypeMasterData',
                    isLocal: false,
                    isGlobal: true,
                },
                {
                    title: 'Port Codes',
                    index: 8,
                    navigateUrl: MasterDataProps.Ports,
                    privilege: '',
                    gridCode: 'portCodeMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Price Codes',
                    index: 9,
                    navigateUrl: MasterDataProps.PriceUnits,
                    privilege: '',
                    gridCode: 'priceCodesMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Shipping Types',
                    index: 10,
                    navigateUrl: MasterDataProps.ShippingTypes,
                    privilege: '',
                    gridCode: 'shippingStatusMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Transport Types',
                    index: 11,
                    navigateUrl: MasterDataProps.TransportTypes,
                    privilege: '',
                    isLocal: true,
                    isGlobal: true,
                    gridCode: 'transportTypesMasterData',
                },
                {
                    title: 'Vessel Information',
                    index: 12,
                    navigateUrl: MasterDataProps.Vessels,
                    privilege: '',
                    gridCode: 'vesselMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Weight Codes',
                    index: 13,
                    navigateUrl: MasterDataProps.WeightUnits,
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
                    navigateUrl: MasterDataProps.CostTypes,
                    privilege: '',
                    gridCode: 'costTypesMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Departments',
                    index: 1,
                    navigateUrl: MasterDataProps.Departments,
                    privilege: '',
                    gridCode: 'departmentMasterData',
                    isLocal: true,
                    isGlobal: false,
                },
                {
                    title: 'Nominal Account Ledger',
                    index: 2,
                    navigateUrl: MasterDataProps.NominalAccounts,
                    privilege: '',
                    gridCode: 'nominalAccountMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Profit Centers',
                    index: 3,
                    navigateUrl: MasterDataProps.ProfitCenters,
                    privilege: '',
                    gridCode: 'profitCenterMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
                {
                    title: 'Tax Codes',
                    index: 4,
                    navigateUrl: MasterDataProps.TaxCode,
                    privilege: '',
                    gridCode: 'taxCodesMasterData',
                    isLocal: true,
                    isGlobal: true,
                },
            ],
        },
    ];

    private searchGridName(targets: Menu[], matchNavigateUrl: string): string {
        const selected = targets.find((target) => target.navigateUrl === matchNavigateUrl);
        if (selected) {
            return selected.gridCode;
        } else {
            for (const target of targets) {
                if (target.childrens) {
                    const gridCode = this.searchGridName(target.childrens, matchNavigateUrl);
                    if (gridCode) {
                        return gridCode;
                    }
                }
            }
        }
    }

    private isLocal(targets: Menu[], masterdata: string): boolean {
        for (const target of targets) {
            if (target.childrens) {
                for (const child of target.childrens) {
                    if (child.navigateUrl === masterdata) {
                        return child.isLocal;
                    }
                }
            }
        }
    }

    private isGlobal(targets: Menu[], masterdata: string): boolean {
        for (const target of targets) {
            if (target.childrens) {
                for (const child of target.childrens) {
                    if (child.navigateUrl === masterdata) {
                        return child.isGlobal;
                    }
                }
            }
        }
    }

    getGridName(navigateUrl: string): string {
        return this.searchGridName(this.menus, navigateUrl);
    }

    isLocalLevel(navigateUrl: string): boolean {
        return this.isLocal(this.menus, navigateUrl);
    }

    isGlobalLevel(navigateUrl: string): boolean {
        return this.isGlobal(this.menus, navigateUrl);
    }

    getValidationForMasterData(masterDataName: string) {
        const validation = new FieldValidation();
        switch (masterDataName) {
            case MasterDataProps.CommodityTypes:
                validation.required = [
                    { name: nameof<CommodityTypes>('code') },
                    { name: nameof<CommodityTypes>('description') }];
                validation.maxLength = [
                    { name: nameof<CommodityTypes>('code'), maxLength: 10 },
                    { name: nameof<CommodityTypes>('description'), maxLength: 50 }];
                // The below line is here as exemple but should not be applied
                // validation.shouldExist = [{ name: 'code', masterData: MasterDataProps.Commodities, property: 'commodityCode' }];
                validation.unique = [nameof<CommodityTypes>('code')];
                break;
            case MasterDataProps.Countries:
                validation.required = [
                    { name: nameof<Country>('countryCode') },
                    { name: nameof<Country>('description') }];
                validation.maxLength = [
                    { name: nameof<Country>('countryCode'), maxLength: 3 },
                    { name: nameof<Country>('description'), maxLength: 50 }];
                // Other max-length to add
                validation.unique = [nameof<Country>('countryCode')];
                break;
            case MasterDataProps.ContractTerms:
                validation.required = [
                    { name: nameof<ContractTerm>('contractTermCode') },
                    { name: nameof<ContractTerm>('description') }];
                validation.maxLength = [
                    { name: nameof<ContractTerm>('contractTermCode'), maxLength: 10 },
                    { name: nameof<ContractTerm>('description'), maxLength: 50 }];
                validation.unique = [nameof<ContractTerm>('contractTermCode')];
                break;
            case MasterDataProps.PaymentTerms:
                validation.required = [
                    { name: nameof<PaymentTerm>('paymentTermCode') },
                    { name: nameof<PaymentTerm>('creditHow') }];
                validation.maxLength = [
                    { name: nameof<PaymentTerm>('paymentTermCode'), maxLength: 8 },
                    { name: nameof<PaymentTerm>('creditHow'), maxLength: 1 }];
                validation.unique = [nameof<PaymentTerm>('paymentTermCode')];
                break;
            case MasterDataProps.BusinessSectors:
                validation.required = [
                    { name: nameof<BusinessSector>('sectorCode') },
                    { name: nameof<BusinessSector>('description') }];
                validation.maxLength = [
                    { name: nameof<BusinessSector>('sectorCode'), maxLength: 4 },
                    { name: nameof<BusinessSector>('description'), maxLength: 60 }];
                validation.unique = [nameof<BusinessSector>('sectorCode')];
                break;
            case MasterDataProps.Vessels:
                validation.required = [
                    { name: nameof<Vessel>('vesselName') },
                    { name: nameof<Vessel>('description') },
                    { name: nameof<Vessel>('imo') }];
                validation.maxLength = [
                    { name: nameof<Vessel>('vesselName'), maxLength: 30 },
                    { name: nameof<Vessel>('description'), maxLength: 50 },
                    { name: nameof<Vessel>('imo'), maxLength: 7 }];
                validation.unique = [nameof<Vessel>('vesselName')];
                break;
            case MasterDataProps.PriceUnits:
                validation.required = [
                    { name: nameof<PriceUnit>('priceCode') },
                    { name: nameof<PriceUnit>('description') },
                    { name: nameof<PriceUnit>('conversionFactor') }];
                validation.maxLength = [
                    { name: nameof<PriceUnit>('priceCode'), maxLength: 6 },
                    { name: nameof<PriceUnit>('mdmId'), maxLength: 5 },
                    { name: nameof<PriceUnit>('description'), maxLength: 50 },
                    { name: nameof<PriceUnit>('conversionFactor'), maxLength: 13 },
                    { name: nameof<PriceUnit>('weightCode'), maxLength: 6 }];
                validation.unique = [nameof<PriceUnit>('priceCode'), nameof<PriceUnit>('mdmId')];
                break;
            case MasterDataProps.ShippingStatus:
                validation.required = [
                    { name: nameof<ShippingStatus>('shippingStatusCode') },
                    { name: nameof<ShippingStatus>('description') }];
                validation.maxLength = [
                    { name: nameof<ShippingStatus>('shippingStatusCode'), maxLength: 2 },
                    { name: nameof<ShippingStatus>('description'), maxLength: 50 }];
                // Other max-length to add
                validation.unique = [nameof<ShippingStatus>('shippingStatusCode')];
                break;
            case MasterDataProps.WeightUnits:
                validation.required = [
                    { name: nameof<WeightUnit>('weightCode') },
                    { name: nameof<WeightUnit>('description') },
                    { name: nameof<WeightUnit>('conversionFactor') }];
                validation.maxLength = [
                    { name: nameof<WeightUnit>('weightCode'), maxLength: 6 },
                    { name: nameof<WeightUnit>('description'), maxLength: 50 },
                    { name: nameof<WeightUnit>('conversionFactor'), maxLength: 13 }];
                // Other max-length to add
                validation.unique = [nameof<WeightUnit>('weightCode')];
                break;
            case MasterDataProps.CostTypes:
                validation.required = [
                    { name: nameof<CostType>('costTypeCode') },
                    { name: nameof<CostType>('name') },
                    // { name: nameof<CostType>('nominalAccountCode') },
                    { name: nameof<CostType>('otherAcc') },
                    { name: nameof<CostType>('accrue') }];
                validation.maxLength = [
                    { name: nameof<CostType>('costTypeCode'), maxLength: 10 },
                    { name: nameof<CostType>('name'), maxLength: 40 },
                    { name: nameof<CostType>('nominalAccountCode'), maxLength: 10 },
                    { name: nameof<CostType>('altCode'), maxLength: 10 },
                    { name: nameof<CostType>('accrue'), maxLength: 30 },
                    { name: nameof<CostType>('sectionCode'), maxLength: 5 },
                    { name: nameof<CostType>('interfaceCode'), maxLength: 30 },
                    { name: nameof<CostType>('objectCode'), maxLength: 5 }];
                // Other max-length to add
                validation.unique = [nameof<CostType>('costTypeCode')];
                break;
            case MasterDataProps.Ports:
                validation.required = [
                    { name: nameof<Port>('portCode') },
                    { name: nameof<Port>('description') },
                    { name: nameof<Port>('countryId') }];
                validation.maxLength = [
                    { name: nameof<Port>('mDMId'), maxLength: 10 },
                    { name: nameof<Port>('portCode'), maxLength: 10 },
                    { name: nameof<Port>('description'), maxLength: 60 },
                    { name: nameof<Port>('countryId'), maxLength: 3 },
                    { name: nameof<Port>('type'), maxLength: 5 },
                    { name: nameof<Port>('provinceId'), maxLength: 2 }];
                // Other max-length to add
                validation.unique = [nameof<Port>('portCode')];
                break;
            case MasterDataProps.Arbitrations:
                validation.required = [
                    { name: nameof<Arbitration>('arbitrationCode') },
                    { name: nameof<Arbitration>('description') }];
                validation.maxLength = [
                    { name: nameof<Arbitration>('arbitrationCode'), maxLength: 8 },
                    { name: nameof<Arbitration>('description'), maxLength: 50 }];
                // Other max-length to add
                validation.unique = [nameof<Arbitration>('arbitrationCode')];
                break;
            case MasterDataProps.PeriodTypes:
                validation.required = [
                    { name: nameof<PeriodType>('periodTypeCode') },
                    { name: nameof<PeriodType>('description') }];
                validation.maxLength = [
                    { name: nameof<PeriodType>('periodTypeCode'), maxLength: 1 },
                    { name: nameof<PeriodType>('description'), maxLength: 50 }];
                // Other max-length to add
                validation.unique = [nameof<PeriodType>('periodTypeCode')];
                break;
        }
        return validation;
    }

    getRowValidationErrors(fieldValidations: FieldValidation, row: any, masterData: MasterData): FieldErrors {
        const errors = new FieldErrors();

        // Required fields
        const fieldsRequiredAndEmpty = this.getFieldsRequiredAndEmpty(row, fieldValidations.required);
        if (fieldsRequiredAndEmpty) {
            errors.empty = fieldsRequiredAndEmpty;
        }

        // maxLength
        const fieldsTooLong = this.getFieldsTooLong(row, fieldValidations.maxLength);
        if (fieldsTooLong) {
            errors.tooLong = fieldsTooLong;
        }

        // in dropdown list
        fieldValidations.shouldExist.forEach((shouldExist) => {
            const value = row[shouldExist.name];
            if (!masterData[shouldExist.masterData]
                .find((masterdataList) =>
                    (shouldExist.property ? masterdataList[shouldExist.property] : masterdataList) === value)) {
                // Does not exists
                const errorsForSameField = errors.doesNotExists
                    .find((err: { name: string, values: any[] }) => err.name === shouldExist.name);
                if (!errorsForSameField) {
                    errors.doesNotExists.push({ name: shouldExist.name, values: [value] });
                } else {
                    if (errorsForSameField.values.indexOf(value) === -1) {
                        errorsForSameField.values.push(value);
                    }
                }
            }
        });

        return errors;
    }

    getUnicityValidationErrors(list: any[], unique: string[]): Array<{ name: string, values: any[] }> {
        const duplicate = [];
        list.forEach((item) => {
            unique.forEach((uniqueField) => {
                const uniqueFieldValue = item[uniqueField];
                if (uniqueFieldValue &&
                    list.filter((itemInFilter) => itemInFilter[uniqueField])
                        .filter((itemInFilter) => itemInFilter[uniqueField].toLowerCase() === item[uniqueField].toLowerCase()).length > 1) {
                    const errorsForSameField = duplicate.find((duplicateError) => duplicateError.name === uniqueField);
                    if (errorsForSameField) {
                        if (errorsForSameField.values.indexOf(item[uniqueField]) === -1) {
                            errorsForSameField.values.push(item[uniqueField]);
                        }
                    } else {
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

    }

    getFieldsRequiredAndEmpty(object, properties: Array<{ name: string }>): string[] {
        const fieldInError = [];
        properties.forEach((property) => {
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
    }

    getFieldsTooLong(object, properties: Array<{ name: string, maxLength: number }>): Array<{ name: string, maxLength: number }> {
        const fieldInError = [];
        properties.forEach((property) => {
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
    }
}
