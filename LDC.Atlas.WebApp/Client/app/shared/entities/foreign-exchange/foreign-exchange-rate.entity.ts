export interface ForeignExchangeRate {
    currencyCode: string;
    currencyDescription: string;
    currencyRoeType: string;
    date: Date;
    rate: string;
    fwdMonth1: string;
    fwdMonth2: string;
    fwdMonth3: string;
    fwdMonth6: string;
    fwdYear1: string;
    fwdYear2: string;
    currencyIsDeactivated: boolean;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    creationMode: string;
    time: string;
}
