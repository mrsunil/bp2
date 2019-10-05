import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import atlasTradingEn from '../../../assets/translations/trading/atlasTrading.en.json';
import { AtlasTranslationService } from '../../core/services/atlas-translation.service';

@Injectable()
export class AtlasTradingTranslationResolver
    implements Resolve<boolean> {
    constructor(
        private atlasTranslationService: AtlasTranslationService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
    ): Observable<boolean> {
        return this.atlasTranslationService.loadTranslationFile('trading', atlasTradingEn);
    }
}
