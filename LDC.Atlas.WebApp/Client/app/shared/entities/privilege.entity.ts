import { PermissionLevels } from "../enums/permission-level.enum";
import { PrivilegeTypes } from "../enums/privilege-type.enum";

export class Privilege {
    privilegeId: number;
    name: string;
    displayName: string;
    level: number;
    description: string;
    parentId: number;
    permission: PermissionLevels; // 0= none 1 = Read 2 = Read Write
    type: PrivilegeTypes; // null Action Attribute
    order: number;
}

