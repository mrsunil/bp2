using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CharterDto
    {
        public int CharterId { get; set; }

        public string CharterCode { get; set; }

        public string Description { get; set; }

        public long? VesselId { get; set; }

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

        public long? CharterManagerId { get; set; }

        public string CharterManagerDisplayName { get; set; }

        [Column(Name = "BLDate")]
        public DateTime? BlDate { get; set; }

        [Column(Name = "CurrencyCode")]
        public string Currency { get; set; }

        public long DepartmentId { get; set; }

        [Column(Name = "BLRef")]
        public string BLRef { get; set; }
        
        public string ShippingStatusCode { get; set; }

        public string ShippingStatusDescription { get; set; }

        public long WeightUnitId { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public DateTime? AssignmentDate { get; set; }

        public string AssignedBy { get; set; }

        public string AssignedByDisplayName { get; set; }

        public IEnumerable<SectionAssignedToCharterDto> SectionsAssigned { get; set; }

        public CharterStatus CharterStatusId { get; set; }
    }
}
