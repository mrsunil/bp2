import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { AgContextualMenuAction } from '../../entities/ag-contextual-menu-action.entity';

@Component({
    selector: 'atr-ag-contextual-menu',
    templateUrl: './ag-contextual-menu.component.html',
    styleUrls: ['./ag-contextual-menu.component.scss'],
})
/*{
			headerName: "",
			cellRendererFramework: AgContextualMenuComponent,
			cellRendererParams: {
				context: {
					componentParent: this,
				},
				menuActions: [{
						icon:'',
						text: 'Delete Item',
						action: 'Delete'
				}]
			},
			maxWidth: 80,
}*/

export class AgContextualMenuComponent implements ICellRendererAngularComp {
    params: any;
    menuActions: AgContextualMenuAction[] = [];
    showIcon: boolean = true;
    isDisabled: boolean = false;
    dottedLineSelection: boolean = true;
    constructor() { }

    agInit(params: any) {
        this.params = params;
        if (params.showIcon === false) {
            this.showIcon = params.showContextualSearchIcon;
        }
        if (typeof params.isDisabled === 'boolean') {
            this.isDisabled = params.isDisabled;
        }
        if (typeof params.isDisabled === 'function') {
            this.isDisabled = params.isDisabled(this.params);
        }
        this.menuActions = [];
        if (!params.menuActions) {
            return;
        }
        params.menuActions.forEach((element) => {
            let itemDisabled = false;
            if (typeof element.disabled === 'boolean') {
                itemDisabled = element.disabled;
            }
            if (typeof element.disabled === 'function') {
                itemDisabled = element.disabled(this.params);
            }
            this.menuActions.push(
                {
                    icon: element.icon,
                    text: element.text,
                    action: element.action,
                    disabled: itemDisabled,
                },
            );
        });
    }

    // !!! Parent Component should have a function called handleAction!!
    // @params : string
    // @params : object that is treated by the parent
    onActionButtonClicked(menuAction: AgContextualMenuAction, event: Event) {
        this.params.context.componentParent.handleAction(menuAction.action, this.params.data);
        event.stopPropagation();
    }

    refresh(params: any): boolean {
        return false;
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    }

    onClickEvent(event: any) {
        if (!this.dottedLineSelection)
            event.stopPropagation();
    }
}
