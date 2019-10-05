using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface IInvoiceQueries
    {
        Task<IEnumerable<UnpaidInvoiceDto>> GetUnpaidInvoicesAsync(string searchCriteria, string company, int? offset, int? limit);

        Task<IEnumerable<ContractsToInvoiceDto>> GetContractsToInvoiceAsync(string company, int invoiceType,  int? offset, int? limit);

        Task<IEnumerable<ContractsToInvoiceDto>> SearchContractToPurchaseInvoiceAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<ContractsToInvoiceDto>> SearchContractToSaleInvoiceAsync(string company, EntitySearchRequest searchRequest);

        Task<InvoiceDto> GetInvoiceByIdAsync(string company, long id);

        Task<IEnumerable<ContractsToCostInvoiceDto>> GetCostContractsToInvoiceAsync(string company, int? offset, int? limit);

        Task<IEnumerable<ContractsToCostInvoiceDto>> SearchContractsForCostInvoice(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<InvoicesForReversalDto>> GetReversalContractsToInvoiceAsync(string company, int? offset, int? limit);

        Task<IEnumerable<InvoicesForReversalDto>> SearchReversalContractsToInvoiceAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<ContractsToWashoutInvoiceDto>> GetWashoutContractsToInvoiceAsync(string company, int? offset, int? limit);

        Task<IEnumerable<ContractsToWashoutInvoiceDto>> SearchWashoutContractsToInvoiceAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<InvoiceDetailsDto>> SearchInvoicesAsync(string company, EntitySearchRequest searchRequest);

        Task<InvoiceStatusDetailsDto> GetInvoiceDetailsAsync(string company, long sectionId, long? dataVersionId);

        Task<IEnumerable<InvoiceMarkingDto>> GetInvoiceDetailsBySectionAsync(long sectionId, string company, long? dataVersionId, int? childFlag);

        Task<IEnumerable<InvoiceMarkingDto>> GetInvoiceCostBySectionAsync(long sectionId, string company, long? dataVersionId);

        Task<InvoiceSetupDto> GetInvoiceSetupByCompanyAsync(string company);

        Task<InterfaceSetupDto> GetInterfaceSetupByCompanyAsync(string company, long interfaceTypeId);

        Task<IEnumerable<InvoiceMarkingDto>> GetInvoiceMarkingsForCost(string company, long costId, long? dataVersionId);

        Task<IEnumerable<ContractToBeInvoicedSearchResultDto>> FindContractToInvoiceByReferenceAsync(InvoiceSearchDto invoiceSearch, string company);

        Task<IEnumerable<CostToBeInvoicedSearchResultDto>> FindCostsToInvoiceAsync(string costType, string supplierCode, string charter, string contractRef, string company);

        Task<IEnumerable<ContractToBeInvoicedSearchResultDto>> GetPurchaseContractToInvoiceBySectionIdAsync(long sectionId, string company);

        Task<IEnumerable<ContractToBeInvoicedSearchResultDto>> GetSaleContractToInvoiceBySectionIdAsync(long sectionId, string company);

        Task<IEnumerable<InvoiceHomeSearch>> FindGoodsInvoicesAsync(string invoiceRef, string company, int? offset, int? limit);

        Task<IEnumerable<ContractsToCostInvoiceDto>> GetCostsForSelectedContractsAsync(string company, int[] sectionIds);
        
        Task<IEnumerable<ContractsToWashoutInvoiceDto>> GetAllocatedContractsForSelectedSectionIdsAsync(int[] sectionIds, string company);

        Task<bool> CheckExternalInvoiceReferenceExistsAsync(string company, string externalInvoiceRef);

        Task<BusinessSectorDto> GetBusinessSectorForPosting(string company);
    }
}
