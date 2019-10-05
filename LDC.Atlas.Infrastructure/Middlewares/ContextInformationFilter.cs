using LDC.Atlas.Application.Core;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Infrastructure.Utils;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Middlewares
{
    /// <summary>
    /// An ASP.NET Core filter for creating the Atlas context information.
    /// https://andrewlock.net/using-an-iactionfilter-to-read-action-method-parameter-values-in-asp-net-core-mvc/#converting-to-an-asynchronous-filter-with-iasyncactionfilter
    /// </summary>
    public class ContextInformationFilter : IAsyncActionFilter
    {
        private readonly IIdentityService _identityService;
        private readonly IContextInformation _contextInformation;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IDistributedCache _distributedCache;

        public ContextInformationFilter(IIdentityService identityService, IContextInformation contextInformation, ISystemDateTimeService systemDateTimeService, IDistributedCache distributedCache)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _contextInformation = contextInformation ?? throw new ArgumentNullException(nameof(contextInformation));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            _contextInformation.ApiServiceName = AppInfoUtils.AtlasServiceName;
            _contextInformation.ApiActionName = context.ActionDescriptor.DisplayName;

            _contextInformation.UserId = _identityService.GetUserName();

            _contextInformation.ActivityId = System.Diagnostics.Activity.Current?.Id ?? context.HttpContext.TraceIdentifier;

            var company = await GetCompanyInfo(context);

            if (company.HasValue)
            {
                _contextInformation.CompanyId = company.Value.CompanyId;
                _contextInformation.DataVersionId = company.Value.DataVersionId;
            }

            // Execute the rest of the MVC filter pipeline
            await next();
        }

        private async Task<(string CompanyId, int? DataVersionId)?> GetCompanyInfo(ActionExecutingContext context)
        {
            // Check for company parameter in the route
            if (context.ActionArguments.TryGetValue("company", out object value)
                && value is string company)
            {
                // Check for dataVersionId parameter in the route
                if (context.ActionArguments.TryGetValue("dataVersionId", out object value2)
                    && value2 != null && value2 is int dataVersionId)
                {
                    return (company, dataVersionId);
                }
                else
                {
                    var companyDataVersionId = await GetCompanyCurrentDataVersionId(company);
                    return (company, companyDataVersionId);
                }
            }

            // no string parameter called company
            return null;
        }

        private async Task<int?> GetCompanyCurrentDataVersionId(string companyId)
        {
            // Retrieve data from cache
            string cacheKey = $"Company_{companyId}_CurrentDataVersionId";
            var cachedValue = await _distributedCache.GetStringAsync(cacheKey);

            if (cachedValue != null)
            {
                var cachedDataVersionId = JsonConvert.DeserializeObject<int>(cachedValue);

                return cachedDataVersionId;
            }

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(companyId);

            if (dataVersionId != null)
            {
                // Cache the current DataVersionId of the company as it will never change.
                await _distributedCache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(dataVersionId));
            }

            return dataVersionId;
        }
    }
}