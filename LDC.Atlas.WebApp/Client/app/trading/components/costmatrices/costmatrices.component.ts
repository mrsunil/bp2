import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../../shared/services/authorization/dtos/user-company-privilege';
import { CostmatrixListComponent } from './components/costmatrix-list/costmatrix-list.component';

@Component({
    selector: 'atlas-costmatrices',
    templateUrl: './costmatrices.component.html',
    styleUrls: ['./costmatrices.component.scss'],
})
export class CostmatricesComponent implements OnInit, AfterViewInit {
    @ViewChild('costmatrixListComponent') costmatrixListComponent: CostmatrixListComponent;
    company: string;

    // FAB
    createCostMatrixActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'CostMatrices',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: null,
    };

    fabMenuActions: FloatingActionButtonActions[] = [];
    fabType: FABType = FABType.ExtendedSingleButton;
    fabTitle: string = 'COST MATRICES ACTIONS';
    isLoaded: boolean = false;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private authorizationService: AuthorizationService) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngAfterViewInit(): void {
        this.initFABActions();
    }

    onCreateCostMatrixButtonClicked() {
        this.router.navigate([this.company + '/trades/costmatrix/create']);
    }
    onTabSelected() {
        this.costmatrixListComponent.setColumnsToFitGrid();
    }

    // For FAB
    initFABActions() {
        const actionCreateCostMatrix: FloatingActionButtonActions = {
            icon: 'add',
            text: 'Create Cost Matrix',
            action: 'createCostMatrix',
            disabled: false,
            index: 0,
        };

        this.fabMenuActions = [];

        const createCostMatrixPrivilegeLevel = this.authorizationService.getPermissionLevel(
            this.company,
            this.createCostMatrixActionPrivilege.privilegeName,
            this.createCostMatrixActionPrivilege.privilegeParentLevelOne,
            this.createCostMatrixActionPrivilege.privilegeParentLevelTwo);
        const hasCreateTradePrivilege = (createCostMatrixPrivilegeLevel >= this.createCostMatrixActionPrivilege.permission);
        if (hasCreateTradePrivilege) {
            this.fabMenuActions.push(actionCreateCostMatrix);
        }

        this.isLoaded = true;
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'createCostMatrix': {
                this.onCreateCostMatrixButtonClicked();
                break;
            }
        }
    }
}
