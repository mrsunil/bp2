import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'atr-row-selection-button',
  templateUrl: './row-selection-button.component.html',
  styleUrls: ['./row-selection-button.component.scss']
})
export class RowSelectionButton implements ICellRendererAngularComp  {
public params: any;

  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  public invokeParentMethod() {
    this.params.context.componentParent.rowSelectionButtonClicked(this.params.data);
}

refresh(): boolean {
  return false;
}

}
