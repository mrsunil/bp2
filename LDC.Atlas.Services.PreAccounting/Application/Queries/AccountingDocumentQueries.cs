using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.PreAccounting.Application.Commands;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class AccountingDocumentQueries : BaseRepository, IAccountingDocumentQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IUserService _userService;
        private readonly IMasterDataService _masterDataService;
        private readonly IMapper _mapper;
        private readonly IGridService _gridQueries;

        public AccountingDocumentQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IUserService userService,
            IMapper mapper, IGridService gridQueries, IMasterDataService masterDataService)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));

            SqlMapper.SetTypeMap(typeof(PostingSummaryDto), new ColumnAttributeTypeMapper<PostingSummaryDto>());
        }

        public async Task<InvoiceInformationDto> GetInvoiceInformationForAccountingDocument(long documentId, string company)
        {
            var queryParameters = new DynamicParameters();

            InvoiceInformationDto invoiceInformation;

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetInvoiceInformationForAccountingDocument, queryParameters))
            {
                invoiceInformation = (await grid.ReadAsync<InvoiceInformationDto>()).FirstOrDefault();
                invoiceInformation.InvoiceLines = await grid.ReadAsync<InvoiceLinesDto>();
            }

            return invoiceInformation;
        }

        public async Task<IEnumerable<SectionsInformationDto>> GetSectionsInformationForAccountingDocument(string company, long invoiceId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@InvoiceId", invoiceId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            var sectionsInformation = await ExecuteQueryAsync<SectionsInformationDto>(StoredProcedureNames.GetSectionsInformationForAccountingDocument, queryParameters);

            return sectionsInformation;
        }

        public async Task<AccountingSetupDto> GetAccountingSetup(int documentType, string companyId)
        {
            var queryParameters = new DynamicParameters();
            AccountingSetupDto accountingSetup;

            queryParameters.Add("@CompanyId", companyId);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingSetup, queryParameters))
            {
                accountingSetup = (await grid.ReadAsync<AccountingSetupDto>()).FirstOrDefault();
                accountingSetup.NominalCostTypeInfo = await grid.ReadAsync<NominalCostTypeInfoDto>();
            }

            return accountingSetup;
        }

        public async Task<IEnumerable<AccountingSearchResultDto>> SearchAccountingEntriesAsync(string company, AdditionalEntitySearchRequest<bool> searchRequest)
        {
            var grideCode = "accountingEntriesGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            // includeMatchingInformation
            string searchedView = searchRequest.AdditionalParameters ? "[Configuration].[Vw_AccountingEntriesListAndSearch]" : "[Configuration].[Vw_AccountingEntriesListAndSearch_NoDocumentMatchingInformation]";

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                               .FirstOrDefault(permission => permission.CompanyId == company)
                              .Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, searchedView, columnConfiguration, companyDate, dataVersionId, userDepartments);

            var accountingEntriesResults = await ExecuteDynamicQueryAsync<AccountingSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            //2019-05-16 TSA Remove Vw_MonthEndTAEntriesListAndSearch Dataset as no result are retreived from Database. Purpose is to avoid time consuming in querying database with no result set (See Sebastien Guicherd)
            //var buildQueryResultForMonthEnd = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_MonthEndTAEntriesListAndSearch]", columnConfiguration, companyDate, dataVersionId);
            //var accountingEntriesResultsForMonthEnd = await ExecuteDynamicQueryAsync<AccountingSearchResultDto>(buildQueryResultForMonthEnd.Sql, buildQueryResultForMonthEnd.Parameters);
            //var result = accountingEntriesResults.Concat(accountingEntriesResultsForMonthEnd);
            //return result.ToList();
            return accountingEntriesResults.ToList();
        }

        public async Task<IEnumerable<TransactionReportSearchDto>> SearchClientReportAsync(string company, AdditionalEntitySearchRequest<TransactionReportCommand> searchRequest)
        {
            var grideCode = "clientReportTransactionGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TransactionsReportListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var clientReportResults = await ExecuteDynamicQueryAsync<TransactionReportSearchDto>(buildQueryResult.Sql, buildQueryResult.Parameters);
            if (clientReportResults != null && clientReportResults.Any())
            {
                clientReportResults = clientReportResults
                                    .GroupBy(clientReport => new { clientReport.DocumentReference, clientReport.AccountingDocumentLineId, clientReport.PostingLineId, clientReport.MatchFlag })
                                    .Select(group => group.First());
                clientReportResults = clientReportResults.Where(x => x.AccountCategory == AccountingCategory.C.ToString() &&
                (x.AccountingPeriod >= searchRequest.AdditionalParameters.FromDate.Value && x.AccountingPeriod < searchRequest.AdditionalParameters.ToDate.Value.AddMonths(1)));
                if (clientReportResults != null && clientReportResults.Any())
                {
                    if (searchRequest.AdditionalParameters.BalanceType == BalancesType.Debitors)
                    {
                        clientReportResults = clientReportResults.Where(x => x.AccountLineType == AccountLineType.C.ToString());
                    }
                    else if (searchRequest.AdditionalParameters.BalanceType == BalancesType.Creditors)
                    {
                        clientReportResults = clientReportResults.Where(x => x.AccountLineType == AccountLineType.V.ToString());
                    }
                    else if (searchRequest.AdditionalParameters.BalanceType == BalancesType.ToPay)
                    {
                        clientReportResults = clientReportResults.Where(x => x.TransactionalCurrency < 0);
                    }
                    else if (searchRequest.AdditionalParameters.BalanceType == BalancesType.ToReceive)
                    {
                        clientReportResults = clientReportResults.Where(x => x.TransactionalCurrency >= 0);
                    }

                    if (clientReportResults != null && clientReportResults.Any())
                    {
                        if (searchRequest.AdditionalParameters.MatchingType == MatchingsType.Matched)
                        {
                            clientReportResults = clientReportResults.Where(x => !string.IsNullOrWhiteSpace(x.MatchFlag));
                        }
                        else if (searchRequest.AdditionalParameters.MatchingType == MatchingsType.Unmatched)
                        {
                            clientReportResults = clientReportResults.Where(x => string.IsNullOrWhiteSpace(x.MatchFlag));
                            if (clientReportResults != null && clientReportResults.Any())
                            {
                                if (searchRequest.AdditionalParameters.UnmatchedType == UnmatchedType.Now)
                                {
                                    clientReportResults = clientReportResults;
                                }
                                else if (searchRequest.AdditionalParameters.UnmatchedType == UnmatchedType.PeriodStart)
                                {
                                    clientReportResults = clientReportResults.Where(x => x.PaymentMatchDate > searchRequest.AdditionalParameters.FromDate);
                                }
                                else if (searchRequest.AdditionalParameters.UnmatchedType == UnmatchedType.PeriodStart)
                                {
                                    clientReportResults = clientReportResults.Where(x => x.PaymentMatchDate > searchRequest.AdditionalParameters.ToDate);
                                }
                            }
                        }
                    }

                    if (clientReportResults != null && clientReportResults.Any())
                    {
                        if (searchRequest.AdditionalParameters.AccuralsIncluded != true)
                        {
                            clientReportResults = clientReportResults.Where(x => !x.DocumentReference.StartsWith("TA", StringComparison.InvariantCulture));
                        }
                    }
                }
            }

            if (searchRequest.AdditionalParameters.ReportStyleType == ReportStyleType.Summary)
            {
                if (searchRequest.AdditionalParameters.FunctionalCurrency == true)
                {
                    if (clientReportResults != null && clientReportResults.Any())
                    {
                        List<TransactionReportSearchDto> summeryReportSearchDto = new List<TransactionReportSearchDto>();

                        var clinetReport = clientReportResults.GroupBy(x => x.Currency);

                        clinetReport.ToList().ForEach(x =>
                        {
                            var clinetReportData = x.GroupBy(y => y.ClientAccount);

                            clinetReportData.ToList().ForEach(y =>
                            {
                                var clientNominalReport = y.GroupBy(w => w.NominalAccount);

                                clientNominalReport.ToList().ForEach(c =>
                                {
                                    decimal? functionalcurrency = 0;
                                    decimal? statutoryCcyAmount = 0;
                                    decimal? transactionalCurrency = 0;
                                    c.ToList().ForEach(z =>
                                    {
                                        if (z.FunctionalCurrency.HasValue)
                                        {
                                            functionalcurrency = functionalcurrency + z.FunctionalCurrency;
                                        }
                                        if (z.StatutoryCcyAmount.HasValue)
                                        {
                                            statutoryCcyAmount = statutoryCcyAmount + z.StatutoryCcyAmount;
                                        }
                                        if (z.TransactionalCurrency.HasValue)
                                        {
                                            transactionalCurrency = transactionalCurrency + z.TransactionalCurrency;
                                        }
                                    });
                                    c.First().FunctionalCurrency = functionalcurrency;
                                    c.First().TransactionalCurrency = transactionalCurrency;
                                    c.First().StatutoryCcyAmount = statutoryCcyAmount;
                                    summeryReportSearchDto.Add(c.First());
                                });
                            });
                        });
                        clientReportResults = summeryReportSearchDto.OrderBy(x => x.ClientAccount);
                    }
                }
                else
                {
                    if (clientReportResults != null && clientReportResults.Any())
                    {
                        List<TransactionReportSearchDto> summeryReportSearchDto = new List<TransactionReportSearchDto>();

                        var clinetReportData = clientReportResults.GroupBy(x => x.Currency);

                        clinetReportData.ToList().ForEach(x =>
                        {
                            var clientReport = x.GroupBy(y => y.ClientAccount);

                            clientReport.ToList().ForEach(y =>
                            {
                                var clientNominalReport = y.GroupBy(w => w.NominalAccount);

                                clientNominalReport.ToList().ForEach(c =>
                                {
                                    decimal? functionalcurrency = 0;
                                    decimal? statutoryCcyAmount = 0;
                                    decimal? transactionalCurrency = 0;
                                    c.ToList().ForEach(z =>
                                    {
                                        if (z.FunctionalCurrency.HasValue)
                                        {
                                            functionalcurrency = functionalcurrency + z.FunctionalCurrency;
                                        }
                                        if (z.StatutoryCcyAmount.HasValue)
                                        {
                                            statutoryCcyAmount = statutoryCcyAmount + z.StatutoryCcyAmount;
                                        }
                                        if (z.TransactionalCurrency.HasValue)
                                        {
                                            transactionalCurrency = transactionalCurrency + z.TransactionalCurrency;
                                        }
                                    });
                                    c.First().FunctionalCurrency = functionalcurrency;
                                    c.First().TransactionalCurrency = transactionalCurrency;
                                    c.First().StatutoryCcyAmount = statutoryCcyAmount;
                                    summeryReportSearchDto.Add(c.First());
                                });
                            });
                        });
                        clientReportResults = summeryReportSearchDto.OrderBy(x => x.ClientAccount);
                    }
                }
            }

            return clientReportResults.ToList();
        }

        public Task<IEnumerable<PostingSummaryDto>> GetPostingManagementAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            return ExecuteQueryAsync<PostingSummaryDto>(StoredProcedureNames.GetPostingManagementRecord, queryParameters, true);
        }

        public async Task<IEnumerable<PostingSummaryDto>> GetPostingManagementAccountingDocAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "postingRecordsGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords + 1;
            }

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_PostingRecordsListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var postingManagementResults = await ExecuteDynamicQueryAsync<PostingSummaryDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return postingManagementResults.ToList();
        }

        public async Task<AccountingDocumentPostingInformation> GetAccountingDocumentInAuthorizeStateForPostingAsync(long accountinDocumentId, string company)
        {
            var queryParameters = new DynamicParameters();
            List<long> accountingIds = new List<long>();
            accountingIds.Add(accountinDocumentId);
            queryParameters.Add("@accountingIds", ToArrayTVP(accountingIds));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingDocumentInAuthorizeStateForPosting, queryParameters, true))
            {
                var accountingDocument = (await grid.ReadAsync<AccountingDocumentPostingInformation>()).FirstOrDefault();
                if (accountingDocument != null)
                {
                    accountingDocument.FullAccountingDocument = (await grid.ReadAsync<AccountingDocument>()).FirstOrDefault();
                    IEnumerable<AccountingDocumentLine> accountingDocumentLineDto = await grid.ReadAsync<AccountingDocumentLine>();
                    accountingDocument.FullAccountingDocument.AccountingDocumentLines = accountingDocumentLineDto;
                }
                return accountingDocument;
            }
        }

        public async Task<IEnumerable<AccountingDocumentDto>> GetAccountingDocumentsByAccountingIdsAsync(IEnumerable<long> accountingIds, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@accountingIds", ToArrayTVP(accountingIds));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            IEnumerable<AccountingDocumentDto> lstAccountingDocument;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingDocumentByAccountingId, queryParameters, true))
            {
                lstAccountingDocument = (await grid.ReadAsync<AccountingDocumentDto>()).ToList();

                var accountingLines = (await grid.ReadAsync<AccountingDocumentLineDto>()).ToList();

                foreach (AccountingDocumentDto accountingDocument in lstAccountingDocument)
                {
                    accountingDocument.AccountingDocumentLines = accountingLines.Where(document => document.AccountingDocumentId == accountingDocument.AccountingId).OrderByDescending(m => m.PostingLineNumber);
                }
            }

            return lstAccountingDocument;
        }

        public async Task<IEnumerable<AccountingDocumentLineDto>> GetAccoutingDocumentDataListAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "accountingDocByIdGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords + 1;
            }

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_AccountingDocumentByAccountingId]", columnConfiguration, companyDate, dataVersionId);

            var accoutingDocumentDataResults = await ExecuteDynamicQueryAsync<AccountingDocumentLineDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return accoutingDocumentDataResults.ToList();
        }


        public async Task<AccountingDocumentDto> GetAccountingDocumentByDocRefIdsAsync(long docRefId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", docRefId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            AccountingDocumentDto accountingDocument;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingDocumentAllByDocRefId, queryParameters, true))
            {
                accountingDocument = (await grid.ReadAsync<AccountingDocumentDto>()).FirstOrDefault();

                accountingDocument.AccountingDocumentLines = (await grid.ReadAsync<AccountingDocumentLineDto>()).ToList();
            }

            return accountingDocument;
        }

        public async Task<IEnumerable<ReversalAccountingDocumentDto>> GetAccountingLinesAsync(IEnumerable<long> accountingIds, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@accountingIds", ToArrayTVP(accountingIds));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            List<ReversalAccountingDocumentDto> listAccountingDocument = new List<ReversalAccountingDocumentDto>();

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetReversalAccountingLineRecord, queryParameters, true))
            {
                ReversalAccountingDocumentDto accountingDocument;
                accountingDocument = (await grid.ReadAsync<ReversalAccountingDocumentDto>()).FirstOrDefault();
                accountingDocument.AccountingDocumentLines = await grid.ReadAsync<AccountingSearchResultDto>();
                listAccountingDocument.Add(accountingDocument);
            }

            return listAccountingDocument;
        }

        public async Task<IEnumerable<AccountingSearchResultDto>> GetAccountingLinesByAccountIdAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "accountingLineByIdGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords + 1;
            }

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_AccountingLinesByAccountingId]", columnConfiguration, companyDate, dataVersionId);

            var accountingLinesResults = await ExecuteDynamicQueryAsync<AccountingSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return accountingLinesResults.ToList();
        }

        public async Task<IEnumerable<TransactionDetailDto>> GetTransactionDetailAsync(IEnumerable<long> docIds, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@accountingIds", ToArrayTVP(docIds));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            IEnumerable<TransactionDetailDto> lstTransactionDetail;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetTransactionDetailDocumentRecord, queryParameters, true))
            {
                lstTransactionDetail = await grid.ReadAsync<TransactionDetailDto>();
            }

            return lstTransactionDetail;
        }

        public async Task<IEnumerable<ReversalAccountingDocumentDto>> GetAllAccountingIdsAsync(long accountingId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingId", accountingId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            IEnumerable<ReversalAccountingDocumentDto> lstAccountingDetail;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAllAccountingDocumentsByAccountingId, queryParameters, true))
            {
                lstAccountingDetail = await grid.ReadAsync<ReversalAccountingDocumentDto>();
            }

            return lstAccountingDetail;
        }

        private DataTable ToArrayTVP(IEnumerable<long> accountingDocumentLines)
        {
            var table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingId]");

            var transactionDocumentId = new DataColumn("[AccountingId]", typeof(long));
            table.Columns.Add(transactionDocumentId);

            foreach (long value in accountingDocumentLines)
            {
                var row = table.NewRow();
                row[transactionDocumentId] = value;
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<CashInformationDto> GetCashInformationForAccountingDocument(long documentId, string company)
        {
            CashInformationDto cashInformation;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null); // We want the cash information in this context only for the current DB
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCashInformationForAccountingDocument, queryParameters))
            {
                cashInformation = (await grid.ReadAsync<CashInformationDto>()).FirstOrDefault();

                if (cashInformation == null)
                {
                    return null;
                }

                cashInformation.CashLines = await grid.ReadAsync<CashLineDto>();
                cashInformation.AdditionalCosts = await grid.ReadAsync<AdditionalCostsDto>();
                cashInformation.DocumentMatchingsForCashByPicking = await grid.ReadAsync<DocumentMatchingDto>();
                cashInformation.SecondaryReferencesForCashByPicking = await grid.ReadAsync<SecondaryReferenceDto>();
            }

            return cashInformation;
        }

        public async Task<ManualJournalDocumentDto> GetManualJournalbyTransactionDocumentId(long documentId, string company)
        {
            ManualJournalDocumentDto manualJournalDocumentDto;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetManualJournalbyTransactionDocumentId, queryParameters))
            {
                manualJournalDocumentDto = (await grid.ReadAsync<ManualJournalDocumentDto>()).FirstOrDefault();

                if (manualJournalDocumentDto == null)
                {
                    return null;
                }

                manualJournalDocumentDto.ManualJournalLines = await grid.ReadAsync<ManualJournalLineDto>();
            }

            return manualJournalDocumentDto;
        }

        public async Task<FxSettlementDocumentDto> GetFxSettlementbyTransactionDocumentId(long documentId, string company)
        {
            FxSettlementDocumentDto fxSettlementDocumentDto;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetFxDealInformationForAccountingDocument, queryParameters, true))
            {
                fxSettlementDocumentDto = (await grid.ReadAsync<FxSettlementDocumentDto>()).FirstOrDefault();

                if (fxSettlementDocumentDto == null)
                {
                    return null;
                }
                else
                {
                    fxSettlementDocumentDto.DocumentDate = fxSettlementDocumentDto.MaturityDate;
                }
            }

            return fxSettlementDocumentDto;
        }

        public async Task<IEnumerable<AccountingDocument>> GetAccountingDocumentsbyTransactionDocumentId(long documentId, string company)
        {
            IEnumerable<AccountingDocument> accountingDocuments = null;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingDocuemntRecordByDocId, queryParameters, true))
            {
                accountingDocuments = await grid.ReadAsync<AccountingDocument>();

                IEnumerable<AccountingDocumentLine> accountingDocumentLines = await grid.ReadAsync<AccountingDocumentLine>();

                bool isTADocument = accountingDocuments.Any(x => x.TransactionDocumentTypeId == (int)DocumentType.MTA);

                foreach (var accountingDocument in accountingDocuments)
                {
                    if (isTADocument)
                    {
                        accountingDocument.AccountingDocumentLines = accountingDocumentLines.Where(x => x.AccountingDocumentId == accountingDocument.AccountingId);
                    }
                    else
                    {
                        accountingDocument.AccountingDocumentLines = accountingDocumentLines;
                    }
                }
            }

            return accountingDocuments;
        }

        public async Task<bool> GetPostingProcessActiveStatusAsync(string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.GetPostingProcessActiveStatus, queryParameters);
        }

        public async Task<TransactionDocumentDto> GetTransactionDocumentTypeByDocId(long documentId, string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryFirstOrDefaultAsync<TransactionDocumentDto>(StoredProcedureNames.GetTransactionDocumentTypeByDocId, queryParameters);
        }

        public async Task<TransactionDocumentDto> GetJLDocumentTypeByTransactionDocumentId(long documentId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentid", documentId);
            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryFirstOrDefaultAsync<TransactionDocumentDto>(StoredProcedureNames.GetJLTypeByTransactionDocumentId, queryParameters);
        }

        public async Task<CashInformationDto> GetCashInformationForRevaluation(long? transactionDocumentId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            return await ExecuteQueryFirstOrDefaultAsync<CashInformationDto>(StoredProcedureNames.GetCashInformationForRevaluation, queryParameters);
        }

        public async Task<CashForCounterpartyDto> GetCashTypeIdForCounterParty(long documentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentid", documentId);

            return await ExecuteQueryFirstOrDefaultAsync<CashForCounterpartyDto>(StoredProcedureNames.GetCashTypeIdForCounterParty, queryParameters);
        }

        public async Task<IEnumerable<TransactionDocumentSearchResultDto>> SearchTransactionDocumentEntriesAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "transactionDocumentGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                              .FirstOrDefault(permission => permission.CompanyId == company)
                             .Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TransactionDocumentListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var transactionDocumentEntriesResults = await ExecuteDynamicQueryAsync<TransactionDocumentSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return transactionDocumentEntriesResults.ToList();
        }

        public async Task<IEnumerable<DocumentMatchingDto>> GetDocumentToMatchAsync(string company, long counterpartyId, string departmentId,
            string currencyCode, bool bitEdit, long? matchFlag, int? offset, int? limit)
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

        public async Task<IEnumerable<DocumentReferenceSearchResultDto>> SearchDocumentReferenceEntriesAsync(string company, EntitySearchRequest searchRequest, bool isReversalDocument)
        {
            var grideCode = "documentReferenceGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            BuildQueryResult buildQueryResult;

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                             .FirstOrDefault(permission => permission.CompanyId == company)
                            .Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            if (isReversalDocument)
            {
                buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition,
                    "[Configuration].[Vw_DocumentReferenceListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);
            }
            else
            {
                buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition,
                    "[Configuration].[Vw_AllDocumentReferenceListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);
            }

            var documentReferenceEntriesResults = await ExecuteDynamicQueryAsync<DocumentReferenceSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            List<DocumentReferenceSearchResultDto> list = new List<DocumentReferenceSearchResultDto>();
            if (isReversalDocument)
            {
                SortedList<string, DocumentReferenceSearchResultDto> documentReferences = new SortedList<string, DocumentReferenceSearchResultDto>();
                foreach (var item in documentReferenceEntriesResults)
                {
                    if (!documentReferences.ContainsKey(item.DocumentReference))
                    {
                        list.Add(item);
                        documentReferences[item.DocumentReference] = item;
                    }
                }
            }
            else
            {
                list = documentReferenceEntriesResults.ToList();
            }

            return list;
        }

        /// <summary>
        /// Returns the transaction id of a document reversed, by passing either the id of the reversal, 
        /// or the id of the reversed document itself.
        /// </summary>
        /// <param name="transactionDocId">id of the doc to analyse (either the one of the reversal, either the one of the reversed document)</param>
        /// <param name="company">Code of the working company</param>
        /// <returns>ID of the document which is reversed (= the parameter transactionDocId if this is the reversed doc itself,
        /// or another id if documentId is the reversal id).
        /// Returns NULL if the id passed corresponds to neither a reversal nor a reversed document</returns>
        public async Task<long?> GetTransactionDocumentIdByReversalId(long transactionDocId, string company)
        {
            var queryParameters = new DynamicParameters();
            long transactionDocumentId = -1;
            queryParameters.Add("@ReversedOrReversalTransactionDocumentId", transactionDocId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@TransactionDocumentId", 0, DbType.Int64, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GetTransactionDocumentIdByReversalId, queryParameters);
            return queryParameters.Get<long?>("@TransactionDocumentId");
        }

        public async Task<InformationForCreatingCashByPickingRevalDto> GetInfoForCreatingCashByPickingReval(string companyId, long? transactionDocumentId, bool isDifferentClient)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@IsDifferentClient", isDifferentClient);

            return (await ExecuteQueryAsync<InformationForCreatingCashByPickingRevalDto>(
                StoredProcedureNames.GetInfoForCreatingCashByPickingReval, queryParameters)).FirstOrDefault();
        }

        /// <summary>
        /// Called when creating the accounting document of a reval
        /// </summary>
        /// <param name="transactionDocumentId"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public async Task<RevaluationInformationDto> GetRevalInformationForAccountingDocument(long transactionDocumentId, string companyId)
        {
            RevaluationInformationDto revaluationInformation;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", companyId);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetRevaluationInformationForAccountingDocument, queryParameters, true))
            {
                revaluationInformation = (await grid.ReadAsync<RevaluationInformationDto>()).FirstOrDefault();
                if (revaluationInformation == null)
                {
                    return null;
                }

                revaluationInformation.ExistingDocumentMatchingInfo = await grid.ReadAsync<DocumentMatchingDto>();
                revaluationInformation.DocumentMatchingForMatchedDocuments = await grid.ReadAsync<InputInfoLinesForRevaluation>();
            }

            return revaluationInformation;
        }

        public async Task<CounterpartyInformationDto> GetCounterPartyInformationForAccountingDocument(long documentId, string company)
        {
            CounterpartyInformationDto counterpartyInformation;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@ContextInformation", null);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCounterPartyInformationForAccountingDocument, queryParameters))
            {
                counterpartyInformation = (await grid.ReadAsync<CounterpartyInformationDto>()).FirstOrDefault();
                if (counterpartyInformation == null)
                {
                    return null;
                }

                counterpartyInformation.ManualDocumentMatching = await grid.ReadAsync<ManualDocumentMatchingDto>();
            }

            return counterpartyInformation;
        }

        public async Task DeleteMatchFlag(long matchFlagId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("MatchFlagId", matchFlagId);
            queryParameters.Add("CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);
            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteMatchFlag, queryParameters, true);
        }

        public async Task<MonthEndTADocumentDto> GetMonthEndTAbyTransactionDocumentId(string company, long documentId)
        {
            MonthEndTADocumentDto monthEndTADocumentDto;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@TransactionDocumentId", documentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetMonthEndTAByTransactionDocumentId, queryParameters))
            {
                monthEndTADocumentDto = (await grid.ReadAsync<MonthEndTADocumentDto>()).FirstOrDefault();

                if (monthEndTADocumentDto == null)
                {
                    return null;
                }

                monthEndTADocumentDto.MonthEndTALines = await grid.ReadAsync<MonthEndTALineDto>();
            }

            return monthEndTADocumentDto;
        }

        public async Task<IEnumerable<TransactionReportSearchDto>> SearchNominalReportAsync(string company, AdditionalEntitySearchRequest<TransactionReportCommand> searchRequest)
        {
            var grideCode = "nominalReportTransactionGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }


            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TransactionsReportListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var nominalReportResults = await ExecuteDynamicQueryAsync<TransactionReportSearchDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            if (nominalReportResults != null && nominalReportResults.Any())
            {
                nominalReportResults = nominalReportResults
                                     .GroupBy(nominalReport => new
                                     {
                                         nominalReport.DocumentReference,
                                         nominalReport.AccountingDocumentLineId,
                                         nominalReport.PostingLineId,
                                         nominalReport.MatchFlag
                                     })
                                     .Select(group => group.First());

                //check Toggle BroughtForward
                if (searchRequest.AdditionalParameters.BroughtForward)
                {
                    int accountingPeriodYear = searchRequest.AdditionalParameters.ToDate.Value.Date.Year;
                    int previousYear = accountingPeriodYear - 1;
                    int fromMonth = searchRequest.AdditionalParameters.FromDate.Value.Date.Month - 1;
                    int toMonth = searchRequest.AdditionalParameters.ToDate.Value.Date.Month;
                    string fromMonthName = new DateTime(accountingPeriodYear, fromMonth, 1).ToString("MMM", CultureInfo.InvariantCulture);
                    int maxDays = DateTime.DaysInMonth(accountingPeriodYear, fromMonth);

                    //Check Year End process
                    YearEndProcessExistance yearEndProcessExist = await CheckYearEndProcessExistence(company, previousYear);

                    //get Default PlClearanceYepAccount value for a given company
                    var defaultAccounting = await GetDefaultAccountingSetup(company);

                    List<TransactionReportSearchDto> finalResult = new List<TransactionReportSearchDto>();
                    var result = nominalReportResults;

                    //Scenario 1 BroughtForward checked and Yep not run 

                    if (!yearEndProcessExist.Exists)
                    {
                        var pnlData = (from c in result.Where(x => x.AccType == "P")
                                       where c.AccountingPeriod >= new DateTime(previousYear, 1, 1) &&
                                             c.AccountingPeriod <= new DateTime(previousYear, 12, 31)
                                       select
                                        new TransactionReportSearchDto
                                        {
                                            StatutoryCcyAmount = c.StatutoryCcyAmount,
                                            FunctionalCurrency = c.FunctionalCurrency,
                                            TransactionalCurrency = c.TransactionalCurrency,
                                        }).ToList();

                        if (pnlData != null && pnlData.Count > 0)
                        {
                            TransactionReportSearchDto pnlPreviousYearData = new TransactionReportSearchDto();
                            pnlPreviousYearData.AccountType = "PNLData";
                            pnlPreviousYearData.NominalAccount = defaultAccounting.PlClearanceYepAccount;
                            pnlPreviousYearData.StatutoryCcyAmount = pnlData.Sum(x => x.StatutoryCcyAmount);
                            pnlPreviousYearData.TransactionalCurrency = pnlData.Sum(x => x.TransactionalCurrency);
                            pnlPreviousYearData.FunctionalCurrency = pnlData.Sum(x => x.FunctionalCurrency);
                            pnlPreviousYearData.Narrative = "Balance as of " + previousYear;

                            finalResult.Add(pnlPreviousYearData);
                        }

                        var balanceSheetPreviousYearData = result.Where(x => x.AccType == "A" || x.AccType == "L")
                                   .Where(x => x.AccountingPeriod >= new DateTime(previousYear, 1, 1) &&
                                   x.AccountingPeriod <= new DateTime(previousYear, 12, 31))
                                   .GroupBy(x => x.NominalAccount)
                                   .Select(g =>
                                    new TransactionReportSearchDto
                                    {
                                        NominalAccount = g.FirstOrDefault().NominalAccount,
                                        AccountType = "BalanceSheet",
                                        StatutoryCcyAmount = g.Sum(x => x.StatutoryCcyAmount),
                                        FunctionalCurrency = g.Sum(x => x.FunctionalCurrency),
                                        TransactionalCurrency = g.Sum(x => x.TransactionalCurrency),
                                        Narrative = "Balance as of " + previousYear
                                    });

                        if (balanceSheetPreviousYearData.Count() > 0)
                        {
                            finalResult.AddRange(balanceSheetPreviousYearData);
                        }
                    }

                    //Scenario 2 BroughtForward checked and Yep run 

                    if (searchRequest.AdditionalParameters.FromDate.Value.Date.Year == accountingPeriodYear && fromMonth > 0)
                    {
                        var accountingPeriodYeardata = result
                         .Where(x => x.AccountingPeriod >= new DateTime(accountingPeriodYear, 1, 1) &&
                         x.AccountingPeriod <= new DateTime(accountingPeriodYear, fromMonth, maxDays))
                                .GroupBy(x => x.NominalAccount)
                                .Select(g =>
                                 new TransactionReportSearchDto
                                 {
                                     NominalAccount = g.FirstOrDefault().NominalAccount,
                                     StatutoryCcyAmount = g.Sum(x => x.StatutoryCcyAmount),
                                     FunctionalCurrency = g.Sum(x => x.FunctionalCurrency),
                                     TransactionalCurrency = g.Sum(x => x.TransactionalCurrency),
                                     Narrative = "Balance as of " + fromMonthName + " " + accountingPeriodYear
                                 });

                        if (accountingPeriodYeardata.Count() > 0)
                        {
                            finalResult.AddRange(accountingPeriodYeardata);
                        }

                        var accountingPeriodData = result.Where(x =>
                            (x.AccountingPeriod >= new DateTime(accountingPeriodYear, fromMonth + 1, 1) && x.AccountingPeriod < searchRequest.AdditionalParameters.ToDate.Value.AddMonths(1)) &&
                            (x.DocumentDate >= searchRequest.AdditionalParameters.DocumentFromDate && x.DocumentDate <= searchRequest.AdditionalParameters.DocumentToDate));

                        if (accountingPeriodData != null && accountingPeriodData.Any())
                        {
                            if (searchRequest.AdditionalParameters.AccountType == NominalAccountType.BS)
                            {
                                accountingPeriodData = accountingPeriodData.Where(x => x.AccType != "P");
                            }
                            else if (searchRequest.AdditionalParameters.AccountType == NominalAccountType.PandL)
                            {
                                accountingPeriodData = accountingPeriodData.Where(x => x.AccType == "P");
                            }
                        }
                        if (accountingPeriodData.Count() > 0)
                        {
                            finalResult.AddRange(accountingPeriodData);
                        }

                        nominalReportResults = finalResult;
                    }
                    else
                    {
                        var accountingPeriodData1 = result.Where(x =>
                    (x.AccountingPeriod >= new DateTime(accountingPeriodYear, 1, 1) && x.AccountingPeriod < searchRequest.AdditionalParameters.ToDate.Value.AddMonths(1)) &&
                    (x.DocumentDate >= searchRequest.AdditionalParameters.DocumentFromDate && x.DocumentDate <= searchRequest.AdditionalParameters.DocumentToDate));

                        if (accountingPeriodData1 != null && accountingPeriodData1.Any())
                        {
                            if (searchRequest.AdditionalParameters.AccountType == NominalAccountType.BS)
                            {
                                accountingPeriodData1 = accountingPeriodData1.Where(x => x.AccType != "P");
                            }
                            else if (searchRequest.AdditionalParameters.AccountType == NominalAccountType.PandL)
                            {
                                accountingPeriodData1 = accountingPeriodData1.Where(x => x.AccType == "P");
                            }
                        }
                        if (accountingPeriodData1.Count() > 0)
                        {
                            finalResult.AddRange(accountingPeriodData1);
                        }

                        nominalReportResults = finalResult;
                    }
                }

                //Scenario 2 BroughtForward unchecked 
                else
                {
                    nominalReportResults = nominalReportResults.Where(x =>
                                (x.AccountingPeriod >= searchRequest.AdditionalParameters.FromDate.Value &&
                                x.AccountingPeriod < searchRequest.AdditionalParameters.ToDate.Value.AddMonths(1)) &&
                                (x.DocumentDate >= searchRequest.AdditionalParameters.DocumentFromDate &&
                                x.DocumentDate <= searchRequest.AdditionalParameters.DocumentToDate));

                    if (nominalReportResults != null && nominalReportResults.Any())
                    {
                        if (searchRequest.AdditionalParameters.AccountType == NominalAccountType.BS)
                        {
                            nominalReportResults = nominalReportResults.Where(x => x.AccType != "P");
                        }
                        else if (searchRequest.AdditionalParameters.AccountType == NominalAccountType.PandL)
                        {
                            nominalReportResults = nominalReportResults.Where(x => x.AccType == "P");
                        }
                    }
                }
            }

            if (searchRequest.AdditionalParameters.ReportStyleType == ReportStyleType.Summary)
            {
                if (searchRequest.AdditionalParameters.FunctionalCurrency == true)
                {
                    if (nominalReportResults != null && nominalReportResults.Any())
                    {
                        List<TransactionReportSearchDto> summeryReportSearchDto = new List<TransactionReportSearchDto>();

                        var nominalReport = nominalReportResults.GroupBy(x => x.NominalAccount);

                        nominalReport.ToList().ForEach(x =>
                        {
                            decimal? functionalcurrency = 0;
                            x.ToList().ForEach(y =>
                            {
                                if (y.FunctionalCurrency.HasValue)
                                {
                                    functionalcurrency = functionalcurrency + y.FunctionalCurrency;
                                }
                            });
                            x.First().FunctionalCurrency = functionalcurrency;
                            summeryReportSearchDto.Add(x.First());
                        });

                        nominalReportResults = summeryReportSearchDto.OrderBy(x => x.NominalAccount);
                    }
                }
                else
                {
                    if (nominalReportResults != null && nominalReportResults.Any())
                    {
                        List<TransactionReportSearchDto> summeryReportSearchDto = new List<TransactionReportSearchDto>();

                        var nominalReportData = nominalReportResults.GroupBy(x => x.Currency);

                        nominalReportData.ToList().ForEach(x =>
                        {
                            var nominalReport = x.GroupBy(y => y.NominalAccount);

                            nominalReport.ToList().ForEach(c =>
                            {
                                decimal? functionalcurrency = 0;
                                decimal? statutoryCcyAmount = 0;
                                decimal? transactionalCurrency = 0;
                                c.ToList().ForEach(z =>
                                {
                                    if (z.FunctionalCurrency.HasValue)
                                    {
                                        functionalcurrency = functionalcurrency + z.FunctionalCurrency;
                                    }
                                    if (z.StatutoryCcyAmount.HasValue)
                                    {
                                        statutoryCcyAmount = statutoryCcyAmount + z.StatutoryCcyAmount;
                                    }
                                    if (z.TransactionalCurrency.HasValue)
                                    {
                                        transactionalCurrency = transactionalCurrency + z.TransactionalCurrency;
                                    }
                                });
                                c.First().FunctionalCurrency = functionalcurrency;
                                c.First().TransactionalCurrency = transactionalCurrency;
                                c.First().StatutoryCcyAmount = statutoryCcyAmount;
                                summeryReportSearchDto.Add(c.First());
                            });
                        });
                        nominalReportResults = summeryReportSearchDto.OrderBy(x => x.NominalAccount);
                    }
                }
            }

            return nominalReportResults.ToList();
        }


        public async Task<YearEndProcessExistance> CheckYearEndProcessExistence(string company, int year)
        {
            YearEndProcessExistance returnValue = new YearEndProcessExistance();

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Year", year);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Exists", false, DbType.Boolean, ParameterDirection.Output);
            queryParameters.Add("@IsLocked", false, DbType.Boolean, ParameterDirection.Output);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckYearEndProcessExist, queryParameters, true);

            returnValue.Exists = queryParameters.Get<bool>("@Exists");
            returnValue.IsLocked = queryParameters.Get<bool>("@IsLocked");

            return returnValue;
        }

        public async Task<DefaultAccountingSetupDto> GetDefaultAccountingSetup(string company)
        {
            var queryParameters = new DynamicParameters();
            DefaultAccountingSetupDto defaultAccountingSetup;

            queryParameters.Add("@CompanyId", company);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetDefaultAccountingSetup, queryParameters))
            {
                defaultAccountingSetup = (await grid.ReadAsync<DefaultAccountingSetupDto>()).FirstOrDefault();
            }

            return defaultAccountingSetup;
        }

        public async Task<IEnumerable<AccountingDocument>> GetAccountingDocumentInHeldAndMappingErrorState(string company)
        {
            IEnumerable<AccountingDocument> accountingDocuments;

            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingDocumentInHeldAndMappingErrorState, queryParameters))
            {
                accountingDocuments = await grid.ReadAsync<AccountingDocument>();

                IEnumerable<AccountingDocumentLine> accountingDocumentLineDto = await grid.ReadAsync<AccountingDocumentLine>();

                foreach (AccountingDocument accountingDocument in accountingDocuments)
                {
                    accountingDocument.AccountingDocumentLines = accountingDocumentLineDto.Where(x => x.AccountingDocumentId == accountingDocument.AccountingId);
                }
            }

            return accountingDocuments;
        }

        private DataTable ToArrayTVP(IEnumerable<AccountingDocumentLine> accountingDocumentLines)
        {
            var table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingLines]");

            var accountingDocumentLineId = new DataColumn("[AccountingDocumentLineId]", typeof(long));
            table.Columns.Add(accountingDocumentLineId);

            var journalLineId = new DataColumn("[JournalLineId]", typeof(long));
            table.Columns.Add(journalLineId);

            var dataVersionId = new DataColumn("[DataVersionId]", typeof(int));
            table.Columns.Add(dataVersionId);

            var associatedAccountCode = new DataColumn("[AssociatedAccountCode]", typeof(string));
            table.Columns.Add(associatedAccountCode);

            var paymentTermCode = new DataColumn("[PaymentTermCode]", typeof(string));
            table.Columns.Add(paymentTermCode);

            var physicalContractCode = new DataColumn("[PhysicalContractCode]", typeof(string));
            table.Columns.Add(physicalContractCode);

            var contractSectionCode = new DataColumn("[ContractSectionCode]", typeof(string));
            table.Columns.Add(contractSectionCode);

            var postingLineId = new DataColumn("[PostingLineId]", typeof(long));
            table.Columns.Add(postingLineId);

            var quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);

            var vatTurnover = new DataColumn("[VATTurnover]", typeof(decimal));
            table.Columns.Add(vatTurnover);

            var accountReference = new DataColumn("[AccountReference]", typeof(string));
            table.Columns.Add(accountReference);

            var commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);

            var vatCode = new DataColumn("[VATCode]", typeof(string));
            table.Columns.Add(vatCode);

            var clientReference = new DataColumn("[ClientReference]", typeof(string));
            table.Columns.Add(clientReference);

            var accountLineType = new DataColumn("[AccountLineTypeId]", typeof(int));
            table.Columns.Add(accountLineType);

            var charterId = new DataColumn("[CharterId]", typeof(long));
            table.Columns.Add(charterId);

            var costTypeCode = new DataColumn("[CostTypeCode]", typeof(string));
            table.Columns.Add(costTypeCode);

            var amount = new DataColumn("[Amount]", typeof(decimal));
            table.Columns.Add(amount);

            var departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);

            var narrative = new DataColumn("[Narrative]", typeof(string));
            table.Columns.Add(narrative);

            var funtionalCurrency = new DataColumn("[FunctionalCurrency]", typeof(decimal));
            table.Columns.Add(funtionalCurrency);

            var statutoryCurrency = new DataColumn("[StatutoryCurrency]", typeof(decimal));
            table.Columns.Add(statutoryCurrency);

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var accountCategory = new DataColumn("[AccountCategoryId]", typeof(int));
            table.Columns.Add(accountCategory);

            var secondaryDocumentReference = new DataColumn("[SecondaryDocumentReference]", typeof(string));
            table.Columns.Add(secondaryDocumentReference);

            var costCenter = new DataColumn("[CostCenter]", typeof(string));
            table.Columns.Add(costCenter);

            var accrualNumber = new DataColumn("[AccrualNumber]", typeof(int));
            table.Columns.Add(accrualNumber);

            var accountReferenceId = new DataColumn("[AccountReferenceId]", typeof(long));
            table.Columns.Add(accountReferenceId);

            var clientAccountId = new DataColumn("[ClientAccountId]", typeof(long));
            table.Columns.Add(clientAccountId);

            var associatedAccountId = new DataColumn("[AssociatedAccountId]", typeof(long));
            table.Columns.Add(associatedAccountId);

            var costTypeId = new DataColumn("[CostTypeId]", typeof(long));
            table.Columns.Add(costTypeId);

            var paymentTermId = new DataColumn("[PaymentTermId]", typeof(long));
            table.Columns.Add(paymentTermId);

            var vatId = new DataColumn("[VatId]", typeof(long));
            table.Columns.Add(vatId);

            var clientAccount = new DataColumn("[ClientAccount]", typeof(string));
            table.Columns.Add(clientAccount);

            var dealNumber = new DataColumn("[DealNumber]", typeof(string));
            table.Columns.Add(dealNumber);

            var settlementCurrency = new DataColumn("[SettlementCurrency]", typeof(string));
            table.Columns.Add(settlementCurrency);

            var provinceId = new DataColumn("[ProvinceId]", typeof(int));
            table.Columns.Add(provinceId);

            foreach (AccountingDocumentLine value in accountingDocumentLines)
            {
                if (value != null)
                {
                    var row = table.NewRow();
                    row[associatedAccountCode] = value.AssociatedAccountCode;
                    row[journalLineId] = value.JournalLineId != null ? value.JournalLineId : (object)DBNull.Value;
                    row[paymentTermCode] = value.PaymentTermCode;
                    row[physicalContractCode] = value.PhysicalContractCode;
                    row[contractSectionCode] = value.ContractSectionCode;
                    row[postingLineId] = value.PostingLineId;
                    row[quantity] = value.Quantity != null ? value.Quantity : (object)DBNull.Value;
                    row[vatTurnover] = value.VATTurnover.HasValue ? value.VATTurnover : (object)DBNull.Value;
                    row[accountReference] = value.AccountReference;
                    row[commodityId] = value.CommodityId != null ? value.CommodityId : (object)DBNull.Value;
                    row[vatCode] = value.VATCode;
                    row[clientReference] = value.ClientReference;
                    row[narrative] = value.Narrative;
                    row[accountLineType] = value.AccountLineTypeId;
                    row[charterId] = value.CharterId.HasValue ? value.CharterId : (object)DBNull.Value;
                    row[costTypeCode] = value.CostTypeCode;
                    row[departmentId] = value.DepartmentId != null ? value.DepartmentId : (object)DBNull.Value;
                    row[amount] = value.Amount;
                    row[funtionalCurrency] = value.FunctionalCurrency;
                    row[statutoryCurrency] = value.StatutoryCurrency;
                    row[sectionId] = value.SectionId.HasValue ? value.SectionId : (object)DBNull.Value;
                    row[accountCategory] = value.AccountingCategoryId;
                    row[secondaryDocumentReference] = value.SecondaryDocumentReference;
                    row[costCenter] = value.CostCenter;
                    row[accrualNumber] = value.AccrualNumber != null ? value.AccrualNumber : (object)DBNull.Value;
                    row[accountReferenceId] = value.AccountReferenceId != null ? value.AccountReferenceId : (object)DBNull.Value;
                    row[clientAccountId] = value.ClientAccountId != null ? value.ClientAccountId : (object)DBNull.Value;
                    row[associatedAccountId] = value.AssociatedAccountId != null ? value.AssociatedAccountId : (object)DBNull.Value;
                    row[costTypeId] = value.CostTypeId != null ? value.CostTypeId : (object)DBNull.Value;
                    row[paymentTermId] = value.PaymentTermId != null ? value.PaymentTermId : (object)DBNull.Value;
                    row[vatId] = value.VatId != null ? value.VatId : (object)DBNull.Value;
                    row[clientAccount] = value.ClientAccount;
                    row[dataVersionId] = DBNull.Value;
                    row[accountingDocumentLineId] = value.AccountingDocumentLineId != null ? value.AccountingDocumentLineId : (object)DBNull.Value;
                    row[dealNumber] = value.DealNumber;
                    row[settlementCurrency] = value.SettlementCurrency;
                    row[provinceId] = value.ProvinceId != null ? value.ProvinceId : (object)DBNull.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task<MappingErrorMessages> GetMapppingErrorAsync(IEnumerable<AccountingDocumentLine> accountingDocumenLine, string company, long transactionDocumentTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingLines", ConvertAccountingDocumentLinesIntoDataTable(accountingDocumenLine));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add(DataVersionIdParameter, null);
            var response = await ExecuteQueryFirstOrDefaultAsync<MappingErrorMessages>(StoredProcedureNames.GetMappingError, queryParameters);
            return response;
        }

        /// <summary>
        /// Get cost type and account reference based on the business sector code
        /// </summary>
        /// <param name="company"> The company Code</param>
        /// <param name="sectorCode"> The business sector code</param>
        public async Task<BusinessSectorDto> GetAccountNumberbyBusinessSectorId(string company, string sectorCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectorCode", sectorCode);
            BusinessSectorDto businessSectorFields = await ExecuteQueryFirstOrDefaultAsync<BusinessSectorDto>(StoredProcedureNames.GetAccountNumberbyBusinessSectorId, queryParameters);
            return businessSectorFields;
        }

        /// <summary>
        /// Generates the datatable representing AccountingDocumentLines to be passed as UDTT as parameter to a SP
        /// </summary>
        /// <param name="accountingDocumentLines">Lines to send as UDTT to the SP</param>
        /// <returns>The generated data table</returns>
        internal static DataTable ConvertAccountingDocumentLinesIntoDataTable(IEnumerable<AccountingDocumentLine> accountingDocumentLines)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingLineMappingError]");

            DataColumn accountingDocumentLineId = new DataColumn("[AccountingDocumentLineId]", typeof(long));
            table.Columns.Add(accountingDocumentLineId);

            DataColumn accountReference = new DataColumn("[AccountReference]", typeof(string));
            table.Columns.Add(accountReference);

            DataColumn vatCode = new DataColumn("[VATCode]", typeof(string));
            table.Columns.Add(vatCode);

            DataColumn departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);

            DataColumn clientAccountId = new DataColumn("[ClientAccountId]", typeof(long));
            table.Columns.Add(clientAccountId);

            DataColumn costTypeCode = new DataColumn("[CostTypeCode]", typeof(string));
            table.Columns.Add(costTypeCode);

            DataColumn clientAccountCode = new DataColumn("[ClientAccount]", typeof(string));
            table.Columns.Add(clientAccountCode);

            DataColumn associatedAccountCode = new DataColumn("[AssociatedAccountCode]", typeof(string));
            table.Columns.Add(associatedAccountCode);

            DataColumn associatedAccountId = new DataColumn("[AssociatedAccountId]", typeof(long));
            table.Columns.Add(associatedAccountId);

            foreach (AccountingDocumentLine value in accountingDocumentLines)
            {
                if (value != null)
                {
                    DataRow row = table.NewRow();
                    row[accountReference] = value.AccountReference;
                    row[vatCode] = value.VATCode;
                    row[departmentId] = value.DepartmentId != null ? value.DepartmentId : (object)DBNull.Value;
                    row[clientAccountId] = value.ClientAccountId != null ? value.ClientAccountId : (object)DBNull.Value;
                    row[costTypeCode] = value.CostTypeCode;
                    row[clientAccountCode] = value.ClientAccount;
                    row[associatedAccountCode] = value.AssociatedAccountCode;
                    row[associatedAccountId] = value.AssociatedAccountId ?? (object)DBNull.Value;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        /// <summary>
        /// Update process status to reset retry value
        /// </summary>
        /// <param name="messageId"> The messageId</param>
        public async Task UpdateProcessStatus(long messageId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@MessageId", messageId);
            await ExecuteQueryAsync<ProcessMessageDto>(StoredProcedureNames.UpdateProcessStatus, queryParameters);
        }

        /// <summary>
        /// Get error message according to filter parameters
        /// </summary>
        /// <param name="company"> The company Code</param>
        /// <param name="statusList"> The list of status we want to select</param>
        /// <param name="processNameList"> The list of processName we want to select</param>
        /// <param name="dateBegin"> The date of begining for the filter</param>
        /// <param name="dateEnd"> The date of ending for the filter</param>
        /// <param name="userName"> The user we want to select</param>
        public async Task<IEnumerable<ProcessMessageDto>> GetErrorMessages(string company, IEnumerable<int> statusList, IEnumerable<string> processNameList, System.DateTime? dateBegin, System.DateTime? dateEnd, string userName)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@StatusList", ToArrayStatus(statusList));
            queryParameters.Add("@ProcessNameList", ToArrayProcess(processNameList));
            queryParameters.Add("@DateBegin", dateBegin);
            queryParameters.Add("@DateEnd", dateEnd);
            queryParameters.Add("@UserName", userName);
            var errorMessagesTable = await ExecuteQueryAsync<ProcessMessageDto>(StoredProcedureNames.GetErrorMessages, queryParameters);
            return errorMessagesTable;
        }

        private DataTable ToArrayStatus(IEnumerable<int> statusLines)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var statusLineId = new DataColumn("[Id]", typeof(long));
            table.Columns.Add(statusLineId);

            foreach (int value in statusLines)
            {
                var row = table.NewRow();
                row[statusLineId] = value;
                table.Rows.Add(row);
            }

            return table;
        }

        private DataTable ToArrayProcess(IEnumerable<string> processLines)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_VarcharList]");

            var processLineId = new DataColumn("[Name]", typeof(string));
            table.Columns.Add(processLineId);

            foreach (string value in processLines)
            {
                var row = table.NewRow();
                row[processLineId] = value;
                table.Rows.Add(row);
            }

            return table;
        }
        public async Task<IEnumerable<SectionSearchResult>> SearchSectionsAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "tradeList";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                             .FirstOrDefault(permission => permission.CompanyId == company)
                            .Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TradeListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var tradeResults = await ExecuteDynamicQueryAsync<SectionSearchResult>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return tradeResults.ToList();
        }

        public async Task<IEnumerable<FxDealSearchResult>> SearchFxDealsAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "fxDealList";

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

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_FxDealsListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var fxDealResults = await ExecuteDynamicQueryAsync<FxDealSearchResult>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return fxDealResults.ToList();
        }

        /// <summary>
        /// Get Manual Journal Field Configuration
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        public async Task<IEnumerable<ItemConfigurationPropertiesDto>> GetPreAccountingFieldsConfiguration(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var mandatoryFieldsResults = await ExecuteQueryAsync<ItemConfigurationPropertiesDto>(StoredProcedureNames.GetPreAccountingFieldsConfiguration, queryParameters);
            return mandatoryFieldsResults.ToList();
        }

        internal static class StoredProcedureNames
        {
            internal const string GetSectionsInformationForAccountingDocument = "[PreAccounting].[usp_GetSectionsInformationForAccountingDocument]";
            internal const string GetAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
            internal const string GetInvoiceInformationForAccountingDocument = "[PreAccounting].[usp_GetInvoiceInformationForAccountingDocument]";
            internal const string GetPostingManagementRecord = "[PreAccounting].[usp_GetPostingRecords]";
            internal const string GetAccountingDocumentByAccountingId = "[PreAccounting].[usp_GetAccountingDocumentByAccountingId]";
            internal const string GetTransactionDocumentTypeByDocId = "[PreAccounting].[usp_GetTransactionDocumentTypeByTransactionDocumentId]";
            internal const string GetCashInformationForAccountingDocument = "[PreAccounting].[usp_GetCashInformationByTransactionDocumentId]";
            internal const string GetAccountingDocumentInAuthorizeStateForPosting = "[PreAccounting].[usp_GetAccountingDocumentInAuthorizeStateForPosting]";
            internal const string GetPostingProcessActiveStatus = "[Process].[usp_GetPostingProcessActiveStatus]";
            internal const string GetManualJournalbyTransactionDocumentId = "[PreAccounting].[usp_GetManualJournalbyTransactionDocumentId]";
            internal const string ListDocumentsForManualMatching = "[Invoicing].[usp_ListDocumentsForManualMatching]";
            internal const string GetReversalAccountingLineRecord = "[PreAccounting].[usp_GetAccountingLinesByAccountingId]";
            internal const string GetAccountingDocuemntRecordByDocId = "[PreAccounting].[usp_GetAccountingDocumentByDocId]";
            internal const string GetTransactionDetailDocumentRecord = "[PreAccounting].[usp_GetAccountingDocumentTransactionDetailbyAccountingId]";
            internal const string GetAllAccountingDocumentsByAccountingId = "[PreAccounting].[usp_GetAllAccountingDocumentByAccountingId]";
            internal const string GetTransactionDocumentIdByReversalId = "[PreAccounting].[usp_GetTransactionDocumentIdByReversalId]";
            internal const string GetRevaluationInformationForAccountingDocument = "[PreAccounting].[usp_GetRevaluationInformationForAccountingDocument]";
            internal const string GetMonthEndTAByTransactionDocumentId = "[PreAccounting].[usp_GetMonthEndTemporaryAdjustmentByTransactionDocumentId]";
            internal const string GetInfoForCreatingCashByPickingReval = "[PreAccounting].[usp_GetInfoForCreatingCashByPickingReval]";
            internal const string DeleteMatchFlag = "[Invoicing].[usp_DeleteMatchFlag]";
            internal const string GetJLTypeByTransactionDocumentId = "[PreAccounting].[usp_GetJLTypeByTransactionDocumentId]";
            internal const string GetCounterPartyInformationForAccountingDocument = "[PreAccounting].[usp_GetCounterPartyInformationForAccountingDocument]";
            internal const string GetCashTypeIdForCounterParty = "[PreAccounting].[usp_GetCashbyTransactionDocumentIdForCounterparty]";
            internal const string GetAccountingDocumentInHeldAndMappingErrorState = "[PreAccounting].[usp_GetAccountingDocumentInHeldAndMappingErrorState]";
            internal const string GetMappingError = "[PreAccounting].[usp_GetMappingError]";
            internal const string GetAccountingDocumentAllByDocRefId = "[PreAccounting].[usp_GetAccountingDocumentByTransactionDocId]";
            internal const string GetCashInformationForRevaluation = "[PreAccounting].[usp_GetCashInformationForRevaluation]";
            internal const string GetAccountNumberbyBusinessSectorId = "[PreAccounting].[usp_GetAccountNumberbyBusinessSectorId]";
            internal const string GetErrorMessages = "[PreAccounting].[usp_GetErrorMessages]";
            internal const string GetFxDealInformationForAccountingDocument = "[PreAccounting].[usp_GetFxDealInformationForAccountingDocument]";
            internal const string UpdateProcessStatus = "[MasterData].[usp_UpdateProcessStatus]";
            internal const string GetPreAccountinFieldsConfiguration = "[PreAccounting].[usp_GetFieldsConfigurationAccountingEntries]";
            internal const string CheckYearEndProcessExist = "[Invoicing].[usp_CheckYearEndProcessExistence]";
            internal const string GetDefaultAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
            internal const string GetPreAccountingFieldsConfiguration = "[PreAccounting].[usp_GetFieldsConfigurationAccountingEntries]";

        }
    }
}
