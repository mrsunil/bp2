import { CounterpartyTax } from '../../../../../shared/entities/counterparty-tax.entity';

export class TaxListDisplayView {
    counterpartyTaxId: number;
    counterpartyId: number;
    vatRegistrationNumber: string;
    countryId: number;
    main: boolean;
    isDeactivated: boolean;
}