import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { TradeBulkEditFields } from '../../../../../shared/enums/trade-bulk-edit-fields.enum';
import { TradeFieldHeader } from '../../../../../shared/enums/trade-field-header-bulk-edit.enum';
import { ConvertToNumber } from '../../../../../shared/numberMask';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { TradeFieldsForBulkEdit } from '../../../../../shared/services/trading/dtos/tradeFieldsForBulkEdit';

@Component({
    selector: 'atlas-trade-bulk-fields',
    templateUrl: './trade-bulk-fields.component.html',
    styleUrls: ['./trade-bulk-fields.component.scss'],
})
export class TradeBulkFieldsComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly selectedFieldsToEdit = new EventEmitter<TradeFieldsForBulkEdit[]>();

    bulkEditFieldSearchList: TradeFieldsForBulkEdit[] = [];
    tradeBulkEditFieldCtrl = new AtlasFormControl('TradeBulkEditField');
    tradeBulkEditFieldList: TradeFieldsForBulkEdit[] = [];
    tradeBulkFieldList1 = [];
    tradeBulkFieldList2 = [];
    tradeBulkFieldList3 = [];
    tradeBulkFieldSearchList = [];
    headerId: number;
    subscription: Subscription[] = [];
    isFieldSelected: boolean = false;
    searchField: string;
    tradeFieldList: TradeFieldsForBulkEdit[] = [];
    BulkEditFieldSearchResult: TradeFieldsForBulkEdit[] = [];
    company: string;
    searchFieldForm: FormGroup;
    form: FormGroup;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected tradingService: TradingService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.searchFieldForm = this.formBuilder.group({
            searchFieldCtrl: [''],
        });
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.populateTradeFieldList();
    }

    populateTradeFieldList() {
        this.subscription.push(this.tradingService.getTradeFieldsForBulkEdit()
            .subscribe((data) => {
                if (data) {
                    this.tradeFieldList = data.value as TradeFieldsForBulkEdit[];
                    this.bulkEditFieldSearchList = data.value as TradeFieldsForBulkEdit[];
                    this.tradeFieldList = this.tradeFieldList.map((filter) => {
                        return {
                            tradeFieldHeader: filter.tradeFieldHeader,
                            fieldName: filter.fieldName,
                            fieldId: filter.fieldId,
                            tradeFieldHeaderId: filter.tradeFieldHeaderId,
                            mandatory: filter.mandatory,
                            friendlyName: filter.friendlyName,
                            isChecked: filter.isChecked,
                            bulkEditFieldName: TradeBulkEditFields[filter.fieldName],
                            unapproval: filter.unapproval,
                        };
                    });
                    this.populateTradeFieldSubList();
                }
            }));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            tradeBulkEditFieldCtrl: this.tradeBulkEditFieldCtrl,
        });
        return super.getFormGroup();
    }

    onSearchFields() {
        this.searchField = this.searchFieldForm.get('searchFieldCtrl').value;
        if (this.searchField) {
            this.tradeBulkFieldSearchList = this.bulkEditFieldSearchList.filter((item) => item.fieldName != null);
            this.BulkEditFieldSearchResult = this.bulkEditFieldSearchList.filter((item) =>
                item.fieldName.toString().toUpperCase().includes(this.searchField.toUpperCase()));
            this.clearBulkEditSearchList();
            this.tradeFieldList = this.BulkEditFieldSearchResult;
            this.populateTradeFieldSubList();
        } else {
            this.clearBulkEditSearchList();
            this.tradeFieldList = this.bulkEditFieldSearchList;
            this.populateTradeFieldSubList();
        }
    }

    populateTradeFieldSubList() {
        if (this.tradeFieldList) {
            for (const item in TradeFieldHeader) {
                if (ConvertToNumber(item)) {
                    this.headerId = Number(item);
                    this.tradeBulkEditFieldList = [];
                    this.tradeBulkEditFieldList = this.tradeFieldList.filter((x) => x.tradeFieldHeaderId === this.headerId);
                    if (this.tradeBulkEditFieldList && this.tradeBulkEditFieldList.length > 0) {
                        if (this.headerId <= TradeFieldHeader.ShipmentPeriod) {
                            this.tradeBulkFieldList1.push(this.tradeBulkEditFieldList);
                        } else if (this.headerId <= TradeFieldHeader.InternalMemorandum) {
                            this.tradeBulkFieldList2.push(this.tradeBulkEditFieldList);
                        } else {
                            this.tradeBulkFieldList3.push(this.tradeBulkEditFieldList);
                        }
                    }
                }
            }
        }
    }

    clearBulkEditSearchList() {
        this.tradeFieldList = [];
        this.tradeBulkFieldList1 = [];
        this.tradeBulkFieldList2 = [];
        this.tradeBulkFieldList3 = [];
    }

    onTickButtonClicked() {
        this.tradeFieldList.forEach((e) => e.isChecked = true);
        this.selectedFieldsToEdit.emit(this.tradeFieldList);
        this.isFieldSelected = true;
    }

    onSelectionChanged(isChecked: boolean, fieldId: number, fieldName: string) {
        this.tradeFieldList.forEach((e) => {
            if (e.fieldName === fieldName) {
                e.isChecked = isChecked;
            }
        });
        this.selectedFieldsToEdit.emit(this.tradeFieldList);
    }

    onUntickButtonClicked() {
        this.tradeFieldList.forEach((e) => e.isChecked = false);
        this.selectedFieldsToEdit.emit(this.tradeFieldList);
        this.isFieldSelected = false;
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }
}
