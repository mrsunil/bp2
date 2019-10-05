import { ApplicationInsights } from './application-insights.entity';
import { ServiceEndpoints } from './service-endpoints.entity';
import { TokenConfiguration } from './token-configuration.entity';

export interface AtlasConfiguration {
    endpoints: ServiceEndpoints;
    applicationInsights: ApplicationInsights;
    version: string;
    friendlyName: string;
    environmentType: string;
    environmentName: string;
    tokenConfiguration: TokenConfiguration;
}
