using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class SectionsInformationDto
    {
        public DateTime? BLDate { get; set; }

        public string ContractSectionCode { get; set; }

        public long SectionId { get; set; }

        public long CommodityId { get; set; }

        public long? CharterId { get; set; }

        public long DepartmentId { get; set; }

        public string Vessel { get; set; }

        public string CharterReference { get; set; }
    }
}
