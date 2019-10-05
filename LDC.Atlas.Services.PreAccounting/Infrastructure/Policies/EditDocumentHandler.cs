using LDC.Atlas.Services.PreAccounting.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Infrastructure.Policies
{
    public class EditDocumentHandler : AuthorizationHandler<EditDocumentRequirement, AccountingDocument>
    {
        public EditDocumentHandler()
        {
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            EditDocumentRequirement requirement,
            AccountingDocument accountingDocument)
        {
           context.Succeed(requirement);
           return Task.CompletedTask;
        }
    }
}
