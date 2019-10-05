export interface ForeignExchangeRateDto {
    currencyCode: string;
    date: Date;
    rate: string;
    fwdMonth1: string;
    fwdMonth2: string;
    fwdMonth3: string;
    fwdMonth6: string;
    fwdYear1: string;
    fwdYear2: string;
    creationModeId: number;
}
