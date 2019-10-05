export interface CreateProfileCommand {
    name: string;
    description: string;
    privileges: CreateProfilePrivilege[];
}

export interface CreateProfilePrivilege {
    privilegeId: number;
    permission: number;
}

export interface UpdateProfilePrivilege {
    privilegeId: number;
    permission: number;
}

export interface UpdateProfileCommand {
    id: number;
    name: string;
    description: string;
    privileges: UpdateProfilePrivilege[];
}
