using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IGridViewService
    {
        Task<UserGridViewDto> GetUserGridViewById(string userId, string company, int gridViewId);

        Task<IEnumerable<UserGridViewDto>> GetUserGridViews(string company, string gridCode);

        Task<IEnumerable<UserGridViewDto>> GetGridViews(string company, string gridCode);

        Task<bool> IsGridViewNameExists(string company, string gridCode, string gridViewName);
    }
}
