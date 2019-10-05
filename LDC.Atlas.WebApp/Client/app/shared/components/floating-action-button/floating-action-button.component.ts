import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FloatingActionButtonActions } from '../../entities/floating-action-buttons-actions.entity';
import { FABType } from './floating-action-button-type.enum';

@Component({
    selector: 'atlas-floating-action-button',
    templateUrl: './floating-action-button.component.html',
    styleUrls: ['./floating-action-button.component.scss'],
})

export class FloatingActionButtonComponent implements OnInit, OnChanges {

    @Input() fabActions: FloatingActionButtonActions[] = [];
    @Input() fabTitle: string;
    @Input() fabType: FABType;
    @Input() fabActionsDisabled: boolean = false;
    @Input() set isParentLoaded(isParentLoaded: boolean) {
        this.loadFab = isParentLoaded;
    }
    @Output() readonly fabActionClicked: EventEmitter<string> = new EventEmitter<string>();

    FABType = FABType;

    fabBottomMargin: number = 8;
    fabIconHeight: number = 56;
    fabCssHeight: string = 'calc(100vh - 74px)';
    loadFab: boolean;
    isDisplayed: boolean;

    onActionButtonClicked(action: string) {
        this.fabActionClicked.emit(action);
    }

    constructor() { }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (this.loadFab && this.fabActions) {
            this.initFAB(this.fabActions);
        }
    }
    ngOnInit() {
    }

    getFabHeight() {
        const height: number = this.fabActions.length * this.fabIconHeight + this.fabBottomMargin;
        return 'calc(100vh - ' + height.toString() + 'px)';
    }

    initFAB(fabActions: FloatingActionButtonActions[]) {
        this.fabActions.sort((action1, action2) => (action1.index > action2.index) ? -1 : 1);
        if (this.fabType === FABType.MiniFAB) {
            this.fabCssHeight = this.getFabHeight();
        }
        this.isDisplayed = (this.loadFab && fabActions.length > 0);
    }
}
