import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { FavouritesListDisplayComponent } from '../../../shared/components/favourites-list-display/favourites-list-display.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchExportAdapter } from '../../../shared/services/list-and-search/export/list-and-search-export-adapter';
import { TradeDataLoader } from '../../../shared/services/list-and-search/trade-data-loader';
import { SecurityService } from '../../../shared/services/security.service';
import { SnapshotSelectionDialogBoxComponent } from '../../dialog-boxes/snapshot-selection/snapshot-selection-dialog-box.component';
import { SectionReference } from '../../entities/section-reference';
import { TradeActionsService } from '../../services/trade-actions.service';
import { ListAndSearchComponent } from './../../../shared/components/list-and-search/list-and-search.component';
import { AgContextualMenuAction } from './../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasFormControl } from './../../../shared/entities/atlas-form-control';
import { Counterparty } from './../../../shared/entities/counterparty.entity';
import { MasterData } from './../../../shared/entities/masterdata.entity';
import { ListAndSearchFilterType } from './../../../shared/enums/list-and-search-filter-type.enum';
import { PermissionLevels } from './../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from './../../../shared/services/authorization/dtos/user-company-privilege';
import { CounterPartyDataLoader } from './../../../shared/services/masterdata/counterparty-data-loader';
import { UtilService } from './../../../shared/services/util.service';

@Component({
    selector: 'atlas-trades',
    templateUrl: './trades.component.html',
    styleUrls: ['./trades.component.css'],
    providers: [
        TradeDataLoader,
        CounterPartyDataLoader,
    ],
})

export class TradesComponent implements OnInit {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    @ViewChild('favouritesListDisplayComponent') favouritesListDisplayComponent: FavouritesListDisplayComponent;
    sideNavOpened: boolean = false;

    company: string;
    dataVersionId: number;
    isLoading: boolean;
    gridCode = 'tradeList';
    loadOnInit = false;
    contractLabelCtrl: FormControl = new FormControl();
    additionalFilters: ListAndSearchFilter[] = [];
    filteredCounterPartyList: Counterparty[];
    counterPartyCtrl = new AtlasFormControl('TradeCounterParty');
    masterdata: MasterData = new MasterData();

    menuActions: { [key: string]: string } = {
        image: 'image',
        saveAsFavourite: 'saveAsFavourite',
    };
    gridContextualMenuActions: AgContextualMenuAction[];

    imagePrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'ImageCreation',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'Physicals',
    };

    hasTradeCreationPrivilege = false;
    createTradeActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'CreateTrade',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'Physicals',
    };

    hasAmendSnapshotPrivilege = false;
    amendSnapshotActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'AmendSnapshot',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'Physicals',
    };

    // FAB
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabType: FABType = FABType.ExtendedMenu;
    fabTitle: string = 'TRADE ACTIONS';
    isLoaded: boolean = false;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        protected tradeActionsService: TradeActionsService,
        public dataLoader: TradeDataLoader,
        private authorizationService: AuthorizationService,
        protected utilService: UtilService,
        public counterpartyDataLoader: CounterPartyDataLoader,
        public exportAdapter: ListAndSearchExportAdapter,
    ) {
        this.isLoading = true;
    }

    ngOnInit() {
        this.securityService.isSecurityReady().subscribe(() => {
            this.init();
        });
    }

    init() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.counterPartyCtrl.valueChanges.subscribe((input) => {
            this.filterCounterParty(input);
        });
        this.checkUserPrivileges();
        if (!this.dataVersionId) {
            this.initMenuAction();

        }
        this.initFABActions();
    }

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onQuickSearchButtonClicked();
        }
    }

    checkUserPrivileges() {
        const createTradePrivilegeLevel = this.authorizationService.getPermissionLevel(
            this.company,
            this.createTradeActionPrivilege.privilegeName,
            this.createTradeActionPrivilege.privilegeParentLevelOne,
            this.createTradeActionPrivilege.privilegeParentLevelTwo);
        this.hasTradeCreationPrivilege = (createTradePrivilegeLevel >= this.createTradeActionPrivilege.permission);

        const amendSnapshotPrivilegeLevel = this.authorizationService.getPermissionLevel(
            this.company,
            this.amendSnapshotActionPrivilege.privilegeName,
            this.amendSnapshotActionPrivilege.privilegeParentLevelOne,
            this.amendSnapshotActionPrivilege.privilegeParentLevelTwo);
        this.hasAmendSnapshotPrivilege = (amendSnapshotPrivilegeLevel >= this.amendSnapshotActionPrivilege.permission);
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.contractLabelCtrl.dirty) {
            $event.returnValue = true;
        }
    }

    initMenuAction() {
        this.gridContextualMenuActions = [
            {
                icon: 'add',
                text: 'Image',
                action: this.menuActions.image,
                disabled: !this.checkIfUserHasRequiredPrivileges(this.imagePrivilege),
            },
            {
                icon: 'favorite_border ',
                text: 'Save As Favourite',
                action: this.menuActions.saveAsFavourite,
                disabled: !this.checkIfUserHasRequiredPrivileges(this.imagePrivilege),
            },
        ];
        if (this.listAndSearchComponent) {
            this.listAndSearchComponent.gridContextualMenuActions = this.gridContextualMenuActions;
            this.listAndSearchComponent.addMenuAction();
        }
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel >= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }

    onQuickSearchButtonClicked() {
        this.additionalFilters = [];
        let searchCounterParty: string;
        if (this.counterPartyCtrl.value) {
            searchCounterParty = (this.counterPartyCtrl.value as Counterparty).counterpartyCode;
            if (!searchCounterParty) {
                searchCounterParty = this.counterPartyCtrl.value;
            }
        }
        const contractLabelField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'ContractLabel');
        const counterpartyCodeField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'Counterparty');
        if (!this.listAndSearchComponent) {
            return;
        } else {
            if (this.contractLabelCtrl.value && contractLabelField) {
                const filter = new ListAndSearchFilter();
                filter.fieldId = contractLabelField.fieldId;
                filter.fieldName = contractLabelField.fieldName;
                filter.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.contractLabelCtrl.value + '%',
                };
                filter.isActive = true;
                this.additionalFilters = [filter];
            }
        }
        if (this.counterPartyCtrl.value && counterpartyCodeField) {
            const filterCounterParty = new ListAndSearchFilter();
            filterCounterParty.fieldId = counterpartyCodeField.fieldId;
            filterCounterParty.fieldName = counterpartyCodeField.fieldName;
            filterCounterParty.predicate = {
                filterType: ListAndSearchFilterType.Text,
                operator: 'eq',
                value1: searchCounterParty + '%',
            };
            filterCounterParty.isActive = true;
            this.additionalFilters.push(filterCounterParty);
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }

    onTradeRowClicked(event) {
        if (this.dataVersionId) {
            this.tradeActionsService.displaySectionInSnapshotSubject
                .next(new SectionReference(event.data.sectionId, this.dataVersionId));
        } else {
            this.tradeActionsService.displaySectionSubject.next(event.data.sectionId);
        }
    }

    onQuickNavigate(event) {
        if (!this.dataVersionId) {
            this.tradeActionsService.displaySectionSubject.next(event.sectionId);
        }
    }

    onTradeCaptureButtonClicked() {
        if (this.dataVersionId) {
            this.router.navigate([this.company + '/trades/snapshot/' + this.dataVersionId + '/capture']);
        } else {
            this.router.navigate([this.company + '/trades/capture']);
        }
    }

    onMenuActionClicked(data) {
        if (!this.dataVersionId) {
            const action = data.action;
            const rowData = data.rowData;
            switch (action) {
                case this.menuActions.image:
                    this.tradeActionsService.tradeEditImageSubject.next(rowData.sectionId);
                    break;
                case this.menuActions.saveAsFavourite:
                    this.tradeActionsService.tradeSaveAsFavouriteEditSubject.next(rowData.sectionId);
                    break;
                default: // throw Action not recognized exception
                    break;
            }
        }
    }

    onDiscardButtonClick() {
        this.sideNavOpened = false;
    }

    onSideNavSaveButtonClick() {
        // yet to implement code;
    }

    initFABActions() {
        this.fabMenuActions = [];

        const actionCreateTrade: FloatingActionButtonActions = {
            icon: 'add',
            text: 'Create Trade',
            action: 'createTrade',
            disabled: false,
            index: 0,
        };
        const actionAmendSnapshot: FloatingActionButtonActions = {
            icon: 'camera_alt',
            text: 'Amend Snapshot',
            action: 'amendSnapshot',
            disabled: false,
            index: 1,
        };
        const actionGroupFunction: FloatingActionButtonActions = {
            icon: 'gamepad',
            text: 'Group Functions',
            action: 'groupFunctions',
            disabled: false,
            index: 2,
        };
        const actionFavoriteTrade: FloatingActionButtonActions = {
            icon: 'star_rate',
            text: 'Favourites Trade',
            action: 'favoriteTrade',
            disabled: false,
            index: 3,
        };

        if (!this.dataVersionId && this.hasAmendSnapshotPrivilege) {
            this.fabMenuActions.push(actionAmendSnapshot);
        }

        if (this.hasTradeCreationPrivilege) {
            this.fabMenuActions.push(actionCreateTrade);
            this.fabMenuActions.push(actionGroupFunction);
        }

        this.fabMenuActions.push(actionFavoriteTrade);

        this.isLoaded = true;
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'createTrade': {
                this.onNewTradeMatrixButtonClicked();
                break;
            }
            case 'amendSnapshot': {
                this.onAmendSnapshotButtonClicked();
                break;
            }
            case 'groupFunctions': {
                this.onGroupFunctionsButtonClicked();
                break;
            }
            case 'favoriteTrade': {
                this.onFavouritesListButtonClicked();
                break;
            }
        }
    }

    onNewTradeMatrixButtonClicked() {
        if (this.dataVersionId) {
            this.tradeActionsService.newTradeInSnapshotSubject.next(this.dataVersionId);
        } else {
            this.tradeActionsService.newTradeSubject.next();
        }

    }

    onAmendSnapshotButtonClicked() {
        const snapshotSelectionDialog = this.dialog.open(SnapshotSelectionDialogBoxComponent, {
            width: '40%',
        });
        snapshotSelectionDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate([this.company + '/trades/snapshot/' + answer]);
            }
        });
    }

    onGroupFunctionsButtonClicked() {
        this.tradeActionsService.tradeGroupFunctionsSubject.next();
    }

    onFavouritesListButtonClicked() {
        this.sideNavOpened = true;
    }
}
