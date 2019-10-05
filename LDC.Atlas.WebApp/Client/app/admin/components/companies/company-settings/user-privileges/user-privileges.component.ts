import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Profile } from '../../../../../shared/entities/profile.entity';
import { UserProfileList } from '../../../../../shared/entities/user-profile.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { UserIdentityService } from '../../../../../shared/services/http-services/user-identity.service';

@Component({
    selector: 'atlas-user-privileges',
    templateUrl: './user-privileges.component.html',
    styleUrls: ['./user-privileges.component.scss'],
})
export class UserPrivilegesComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly userPrivilegeEvent = new EventEmitter<boolean>();
    @Output() readonly userPrivilegeRowChangedEvent = new EventEmitter<boolean>();
    UserPrivilegesGridOptions: agGrid.GridOptions = {};
    profilesGridRows: any[];
    userProfiles: UserProfileList[];
    selectedProfileList: UserProfileList[];
    atlasAgGridParam: AtlasAgGridParam;
    columnDefs: agGrid.ColDef[];
    isRowSelected: boolean = false;
    isRowValueChanged: boolean = false;
    gridApi: agGrid.GridApi;
    gridContext = {
        gridEditable: true,
    };
    selectedCompany: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        public gridService: AgGridService,
        private userIdentityService: UserIdentityService,
        private route: ActivatedRoute,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.selectedCompany = (decodeURIComponent(this.route.snapshot.paramMap.get('companyId')));
        this.initCompanyCopyGridUserPrivilegesColumns();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.getUserPrivilegesGridData();
    }

    onGridReady(params) {
        this.gridApi = params.api;
    }

    getUserPrivilegesGridData() {
        this.userIdentityService.getProfileByCompanyId(this.selectedCompany).subscribe((data) => {
            this.userProfiles = data.value;
            this.profilesGridRows = this.userProfiles;
        });
    }

    onUserPrivilegeRowSelected(event) {
        this.isRowValueChanged = true;
        const selectedRows = this.gridApi.getSelectedRows();
        this.isRowSelected = selectedRows.length > 0 ? true : false;
        this.userPrivilegeEvent.emit(this.isRowSelected);
        this.userPrivilegeRowChangedEvent.emit(this.isRowValueChanged);
        this.selectedProfileList = selectedRows;
    }

    initCompanyCopyGridUserPrivilegesColumns() {
        this.UserPrivilegesGridOptions = {
            context: this.gridContext,
        };
        this.columnDefs = [
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
                headerName: 'ProfileId',
                colId: 'profileId',
                field: 'profileId',
                hide: true,
            },

        ];
    }

    onSelectionChanged(event) {
    }

    onColumnVisibilityChanged(col) {
    }

}
