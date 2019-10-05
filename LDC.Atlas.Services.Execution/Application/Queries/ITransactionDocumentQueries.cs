using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface ITransactionDocumentQueries
    {
        Task<int> GetNextTransactionDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year);
    }
}
