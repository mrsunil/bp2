
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatSelectionList, MatSelectionListChange } from '@angular/material';

@Component({
    selector: 'atlas-picklist',
    templateUrl: './picklist.component.html',
    styleUrls: ['./picklist.component.scss'],
})
export class PicklistComponent implements OnInit {
    @ViewChild('originalList') originalList: MatSelectionList;
    @ViewChild('pickedList') pickedList: MatSelectionList;

    @Input() id: number | string;
    @Input() title: string;
    @Input() originalListHeader: string = 'Available';
    @Input() pickedListHeader: string = 'Selected';
    @Input() options: any[];
    // Property which is used to display in the list
    @Input() displayWith: string;
    // Property which is used to compare items in the list to avoid always recreating DOM elements
    @Input() compareWith: string;
    @Output() readonly pick = new EventEmitter<any[]>();
    @Output() readonly remove = new EventEmitter<any[]>();

    pickedOptions: any[] = [];
    originalOptionsChecked: any[] = [];
    pickedOptionsChecked: any[] = [];
    isAllOriginalChecked = false;
    isAllPickedChecked = false;
    originalListIndeterminated = false;
    pickedListIndeterminated = false;

    constructor() { }

    ngOnInit() {

    }

    onAllOriginalChecked(change: MatCheckboxChange) {
        this.isAllOriginalChecked = change.checked;
        if (this.isAllOriginalChecked) {
            this.originalList.selectAll();
        } else {
            this.originalList.deselectAll();
        }
    }

    onAllPickedChecked(change: MatCheckboxChange) {
        this.isAllPickedChecked = change.checked;
        if (this.isAllPickedChecked) {
            this.pickedList.selectAll();
        } else {
            this.pickedList.deselectAll();
        }
    }

    isAllSelected(isOriginalList: boolean): boolean {
        if (isOriginalList) {
            return this.options.length !== 0 &&
                this.originalOptionsChecked.length === this.options.length;
        } else {
            return this.pickedOptions.length !== 0 &&
                this.pickedOptionsChecked.length === this.pickedOptions.length;
        }
    }

    onOriginalItemsSelected(selectedOptions: MatSelectionListChange) {
        this.isAllOriginalChecked = this.isAllSelected(true);
        this.originalListIndeterminated = !this.isAllOriginalChecked && this.originalOptionsChecked.length > 0;
    }

    onPickedItemsSelected(selectedOptions: MatSelectionListChange) {
        this.isAllPickedChecked = this.isAllSelected(false);
        this.pickedListIndeterminated = !this.isAllPickedChecked && this.pickedOptionsChecked.length > 0;
    }

    pickItems(checkedOptions: any[], source: any[], destination: any[]) {
        if (checkedOptions && checkedOptions.length > 0) {
            checkedOptions.forEach((item) => {
                const index = source.findIndex((option) => {
                    return this.compareWith ?
                        option[this.compareWith] === item[this.compareWith] :
                        option === item;
                });
                if (index > -1) {
                    destination.push(item);
                    source.splice(index, 1);
                }
            });
            checkedOptions = [];
        }
        source = source.sort((n1, n2) => this.displayWith ?
            ((n1[this.displayWith] < n2[this.displayWith]) ? -1 : 1) : ((n1 < n2) ? -1 : 1));
        destination = destination.sort((n1, n2) => this.displayWith ?
            ((n1[this.displayWith] < n2[this.displayWith]) ? -1 : 1) : ((n1 < n2) ? -1 : 1));
    }

    getPickedItems() {
        return this.pickedOptions;
    }

    onPickItemsClicked() {
        this.pick.emit(this.originalOptionsChecked);
        this.pickItems(this.originalOptionsChecked, this.options, this.pickedOptions);
    }

    onRemoveItemsClicked() {
        this.remove.emit(this.pickedOptionsChecked);
        this.pickItems(this.pickedOptionsChecked, this.pickedOptions, this.options);
    }

    trackPicklist(index: number, item: any): any {
        return this.compareWith ? item[this.compareWith] : item;
    }

    compareListItems(option: any, selectedOption: any): boolean {
        return this.compareWith ?
            option[this.compareWith] === selectedOption[this.compareWith]
            : option === selectedOption;
    }
}
