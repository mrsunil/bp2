using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Entities
{
    public class LdrepManualAdjustment
    {
        public string Company { get; set; }

        public DateTime DateFrom { get; set; }

        public DateTime? DateTo { get; set; }

        public ICollection<LdrepManualAdjustmentRecords> LdrepManualAdjustmentRecords { get; set; }
    }

    public class LdrepManualAdjustmentRecords
    {
        public long ManualAdjustmentId { get; set; }

        public bool FromDateFormat { get; set; }

        public DateTime DateFrom { get; set; }

        public bool? ToDateFormat { get; set; }

        public DateTime? DateTo { get; set; }

        public long DepartmentId { get; set; }

        public byte PNLTypeId { get; set; }

        public bool Realized { get; set; }

        public decimal FunctionalCCYAdjustment { get; set; }

        public decimal StatutoryCCYAdjustment { get; set; }

        public string Narrative { get; set; }

        public int? CharterRefrenceId { get; set; }

        public long? SectionId { get; set; }

        public long? CommodityId { get; set; }

        public string CropYear { get; set; }
    }
}
