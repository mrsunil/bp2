using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.Freeze.Application.Queries.Dto
{
    public class FreezeSearchForCompanyDto
    {
        public bool? ComparisonFreezeExists { get; set; }

        public string ComparisonMissingCompany { get; set; }

        public DateTime? ComparisonFreezeDate { get; set; }

        public bool? DatabaseFreezeExists { get; set; }

        public string MissingCompany { get; set; }

        public DateTime? DatabaseFreezeDate { get; set; }
    }
}