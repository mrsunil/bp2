import { Component, OnInit, Inject, EventEmitter, Output, ViewChild } from '@angular/core';
import { AssignedSectionView } from '../../../../../shared/models/assigned-section-display-view';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { Subscription } from 'rxjs';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { Section } from '../../../../../shared/entities/section.entity';
import { SectionTypes } from '../../../../../shared/enums/section-type.enum';
import { SplitCreateAndAllocateService } from '../../../../../shared/services/split-create-and-allocate.service';
import { TotalCardComponent } from '../total-card-component/total-card-component.component';
import { element } from '@angular/core/src/render3/instructions';
import { AssignedContractListFormComponent } from '../assigned-contract-list-form-component/assigned-contract-list-form-component.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'atlas-reassign-section-dialog',
    templateUrl: './reassign-section-dialog.component.html',
    styleUrls: ['./reassign-section-dialog.component.scss']
})

export class ReassignSectionDialogComponent implements OnInit {
    assignedSections: AssignedSectionView[];
    assignedSectionsSplit: AssignedSectionView[] = [];
    assignedSectionsFullQuantity: AssignedSectionView[] = [];
    isTopCardVisible: boolean = false;
    model: Charter;
    isBottomCardVisible: boolean = true;
    reAssignSectionSubscription: Subscription;
    charterId: number;
    charter: Charter;
    newCharterSelected: Charter;
    charterCtrl = new AtlasFormControl('charter');
    sectionModel: any;
    subscriptions: Subscription[] = [];
    assignedContractLabels: string[] = [];
    fullyInvoiceContract: AssignedSectionView[];

    constructor(private snackbarService: SnackbarService,
        private route: ActivatedRoute,
        private router: Router,
        protected dialog: MatDialog,
        private executionService: ExecutionService,
        private createSplitService: SplitCreateAndAllocateService,
        protected tradingService: TradingService,
        public thisDialogRef: MatDialogRef<ReassignSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.assignedSections = data.result;
        this.charter = data.charter;
        this.charterId = data.newCharterSelected.charterId;
        this.newCharterSelected = data.newCharterSelected;
        this.fullyInvoiceContract = data.fullyInvoiceContract;
    }

    ngOnInit() {
        this.fullyInvoiceContract.length > 0 ? this.isTopCardVisible = true : this.isTopCardVisible = false;
        this.assignedSections.length > 0 ? this.isBottomCardVisible = true : this.isBottomCardVisible = false;
        this.assignedSections.forEach((element) => {
            element.removeSectionTrafficInfo = true;
        });
    }

    onDiscardButtonClick() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.thisDialogRef.close(null);
            }
        });
    }

    onSelectedContractClicked(section: AssignedSection) {
        const sectionFiltered: AssignedSection = this.assignedSections.find((sec) =>
            sec.sectionId === section.sectionId);
        if (sectionFiltered) {
            this.assignedSections.find((sec) =>
                sec.sectionId === section.sectionId).removeSectionTrafficInfo = !section.removeSectionTrafficInfo;
        }
    }

    fullyOrPartiallyReassignSections() {
        if (this.assignedSectionsSplit.length > 0) {
            this.createSplitService.createSplitOfAssignedSections(this.assignedSectionsSplit, this.charterId).then((data) => {
                this.snackbarService.informationSnackBar('Splits have been created and reassigned to charter' + ' ' + this.newCharterSelected.charterCode);
                this.thisDialogRef.close(null);
            });
        }
        if (this.assignedSectionsFullQuantity.length > 0) {
            this.fullyReassignSections();
        }
    }

    fullyReassignSections() {
        if (this.assignedSectionsFullQuantity.length > 0) {
            this.charter.assignedSections = this.assignedSectionsFullQuantity;
            this.reAssignSectionSubscription = this.executionService
                .reAssignSectionToCharter(this.charter, this.newCharterSelected)
                .subscribe((data) => {
                    this.getAssignedContractLabels();
                    this.thisDialogRef.close(null);
                });
        }
    }

    onReassignButtonClicked() {
        this.assignedSections[0].isnavopen = true;
        this.assignedSections.forEach((section) => {

            if (section.reassignQuantity && section.reassignQuantity < section.quantity) {
                section.quantity = Number(section.reassignQuantity);
                this.assignedSectionsSplit.push(section);
            }
            else if (!section.reassignQuantity || section.reassignQuantity == null || section.reassignQuantity == section.quantity) {
                this.assignedContractLabels.push(section.contractLabel);
                this.assignedSectionsFullQuantity.push(section);
            }
        });
        this.fullyReassignSections();
    }

    getAssignedContractLabels() {
        let name: string = '';
        this.assignedContractLabels.forEach((element) => {
            name = name + element + ',';
        });
        this.snackbarService.informationSnackBar('Contracts' + ' ' + name + ' ' + 'have been reassigned to charter' + ' ' + this.newCharterSelected.charterCode);
    }
}
