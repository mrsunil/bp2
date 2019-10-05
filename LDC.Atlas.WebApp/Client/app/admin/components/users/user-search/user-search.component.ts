import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { DirectoryUser } from '../../../../shared/entities/directory-user.entity';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { TitleService } from '../../../../shared/services/title.service';

@Component({
    selector: 'atlas-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.css'],
})
export class UserSearchComponent implements OnInit {
    directoryUsers: DirectoryUser[];
    isSearchInProgress: boolean;
    isSave: boolean = false;
    searchTerm: string;

    userGridOptions: agGrid.GridOptions = {} as agGrid.GridOptions;
    userGridColumns: agGrid.ColDef[];
    userGridRows: DirectoryUser[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;

    userForm: FormGroup;
    userIdCtrl: FormControl;

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private userIdentityService: UserIdentityService,
        private companyManager: CompanyManagerService,
        public gridService: AgGridService,
        private titleService: TitleService) {
        this.initializeFormControls();
    }

    ngOnInit() {
        this.securityService.isSecurityReady().subscribe(() => {
            this.init();
            this.titleService.setTitle(this.route.snapshot.data.title);
            this.initializeGridColumns();
            this.atlasAgGridParam = this.gridService.getAgGridParam();
        });
    }

    initializeFormControls() {
        this.userIdCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.userForm = this.fb.group({
            userIdCtrl: this.userIdCtrl,
        });
    }

    init() {
        this.userGridOptions.getRowHeight = (params) => {
            return 30;
        };
    }

    initializeGridColumns() {
        this.userGridColumns = [
            {
                headerName: 'SAM Account Name',
                field: 'samAccountName',
            },
            {
                headerName: 'User Principal Name',
                field: 'userPrincipalName',
            },
            {
                headerName: 'First Name',
                field: 'firstName',
            },
            {
                headerName: 'Last Name',
                field: 'lastName',
            },
            {
                headerName: 'Email address',
                field: 'emailAddress',
            },
            {
                headerName: 'Phone n°',
                field: 'phoneNumber',
            },
            {
                headerName: 'Location',
                field: 'location',
            },
        ];
    }

    canDeactivate() {
        if (this.userForm.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    getDirectoryUsers() {
        this.isSave = true;
        this.searchTerm = this.userIdCtrl.value;
        if (!this.searchTerm || this.searchTerm.length < 3) {
            return;
        }

        this.isSearchInProgress = true;
        this.userIdentityService.getDirectoryUsers(this.searchTerm)
            .subscribe((data) => {
                this.directoryUsers = data.value;
                this.userGridRows = this.directoryUsers;
                this.isSearchInProgress = false;
            });
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    public onUserRowClicked(event) {
        const data: DirectoryUser = event.data;
        this.userIdentityService.getUserByUpn(data.userPrincipalName)
            .subscribe((user) => {
                if (user) {
                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                        + '/admin/users/edit/', encodeURIComponent(data.userPrincipalName)]);
                } else {
                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                        + '/admin/users/new/', encodeURIComponent(data.userPrincipalName)]);
                }
            });
    }
}
