using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IUserConfigurationService
    {
        Task<UserConfigurationDto> GetUserPreferenceColumns(long userId, string company, string componentId);
    }
}
