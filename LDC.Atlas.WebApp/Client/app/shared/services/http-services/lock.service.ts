import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { IsLocked } from '../../entities/is-locked.entity';
import { LockFunctionalContext } from '../../entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../entities/lock-resource-information.entity';
import { Lock } from '../../entities/lock.entity';
import { SectionReference } from '../../entities/section-reference.entity';
import { ApiPaginatedCollection } from '../common/models';
import { DeleteLocksCommand } from '../lock/dtos/delete-locks-command';
import { LockResourceCommand } from '../lock/dtos/lock-resource-command';
import { RefreshLockOwnershipCommand } from '../lock/dtos/refresh-lock-ownership-command';
import { UnlockResourceCommand } from '../lock/dtos/unlock-resource-command';
import { WebStorageService } from '../web-storage.service';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class LockService extends HttpBaseService {

    private readonly lockControllerUrl = 'Locks';
    public cleanSessionLocksSubject = new Subject();

    constructor(
        protected httpClient: HttpClient,
        private companyManager: CompanyManagerService,
        private storageService: WebStorageService,
    ) {
        super(httpClient);
        this.cleanSessionLocksSubject.subscribe(() => {
            this.cleanSessionLocks();
        });
    }

    private getBrowserTabId(): string {
        const browserTabIdKey = 'browserTabIdKey';
        if (!this.storageService.isInStorage(browserTabIdKey)) {
            this.storageService.saveToStorage(browserTabIdKey, Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        }
        return this.storageService.loadFromStorage(browserTabIdKey).toString();
    }

    public isLockedContract(sectionId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${sectionId}/applicationSessionId/${applicationSessionId}/resourceType/Contract`);
    }

    public async isLockedContractAsync(sectionId: number): Promise<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${sectionId}/applicationSessionId/${applicationSessionId}/resourceType/Contract`).toPromise();
    }

    public isLockedInvoice(invoiceId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${invoiceId}/applicationSessionId/${applicationSessionId}/resourceType/Invoice`);
    }

    public isLockedCharter(sectionId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${sectionId}/applicationSessionId/${applicationSessionId}/resourceType/Charter`);
    }

    public isLockedFxDeal(fxDealId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${fxDealId}/applicationSessionId/${applicationSessionId}/resourceType/FxDeal`);
    }

    public isLockedUserAccount(userId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${userId}/applicationSessionId/${applicationSessionId}/resourceType/User Account`);
    }

    public isLockedUserProfile(profileId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${profileId}/applicationSessionId/${applicationSessionId}/resourceType/User Profile`);
    }

    public isLockedCostMatrix(costMatrixId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${costMatrixId}/applicationSessionId/${applicationSessionId}/resourceType/Cost Matrix`);
    }

    public isLockedCashDocument(cashId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${cashId}/applicationSessionId/${applicationSessionId}/resourceType/Cash Document`);
    }

    public isLockedAccountingDocument(accountingId: number): Observable<IsLocked> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId: string = this.getBrowserTabId();
        return this.get<IsLocked>(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/islocked/${accountingId}/applicationSessionId/${applicationSessionId}/resourceType/Accounting Document`);
    }

    public getLockList(): Observable<ApiPaginatedCollection<Lock>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiPaginatedCollection<Lock>>(
            `${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}`);
    }

    public lockContract(sectionId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(sectionId, functionalContext, 'Contract');
    }

    public lockInvoice(invoiceId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(invoiceId, functionalContext, 'Invoice');
    }

    public lockCharter(charterId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(charterId, functionalContext, 'Charter');
    }

    public lockFxDeal(fxDealId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(fxDealId, functionalContext, 'FxDeal');
    }

    public lockAccountingDocument(charterId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(charterId, functionalContext, 'Accounting Document');
    }

    public lockUserAccount(userId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(userId, functionalContext, 'User Account');
    }

    public lockUserProfile(profileId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(profileId, functionalContext, 'User Profile');
    }

    public lockCostMatrix(costMatrixId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(costMatrixId, functionalContext, 'Cost Matrix');
    }

    public lockCashDocument(cashId: number, functionalContext: LockFunctionalContext) {
        return this.lockResource(cashId, functionalContext, 'Cash Document');
    }

    private lockResource(resourceId: number, functionalContext: LockFunctionalContext, resourceType: string) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request = new LockResourceCommand();
        request.company = company;
        request.functionalContext = functionalContext;
        request.resourceId = resourceId;
        request.resourceType = resourceType;
        request.applicationSessionId = this.getBrowserTabId();

        return this.post(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}`, request);
    }

    public unlockContract(sectionId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(sectionId, functionalContext, 'Contract');
    }

    public unlockCharter(charterId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(charterId, functionalContext, 'Charter');
    }

    public unlockUserAccount(userId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(userId, functionalContext, 'User Account');
    }

    public unlockUserProfile(profileId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(profileId, functionalContext, 'User Profile');
    }

    public unlockCostMatrix(costMatrixId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(costMatrixId, functionalContext, 'Cost Matrix');
    }

    public unlockCashDocument(cashId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(cashId, functionalContext, 'Cash Document');
    }

    public unlockInvoice(cashId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(cashId, functionalContext, 'Invoice');
    }

    public unlockAccountingDocument(accountingId: number, functionalContext: LockFunctionalContext) {
        return this.unlockResource(accountingId, functionalContext, 'Accounting Document');
    }

    private unlockResource(resourceId: number, functionalContext: LockFunctionalContext, resourceType: string) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request = new UnlockResourceCommand();
        request.company = company;
        request.functionalContext = functionalContext;
        request.resourceId = resourceId;
        request.applicationSessionId = this.getBrowserTabId();
        request.resourceType = resourceType;

        return this.post(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/unlock`, request);
    }

    public deleteLocks(ids: number[]) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const request = new DeleteLocksCommand();
        request.lockIds = ids;

        return this.post(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/delete`, request);
    }

    public refreshLockOwnership(resourcesInformation: LockResourceInformation[]): Observable<void> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const request = new RefreshLockOwnershipCommand();
        request.applicationSessionId = this.getBrowserTabId();
        request.company = company.toString();
        request.resourcesInformation = new Array<LockResourceInformation>();
        resourcesInformation.forEach((resource) => {
            const resourceInformation = new LockResourceInformation();
            resourceInformation.resourceType = resource.resourceType;
            resourceInformation.resourceId = resource.resourceId;
            resourceInformation.resourceCode = resource.resourceCode;

            request.resourcesInformation.push(resourceInformation);
        });

        return this.post(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/refresh`, request);
    }

    public validateContractOperation(functionalContext: LockFunctionalContext, resourceId: number, allocatedReference: SectionReference): Observable<string> {
        let allocatedSectionId: number = 0;
        if (allocatedReference != null && allocatedReference.sectionId != null && allocatedReference.sectionId != undefined && allocatedReference.sectionId != 0) {
            allocatedSectionId = allocatedReference.sectionId;
        }
        return this.isLockedContract(allocatedSectionId).pipe(
            map((isLocked) => {
                if (isLocked.isLocked) {
                    return `The contract cannot be saved as the allocated contract ${allocatedReference.contractLabel} is locked.`;
                }
                return null;
            }));
    }

    public cleanSessionLocks(): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const applicationSessionId = this.getBrowserTabId();
        return this.delete(`${environment.lockServiceLink}/${encodeURIComponent(company)}/${this.lockControllerUrl}/cleansession/${encodeURIComponent(applicationSessionId)}`)
            .pipe(map(() => true));
    }
}
