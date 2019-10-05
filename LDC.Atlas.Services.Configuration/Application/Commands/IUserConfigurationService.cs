using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public interface IUserConfigurationService
    {
        Task CreateUserPreference(string company, CreateUserPreferenceCommand request);
    }
}