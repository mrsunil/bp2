import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {

    constructor(
        private snackBar: MatSnackBar,
        private router: Router,
    ) { }
    snackBarDurationInSeconds = 10;
    informationSnackBarDurationInSeconds = 4;
    errorSnackBarDurationInSeconds = 4;
    public throwErrorSnackBar(text: string, persist = false) {
        const snackBarRef = this.snackBar.open(text, 'X', {
            duration: persist ? null : this.errorSnackBarDurationInSeconds * 1000,
            verticalPosition: 'top',
        });
        snackBarRef.onAction().subscribe(() => {
            snackBarRef.dismiss();
        });
    }

    public informationSnackBar(text: string, persist: boolean = false) {
        const snackBarRef = this.snackBar.open(text, 'X', {
            duration: persist ? null : this.informationSnackBarDurationInSeconds * 1000,
            verticalPosition: 'top',
        });
        snackBarRef.onAction().subscribe(() => {
            snackBarRef.dismiss();
        });
    }

    public informationAndCopySnackBar(text: string, copyText: string) {
        const snackBarRef = this.snackBar.open(text, 'COPY', {
            duration: this.snackBarDurationInSeconds * 1000,
            verticalPosition: 'top',
        });
        snackBarRef.onAction().subscribe(() => {
            this.copyText(copyText);
            snackBarRef.dismiss();
        });
    }

    copyText(val: string) {
        const selBox = document.createElement('textarea');
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

}
