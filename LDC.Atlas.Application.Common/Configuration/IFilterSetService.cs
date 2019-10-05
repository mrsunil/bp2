using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IFilterSetService
    {
        Task<UserFilterSetDto> GetUserFilterSetById(long userId, string company, int filterSetId);

        Task<IEnumerable<UserFilterSetDto>> GetUserFilterSets(long userId, string company, string gridCode);
    }
}
