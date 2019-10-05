using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class ManualDocumentMatchingQueries : BaseRepository, IManualDocumentMatchingQueries
    {
        public ManualDocumentMatchingQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetDocumentToMatchAsync(
            string company,
            long counterpartyId,
            string departmentId,
            string currencyCode,
            bool bitEdit,
            long? matchFlag,
            int? offset,
            int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CounterpartyId", counterpartyId);
            queryParameters.Add("@DepartmentId", departmentId);
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add("@BitEdit", bitEdit);
            queryParameters.Add("@MatchFlag", matchFlag ?? null);
            var documents = await ExecuteQueryAsync<DocumentMatchingDto>(StoredProcedureNames.ListDocumentsForManualMatching, queryParameters);
            return documents;
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetDocumentReferenceAsync(string company, int matchType)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DataversionId", null);
            queryParameters.Add("@Type", matchType);

            var documentReference = await ExecuteQueryAsync<DocumentMatchingDto>(StoredProcedureNames.ListDocumentReferenceForMatching, queryParameters, true);
            return documentReference;
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetDocumentByDocumentReference(string company, string documentReference, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add(DataVersionIdParameter, null);
            var documentForMatching = await ExecuteQueryAsync<DocumentMatchingDto>(StoredProcedureNames.GetDocumentByReferenceForCreateMatch, queryParameters, true);
            return documentForMatching;
        }

        public async Task<IEnumerable<MatchedDocumentInfo_ForUnmatchDto>> GetDocumentToUnMatchAsync(string company, long counterpartyId, string departmentId,
            string currencyCode, string documentReference, string matchFlagCode, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CounterpartyId", counterpartyId);
            queryParameters.Add("@DepartmentId", departmentId);
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add("@MatchFlagCode", matchFlagCode);
            var documents = await ExecuteQueryAsync<MatchedDocumentInfo_ForUnmatchDto>(StoredProcedureNames.ListDocumentsForDeleteMatching, queryParameters, true);
            return documents;
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetMatchFlagAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DataversionId", null);

            var matchFlag = await ExecuteQueryAsync<DocumentMatchingDto>(StoredProcedureNames.ListMatchFlagForMatching, queryParameters);
            return matchFlag;
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetDocumentByMatchFlag(string company, string matchFlagCode, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@MatchFlagCode", matchFlagCode ?? null);
            queryParameters.Add(DataVersionIdParameter, null);
            var documentForMatching = await ExecuteQueryAsync<DocumentMatchingDto>(StoredProcedureNames.GetDocumentsByMatchFlag, queryParameters);
            return documentForMatching;
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetDocumentToUnmatchByDocumentReference(string company, string documentReference, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DocumentReference", documentReference ?? null);
            queryParameters.Add(DataVersionIdParameter, null);
            var documentForMatching = await ExecuteQueryAsync<DocumentMatchingDto>(StoredProcedureNames.GetDocumentByReferenceForDeleteMatch, queryParameters, true);
            return documentForMatching;
        }

        public async Task<IEnumerable<MatchableDocumentSummaryInformationDto>> GetMatchableDocumentsSummaryInformation(
            string companyCode, IEnumerable<MatchableSourceIdDto> documentsToMatch)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            DataTable table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_MatchedSourceId]");
            var sourceJournalLineId = new DataColumn("SourceJournalLineId", typeof(long));
            table.Columns.Add(sourceJournalLineId);
            var sourceInvoiceId = new DataColumn("SourceInvoiceId", typeof(long));
            table.Columns.Add(sourceInvoiceId);
            var sourceCashLineId = new DataColumn("SourceCashLineId", typeof(long));
            table.Columns.Add(sourceCashLineId);
            foreach (var documentToMatch in documentsToMatch)
            {
                var record = table.NewRow();
                record[sourceCashLineId] = documentToMatch.SourceCashLineId.HasValue ? (object)documentToMatch.SourceCashLineId.Value : DBNull.Value;
                record[sourceInvoiceId] = documentToMatch.SourceInvoiceId.HasValue ? (object)documentToMatch.SourceInvoiceId : DBNull.Value;
                record[sourceJournalLineId] = documentToMatch.SourceJournalLineId.HasValue ? (object)documentToMatch.SourceJournalLineId : DBNull.Value;
                table.Rows.Add(record);
            }

            queryParameters.Add("@CompanyCode", companyCode);
            queryParameters.Add("@matchedSourceIds", table);
            return await ExecuteQueryAsync<MatchableDocumentSummaryInformationDto>(
                StoredProcedureNames.GetMatchableDocumentsSummaryInformation,
                queryParameters);
        }

        internal static class StoredProcedureNames
        {
            internal const string ListDocumentsForManualMatching = "[Invoicing].[usp_ListDocumentsForManualMatching]";
            internal const string ListDocumentReferenceForMatching = "[Invoicing].[usp_ListDocumentReferenceForMatching]";
            internal const string GetDocumentByReferenceForCreateMatch = "[Invoicing].[usp_GetDocumentByReferenceforCreateMatch]";
            internal const string ListDocumentsForDeleteMatching = "[Invoicing].[usp_ListDocumentsForDeleteMatching]";
            internal const string ListMatchFlagForMatching = "[Invoicing].[usp_ListMatchFlagforMatching]";
            internal const string GetDocumentsByMatchFlag = "[Invoicing].[usp_GetDocumentsByMatchFlag]";
            internal const string GetDocumentByReferenceForDeleteMatch = "[Invoicing].[usp_GetDocumentByReferenceForDeleteMatch]";
            internal const string GetMatchableDocumentsSummaryInformation = "[Invoicing].[usp_GetMatchableDocumentsSummaryInformation]";
        }
    }
}
