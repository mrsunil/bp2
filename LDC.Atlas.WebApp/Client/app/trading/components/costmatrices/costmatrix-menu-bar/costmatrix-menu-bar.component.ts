import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'atlas-costmatrix-menu-bar',
    templateUrl: './costmatrix-menu-bar.component.html',
    styleUrls: ['./costmatrix-menu-bar.component.scss'],
})
export class CostmatrixMenuBarComponent implements OnInit {
    @Input() hideAndShowMenuBarButtons: boolean = undefined;
    @Output() readonly costmatrixSaveAction = new EventEmitter<void>();
    @Output() readonly costmatrixBackAction = new EventEmitter<void>();
    costmatrixId: number;
    company: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.costmatrixId = this.route.snapshot.params['costmatrixId'];
        this.company = this.route.snapshot.params['company'];
    }

    onSaveButtonClicked() {
        this.costmatrixSaveAction.emit();
    }

    onPrevPageNavigation() {
        this.costmatrixBackAction.emit();
    }

    onCreateButtonClicked() {
        this.router.navigate(['/' + this.company + '/trades/costmatrix/edit/', this.costmatrixId]);
    }

    onNewCostmatrixButtonClicked() {
        this.router.navigate(['/' + this.company + '/trades/costmatrix/create/']);
    }
}
