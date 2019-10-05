using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Currency
    {
        public string CurrencyCode { get; set; }

        public string MdmId { get; set; }

        public string Description { get; set; }

        public string DisplayName => CurrencyCode;

        public string RoeType { get; set; }

        public string MajorUnits { get; set; }

        public string MinorUnits { get; set; }

        public string InterfaceCode { get; set; }

        public bool IsDeactivated { get; set; }

        public int Pips { get; set; }

        public int DecimalPlaces { get; set; }

        public int ROEDecPlaces { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public bool IsDollar()
        {
            return CurrencyCode == "USD";
        }
    }
}
