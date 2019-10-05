import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { ApiCollection } from '../common/models';
import { AccountingInterfaceError } from '../Interface/dto/accounting-interface-error';
import { UpdateInterfaceError } from '../Interface/dto/update-interface-error';
import { UpdateInterfaceStatusCommand } from '../Interface/dto/update-interface-status-command';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class AccountingInterfaceService extends HttpBaseService {
    private readonly accountingInterfaceControllerUrl = 'accountinginterface';
    constructor(
        http: HttpClient,
        private companyManager: CompanyManagerService) {
        super(http);
    }

    listErrorsForErrorManagement(): Observable<ApiCollection<AccountingInterfaceError>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();

        return this.get<ApiCollection<AccountingInterfaceError>>(
            `${environment.accountingInterfaceServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingInterfaceControllerUrl}/listerrorsforerrormanagement`,
            options);
    }

    // Update interface status
    updateAccountingErrorStatus(interfaceError: UpdateInterfaceError[], interfaceStatus: string): Observable<AccountingInterfaceError> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToUpdateInterfaceStatusCommand(interfaceError, interfaceStatus);
        return this.post<AccountingInterfaceError>(
            `${environment.accountingInterfaceServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingInterfaceControllerUrl}/updatestatusofaccountingerror`,
            command);
    }

    private mapToUpdateInterfaceStatusCommand(interfaceError: UpdateInterfaceError[],
        interfaceStatus: string): UpdateInterfaceStatusCommand {
        const command = new UpdateInterfaceStatusCommand();
        command.accountingInterfaceError = interfaceError;
        command.accountingInterfaceStatus = interfaceStatus;
        return command;
    }
}
