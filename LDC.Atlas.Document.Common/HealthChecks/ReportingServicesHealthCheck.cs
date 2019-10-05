using LDC.Atlas.Document.Common.Models;
using LDC.Atlas.Document.Common.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Net;
using System.ServiceModel;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.HealthChecks
{
    public class ReportingServicesHealthCheck : IHealthCheck
    {
        private readonly ReportingServicesConfiguration _reportingServicesConfiguration;

        public ReportingServicesHealthCheck(ReportingServicesConfiguration reportingServicesConfiguration)
        {
            _reportingServicesConfiguration = reportingServicesConfiguration ?? throw new ArgumentNullException(nameof(reportingServicesConfiguration));

            // Setting for ASP.NET Core on Linux: https://github.com/dotnet/corefx/issues/28961#issuecomment-400803703
            AppContext.SetSwitch("System.Net.Http.UseSocketsHttpHandler", false);
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            try
            {
                var rsClient = CreateReportService2010Client();

                ReportService2010.TrustedUserHeader trustedUserHeader = new ReportService2010.TrustedUserHeader();

                // Call to an arbitrary method
                await rsClient.ListExtensionsAsync(trustedUserHeader, "Render");
            }
            catch (Exception ex)
            {
                return new HealthCheckResult(context.Registration.FailureStatus, exception: ex, description: "ReportService2010 is not available.");
            }

            try
            {
                var rsClient = CreateReportExecution2005Client();

                ReportExecution2005.TrustedUserHeader trustedUserHeader = new ReportExecution2005.TrustedUserHeader();

                // Call to an arbitrary method
                await rsClient.ListRenderingExtensionsAsync(trustedUserHeader);
            }
            catch (Exception ex)
            {
                return new HealthCheckResult(context.Registration.FailureStatus, exception: ex, description: "ReportExecution2005 is not available.");
            }

            return HealthCheckResult.Healthy();
        }

        private ReportService2010.ReportingService2010SoapClient CreateReportService2010Client()
        {
            if (!Enum.TryParse<HttpClientCredentialType>(
                _reportingServicesConfiguration.CredentialType,
                out var httpClientCredentialType))
            {
                throw new Exception($"Invalid value for CredentialType: {_reportingServicesConfiguration.CredentialType}. Check the settings file.");
            }

            // https://blogs.msdn.microsoft.com/dataaccesstechnologies/2017/09/19/reporting-services-web-services-with-net-core-2/
            var rsBinding = new BasicHttpBinding
            {
                Security =
                {
                    Mode = _reportingServicesConfiguration.Service2010Url.StartsWith("https", StringComparison.InvariantCultureIgnoreCase) ? BasicHttpSecurityMode.Transport : BasicHttpSecurityMode.TransportCredentialOnly,
                    Transport = { ClientCredentialType = httpClientCredentialType }
                },
                MaxReceivedMessageSize = 10485760 // 10MB size limit on response to allow for larger files
            };

            EndpointAddress rsEndpointAddress = new EndpointAddress(_reportingServicesConfiguration.Service2010Url);

            ReportService2010.ReportingService2010SoapClient rsClient = new ReportService2010.ReportingService2010SoapClient(rsBinding, rsEndpointAddress);

            rsClient.Endpoint.EndpointBehaviors.Add(new LogBehavior());

            var clientCredentials = new NetworkCredential(_reportingServicesConfiguration.UserName, _reportingServicesConfiguration.Password, _reportingServicesConfiguration.Domain);
            rsClient.ClientCredentials.Windows.AllowedImpersonationLevel = System.Security.Principal.TokenImpersonationLevel.Impersonation;
            rsClient.ClientCredentials.Windows.ClientCredential = clientCredentials;

            rsClient.ClientCredentials.UserName.UserName = !string.IsNullOrWhiteSpace(_reportingServicesConfiguration.Domain) ? $"{_reportingServicesConfiguration.Domain}\\{_reportingServicesConfiguration.UserName}" : _reportingServicesConfiguration.UserName;
            rsClient.ClientCredentials.UserName.Password = _reportingServicesConfiguration.Password;

            return rsClient;
        }

        private ReportExecution2005.ReportExecutionServiceSoapClient CreateReportExecution2005Client()
        {
            if (!Enum.TryParse<HttpClientCredentialType>(
                _reportingServicesConfiguration.CredentialType,
                out var httpClientCredentialType))
            {
                throw new Exception($"Invalid value for CredentialType: {_reportingServicesConfiguration.CredentialType}. Check the settings file.");
            }

            var rsBinding = new BasicHttpBinding
            {
                Security =
                {
                    Mode = _reportingServicesConfiguration.Execution2005Url.StartsWith("https", StringComparison.InvariantCultureIgnoreCase) ? BasicHttpSecurityMode.Transport : BasicHttpSecurityMode.TransportCredentialOnly,
                    Transport = { ClientCredentialType = httpClientCredentialType }
                },
                MaxReceivedMessageSize = 10485760 // 10MB size limit on response to allow for larger files
            };

            EndpointAddress rsEndpointAddress = new EndpointAddress(_reportingServicesConfiguration.Execution2005Url);

            // Create the execution service SOAP Client
            var rsClient = new ReportExecution2005.ReportExecutionServiceSoapClient(rsBinding, rsEndpointAddress);
            rsClient.Endpoint.EndpointBehaviors.Add(new LogBehavior());

            // Setup access credentials
            var clientCredentials = new NetworkCredential(_reportingServicesConfiguration.UserName, _reportingServicesConfiguration.Password, _reportingServicesConfiguration.Domain);
            rsClient.ClientCredentials.Windows.AllowedImpersonationLevel = System.Security.Principal.TokenImpersonationLevel.Impersonation;
            rsClient.ClientCredentials.Windows.ClientCredential = clientCredentials;

            rsClient.ClientCredentials.UserName.UserName = !string.IsNullOrWhiteSpace(_reportingServicesConfiguration.Domain) ? $"{_reportingServicesConfiguration.Domain}\\{_reportingServicesConfiguration.UserName}" : _reportingServicesConfiguration.UserName;
            rsClient.ClientCredentials.UserName.Password = _reportingServicesConfiguration.Password;

            return rsClient;
        }
    }
}
