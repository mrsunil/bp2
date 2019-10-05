import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { ConfirmationDialogComponent } from './../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AccountingSetup } from './../../../../shared/entities/accounting-setup.entity';
import { AgContextualMenuAction } from './../../../../shared/entities/ag-contextual-menu-action.entity';
import { Freeze } from './../../../../shared/entities/freeze.entity';
import { FreezeType } from './../../../../shared/enums/freeze-type.enum';
import { ApiPaginatedCollection } from './../../../../shared/services/common/models';
import { FreezeService } from './../../../../shared/services/http-services/freeze.service';
import { PreaccountingService } from './../../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from './../../../../shared/services/snackbar.service';
import { TitleService } from './../../../../shared/services/title.service';
import { UiService } from './../../../../shared/services/ui.service';
import { FreezeGridComponent } from './cards/grid/freeze-grid.component';

@Component({
    selector: 'atlas-freeze',
    templateUrl: './freeze.component.html',
    styleUrls: ['./freeze.component.scss'],
})
export class FreezeComponent implements OnInit {
    @ViewChild('grid') freezeGridComponent: FreezeGridComponent;

    company: string;
    isNew: boolean;
    closedMonthDate: Date;
    isLoading = true;

    freezeMenuActions: { [key: string]: string } = {
        deleteFreeze: 'delete',
    };
    freezeGridContextualMenuActions: AgContextualMenuAction[] = [];
    rowData: Freeze[] = [];
    destroy$ = new Subject();

    constructor(
        protected route: ActivatedRoute,
        protected authorizationService: AuthorizationService,
        protected preAccountingService: PreaccountingService,
        protected freezeService: FreezeService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        protected uiService: UiService,
        private titleService: TitleService,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
        this.isNew = this.route.snapshot.data.isNew;
    }

    ngOnInit() {
        this.getClosedMonth();
        this.titleService.setTitle(this.route.snapshot.data.title);
    }

    initMenuAction() {
        if (this.authorizationService.isPrivilegeAllowed(
            this.company,
            'CreateFreeze')) {
            this.freezeGridContextualMenuActions.push({
                icon: 'delete',
                text: 'Delete',
                action: this.freezeMenuActions.deleteFreeze,
                disabled: this.isDeleteDisabled.bind(this),
            });
            this.freezeGridComponent.freezeGridContextualMenuActions = this.freezeGridContextualMenuActions;
            this.freezeGridComponent.initMenuAction();
        }
    }

    isDeleteDisabled(params: ICellRendererParams): boolean {
        const freeze: Freeze = params.data;
        if (!this.closedMonthDate) {
            return true;
        }
        if (moment(this.closedMonthDate).year() < moment(freeze.freezeDate).year()) {
            return false;
        } else if (moment(this.closedMonthDate).month() < moment(freeze.freezeDate).month()
            && moment(this.closedMonthDate).year() === moment(freeze.freezeDate).year()) {
            return false;
        }
        return true;
    }

    getClosedMonth() {
        this.preAccountingService.getAccountingSetupDetails().pipe(
            takeUntil(this.destroy$),
        ).subscribe((detail: AccountingSetup) => {
            this.closedMonthDate = detail.lastMonthClosed;
            if (!this.isNew) {
                this.initMenuAction();
            }
            this.getData();
        });
    }

    getData() {
        this.isLoading = true;
        this.freezeService.getFreezeList().pipe(
            map((data: ApiPaginatedCollection<Freeze>) => data.value),
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntil(this.destroy$),
        ).subscribe((freezeList: Freeze[]) => {
            this.rowData = freezeList;
            this.freezeGridComponent.populateGrid(freezeList);
        });
    }

    onCreated() {
        this.getData();
    }

    onMenuActionClicked(events: any[]) {
        if (events) {
            events.forEach((event) => {
                const action = event.action;
                const freeze = event.freeze;
                switch (action) {
                    case this.freezeMenuActions.deleteFreeze:
                        const freezeDate = freeze.dataVersionTypeId === FreezeType.Monthly ?
                            this.uiService.monthFormatter({ value: freeze.freezeDate }) :
                            this.uiService.dateFormatter({ value: freeze.freezeDate });
                        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Freeze Deletion',
                                text: 'Do you wish to delete the freeze for the date ' + freezeDate,
                                okButton: 'Yes',
                                cancelButton: 'No',
                            },
                        });
                        confirmDialog.afterClosed().subscribe((answer) => {
                            if (answer) {
                                this.freezeService.deleteFreeze(freeze.dataVersionId).pipe(
                                    takeUntil(this.destroy$),
                                ).subscribe(() => {
                                    this.snackbarService.informationSnackBar('The freeze for the period '
                                        + freezeDate + ' has been deleted.');
                                    this.getData();
                                });
                            }
                        });
                        break;
                    default:
                        break;
                }
            });
        }

    }

}
