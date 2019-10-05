using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class InvoiceMarkingQueries : BaseRepository, IInvoiceMarkingQueries
    {
        public InvoiceMarkingQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<InvoiceMarkingDto>> GetCostInvoiceMarkingsAsync(long costId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostId", costId);
            queryParameters.Add("@CompanyId", company);

            var results = await ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetCostInvoiceMarkings, queryParameters);

            return results;
        }

        public async Task<IEnumerable<InvoiceMarkingDto>> GetSectionInvoiceMarkingsAsync(long sectionId, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var result = await ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetSectionInvoiceMarking, queryParameters, true);
            return result;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCostInvoiceMarkings = "[Invoicing].[usp_GetInvoiceMarkingsForCost]";
            internal const string GetSectionInvoiceMarking = "[Invoicing].[usp_GetInvoiceMarkingsForSection]";
        }
    }
}
