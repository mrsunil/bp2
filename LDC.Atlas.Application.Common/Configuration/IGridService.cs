using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IGridService
    {
        Task<GridDto> GetGrid(string gridCode, string company);

        Task<GridDto> GetGridByGridId(long gridId, string company);

        Task<List<GridDto>> GetGridConfigByConfigurationTypeId(string configurationTypeId, string company);
    }
}
