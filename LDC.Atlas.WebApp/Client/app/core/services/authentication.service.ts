import { APP_BASE_HREF, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { OAuth2Config } from '../../shared/entities/o-auth2-config.entity';
import { OAuthRefreshResponse } from '../enums/oauth-refresh-response.enum';
import { AppInsightsLoggerService } from './app-insights-logger.service';
import {AtlasStorage} from './atlas-storage';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    private readonly errors: string[] = [
        'interaction_required',
        'login_required',
        'account_selection_required',
        'consent_required',
    ];

    constructor(private oauthService: OAuthService,
        private location: Location,
        private loggerService: AppInsightsLoggerService,
        @Inject(APP_BASE_HREF) private baseRef: string) { }

    get events(): Observable<OAuthEvent> {
        return this.oauthService.events;
    }

    get state(): string {
        return this.oauthService.state;
    }

    set state(state: string) {
        this.oauthService.state = state;
    }

    private loadConfiguration(oAuth2: OAuth2Config) {
        const configuration: AuthConfig = {
            redirectUri: window.location.origin + window['base-href'],
            silentRefreshRedirectUri: window.location.origin + window['base-href'] + 'silent-refresh.html',
            strictDiscoveryDocumentValidation: false,
            requireHttps: false,
            oidc: true,
            clearHashAfterLogin: true,
            skipIssuerCheck: true,
            responseType: 'id_token token',
            loginUrl: oAuth2.loginUrl,
            clientId: oAuth2.clientId,
            resource: oAuth2.resource,
            logoutUrl: oAuth2.logoutUrl,
            issuer: oAuth2.issuer,
            scope: oAuth2.scope,
        };
        return configuration;
    }

    public initialize(configuration: OAuth2Config) {
        this.oauthService.configure(this.loadConfiguration(configuration));
        this.oauthService.setStorage(new AtlasStorage(this.baseRef));
    }

    public login(targetUrl?: string) {
        this.oauthService.initImplicitFlow(encodeURIComponent(targetUrl || this.location.path()));
    }

    public tryLogin(): Promise<void> {
        return this.oauthService.tryLogin();
    }

    public logout() {
        this.oauthService.logOut();
    }

    public refresh(): Promise<OAuthRefreshResponse> {
        return this.oauthService.silentRefresh()
            .then(() => {
                return OAuthRefreshResponse.Success;
            })
            .catch((error) => {
                this.loggerService.logError(error, { operation: 'Atlas_Silent_Refresh', errorDetails: JSON.stringify(error) });
                if (error
                    && error.params && error.params.error
                    && this.errors.indexOf(error.params.error) >= 0) {
                    return OAuthRefreshResponse.InteractionRequired;
                }
                return OAuthRefreshResponse.Error;
            });
    }

    public setupSilentRefresh() {
        this.oauthService.setupAutomaticSilentRefresh();
    }

    public hasValidToken(): boolean {
        return this.oauthService.hasValidAccessToken();
    }

    public getAccessToken() {
        return this.oauthService.getAccessToken();
    }
}
