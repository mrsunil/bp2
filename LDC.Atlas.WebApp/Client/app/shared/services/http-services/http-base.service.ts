import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';

export abstract class HttpBaseService {

    defaultHttpHeaders: HttpHeaders = new HttpHeaders();
    defaultHttpObserve: string;
    defaultHttpResponseType: string;

    defaultHttpOptions: HttpRequestOptions;
    constructor(protected http: HttpClient) {
        this.defaultHttpHeaders.set('Accept', 'application/json');
        this.defaultHttpObserve = 'body';
        this.defaultHttpResponseType = 'json';

        this.defaultHttpOptions = new HttpRequestOptions();
        this.defaultHttpOptions.headers = this.defaultHttpHeaders;
        this.defaultHttpOptions.observe = this.defaultHttpObserve;
        this.defaultHttpOptions.responseType = this.defaultHttpResponseType;
    }

    protected get<T>(endpointUrl: string, options: HttpRequestOptions = null): Observable<T> {
        let httpOptions = this.defaultHttpOptions;
        if (options) {
            httpOptions = options;
            if (!options.headers) {
                httpOptions.headers = this.defaultHttpHeaders;
            }
            if (!options.observe) {
                httpOptions.observe = this.defaultHttpObserve;
            }
            if (!options.responseType) {
                httpOptions.responseType = this.defaultHttpResponseType;
            }
        }
        return this.http.get<T>(endpointUrl, httpOptions);
    }

    protected post<T>(endpointUrl: string, postBody: any, options: HttpRequestOptions = null): Observable<T> {
        let httpOptions = this.defaultHttpOptions;
        if (options) {
            httpOptions = options;
            if (!options.params) {
                httpOptions.headers = this.defaultHttpHeaders;
            }
        }
        return this.http.post<T>(endpointUrl, postBody, httpOptions);
    }

    protected put<T>(endpointUrl: string, putBody: any, options: HttpRequestOptions = null): Observable<T> {
        let httpOptions = this.defaultHttpOptions;
        if (options) {
            httpOptions = options;
            if (!options.params) {
                httpOptions.headers = this.defaultHttpHeaders;
            }
        }
        return this.http.put<T>(endpointUrl, putBody, httpOptions);
    }

    protected head<T>(endpointUrl: string, options: HttpRequestOptions = null): Observable<T> {
        let httpOptions = this.defaultHttpOptions;
        if (options) {
            httpOptions = options;
            if (!options.params) {
                httpOptions.headers = this.defaultHttpHeaders;
            }
        }
        return this.http.put<T>(endpointUrl, httpOptions);
    }

    protected patch<T>(endpointUrl: string, patchBody: any, options: HttpRequestOptions = null): Observable<T> {
        let httpOptions = this.defaultHttpOptions;
        if (options) {
            httpOptions = options;
            if (!options.params) {
                httpOptions.headers = this.defaultHttpHeaders;
            }
        }
        return this.http.patch<T>(endpointUrl, patchBody, httpOptions);
    }

    protected delete<T>(endpointUrl: string, options: HttpRequestOptions = null): Observable<T> {
        let httpOptions = this.defaultHttpOptions;
        if (options) {
            httpOptions = options;
            if (!options.params) {
                httpOptions.headers = this.defaultHttpHeaders;
            }
        }
        return this.http.delete<T>(endpointUrl, httpOptions);
    }
}
