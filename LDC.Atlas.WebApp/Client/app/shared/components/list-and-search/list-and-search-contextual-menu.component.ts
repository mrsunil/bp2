import { Component } from '@angular/core';
import { AgContextualMenuComponent } from '../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { ListAndSearchComponent } from '../list-and-search/list-and-search.component';

@Component({
    selector: 'atlas-profiles-list-contextual-menu',
    templateUrl: '../../../shared/components/ag-contextual-menu/ag-contextual-menu.component.html',
    styleUrls: ['../../../shared/components/ag-contextual-menu/ag-contextual-menu.component.scss'],
})
export class ListAndSearchContextualMenuComponent extends AgContextualMenuComponent {

    componentParent: ListAndSearchComponent;
    sectionId: number;

    constructor() {
        super();
    }

    agInit(params: any) {
        this.params = params;
        this.menuActions = params.menuActions;
        this.sectionId = params.data.sectionId;
        this.componentParent = this.params.context.componentParent;
    }
}
