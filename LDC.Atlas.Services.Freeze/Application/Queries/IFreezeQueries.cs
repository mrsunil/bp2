using LDC.Atlas.Services.Freeze.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Application.Queries
{
    public interface IFreezeQueries
    {
        Task<FreezeDto> GetFreezeAsync(string companyId, int dataVersionId);

        Task<FreezeDto> GetFreezeAsync(string companyId, DateTime freezeDate, DataVersionTypeDto dataVersionTypeId);

        Task<IEnumerable<FreezeDto>> GetFreezeForSelectedCompanyAsync(string companyId, DateTime freezeDate, DataVersionTypeDto dataVersionTypeId);

        Task<IEnumerable<FreezeDto>> GetFreezesAsync(string companyId, DateTime? dateFrom, DateTime? dateTo, DataVersionTypeDto? dataVersionTypeId, int? offset, int? limit);

        Task<FreezeSearchForCompanyDto> CheckFreezeForSelectedDatabase(string companyId, string[] companyList, DataVersionTypeDto? dataVersionTypeId, DateTime? freezeDate, DataVersionTypeDto? comparisonDataVersionTypeId, DateTime? comparisonDbDate);
    }
}
