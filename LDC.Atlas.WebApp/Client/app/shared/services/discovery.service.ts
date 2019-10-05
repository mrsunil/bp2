import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtlasConfiguration } from '../entities/atlas-configuration.entity';
import { OAuth2Config } from '../entities/o-auth2-config.entity';

@Injectable()
export class DiscoveryService {

    constructor(private http: HttpClient,
        @Inject(APP_BASE_HREF) private baseRef: string) { }

    getConfiguration(): Observable<AtlasConfiguration> {
        return this.http.get<AtlasConfiguration>(this.baseRef + environment.discoveryServiceLink);
    }

    getOAuthConfig(): Observable<OAuth2Config> {
        return this.http.get<OAuth2Config>(this.baseRef + environment.discoveryServiceLink + '/oauth');
    }
}
