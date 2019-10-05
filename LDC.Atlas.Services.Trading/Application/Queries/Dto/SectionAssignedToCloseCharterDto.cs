using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class SectionAssignedToCloseCharterDto
    {
        public int DataVersionId { get; set; }

        public long SectionId { get; set; }

        public DateTime? BLDate { get; set; }

        public InvoicingStatus InvoicingStatusId { get; set; }

        public double Quantity { get; set; }

        public string ContractSectionCode { get; set; }

        public int? PostingStatusId { get; set; }

        public ContractInvoiceType ContractInvoiceTypeId { get; set; }

        public long InvoiceId { get; set; }

        public int InvoicePercent { get; set; }

        public int PaidPercent { get; set; }

        public List<InvoiceAssociatedToSectionCloseDto> Invoices { get; set; }

        public List<AssignedCost> Costs { get; set; }
    }

    public class AssignedCost
    {
        public long CostId { get; set; }

        public int DataVersionId { get; set; }

        public long SectionId { get; set; }

        public int? InvoiceStatus { get; set; }

        public int InvoicePercent { get; set; }

        public DateTime InvoiceDate { get; set; }

        public decimal NetAccrual { get; set; }

        public string CurrencyCode { get; set; }

        public int? PostingStatusId { get; set; }

        public int CashMatchPercentage { get; set; }

        public DateTime CashMatchDate { get; set; }
    }

    public class InvoiceAssociatedToSectionCloseDto
    {
        public long InvoiceId { get; set; }

        public long SectionId { get; set; }

        public int InvoicePercent { get; set; }

        public InvoicingStatus InvoicingStatusId { get; set; }

        public int? PostingStatusId { get; set; }

        public int CashMatchPercentage { get; set; }

        public DateTime CashMatchDate { get; set; }
    }
}
