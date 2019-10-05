import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSlideToggleChange, MAT_DIALOG_DATA } from '@angular/material';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Section } from '../../../../shared/entities/section.entity';
import { ContractStatus } from '../../../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../../../shared/enums/contract-type.enum';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Costmatrix } from '../../../../shared/services/trading/dtos/costmatrix';
import { UtilService } from '../../../../shared/services/util.service';
import { TradeImage } from '../../../entities/trade-image.entity';

@Component({
    selector: 'atlas-trade-image-dialog',
    templateUrl: './trade-image-dialog.component.html',
    styleUrls: ['./trade-image-dialog.component.scss'],
})
export class TradeImageDialogComponent implements OnInit {

    ContractType = ContractTypes;
    contractNumberCtrl = new AtlasFormControl('Number');
    contractTypeCtrl = new AtlasFormControl('ContractType');
    costMatrixCtrl = new AtlasFormControl('costMatrixCtrl');
    imageEstimatesCtrl = new AtlasFormControl('ImageEstimates');
    imageEstimates = false;
    imageTranche = false;
    allocateContract = false;
    tradeImage = new TradeImage();
    showError = false;
    showTrancheError = false;
    setToggle = false;
    company: string;
    filteredCostMatrixList: Costmatrix[];
    costmatrix: Costmatrix[];
    isSplit: boolean = true;
    isAllocateContractDisabled: boolean = true;
    childSections: Section[] = [];

    costmatrixErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Costmatrix not in the list.');

    dialogData: {
        title: string,
        type: string,
        companyId: string,
        childContracts: number,
        parentTrade: boolean,
        isAllocateContractDisabled: boolean,
        childContractDetails: Section[],
        isCancelledTrade: boolean,
    };

    constructor(public thisDialogRef: MatDialogRef<TradeImageDialogComponent>,
        protected utilService: UtilService,
        private tradingService: TradingService,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string, type: string, companyId: string, childContracts: number,
            parentTrade: boolean, isAllocateContractDisabled: boolean, childContractDetails: Section[], isCancelledTrade: boolean;
        },
        public snackbarService: SnackbarService,
    ) {
        this.dialogData = data;
        this.company = this.dialogData.companyId;
        thisDialogRef.disableClose = true;
    }

    ngOnInit() {
        this.setSplitTrancheToggle();
        if (this.dialogData.type != null) {
            this.contractTypeCtrl.setValue(ContractTypes[this.dialogData.type]);
        }
        this.isAllocateContractDisabled = this.dialogData.isAllocateContractDisabled;
        // default for number of contract
        this.contractNumberCtrl.patchValue('1');
        this.getCostMatrixList();
        this.getTradeImageFieldsCompany();

    }
    setSplitTrancheToggle() {
        if (this.dialogData.childContracts > 0 && this.dialogData.parentTrade) {
            this.isSplit = false;
        }
    }
    getCostMatrixList() {
        this.tradingService.getCostmatricesByCompanyId(this.company)
            .subscribe((data) => {
                this.costmatrix = data.value;
                this.filteredCostMatrixList = this.costmatrix;
                this.costMatrixCtrl.valueChanges.subscribe((input) => {
                    this.filteredCostMatrixList = this.utilService.filterListforAutocomplete(
                        input,
                        this.costmatrix,
                        ['name', 'description'],
                    );
                });
            });
    }
    getTradeImageFieldsCompany() {
        //this.tradingService.getTradeImageFieldsByCompany()
        //    .subscribe((data) => {
        //        this.tradeImageDetails = data.value;
        //    });
    }

    setControls() {
        if (this.imageEstimates) {
            this.costMatrixCtrl.disable();
        } else {
            this.costMatrixCtrl.enable();
        }
        if (this.costMatrixCtrl.value) {
            this.setToggle = this.setToggle ? false : true;
        }

    }

    onCostMatrixChange(value: any) {
        this.setControls();
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close();
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close();
    }

    contractTypeChanged() {
        const res = this.contractTypeCtrl.value as ContractTypes;
    }

    onImageButtonClicked() {
        if (Number(this.contractNumberCtrl.value) > 1 && this.imageTranche) {
            this.showError = false;
            this.showTrancheError = true;
        } else {
            if (this.contractNumberCtrl.value && this.contractNumberCtrl.value.length > 0 && this.contractNumberCtrl.value > 0) {
                this.tradeImage = this.getData();
                this.thisDialogRef.close(this.tradeImage);
            } else {
                this.showTrancheError = false;
                this.showError = true;
            }
        }
    }

    onImageEstimatesChange(value: MatSlideToggleChange) {
        this.imageEstimates = value.checked;
        if (this.imageEstimates) {
            this.checkForWarningMessage();
        }
        this.setControls();

    }
    onImageTranchesChange(value: MatSlideToggleChange) {
        this.imageTranche = value.checked;
        if (this.imageTranche) {
            this.checkForWarningMessage();
        }
        this.checkForChildSectionAllocation();
    }
    checkForChildSectionAllocation() {
        if (this.imageTranche) {
            this.childSections = this.dialogData.childContractDetails;
            for (const node of this.childSections) {
                this.isAllocateContractDisabled = (node.allocationDate === null && !this.isAllocateContractDisabled &&
                    node.quantity !== 0 && node.status !== ContractStatus.Unapproved) ? false : true;
            }
        } else {
            this.isAllocateContractDisabled = this.dialogData.isAllocateContractDisabled;
        }

    }

    checkForWarningMessage() {
        if (this.imageEstimates && this.imageTranche) {
            this.snackbarService.informationSnackBar('Please check your costs on the splits/tranches. They do not copy from the parent');
        }
    }

    onAllocateContractsChange(value: MatSlideToggleChange) {
        this.allocateContract = value.checked;
        const selectedContractType = (ContractTypes[this.dialogData.type]) === ContractTypes.Purchase ?
            ContractTypes.Sale : ContractTypes.Purchase;
        if (this.allocateContract) {
            this.contractNumberCtrl.patchValue('1');
            this.contractNumberCtrl.disable();
            this.contractTypeCtrl.setValue(selectedContractType);
            this.contractTypeCtrl.disable();
        } else {
            this.contractNumberCtrl.enable();
            this.contractTypeCtrl.enable();
        }
    }

    getData(): TradeImage {
        const tradeImage = new TradeImage();
        tradeImage.numberOfContracts = this.contractNumberCtrl.value;
        tradeImage.costMatrixId = this.costMatrixCtrl.value.costMatrixId;
        tradeImage.imageEstimates = this.imageEstimates;
        tradeImage.type = this.contractTypeCtrl.value;
        tradeImage.trancheAndSplit = this.imageTranche;
        tradeImage.allocateContract = this.allocateContract;
        //tradeImage.tradeImageField = this.tradeImageDetails;
        return tradeImage;
    }

}
