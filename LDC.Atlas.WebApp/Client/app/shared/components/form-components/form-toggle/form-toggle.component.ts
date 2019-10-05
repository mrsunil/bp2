import { Component, Input } from '@angular/core';
import { FormComponentBaseComponent } from '../form-component-base/form-component-base.component';

@Component({
  selector: 'atlas-form-toggle',
  templateUrl: './form-toggle.component.html',
  styleUrls: ['./form-toggle.component.scss'],
})

export class FormToggleComponent extends FormComponentBaseComponent {

  @Input() valueLabelMap: Map<any, string>;

  getKeys(map) {
    return Array.from(map.keys());
  }

}
