import { Component, OnInit, ViewChild } from '@angular/core';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ActivatedRoute } from '@angular/router';
import { CharterGroupFunctionTypes } from '../../../shared/enums/charter-group-function-type';
import { ExecutionCharterBulkClosureFunctionComponent } from './bulk-closure-function/execution-charter-bulk-closure-function.component';

@Component({
    selector: 'atlas-execution-charter-group-function',
    templateUrl: './execution-charter-group-function.component.html',
    styleUrls: ['./execution-charter-group-function.component.scss']
})
export class ExecutionCharterGroupFunctionComponent implements OnInit {

    charterBulkActionTypeId: number;
    charterGroupFunction = CharterGroupFunctionTypes;
    @ViewChild('charterBulkClosureFunction') charterBulkClosureFunction: ExecutionCharterBulkClosureFunctionComponent;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute, ) {
        this.charterBulkActionTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('bulkActionTypeId')));
    }

    ngOnInit() {
    }

}
