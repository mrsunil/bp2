export class UserGridViewDto {
    gridViewId: number;
    companyId: string;
    name: string;
    isDefault: boolean = false;
    isSharedWithAllUsers: boolean = false;
    isSharedWithAllCompanies: boolean = false;
    gridCode: string;
    isFavorite: boolean = false;
    createdBy: string;
    gridViewColumnConfig: string = '';
}
