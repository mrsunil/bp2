using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class InvoiceMarkingQueries : BaseRepository, IInvoiceMarkingQueries
    {
        public InvoiceMarkingQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<InvoiceMarkingDto>> GetContractInvoiceMarkingsAsync(long sectionID, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@sectionID", sectionID);
            queryParameters.Add("@company", company);

            var results = await ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetSectionInvoiceMarkings, queryParameters);

            return results;
        }

        public async Task<IEnumerable<InvoiceMarkingDto>> GetCostInvoiceMarkingsAsync(long costId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@costId", costId);
            queryParameters.Add("@company", company);

            var results = await ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetCostInvoiceMarkings, queryParameters);

            return results;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetSectionInvoiceMarkings = "[Execution].[usp_ListInvoiceMarkingsForSection]";
            internal const string GetCostInvoiceMarkings = "[Execution].[usp_ListInvoiceMarkingsForCost]";
        }
    }
}
