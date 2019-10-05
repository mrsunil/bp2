using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IFormService
    {
        Task<FormDto> GetForm(string formId, string company);
    }
}
