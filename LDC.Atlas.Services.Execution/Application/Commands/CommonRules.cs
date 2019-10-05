using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;


namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class CommonRules
    {

        private readonly IAccountingSetUpQueries _accountingQueries;
        private readonly IAuthorizationService _authorizationService;
        private readonly IIdentityService _identityService;

        public CommonRules()
        {
        }
        public CommonRules(
           IAccountingSetUpQueries accountingQueries,
           IAuthorizationService authorizationService, 
           IIdentityService identityService)
        {
            _accountingQueries = accountingQueries;
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        }
        internal  async Task<int> GetDocumentReferenceYear(DateTime documentDate, string company)
        {
            bool isPostOpClosedPrivilege = false;
            int documentDateYear = 0;
            isPostOpClosedPrivilege = await CheckPrivileges();
            AccountingSetupDto accountingSetup = await _accountingQueries.GetAccountingSetup(company);
             if (IsLastMonthOpenForAccounting(accountingSetup.LastMonthClosed, documentDate, accountingSetup.NumberOfOpenPeriod))
            {
                if (IsOperationLastMonthClosed(accountingSetup.LastMonthClosedForOperation, documentDate))
                {
                    documentDateYear = documentDate.Year;
                }
                else
                {
                    if (isPostOpClosedPrivilege)
                    {
                        documentDateYear = documentDate.Year;
                    }
                    else
                    {
                        int nextOpenMonthForOperations = accountingSetup.LastMonthClosedForOperation.Month + 1;
                        if (nextOpenMonthForOperations > 12)
                        {
                            documentDateYear = accountingSetup.LastMonthClosedForOperation.Year + 1;
                        }
                        else
                        {
                            documentDateYear = accountingSetup.LastMonthClosedForOperation.Year;
                        }

                    }
                }
            }
            else
            {
                int nextOpenMonthForOperations = accountingSetup.LastMonthClosedForOperation.Month + 1;
                if (nextOpenMonthForOperations > 12)
                {
                    documentDateYear = accountingSetup.LastMonthClosedForOperation.Year + 1;
                }
                else
                {
                    documentDateYear = accountingSetup.LastMonthClosedForOperation.Year;
                }
            }
            return documentDateYear;
        }

        private async Task<bool> CheckPrivileges()
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

            return authorizationResult.Succeeded;
        }
        private bool IsOperationLastMonthClosed(DateTime lastMonthForOperation, DateTime documentDate)
        {
            if ((lastMonthForOperation.Year == documentDate.Year && lastMonthForOperation.Month < documentDate.Month) || lastMonthForOperation.Year < documentDate.Year)
            {
                return true;
            }

            return false;
        }
        private bool IsLastMonthOpenForAccounting(DateTime lastMonthForAccounting, DateTime documentDate, int numberOfOpenPeriod)
        {
            if ((lastMonthForAccounting.Year == documentDate.Year && lastMonthForAccounting.Month < documentDate.Month) || lastMonthForAccounting.Year < documentDate.Year)
            {
                return true;
            }

            return false;

        }
    }


 
}

