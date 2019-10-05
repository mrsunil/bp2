using LDC.Atlas.Services.Execution.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceHomeSearch
    {
        public string InvoiceLabel { get; set; }

        public InvoiceType InvoiceType { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string CounterpartyCode { get; set; }

        public DateTime DueDate { get; set; }

        public string VesselDescription { get; set; }

        public decimal TotalInvoiceValue { get; set; }

        public string Currency { get; set; }
    }
}
