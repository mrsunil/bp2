import { Component, OnInit } from '@angular/core';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';
import { FormConfigurationProviderService } from './../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from './../../../../../shared/components/base-form-component/base-form-component.component';

@Component({
    selector: 'atlas-settlement-documents',
    templateUrl: './settlement-documents.component.html',
    styleUrls: ['./settlement-documents.component.scss']
})
export class SettlementDocumentsComponent extends BaseFormComponent implements OnInit {

    company: string;
    isShow: boolean = false;
    fjDealDocumentReferenceCtrl = new AtlasFormControl('fjDealDocumentReferenceCtrl');
    fjSettlementDocumentReferenceCtrl = new AtlasFormControl('fjSettlementDocumentReferenceCtrl');
    fjDealReverseDocumentReferenceCtrl = new AtlasFormControl('fjDealReverseDocumentReferenceCtrl');
    fjSettlementReverseDocumentReferenceCtrl = new AtlasFormControl('fjSettlementReverseDocumentReferenceCtrl');
    fxDealDetail: FxDealDetail;
    dealDocument: string;
    settlementDocument: string;
    reverseDealDocument: string;
    reverseSettlementDocument: string;
    isfxDealSettled: boolean = false;
    isReversedFJ: boolean = false;

    constructor
        (protected router: Router,
            protected companyManager: CompanyManagerService,
            private route: ActivatedRoute,
            protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        if (this.route.snapshot.data.isView || this.route.snapshot.data.isEdit) {
            this.isShow = true;
        }
    }
    onFJDocumentReferenceCtrlClicked() {
        const dealDocument = this.dealDocument;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries/' + dealDocument]);


    }
    onFJSettlementDocumentReferenceCtrlClicked() {
        const settlementDocument = this.settlementDocument;
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries/' + settlementDocument]);

    }

    onFJDealDocumentReverseReferenceCtrlClicked() {
        const reverseDealDocument = this.reverseDealDocument;
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries/' + reverseDealDocument]);
    }

    onfJSettlementReverseDocumentReferenceCtrlClicked() {
        const reverseSettlementDocument = this.reverseSettlementDocument;
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries/' + reverseSettlementDocument]);
    }

    initForm(fxDealDetail: FxDealDetail, isShow: boolean) {
        this.fjDealDocumentReferenceCtrl.patchValue(fxDealDetail.fxDealDocument);
        this.dealDocument = fxDealDetail.fxDealDocument;
        this.fjSettlementDocumentReferenceCtrl.patchValue(fxDealDetail.fxSettlementDocument);
        this.settlementDocument = fxDealDetail.fxSettlementDocument;
        this.fjDealReverseDocumentReferenceCtrl.patchValue(fxDealDetail.fxDealReverseDocument);
        this.reverseDealDocument = fxDealDetail.fxDealReverseDocument;
        this.fjSettlementReverseDocumentReferenceCtrl.patchValue(fxDealDetail.fxSettlementReverseDocument);
        this.reverseSettlementDocument = fxDealDetail.fxSettlementReverseDocument;
        if (fxDealDetail.fxSettlementDocumentId && fxDealDetail.fxDealDocumentId) {
            this.isfxDealSettled = true;
        }
        if (fxDealDetail.fxSettlementReverseDocumentId && fxDealDetail.fxDealReverseDocumentId) {
            this.isReversedFJ = true;
        }
    }

}
