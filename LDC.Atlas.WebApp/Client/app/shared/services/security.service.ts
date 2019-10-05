import { Injectable } from '@angular/core';
import { forkJoin, Observable, of as observableOf, Subject, throwError } from 'rxjs';
import { catchError, finalize, map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthorizationService } from '../../core/services/authorization.service';
import { AtlasConfiguration } from '../entities/atlas-configuration.entity';
import { DiscoveryService } from './discovery.service';
import { UserIdentityService } from './http-services/user-identity.service';

@Injectable({
    providedIn: 'root',
})
export class SecurityService {
    // observable that is fired when settings are loaded from server
    private settingsLoadedSource = new Subject();
    private userLoadedSource = new Subject();
    private authorizationLoadedSource = new Subject();

    settingsLoaded$ = this.settingsLoadedSource.asObservable();
    userLoaded$ = this.userLoadedSource.asObservable();
    authorizationLoaded$ = this.authorizationLoadedSource.asObservable();
    isReady = false;

    constructor(private authorizationService: AuthorizationService,
        private discoveryService: DiscoveryService,
        private userIdentityService: UserIdentityService) {
    }

    load() {
        return this.discoveryService.getConfiguration()
            .pipe(
                mergeMap((config: AtlasConfiguration) => {
                    this.initializeEnvironment(config);
                    return forkJoin([this.userIdentityService.getMyUserProfile(), this.userIdentityService.getMyPrivileges()]);
                }),
                catchError((error) => {
                    if (error.status === 404) {
                        error.status = 401;
                    } else if (error.status === 403) {
                        Object.defineProperty(error, 'displayAtlasErrorPage', {
                            value: true,
                            writable: false,
                        });
                    }

                    this.authorizationService.denyUser();
                    return throwError(error);
                }),
                mergeMap(([user, privileges]) => {
                    this.authorizationService.user = user;
                    this.authorizationService.authorizeUser();
                    this.authorizationService.addNewCompanyPrivileges(privileges.value);
                    return this.authorizationService.initializeCompanies(user);
                }),
                catchError((error) => {
                    if (error.status === 404) {
                        error.status = 401;
                    } else if (error.status === 403) {
                        Object.defineProperty(error, 'displayAtlasErrorPage', {
                            value: true,
                            writable: false,
                        });
                    }

                    this.authorizationService.denyUser();
                    return throwError(error);
                }),
                finalize(() => {
                    this.authorizationService.authorizationLoaded();
                }))
            .subscribe(
                () => {
                    this.isReady = true;
                    this.settingsLoadedSource.next();
                    this.userLoadedSource.next();
                    this.authorizationLoadedSource.next();
                });
    }

    private initializeEnvironment(configuration: AtlasConfiguration) {
        environment.tradeServiceLink = configuration.endpoints.trading;
        environment.masterDataServiceLink = configuration.endpoints.masterData;
        environment.executionServiceLink = configuration.endpoints.execution;
        environment.controllingServiceLink = configuration.endpoints.controlling;
        environment.documentServiceLink = configuration.endpoints.document;
        environment.userIdentityServiceLink = configuration.endpoints.userIdentity;
        environment.preAccountingServiceLink = configuration.endpoints.preAccounting;
        environment.applicationInsights = configuration.applicationInsights;
        environment.tokenConfiguration = configuration.tokenConfiguration;
        environment.configurationServiceLink = configuration.endpoints.configuration;
        environment.freezeServiceLink = configuration.endpoints.freeze;
        environment.reportingServiceLink = configuration.endpoints.reporting;
        environment.reportServerLink = configuration.endpoints.reportServer;
        environment.accountingInterfaceServiceLink = configuration.endpoints.accountingInterface;
        environment.interfaceServiceLink = configuration.endpoints.interface;
        environment.auditServiceLink = configuration.endpoints.audit;

        environment.environmentType = configuration.environmentType;
        environment.environmentName = configuration.environmentName;
        environment.version = configuration.version;
        environment.friendlyName = configuration.friendlyName;
        environment.lockServiceLink = configuration.endpoints.lock;
    }

    isSecurityReady(): Observable<boolean> {
        if (this.isReady) {
            return observableOf(true);
        }

        return this.settingsLoaded$.pipe(
            mergeMap(() => {
                return this.userLoaded$;
            }),
            mergeMap(() => {
                return this.authorizationLoaded$;
            }),
            map(() => {
                return true;
            }));
    }
}
