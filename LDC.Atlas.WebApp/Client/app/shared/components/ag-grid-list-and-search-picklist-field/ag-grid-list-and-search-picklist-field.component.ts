import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { ListAndSearchPicklistPredicatePresetProvider } from '../../entities/list-and-search/providers/list-and-search-picklist-predicate-preset-provider.entity';
import { MasterdataService } from '../../services/http-services/masterdata.service';
import { ContextualSearchBaseLightBoxComponent } from '../contextual-search/base-light-box/contextual-search-base-light-box.component';

@Component({
    selector: 'atlas-ag-grid-list-and-search-picklist-field',
    templateUrl: './ag-grid-list-and-search-picklist-field.component.html',
    styleUrls: ['./ag-grid-list-and-search-picklist-field.component.scss'],
})
export class AgGridListAndSearchPicklistFieldComponent implements ICellRendererAngularComp, OnDestroy {
    private separator: string = ', ';
    private symbol: string = 'in ';
    /*
       params: {
           gridId: string,
           dataEntity: string,
       }
       */
    params: any;
    value: string;
    destroy$ = new Subject();
    picklistSymbols: string[];

    constructor(protected dialog: MatDialog,
        protected masterdataService: MasterdataService,
        protected companyManager: CompanyManagerService,
        private picklistPredicatePresets: ListAndSearchPicklistPredicatePresetProvider) {
        this.picklistSymbols = this.picklistPredicatePresets.getPresets().operators.map((preset) => {
            return preset.symbole;
        });
    }

    agInit(params: any): void {
        this.params = params;
    }

    onExploreClicked(event) {
        const searchLightBox = this.openLightbox();
        searchLightBox.afterClosed().pipe(
            takeUntil(this.destroy$),
        ).subscribe((answer: any[]) => {
            if (answer.length > 0) {
                const displayProperties = answer.map((selectedValue) => {
                    return selectedValue.displayName;
                });
                const concatString: string = displayProperties.join(this.separator);

                this.params.setValue(this.symbol + concatString);
            }
        });
        if (event) {
            event.stopPropagation();
        }
    }

    openLightbox() {
        const selectedDisplayNames = this.getSelectedDisplayNames(this.params.value);
        return this.dialog.open(ContextualSearchBaseLightBoxComponent, {
            data: {
                lightboxTitle: this.params.title,
                gridId: this.params.gridId,
                rowData$: this.masterdataService.getSpecificMasterdata(
                    this.params.dataEntity,
                    this.companyManager.getCurrentCompanyId()).pipe(
                        map((list: any[]) => {
                            if (!this.params.value
                                || this.isOperatorDefined(this.params.value)) {
                                return this.setSelectedRows(selectedDisplayNames, list);
                            }
                            return this.setSelectedRows(selectedDisplayNames,
                                list.filter((data) => data.displayName && (data.displayName as string).toLowerCase()
                                    .startsWith((this.params.value as string).toLowerCase())));
                        }),
                    ),
                multiselect: true,
            },
            width: '80%',
        });
    }

    refresh(params: any): boolean {
        this.params.value = params.value;
        return true;
    }

    isOperatorDefined(filter: string) {
        return this.picklistSymbols.some((symbol) => {
            return filter.toLowerCase().startsWith(symbol.toLowerCase());
        });
    }

    getSelectedDisplayNames(picklistInput: string): string[] {
        if (picklistInput) {
            const displayNames = picklistInput.replace(this.symbol, '');
            return displayNames.split(this.separator);
        }

        return null;
    }

    setSelectedRows(picklistDisplayNames: string[], list: any[]) {
        if (picklistDisplayNames) {
            return list.map((item) => {
                return { ...item, isSelected: (picklistDisplayNames.indexOf(item['displayName']) > -1) };
            });
        }

        return list;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
