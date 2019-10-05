using LDC.Atlas.Services.Configuration.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface IGridViewRepository
    {
        Task<int> CreateGridViewAsync(GridView gridView);

        Task UpdateGridViewAsync(GridView gridView);

        Task DeleteGridViewAsync(int gridViewId);

        Task SetGridViewAsFavoriteAsync(int gridViewId, string gridCode, string companyId);

        Task<GridView> GetUserGridViewByIdAsync(string company, int gridViewId);

        Task<int> SaveUniqueGridViewAsFavoriteAsync(GridView gridView);

        Task<IEnumerable<GridView>> GetGridViews(string company, string gridCode);

        Task<bool> IsGridViewNameExists(string company, string gridCode, string gridViewName);
    }
}
