import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'atlas-pop-up-dialog-component',
    templateUrl: './pop-up-dialog-component.component.html',
    styleUrls: ['./pop-up-dialog-component.component.scss']
})

export class PopUpDialogComponentComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }
}
