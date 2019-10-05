using System.Threading.Tasks;

namespace LDC.Atlas.Services.Interface.Application.Queries
{
    public interface IInterfaceQueries
    {
        Task<bool> GetInterfaceProcessActiveStatusAsync();
    }
}
