import { Component, OnInit } from '@angular/core';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, map } from 'rxjs/operators';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UrlManagementService } from '../../../../../shared/services/url-management.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { FunctionalObject } from '../../../../../shared/entities/functional-object.entity';

@Component({
    selector: 'atlas-functional-object-details',
    templateUrl: './functional-object-details.component.html',
    styleUrls: ['./functional-object-details.component.scss']
})
export class FunctionalObjectDetailsComponent implements OnInit {
    destroy$ = new Subject();
    functionalObjectId: number;
    company: string;
    creationDate: string;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    functionalObjects: any;
    functionalObjectName: string;

    constructor(private router: Router,
        protected lockService: LockService,
        private urlManagementService: UrlManagementService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private configurationService: ConfigurationService
    ) { }

    ngOnInit() {
        this.functionalObjectId = this.route.snapshot.params['functionalObjectId'];
        this.company = this.route.snapshot.params['company'];
        this.configurationService.getFunctionalObjectById(this.functionalObjectId).subscribe((data) => {
            this.functionalObjects = data.tables;
            this.createdBy = data.createdBy;
            this.creationDate = data.createdDateTime.toDateString();
            this.modifiedBy = data.modifiedBy;
            this.modifiedDate = data.modifiedDateTime;
            this.functionalObjectName = data.functionalObjectName;
        });
    }

    onNewFunctionalClicked() {
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/admin/global-parameters/functional-object/new']);
    }

    onEditFunctionalClicked() {
        const functionalObjectId = this.functionalObjectId;
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/admin/global-parameters/functional-object/edit', functionalObjectId]);
    }


    onCancelButtonClicked() {
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/admin/global-parameters/functional-object/list']);
    }
}
