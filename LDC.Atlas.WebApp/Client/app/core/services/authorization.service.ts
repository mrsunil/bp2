import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { CompanyPrivileges } from '../../shared/entities/company-privileges.entity';
import { UserPermission } from '../../shared/entities/user-permission.entity';
import { User } from '../../shared/entities/user.entity';
import { PermissionLevels } from '../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../shared/services/authorization/dtos/user-company-privilege';
import { ConfigurationService } from '../../shared/services/http-services/configuration.service';
import { HttpBaseService } from '../../shared/services/http-services/http-base.service';
import { CompanyManagerService } from './company-manager.service';

@Injectable({
    providedIn: 'root',
})
export class AuthorizationService extends HttpBaseService {
    private authorizationLoadedSubject = new Subject<boolean>();
    private isAuthorizedSubject = new Subject<boolean>();
    companyPrivileges: { [company: string]: UserCompanyPrivilegeDto[] } = {};
    user: User;
    authorizationLoaded$ = this.authorizationLoadedSubject.asObservable();
    isUserAuthorized$ = this.isAuthorizedSubject.asObservable().pipe(
        shareReplay(1),
    );

    constructor(protected http: HttpClient,
        protected companyManager: CompanyManagerService,
        protected configurationService: ConfigurationService) {
        super(http);
        this.user = new User();
    }

    addNewCompanyPrivileges(companyPrivileges: CompanyPrivileges[]) {
        if (companyPrivileges) {
            companyPrivileges.forEach((element) => {
                if (!(element.companyId in this.companyPrivileges)) {
                    this.companyPrivileges[element.companyId] = element.privileges;
                }
            });
        }
    }

    initializeCompanies(user: User): Observable<void> {
        const companiesId: string[] = [];
        user.permissions.forEach((element: UserPermission) => {
            companiesId.push(element.companyId);
        });
        return this.companyManager.initialize(companiesId);
    }

    isCompanyPrivilegesLoaded(company: string): boolean {
        return (company in this.companyPrivileges);
    }

    isPrivilegeAllowed(
        company: string,
        privilege: string,
        permission: PermissionLevels = null): boolean {
        if (this.isCompanyPrivilegesLoaded(company) && this.companyPrivileges[company] !== undefined) {
            if (this.companyManager.getCompany(company).isFrozen && permission === PermissionLevels.ReadWrite) {
                return false;
            }
            const values = this.companyPrivileges[company]
                .filter((p) => (p.privilegeName.toLowerCase() === privilege.toLowerCase()) &&
                    (permission ? p.permission >= permission : true));
            return (values.length === 1);
        }
        return false;
    }

    getCurrentUser() {
        return this.user;
    }

    isUserAllowedForCompany(companyId: string) {
        return this.companyManager.getCompany(companyId) !== null && this.companyManager.getCompany(companyId) !== undefined;
    }

    getPermissionLevel(company: string, privilege: string, parentLevelOne: string = null, parentLevelTwo: string = null): PermissionLevels {

        let permissionLevel: PermissionLevels = PermissionLevels.None;
        // check if user has right to the company
        if (this.isCompanyPrivilegesLoaded(company) && this.companyPrivileges[company] !== undefined) {

            // check if user has the privilege
            let permission = this.companyPrivileges[company]
                .filter((p) => (p.privilegeName.toLowerCase() === privilege.toLowerCase()));
            if (permission.length > 0) {
                if (!this.companyManager.getCompany(company).isFrozen) {
                    permissionLevel = permission[0].permission as PermissionLevels;
                } else {
                    permissionLevel = Math.min(PermissionLevels.Read, permission[0].permission);
                }
            }

            // check if the privilege should be in a tree and has the rights of the parent - Level 1
            if (parentLevelOne && permissionLevel !== PermissionLevels.None) {
                permission = this.companyPrivileges[company]
                    .filter((p) => (p.privilegeName.toLowerCase() === parentLevelOne.toLowerCase()));
                if (permission.length === 0) {
                    permissionLevel = PermissionLevels.None;
                }
            }

            // check if the privilege should be in a tree and has the rights of the parent - Level 2
            if (parentLevelTwo && permissionLevel !== PermissionLevels.None) {
                permission = this.companyPrivileges[company]
                    .filter((p) => (p.privilegeName.toLowerCase() === parentLevelTwo.toLowerCase()));
                if (permission.length === 0) {
                    permissionLevel = PermissionLevels.None;
                }
            }
        }

        return permissionLevel;
    }

    isAdministrator(company: string) {
        const companyPermission = this.user.permissions.find((permission) => permission.companyId === company);
        return companyPermission && companyPermission.profileName === 'Administrator';
    }

    authorizationLoaded() {
        this.authorizationLoadedSubject.next(true);
    }

    authorizeUser() {
        this.isAuthorizedSubject.next(true);
    }

    denyUser() {
        this.isAuthorizedSubject.next(false);
    }
}
