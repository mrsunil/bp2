import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { FavouritesListDisplayComponent } from '../../../shared/components/favourites-list-display/favourites-list-display.component';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { SecurityService } from '../../../shared/services/security.service';
import { TitleService } from '../../../shared/services/title.service';
import { CostmatricesComponent } from '../costmatrices/costmatrices.component';
import { FxDealsComponent } from '../fx-deals/fx-deals.component';
import { TradesComponent } from '../trades/trades.component';
import { TradeActionsService } from './../../services/trade-actions.service';

@Component({
    selector: 'atlas-trades-tab',
    templateUrl: './trades-tab.component.html',
    styleUrls: ['./trades-tab.component.scss'],
})
export class TradesTabComponent implements OnInit {
    @ViewChild('tradesComponent') tradesComponent: TradesComponent;
    @ViewChild('costmatricesComponent') costmatricesComponent: CostmatricesComponent;
    @ViewChild('fxDealsComponent') fxDealsComponent: FxDealsComponent;
    @ViewChild('favouritesListDisplayComponent') favouritesListDisplayComponent: FavouritesListDisplayComponent;

    company: string;
    dataVersionId: number;
    tabIndex: number = 0;
    isTrade: boolean = false;
    isFxDeal: boolean = false;
    isTradeCreationPrivilege = false;
    isCostMatrixCreationPrivilege = false;
    isAmendSnapshotPrivilege = false;
    sideNavOpened: boolean = false;
    PermissionLevels = PermissionLevels;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        protected tradeActionsService: TradeActionsService,
        protected securityService: SecurityService,
        private authorizationService: AuthorizationService,
        private titleService: TitleService) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
        });
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.tabIndex = 0;
        this.route.queryParams.subscribe((params) => {
            this.tabIndex = Number(params['index']);
        });
        this.onSelectedButtonChanged(this.tabIndex);
        this.titleService.setTitle('Trades');
    }

    onTradeOrCostMatrixButtonClicked() {
        if (this.isTrade) {
            if (this.dataVersionId) {
                this.tradeActionsService.newTradeInSnapshotSubject.next(this.dataVersionId);
            } else {
                this.tradeActionsService.newTradeSubject.next();
            }
        } else {
            this.router.navigate([this.company + '/trades/costmatrix/create']);
        }
    }

    onSelectedIndexChanged(value: number) {
        this.tabIndex = value;
        this.onSelectedButtonChanged(this.tabIndex);
    }

    onSelectedButtonChanged(tabIndex: number) {
        tabIndex === 1 ? this.isTrade = false : this.isTrade = true;
        this.isFxDeal = tabIndex === 2 ? true : false;
        if (this.isFxDeal) {
            this.titleService.setTitle('FX Deals');
        } else if (this.isTrade) {
            this.titleService.setTitle('Trades');
        } else {
            this.titleService.setTitle('Cost Matrices');
        }
    }

    onSelectedTabChanged(index: number) {
        if (index === 1) {
            this.costmatricesComponent.onTabSelected();
        }
    }
}
