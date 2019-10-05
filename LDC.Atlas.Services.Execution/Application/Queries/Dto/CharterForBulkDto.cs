using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CharterBulkClosureDto
    {
        public int DataVersionId { get; set; }

        public int CharterId { get; set; }

        public string CharterCode { get; set; }

       public CharterStatus StatusId { get; set; }

        public string VesselName { get; set; }

        public string Description { get; set; }

        public IEnumerable<AssignedSectionToCharterBulkClosureDto> SectionsAssigned { get; set; }
    }
}
