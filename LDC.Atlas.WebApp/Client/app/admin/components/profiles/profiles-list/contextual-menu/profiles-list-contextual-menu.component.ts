import { Component } from '@angular/core';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { Profile } from '../../../../../shared/entities/profile.entity';
import { ProfilesListComponent } from '../profiles-list.component';

@Component({
    selector: 'atlas-profiles-list-contextual-menu',
    templateUrl: './../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component.html',
    styleUrls: ['./../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component.scss']
})
export class ProfilesListContextualMenuComponent extends AgContextualMenuComponent {

    componentParent: ProfilesListComponent;
    profile: Profile;

    constructor() {
        super();
    }

    agInit(params: any) {
        this.params = params;
        this.menuActions = params.menuActions;
        this.profile = params.data;
        this.componentParent = this.params.context.componentParent;

        this.filterOptionsForAdmin();
    }

    filterOptionsForAdmin() {
        if (this.profile.name == 'Administrator') {
            this.menuActions = this.menuActions.filter((action) => action.action == this.componentParent.profileMenuActions.copyProfile);
        }
    }
}
