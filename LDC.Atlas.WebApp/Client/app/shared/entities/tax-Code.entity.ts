export interface TaxCode {
    taxId: number;
    taxCode: string;
    taxRate: number;
    description: string;
    interfaceCode: string;
    taxReversalRate: number;
    alternateVatInputsAccId: number;
    alternateVatOutputsAccId: number;
    isDeactivated: boolean;
    vatReg: string;
    exciseTariffCode: string;
    formType: string;
    tinNo: string;
    sgstUtgstRate: number;
    sgstUtgstReversalRate: number;
    sgstUtgstInputsAccId: number;
    sgstUtgstPayableAccId: number;
    nonZeroFlag: string;
    expenseTaxRate: number;
    expenseAccId: number;
}
