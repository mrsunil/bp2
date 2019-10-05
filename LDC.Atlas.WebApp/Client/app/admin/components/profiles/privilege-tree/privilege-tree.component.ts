import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PrivilegeNode } from '../../../../shared/entities/privilege-node.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { PrivilegeTypes } from '../../../../shared/enums/privilege-type.enum';

@Component({
    selector: 'atr-privilege-tree',
    templateUrl: './privilege-tree.component.html',
    styleUrls: ['./privilege-tree.component.scss'],
})
export class PrivilegeTreeComponent implements OnInit {
    PrivilegeTypes = PrivilegeTypes;
    PermissionLevels = PermissionLevels;

    @Input() form: FormGroup = null;
    @Input() privilege: PrivilegeNode = null; // level 2 privilege with its children

    actionPrivileges: PrivilegeNode[] = [];
    exceptionPrivileges: PrivilegeNode[] = [];

    allActionsHaveWrite: boolean = false;
    allExceptionsHaveRead: boolean = false;
    allExceptionsHaveWrite: boolean = false;

    constructor() { }

    ngOnInit() {
        this.privilege.children.forEach((priv) => {
            if (priv.privilege.type === PrivilegeTypes.Action) {
                this.actionPrivileges.push(priv);
            }
            if (priv.privilege.type === PrivilegeTypes.Exception) {
                this.exceptionPrivileges.push(priv);
            }
        });
        this.doAllActionsHaveWrite();
    }

    isSelected(privilege: PrivilegeNode, permission: PermissionLevels) {
        return (privilege.getPermission() === permission);
    }

    privilegePermissionChange(privilege: PrivilegeNode, permission: PermissionLevels) {
        if (privilege.privilege.type === PrivilegeTypes.Exception && permission === PermissionLevels.Read
            && this.allExceptionsHaveWrite) {
            this.allExceptionsHaveWrite = false;
        }
        if (privilege.privilege.type === PrivilegeTypes.Exception && permission === PermissionLevels.ReadWrite
            && this.allExceptionsHaveRead) {
            this.allExceptionsHaveRead = false;
        }

        const oldPermission = privilege.getPermission();
        privilege.privilege.permission = (oldPermission === permission) ? PermissionLevels.None : permission;
        this.doAllActionsHaveWrite();
    }

    selectAllActions() {
        this.allActionsHaveWrite = !this.allActionsHaveWrite;
        if (this.allActionsHaveWrite) {
            this.setMultiplePrivilegePermission(this.actionPrivileges, PermissionLevels.ReadWrite);
        } else {
            this.setMultiplePrivilegePermission(this.actionPrivileges, PermissionLevels.None);
        }
    }

    selectAllExceptions(permission: PermissionLevels) {
        if ((permission === PermissionLevels.Read && this.allExceptionsHaveRead) ||
            (permission === PermissionLevels.ReadWrite && this.allExceptionsHaveWrite)) {

            this.setMultiplePrivilegePermission(this.exceptionPrivileges, PermissionLevels.None);
            this.allExceptionsHaveRead = false;
            this.allExceptionsHaveWrite = false;

        } else {
            this.setMultiplePrivilegePermission(this.exceptionPrivileges, permission);

            // If click on Read
            if (permission === PermissionLevels.Read) {
                this.allExceptionsHaveRead = true;
                this.allExceptionsHaveWrite = false;
            } else {
                this.allExceptionsHaveWrite = true;
                this.allExceptionsHaveRead = false;
            }
        }
    }

    setMultiplePrivilegePermission(list: PrivilegeNode[], permission: PermissionLevels) {
        list.forEach((priv) => {
            priv.privilege.permission = permission;
        });
    }

    doAllActionsHaveWrite() {
        this.allActionsHaveWrite = this.actionPrivileges.every((action) => action.privilege.permission === PermissionLevels.ReadWrite);
    }
}
