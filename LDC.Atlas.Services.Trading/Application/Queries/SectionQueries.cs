using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class SectionQueries : BaseRepository, ISectionQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IGridService _gridQueries;

        public SectionQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IUserService userService, IMapper mapper, IGridService gridQueries)
       : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));

            SqlMapper.SetTypeMap(
               typeof(SectionSummaryDto),
               new ColumnAttributeTypeMapper<SectionSummaryDto>());
            SqlMapper.SetTypeMap(
               typeof(PhysicalContractDtoDeprecated),
               new ColumnAttributeTypeMapper<PhysicalContractDtoDeprecated>());
            SqlMapper.SetTypeMap(
               typeof(TradeDto),
               new ColumnAttributeTypeMapper<TradeDto>());
            SqlMapper.SetTypeMap(
               typeof(CostDto),
               new ColumnAttributeTypeMapper<CostDto>());
            SqlMapper.SetTypeMap(
               typeof(SectionDto),
               new ColumnAttributeTypeMapper<SectionDto>());
            SqlMapper.SetTypeMap(
              typeof(TradeCostGenerateMonthEndDto),
              new ColumnAttributeTypeMapper<TradeCostGenerateMonthEndDto>());
            SqlMapper.SetTypeMap(
              typeof(FxDealDetailsGenerateMonthEndDto),
              new ColumnAttributeTypeMapper<FxDealDetailsGenerateMonthEndDto>());
        }

        public async Task<IEnumerable<SectionSearchResultDto>> GetSectionsAsync(string company, long? physicalContractId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@PhysicalContractId", physicalContractId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var tradeResults = await ExecuteQueryAsync<SectionSearchResultDto>(StoredProcedureNames.GetTradesSearchResult, queryParameters, true);

            return tradeResults.ToList();
        }

        public async Task<PhysicalContractDtoDeprecated> GetSectionByIdAsync(long sectionId, string company, int? dataVersionId)
        {
            var physicalContractDto = await GetFixPricedSectionAsync(sectionId, company, dataVersionId);

            if (physicalContractDto != null)
            {
                physicalContractDto.Costs = await LoadSectionCostsAsync(sectionId, company, dataVersionId);
            }

            return physicalContractDto;
        }

        public async Task<PhysicalContractDtoDeprecated> GetDataForTradeImageByIdAsync(long sectionId, string company)
        {
            PhysicalContractDtoDeprecated section;

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@PhysicalContractId");
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetDataForTradeImage, queryParameters))
            {
                var trade = (await grid.ReadAsync<TradeDto>()).FirstOrDefault();
                section = (await grid.ReadAsync<PhysicalContractDtoDeprecated>()).FirstOrDefault();
                section.Costs = (await grid.ReadAsync<CostDto>()).ToList();

                if (section != null)
                {
                    section.ChildSections = await grid.ReadAsync<PhysicalContractDtoDeprecated>();
                    section.Header = trade;

                    section.PortOfOrigin = section.PortOriginCode;
                    section.PortOfDestination = section.PortDestinationCode;
                    section.ContractTerms = section.ContractTermCode;
                    section.ContractTermsLocation = section.ContractTermLocationCode;
                    section.PeriodType = section.PeriodTypeCode;
                    section.PaymentTerms = section.PaymentTermCode;
                    section.Arbitration = section.ArbitrationCode;

                    foreach (var childSection in section.ChildSections)
                    {
                        childSection.PortOfOrigin = childSection.PortOriginCode;
                        childSection.PortOfDestination = childSection.PortDestinationCode;
                        childSection.ContractTerms = childSection.ContractTermCode;
                        childSection.ContractTermsLocation = childSection.ContractTermLocationCode;
                        childSection.PeriodType = childSection.PeriodTypeCode;
                        childSection.PaymentTerms = childSection.PaymentTermCode;
                    }
                }
            }

            return section;
        }

        public async Task<IEnumerable<CostDto>> GetAllCosts(long sectionId, string company, int? dataVersionId = null)
        {
            dataVersionId = dataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            IEnumerable<CostDto> costs = await LoadSectionCostsAsync(sectionId, company, dataVersionId);

            return costs;
        }

        /// <summary>
        /// Returns the list of trades for bulk edit
        /// </summary>
        /// <param name="company"> The company code</param>
        /// <param name="searchRequest">List and search request</param>
        /// <param name="grid"> the grid details</param>
        public async Task<IEnumerable<SectionBulkEditDto>> GetContractsForBulkEdit(string company, EntitySearchRequest searchRequest, GridDto grid)
        {
            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                            .FirstOrDefault(permission => permission.CompanyId == company)
                           .Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TradeListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var bulkEditResults = await ExecuteDynamicQueryAsync<SectionBulkEditDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return bulkEditResults.ToList();
        }

        public async Task<IEnumerable<TradeReportResultDto>> GetTradeReportDataAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "tradeReportList";

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
                                ?.Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TradeReportListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var tradeReportResults = await ExecuteDynamicQueryAsync<TradeReportResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return tradeReportResults.ToList();
        }

        public async Task<IEnumerable<ChildSectionsSearchResultDto>> GetTradeChildSectionDataAsync(string company, long? sectionId, string sectionRef, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@SecRef", sectionRef);
            queryParameters.Add("@CompanyId", company);
            var tradeChildSectionsResults = await ExecuteQueryAsync<ChildSectionsSearchResultDto>(StoredProcedureNames.GetTradeChildSectionList, queryParameters, true);

            if (tradeChildSectionsResults.Any())
            {
                foreach (var childSection in tradeChildSectionsResults)
                {
                    childSection.PortOfOrigin = childSection.PortOriginCode;
                    childSection.PortOfDestination = childSection.PortDestinationCode;
                }
            }

            return tradeChildSectionsResults.ToList();
        }

        private async Task<PhysicalContractDtoDeprecated> GetFixPricedSectionAsync(long sectionId, string company, int? dataVersionId = null)
        {
            PhysicalContractDtoDeprecated section;

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetSectionById, queryParameters, true))
            {
                var trade = (await grid.ReadAsync<TradeDto>()).FirstOrDefault();
                section = (await grid.ReadAsync<PhysicalContractDtoDeprecated>()).FirstOrDefault();

                if (section != null)
                {
                    section.Header = trade;

                    section.PortOfOrigin = section.PortOriginCode;
                    section.PortOfDestination = section.PortDestinationCode;
                    section.ContractTerms = section.ContractTermCode;
                    section.ContractTermsLocation = section.ContractTermLocationCode;
                    section.PeriodType = section.PeriodTypeCode;
                    section.PaymentTerms = section.PaymentTermCode;
                    section.Arbitration = section.ArbitrationCode;

                    section.AllocatedTo = (await grid.ReadAsync<SectionReferenceDto>()).FirstOrDefault();
                }
            }

            return section;
        }

        private async Task<IEnumerable<CostDto>> LoadSectionCostsAsync(long sectionId, string company, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@sectionId", sectionId);
            queryParameters.Add("@companyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var costResults = await ExecuteQueryAsync<CostDto>(StoredProcedureNames.LoadSectionCosts, queryParameters, true);
            return costResults.ToList();
        }

        public async Task<IEnumerable<TradeCostGenerateMonthEndDto>> GetTradeCostGenerateMonthEndAsync(string company, int reportType, short tabType, int dataVersionId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            string storedProcedure = string.Empty;
            List<TradeCostGenerateMonthEndDto> tradeCostGenerateMonthEndResults = null;
            List<TradeMonthEndMappingErrorDto> tradeCostMonthEndMappingErrors = null;
            if (dataVersionId != 0)
            {
                queryParameters.Add(DataVersionIdParameter, dataVersionId);
            }

            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@type", tabType);
            switch (reportType)
            {
                case 1:
                    storedProcedure = StoredProcedureNames.GetTradeCostforMonthEndProcess;
                    break;
                case 2:
                    storedProcedure = StoredProcedureNames.GetTradeCostforUnrealizedForMonthEndProcess;
                    break;
            }

            using (var grid = await ExecuteQueryMultipleAsync(storedProcedure, queryParameters, false))
            {
                tradeCostGenerateMonthEndResults = (await grid.ReadAsync<TradeCostGenerateMonthEndDto>()).ToList();

                tradeCostMonthEndMappingErrors = (await grid.ReadAsync<TradeMonthEndMappingErrorDto>()).ToList();
                if (tradeCostGenerateMonthEndResults.Count > 0) {
                    var tradeCostGenerateMonthEndResult = tradeCostGenerateMonthEndResults.First();
                    tradeCostGenerateMonthEndResult.TradeCostMonthEndMappingErrors = new List<TradeMonthEndMappingErrorDto>();
                    tradeCostGenerateMonthEndResult.TradeCostMonthEndMappingErrors.AddRange(tradeCostMonthEndMappingErrors);
                }
            }

            return tradeCostGenerateMonthEndResults.ToList();
        }

        public async Task<IEnumerable<TradeImageColumnDto>> GetTradeImageFieldDetailsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var tradeFieldsList = await ExecuteQueryAsync<TradeImageColumnDto>(StoredProcedureNames.GetTradeImageFieldDetails, queryParameters);
            return tradeFieldsList;
        }

        /// <summary>
        /// Get the trade setup details
        /// </summary>
        /// <param name="company"> The company code</param>
        public async Task<TradeConfigurationDto> GetTradeConfigurationDetails(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            TradeConfigurationDto tradeConfigurationList = await ExecuteQueryFirstOrDefaultAsync<TradeConfigurationDto>(StoredProcedureNames.GetTradeSetup, queryParameters);
            return tradeConfigurationList;
        }

        public async Task<IEnumerable<long>> GetSectionIdOfChildContracts(string company, long sectionId, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            var childSectionIds = await ExecuteQueryAsync<long>(StoredProcedureNames.GetSectionIdOfChildContracts, queryParameters);

            return childSectionIds.ToList();
        }

        public async Task<IEnumerable<SectionBulkEditDto>> GetPhysicalTradesForBulkEdit(string company, int[] sectionIds, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectionDetails", AddValuesToUDTTSection(sectionIds, "[Trading].[UDTT_BulkAmendment]"));
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);
            var getPhysicalTradesForBulkEdit = await ExecuteQueryAsync<SectionBulkEditDto>(StoredProcedureNames.GetPhysicalTradesForBulkEdit, queryParameters);
            return getPhysicalTradesForBulkEdit;
        }



        /// <summary>
        /// Gets the physical trades for bulk closure
        /// </summary>
        public async Task<IEnumerable<SectionBulkClosureDto>> GetPhysicalTradesForBulkClosure(string company, int[] sectionIds, int? offset, int? limit)
        {
            List<SectionBulkClosureDto> assignedSectionToClose = new List<SectionBulkClosureDto>();
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DataVersionId", null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetPhysicalTradesForBulkClosure, queryParameters, true))
            {
                var assignedSection = (await grid.ReadAsync<SectionBulkClosureDto>()).ToList();

                var costs = (await grid.ReadAsync<AssignedCost>()).ToList();

                assignedSectionToClose = assignedSection.GroupBy(x => x.SectionId, (key, group) => group.First()).ToList();

                foreach (var item in assignedSectionToClose)
                {
                    item.Costs = costs.Where(c => c.SectionId == item.SectionId).ToList();
                    item.Invoices = assignedSection.Where(x => x.SectionId == item.SectionId).Select(y => new InvoiceAssociatedToSectionCloseDto()
                    {
                        CashMatchPercentage = y.PaidPercent,
                        InvoiceId = y.InvoiceId,
                        InvoicePercent = y.InvoicePercent,
                        PostingStatusId = y.PostingStatusId,
                        InvoicingStatusId = y.InvoicingStatusId
                    }).ToList();
                }
            }
            return assignedSectionToClose;
        }       

        /// <summary>
        /// Gets the charter details for closure validations
        /// </summary>
        /// <param name="company"> The Company Identifier</param>
        /// <param name="sectionIds"> The Charter Identifier</param>
        public async Task<IEnumerable<SectionAssignedToCloseCharterDto>> GetTradeDetailForClosure(string company, long[] sectionIds)
        {
            List<SectionAssignedToCloseCharterDto> assignedSectionToClose = new List<SectionAssignedToCloseCharterDto>();
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DataVersionId", null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetTradeDetailForClosure, queryParameters, true))
            {
                var assignedSection = (await grid.ReadAsync<SectionAssignedToCloseCharterDto>()).ToList();

                var costs = (await grid.ReadAsync<AssignedCost>()).ToList();

                assignedSectionToClose = assignedSection.GroupBy(x => x.SectionId, (key, group) => group.First()).ToList();

                foreach (var item in assignedSectionToClose)
                {
                    item.Costs = costs.Where(c => c.SectionId == item.SectionId).ToList();
                    item.Invoices = assignedSection.Where(x => x.SectionId == item.SectionId).Select(y => new InvoiceAssociatedToSectionCloseDto()
                    {
                        CashMatchPercentage = y.PaidPercent,
                        InvoiceId = y.InvoiceId,
                        InvoicePercent = y.InvoicePercent,
                        PostingStatusId = y.PostingStatusId,
                        InvoicingStatusId = y.InvoicingStatusId
                    }).ToList();
                }
            }
            return assignedSectionToClose;
        }

        public async Task<bool> CheckTradeFavoriteNameExistsAsync(string tradeFavoriteName)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", tradeFavoriteName);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckTradeFavoriteNameExists, queryParameters, true);

            return exists;
        }

        public async Task<IEnumerable<TradeFavoriteDto>> GetFavoritesAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var tradeFavorites = await ExecuteQueryAsync<TradeFavoriteDto>(StoredProcedureNames.ListFavoriteTradesForUser, queryParameters, true);

            return tradeFavorites;
        }

        public async Task<TradeFavoriteDetailDto> GetTradeFavoriteByIdAsync(long tradeFavoriteId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@FavoriteTradeId", tradeFavoriteId);

            TradeFavoriteDetailDto tradeFavorite;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetFavouriteTradeById, queryParameters))
            {
                tradeFavorite = (await grid.ReadAsync<TradeFavoriteDetailDto>()).FirstOrDefault();
                if (tradeFavorite != null)
                {
                    tradeFavorite.ContractTerms = tradeFavorite.ContractTermCode;
                    tradeFavorite.ContractTermsLocation = tradeFavorite.ContractTermLocationCode;
                    tradeFavorite.PaymentTerms = tradeFavorite.PaymentTermCode;
                    tradeFavorite.Costs = (await grid.ReadAsync<CostDto>()).ToList();
                }
            }

            return tradeFavorite;
        }

        public async Task<IEnumerable<ChildTradesDto>> GetChildTradesForSection(string company, long sectionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectionId", sectionId);
            var getTradesForSection = await ExecuteQueryAsync<ChildTradesDto>(StoredProcedureNames.GetChildTrades, queryParameters);
            return getTradesForSection;
        }

        public async Task<IEnumerable<CostBulkEditDto>> GetCostsForContractsAsync(string company, int[] sectionIds)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Section", AddValuesToUDTTSection(sectionIds, "[Trading].[UDTT_SectionId]"));
            queryParameters.Add(DataVersionIdParameter, null);

            var contracts = await ExecuteQueryAsync<CostBulkEditDto>(StoredProcedureNames.GetCostsForContracts, queryParameters, true);

            return contracts;
        }

        public async Task<IEnumerable<ParentCostsToAdjustDto>> GetParentCostsForSectionAsync(long sectionId, string company, int? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            IEnumerable<ParentCostsToAdjustDto> costResults = await ExecuteQueryAsync<ParentCostsToAdjustDto>(StoredProcedureNames.GetParentCostsForAdjustCosts, queryParameters);
            return costResults.ToList();
        }

        public async Task<IEnumerable<TradeFieldsForBulkEditDto>> GetTradeFieldsForBulkEditAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            IEnumerable<TradeFieldsForBulkEditDto> tradeFields = await ExecuteQueryAsync<TradeFieldsForBulkEditDto>(StoredProcedureNames.GetTradeFieldsForBulkEdit, queryParameters);
            return tradeFields.ToList();
        }

        public async Task<IEnumerable<ChildSectionCostsToAdjust>> GetChildSectionCostsForSectionAsync(long sectionId, string company, int? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var costResults = await ExecuteQueryAsync<ChildSectionCostsToAdjust>(StoredProcedureNames.GetChildSectionsCostsForAdjustCosts, queryParameters);
            return costResults.ToList();
        }

        public async Task<IEnumerable<FxDealDetailsGenerateMonthEndDto>> GetFxDealDetailsGenerateMonthEndAsync(string company, int? dataVersionId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            string storedProcedure = string.Empty;
            List<FxDealDetailsGenerateMonthEndDto> fxDealGenerateMonthEndResults = null;
            List<TradeMonthEndMappingErrorDto> fxDealMonthEndMappingErrors = null;

            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);
            storedProcedure = StoredProcedureNames.GetFxDealDetailsForMonthEndProcess;
            using (var grid = await ExecuteQueryMultipleAsync(storedProcedure, queryParameters, false))
            {
                fxDealGenerateMonthEndResults = (await grid.ReadAsync<FxDealDetailsGenerateMonthEndDto>()).ToList();

                fxDealMonthEndMappingErrors = (await grid.ReadAsync<TradeMonthEndMappingErrorDto>()).ToList();
                if (fxDealGenerateMonthEndResults.Count > 0)
                {
                    var tradeCostGenerateMonthEndResult = fxDealGenerateMonthEndResults.First();
                    tradeCostGenerateMonthEndResult.FxDealMonthEndMappingErrors = new List<TradeMonthEndMappingErrorDto>();
                    tradeCostGenerateMonthEndResult.FxDealMonthEndMappingErrors.AddRange(fxDealMonthEndMappingErrors);
                }
            }

            return fxDealGenerateMonthEndResults.ToList();
        }

        public Task<IEnumerable<InvoiceMarkingCostLines>> GetInvoiceLinesForBulkCosts(IEnumerable<CostBulkEdit> costs, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostsId", ConvertToCostsUDTT(costs));
            queryParameters.Add("@CompanyId", company);

            if (dataVersionId != null)
            {
                queryParameters.Add("@DataversionId", dataVersionId);
            }

            var invoiceLines = ExecuteQueryAsync<InvoiceMarkingCostLines>(StoredProcedureNames.GetInvoiceLinesForBulkCost, queryParameters);
            return invoiceLines;
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

        private static DataTable AddValuesToUDTTSection(long[] sectionIds, string typeName)
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

        private static DataTable ConvertToCostsUDTT(IEnumerable<CostBulkEdit> costs)
        {

            DataTable udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_IntList]");
            DataColumn id = new DataColumn("[id]", typeof(long));
            udtt.Columns.Add(id);

            if (costs != null)
            {
                foreach (var item in costs)
                {
                    var row = udtt.NewRow();
                    row[id] = item.CostId;
                    udtt.Rows.Add(row);
                }
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string GetSectionById = "[Trading].[usp_GetSectionById]";
            internal const string LoadSectionCosts = "[Trading].[usp_ListCostsBySectionId]";
            internal const string GetTradesSearchResult = "[Trading].[usp_GetPhysicalSearchResult]";
            internal const string GetDataForTradeImage = "[Trading].[GetPhysicalContractsAndCosts]";
            internal const string GetTradeCostforMonthEndProcess = "[Trading].[usp_GetTradeCostforMonthEndProcess]";
            internal const string GetTradeCostforUnrealizedForMonthEndProcess = "[Trading].[usp_GetTradeCostforUnrealisedMonthEndProcess]";
            internal const string GetTradeImageFieldDetails = "[Trading].[usp_GetTradeImageFieldDetails]";
            internal const string GetTradeChildSectionList = "[Trading].[usp_GetTradeChildSectionList]";
            internal const string GetSectionIdOfChildContracts = "[Trading].[usp_GetSectionIdOfChildContracts]";
            internal const string GetTradeSetup = "[Trading].[usp_GetTradeSetup]";
            internal const string GetPhysicalTradesForBulkEdit = "[Trading].[usp_GetPhysicalTradesForBulkEdit]";
            internal const string GetPhysicalTradesForBulkClosure = "[Trading].[usp_GetPhysicalTradesForBulkClosure]";
            internal const string CheckTradeFavoriteNameExists = "[Trading].[CheckFavoriteTrade]";
            internal const string ListFavoriteTradesForUser = "[Trading].[usp_ListFavoriteTradesForUser]";
            internal const string GetFavouriteTradeById = "[Trading].[usp_getFavouriteTradeById]";
            internal const string GetChildTrades = "[Trading].[usp_GetSectionandChildList]";
            internal const string GetCostsForContracts = "[Trading].[usp_GetCostsForSelectedContracts]";
            internal const string GetParentCostsForAdjustCosts = "[Trading].[usp_GetParentCostsForAdjustCosts]";
            internal const string GetChildSectionsCostsForAdjustCosts = "[Trading].[usp_GetChildSectionsCostsForAdjustCosts]";
            internal const string GetTradeDetailForClosure = "[Trading].[usp_GetTradeDetailForClosure]";
            internal const string GetTradeFieldsForBulkEdit = "[Trading].[usp_GetTradeFieldsForBulkEdit]";
            internal const string GetFxDealDetailsForMonthEndProcess = "[Trading].[usp_GetFxDealForMonthEndProcess]";
            internal const string GetInvoiceLinesForBulkCost = "[Invoicing].[usp_GetInvoiceMarkingsForBulkCost]";
        }
    }
}
