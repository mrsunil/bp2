import { Privilege } from './privilege.entity';

export class PrivilegeNode {
    privilege: Privilege;
    children: PrivilegeNode[];

    getPermission() {
        return this.privilege.permission;
    }

    getId() {
        return this.privilege.privilegeId;
    }

    getLevel() {
        return this.privilege.level;
    }

    getParentId() {
        return this.privilege.parentId;
    }
}
