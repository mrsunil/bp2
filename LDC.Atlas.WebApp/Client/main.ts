import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('SHI_International_Corp_-_UK__on_behalf_of_Accenture_Finland_ATLAS_V2_1Devs21_November_2019__MTU3NDI5NDQwMDAwMA==54b64dae9075f37c2d9b85d560f38c98');
if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
