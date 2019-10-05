using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Interface.Application.Queries
{
    public class BuilderQueries : BaseRepository, IBuilderQueries
    {

        public BuilderQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {

        }

        public async Task<string> GetXMLForAccountingInterfaceAsync(string company, long documentId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingDocumentId", documentId);
            queryParameters.Add("@CompanyId", company);

            return await ExecuteScalarAsync<string>(StoredProcedureNames.GetXMLForAccountingInterface, queryParameters);
        }

        public async Task<string> GetTraxMessageAsync(string company, long cashId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CashId", cashId);
            queryParameters.Add("@CompanyId", company);

            return await ExecuteScalarAsync<string>(StoredProcedureNames.GetTraxMessage, queryParameters);
        }

        public async Task<bool> CheckDocumentReferenceforCompanyExists(string company, string documentReference,int objectTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add("@ObjectTypeId", objectTypeId);
            queryParameters.Add("@DataVersionId", null);
            var isCounterpartyExists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckDocumentReferenceforCompanyExists, queryParameters);
            return isCounterpartyExists;
        }

        public async Task<long> GetAccountingDocumentIdandCashIdbyDocumentReference(string company, string documentReference, int interfaceTypeId,int objectTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DataVersionId", null);
            queryParameters.Add("@InterFaceTypeId", interfaceTypeId);
            queryParameters.Add("@ObjectTypeId", objectTypeId);
            var id = await ExecuteQueryFirstOrDefaultAsync<long>(StoredProcedureNames.GetAccountingDocumentIdandCashIdbyDocumentReference, queryParameters);
            return id;
        }

        private static class StoredProcedureNames
        {
            internal const string GetXMLForAccountingInterface = "[Interface].[usp_GetXMLForAccountingInterface]";
            internal const string GetTraxMessage = "[Invoicing].[usp_GetTraxMessage]";
            internal const string CheckDocumentReferenceforCompanyExists = "[Interface].[usp_CheckDocumentReferenceForCompanyExists]";
            internal const string GetAccountingDocumentIdandCashIdbyDocumentReference = "[Interface].[usp_GetAccountingDocumentIdandCashIdbyDocumentReference]";
        }

        }
}
