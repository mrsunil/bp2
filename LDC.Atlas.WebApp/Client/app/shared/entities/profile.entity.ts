import { ProfilePrivilege } from './profile-privilege.entity';

export class Profile {
    profileId: number;
    name: string;
    description: string;
    isDisabled: boolean;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    numberOfUsers: number;
    privileges: ProfilePrivilege[];
}
