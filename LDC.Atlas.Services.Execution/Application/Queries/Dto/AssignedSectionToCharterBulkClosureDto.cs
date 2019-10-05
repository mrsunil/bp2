using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class AssignedSectionToCharterBulkClosureDto
    {
        public int DataVersionId { get; set; }
        public int CharterId { get; set; }

        public string SectionId { get; set; }

        public bool IsClosed { get; set; }

        public int PercentageInvoice { get; set; }

        public int NetAccuralPnLValue { get; set; }

        public string ContractSectionCode { get; set; }

        public string CurrencyCode { get; set; }

        public IEnumerable<CostAssignedToSectionDto> CostAssigned { get; set; }
    }

}
