using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class InvoiceQueries : BaseRepository, IInvoiceQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IGridService _gridQueries;

        public InvoiceQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper, IUserService userService, IGridService gridQueries)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));

            SqlMapper.SetTypeMap(
                typeof(InvoiceDetailsDto),
                new ColumnAttributeTypeMapper<InvoiceDetailsDto>());
            SqlMapper.SetTypeMap(
                typeof(ContractToBeInvoicedSearchResultDto),
                new ColumnAttributeTypeMapper<ContractToBeInvoicedSearchResultDto>());
            SqlMapper.SetTypeMap(
                typeof(InvoiceHomeSearch),
                new ColumnAttributeTypeMapper<InvoiceHomeSearch>());
        }

        public async Task<IEnumerable<UnpaidInvoiceDto>> GetUnpaidInvoicesAsync(string searchCriteria, string company, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@searchCriteria", searchCriteria);
            queryParameters.Add("@company", company);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var invoices = await ExecuteQueryAsync<UnpaidInvoiceDto>(StoredProcedureNames.GetUnpaidInvoices, queryParameters);

            return invoices;
        }

        public async Task<IEnumerable<ContractsToInvoiceDto>> GetContractsToInvoiceAsync(string company, int invoiceType, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@InvoiceType", invoiceType);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);

            var contracts = await ExecuteQueryAsync<ContractsToInvoiceDto>(StoredProcedureNames.GetContractsToInvoice, queryParameters);

            return contracts;
        }

        public async Task<IEnumerable<ContractsToInvoiceDto>> SearchContractToPurchaseInvoiceAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "invoicePurcGoodsSelectionGrid";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                               .FirstOrDefault(permission => permission.CompanyId == company)
                              .Departments.Select(department => department.DepartmentId).ToList();

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_PurchaseGoodsContractsListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var contractsResults = await ExecuteDynamicQueryAsync<ContractsToInvoiceDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return contractsResults.ToList();
        }

        public async Task<IEnumerable<ContractsToInvoiceDto>> SearchContractToSaleInvoiceAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "invoiceSaleGoodsSelectionGrid";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                               .FirstOrDefault(permission => permission.CompanyId == company)
                              .Departments.Select(department => department.DepartmentId).ToList();

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_SaleGoodsContractsListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var contractsResults = await ExecuteDynamicQueryAsync<ContractsToInvoiceDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return contractsResults.ToList();
        }

        public async Task<InvoiceDto> GetInvoiceByIdAsync(string company, long id)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@Company", company);
            queryParameters.Add("@InvoiceId", id);

            InvoiceDto result;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetInvoiceById, queryParameters))
            {
                result = (await grid.ReadAsync<InvoiceDto>()).FirstOrDefault();
                if (result != null)
                {
                    result.SummaryLines = await grid.ReadAsync<InvoiceLineDto>();
                }
            }

            return result;
        }

        public async Task<IEnumerable<ContractsToCostInvoiceDto>> GetCostContractsToInvoiceAsync(string company, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);

            var contracts = await ExecuteQueryAsync<ContractsToCostInvoiceDto>(StoredProcedureNames.GetCostContractsToInvoice, queryParameters);

            return contracts;
        }

        public async Task<IEnumerable<InvoicesForReversalDto>> GetReversalContractsToInvoiceAsync(string company, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);

            var contracts = await ExecuteQueryAsync<InvoicesForReversalDto>(StoredProcedureNames.GetInvoicesForReversal, queryParameters);

            return contracts;
        }

        public async Task<IEnumerable<InvoicesForReversalDto>> SearchReversalContractsToInvoiceAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "invoiceReversalSelectionGrid";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                            .FirstOrDefault(permission => permission.CompanyId == company)
                           .Departments.Select(department => department.DepartmentId).ToList();

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_ContractsForReversalListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var reversibleInvoices = await ExecuteDynamicQueryAsync<InvoicesForReversalDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return reversibleInvoices.ToList();
        }

        public async Task<IEnumerable<ContractsToWashoutInvoiceDto>> GetWashoutContractsToInvoiceAsync(string company, int? offset, int? limit)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);

            var contracts = await ExecuteQueryAsync<ContractsToWashoutInvoiceDto>(StoredProcedureNames.GetWashoutContractsToInvoice, queryParameters);

            return contracts;
        }

        public async Task<IEnumerable<ContractsToWashoutInvoiceDto>> SearchWashoutContractsToInvoiceAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "invoiceWashoutSelectionGrid";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                               .FirstOrDefault(permission => permission.CompanyId == company)
                              .Departments.Select(department => department.DepartmentId).ToList();

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_WashoutContractsListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var contractsResults = await ExecuteDynamicQueryAsync<ContractsToWashoutInvoiceDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return contractsResults.ToList();
        }

        public async Task<IEnumerable<InvoiceDetailsDto>> SearchInvoicesAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "invoiceList";

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

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_InvoiceListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var invoicesResults = await ExecuteDynamicQueryAsync<InvoiceDetailsDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return invoicesResults.ToList();
        }

        public async Task<InvoiceStatusDetailsDto> GetInvoiceDetailsAsync(string company, long sectionId, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectionId", sectionId);

            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            InvoiceStatusDetailsDto invoice = await ExecuteQueryFirstOrDefaultAsync<InvoiceStatusDetailsDto>(StoredProcedureNames.GetInvoiceStatusDetails, queryParameters, true);
            return invoice;
        }

        public Task<InvoiceSetupDto> GetInvoiceSetupByCompanyAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var result = ExecuteQueryFirstOrDefaultAsync<InvoiceSetupDto>(StoredProcedureNames.GetInvoiceSetupByCompany, queryParameters);
            return result;
        }

        public Task<InterfaceSetupDto> GetInterfaceSetupByCompanyAsync(string company, long interfaceTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@InterfaceTypeId", interfaceTypeId);
            var result = ExecuteQueryFirstOrDefaultAsync<InterfaceSetupDto>(StoredProcedureNames.GetInterfaceSetupByCompany, queryParameters);
            return result;
        }

        public Task<IEnumerable<InvoiceMarkingDto>> GetInvoiceDetailsBySectionAsync(long sectionId, string company, long? dataVersionId, int?childFlag)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);

            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            if (childFlag != null)
            {
                queryParameters.Add("@ChildFlag", childFlag);
            }

            var result = ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetInvoiceForSection, queryParameters, true);
            return result;
        }

        public Task<IEnumerable<InvoiceMarkingDto>> GetInvoiceCostBySectionAsync(long sectionId, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);

            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var result = ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetInvoiceCostForSection, queryParameters);
            return result;
        }

        public Task<IEnumerable<InvoiceMarkingDto>> GetInvoiceMarkingsForCost(string company, long costId, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostId", costId);
            queryParameters.Add("@CompanyId", company);

            if (dataVersionId != null)
            {
                queryParameters.Add("@DataversionId", dataVersionId);
            }

            var result = ExecuteQueryAsync<InvoiceMarkingDto>(StoredProcedureNames.GetInvoiceMarkingsForCost, queryParameters);
            return result;
        }

        public Task<IEnumerable<ContractToBeInvoicedSearchResultDto>> FindContractToInvoiceByReferenceAsync(InvoiceSearchDto invoiceSearch, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FilterParameter", invoiceSearch.FilterParameter);
            queryParameters.Add("@E_Type", invoiceSearch.Type);

            queryParameters.Add("@PeriodFrom", invoiceSearch.PeriodFrom);
            queryParameters.Add("@PeriodTo", invoiceSearch.PeriodTo);

            queryParameters.Add("@companyId", company);

            return ExecuteQueryAsync<ContractToBeInvoicedSearchResultDto>(
                StoredProcedureNames.FindGoodsContractByContractIdToBeInvoiced,
                queryParameters);
        }

        public Task<IEnumerable<CostToBeInvoicedSearchResultDto>> FindCostsToInvoiceAsync(string costType, string supplierCode, string charter, string contractRef, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@costType", costType);
            queryParameters.Add("@supplierCode", supplierCode);
            queryParameters.Add("@charter", charter);
            queryParameters.Add("@contractRef", contractRef);
            queryParameters.Add("@status", ContractStatus.Approved);
            queryParameters.Add("@CompanyId", company);

            return ExecuteQueryAsync<CostToBeInvoicedSearchResultDto>(
                StoredProcedureNames.FindCostsToBeInvoiced,
                queryParameters);
        }

        public async Task<IEnumerable<ContractsToCostInvoiceDto>> SearchContractsForCostInvoice(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "invoiceCostSelectionGrid";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                               .FirstOrDefault(permission => permission.CompanyId == company)
                              .Departments.Select(department => department.DepartmentId).ToList();

            // to update with correct view once it's there

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_CostContractsListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var tradeResults = await ExecuteDynamicQueryAsync<ContractsToCostInvoiceDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return tradeResults.ToList();
        }

        public Task<IEnumerable<ContractToBeInvoicedSearchResultDto>> GetPurchaseContractToInvoiceBySectionIdAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@companyId", company);

            return ExecuteQueryAsync<ContractToBeInvoicedSearchResultDto>(
                StoredProcedureNames.GetPurchaseGoodsContractBySectionId,
                queryParameters);
        }

        public async Task<IEnumerable<InvoiceHomeSearch>> FindGoodsInvoicesAsync(string invoiceRef, string company, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Label", invoiceRef);
            queryParameters.Add("@CompanyId", company);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var sections = await ExecuteQueryAsync<InvoiceHomeSearch>(
                StoredProcedureNames.FindGoodsInvoices,
                queryParameters);

            return sections.ToList();
        }

        public Task<IEnumerable<ContractToBeInvoicedSearchResultDto>> GetSaleContractToInvoiceBySectionIdAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@companyId", company);

            return ExecuteQueryAsync<ContractToBeInvoicedSearchResultDto>(
                StoredProcedureNames.GetSaleGoodsContractBySectionId,
                queryParameters);
        }

        public async Task<IEnumerable<ContractsToCostInvoiceDto>> GetCostsForSelectedContractsAsync(string company, int[] sectionIds)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Section", AddValuesToUDTTSection(sectionIds, "[Invoicing].[UDTT_Section]"));

            var contracts = await ExecuteQueryAsync<ContractsToCostInvoiceDto>(StoredProcedureNames.GetCostsForSelectedContracts, queryParameters);

            return contracts;
        }

        public async Task<IEnumerable<ContractsToWashoutInvoiceDto>> GetAllocatedContractsForSelectedSectionIdsAsync(int[] sectionIds, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Section", AddValuesToUDTTSection(sectionIds, "[Logistic].[UDTT_SectionForWashout]"));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            var allocatedContracts = await ExecuteQueryAsync<ContractsToWashoutInvoiceDto>(StoredProcedureNames.GetAllocatedContractsForSelectedWashoutContracts, queryParameters);
            return allocatedContracts;
        }

        /// <summary>
        /// Get the setup details to bind business sector while creating invoices
        /// </summary>
        /// <param name="company"> The company Id</param>
        public Task<BusinessSectorDto> GetBusinessSectorForPosting(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var result = ExecuteQueryFirstOrDefaultAsync<BusinessSectorDto>(StoredProcedureNames.GetBusinessSectorForPosting, queryParameters);
            return result;
        }

        private static DataTable AddValuesToUDTTSection(int[] sectionIds, string typeName)
        {
            var table = new DataTable();
            table.SetTypeName(typeName);

            var sectionId = new DataColumn("SectionId", typeof(long));
            table.Columns.Add(sectionId);

            if (sectionIds != null)
            {
                foreach (var value in sectionIds)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task<bool> CheckExternalInvoiceReferenceExistsAsync(string company, string externalInvoiceRef)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ExternalInvoiceReference", externalInvoiceRef);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckExternalIvoiceReferenceExists, queryParameters);

            return exists;
        }

        private static class StoredProcedureNames
        {
            internal const string GetUnpaidInvoices = "[Invoicing].[usp_ListUnpaidInvoices]";
            internal const string GetContractsToInvoice = "[Invoicing].[usp_GetPhysicalContractsToInvoice]";
            internal const string GetInvoiceById = "[Invoicing].[usp_GetInvoiceById]";
            internal const string GetCostContractsToInvoice = "[Invoicing].[usp_GetCostContracts]";
            internal const string GetInvoicesForReversal = "[Invoicing].[usp_GetInvoicesForReversal]";
            internal const string GetWashoutContractsToInvoice = "[Invoicing].[usp_GetContractsForWashout]";
            internal const string GetInvoiceStatusDetails = "[Invoicing].[usp_GetInvoiceForTradingStatus]";
            internal const string GetInvoiceSetupByCompany = "[Invoicing].[usp_GetInvoiceSetup]";
            internal const string GetInterfaceSetupByCompany = "[Interface].[usp_GetInterfaceSetupByInterfaceTypeId]";
            internal const string GetInvoiceForSection = "[Invoicing].[usp_GetInvoiceMarkingsForSection]";
            internal const string GetInvoiceCostForSection = "[Invoicing].[usp_GetInvoiceMarkingsForCostBySection]";
            internal const string GetInvoiceMarkingsForCost = "[Invoicing].[usp_GetInvoiceMarkingsForCost]";
            internal const string GetPurchaseGoodsContractBySectionId = "[Invoicing].[usp_ListPurchaseGoodsContractBySectionId]";
            internal const string GetSaleGoodsContractBySectionId = "[Invoicing].[usp_ListSaleGoodsContractBySectionId]";
            internal const string FindGoodsContractByContractIdToBeInvoiced = "[Invoicing].[usp_ListGoodsContractToBeInvoiced]";
            internal const string FindCostsToBeInvoiced = "[Trading].[usp_ListCosts]";
            internal const string FindGoodsInvoices = "[Invoicing].[usp_ListGoodInvoices]";
            internal const string GetCostsForSelectedContracts = "[Invoicing].[usp_GetCostForGoodsAndCostInvoice]";
            internal const string GetAllocatedContractsForSelectedWashoutContracts = "[Logistic].[usp_GetAllocatedContractsForWashout]";
            internal const string CheckExternalIvoiceReferenceExists = "[Invoicing].[usp_CheckExternalInvoiceReference]";
            internal const string GetBusinessSectorForPosting = "[Trading].[usp_GetTradeSetup]";
        }
    }
}
