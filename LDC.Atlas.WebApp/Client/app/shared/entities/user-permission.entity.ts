import { Department } from './department.entity';

export class UserPermission {
    companyId: string;
    profileId: number;
    allDepartments = true;
    departments: Department[] = [];
    isTrader: boolean;
    isCharterManager: boolean;
    profileName: string;

    constructor(companyId = '',
        profileId = null,
        allDepartments = true,
        departments: Department[] = [],
        isTrader = false,
        isCharterManager = false) {
        this.companyId = companyId;
        this.profileId = profileId;
        this.allDepartments = allDepartments;
        this.departments = departments;
        this.isTrader = isTrader;
        this.isCharterManager = isCharterManager;
    }
}