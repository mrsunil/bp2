import { Observable, of as observableOf } from 'rxjs';
import { FlagInfo } from '../dtos/flag-info';
import { FeatureFlagService } from '../services/http-services/feature-flag.service';

export class MockFeatureFlagService extends FeatureFlagService {
    getFlagInfo(flagName: string): Observable<FlagInfo> {

        const mockFlagInfo: FlagInfo = {
            active: true,
            name: flagName,
        };
        if (flagName !== 'gap110' && flagName !== '!gap110') {
            mockFlagInfo.active = false;
        }
        console.log(mockFlagInfo);
        return observableOf(mockFlagInfo);
    }
}
