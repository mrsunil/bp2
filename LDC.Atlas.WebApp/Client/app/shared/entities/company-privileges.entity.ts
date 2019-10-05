import { UserCompanyPrivilegeDto } from '../services/authorization/dtos/user-company-privilege';

export class CompanyPrivileges {
    companyId: string;
    privileges: UserCompanyPrivilegeDto[] = [];
}
