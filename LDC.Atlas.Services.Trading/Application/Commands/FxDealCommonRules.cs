using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Trading.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    internal static class FxDealCommonRules
    {
        internal static async Task ValidateFxDeal(FxDeal fxDeal, IIdentityService identityService, IMasterDataService masterDataService, IUserService userService, ISystemDateTimeService systemDateTimeService)
        {
       
            var departments = await masterDataService.GetDepartmentsAsync(fxDeal.CompanyId);

            if (!departments.Any(d => d.DepartmentId == fxDeal.DepartmentId))
            {
                throw new AtlasBusinessException($"The department {fxDeal.DepartmentId} does not belong to the {fxDeal.CompanyId} company.");
            }

            var trader = await userService.GetUserByIdAsync(fxDeal.TraderId);

            if (trader == null)
            {
                throw new NotFoundException("User", fxDeal.TraderId);
            }

            if (!trader.Permissions.Any(p => p.CompanyId == fxDeal.CompanyId && p.IsTrader))
            {
                throw new AtlasBusinessException($"The user {fxDeal.TraderId} is not configured as a trader for company {fxDeal.CompanyId}.");
            }

            var companyDate = await systemDateTimeService.GetCompanyDate(fxDeal.CompanyId);

            // The date entered in the Contract date field by the user is not in the future.
            if (fxDeal.ContractDate.Date > companyDate.Date)
            {
                throw new AtlasBusinessException($"The contract date cannot be in the future. Company date: {companyDate.Date}");
            }

            // The department code must belong to the list of departments attached to the user’s account.
            var user = await userService.GetUserByIdAsync(identityService.GetUserAtlasId());

            var companyPermissions = user.Permissions
                .FirstOrDefault(p => p.CompanyId == fxDeal.CompanyId);

            var userDepartments = companyPermissions.Departments
                .Select(department => department.DepartmentId).ToList();

            if (!companyPermissions.AllDepartments && !userDepartments.Contains(fxDeal.DepartmentId))
            {
                throw new AtlasBusinessException($"The department {fxDeal.DepartmentId} does not belong to the list of departments attached to the user’s account.");
            }

            // The FX Deal type must belong to the Deal type master data
            var fxTradeTypes = await masterDataService.GetFxTradeTypes(fxDeal.CompanyId);
            if (!fxTradeTypes.Any(n => n.FxTradeTypeId == fxDeal.FxTradeTypeId))
            {
                throw new AtlasBusinessException($"The FX Deal type {fxDeal.FxTradeTypeId} does not belong to the company {fxDeal.CompanyId}.");
            }

            // Settled amount calculation
            // The value is calculated by multiplying or dividing (depending on M/D field) the “Dealt amount” field’s value by the “Spot ROE” field’s value.
            var settledAmount = fxDeal.Amount * (fxDeal.SpotRateType == "D" ? 1 / fxDeal.SpotRate : fxDeal.SpotRate);

            // TODO: tolerance band on Spot ROE

            // Traded ROE field is the sum of the “Spot ROE” and “FW Points”
            var tradedRoe = fxDeal.SpotRate + fxDeal.FwPoints;

            // The Nominal account (Deal) must belong to the Nominal account master data assigned to the company.
            var nominalAccounts = await masterDataService.GetNominalAccountsAsync(fxDeal.CompanyId);
            if (!nominalAccounts.Any(n => n.NominalAccountId == fxDeal.NominalAccountId))
            {
                throw new AtlasBusinessException($"The Nominal account (Deal) {fxDeal.NominalAccountId} does not belong to the company {fxDeal.CompanyId}.");
            }

            // The Nominal account (Settlement) must belong to the Nominal account master data assigned to the company.
            if (!nominalAccounts.Any(n => n.NominalAccountId == fxDeal.SettlementNominalAccountId))
            {
                throw new AtlasBusinessException($"The Nominal account (Settlement) {fxDeal.NominalAccountId} does not belong to the company {fxDeal.CompanyId}.");
            }

            // The Bank/broker” must belong to the the list of counterparties assigned to the company and having the value “Bank” in “Account type” field
            var counterparties = await masterDataService.GetCounterpartiesAsync(fxDeal.CompanyId);
            if (!counterparties.Any(c => c.CounterpartyID == fxDeal.CounterpartyId))
            {
                throw new AtlasBusinessException($"The counterparty {fxDeal.CounterpartyId} does not belong to the company {fxDeal.CounterpartyId}.");
            }
        }
    }
}
