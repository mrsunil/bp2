using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class Charter
    {
        public long? CharterId { get; set; }

        public string CharterCode { get; set; }

        public string Description { get; set; }

        public long VesselId { get; set; }

        public string VesselCode { get; set; }

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

        [Column(Name = "CharterManager")]
        public long? CharterManagerId { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? BlDate { get; set; }

        public string Currency { get; set; }

        public long? DepartmentId { get; set; }

        public string BLRef { get; set; }

        public long WeightUnitId { get; set; }

        public bool AllContractsSelected { get; set; }

        public IEnumerable<SectionsAssignedToCharterRecord> SectionsAssigned { get; set; }
  }
}
