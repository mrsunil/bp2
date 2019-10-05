using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface ISectionQueries
    {
        Task<IEnumerable<SectionSearchResultDto>> GetSectionsAsync(string company, long? physicalContractId, int? offset, int? limit);

        Task<IEnumerable<TradeCostGenerateMonthEndDto>> GetTradeCostGenerateMonthEndAsync(string company, int reportType, short tabType, int dataVersionId, int? offset, int? limit);

        Task<IEnumerable<SectionBulkEditDto>> GetContractsForBulkEdit(string company, EntitySearchRequest searchRequest, GridDto grid);

        Task<IEnumerable<TradeReportResultDto>> GetTradeReportDataAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<ChildSectionsSearchResultDto>> GetTradeChildSectionDataAsync(string company, long? sectionId, string sectionRef, int? dataVersionId = null);

        Task<PhysicalContractDtoDeprecated> GetSectionByIdAsync(long sectionId, string company, int? dataVersionId = null);

        Task<PhysicalContractDtoDeprecated> GetDataForTradeImageByIdAsync(long sectionId, string company);

        Task<IEnumerable<CostDto>> GetAllCosts(long sectionId, string company, int? dataVersionId = null);

        Task<IEnumerable<TradeImageColumnDto>> GetTradeImageFieldDetailsAsync(string company);

        Task<IEnumerable<long>> GetSectionIdOfChildContracts(string company, long sectionId, int? dataVersionId = null);

        Task<TradeConfigurationDto> GetTradeConfigurationDetails(string company);

        Task<IEnumerable<SectionBulkEditDto>> GetPhysicalTradesForBulkEdit(string company, int[] sectionIds, int? offset, int? limit);

        Task<IEnumerable<SectionBulkClosureDto>> GetPhysicalTradesForBulkClosure(string company, int[] sectionIds, int? offset, int? limit);

        Task<bool> CheckTradeFavoriteNameExistsAsync(string tradeFavoriteName);

        Task<IEnumerable<TradeFavoriteDto>> GetFavoritesAsync(string company);

        Task<TradeFavoriteDetailDto> GetTradeFavoriteByIdAsync(long tradeFavoriteId);

        Task<IEnumerable<ChildTradesDto>> GetChildTradesForSection(string company, long sectionId);

        Task<IEnumerable<CostBulkEditDto>> GetCostsForContractsAsync(string company, int[] sectionIds);

        Task<IEnumerable<ParentCostsToAdjustDto>> GetParentCostsForSectionAsync(long sectionId, string company, int? dataVersionId );

        Task<IEnumerable<TradeFieldsForBulkEditDto>> GetTradeFieldsForBulkEditAsync(string company);

        Task<IEnumerable<ChildSectionCostsToAdjust>> GetChildSectionCostsForSectionAsync(long sectionId, string company, int? dataVersionId);

        Task<IEnumerable<FxDealDetailsGenerateMonthEndDto>> GetFxDealDetailsGenerateMonthEndAsync(string company, int? dataVersionId, int? offset, int? limit);

        /// <summary>
        /// Gets the charter details for closure validations
        /// </summary>
        /// <param name="company"> The Company Identifier</param>
        /// <param name="sectionIds"> The Charter Identifier</param>
        Task<IEnumerable<SectionAssignedToCloseCharterDto>> GetTradeDetailForClosure(string company, long[] sectionIds);

        Task<IEnumerable<InvoiceMarkingCostLines>> GetInvoiceLinesForBulkCosts(IEnumerable<CostBulkEdit> costs, string company, long? dataVersionId);
    }
}
