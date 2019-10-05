using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Execution.Common.Queries;
using LDC.Atlas.Execution.Common.Queries.Dto;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using LDC.Atlas.Application.Core.Services;

namespace LDC.Atlas.Execution.Common
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

        internal async Task<int> GetDocumentReferenceYear(DateTime documentDate, string company)
        {
            bool isPostOpClosedPrivilege = false;
            int documentDateYear = 0;
            isPostOpClosedPrivilege = true; // await CheckPrivileges();
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

    internal static class Policies
    {
        public const string PostOpClosedPolicy = "PostOpClosedPolicy";
    }
}