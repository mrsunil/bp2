
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthorizationService } from '../../core/services/authorization.service';
import { UserCompanyPrivilegeDto } from '../services/authorization/dtos/user-company-privilege';
import { SecurityService } from '../services/security.service';

@Injectable({
    providedIn: 'root',
})
export class SecurityGuard implements CanActivate {
    constructor(private securityService: SecurityService,
        private authorizationService: AuthorizationService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authorizationService.isUserAuthorized$.pipe(
            mergeMap((isUserAuthenticated) => {
                if (isUserAuthenticated === false) {
                    return of(false);
                } else {
                    return this.securityService.isSecurityReady().pipe(
                        map(() => {
                            if (this.authorizationService.isUserAllowedForCompany(route.params.company)) {
                                const privileges: UserCompanyPrivilegeDto[] = route.data.authorizations as UserCompanyPrivilegeDto[];
                                if (privileges != null) {
                                    // tslint:disable-next-line: forin
                                    for (const privilege in privileges) {
                                        const permissionLevelRequired = privileges[privilege].permission;

                                        const permissionLevel = this.authorizationService.getPermissionLevel(
                                            route.params.company,
                                            privileges[privilege].privilegeName,
                                            privileges[privilege].privilegeParentLevelOne,
                                            privileges[privilege].privilegeParentLevelTwo,
                                        );
                                        if (permissionLevel >= permissionLevelRequired) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                                return true;
                            }
                            return false;
                        }));
                }
            }));
    }
}
