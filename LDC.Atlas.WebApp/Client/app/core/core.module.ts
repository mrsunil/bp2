import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../shared/material.module';
import { ErrorsHandler } from './errors-handler';
import { AppInsightsLoggerService } from './services/app-insights-logger.service';
import { AtlasTranslationService } from './services/atlas-translation.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthorizationService } from './services/authorization.service';
import { CompanyManagerService } from './services/company-manager.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule.forRoot(),
    ],
    declarations: [],
    providers: [
        AppInsightsLoggerService,
        AuthorizationService,
        AtlasTranslationService,
        { provide: ErrorHandler, useClass: ErrorsHandler },
        AuthenticationService,
        CompanyManagerService,
    ],
})

export class CoreModule {
    constructor(protected translateService: TranslateService) {
        translateService.addLangs(['en', 'fr']);
        translateService.setDefaultLang('en');
        translateService.use(translateService.getBrowserLang());
    }
}
