import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'atlas-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent implements OnInit {

    @Input() title: string;
    @Input() message: string;
    @Input() hasButton: boolean = false;
    @Input() buttonText: string;
    @Output() readonly buttonClicked = new EventEmitter<void>();

    constructor() { }

    ngOnInit() {
    }

    onButtonClicked(): void {
        this.buttonClicked.emit();
    }
}
