using LDC.Atlas.Services.Trading.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface ICostRepository
    {
        Task<IEnumerable<Cost>> AddCostsAsync(IEnumerable<Cost> costs, string company, long? dataVersionId);

        Task<IEnumerable<Cost>> AddUpdateCostsAsync(IEnumerable<Cost> costs, string company, long? dataVersionId);

        Task UpdateCostAsync(Cost cost, string company);

        Task<IEnumerable<Cost>> LoadSectionCostsAsync(long sectionId, string company, long? dataVersionId);

        Task DeleteCostsAsync(string company, long sectionId, IEnumerable<long> costIds, long? dataVersionId);

        Task CreateSplitCostAsync(string company, long sectionId, long costOriginId, Cost cost, decimal? invoiceMarkingAmount, long? dataVersionId);

        Task UpdateCostInvoicingStatusAsync(long costId, int invoicingStatusId, string companyCode, long? dataVersionId = null);

        Task<IEnumerable<CostBulkEdit>> AddBulkCostsAsync(IEnumerable<CostBulkEdit> costs, string company, long? dataVersionId);

        Task<IEnumerable<CostBulkEdit>> UpdateBulkCostsAsync(IEnumerable<CostBulkEdit> costs, IEnumerable<InvoiceMarkingCostLines> costInvoiceLinesToUpdate, string company, long? dataVersionId);

        Task<IEnumerable<long>> DeleteCostsForTradeCostBulkEditAsync(string company, IEnumerable<CostBulkEdit> costs, long? dataVersionId);
    }
}
