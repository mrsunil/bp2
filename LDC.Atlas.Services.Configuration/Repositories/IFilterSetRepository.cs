using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Services.Configuration.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface IFilterSetRepository
    {
        Task<int> CreateFilterSetAsync(FilterSet filterSet);

        Task UpdateFilterSetAsync(FilterSet filterSet);

        Task DeleteFilterSetAsync(int filterSetId);

        Task CreateFavoriteFilterSetAsync(int filterSetId, string gridCode, string companyId);

        Task<UserFilterSetDto> GetUserFilterSetByIdAsync(long userId, string company, int filterSetId);
    }
}
