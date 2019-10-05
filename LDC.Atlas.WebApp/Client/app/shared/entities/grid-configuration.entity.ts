import { ColumnConfigurationProperties } from './grid-column-configuration.entity';

export class GridConfigurationProperties {
    gridId: number;
    gridCode: string;
    name: string;
    companyId: string;
    columns: ColumnConfigurationProperties[];
    hasMultipleViewsPerUser: boolean;
    moduleName: string;
    configurationTypeId: number;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    maxNumberOfRecords: number;
    numberOfItemsPerPage: number;
}
