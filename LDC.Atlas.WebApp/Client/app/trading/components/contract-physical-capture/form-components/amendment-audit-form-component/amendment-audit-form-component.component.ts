import { Component, OnInit } from '@angular/core';
import { PhysicalFixedPricedContract } from '../../../../../../app/trading/entities/physical-fixed-priced-contract.entity';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';

@Component({
    selector: 'atlas-amendment-audit-form-component',
    templateUrl: './amendment-audit-form-component.component.html',
    styleUrls: ['./amendment-audit-form-component.component.scss'],
})
export class AmendmentAuditFormComponentComponent extends BaseFormComponent implements OnInit {

    amendmentDate: Date;
    createdDateFormat: string;
    amendedBy: string;
    amendmentDateFormat: string;
    amendedByUserId: number;
    createdDate: Date;
    createdBy: string;
    createdByUserId: number;
    createdTimeFormat: string;
    amendmentTimeFormat: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService, private formatDate: FormatDatePipe, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }
    initForm(entity: any) {
        const model = entity as PhysicalFixedPricedContract;
        if (model) {
            this.createdDate = model.creationDate;
            this.createdDateFormat = this.formatDate.transform
                (this.createdDate === null ? null : this.createdDate);
            this.createdTimeFormat = this.formatDate.transformTimeWithoutSeconds
                (this.createdDate === null ? null : this.createdDate);
            this.createdBy = model.createdBy;
            this.createdByUserId = model.createdByUserId;
            this.amendmentDate = model.lastModifiedDate;
            this.amendmentDateFormat = this.formatDate.transform
                (this.amendmentDate === null ? null : this.amendmentDate);
            this.amendmentTimeFormat = this.formatDate.transformTimeWithoutSeconds
                (this.amendmentDate === null ? null : this.amendmentDate);
            this.amendedBy = model.lastModifiedBy;
            this.amendedByUserId = model.modifiedByUserId;
        }
    }

}
