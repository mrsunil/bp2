import { ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, IterableDiffer, IterableDiffers, Output } from '@angular/core';

@Component({
    selector: 'atlas-params-list',
    templateUrl: './params-list.component.html',
    styleUrls: ['./params-list.component.scss'],
})
export class ParamsListComponent implements DoCheck {
    isPanelExpanded: boolean = false;
    @Input() chipStringList: string[];
    @Input() isCostMatrixDisplay: boolean;
    @Output() readonly iconClicked = new EventEmitter();
    iterableDiffer: IterableDiffer<string> | null;

    constructor(private iterableDiffers: IterableDiffers, private ref: ChangeDetectorRef) {
        this.iterableDiffer = this.iterableDiffers.find([]).create(null);
        if (this.chipStringList) {
            this.isPanelExpanded = this.chipStringList.length > 0;
        }
    }

    ngDoCheck() {
        const changes = this.iterableDiffer.diff(this.chipStringList);
        if (changes) {
            this.ref.markForCheck();
        }
    }

    emmitClick($event: MouseEvent) {
        this.iconClicked.emit($event);
        $event.stopPropagation(); // Preventing event bubbling
    }
}
