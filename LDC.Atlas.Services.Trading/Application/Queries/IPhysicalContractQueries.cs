using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface IPhysicalContractQueries
    {
        Task<PhysicalContractDto> GetPhysicalContractByIdAsync(string company, long physicalContractId, long? dataVersionId);

        Task<bool> CheckContractReferenceExistsAsync(string company, string contractRef, long? dataVersionId);

        Task<IEnumerable<ItemConfigurationPropertiesDto>> GetMandatoryFieldsConfiguration(string company, string formId);

        Task<IEnumerable<SectionSummaryDto>> GetTradesForAllocationAsync(string company, EntitySearchRequest searchRequest);
    }
}
