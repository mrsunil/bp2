import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListAndSearchExport } from '../../../entities/list-and-search/export/list-and-search-export.entity';
import { ListAndSearchFilter } from '../../../entities/list-and-search/list-and-search-filter.entity';
import { HttpBaseService } from '../../http-services/http-base.service';
import { UtilService } from '../../util.service';

export abstract class ListAndSearchExportBase extends HttpBaseService implements ListAndSearchExport {

    constructor(
        protected httpClient: HttpClient,
        protected utilService: UtilService,
        protected window: Window) {
        super(httpClient);
    }

    abstract sendExportRequest(
        gridCode: string,
        filters: ListAndSearchFilter[],
        dataVersionId?: number,
        gridViewId?: number): Observable<HttpResponse<Blob>>;

    export(
        gridCode: string,
        filters: ListAndSearchFilter[],
        dataVersionId?: number,
        gridViewId?: number): void {
        this.sendExportRequest(gridCode, filters, dataVersionId, gridViewId)
            .subscribe((file: HttpResponse<Blob>) => {
                this.downloadFile(file);
            });
    }

    private downloadFile(response: HttpResponse<Blob>) {
        const newBlob = new Blob([response.body],
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const data = this.window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.utilService.getFileNameFromContentDisposition(response);
        link.click();
    }
}
