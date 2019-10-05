using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class UpdateAccountingDocumentCommand : IRequest<SectionPostingStatus>
    {
        public long AccountingId { get; set; }

        public DateTime DocumentDate { get; set; }

        public PostingStatus StatusId { get; set; }

        public DateTime? ValueDate { get; set; }

        public DateTime? GLDate { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public string CurrencyCode { get; set; }

        public bool ToInterface { get; set; }

        internal string Company { get; set; }

        public int? DmsId { get; set; }

        internal bool IsAuthorizedControlEnabled { get; set; }

        public IEnumerable<AccountingDocumentLine> AccountingDocumentLines { get; set; }

        public DocumentType TransactionDocumentTypeId { get; set; }

        public IEnumerable<ItemConfigurationPropertiesDto> FieldsConfigurations { get; set; }
    }
}
