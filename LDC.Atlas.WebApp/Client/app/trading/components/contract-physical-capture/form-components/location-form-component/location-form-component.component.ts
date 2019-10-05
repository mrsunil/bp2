import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '../../../../../../../node_modules/@angular/forms';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { BusinessSector } from '../../../../../shared/entities/business-sector-entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Port } from '../../../../../shared/entities/port.entity';
import { TradeConfiguration } from '../../../../../shared/entities/trade-configuration-entity';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { PortsDataLoader } from '../../../../../shared/services/masterdata/ports-data-loader';
import { SecurityService } from '../../../../../shared/services/security.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { TradingService } from './../../../../../shared/services/http-services/trading.service';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';

@Component({
    selector: 'atlas-location-form-component',
    templateUrl: './location-form-component.component.html',
    styleUrls: ['./location-form-component.component.scss'],
    providers: [PortsDataLoader],
})
export class LocationFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly portsWarningMessage = new EventEmitter<any>();
    isInputField = false;
    isChangedPortOfOrigin = false;
    isChangedPortOfDestination = false;
    company: string;
    businessSectorforTradingOperation: boolean = false;
    businessSectorNominalForTradingOperation: boolean = false;
    businessSectorFieldShow: boolean = false;
    portOfOriginPrivilege: boolean = false;
    portOfDestinationPrivilege: boolean = false;
    businessSectorPrivilege: boolean = false;
    isChangedPortOfOriginColumn;
    isChangedPortOfDestinationColumn;
    private tradeConfigurationSubscription: Subscription;
    isEdit: boolean = true;

    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    tradeConfiguration: TradeConfiguration = new TradeConfiguration();

    portOfOriginCtrl = new AtlasFormControl('PortOriginId');
    portOfOriginDescriptionCtrl = new AtlasFormControl(
        'PortOfOriginDescription',
    );
    portOfDestinationCtrl = new AtlasFormControl('PortDestinationId');
    portOfDestinationDescCtrl = new AtlasFormControl(
        'PortOfDestinationDescription',
    );
    businessSectorCtrl = new AtlasFormControl('MarketSectorId');
    businessSectorDescriptionCtrl = new AtlasFormControl(
        'BusinessSectorDescripton',
    );

    filteredOriginPorts: Port[];
    filteredDestinationPorts: Port[];
    filteredBusinessSector: BusinessSector[];
    tradeImageDetails: TradeImageField[] = [];

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Ports,
        MasterDataProps.BusinessSectors,
    ];
    originportErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');

    destinationportErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');
    businessSectorMandatory: boolean = false;

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        public portDataLoader: PortsDataLoader,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
        protected tradingService: TradingService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredOriginPorts = this.masterdata.ports;
        this.portOfOriginCtrl.valueChanges.subscribe((input) => {
            this.filteredOriginPorts = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.ports,
                ['portCode', 'portDescription'],
            );
            if (this.portOfOriginCtrl.valid) {
                this.portofOriginSelected(this.portOfOriginCtrl.value);
            }
        });

        this.filteredDestinationPorts = this.masterdata.ports;
        this.portOfDestinationCtrl.valueChanges.subscribe((input) => {
            this.filteredDestinationPorts = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.ports,
                ['portCode', 'portDescription'],
            );
            if (this.portOfDestinationCtrl.valid) {
                this.portofDestinationselected(this.portOfDestinationCtrl.value);
            }
        });
        this.filteredBusinessSector = this.masterdata.businessSectors;
        this.businessSectorCtrl.valueChanges.subscribe((input) => {
            this.filteredBusinessSector = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.businessSectors,
                ['sectorCode', 'description'],
            );
        });
        this.getBusinessSectorConfiguration();
        this.setValidators();
        this.bindConfiguration();
        this.checkLocationFormPrivileges();
        this.businessSectorDescriptionCtrl.disable();
    }

    getBusinessSectorConfiguration() {
        this.tradeConfigurationSubscription = this.tradingService.getTradeConfigurationDetails()
            .subscribe((data: TradeConfiguration) => {
                if (data) {
                    this.tradeConfiguration = data;
                    this.businessSectorFieldShow = (data.businessSectorNominalTradingOperation) ? true : false;
                }
            });
    }

    ngOnDestroy(): void {
        if (this.tradeConfigurationSubscription) {
            this.tradeConfigurationSubscription.unsubscribe();
        }
    }

    setValidators() {
        this.portOfOriginCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.ports,
                nameof<Port>('portCode'),
            ),
        );

        this.portOfDestinationCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.ports,
                nameof<Port>('portCode'),
            ),
        );
        this.businessSectorCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.businessSectors,
                ),
            ]),
        );
        if (this.businessSectorMandatory) {
            this.businessSectorCtrl.setValidators(Validators.required);
        }
    }

    portofOriginSelected(portCode: Port) {
        if (!this.masterdata || !portCode) {
            if (this.portOfOriginDescriptionCtrl.value) {
                this.portOfOriginDescriptionCtrl.patchValue('');
            }
            return;
        }
        const selectedPort = this.masterdata.ports.find(
            (port) => port.portCode === portCode.portCode,
        );
        if (selectedPort) {
            this.portOfOriginDescriptionCtrl.patchValue(
                selectedPort.description,
            );
        }
    }

    portofDestinationselected(portCode: Port) {
        if (!this.masterdata || !portCode) {
            if (this.portOfDestinationDescCtrl.value) {
                this.portOfDestinationDescCtrl.patchValue('');
            }
            return;
        }
        const selectedPort = this.masterdata.ports.find(
            (port) => port.portCode === portCode.portCode,
        );
        if (selectedPort) {
            this.portOfDestinationDescCtrl.patchValue(selectedPort.description);
        }
    }

    businessSectorSelected(businessSector: BusinessSector) {
        this.businessSectorDescriptionCtrl.patchValue(
            businessSector ? businessSector.description : '',
        );
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            portofOriginCtrl: this.portOfOriginCtrl,
            portofOriginDescriptionCtrl: this.portOfOriginDescriptionCtrl,
            portofDestinationCtrl: this.portOfDestinationCtrl,
            portofDestinationDescCtrl: this.portOfDestinationDescCtrl,
            businessSectorCtrl: this.businessSectorCtrl,
            businessSectorDescriptionCtrl: this.businessSectorDescriptionCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;
        section.portOfOrigin = (this.portOfOriginCtrl.value as Port) ? (this.portOfOriginCtrl.value as Port).portCode : null;
        section.portOfDestination = (this.portOfDestinationCtrl.value as Port) ? (this.portOfDestinationCtrl.value as Port).portCode : null;
        section.marketSectorId = (!this.businessSectorCtrl.value || this.businessSectorCtrl.value === '') ?
            null : this.businessSectorCtrl.value.sectorId;
        let shouldEmit = false;
        if (this.model.portOfOrigin !== section.portOfOrigin) {
            this.isChangedPortOfOrigin = true;
            this.isChangedPortOfOriginColumn = '[PortOfOrigin]';
            shouldEmit = true;
        }
        if (this.model.portOfDestination !== section.portOfDestination) {
            this.isChangedPortOfDestination = true;
            this.isChangedPortOfDestinationColumn = '[PortOfDestination]';
            shouldEmit = true;
        }
        if (shouldEmit) {
            this.WarningEmitter();
        }
        return section;
    }
    WarningEmitter() {
        this.portsWarningMessage.emit({
            portOfOriginChanged: this.isChangedPortOfOrigin,
            portOfDestinationChanged: this.isChangedPortOfDestination,
            portOfOriginColumn: this.isChangedPortOfOriginColumn,
            portOfDestinationColumn: this.isChangedPortOfDestinationColumn,
        });
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        this.isEdit = isEdit;
        if (this.model.portOfOrigin != null) {
            const selectedPort = this.masterdata.ports.filter(
                (port) => port.portCode === this.model.portOfOrigin,
            );
            if (selectedPort.length > 0) {
                this.filteredOriginPorts = selectedPort;
                this.portOfOriginCtrl.patchValue(selectedPort[0]);
                this.portofOriginSelected(selectedPort[0]);
            }
        }
        if (this.model.portOfDestination != null) {
            const selectedPort = this.masterdata.ports.find(
                (port) => port.portCode === this.model.portOfDestination,
            );
            if (selectedPort) {
                this.filteredDestinationPorts = [selectedPort];
                this.portOfDestinationCtrl.patchValue(selectedPort);
                this.portofDestinationselected(selectedPort);
            }
        }
        if (this.model.marketSectorId != null) {
            const selectedBusinessSector = this.masterdata.businessSectors.find(
                (businessSector) => businessSector.sectorId === this.model.marketSectorId,
            );
            if (selectedBusinessSector) {
                this.businessSectorCtrl.patchValue(selectedBusinessSector);
                this.businessSectorSelected(selectedBusinessSector);
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.portOfDestinationDescCtrl.disable();
            this.businessSectorDescriptionCtrl.disable();
            this.portOfOriginDescriptionCtrl.disable();
        }
        if (this.route.snapshot.data['isImage'] === true) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {
                this.handleFieldEditionForImage('PortOriginId', [this.portOfOriginCtrl]);
                this.handleFieldEditionForImage('PortDestinationId', [this.portOfDestinationCtrl]);
                this.handleFieldEditionForImage('MarketSectorId', [this.businessSectorCtrl]);

                this.handleCopyForImage('PortOriginId', [this.portOfOriginCtrl, this.portOfOriginDescriptionCtrl]);
                this.handleCopyForImage('PortDestinationId', [this.portOfDestinationCtrl, this.portOfDestinationDescCtrl]);
                this.handleCopyForImage('MarketSectorId', [this.businessSectorCtrl, this.businessSectorDescriptionCtrl]);
            }
        }
        if (isEdit) {
            if (tradeRecord.invoicingStatusId !== InvoicingStatus.Uninvoiced) {
                this.businessSectorCtrl.disable();
                this.businessSectorDescriptionCtrl.disable();
            } else {
                this.businessSectorCtrl.enable();
                this.businessSectorDescriptionCtrl.enable();
            }
        }
        return entity;
    }
    
    handleCopyForImage(fieldName: string, fields: AtlasFormControl[]) {
        const fieldConfig = this.tradeImageDetails.find((e) => e.tradeFieldName === fieldName);
        if (fieldConfig && !fieldConfig.isCopy) {
            fields.forEach((field) => {
                field.patchValue(null);
            });
        }
    }

    handleFieldEditionForImage(fieldName: string, fields: AtlasFormControl[]) {
        const fieldConfig = this.tradeImageDetails.find((e) => e.tradeFieldName === fieldName);
        if (fieldConfig && !fieldConfig.isEdit) {
            fields.forEach((field) => {
                field.disable();
            });
        }
    }

    displayBusinessSector(businessSector: BusinessSector): string {
        return businessSector ? businessSector.sectorCode : '';
    }
    checkLocationFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.portOfOriginPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PortOfOrigin');
                this.portOfDestinationPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PortOfDestination');
                this.businessSectorPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'MarketSector');
            }
        });
        if (!this.portOfOriginPrivilege) {
            this.portOfOriginCtrl.disable();
            this.portOfOriginDescriptionCtrl.disable();
        }
        if (!this.portOfDestinationPrivilege) {
            this.portOfDestinationCtrl.disable();
            this.portOfDestinationDescCtrl.disable();
        }
        if (!this.businessSectorPrivilege) {
            this.businessSectorCtrl.disable();
            this.businessSectorDescriptionCtrl.disable();
        }
    }

    clearDescription() {
        if (!this.businessSectorCtrl.value) {
            this.businessSectorDescriptionCtrl.patchValue('');
        }
    }
}
