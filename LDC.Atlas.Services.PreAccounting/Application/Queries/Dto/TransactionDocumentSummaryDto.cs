using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    /// <summary>
    /// Summary of transaction document information
    /// </summary>
    public class TransactionDocumentSummaryDto
    {
        public int TransactionDocumentTypeId { get; set; }

        public string Label { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public short? JLTypeId { get; set; }

        public bool ToInterface { get; set; }

        public bool IsReversal { get; set; }
    }
}
