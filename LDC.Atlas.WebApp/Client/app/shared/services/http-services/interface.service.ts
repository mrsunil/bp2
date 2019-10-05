import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { StartStopInterfaceProcessCommand } from '../Interface/dto/start-stop-interface-process.entity';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class InterfaceService extends HttpBaseService {
    private readonly BuilderControllerUrl = 'builder';
    private readonly InterfaceControllerUrl = 'interface';
    constructor(
        private companyManager: CompanyManagerService,
        http: HttpClient) {
        super(http);
    }

    getMessage(interfaceTypeId: number, objectTypeId: number, docId: string, company: string): Observable<string> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (interfaceTypeId) {
            queryParameters = queryParameters.set('interfaceTypeId', interfaceTypeId as any);
        }
        if (objectTypeId) {
            queryParameters = queryParameters.set('objectTypeId', objectTypeId as any);
        }
        if (docId) {
            queryParameters = queryParameters.set('docId', docId.toString());
        }
        options.params = queryParameters;
        return this.get<string>(
            `${environment.interfaceServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.BuilderControllerUrl}`, options);
    }

    public checkDocumentIdExists(company: string, docId: string, objectTypeId: number): Observable<any> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (docId) {
            queryParameters = queryParameters.set('docId', docId as any);
        }
        if (objectTypeId) {
            queryParameters = queryParameters.set('objectTypeId', objectTypeId as any);
        }
        options.params = queryParameters;
        return this.get<boolean>(
            `${environment.interfaceServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.BuilderControllerUrl}/checkdocumentreferenceexists`, options);
    }

    getInterfaceActiveStatus(): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<boolean>(
            `${environment.interfaceServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.InterfaceControllerUrl}/interfaceactivestatus`);
    }

    public startStopInterfaceProcess(isActive: boolean): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = new StartStopInterfaceProcessCommand();
        command.isActive = isActive;
        const action = `${encodeURIComponent(String(company))}/${this.InterfaceControllerUrl}/startstopinterface/`;
        return this.post(environment.interfaceServiceLink + '/' + action, command);
    }
}
