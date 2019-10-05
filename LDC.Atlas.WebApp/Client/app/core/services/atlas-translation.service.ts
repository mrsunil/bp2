import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as agGrid from 'ag-grid-community';
import { forkJoin as observableForkJoin, from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AtlasTranslationService {

    /* loadedFiles map:
        keys = names of translation files already loaded in minimum one language
        values = maps whose keys are the languages already loaded for the file name given in key
                (values are booleans set on true)
    */
    private loadedFiles: Map<string, Map<string, boolean>> = new Map();

    constructor(public translateService: TranslateService) { }

    loadTranslationFile(fileName: string, englishTranslationFile: object): Observable<boolean> {
        const local: string = this.translateService.currentLang;
        // case where no translation file has been loaded for this module
        if (!this.loadedFiles[fileName]) {
            this.loadedFiles[fileName] = new Map();
            // load English translation file
            this.translateService.setTranslation('en', englishTranslationFile, true);
            this.loadedFiles[fileName].set('en', true);
        }
        if (!this.loadedFiles[fileName][local]) {
            // To do: implement API call to get translation file
            this.loadedFiles[fileName].set(local, true);
        }
        return of(true);
    }

    getTranslation(key: string): Observable<[string, string]> {
        return this.translateService.get(key).pipe(
            map((value: string) => {
                const keyValuePair: [string, string] = [key, value];
                return keyValuePair;
            }),
        );
    }

    getTranslatedRessourceMap(ressourceMap: Map<string, string>) {
        from(ressourceMap)
            .pipe(
                mergeMap((keyValuePair: [string, string]) => {
                    return this.getTranslation(keyValuePair[0]);
                }),
            ).subscribe((translatedKeyValuePair: [string, string]) => {
                ressourceMap[translatedKeyValuePair[0]] = translatedKeyValuePair[1];
            });
    }

    getTranslatedColumnDefs(columnDefinitions: agGrid.ColDef[], gridApi: agGrid.GridApi): Observable<agGrid.ColDef[]> {
        const observableList: Array<Observable<[string, string]>> = [];
        columnDefinitions.forEach((column) => {
            if (column.colId) {
                const headerToTranslate: string = column.colId;
                observableList.push(this.getTranslation(headerToTranslate));
            }
        });

        return observableForkJoin(observableList).pipe(
            map((result: Array<[string, string]>) => {
                result.forEach((keyValuePair: [string, string]) => {
                    const columnToTranslate: agGrid.ColDef = columnDefinitions
                        .find((column: agGrid.ColDef) => column.colId === keyValuePair[0]);
                    // ag grid makes an internal copy of header names instead of create a reference
                    columnToTranslate.headerName = keyValuePair[1];
                    gridApi.getColumnDef(keyValuePair[0]).headerName = keyValuePair[1];
                });
                return columnDefinitions;
            }));
    }

    translateGridOptionsColDefs(gridOptions: agGrid.GridOptions) {
        return this.getTranslatedColumnDefs(gridOptions.columnDefs, gridOptions.api);
    }

}
