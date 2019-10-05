using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class CreateManualDocumentMatchingCommand : IRequest<ManualDocumentMatchingRecord>
    {
        internal string Company { get; set; }

        public long? JournalId { get; set; }

        public long? MatchFlagId { get; set; }

        public int CounterpartyId { get; set; }

        public string CounterpartyCode { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public string FunctionalCurrency { get; set; }

        public string StatutoryCurrency { get; set; }

        public bool CreateACurrencyReval { get; set; }

        public bool CreateADepartmentReval { get; set; }

        public decimal TotalAmount { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public IEnumerable<ManualDocumentMatching> ManualDocumentMatchings { get; set; }
    }

    public class UpdateDocumentMatchingCommand : IRequest
    {
        internal string Company { get; set; }

        public long? JournalId { get; set; }

        public long? MatchFlagId { get; set; }

        public int CounterpartyId { get; set; }

        public string CounterpartyCode { get; set; }

        public int DepartmentId { get; set; }

        public string CurrencyCode { get; set; }

        public string DepartmentCode { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public string FunctionalCurrency { get; set; }

        public string StatutoryCurrency { get; set; }

        public bool CreateACurrencyReval { get; set; }

        public bool CreateADepartmentReval { get; set; }

        public decimal TotalAmount { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public IEnumerable<ManualDocumentMatching> ManualDocumentMatchings { get; set; }
    }

    /// <summary>
    /// Contains the only parameters required to unmatch a matchflag...
    /// </summary>
    public class UnmatchManualDocumentMatchingCommand : IRequest<ManualDocumentMatchingRecord>
    {
        internal string Company { get; set; }

        public long? MatchFlagId { get; set; }
    }
}