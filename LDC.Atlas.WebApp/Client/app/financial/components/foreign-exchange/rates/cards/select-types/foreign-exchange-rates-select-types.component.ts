import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { ManualImportReport } from '../../../../../../shared/entities/manualImportReport.entity';
import { WarningErrorMsgDialogComponent } from '../../../warning-error-msg-dialog/warning-error-msg-dialog.component';
import { FileUploadDialogBoxComponent } from './../../../../../../shared/components/file-upload-dialog-box/file-upload-dialog-box.component';
import { AtlasFormControl } from './../../../../../../shared/entities/atlas-form-control';
import { ForeignExchangeRateViewMode } from './../../../../../../shared/enums/foreign-exchange-rate-viewmode.enum';
import { PermissionLevels } from './../../../../../../shared/enums/permission-level.enum';
import { ForeignExchangeService } from './../../../../../../shared/services/http-services/foreign-exchange.service';
import { SnackbarService } from './../../../../../../shared/services/snackbar.service';
import { FxRatesSelectedType } from './../../../../../entities/fx-rates-selected-type.entity';
const moment = _moment;

@Component({
    selector: 'atlas-foreign-exchange-rates-select-types',
    templateUrl: './foreign-exchange-rates-select-types.component.html',
    styleUrls: ['./foreign-exchange-rates-select-types.component.scss'],
})
export class ForeignExchangeRatesSelectTypesComponent implements OnInit {
    @ViewChild('fileUploadDialogBoxComponent') fileUploadDialogBoxComponent: FileUploadDialogBoxComponent;
    dateCtrl = new AtlasFormControl('Date', this.companyManager.getCurrentCompanyDate(), Validators.required);
    foreignExchangeTypeCtrl = new AtlasFormControl('ForeignExchangeTypeCtrl');
    inactiveCurrenciesCtrl = new AtlasFormControl('InactiveCurrencies');
    ForeignExchangeRateViewMode = ForeignExchangeRateViewMode;
    company: string;
    formGroup: FormGroup;
    selectedDocType = '.csv';
    selectedFile: File;
    progressbar: boolean;
    objectKeys = Object.keys;
    disableConfirmImport: boolean = false;
    PermissionLevels = PermissionLevels;
    @Input() editMode = false;
    @Output() readonly selectedViewParams = new EventEmitter<FxRatesSelectedType>();

    constructor(
        private router: Router,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected dialog: MatDialog,
        protected companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService,
        private foreignExchangeService: ForeignExchangeService,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.getFormGroup();
    }

    getFormGroup(): FormGroup {
        this.formGroup = this.formBuilder.group({
            dateCtrl: this.dateCtrl,
            foreignExchangeTypeCtrl: this.foreignExchangeTypeCtrl,
            inactiveCurrenciesCtrl: this.inactiveCurrenciesCtrl,
        });

        this.setDefaultValues();

        this.formGroup.valueChanges.subscribe(() => {
            if ((this.foreignExchangeTypeCtrl.value === ForeignExchangeRateViewMode.Daily ||
                this.foreignExchangeTypeCtrl.value === ForeignExchangeRateViewMode.Monthly) &&
                !this.dateCtrl.valid) {
                return;
            }
            this.selectedViewParams.emit(this.getValuesFromForm());
        });

        // we need to emit one during initialization
        this.selectedViewParams.emit(this.getValuesFromForm());

        return this.formGroup;
    }

    setDefaultValues(): void {
        const selectedViewParams: FxRatesSelectedType = new FxRatesSelectedType();

        this.dateCtrl.setValue(selectedViewParams.date);
        this.foreignExchangeTypeCtrl.setValue(selectedViewParams.type);
        this.inactiveCurrenciesCtrl.setValue(selectedViewParams.inactiveCurrencies);
    }

    getValuesFromForm(): FxRatesSelectedType {
        const selectedViewParams: FxRatesSelectedType = new FxRatesSelectedType();

        selectedViewParams.date = moment(this.dateCtrl.value);
        selectedViewParams.type = this.foreignExchangeTypeCtrl.value;
        selectedViewParams.inactiveCurrencies = this.inactiveCurrenciesCtrl.value;

        return selectedViewParams;
    }

    onImportExchangeRatesClicked() {
        this.fileUploadDialogBoxComponent.docType = this.selectedDocType;
    }

    ondocumentSelected(file: File) {
        const fileName = file.name;
        let importId: string;
        const fileType = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
        if (fileType === 'csv') {
            this.foreignExchangeService.fileUpload(file).subscribe((data: ManualImportReport) => {
                this.progressbar = false;
                if (data) {
                    importId = data.importId;
                    const goodDataResult = this.objectKeys(data.goodData.lineNumberWithCurrency);

                    if (data.warningData.length === 0 && goodDataResult.length === 0 && data.blockerData.length > 0) {
                        this.disableConfirmImport = true;
                        data.disableConfirmImport = this.disableConfirmImport;
                    } else {
                        this.disableConfirmImport = false;
                        data.disableConfirmImport = this.disableConfirmImport;
                    }
                    const manualImportReportMsgDialog = this.dialog.open(WarningErrorMsgDialogComponent, {
                        data,
                        width: '80%',
                        height: '80%',
                    });
                    manualImportReportMsgDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            if (answer.toBeImported) {
                                this.foreignExchangeService.confirmImport(importId).subscribe(() => { });
                                const goodDataResult = this.objectKeys(data.goodData.lineNumberWithCurrency);
                                const result = this.objectKeys(data.blockerData.length);

                                if (data.blockerData.length > 0 && (data.warningData.length > 0 || goodDataResult.length > 0)) {
                                    this.snackbarService.informationSnackBar('Import was successful. Please note that some rates could not be imported.');
                                } else if (data.blockerData.length === 0 && (goodDataResult.length > 0 || data.warningData.length > 0)) {
                                    this.snackbarService.informationSnackBar('Import was successful.');
                                }
                            } else {
                                this.foreignExchangeService.cancelImport(importId).subscribe(() => { });
                            }
                            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                                '/financial/fx/rates']);

                            this.progressbar = false;
                        } else {
                            manualImportReportMsgDialog.close();
                        }
                    });
                }
            });
        } else {
            this.snackbarService.informationSnackBar('Only csv files are allowed to be selected');
        }

    }

}
