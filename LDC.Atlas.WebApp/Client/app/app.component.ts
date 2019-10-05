// star scrolling
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { OAuthInfoEvent } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { concatMap, filter, map, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment.dev';
import { OAuthRefreshResponse } from './core/enums/oauth-refresh-response.enum';
import { AppInsightsLoggerService } from './core/services/app-insights-logger.service';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthorizationService } from './core/services/authorization.service';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { routerTransition } from './shared/router.animations';
import { DiscoveryService } from './shared/services/discovery.service';
import { UserIdentityService } from './shared/services/http-services/user-identity.service';
// end scrolling
import { SecurityService } from './shared/services/security.service';

@Component({
    selector: 'atlas-root',
    animations: [routerTransition],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    title = 'app';
    isExpanded = false;
    // star add by souhir:for scrolling
    @ViewChild(CdkScrollable) scrollable: CdkScrollable;
    private readonly ELEVATION_BREAKPOINT = 32;
    private readonly ELEVATION_CLASS = 'mat-elevation-z6';
    name = 'cdkScrollable w/ hardcoded classList';
    destroy$ = new Subject();
    loading = false;
    isAuthorizationLoaded = false;
    isUserAuthorized = false;
    // end scrolling

    constructor(private securityService: SecurityService,
        // star add by souhir:for scrolling
        private scroll: ScrollDispatcher,
        // end scrolling
        private authorizationService: AuthorizationService,
        private authenticationService: AuthenticationService,
        sanitizer: DomSanitizer,
        iconRegistry: MatIconRegistry,
        private router: Router,
        private discoveryService: DiscoveryService,
        private userIdentityService: UserIdentityService,
        private dialog: MatDialog,
        private loggerService: AppInsightsLoggerService,
        private cdr: ChangeDetectorRef,
    ) {

        iconRegistry.addSvgIcon('fix_price', sanitizer.bypassSecurityTrustResourceUrl('assets/fix_price_icon.svg'));
        iconRegistry.addSvgIcon('trades', sanitizer.bypassSecurityTrustResourceUrl('assets/trades.svg'));
        iconRegistry.addSvgIcon('documents', sanitizer.bypassSecurityTrustResourceUrl('assets/documents.svg'));
    }

    ngAfterViewInit() {
        this.scroll.scrolled(200)
            .pipe(map(() => {
                if (this.scrollable.getElementRef().nativeElement.scrollTop > this.ELEVATION_BREAKPOINT) {
                    this.scrollable.getElementRef().nativeElement.children[0].classList.add(this.ELEVATION_CLASS);
                } else {
                    this.scrollable.getElementRef().nativeElement.children[0].classList.remove(this.ELEVATION_CLASS);
                }
            }))
            .subscribe();
    }

    getRouteAnimation(route) {
        return route.activatedRouteData.animation;
    }

    handleAuthEvents() {
        this.authenticationService.events
            .pipe(
                filter((event) => event.type === 'silent_refresh_error'),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                if (environment.tokenConfiguration.silentRefresh) {
                    this.authenticationService.refresh().then((result: OAuthRefreshResponse) => {
                        if (result === OAuthRefreshResponse.InteractionRequired) {
                            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Token expiration',
                                    text: 'Your token is about to expire and to continue to use the application '
                                        + 'your interaction is required. '
                                        + 'You will be redirected to the token provider.',
                                    okButton: 'Got it',
                                },
                            });
                            confirmDialog.afterClosed().subscribe((answer) => {
                                if (answer) {
                                    this.authenticationService.login();
                                }
                            });
                        }
                    });
                }
            });
    }

    async ngOnInit() {
        this.observeAuthorization();
        this.setLastConnectionDate();
        this.handleRouterEvents();

        this.discoveryService.getOAuthConfig()
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe(async (data) => {
                this.authenticationService.initialize(data);
                this.handleAuthEvents();
                if (environment.tokenConfiguration.silentRefresh) {
                    this.authenticationService.setupSilentRefresh();
                }

                await this.authenticationService.tryLogin();

                if (!this.authenticationService.hasValidToken()) {
                    this.authenticationService.login();
                } else {
                    this.securityService.load();
                    this.securityService.isSecurityReady().subscribe(() => {
                        this.loggerService.initialize();
                    });
                }
            });

        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
    }

    setLastConnectionDate() {
        this.securityService.isSecurityReady()
            .pipe(
                concatMap(() => {
                    return this.userIdentityService.setMyLastConnectionDateTime();
                }),
                takeUntil(this.destroy$),
            )
            .subscribe();
    }

    handleRouterEvents() {
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.router.navigated = false;
                this.loading = false;
                this.cdr.detectChanges();
                window.scrollTo(0, 0);
            } else if (evt instanceof NavigationCancel) {
                this.loading = false;
                this.cdr.detectChanges();
            } else if (evt instanceof NavigationError) {
                this.loading = false;
                this.cdr.detectChanges();
            } else if (evt instanceof NavigationStart) {
                this.loading = true;
                this.cdr.detectChanges();
            }
        });
    }

    observeAuthorization() {
        this.authorizationService.authorizationLoaded$.subscribe((isAuthorizationLoaded) => {
            this.isAuthorizationLoaded = isAuthorizationLoaded;
        });

        this.authorizationService.isUserAuthorized$.subscribe((isUserAuthorized) => {
            this.isUserAuthorized = isUserAuthorized;
        });
    }

    toggleSideBar() {
        this.isExpanded = !this.isExpanded;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
