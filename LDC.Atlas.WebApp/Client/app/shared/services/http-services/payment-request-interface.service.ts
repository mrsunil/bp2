import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.dev';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AccountingInterfaceError } from '../Interface/dto/accounting-interface-error';
import { PaymentRequestInterfaceCommand } from '../Interface/dto/payment-request-interface-command';
import { PaymentRequestInterfaceError } from '../Interface/dto/payment-request-interface-error';
import { UpdateInterfaceError } from '../Interface/dto/update-interface-error';
import { UpdateInterfaceStatusCommand } from '../Interface/dto/update-interface-status-command';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentRequestInterfaceService  extends HttpBaseService {

    private readonly paymentRequestInterfaceControllerUrl = 'paymentrequest';

  constructor(http: HttpClient,
    private companyManager: CompanyManagerService) {
        super(http);
    }

    // Update interface status
    updatePaymentRequestErrorStatus(interfaceError: PaymentRequestInterfaceError, interfaceStatus: string):
     Observable<PaymentRequestInterfaceError> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToUpdateInterfaceStatusCommand(interfaceError, interfaceStatus);
        return this.post<PaymentRequestInterfaceError>(
            `${environment.paymentRequestInterfaceServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.paymentRequestInterfaceControllerUrl}/updatestatusofpaymenterror`,
            command);
    }

    private mapToUpdateInterfaceStatusCommand(interfaceError: PaymentRequestInterfaceError,
        interfaceStatus: string): PaymentRequestInterfaceCommand {
        const command = new PaymentRequestInterfaceCommand();
        command.paymentInterfaceError = interfaceError;
        command.paymentInterfaceStatus = interfaceStatus;
        return command;
    }
}
