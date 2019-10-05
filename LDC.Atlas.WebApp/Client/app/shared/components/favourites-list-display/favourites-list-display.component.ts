import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { AgContextualMenuAction } from '../../entities/ag-contextual-menu-action.entity';
import { Section } from '../../entities/section.entity';
import { FormConfigurationProviderService } from '../../services/form-configuration-provider.service';
import { LockService } from '../../services/http-services/lock.service';
import { TradingService } from '../../services/http-services/trading.service';
import { SecurityService } from '../../services/security.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TradeFavourite } from '../../services/trading/dtos/tradeFavourite';
import { AgContextualMenuComponent } from '../ag-contextual-menu/ag-contextual-menu.component';
import { BaseFormComponent } from '../base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'atlas-favourites-list-display',
    templateUrl: './favourites-list-display.component.html',
    styleUrls: ['./favourites-list-display.component.scss'],
})
export class FavouritesListDisplayComponent extends BaseFormComponent implements OnInit {
    favouriteListOptions: agGrid.GridOptions = {};
    favouriteListGridRows: TradeFavourite[];
    favouriteListGridCols: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    menuActions: { [key: string]: string } = {
        deleteFavorite: 'deleteFavorite',
        createTradeFromFavorite: 'createTradeFromFavorite',
    };
    gridContextualMenuActions: AgContextualMenuAction[];
    favoriteList: TradeFavourite[];
    company: string;
    createFavouriteTradePrivilege: boolean;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private router: Router,
        protected lockService: LockService,
        protected dialog: MatDialog,
        private tradingService: TradingService,
        private authorizationService: AuthorizationService,
        private securityService: SecurityService,
        private snackbarService: SnackbarService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'Physicals')) {
                this.createFavouriteTradePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ImageCreation');
            }
        });
        this.initializeGridColumns();
        this.initFavouriteListGridRows();
        this.initMenuAction();
        this.getFavoriteTradeList();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    initializeGridColumns() {
        this.favouriteListGridCols = [
            {
                headerName: 'Name',
                colId: 'name',
                field: 'name',
            },
            {
                headerName: 'Description',
                colId: 'description',
                field: 'description',
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.gridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
            },
        ];
    }

    initFavouriteListGridRows() {
        this.favouriteListGridRows = [];
    }

    initMenuAction() {
        this.gridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.menuActions.deleteFavorite,
            },
            {
                icon: 'add',
                text: 'Create Trade from Favorite',
                action: this.menuActions.createTradeFromFavorite,
                disabled: !this.createFavouriteTradePrivilege,
            },
        ];
    }

    handleAction(action: string, favorite: TradeFavourite) {
        const favoriteId = favorite.favoriteTradeId;
        switch (action) {
            case this.menuActions.deleteFavorite:
                const favoriteName = favorite.name;

                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Delete ' + favoriteName + ' ?',
                        text: 'Deleting a Favorite is permanent. Do you wish to proceed?',
                        okButton: 'DELETE ANYWAY',
                        cancelButton: 'DISCARD',
                    },
                });
                const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        if (favorite.favoriteTradeId) {
                            const deleteConfirmationSubscription =
                                this.tradingService.deleteFavorite(favorite.favoriteTradeId).subscribe(() => {
                                    this.snackbarService.informationSnackBar('Favorite ' + favorite.name + ' Deleted');
                                    this.getFavoriteTradeList();
                                });
                            this.subscriptions.push(deleteConfirmationSubscription);
                        } else {
                            this.gridApi.updateRowData({ remove: [favorite] });
                        }
                    }
                });
                this.subscriptions.push(confirmationSubscription);
                break;
            case this.menuActions.createTradeFromFavorite:
                this.router.navigate([this.company + '/trades/capture'], {
                    queryParams: { favoriteId },
                    skipLocationChange: true,
                });
                break;
        }
    }

    getFavoriteTradeList() {
        this.tradingService.getFavoritesByUserId()
            .subscribe((data) => {
                this.favouriteListGridRows = data.value;
                this.initializeGridColumns();
            });
    }
}
