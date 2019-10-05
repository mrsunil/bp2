import * as agGrid from 'ag-grid-community';
import { UserGridViewDto } from '../dtos/user-grid-view-dto.dto';

// this class is used for passing gridPreferences parameters to the gridEnlargementComponent
// it reflects the input of the userGridViewPreferences
export class UserGridPreferencesParameters {
    gridOptions: agGrid.GridOptions;
    company: string;
    gridId: string;

    savingEnabled?: boolean = true;
    sharingEnabled?: boolean = false;

    isFavouriteMenuEnabled?: boolean = true;
    isAutosize?: boolean = true;
    canDeleteView?: boolean = true;
    showExport?: boolean = true;
    hasColumnHandling?: boolean = true;
    hasCustomExport?: boolean = false;

    // --
    selectedGridViewId?: number;
    gridViews?: UserGridViewDto[];

    constructor(preferences?: UserGridPreferencesParameters) {
        if (preferences) {
            this.gridOptions = preferences.gridOptions;
            this.company = preferences.company;
            this.gridId = preferences.gridId;

            this.savingEnabled = (preferences.savingEnabled === undefined) ? this.savingEnabled : preferences.savingEnabled;
            this.sharingEnabled = (preferences.sharingEnabled === undefined) ? this.sharingEnabled : preferences.sharingEnabled;
            this.isFavouriteMenuEnabled = (preferences.isFavouriteMenuEnabled === undefined) ?
                this.isFavouriteMenuEnabled : preferences.isFavouriteMenuEnabled;
            this.isAutosize = (preferences.isAutosize === undefined) ? this.isAutosize : preferences.isAutosize;
            this.canDeleteView = (preferences.canDeleteView === undefined) ? this.canDeleteView : preferences.canDeleteView;
            this.hasColumnHandling = (preferences.hasColumnHandling === undefined) ? this.hasColumnHandling : preferences.hasColumnHandling;
            this.showExport = (preferences.showExport === undefined) ? this.showExport : preferences.showExport;

            this.hasCustomExport = (preferences.hasCustomExport === undefined) ?
                this.hasCustomExport : preferences.hasCustomExport;

            this.selectedGridViewId = (preferences.selectedGridViewId === undefined) ?
                this.selectedGridViewId : preferences.selectedGridViewId;

            this.gridViews = (preferences.gridViews === undefined) ?
                this.gridViews : preferences.gridViews;

        }
    }
}
