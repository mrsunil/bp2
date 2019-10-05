import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Trader } from '../../../../../shared/entities/trader.entity';
import { ContractStatus } from '../../../../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { TradeImageField } from '../../../../../shared/services/trading/dtos/tradeImageField';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { isBeforeDate } from '../../../../../shared/validators/date-validators.validator';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { ContractReferenceAsyncValidator } from '../../../../validators/contract-reference-async-validator.validator';
import { AuthorizationService } from './../../../../../core/services/authorization.service';
import { Section } from './../../../../../shared/entities/section.entity';
import { User } from './../../../../../shared/entities/user.entity';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
import { UserIdentityService } from './../../../../../shared/services/http-services/user-identity.service';
import { DepartmentDataLoader } from './../../../../../shared/services/masterdata/department-data-loader';
import { SnackbarService } from './../../../../../shared/services/snackbar.service';
const moment = _moment;

@Component({
    selector: 'atlas-header-form-component',
    templateUrl: './header-form-component.component.html',
    styleUrls: ['./header-form-component.component.scss'],
    providers: [DepartmentDataLoader],
})
export class HeaderFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly contractTypeSelected = new EventEmitter<ContractTypes>();
    @Output() readonly contractDateSelected = new EventEmitter<Date>();

    isInputField = false;
    ContractType = ContractTypes;
    isShow = false;
    isEditable: boolean = false;
    contractType: string;
    private readonly contractReferencePattern: string = '^[a-zA-Z0-9]*$';
    contractTypeCtrl = new AtlasFormControl('ContractType');
    contractReferenceCtrl = new AtlasFormControl('PhysicalContractCode');
    contractDateCtrl = new AtlasFormControl('ContractDate');
    traderCtrl = new AtlasFormControl('TraderId');
    departmentCodeCtrl = new AtlasFormControl('DepartmentId');
    departmentDescriptionCtrl = new AtlasFormControl('DepartmentDescription');
    creatorCtrl = new AtlasFormControl('Creator');
    createdOnCtrl = new AtlasFormControl('CreatedOn');

    filteredTradeOwners: Trader[];
    filteredDepartments: Department[];
    tradeImageDetails: TradeImageField[] = [];

    traders: Trader[] = [];
    masterdata: MasterData;
    masterdataList: string[] = [MasterDataProps.Departments];
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    contractStatus: string = null;
    traderName: string;
    contractReference: string;
    createdBy: string;
    deprecatedTrader: User;
    date = false;
    status: string;
    dataVersionId?: number;
    company: string;
    isEditContract = false;
    isImage = false;
    openCloseStatus: string = '';
    isCancelled: boolean;
    tradeCancelledStatus: string = '';
    isImageAllocate: boolean = false;

    departmentErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected tradingService: TradingService,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        protected userIdentityService: UserIdentityService,
        public departmentDataLoader: DepartmentDataLoader,
        private authorizationService: AuthorizationService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        if (this.route.snapshot.data['isImage'] === true) {
            this.isImageAllocate = JSON.parse(
                this.route.snapshot.queryParams.allocateContract,
            );
            this.isImage = true;
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredDepartments = this.masterdata.departments;
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;

        if (this.filteredDepartments && this.filteredDepartments.length === 1) {
            this.departmentCodeCtrl.setValue(this.filteredDepartments[0]);
        }

        this.departmentCodeCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartments = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.departments,
                ['departmentCode', 'description'],
            );

            if (this.departmentCodeCtrl.valid) {
                this.departmentCodeSelected(
                    this.departmentCodeCtrl.value,
                );
            }
        });

        this.contractDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.contractDateSelected.emit(this.contractDateCtrl.value);

        this.tradingService.getAllTraders()
            .subscribe((traders) => {
                this.traders = this.filteredTradeOwners = traders.value;
                this.traderCtrl.valueChanges.subscribe((input) => {
                    this.filteredTradeOwners = this.utilService.filterListforAutocomplete(
                        input,
                        this.traders,
                        ['samAccountName', 'firstName', 'lastName'],
                    );
                });
                if (this.model) {
                    this.displayTraderNameInViewForDisabledTraders();
                }
                this.setValidators();
                this.bindConfiguration();
            });
    }

    displayTraderNameInViewForDisabledTraders() {
        if (this.model && this.model.traderId && this.filteredTradeOwners) {
            const filteredTrader = this.filteredTradeOwners.find(
                (trader) => trader.userId === this.model.traderId,
            );
            if (filteredTrader) {
                this.subscriptions.push(this.userIdentityService.getUserById(this.model.traderId, true).subscribe((user: User) => {
                    this.deprecatedTrader = user;
                    this.traderCtrl.setValue(this.model.traderId);
                }));
            }
        }
    }

    setContractReferenceValidators() {
        const contractRefValidators = [Validators.maxLength(7), Validators.pattern(this.contractReferencePattern)];
        if (this.dataVersionId) {
            contractRefValidators.push(Validators.required);
        }
        this.contractReferenceCtrl.setValidators(contractRefValidators);

        this.contractReferenceCtrl.setAsyncValidators(
            ContractReferenceAsyncValidator.createValidator(this.tradingService, this.dataVersionId),
        );
    }

    setValidators() {
        this.contractDateCtrl.setValidators(isBeforeDate(this.companyManager.getCurrentCompanyDate()));

        if (!this.isShow) {
            const contractRefValidators = [Validators.maxLength(7), Validators.pattern(this.contractReferencePattern)];
            if (this.dataVersionId) {
                contractRefValidators.push(Validators.required);
            }
            this.contractReferenceCtrl.setValidators(contractRefValidators);

            this.contractReferenceCtrl.setAsyncValidators(
                ContractReferenceAsyncValidator.createValidator(this.tradingService, this.dataVersionId),
            );
        }

        this.departmentCodeCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.departments,
                nameof<Department>('departmentCode'),
            ),
        );

        this.traderCtrl.setValidators(
            inDropdownListValidator(
                this.traders,
                nameof<Trader>('userId'),
            ),
        );
    }

    private findDepartmentByCode(departmentCode: Department): Department {
        if (!departmentCode) {
            return;
        }

        const filteredDepartment = this.masterdata.departments.filter(
            (dept) => dept.departmentCode === departmentCode.departmentCode,
        );

        if (filteredDepartment.length > 0) {
            return filteredDepartment[0];
        }
    }

    departmentCodeSelected(departments: Department) {
        if (!departments) {
            return;
        }
        const selectedDepartment = this.masterdata.departments.filter(
            (department) => department.departmentCode === departments.departmentCode,
        );

        if (selectedDepartment.length > 0) {
            this.departmentDescriptionCtrl.patchValue(selectedDepartment[0].description);
        }
    }

    contractTypeChanged() {
        const res = this.contractTypeCtrl.value as ContractTypes;
        this.contractType = res.toString();
        this.contractTypeSelected.emit(res);
    }

    ifContractDateSelected() {
        const contractDate = this.contractDateCtrl.value as Date;
        this.contractDateSelected.emit(contractDate);
    }

    displayTrader(userId: number): string {
        if (userId) {
            const selectedUser = this.traders.find(
                (user) => user.userId === userId,
            );

            if (selectedUser) {
                return selectedUser.displayName;
            } else if (this.deprecatedTrader && this.deprecatedTrader.userId === userId) {
                return this.deprecatedTrader.displayName;
            }
        }

        return '';
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;

        section.type = this.contractTypeCtrl.value;
        section.contractReference = this.contractReferenceCtrl.value === '' ? null : this.contractReferenceCtrl.value;
        section.contractDate = this.contractDateCtrl.value;
        section.traderId = this.traderCtrl.value;
        const department = this.findDepartmentByCode(
            this.departmentCodeCtrl.value,
        );
        section.departmentId = department ? department.departmentId : null;
        section.status = ContractStatus[this.contractStatus];
        return section;
    }

    initForm(entity: Section, isEdit: boolean): any {
        this.isShow = true;
        this.isEditable = isEdit ? true : false;
        this.contractReferenceCtrl.clearAsyncValidators();
        this.contractReferenceCtrl.clearValidators();
        if (entity.traderId === 0 || (entity.header && entity.header.traderId === 0)) {
            entity.header.traderId = null;
        }
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        this.contractStatus = this.model.status === 'Closed' ? ContractStatus[ContractStatus.Unapproved] : this.model.status;
        this.openCloseStatus = this.model.isClosed ? 'Closed' : 'Open';
        this.isCancelled = this.model.isCancelled;
        if (this.model.type != null) {
            this.contractTypeCtrl.setValue(ContractTypes[this.model.type]);
            this.contractType = this.model.type;
        }
        this.contractReference = this.model.reference;
        if (this.model.contractDate != null) {
            this.formGroup.patchValue({ contractDateCtrl: this.model.contractDate });
            this.contractDateSelected.emit(this.contractDateCtrl.value);
        }
        this.formGroup.patchValue({ traderCtrl: this.model.traderId });
        this.displayTraderNameInViewForDisabledTraders();

        const departmentCode = this.masterdata.departments
            .filter((e) => e.departmentId === this.model.departmentId);
        if (departmentCode) {
            this.departmentCodeCtrl.patchValue(departmentCode[0]);
            this.departmentCodeSelected(departmentCode[0]);
        }
        this.createdBy = this.model.createdBy;

        if (this.model.creationDate != null) {
            this.createdOnCtrl.setValue(moment(this.model.creationDate));
        }
        if (!isEdit) {
            this.formGroup.disable();
            this.creatorCtrl.disable();
            this.createdOnCtrl.disable();
        } else {
            const isNotImageAndAllocatedContract = !this.isImage && (this.model.allocatedTo ||
                (this.model.invoiceReference &&
                    this.authorizationService.getPermissionLevel(
                        this.company,
                        'Trades', 'Physicals', 'SuperTradeEdition',
                    ) <= PermissionLevels.None));
            const isImageAndAllocation = this.isImage && this.isImageAllocate;
            if (isNotImageAndAllocatedContract || isImageAndAllocation) {
                    this.departmentCodeCtrl.disable();
                    this.departmentDescriptionCtrl.disable();
            }
            this.creatorCtrl.disable();
            this.createdOnCtrl.disable();
        }

        if (this.isImage) {
            this.contractTypeCtrl.patchValue(ContractTypes[Number(this.route.snapshot.queryParams.type)]);
            this.contractType = ContractTypes[Number(this.route.snapshot.queryParams.type)];
            this.contractDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
            this.createdOnCtrl.setValue(this.companyManager.getCurrentCompanyDate());
            this.contractReference = null;
            this.isEditContract = true;
            this.contractReferenceCtrl.patchValue(this.contractReference);
            this.setContractReferenceValidators();
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {
                this.handleFieldEditionForImage('TraderId', [this.traderCtrl]);
                this.handleFieldEditionForImage('ContractStatusCode', [this.contractTypeCtrl]);
                this.handleFieldEditionForImage('DepartmentId', [this.departmentCodeCtrl, this.departmentDescriptionCtrl]);
                this.handleFieldEditionForImage('ContractDate', [this.contractDateCtrl]);
                this.handleFieldEditionForImage('PhysicalContractCode', [this.contractReferenceCtrl]);

                this.handleCopyForImage('TraderId', [this.traderCtrl]);
                this.handleCopyForImage('DepartmentId', [this.departmentDescriptionCtrl, this.departmentCodeCtrl]);
                this.handleCopyForImage('PhysicalContractCode', [this.contractReferenceCtrl]);

                const checkContractDateIsCopy = this.tradeImageDetails.find((e) => e.tradeFieldName === 'ContractDate');
                if (checkContractDateIsCopy && !checkContractDateIsCopy.isCopy) {
                    this.contractDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
                } else {
                    this.contractDateCtrl.setValue(this.model.contractDate);
                }
            }
            this.contractStatus = ContractStatus[ContractStatus.Unapproved];
            this.status = 'Not Realized';
        }
        const favoriteId = Number(this.route.snapshot.queryParams.favoriteId);
        if (favoriteId) {
            this.isEditContract = true;
            this.contractDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
            this.createdOnCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        }

        this.contractRealisedStatus();
        if (this.model.isCancelled) {
            this.tradeCancelledStatus = 'Cancelled';
        }
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

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            contractTypeCtrl: this.contractTypeCtrl,
            contractReferenceCtrl: this.contractReferenceCtrl,
            contractDateCtrl: this.contractDateCtrl,
            traderCtrl: this.traderCtrl,
            departmentCodeCtrl: this.departmentCodeCtrl,
            departmentDescriptionCtrl: this.departmentDescriptionCtrl,
        });
        return super.getFormGroup();
    }

    contractStatusChanged(contractStatus: ContractStatus) {
        this.contractStatus = ContractStatus[contractStatus];
    }

    contractRealisedStatus() {
        if (this.model.blDate && !this.isImage) {
            this.date = true;
            this.status = 'Realized';
        } else {
            this.status = 'Not Realized';
        }
    }

    getTraderErrorMessageInDropdownList() {
        if (this.deprecatedTrader && this.traderCtrl.value === this.deprecatedTrader.userId) {
            return 'This user is no longer a trader';
        }
        return 'Trader not in the list';
    }

    getTradeImageFieldsCompany() {
        this.tradingService.getTradeImageFieldsByCompany()
            .subscribe((data) => {
                this.tradeImageDetails = data.value;
            });
    }
}
