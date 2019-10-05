using System;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class CompanySetupDto
    {
        public int Id { get; set; }

        public string CompanyId { get; set; }

        public string CompanyFriendlyCode { get; set; }

        public string Description { get; set; }

        public long? DefaultBrokerId { get; set; }

        public bool IsFrozen { get; set; }

        public long CounterpartyId { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public string CompanyType { get; set; }

        public string CompanyPlatform { get; set; }

        public string CountryCode { get; set; }

        public string CountryDescription { get; set; }

        public string TimeZoneName { get; set; }

        public string LdcRegionCode { get; set; }

        public DateTime? ActiveDate { get; set; }

        public string WeightCode { get; set; }

        public bool CanEditFunctionalCurrency { get; set; }

        public bool CanEditStatutoryCurrency { get; set; }

        public short? CropYearId { get; set; }

        public string LegalEntityCode { get; set; }

        public string LegalEntity { get; set; }

        public long? DefaultProvinceId { get; set; }

        public long? DefaultBranchId { get; set; }

        public bool IsProvinceEnable { get; set; }

        public string PriceCode { get; set; }
    }
}
