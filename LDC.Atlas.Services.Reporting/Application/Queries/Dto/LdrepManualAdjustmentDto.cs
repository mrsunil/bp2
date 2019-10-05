using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries.Dto
{
    public class LdrepManualAdjustmentDto
    {
        public string CompanyId { get; set; }

        public long ManualAdjustmentId { get; set; }

        public bool FromDateFormat { get; set; }

        public DateTime DateFrom { get; set; }

        public bool ToDateFormat { get; set; }

        public DateTime? DateTo { get; set; }

        public string DepartmentCode { get; set; }

        public string PNLType { get; set; }

        public bool Realized { get; set; }

        public decimal FunctionalCCYAdjustment { get; set; }

        public decimal StatutoryCCYAdjustment { get; set; }

        public string Narrative { get; set; }

        public string CharterCode { get; set; }

        public string ContractSectionCode { get; set; }

        public string PrincipalCommodity { get; set; }

        public string CropYear { get; set; }
    }
}
