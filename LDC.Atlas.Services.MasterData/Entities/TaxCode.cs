using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class TaxCodeEntity
    {
        public long TaxId { get; set; }

        public string TaxCode { get; set; }

        public long TaxRate { get; set; }

        public string Description { get; set; }

        public string InterfaceCode { get; set; }

        public long TaxReversalRate { get; set; }

        public long AlternateVatInputsAccId { get; set; }

        public long AlternateVatOutputsAccId { get; set; }

        public bool IsDeactivated { get; set; }

        public string VatReg { get; set; }

        public string ExciseTariffCode { get; set; }

        public string FormType { get; set; }

        public string TinNo { get; set; }

        public long SgstUtgstRate { get; set; }

        public long SgstUtgstReversalRate { get; set; }

        public long SgstUtgstInputsAccId { get; set; }

        public long SgstUtgstPayableAccId { get; set; }

        public string NonZeroFlag { get; set; }

        public long ExpenseTaxRate { get; set; }

        public long ExpenseAccId { get; set; }
    }
}
