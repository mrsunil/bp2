import { Directive, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthorizationService } from '../../core/services/authorization.service';
import { ActionDefaultBehaviours } from '../enums/action-default-behaviours.enum';
import { PermissionLevels } from '../enums/permission-level.enum';

@Directive({ selector: '[ifAuthorized]' })
export class AuthorizedDirective {

    @Input() ifAuthorized: string;
    @Input() ifAuthorizedBehaviour: ActionDefaultBehaviours = ActionDefaultBehaviours.Hide;
    @Input() ifAuthorizedLevel: PermissionLevels = PermissionLevels.Read;
    @Input() ifAuthorizedSuperPrivilege: string;

    /*different waysuse it
     * *ifAuthorized = "'Level1.Level2.Level3'; company:urlManagementService.getCurrentCompanyId();
     behaviour: ActionDefaultBehaviours.Disable"
     * *ifAuthorized = "'Level1.Level2.Level3'; company:urlManagementService.getCurrentCompanyId(), level: PermissionLevels.read"
	 * *ifAuthorized = "'Level1.Level2.Level3'; company:urlManagementService.getCurrentCompanyId(),
     * behaviour: ActionDefaultBehaviours.Disable"
     * 	 * *ifAuthorized = "'Level1.Level2.Level3'; company:urlManagementService.getCurrentCompanyId(),
     * superPrivilege: 'Level1.Level2.Level3'"
	 * *ifAuthorized = "'Level1.Level2';company:'urlManagementService.getCurrentCompanyId()'"
	 * *ifAuthorized = "'Level1';company:'urlManagementService.getCurrentCompanyId()"
	 */

    constructor(private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authorizationService: AuthorizationService,
        private renderer: Renderer2) {
    }

    @Input()
    set ifAuthorizedCompany(value: string) {
        const privileges = this.ifAuthorized.split('.');
        const privilege = privileges[privileges.length - 1];
        const firstParent = (privileges.length > 1) ? privileges[privileges.length - 2] : null;
        const secondParent = (privileges.length > 2) ? privileges[privileges.length - 3] : null;

        let hasSuperPrivilege = false;
        if (this.ifAuthorizedSuperPrivilege) {
            const superPrivileges = this.ifAuthorizedSuperPrivilege.split('.');
            const superPrivilege = superPrivileges[superPrivileges.length - 1];
            const superFirstParent = (superPrivileges.length > 1) ? superPrivileges[superPrivileges.length - 2] : null;
            const superSecondParent = (superPrivileges.length > 2) ? superPrivileges[superPrivileges.length - 3] : null;
            const superPrivilegePermissionLevel = this.authorizationService.getPermissionLevel(
                value, superPrivilege, superFirstParent, superSecondParent);
            hasSuperPrivilege = superPrivilegePermissionLevel > PermissionLevels.None;
        }

        if (hasSuperPrivilege) {
            return;
        }

        this.viewContainer.clear();
        const userPermissionLevel = this.authorizationService.getPermissionLevel(value, privilege, firstParent, secondParent);
        if (userPermissionLevel === PermissionLevels.None) {
            if (this.ifAuthorizedBehaviour === ActionDefaultBehaviours.Disable) {
                // this peace of code does not work and I do not know how to fix it
                // other people seem to have this error:
                // tslint:disable-next-line:max-line-length
                // https://stackoverflow.com/questions/50655436/unable-to-setattribute-disabled-using-renderer2-on-angular-material-select/50655779
                // their 'bypass" doesn't seem to work for me
                // iit does apply the attribut to the dom but maybe the attribute is given to the wrong drom element?

                this.viewContainer.createEmbeddedView(this.templateRef);
                this.renderer.setProperty(this.templateRef.elementRef.nativeElement, 'disable', true);
            }
        } else if (this.ifAuthorizedLevel <= userPermissionLevel) {
            // If my permission level is higher than the authorized level, then i'll display
            this.viewContainer.createEmbeddedView(this.templateRef);
            if (userPermissionLevel === PermissionLevels.Read) {
                this.renderer.setProperty(this.templateRef.elementRef.nativeElement, 'disable', true);
            }
        }
    }
}
