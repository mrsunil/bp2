using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.Freeze.Application.Queries.Dto
{
    public class FreezeDto
    {
        public int? DataVersionId { get; set; }

        public string CompanyId { get; set; }

        [JsonConverter(typeof(IsoDateConverter))]
        public DateTime FreezeDate { get; set; }

        public DataVersionTypeDto DataVersionTypeId { get; set; }

        public string DataVersionTypeDescription { get; set; }

        public DateTime StartDateTime { get; set; }

        public DateTime? EndDateTime { get; set; }

        public string CreatedBy { get; set; }
    }
}