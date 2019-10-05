import { ListAndSearchFilterDto } from './list-and-search-filter-dto.dto';

export class ListAndSearchUserFilterSetDto {
    filterSetId: number;
    name: string;
    isDefault: boolean;
    isSharedWithAllUsers: boolean;
    isSharedWithAllCompanies: boolean;
    companyId: string;
    gridCode: string;
    isUserDefault: boolean;
    ownerId: number;
    filters?: ListAndSearchFilterDto[];
    isModified = false;

    constructor() {
        this.isModified = true;
    }
}
