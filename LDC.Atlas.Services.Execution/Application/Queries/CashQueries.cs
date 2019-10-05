using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class CashQueries : BaseRepository, ICashQueries
    {
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IGridService _gridQueries;

        public CashQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper, IGridService gridQueries)
           : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
        }

        public async Task<IEnumerable<CashSummaryDto>> GetCashListAsync(string company, int costDirectionId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DirectionId", costDirectionId);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);
            queryParameters.Add("@DataversionId", null);
            var cashList = await ExecuteQueryAsync<CashSummaryDto>(StoredProcedureNames.ListCashbyDirection, queryParameters, true);

            return cashList.ToList();
        }

        public async Task<IEnumerable<CashMatchingDto>> ListMatchableDocumentsForCashByPickingAsync(
            string company,
            long counterpartyId,
            string departmentId,
            string currencyCode,
            bool isEdit,
            long? matchFlag,
            int? offset,
            int? limit,
            string documentReference)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CounterpartyId", counterpartyId);
            queryParameters.Add("@DepartmentId", departmentId);
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add("@BitEdit", isEdit);
            queryParameters.Add("@MatchFlag", matchFlag ?? null);
            queryParameters.Add("@DocumentReference", documentReference ?? null);
            var matchableDocuments = await ExecuteQueryAsync<CashMatchingDto>(StoredProcedureNames.ListMatchableDocumentsForCashByPicking, queryParameters, true);
            return matchableDocuments;
        }

        public async Task<IEnumerable<CashMatchingDto>> GetDocumentDetailsByDocumentReference(string company, string documentReference, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DocumentReference", documentReference ?? null);
            queryParameters.Add(DataVersionIdParameter, null);
            var invoicesForMatching = await ExecuteQueryAsync<CashMatchingDto>(StoredProcedureNames.GetDocumentDetailsByDocumentReference, queryParameters);
            invoicesForMatching.ToList().ForEach(a => a.AmountToBePaid = Math.Abs(a.AmountToBePaid));
            return invoicesForMatching.Any() ? CalculateMatchableDocumentDetails(invoicesForMatching, false, 0) : invoicesForMatching;
        }

        public async Task<CashSetupDto> GetCashSetupInfoAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);

            CashSetupDto cashSetup = await ExecuteQueryFirstOrDefaultAsync<CashSetupDto>(StoredProcedureNames.GetCashSetupDetails, queryParameters);

            return cashSetup;
        }

        public async Task<CashDto> GetCashByIdAsync(string company, long cashId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@cashId", cashId);
            queryParameters.Add("@DataversionId", null);
            CashDto cash;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCashbyCashId, queryParameters, true))
            {
                cash = (await grid.ReadAsync<CashDto>()).FirstOrDefault();
                if (cash != null)
                {
                    var additionalCost = await grid.ReadAsync<AdditionalCostDto>();
                    cash.AdditionalCostDetails = additionalCost;
                    var invoiceDetails = await grid.ReadAsync<CashMatchingDto>();
                    invoiceDetails.ToList().ForEach(a => a.AmountToBePaid = Math.Abs(a.AmountToBePaid));
                    cash.DocumentMatchings = invoiceDetails;
                }
            }

            return cash;
        }

        public async Task<IEnumerable<DocumentReferenceSearchDto>> ListMatchableDocumentReferencesAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DataversionId", null);

            var documentReference = await ExecuteQueryAsync<DocumentReferenceSearchDto>(StoredProcedureNames.ListMatchableDocumentReferences, queryParameters, true);
            return documentReference;
        }

        private IEnumerable<CashMatchingDto> CalculateMatchableDocumentDetails(IEnumerable<CashMatchingDto> documentsToMatch, bool isEdit, long? matchFlag)
        {
            // get the total avilable amount for each cash.
            List<CashMatchingDto> matchableDocuments = new List<CashMatchingDto>();

            // get all invoices which are not yet used for cash/document matching
            matchableDocuments.AddRange(documentsToMatch.Where(a => a.MatchFlagId == 0).ToList());

            // get the invoices which already used in document matching.
            List<CashMatchingDto> invoicesWithMatchFlagId = documentsToMatch.Except(matchableDocuments).ToList();

            if (invoicesWithMatchFlagId.Count > 0)
            {
                // calculate the total amount paid for each invoice
                List<CashMatchingDto> result = invoicesWithMatchFlagId.GroupBy(d => d.DocumentReference)
                .Select(g => new CashMatchingDto { DocumentReference = g.Key, AmountToBePaid = g.Sum(s => s.AmountToBePaid), }).ToList();

                foreach (var item in result)
                {
                    var document = invoicesWithMatchFlagId.FirstOrDefault(a => a.DocumentReference == item.DocumentReference);
                    if (document != null)
                    {
                        item.DocumentReference = document.DocumentReference;
                        item.DocumentType = document.DocumentType;
                        item.TransactionDocumentId = document.TransactionDocumentId;
                        item.TransactionDocumentTypeId = document.TransactionDocumentTypeId;
                        item.CurrencyCode = document.CurrencyCode;
                        item.DocumentDate = document.DocumentDate;
                        item.AuthorizedForPosting = document.AuthorizedForPosting;
                        item.CounterPartyId = document.CounterPartyId;
                        item.PaymentTermId = document.PaymentTermId;
                        item.DepartmentId = document.DepartmentId;
                        item.Amount = document.Amount - item.AmountToBePaid;
                        item.ExternalReference = document.ExternalReference;
                        item.Narrative = document.Narrative;
                        item.DepartmentId = document.DepartmentId;
                        item.CharterId = document.CharterId;
                        item.TransactionDirectionID = document.TransactionDirectionID;
                        item.ValueDate = document.ValueDate;
                        item.SecondaryDocumentReference = document.SecondaryDocumentReference;
                        item.AccountLineTypeId = document.AccountLineTypeId;
                        item.InvoiceGLDate = document.InvoiceGLDate;
                        item.SourceCashLineId = document.SourceCashLineId;
                        item.SourceInvoiceId = document.SourceInvoiceId;
                        item.SourceJournalLineId = document.SourceJournalLineId;
                    }
                }

                // now update the amount and amounttobepaid for each invoice based in isedit and matchflagid
                var invoicedDetailsForTheSelectedCash = invoicesWithMatchFlagId.Where(a => a.MatchFlagId == matchFlag).ToList();
                foreach (var item in result)
                {
                    // update  each invoice details the cash selected with amount and amounttobepaid
                    CashMatchingDto obj = invoicedDetailsForTheSelectedCash.FirstOrDefault(a => a.DocumentReference == item.DocumentReference);
                    if (obj != null)
                    {
                        // cash is in edit mode , so calculate abvailable total amount n update amountobepaid feild for the invoice belong to this cash
                        if (isEdit)
                        {
                            item.Amount = item.Amount + obj.AmountToBePaid;
                            item.AmountToBePaid = obj.AmountToBePaid;
                            item.IsChecked = true;
                        }
                        else
                        {
                            item.AmountToBePaid = 0;
                        }
                    }
                    else
                    {
                        item.AmountToBePaid = 0;
                    }
                }

                return matchableDocuments.Concat(result.Where(a => a.Amount != 0)).OrderBy(d => d.DocumentReference);
            }

            return matchableDocuments.OrderBy(d => d.DocumentReference);
        }

        public async Task<CashMatchingDto> GetFxRateForCash(string currencyCodeFrom, string currencyCodeTo)
        {
            var queryparameters = new DynamicParameters();
            queryparameters.Add("@CurrencyCodeFrom", currencyCodeFrom);
            queryparameters.Add("@CurrencyCodeTo", currencyCodeTo);

            var fxRate = await ExecuteQueryFirstOrDefaultAsync<CashMatchingDto>(StoredProcedureNames.GetFxRateForDocument, queryparameters);
            return fxRate;
        }

        public async Task<IEnumerable<CashDto>> SearchCashPaymentListAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "cashList";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_CashListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var cashResults = await ExecuteDynamicQueryAsync<CashDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return cashResults.ToList();
        }

        public async Task<IEnumerable<CashDto>> SearchCashReceiptListAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "receiptList";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }
            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_CashReceiptListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var cashResults = await ExecuteDynamicQueryAsync<CashDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return cashResults.ToList();
        }


        private static class StoredProcedureNames
        {
            internal const string ListCashbyDirection = "[Invoicing].[usp_ListCashbyDirection]";
            internal const string GetCashSetupDetails = "[Invoicing].[usp_GetDefaultCashSetUp]";
            internal const string ListMatchableDocumentReferences = "[Invoicing].[usp_ListMatchableDocumentReferences]";
            internal const string GetCashbyCashId = "[Invoicing].[usp_GetCashbyCashId]";
            internal const string ListMatchableDocumentsForCashByPicking = "[Invoicing].[usp_ListMatchableDocumentsForCashByPicking]";
            internal const string GetDocumentDetailsByDocumentReference = "[Invoicing].[usp_GetDocumentDetailsByDocumentReference]";
            internal const string GetFxRateForDocument = "[Invoicing].[usp_GetFxRateForDocument]";
        }
    }
}