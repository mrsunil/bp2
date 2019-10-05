import { User } from "../../../entities/user.entity";

export class CreateUserCommand {
    favoriteLanguage: string;
	userPrincipalName: string;
	azureObjectIdentifier: string;
	permissions: ManageUserPermissionCommand[];
}

export interface ManageUserPermissionCommand {
	companyId: string;
	profileId: number;
}

export class UpdateUserCommand {
    favoriteLanguage: string;
    isDisabled: boolean;
    managerSamAccountName: string;
    companyRole: string;
	permissions: ManageUserPermissionCommand[];
}
