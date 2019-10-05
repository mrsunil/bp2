using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class CompanyListDto
    {
        public int Id { get; set; }

        public string CompanyId { get; set; }

        public string Description { get; set; }

        public string CompanyType { get; set; }

        public string LegalEntityCode { get; set; }

        public string LdcRegionCode { get; set; }
    }
}