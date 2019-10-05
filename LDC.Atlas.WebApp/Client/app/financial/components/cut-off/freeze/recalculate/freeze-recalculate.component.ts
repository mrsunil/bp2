import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { ConfirmationDialogComponent } from './../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AccountingSetup } from './../../../../../shared/entities/accounting-setup.entity';
import { AgContextualMenuAction } from './../../../../../shared/entities/ag-contextual-menu-action.entity';
import { Freeze } from './../../../../../shared/entities/freeze.entity';
import { FreezeType } from './../../../../../shared/enums/freeze-type.enum';
import { ApiPaginatedCollection } from './../../../../../shared/services/common/models';
import { FreezeService } from './../../../../../shared/services/http-services/freeze.service';
import { PreaccountingService } from './../../../../../shared/services/http-services/preaccounting.service';
import { SecurityService } from './../../../../../shared/services/security.service';
import { SnackbarService } from './../../../../../shared/services/snackbar.service';
import { TitleService } from './../../../../../shared/services/title.service';
import { UiService } from './../../../../../shared/services/ui.service';
import { FreezeGridComponent } from './../cards/grid/freeze-grid.component';
import { FreezeHeaderFilterComponent } from './../cards/header-filter/freeze-header-filter.component';

@Component({
    selector: 'atlas-freeze-recalculate',
    templateUrl: './freeze-recalculate.component.html',
    styleUrls: ['./freeze-recalculate.component.scss'],
})
export class FreezeRecalculateComponent implements OnInit {
    @ViewChild('grid') freezeGridComponent: FreezeGridComponent;
    @ViewChild('freezeHeaderFilterComponent') freezeHeaderFilterComponent: FreezeHeaderFilterComponent;

    company: string;
    isNew: boolean;
    closedMonthDate: Date;
    isLoading = true;

    freezeMenuActions: { [key: string]: string } = {
        recalculate: 'recalculate',
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
        protected securityService: SecurityService,
        private titleService: TitleService,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.securityService.isSecurityReady().subscribe(() => {
            this.getClosedMonth();
        });
    }

    initMenuAction() {
        if (this.authorizationService.isPrivilegeAllowed(
            this.company,
            'RecalculateFrozenDatabase')) {
            this.freezeGridContextualMenuActions.push({
                icon: 'settings_backup_restore',
                text: 'Recalculate',
                action: this.freezeMenuActions.recalculate,
                disabled: this.isRecalculateDisabled.bind(this),
            });
            this.titleService.setTitle('Recalculate Frozen Database');
            this.freezeGridComponent.freezeGridContextualMenuActions = this.freezeGridContextualMenuActions;
            this.freezeGridComponent.initMenuAction();
        }
    }

    isRecalculateDisabled(params: ICellRendererParams): boolean {
        const freeze: Freeze = params.data;
        return this.isMonthClosed(freeze, this.closedMonthDate ? moment(this.closedMonthDate) : null);
    }

    isMonthClosed(freeze: Freeze, closedMonthDate: Moment): boolean {
        if (!this.closedMonthDate) {
            return true;
        }
        if (closedMonthDate.year() < moment(freeze.freezeDate).year()) {
            return false;
        } else if (closedMonthDate.month() < moment(freeze.freezeDate).month()
            && closedMonthDate.year() === moment(freeze.freezeDate).year()) {
            return false;
        }
        return true;
    }

    getClosedMonth() {
        this.preAccountingService.getAccountingSetupDetails().pipe(
            takeUntil(this.destroy$),
        ).subscribe((detail: AccountingSetup) => {
            this.closedMonthDate = detail.lastMonthClosed;
            this.initMenuAction();
        });
    }

    getData() {
        this.isLoading = true;
        let dateFrom = null;
        let dateTo = null;
        let freezeType = null;
        if (this.freezeHeaderFilterComponent) {
            dateFrom = this.freezeHeaderFilterComponent.getDateFrom();
            dateTo = this.freezeHeaderFilterComponent.getDateTo();
            freezeType = this.freezeHeaderFilterComponent.freezeTypeCtrl.value;
        }
        this.freezeService.getFreezeList(dateFrom, dateTo, freezeType).pipe(
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

    onDisplayButtonClicked() {
        this.getData();
    }

    onMenuActionClicked(events: any[]) {
        if (events) {
            events.forEach((event) => {
                const action = event.action;
                const freeze: Freeze = event.freeze;
                const freezeDate = freeze.dataVersionTypeId === FreezeType.Monthly ?
                    this.uiService.monthFormatter({ value: freeze.freezeDate }) :
                    this.uiService.dateFormatter({ value: freeze.freezeDate });
                switch (action) {
                    case this.freezeMenuActions.recalculate:
                        if (this.isMonthClosed(freeze, this.closedMonthDate ? moment(this.closedMonthDate) : null)) {
                            this.snackbarService.throwErrorSnackBar('You cannot recalculate the freeze for the date '
                                + freezeDate + ' because the month is closed');
                        } else {
                            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Recalculate Frozen Database',
                                    text: 'Are you sure you want to recalculate the frozen database for the date ' + freezeDate + ' ?',
                                    okButton: 'Recalculate',
                                    cancelButton: 'Cancel',
                                },
                            });
                            confirmDialog.afterClosed().subscribe((answer) => {
                                if (answer) {
                                    let recalculateAccEntries = true;
                                    if (this.freezeHeaderFilterComponent) {
                                        recalculateAccEntries = this.freezeHeaderFilterComponent.toggleFormControl.value;
                                    }
                                    this.freezeService.recalculateFreeze(freeze.dataVersionId, recalculateAccEntries).subscribe(() => {
                                        this.snackbarService.informationSnackBar('The freeze for the date ' + freezeDate
                                            + ' has been recalculated');
                                        this.getData();
                                    });
                                }
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    }
}
