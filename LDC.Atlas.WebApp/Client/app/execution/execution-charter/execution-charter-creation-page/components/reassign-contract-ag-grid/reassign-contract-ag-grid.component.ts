import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { UtilService, nameof } from '../../../../../shared/services/util.service';
import { AssignedSectionView } from '../../../../../shared/models/assigned-section-display-view';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { CharterDisplayView } from '../../../../../shared/models/charter-display-view';
import { CharterDataLoader } from '../../../../../shared/services/execution/charter-data-loader';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ReassignSectionDialogComponent } from '../reassign-section-dialog/reassign-section-dialog.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { takeUntil } from 'rxjs/operators';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';

@Component({
    selector: 'atlas-reassign-contract-ag-grid',
    templateUrl: './reassign-contract-ag-grid.component.html',
    styleUrls: ['./reassign-contract-ag-grid.component.scss'],
    providers: [CharterDataLoader],
})

export class ReassignContractAgGridComponent extends BaseFormComponent implements OnInit {
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    reassignOptions: agGrid.GridOptions;
    reassignGridCols: agGrid.ColDef[];
    assignedContractGridColumns: agGrid.ColDef[];
    reassignContractGridRows: any;
    tooltipMessageOnQuantity: string;
    charterCtrl = new AtlasFormControl('charter');
    newCharterSelected: Charter;
    masterdata: any;
    charterId: number;
    charter: Charter;
    @Output() sideReassignValueNavOpened = new EventEmitter();
    updatedata: AssignedSectionView[];
    charters: Charter[];
    filteredCharters: Charter[];
    allCharters: Charter[];
    tooltipRequiredMessage: string = 'The field should not be empty';
    fullyInvoiceContract: AssignedSectionView[];
    reAssignSectionSubscription: Subscription;
    model: Charter;
    sectionsAssigned: AssignedSectionView[];
    destroy$ = new Subject();

    charterErrorMap: Map<string, string> = new Map()
        .set('required', 'Required*')
        .set('maxlength', 'More than 15 char(s) not allowed.')
        .set('inDropdownList', 'Invalid entry. Charter not in the list.');

    constructor(protected utilService: UtilService,
        private snackbarService: SnackbarService,
        private executionService: ExecutionService,
        protected lockService: LockService,
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public charterDataLoader: CharterDataLoader,

    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.initReassignCharterGridCols();
        this.populateCharterList(this.charterId);
    }

    onGridReady(params) {
        this.reassignOptions = params;
        this.reassignOptions.columnDefs = this.reassignGridCols;
        this.reassignOptions.columnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.reassignOptions.columnApi.autoSizeAllColumns();
        };
    }

    initReassignCharterGridCols() {
        this.reassignGridCols = [
            {
                headerName: 'Contract Ref',
                field: 'contractLabel',
                colId: 'contractLabel',
                minWidth: 200,
                maxWidth: 180,
            },
            {
                headerName: 'Intial Quantity',
                field: 'originalQuantity',
                colId: 'originalQuantity',
                suppressToolPanel: false,
                type: 'numericColumn',
            },
            {
                headerName: 'Quantity to reassign',
                field: 'reassignQuantity',
                colId: 'reassignQuantity',
                suppressToolPanel: true,
                type: 'numericColumn',
                editable: true,
                hide: true,
            },
        ];
    }

    onCellValueChanged(params) {
        if (params.value > params.data.quantity) {
            this.snackbarService.throwErrorSnackBar('Reassign Quantity cannot be more than Initial Quantity.');
        }
    }

    reassignCharterGridRows(charter: Charter) {
       let lockStatus=false;
        if (charter.assignedSections) {
            charter.assignedSections.forEach((assignedSection)=>{
            this.lockService.isLockedContract(assignedSection.sectionId).pipe(
                takeUntil(this.destroy$),
            ).subscribe((lock: IsLocked) => {
                if (lock.isLocked) {
                    lockStatus = true; 
                    const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: lock.message,
                            okButton: 'Got it',
                        },
                    });
                    confirmDiscardDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            this.charterCtrl.patchValue('');
                            this.sideReassignValueNavOpened.emit(false);
                        }
                    });
                }
                else {
                    this.subscriptions.push(this.lockService.lockContract(assignedSection.sectionId, LockFunctionalContext.TradeEdit).pipe(
                        takeUntil(this.destroy$),
                    ).subscribe(
                        (data) => {
                           
      }))}});
    });
    if(!lockStatus){
        this.reassignContractGridRows = charter.assignedSections;
        this.charter = charter;
        this.reassignOptions.api.setRowData(this.reassignContractGridRows);
    }
        }
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
                this.charterCtrl.patchValue('');
                this.sideReassignValueNavOpened.emit(false);
            }
        });

    }

    onCharterSelected(charter: Charter) {

        this.charterCtrl.patchValue(charter);
        this.newCharterSelected = charter;
    }

    populateCharterList(charterId) {

        this.charterDataLoader.getData().subscribe((charters) => {
            this.filteredCharters = charters.filter((charter) => charter.charterId !== Number(charterId));
            this.allCharters = this.filteredCharters;
            this.setValidators();
        });
        this.charterCtrl.valueChanges.subscribe((input) => {
            this.filteredCharters = this.utilService.filterListforAutocomplete(
                input,
                this.allCharters,
                ['charterCode'],
            );
        });
    }

    setValidators() {
        this.charterCtrl.setValidators(Validators.compose([Validators.required, Validators.maxLength(15),
        inDropdownListValidator(this.filteredCharters, nameof<Charter>('charterCode'))
        ]));
    }

    getSelectedInvoicedRow() {
        let assignedSections: AssignedSectionView[];
        let allocatedSection: AssignedSectionView;
        assignedSections = this.reassignContractGridRows;

        assignedSections.forEach((element: AssignedSectionView) => {
            if (element.contractType === ContractTypes.Sale && element.invoicingStatus === InvoicingStatus.Finalized) {
                element.reasonForReassignment = 'Sales contract is 100% invoiced and cannot be reassigned';
                element.isSaleFullyInvoiced = true;

            }
            else if (element.contractType === ContractTypes.Purchase && element.allocatedTo) {
                allocatedSection = this.reassignContractGridRows.find((item: AssignedSectionView) => item.contractLabel === element.allocatedTo);
                if (allocatedSection.invoicingStatus === InvoicingStatus.Finalized) {
                    element.reasonForReassignment =
                        'Purchase contract allocated to a Sales Contract which is 100% invoiced and cannot be reassigned';
                    element.isSaleFullyInvoiced = true;

                }
            }
        });

        this.sectionsAssigned = assignedSections.filter((section: AssignedSectionView) =>
            section.isSaleFullyInvoiced === false);
        this.fullyInvoiceContract = assignedSections.filter((section: AssignedSectionView) =>
            section.isSaleFullyInvoiced === true);
    }

    onSideNavSaveButtonClick() {
        if (this.charterCtrl.valid) {
            this.getSelectedInvoicedRow();
            const result = this.sectionsAssigned;
            const reAssignSectionDialog = this.dialog.open(ReassignSectionDialogComponent, {
                data: { result, masterdata: this.masterdata, charter: this.charter, newCharterSelected: this.newCharterSelected, fullyInvoiceContract: this.fullyInvoiceContract },

            });
            reAssignSectionDialog.afterClosed().subscribe((charters: Charter) => {
                if (ReassignSectionDialogComponent && result[0].isnavopen) {
                    this.sideReassignValueNavOpened.emit(true);
                }
            });

        }
        else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
        }
    }
}
