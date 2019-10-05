import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger, MatStepper } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterpartyDetailComponentComponent } from './detail/counterparty-detail-component.component';
import { CounterpartyListComponentComponent } from './list/counterparty-list-component.component';
import { CounterpartySummaryComponentComponent } from './summary/counterparty-summary-component.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { BulkEditSearchResult } from '../../../shared/dtos/bulkEdit-search-result';
import { Subscription } from 'rxjs';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { BulkCounterparty } from '../../../shared/entities/bulkedit-counterparty.entity';
import { Counterparty } from '../../../shared/entities/counterparty.entity';
import { CounterpartyAddress } from '../../../shared/entities/counterparty-address.entity';
import { CounterpartyCompany } from '../../../shared/entities/counterparty-company.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { Country } from '../../../shared/entities/country.entity';
import { Province } from '../../../shared/entities/province.entity';
import { AddressType } from '../../../shared/entities/address-type.entity';

@Component({
    selector: 'atlas-referential-bulk-amendment-component',
    templateUrl: './referential-bulk-amendment-component.component.html',
    styleUrls: ['./referential-bulk-amendment-component.component.scss'],
})

export class ReferentialBulkAmendmentComponentComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('counterpartyListComponent') counterpartyListComponent: CounterpartyListComponentComponent;
    @ViewChild('counterpartyDetailComponent') counterpartyDetailComponent: CounterpartyDetailComponentComponent;
    @ViewChild('counterpartySummaryComponent') counterpartySummaryComponent: CounterpartySummaryComponentComponent;
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;

    masterdata: MasterData;
    filteredCountry: Country[];
    filteredprovinces: Province[];
    filteredaddressTypes: AddressType[];
    company: string;
    isValid: boolean = false;
    subscriptions: Subscription[] = [];
    bulkCounterparty: BulkCounterparty;
    counterparty: Counterparty;
    gridData: BulkEditSearchResult[];
    requiredString: string = 'Required*';
    isGridValid: boolean = true;

    constructor(protected dialog: MatDialog, private router: Router, private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        protected masterDataService: MasterdataService, ) {
        this.company = this.route.snapshot.paramMap.get("company");
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCountry = this.masterdata.countries;
        this.filteredprovinces = this.masterdata.provinces;
        this.filteredaddressTypes = this.masterdata.addressTypes;
    }

    contractsSelected() {
        const contracts = this.counterpartyListComponent.selectedcontractsCounterpartyToedit as BulkEditSearchResult[];
        if (contracts) {
            this.counterpartyDetailComponent.contractToBeSelected(contracts);
            this.counterpartySummaryComponent.summaryContractToBeSelected(contracts);
        }
    }

    onContractsSelected(contractsSelected: boolean) {
        this.isValid = contractsSelected;
    }

    onCancelWarning() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate([this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
            }
        });
    }

    onChangeStepAction(event: any) {
    }

    onCounterpartiesSelectionDiscardButtonClicked() {
        this.onCancelWarning();
    }

    onCounterpartiesSelectionNextButtonClicked() {
        if (this.isValid) {
            this.contractsSelected();
            this.stepper.next();
        }
        if (!this.isValid) {
            this.snackbarService.throwErrorSnackBar(
                'Please select a contract to proceed.',
            );
        }
    }

    onDetailsPreviousButtonClicked() {
        this.stepper.previous();
    }

    onDetailSaveButtonClicked() {
        this.isGridValid = true;
        const counterpartyLines = this.counterpartyDetailComponent.editCounterpartyDocumentLines;
        this.gridData = counterpartyLines;

        this.validateGridData();

        if (this.isGridValid) {
            const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Save Changes',
                    text: 'Do you want to save all the edited details?',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });

            confirmDiscardDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    const counterpartyLines = this.counterpartyDetailComponent.editCounterpartyDocumentLines;
                    this.bulkCounterparty = <BulkCounterparty>{};
                    this.bulkCounterparty.counterpartyList = [];

                    counterpartyLines.forEach((cp) => {
                        this.counterparty = <Counterparty>{};
                        this.counterparty.counterpartyAddresses = [];
                        this.counterparty.counterpartyCompanies = [];

                        this.counterparty.counterpartyID = cp.counterpartyID;
                        this.counterparty.counterpartyTradeStatusId = cp.tradeStatusId;
                        this.counterparty.counterpartyCode = cp.accountReference;
                        this.counterparty.accountTitle = cp.accountTitle
                        if (cp.headOfFamily) {
                            this.counterparty.headofFamily = this.masterdata.counterparties.find((e) => e.counterpartyCode === cp.headOfFamily).counterpartyID;
                        }
                        this.masterdata.counterparties
                        this.counterparty.isDeactivated = cp.statusId;
                        this.counterparty.mdmId = cp.mdmId;
                        this.counterparty.c2CCode = cp.c2CReference;
                        this.counterparty.createdBy = cp.createdBy;
                        this.counterparty.createdDateTime = cp.createdOn;

                        let counterpartyAddressobj = <CounterpartyAddress>{};
                        counterpartyAddressobj.addressId = cp.addressId;
                        counterpartyAddressobj.address1 = cp.address1;
                        counterpartyAddressobj.address2 = cp.address2;
                        counterpartyAddressobj.city = cp.city;
                        if (cp.country) {
                            counterpartyAddressobj.countryID = this.filteredCountry.find((e) => e.countryCode === cp.country).countryId;
                        }
                        counterpartyAddressobj.zipCode = cp.zipCode;
                        counterpartyAddressobj.ldcRegionId = cp.ldcRegion;
                        if (!this.isEmpty(cp.province)) {
                            counterpartyAddressobj.provinceID = this.filteredprovinces.find((e) => e.description === cp.province).provinceId;
                        }
                        if (!this.isEmpty(cp.addressType)) {
                            counterpartyAddressobj.addressTypeID = this.filteredaddressTypes.find((e) => e.enumEntityValue === cp.addressType).enumEntityId;
                        }

                        this.counterparty.counterpartyAddresses.push(counterpartyAddressobj)

                        let counterpartyCompanyObj = <CounterpartyCompany>{};
                        counterpartyCompanyObj.counterpartyId = cp.counterpartyID;
                        if (cp.companyId) {
                            counterpartyCompanyObj.companyId = this.masterdata.companies.find((e) => e.companyId === cp.companyId).id;
                        }

                        this.counterparty.counterpartyCompanies.push(counterpartyCompanyObj);

                        this.bulkCounterparty.counterpartyList.push(this.counterparty);
                    });
                    this.bulkCounterparty.isBulkUpdate = true;

                    this.subscriptions.push(this.masterDataService
                        .bulkUpdateCounterparty(this.bulkCounterparty)
                        .subscribe((data: any[]) => {
                            if (data) {
                                this.snackbarService.informationSnackBar('Counterparty has been updated successfully.');
                                this.counterpartySummaryComponent.summaryContractToBeSelected(counterpartyLines);
                                this.stepper.next();
                            }
                        },
                            (err) => {
                                console.error(err);
                                this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                            }));
                }
            });
        }
    }

    validateGridData() {
        this.gridData.forEach((data) => {
            if (this.isRequiredString(data.counterpartyID) || this.isRequiredString(data.accountReference) || this.isRequiredString(data.tradeStatusId)
                || data.statusId === false || this.isRequiredString(data.accountTitle) || this.isRequiredString(data.country) || !data.ldcRegion
                || this.isRequiredString(data.addressType)) {

                this.isGridValid = false;
                this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors');
            }
        });
    }

    isRequiredString(value: any) {
        return value === null || value === '' || value === this.requiredString;
    }

    isEmpty(value: any): boolean {
        if (value === '' || value === null) {
            return true;
        }
        return false;
    }

    onSummaryCancelButtonClicked() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate([this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
            }
        });
    }

    onSummaryOkButtonClicked() {
        this.router.navigate([this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
    }
}