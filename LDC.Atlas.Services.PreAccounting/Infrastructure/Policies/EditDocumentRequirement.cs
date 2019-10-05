using Microsoft.AspNetCore.Authorization;

namespace LDC.Atlas.Services.PreAccounting.Infrastructure.Policies
{
    public class EditDocumentRequirement : IAuthorizationRequirement
    {
        public EditDocumentRequirement()
        {
        }
    }
}