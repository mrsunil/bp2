using LDC.Atlas.Document.Common.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Collections.Generic;

namespace LDC.Atlas.Document.Common.HealthChecks.DependencyInjection
{
    public static class ReportingServicesHealthCheckBuilderExtensions
    {
        private const string ReportingServicesName = "reportingservices";

        /// <summary>
        /// Add a health check for SqlServer services.
        /// </summary>
        /// <param name="builder">The <see cref="IHealthChecksBuilder"/>.</param>
        /// <param name="reportingServicesConfiguration">The SSRS configuration to be used.</param>
        /// <param name="name">The health check name. Optional. If <c>null</c> the type name 'reportingservices' will be used for the name.</param>
        /// <param name="failureStatus">
        /// The <see cref="HealthStatus"/> that should be reported when the health check fails. Optional. If <c>null</c> then
        /// the default status of <see cref="HealthStatus.Unhealthy"/> will be reported.
        /// </param>
        /// <param name="tags">A list of tags that can be used to filter sets of health checks. Optional.</param>
        /// <returns>The <see cref="IHealthChecksBuilder"/>.</returns>
        public static IHealthChecksBuilder AddReportingServicesHealthCheck(this IHealthChecksBuilder builder, ReportingServicesConfiguration reportingServicesConfiguration, string name = null, HealthStatus? failureStatus = HealthStatus.Unhealthy, IEnumerable<string> tags = null)
        {
            return builder.Add(new HealthCheckRegistration(
                name ?? ReportingServicesName,
                sp => new ReportingServicesHealthCheck(reportingServicesConfiguration),
                failureStatus,
                tags));
        }
    }
}
