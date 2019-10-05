using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CharterSummaryDto : PaginatedItem
    {
        public int? CharterId { get; set; }

        public string CharterCode { get; set; }

        public string Description { get; set; }

        public string VesselCode { get; set; }

        public string VesselBuilt { get; set; }

        public string TransportTypeCode { get; set; }

        public string LoadingLocationCode { get; set; }

        public DateTime? DepartureDate { get; set; }

        public string DischargeLocationCode { get; set; }

        public DateTime? ArrivalDate { get; set; }

        public DateTime? CreationDate { get; set; }

        public string CreatedBy { get; set; }

        [Column(Name = "CompanyId")]
        public string Company { get; set; }

        public string Memo { get; set; }

        public long CharterManagerId { get; set; }

        public string CharterManagerSamAccountName { get; set; }

        public DateTime? BlDate { get; set; }

        [Column(Name = "CurrencyCode")]
        public string Currency { get; set; }

        public int DepartmentId { get; set; }

        public string BLRef { get; set; }

        [Column(Name = "WeightUnitId")]
        public string QuantityUnit { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int CharterStatusId { get; set; }

        public IEnumerable<SectionsAssignedToCharterRecord> SectionsAssigned { get; set; }

        public string DepartmentCode { get; set; }

        public string DepartmentDescription { get; set; }

        public string CharterStatusDescription { get; set; }
    }
}
