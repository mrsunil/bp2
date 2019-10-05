using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Interface.Application.Queries
{
    public interface IBuilderQueries
    {
        Task<string> GetXMLForAccountingInterfaceAsync(string company, long documentId);
        Task<string> GetTraxMessageAsync(string company, long cashId);

        Task<bool> CheckDocumentReferenceforCompanyExists(string company, string documentReference, int objectTypeId);

        Task<long> GetAccountingDocumentIdandCashIdbyDocumentReference(string company, string documentReference, int interfaceTypeId,int objectTypeId);
    }
}
