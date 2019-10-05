import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { InterfaceMonitoringDetails } from '../../entities/interface-monitoring-details.entity';
import { InterfaceMonitoringSummary } from '../../entities/interface-monitoring-summary.entity';
import { TransactionDetail } from '../../entities/transaction-detail.entity';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { DateConverterService } from '../date-converter.service';
import { CashRecord } from '../execution/dtos/cash-record';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class AuditService extends HttpBaseService {
    private readonly EventsControllerUrl = 'events';
    constructor(protected http: HttpClient,
        private dateConverter: DateConverterService) {
        super(http);
    }

getEvents(): Observable < ApiCollection < InterfaceMonitoringSummary >> {
        return this.get < ApiCollection<InterfaceMonitoringSummary>>(
            `${environment.auditServiceLink}/${this.EventsControllerUrl}`);
    }
    getSearchEvents(interfaceType?: number, status?: string, fromDate?: Date, toDate?: Date, businessId?: string,
        ): Observable<ApiCollection<InterfaceMonitoringSummary>> {

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (interfaceType) {
            queryParameters = queryParameters.set('interfaceType', interfaceType.toString());
        }
        if (status) {
            queryParameters = queryParameters.set('interfaceStatus', status.toString());
        }
        if (fromDate) {
            queryParameters = queryParameters.set(
                'fromDate',
                this.dateConverter.dateToStringConverter(fromDate));
        }
        if (toDate) {
            queryParameters = queryParameters.set(
                'toDate',
                this.dateConverter.dateToStringConverter(toDate));
        }
        if (businessId) {
            queryParameters = queryParameters.set('documentReference', businessId.toString());
        }
        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<InterfaceMonitoringSummary>>(
            `${environment.auditServiceLink}/${this.EventsControllerUrl}/search`,
            options,
        );
    }

    getTransactionDoumentDetailsByAccountingId(accountingId: number, company: string): Observable<TransactionDetail> {
        return this.get <TransactionDetail>(
            `${environment.auditServiceLink}/${this.EventsControllerUrl}/${encodeURIComponent(String(company))}/transactiondetail/${encodeURIComponent(String(accountingId))}`);
    }

    getCashDetailsByCashId(cashId: number, company: string): Observable<CashRecord> {
        return this.get <CashRecord>(
            `${environment.auditServiceLink}/${this.EventsControllerUrl}/${encodeURIComponent(String(company))}/cashdetail/${encodeURIComponent(String(cashId))}`);
    }

    getEventDetails(eventId: number, company: string): Observable < ApiPaginatedCollection < InterfaceMonitoringDetails >> {
            const options: HttpRequestOptions = new HttpRequestOptions();
            const queryParameters = new HttpParams();

            options.params = queryParameters;

            return this.get<ApiPaginatedCollection<InterfaceMonitoringDetails>>(
                `${environment.auditServiceLink}/${this.EventsControllerUrl}/${encodeURIComponent(String(company))}/eventhistorybyid/${encodeURIComponent(String(eventId))}`,
                options,
            );
        }
    
}
