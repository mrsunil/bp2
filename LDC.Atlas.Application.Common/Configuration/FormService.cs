using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class FormService : IFormService
    {
        public async Task<FormDto> GetForm(string formId, string company)
        {
            return new FormDto
            {
                FormId = formId
            };
        }
    }
}
