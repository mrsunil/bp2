import { MasterDataProps } from './masterdata-props.entity';

export interface Menu {
    title?: string;
    index?: number;
    imageUrl?: string;
    authorized?: string;
    privilege?: string;
    navigateUrl?: MasterDataProps;
    gridCode?: string;
    childrens?: Menu[];
    isGlobal?: boolean;
    isLocal?: boolean;
}
