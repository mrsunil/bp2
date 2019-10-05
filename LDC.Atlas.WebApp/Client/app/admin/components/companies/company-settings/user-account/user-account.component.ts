import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyUserProfile } from '../../../../../shared/entities/company-user-profile.entity';
import { CreateCompany } from '../../../../../shared/entities/create-company.entity';
import { UserAccountList } from '../../../../../shared/entities/user-account.entity';
import { UserListItemViewModel } from '../../../../../shared/models/user-list-item-view-model';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent extends BaseFormComponent implements OnInit {

    @Output() readonly userAccountEvent = new EventEmitter<boolean>();
    users: UserListItemViewModel[];
    userGridRows: UserAccountList[];
    userGridOptions: agGrid.GridOptions = {};
    userGridCols: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    isRowSelected: boolean = false;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    userAccounts: UserAccountList[];
    selectedCompany: string;
    selectedProfileIds: number[] = [];
    selectedAccount: UserAccountList[];
    companyUserProfile: CompanyUserProfile[];

    gridContext = {
        gridEditable: true,
    };
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        public gridService: AgGridService,
        public route: ActivatedRoute,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.selectedCompany = (decodeURIComponent(this.route.snapshot.paramMap.get('companyId')));
    }
    onGridReady(params) {
        this.userGridOptions = params;
        this.userGridOptions.columnDefs = this.userGridCols;
        this.gridApi = this.userGridOptions.api;
        this.gridColumnApi = this.userGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }
    onUserAccountRowSelected(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.isRowSelected = selectedRows.length > 0 ? true : false;
        this.userAccountEvent.emit(this.isRowSelected);
        this.selectedAccount = selectedRows;
        this.companyUserProfile = this.selectedAccount;
    }

    getUserAccounts(account: UserAccountList[]) {
        this.userGridRows = account;
        this.initUserGridColumns();
    }

    populateEntity(entity: CreateCompany): CreateCompany {
        const companyCreation = entity;
        if (this.companyUserProfile.length > 0) {
            companyCreation.companyUserProfile = this.companyUserProfile;
        }
        return companyCreation;
    }

    initUserGridColumns() {
        this.userGridOptions = {
            context: this.gridContext,
        };
        this.userGridCols = [
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'left',
            },
            {
                headerName: 'User Name',
                colId: 'userName',
                field: 'userName',
            },
            {
                headerName: 'First Name',
                colId: 'firstName',
                field: 'firstName',
            },
            {
                headerName: 'Last Name',
                colId: 'lastName',
                field: 'lastName',
            },
            {
                headerName: 'Privileges',
                colId: 'profileName',
                field: 'profileName',
            },
            {
                headerName: 'Email address',
                colId: 'email',
                field: 'email',
            },
            {
                headerName: 'Phone no',
                colId: 'phoneNumber',
                field: 'phoneNumber',
            },
            {
                headerName: 'Company',
                colId: 'company',
                field: 'company',
            },
            {
                headerName: 'Location',
                colId: 'location',
                field: 'location',
            },
            {
                headerName: 'Status',
                colId: 'status',
                field: 'status',
            },
            {
                headerName: 'Manager',
                colId: 'manager',
                field: 'manager',
            },
            {
                headerName: 'User Id',
                colId: 'userId',
                field: 'userId',
                hide: true,
            },
            {
                headerName: 'ProfileId',
                colId: 'profileId',
                field: 'profileId',
                hide: true,
            },

        ];
    }
}
