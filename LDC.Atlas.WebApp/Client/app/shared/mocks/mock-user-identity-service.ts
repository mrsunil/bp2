import { Observable, of } from 'rxjs';
import { Profile } from '../entities/profile.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { User } from '../entities/user.entity';
import { ApiCollection } from '../services/common/models';
import { UserIdentityService } from '../services/http-services/user-identity.service';

export class MockUserIdentityService extends UserIdentityService {

    getUser(userId: string): Observable<User> {
        const privileges: UserPermission[] = [{
            companyId: 'e3',
            profileId: 1,
            profileName: 'Administrator',
            allDepartments: true,
            departments: [],
            isTrader: true,
            isCharterManager: true,
        },
        {
            companyId: 's4',
            profileId: 1,
            profileName: 'Administrator',
            allDepartments: true,
            departments: [],
            isTrader: true,
            isCharterManager: true,
        }];

        const user: User = {
            userId: 1,
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@test.com',
            userPrincipalName: 'johndoe@test.com',
            samAccountName: 'johndoe',
            azureObjectIdentifier: '4F99E6DA-746C-49C4-85AE-867B7C25F3D4',
            phoneNumber: '0723456789',
            location: 'France',
            favoriteLanguage: 'FR-fr',
            isDisabled: false,
            createdDateTime: new Date(),
            createdBy: 'Atlas',
            modifiedDateTime: new Date(),
            modifiedBy: 'Atlas',
            lastConnectionDateTime: new Date(),
            permissions: privileges,
            companyRole: 'Developer',
            managerSamAccountName: 'BigBoos',
        };
        return of(user);
    }

    getAllProfiles(): Observable<ApiCollection<Profile>> {
        const profiles: Profile[] = [{
            profileId: 1,
            name: 'Administrator',
            isDisabled: false,
            numberOfUsers: 5,
            createdDateTime: new Date(),
            createdBy: 'Atlas',
            modifiedDateTime: new Date(),
            modifiedBy: 'Atlas',
            description: 'Admin profile',
            privileges: [],
        },
        {
            profileId: 2,
            name: 'Trader',
            isDisabled: false,
            numberOfUsers: 5,
            createdDateTime: new Date(),
            createdBy: 'Atlas',
            modifiedDateTime: new Date(),
            modifiedBy: 'Atlas',
            description: 'Trader profile',
            privileges: [],
        },
        {
            profileId: 3,
            name: 'Controlling',
            isDisabled: false,
            numberOfUsers: 5,
            createdDateTime: new Date(),
            createdBy: 'Atlas',
            modifiedDateTime: new Date(),
            modifiedBy: 'Atlas',
            description: 'Controlling profile',
            privileges: [],
        }];

        const profileCollection: ApiCollection<Profile> = {
            value: profiles,
        };

        return of(profileCollection);
    }
}
