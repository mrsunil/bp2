using LDC.Atlas.Services.Configuration.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface IGridRepository
    {
        Task UpdateGridAsync(Grid grid);
    }
}
