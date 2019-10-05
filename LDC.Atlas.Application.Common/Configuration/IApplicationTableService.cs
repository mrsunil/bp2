using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IApplicationTableService
    {
        Task<IEnumerable<ApplicationTableDto>> GetApplicationTablesAsync(string tableName = null);

        Task<ApplicationTableDto> GetApplicationTableByIdAsync(int tableId);
    }
}
