using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeMonthEndMappingErrorDto
    {
        public string DocumentReference { get; set; }

        public int AccrualNumber { get; set; }

        public string AccountingDocumentLineAccountReference { get; set; }

        public string AccountingDocumentLineDepartmentCode { get; set; }

        public string AccountingDocumentLineCostTypeCode { get; set; }

        public string AccountingDocumentLineClientAccount { get; set; }

        public bool IsMappingError
        {
            get
            {
                return C2CCodeIsInMappingError || NominalAlternativeAccountIsInMappingError || CostAlternativeCodeIsInMappingError || DepartmentAlternativeCodeIsInMappingError;
            }
        }

        public bool C2CCodeIsInMappingError { get; set; }

        public bool NominalAlternativeAccountIsInMappingError { get; set; }

        public bool CostAlternativeCodeIsInMappingError { get; set; }

        public bool DepartmentAlternativeCodeIsInMappingError { get; set; }
    }
}
