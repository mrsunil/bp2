import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { SectionTraffic } from '../../../../../shared/entities/section-traffic.entity';
import { ShippingStatus } from '../../../../../shared/entities/shipping-status.entity';
import { Vessel } from '../../../../../shared/entities/vessel.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { TradeDataService } from '../../../../services/trade-data.service';

@Component({
    selector: 'atlas-shipment-info-form-component',
    templateUrl: './shipment-info-form-component.component.html',
    styleUrls: ['./shipment-info-form-component.component.scss'],
})
export class ShipmentInfoFormComponent extends BaseFormComponent implements OnInit {
    vesselCtrl = new AtlasFormControl('Vessel');
    shippingStatusCtrl = new AtlasFormControl('shippingStatus');
    company: string;
    sectionId: number;
    dataVersionId: number;
    filteredVessels: Vessel[];
    shippingStatus: ShippingStatus[];
    isTradeImage = false;
    vesselNamePrivilege: boolean = false;
    @Output() readonly shipmentStatusUpdate = new EventEmitter<any>();

    sectionTrafficModel: SectionTraffic = new SectionTraffic();

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Vessels,
        MasterDataProps.ShippingStatus,
    ];

    vesselErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Vessel not in the list.');

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
        private tradeDataService: TradeDataService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.masterdata = this.route.snapshot.data.masterdata;

        this.formGroup = this.formBuilder.group({
            vesselCtrl: this.vesselCtrl,
            shippingStatusCtrl: this.shippingStatusCtrl,
        });

        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.shippingStatus = this.masterdata.shippingStatus;

            });
        this.shippingStatusCtrl.valueChanges.subscribe((input) => {
            this.shippingStatus = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.shippingStatus,
                ['shippingStatusCode', 'description'],
            );
        });
        this.filteredVessels = this.masterdata.vessels;
        this.vesselCtrl.valueChanges.subscribe((input) => {
            this.filteredVessels = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.vessels,
                ['vesselName'],
            );
        });

        this.setValidators();
        this.bindConfiguration();

        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
        }
        this.checkShipmentFormPrivileges();
    }

    setValidators() {
        this.vesselCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.vessels,
                    nameof<Vessel>('vesselName'),
                ),
                Validators.maxLength(30),
            ]),
        );
    }

    initForm(entity: any, isEdit: boolean): any {

        if (this.sectionId !== 0) {
            this.subscriptions.push(this.tradeDataService.getTrafficDetails()
                .subscribe((data: SectionTraffic) => {
                    if (data) {
                        this.sectionTrafficModel = data;
                        this.populateVesselDetails(this.sectionTrafficModel.vesselCode);
                        this.populateShippingDetails(this.sectionTrafficModel.shippingStatusCode);
                    }
                }));

        }
        if (!isEdit || this.isTradeImage || !this.vesselNamePrivilege) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }

        return entity;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            vesselCtrl: this.vesselCtrl,
            shippingStatusCtrl: this.shippingStatusCtrl,
        });
        return super.getFormGroup();
    }

    populateVesselDetails(vesselCode: string) {
        if (vesselCode) {
            const vessel = this.masterdata.vessels.find(
                (item) => item.vesselName === vesselCode,
            );
            if (vessel) {
                this.vesselCtrl.patchValue(vessel);
            }
        }
    }

    populateShippingDetails(shippingStatusCode: string) {
        if (shippingStatusCode) {
            const shippingStatus = this.masterdata.shippingStatus.find(
                (item) => item.shippingStatusCode === shippingStatusCode,
            );
            if (shippingStatus) {
                this.shippingStatusCtrl.patchValue(shippingStatus.description);
            }
        }
    }

    checkShipmentFormPrivileges() {
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') && this.authorizationService.isPrivilegeAllowed(this.company, 'TrafficTab')) {
                this.vesselNamePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'VesselName');
            }
        });
    }
}
