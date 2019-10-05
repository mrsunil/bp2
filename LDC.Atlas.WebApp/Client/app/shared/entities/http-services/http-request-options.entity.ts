import { HttpHeaders, HttpParams } from '@angular/common/http';

export class HttpRequestOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: any; // 'body', response, events;
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType: any; // 'arraybuffer, blob, text, json';
    withCredentials?: boolean;
}
