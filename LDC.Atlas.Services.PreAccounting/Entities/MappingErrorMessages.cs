using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class MappingErrorMessages
    {
        public bool C2CCode { get; set; }

        public bool CostAlternativeCode { get; set; }

        public bool TaxInterfaceCode { get; set; }

        public bool DepartmentAlternativeCode { get; set; }

        public bool NominalAlternativeAccount { get; set; }

        public bool IsMappingError { get; set; }
    }
}
