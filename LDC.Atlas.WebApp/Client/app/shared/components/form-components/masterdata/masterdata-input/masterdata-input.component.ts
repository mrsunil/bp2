import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { UtilService } from '../../../../services/util.service';
import { ContextualSearchBaseLightBoxComponent } from '../../../contextual-search/base-light-box/contextual-search-base-light-box.component';
import { PagingOptions } from './../../../../../shared/entities/http-services/paging-options';
import { SnackbarService } from './../../../../services/snackbar.service';
import { DropdownSelectComponent } from './../../dropdown-select/dropdown-select.component';

@Component({
    selector: 'atlas-masterdata-input',
    templateUrl: './masterdata-input.component.html',
    styleUrls: ['./masterdata-input.component.scss'],
})
export class MasterdataInputComponent extends DropdownSelectComponent {
    @Input() lightBoxTitle: string = 'Results';
    @Input() gridId: string;
    @Input() dataLoader: any;
    @Input() tooltip: string;
    @Input() isSearchBar: boolean = false;
    @Output() readonly valueChange = new EventEmitter();
    errorMessage: string = 'Invalid Entry. Value not in list';
    maxOptionsDisplayed: number = 7;
    tooltipDisplayed: string;

    constructor(protected utils: UtilService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
    ) {
        super(utils);
    }

    onExploreClicked(event) {
        if (!this.gridId) {
            this.snackbarService.throwErrorSnackBar('Something went wrong');
            return;
        }
        const searchLightBox = this.openLightbox();
        searchLightBox.afterClosed().subscribe((answer) => {
            if (answer) {
                this.fieldControl.patchValue(answer);
                this.tooltipDisplayed = answer[this.tooltip];
                this.valueChange.emit(answer);
            }
        });
        if (event) {
            event.stopPropagation();
        }
    }

    openLightbox() {
        return this.dialog.open(ContextualSearchBaseLightBoxComponent, {
            data: {
                lightboxTitle: this.lightBoxTitle,
                gridId: this.gridId,
                rowData$: this.getFilteredList(),
            },
            width: '80%',
            height: '80%',
        });
    }

    getLimitedNumberOfOptions(): any[] {
        let limitedNumberOfOptions = [];
        let errorDisplayed: string;
        if (this.options) {
            limitedNumberOfOptions = this.options.slice(0, this.maxOptionsDisplayed);
        }
        errorDisplayed = this.getErrorMessage();
        if (errorDisplayed) {
            this.errorMessage = errorDisplayed;
        }
        return limitedNumberOfOptions;
    }

    getCurrentValue(): string {
        const currentValue = this.fieldControl.value;
        if (typeof currentValue === 'string') {
            return currentValue;
        }
        return this.generateDisplay(currentValue);
    }

    getNumberOfOptionsNotDisplayed(): number {
        if (this.options) {
            const notDisplayedOptions = this.options.length - this.getLimitedNumberOfOptions().length;
            return notDisplayedOptions > 0 ? notDisplayedOptions : 0;
        }
    }

    getFilteredList() {
        if (this.dataLoader) {
            if (this.gridId === 'documentReferenceGrid' || this.gridId === 'traderGrid') {
                return this.dataLoader.getData();
            }

            return this.dataLoader.getData(
                ((typeof this.fieldControl.value === 'string') ? this.fieldControl.value : this.fieldControl.value[this.displayProperty]),
                new PagingOptions());
        } else {
            return of(this.options);
        }
    }
}
