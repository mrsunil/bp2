import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyPrivileges } from '../../entities/company-privileges.entity';
import { DirectoryUser } from '../../entities/directory-user.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { Privilege } from '../../entities/privilege.entity';
import { Profile } from '../../entities/profile.entity';
import { UserAccountList } from '../../entities/user-account.entity';
import { UserPermission } from '../../entities/user-permission.entity';
import { UserProfileList } from '../../entities/user-profile.entity';
import { User } from '../../entities/user.entity';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { CreateProfileCommand, CreateProfilePrivilege, UpdateProfileCommand, UpdateProfilePrivilege } from '../user-identity/dtos/profile';
import { CreateUserCommand, UpdateUserCommand } from '../user-identity/dtos/user';
import { HttpBaseService } from './http-base.service';
@Injectable({
    providedIn: 'root',
})
export class UserIdentityService extends HttpBaseService {
    private readonly userControllerUrl = 'users';

    constructor(protected http: HttpClient) {
        super(http);
    }

    // -- Privileges and Profiles

    getAllPrivileges(): Observable<ApiCollection<Privilege>> {
        const res = this.get<ApiCollection<Privilege>>(`${environment.userIdentityServiceLink}/privileges`);
        return res;
    }

    getMyPrivileges(company?: string): Observable<ApiCollection<CompanyPrivileges>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (company) {
            queryParameters = queryParameters.set('company', company);
        }
        options.params = queryParameters;
        return this.get<ApiCollection<CompanyPrivileges>>(
            `${environment.userIdentityServiceLink}/users/me/privileges`,
            options);
    }

    getAllProfiles(): Observable<ApiCollection<Profile>> {
        return this.get<ApiCollection<Profile>>(`${environment.userIdentityServiceLink}/profiles`);
    }

    getMyUserProfile() {
        return this.get<User>(`${environment.userIdentityServiceLink}/users/me`);
    }
    getProfileByCompanyId(companyId?: string): Observable<ApiCollection<UserProfileList>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (companyId) {
            queryParameters = queryParameters.set('companyId', companyId);
        }
        options.params = queryParameters;
        return this.get<ApiCollection<UserProfileList>>(`${environment.userIdentityServiceLink}/profiles/getprofilebycompanyId`, options);
    }

    getProfile(profileId: number): Observable<Profile> {
        return this.get<Profile>(`${environment.userIdentityServiceLink}/profiles/${encodeURIComponent(String(profileId))}`);
    }

    saveProfile(profile: Profile) {
        const createProfileRequest: CreateProfileCommand = {
            name: profile.name,
            description: profile.description,
            privileges: profile.privileges.map((p) => {
                const profilePrivileges: CreateProfilePrivilege = {
                    privilegeId: p.privilegeId,
                    permission: p.permission,
                };
                return profilePrivileges;
            }),
        };
        return this.post(`${environment.userIdentityServiceLink}/profiles`, createProfileRequest);
    }

    updateProfile(profile: Profile) {
        const updateProfileRequest: UpdateProfileCommand = {
            id: profile.profileId,
            name: profile.name,
            description: profile.description,
            privileges: profile.privileges.map((p) => {
                const profilePrivileges: UpdateProfilePrivilege = {
                    privilegeId: p.privilegeId,
                    permission: p.permission,
                };
                return profilePrivileges;
            }),
        };
        return this.patch(
            `${environment.userIdentityServiceLink}/profiles/${encodeURIComponent(String(profile.profileId))}`,
            updateProfileRequest);
    }

    deleteProfile(profileId: number) {
        return this.delete(`${environment.userIdentityServiceLink}/profiles/${encodeURIComponent(String(profileId))}`);
    }

    // -- User
    getAllUsers(): Observable<ApiCollection<User>> {
        return this.get<ApiCollection<User>>(`${environment.userIdentityServiceLink}/users`);
    }
    getUsersByProfileId(profileIds: number[], companyId?: string): Observable<ApiCollection<UserAccountList>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (companyId) {
            queryParameters = queryParameters.set('companyId', companyId);
        }
        queryParameters = queryParameters.set('profileIds', (profileIds.toString()));
        options.params = queryParameters;
        return this.get<ApiCollection<UserAccountList>>(
            `${environment.userIdentityServiceLink}/users/getusersbyprofileId`,
            options);
    }
    getUserByUpn(upn: string): Observable<User> {
        return this.get<User>(`${environment.userIdentityServiceLink}/users/${encodeURIComponent(upn)}`);
    }

    getUserById(userId: number, includeDeletedUsers = false): Observable<User> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        if (includeDeletedUsers) {
            queryParameters = queryParameters.set('includeDeletedUsers', includeDeletedUsers.toString());
        }
        options.params = queryParameters;
        return this.get<User>(`${environment.userIdentityServiceLink}/users/${String(userId)}`, options);
    }

    searchUserByName(name: string): Observable<ApiCollection<User>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', name);
        }
        options.params = queryParameters;
        return this.get<ApiCollection<User>>(`${environment.userIdentityServiceLink}/users`, options);
    }

    createUser(user: User) {
        const command = this.mapToCreateUserCommand(user);

        return this.post(`${environment.userIdentityServiceLink}/${this.userControllerUrl}`, command);
    }

    updateUser(user: User) {
        const command = this.mapToUpdateUserCommand(user);
        return this.patch(`${environment.userIdentityServiceLink}/${this.userControllerUrl}/${String(user.userId)}`, command);
    }

    deleteUser(userId: number) {
        return this.delete<User>(`${environment.userIdentityServiceLink}/${this.userControllerUrl}/${String(userId)}`);
    }

    getDirectoryUsers(searchTerm: string): Observable<ApiPaginatedCollection<DirectoryUser>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (searchTerm !== undefined && searchTerm !== null) {
            queryParameters = queryParameters.set('searchTerm', searchTerm);
        }
        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<DirectoryUser>>(
            `${environment.userIdentityServiceLink}/directory/users`,
            options);
    }

    getDirectoryUserById(userId: string): Observable<DirectoryUser> {
        return this.get<DirectoryUser>(`${environment.userIdentityServiceLink}/directory/users/${encodeURIComponent(userId)}`);
    }

    setMyLastConnectionDateTime() {
        return this.post(`${environment.userIdentityServiceLink}/users/me/lastconnectiondatetime`, null);
    }

    private mapToCreateUserCommand(user: User): CreateUserCommand {
        const command = new CreateUserCommand();
        command.favoriteLanguage = user.favoriteLanguage;
        command.userPrincipalName = user.userPrincipalName;
        command.azureObjectIdentifier = user.azureObjectIdentifier;
        command.permissions = this.mapPermissionToUserCommandPermission(user.permissions);
        return command;
    }

    private mapToUpdateUserCommand(user: User): UpdateUserCommand {
        const command = new UpdateUserCommand();
        command.favoriteLanguage = user.favoriteLanguage;
        command.isDisabled = user.isDisabled;
        command.companyRole = user.companyRole;
        command.managerSamAccountName = user.managerSamAccountName;
        command.permissions = this.mapPermissionToUserCommandPermission(user.permissions);
        return command;
    }

    private mapPermissionToUserCommandPermission(permissions: UserPermission[]) {
        return permissions.map((p) => ({
            companyId: p.companyId,
            profileId: p.profileId,
            isTrader: p.isTrader,
            isCharterManager: p.isCharterManager,
            allDepartments: p.allDepartments,
            departments: p.departments.map((d) => ({ departmentId: d.departmentId })),
        }));
    }

}
