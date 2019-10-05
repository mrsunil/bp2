import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'atlas-chip-list',
    templateUrl: './chip-list.component.html',
    styleUrls: ['./chip-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipListComponent {
    @Input() textList: string[];
    @Input() removable: boolean = false;
    @Input() disabled: boolean = false;
    @Output() readonly removedElement = new EventEmitter<any>();

    onRemoveClick(event) {
        this.removedElement.emit(
            event.chip.value
                .trim()
                .split(' ')[0]
                .trim(),
        );
    }
}
