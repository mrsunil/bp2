import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router';
import { AppInsights } from 'applicationinsights-js';
import { environment } from '../../../environments/environment';
import { AuthorizationService } from './authorization.service';

@Injectable({
    providedIn: 'root',
})
export class AppInsightsLoggerService {

    private isInitialized: boolean;

    constructor(private router: Router,
        private authorizationService: AuthorizationService) {
    }

    /* Call downloadAndSetup to download full ApplicationInsights script from CDN and initialize it with instrumentation key */
    initialize() {
        this.isInitialized = false;

        if (environment.applicationInsights && environment.applicationInsights.instrumentationKey.length > 1) {
            try {
                AppInsights.downloadAndSetup({
                    instrumentationKey: environment.applicationInsights.instrumentationKey,
                });
                this.isInitialized = true;
                const user = this.authorizationService.getCurrentUser();
                if (user) {
                    AppInsights.setAuthenticatedUserContext(user.userId.toString(), user.samAccountName);
                }

                this.router.events.subscribe((event) => {
                    if (event instanceof ResolveEnd) {
                        const activatedComponent = this.getActivatedComponent(event.state.root);
                        if (activatedComponent) {
                            this.logPageView(
                                `${activatedComponent.name} ${this.getRouteTemplate(event.state.root)}`,
                                event.state.root.params,
                                event.urlAfterRedirects);
                        }
                    }
                });
            } catch (e) {

            }
        }
    }

    /*
    AppInsights.trackPageView(
            "FirstPage", // (optional) page name
            null,  // (optional) page url if available
    { prop1: "prop1", prop2: "prop2" }, // (optional) dimension dictionary
    { measurement1: 1 }, // (optional) metric dictionary
    123  //page view duration in milliseconds
        );
	//*/
    public logPageView(pageName: string, properties?: { [name: string]: string; }, url?: string) {
        if (this.isInitialized) {
            AppInsights.trackPageView(
                pageName,
                url,
                properties,
            );
        }
    }

    public logError(error: Error, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
        AppInsights.trackException(error, null, this.addGlobalProperties(properties), measurements);
    }

    private addGlobalProperties(properties?: { [key: string]: string }): { [key: string]: string } {
        if (!properties) {
            properties = {};
        }

        return properties;
    }

    public logEvent(eventName: string, properties?: { [name: string]: string; }) {
        if (this.isInitialized) {
            AppInsights.trackEvent(
                eventName,
                properties);
        }
    }

    private getActivatedComponent(snapshot: ActivatedRouteSnapshot): any {

        if (snapshot.firstChild) {
            return this.getActivatedComponent(snapshot.firstChild);
        }

        return snapshot.component;
    }

    private getRouteTemplate(snapshot: ActivatedRouteSnapshot): string {
        let path = '';
        if (snapshot.routeConfig) {
            path += snapshot.routeConfig.path;
        }

        if (snapshot.firstChild) {
            return path + this.getRouteTemplate(snapshot.firstChild);
        }

        return path;
    }
}
