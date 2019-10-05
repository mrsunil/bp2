using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class CompanySetup
    {
        public int Id { get; set; }

        public string CompanyId { get; set; }

        public long? DefaultBrokerId { get; set; }

        public string CompanyName { get; set; }

        public string CompanyFriendlyCode { get; set; }

        public long CompanyTypeId { get; set; }

        public string LegalEntityCode { get; set; }

        public string LegalEntity { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public long CompanyPlatformId { get; set; }

        public long? CountryId { get; set; }

        public string TimeZone { get; set; }

        public long? LDCRegionId { get; set; }

        public long? WeightUnitId { get; set; }

        public long? CounterpartyId { get; set; }

        public DateTime? CompanyDate { get; set; }

        public short? CropYearFormatId { get; set; }

        public long? DefaultProvinceId { get; set; }

        public long? DefaultBranchId { get; set; }

        public bool IsProvinceEnable { get; set; }

        public long? PriceUnitId { get; set; }

    }
}
