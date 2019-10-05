import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { ListAndSearchUserFilterSetDto } from '../../dtos/list-and-search/user-filter-set-dto.dto';
import { UserGridViewDto } from '../../dtos/user-grid-view-dto.dto';
import { GridConfigurationProperties } from '../../entities/grid-configuration.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { ApiCollection } from '../common/models';
import { ColumnException } from './../../entities/column-exception.entity';
import { UtilService } from './../util.service';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class GridConfigurationService extends HttpBaseService {
    private readonly FilterSetsControllerUrl = 'filtersets';
    private readonly GridViewsControllerUrl = 'gridviews';
    private readonly sectionsControllerUrl = 'sections';

    // Please add the field names as exceptions to this collection.
    // Exceptions can be overwritten on company level.
    private columnExeptionsDummyData: { [gridCode: string]: ColumnException[] } = {
        priceCodesMasterData: [
            {
                fieldName: 'IsDeactivated', // The field id will need to be changed to camelCase like it has been done for gridConfiguration
            },
        ],
    };

    private gridUrls: Map<string, string> = new Map<string, string>();

    constructor(
        protected httpClient: HttpClient,
        private companyManager: CompanyManagerService,
        protected utilService: UtilService,
    ) {
        super(httpClient);
        this.initializeGridMap();
    }

    public getGridConfiguration(
        gridId: string,
    ): Observable<GridConfigurationProperties> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<GridConfigurationProperties>(
            `${environment.configurationServiceLink}/${encodeURIComponent(company)}/grids`
            + '/' + encodeURIComponent(gridId));
    }

    // -- FilterSets
    getUserFilterSets(gridCode: string): Observable<ApiCollection<ListAndSearchUserFilterSetDto>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const filterSets
            = this.get<ApiCollection<ListAndSearchUserFilterSetDto>>(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/myfiltersets`,
            );
        return filterSets;
    }

    getUserFilterSetById(gridCode: string, filterSetId: number): Observable<ListAndSearchUserFilterSetDto> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const filters
            = this.get<ListAndSearchUserFilterSetDto>(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/myfiltersets/${encodeURIComponent(String(filterSetId))}`,
            );
        return filters;
    }

    createUserFilterSet(gridCode: string, filterSet: ListAndSearchUserFilterSetDto): Observable<number> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const filters
            = this.post<number>(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/myfiltersets`,
                filterSet,
            );
        return filters;
    }

    updateUserFilterSet(gridCode: string, filterSet: ListAndSearchUserFilterSetDto): Observable<number> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const filters
            = this.patch<number>(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/myfiltersets/${encodeURIComponent(String(filterSet.filterSetId))}`,
                filterSet,
            );
        return filters;
    }

    deleteUserFilterSet(gridCode: string, filterSetId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const filters
            = this.delete(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/myfiltersets/${encodeURIComponent(String(filterSetId))}`,
            );
        return filters;
    }

    setFavoriteUserFilterSet(gridCode: string, filterSetId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const filters
            = this.post(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/favoritefiltersets/${encodeURIComponent(String(filterSetId))}`,
                null,
            );
        return filters;
    }

    // -- GridViews
    getUserGridViews(gridCode: string): Observable<ApiCollection<UserGridViewDto>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const gridViews
            = this.get<ApiCollection<UserGridViewDto>>(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/mygridviews`,
            );
        return gridViews;
    }

    getUserGridViewsById(gridCode: string, filterSetId: number): Observable<UserGridViewDto> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        const gridViews
            = this.get<UserGridViewDto>(
                `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/mygridviews/${encodeURIComponent(String(filterSetId))}`,
            );
        return gridViews;
    }

    createUserGridViews(gridCode: string, gridViews: UserGridViewDto): Observable<number> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.post<number>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/grids/${encodeURIComponent(String(gridCode))}/mygridviews`,
            gridViews,
        );
    }

    updateUserGridViews(gridCode: string, gridViews: UserGridViewDto): Observable<number> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.patch<number>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/grids/${encodeURIComponent(String(gridCode))}/mygridviews/${encodeURIComponent(String(gridViews.gridViewId))}`,
            gridViews,
        );
    }

    deleteUserGridViews(gridCode: string, gridViewsId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.delete(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/grids/${encodeURIComponent(String(gridCode))}/mygridviews/${encodeURIComponent(String(gridViewsId))}`,
        );
    }

    setFavoriteUserGridViews(gridCode: string, gridView: UserGridViewDto) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.post(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/grids/${encodeURIComponent(String(gridCode))}/favoritegridviews`,
            gridView,
        );
    }

    isGridViewNameExists(gridViewName: string, gridCode: string) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .head(`${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
                + `/grids/${encodeURIComponent(String(gridCode))}/mygridviews/`
                + `${encodeURIComponent(String(gridViewName))}`,
                  {
                    headers: this.defaultHttpHeaders,
                    observe: 'response',
                })
            .pipe(map((resp) => resp.status === 200));
    }

    getColumnExceptions(gridCode: string): Observable<ColumnException[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        if (this.columnExeptionsDummyData[gridCode]) {
            return of(this.columnExeptionsDummyData[gridCode]
                .map((columnException: ColumnException) => {
                    columnException.fieldName = this.utilService.convertToCamelCase(columnException.fieldName);
                    return columnException;
                }));
        }
        return of([]);
        // const columnExceptions
        //     = this.get<ApiCollection<ListAndSearchUserFilterSetDto>>(
        //         `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
        //         + `/grids/${encodeURIComponent(String(gridCode))}/columnexceptions`,
        //     );
        // return columnExceptions;
    }

    getUrlByGridCode(gridCode: string): string {
        return this.gridUrls.get(gridCode);
    }

    private initializeGridMap() {
        const company = this.companyManager.getCurrentCompany();
        this.gridUrls.set(
            'tradeList',
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/search/export`);
    }
}
