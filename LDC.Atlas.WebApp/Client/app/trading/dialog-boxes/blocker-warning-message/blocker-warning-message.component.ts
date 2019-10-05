import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-blocker-warning-message',
    templateUrl: './blocker-warning-message.component.html',
    styleUrls: ['./blocker-warning-message.component.scss'],
})
export class BlockerWarningMessageComponent implements OnInit {
    dialogData: {
        messageBlocker: string,
        messageWarning: string,
        dyanamicMessageWarning: string,
    };
    isWarningDisplayed = false;
    isBlockerDisplayed = false;
    userClickedOnYes = false;
    userClickedOnNo = false;
    selectedAction: string;
    warningMessagedDisplayed: string;

    actions = {
        ok: 'ok',
        yes: 'yes',
        no: 'no',
        discard: 'discard',
    };

    constructor(public thisDialogRef: MatDialogRef<BlockerWarningMessageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            messageBlocker: string,
            messageWarning: string,
            dyanamicMessageWarning: string,
        },
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
        if (this.dialogData.messageBlocker) {
            this.isBlockerDisplayed = true;
        } else {
            this.isWarningDisplayed = true;
            this.warningMessagedDisplayed = this.dialogData.messageWarning;
        }
    }

    onBlockerButtonClicked(yesClicked: boolean) {
        this.userClickedOnYes = yesClicked;
        if (this.dialogData.messageWarning) {
            this.isWarningDisplayed = true;
            this.warningMessagedDisplayed = this.userClickedOnYes ? this.dialogData.messageWarning : this.dialogData.dyanamicMessageWarning;
        } else {
            if (this.userClickedOnYes) {
                this.thisDialogRef.close(
                    { blockerMessageAnswer: 'yes', warningMessageAnswer: null });
            } else {
                this.thisDialogRef.close(
                    { blockerMessageAnswer: 'no', warningMessageAnswer: null });
            }
        }
    }

    onWarningButtonClicked(action: string) {
        this.selectedAction = action;
        if (!this.isBlockerDisplayed) {
            this.thisDialogRef.close({ blockerMessageAnswer: null, warningMessageAnswer: action });
        } else {
            this.thisDialogRef.close({
                blockerMessageAnswer: this.userClickedOnYes ? this.actions.yes : this.actions.no,
                warningMessageAnswer: action,
            });
        }
    }

}
