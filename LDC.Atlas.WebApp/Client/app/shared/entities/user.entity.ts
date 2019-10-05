import { UserPermission } from './user-permission.entity';

export class User {
    userId: number;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    favoriteLanguage: string;
    location: string;
    isDisabled: boolean;
    userPrincipalName: string;
    samAccountName: string;
    azureObjectIdentifier: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    lastConnectionDateTime: Date;
    managerSamAccountName: string;
    permissions: UserPermission[] = [];
    companyRole: string;
}
