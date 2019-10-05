using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class NominalCostTypeInfoDto
    {
        public string CostTypeCode { get; set; }

        public string Name { get; set; }

        public int IsATradeCost { get; set; }

        public int IsACashCost { get; set; }

        public int IsACommission { get; set; }

        public string NominalAccountCode { get; set; }

        public string OtherAcc { get; set; }

        public string OtherAccUse { get; set; }

        public string AltCode { get; set; }

        public string ClientControl { get; set; }

        public int Freight { get; set; }

        public int Insurance { get; set; }

        public int NoAction { get; set; }

        public int InPL { get; set; }

        public int InStock { get; set; }

        public string Accrue { get; set; }

        public int BackOff { get; set; }

        public string InterfaceCode { get; set; }

        public string SectionCode { get; set; }

        public string ObjectCode { get; set; }

        public string AccountNumber { get; set; }

        public string MainAccountTitle { get; set; }

        public string DetailAccountTitle { get; set; }

        public string AccType { get; set; }

        public int BankAcc { get; set; }

        public string CustVendor { get; set; }

        public string AlternativeAccount { get; set; }

        public string AlternativeDescription { get; set; }

        public string OtherAlternativeAccount { get; set; }

        public int RevalxRequired { get; set; }

        public int IncInCcyexp { get; set; }

        public string InterfaceBankCode { get; set; }

        public DateTime? DateLastPosted { get; set; }
    }
}
