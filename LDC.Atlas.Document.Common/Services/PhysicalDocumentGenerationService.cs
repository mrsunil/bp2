using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Models;
using LDC.Atlas.Document.Common.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Services
{
    public class PhysicalDocumentGenerationService : IPhysicalDocumentGenerationService
    {
        private readonly IIdentityService _identityService;
        private readonly IDistributedCache _distributedCache;
        private readonly IDocumentTypeRepository _documentTypeRepository;
        private readonly ILogger<PhysicalDocumentGenerationService> _logger;
        private readonly IOptions<ReportingServicesConfiguration> _reportingServicesConfiguration;

        public PhysicalDocumentGenerationService(ILogger<PhysicalDocumentGenerationService> logger, IOptions<ReportingServicesConfiguration> reportingServicesConfiguration, IIdentityService identityService, IDistributedCache distributedCache, IDocumentTypeRepository documentTypeRepository)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
            _reportingServicesConfiguration = reportingServicesConfiguration ?? throw new ArgumentNullException(nameof(reportingServicesConfiguration));
            _documentTypeRepository = documentTypeRepository ?? throw new ArgumentNullException(nameof(documentTypeRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            // Setting for ASP.NET Core on Linux: https://github.com/dotnet/corefx/issues/28961#issuecomment-400803703
            AppContext.SetSwitch("System.Net.Http.UseSocketsHttpHandler", false);
        }

        public async Task<DocumentResponse> GenerateDocument(string reportPath, IDictionary<string, string> parameters, string format)
        {
            try
            {
                parameters.Add("SamAccountName", _identityService.GetUserName());

                var renderResponse = await RenderReport(reportPath, parameters, format);

                return new DocumentResponse
                {
                    Result = renderResponse.Result,
                    Encoding = renderResponse.Encoding,
                    Extension = renderResponse.Extension,
                    MimeType = renderResponse.MimeType
                };
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error generating document from SSRS.");

                throw new Exception("The SSRS instance is not available.", e);
            }
        }

        public async Task<IEnumerable<DocumentTemplate>> GetTemplates(PhysicalDocumentType physicalDocumentType, string company, bool recursive, string module = "")
        {
            var documentTypes = await _documentTypeRepository.GetGeneratedDocumentTypesAsync();

            var documentType = documentTypes.First(t => t.PhysicalDocumentTypeId == (int)physicalDocumentType);

            // Retrieve data from cache
            string cacheKey = $"SSRS_Templates_{company}_{documentType.PhysicalDocumentTypeId}_{recursive}_{module}";
            var cachedJson = await _distributedCache.GetStringAsync(cacheKey);

            if (cachedJson != null)
            {
                var cachedDocumentTemplates = JsonConvert.DeserializeObject<List<DocumentTemplate>>(cachedJson);

                return cachedDocumentTemplates;
            }

            try
            {
                var paths = documentType.TemplatesPaths.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

                List<ReportService2010.CatalogItem> catalogItems = new List<ReportService2010.CatalogItem>();

                foreach (var path in paths)
                {
                    var templatesPath = path.Replace("{company}", company);

                    if (physicalDocumentType == PhysicalDocumentType.CustomReport && module != "module")
                    {
                        templatesPath = path + @"/" + company + @"/" + module;
                    }

                    var companyCatalogItems = await ListChildren(templatesPath, true);

                    catalogItems.AddRange(companyCatalogItems);

                    if (physicalDocumentType == PhysicalDocumentType.CustomReport)
                    {
                        catalogItems.RemoveAll(catalog => catalog.Path.ToLower().Contains(@"/archive/"));
                    }
                }

                var documentTemplates = catalogItems
                    .Where(i => i.TypeName == "Report" && !i.Hidden)
                    //&& (i.Name.StartsWith(company, StringComparison.InvariantCultureIgnoreCase) || i.Name.StartsWith("cm", StringComparison.InvariantCultureIgnoreCase))
                    //&& i.Name.IndexOf(keyword, StringComparison.InvariantCultureIgnoreCase) >= 0)
                    .Select(i => new DocumentTemplate
                    {
                        Id = i.ID,
                        Name = i.Name,
                        Path = i.Path,
                        Description = i.Description,
                        CreatedDateTime = i.CreationDate,
                        CreatedBy = i.CreatedBy,
                        ModifiedDateTime = i.ModifiedDate,
                        ModifiedBy = i.ModifiedBy
                    }).ToList();

                // Save the data in cache
                var jsonToCache = JsonConvert.SerializeObject(documentTemplates);
                await _distributedCache.SetStringAsync(cacheKey, jsonToCache, new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) // TODO: use settings ?
                });

                return documentTemplates.OrderBy(doc => doc.Name);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error retrieving templates from SSRS.");

                return Enumerable.Empty<DocumentTemplate>();
            }
        }

        public async Task<DocumentTemplate> GetTemplateByPath(string reportPath, PhysicalDocumentType documentType, string company)
        {
            var templates = await GetTemplates(documentType, company, true);
            var template = templates.FirstOrDefault(t => t.Path == reportPath);

            return template;
        }

        private async Task<ReportService2010.CatalogItem[]> ListChildren(string folderPath, bool recursive)
        {
            var rsClient = CreateReportService2010Client();

            ReportService2010.TrustedUserHeader trustedUserHeader = new ReportService2010.TrustedUserHeader();

            ReportService2010.ListChildrenResponse listChildrenResponse = await rsClient.ListChildrenAsync(trustedUserHeader, folderPath, recursive);

            return listChildrenResponse.CatalogItems;
        }

        private ReportExecution2005.ReportExecutionServiceSoapClient CreateReportExecution2005Client()
        {
            if (!Enum.TryParse<HttpClientCredentialType>(
                _reportingServicesConfiguration.Value.CredentialType,
                out var httpClientCredentialType))
            {
                throw new Exception($"Invalid value for CredentialType: {_reportingServicesConfiguration.Value.CredentialType}. Check the settings file.");
            }

            var rsBinding = new BasicHttpBinding
            {
                Security =
                {
                    Mode = _reportingServicesConfiguration.Value.Execution2005Url.StartsWith("https", StringComparison.InvariantCultureIgnoreCase) ? BasicHttpSecurityMode.Transport : BasicHttpSecurityMode.TransportCredentialOnly,
                    Transport = { ClientCredentialType = httpClientCredentialType }
                },
                MaxReceivedMessageSize = 10485760 // 10MB size limit on response to allow for larger files
            };

            EndpointAddress rsEndpointAddress = new EndpointAddress(_reportingServicesConfiguration.Value.Execution2005Url);

            // Create the execution service SOAP Client
            var rsClient = new ReportExecution2005.ReportExecutionServiceSoapClient(rsBinding, rsEndpointAddress);
            rsClient.Endpoint.EndpointBehaviors.Add(new LogBehavior());

            // Setup access credentials
            var clientCredentials = new NetworkCredential(_reportingServicesConfiguration.Value.UserName, _reportingServicesConfiguration.Value.Password, _reportingServicesConfiguration.Value.Domain);
            rsClient.ClientCredentials.Windows.AllowedImpersonationLevel = System.Security.Principal.TokenImpersonationLevel.Impersonation;
            rsClient.ClientCredentials.Windows.ClientCredential = clientCredentials;

            rsClient.ClientCredentials.UserName.UserName = !string.IsNullOrWhiteSpace(_reportingServicesConfiguration.Value.Domain) ? $"{_reportingServicesConfiguration.Value.Domain}\\{_reportingServicesConfiguration.Value.UserName}" : _reportingServicesConfiguration.Value.UserName;
            rsClient.ClientCredentials.UserName.Password = _reportingServicesConfiguration.Value.Password;

            return rsClient;
        }

        private ReportService2010.ReportingService2010SoapClient CreateReportService2010Client()
        {
            if (!Enum.TryParse<HttpClientCredentialType>(
                _reportingServicesConfiguration.Value.CredentialType,
                out var httpClientCredentialType))
            {
                throw new Exception($"Invalid value for CredentialType: {_reportingServicesConfiguration.Value.CredentialType}. Check the settings file.");
            }

            // https://blogs.msdn.microsoft.com/dataaccesstechnologies/2017/09/19/reporting-services-web-services-with-net-core-2/
            var rsBinding = new BasicHttpBinding
            {
                Security =
                {
                    Mode = _reportingServicesConfiguration.Value.Service2010Url.StartsWith("https", StringComparison.InvariantCultureIgnoreCase) ? BasicHttpSecurityMode.Transport : BasicHttpSecurityMode.TransportCredentialOnly,
                    Transport = { ClientCredentialType = httpClientCredentialType }
                },
                MaxReceivedMessageSize = 10485760 // 10MB size limit on response to allow for larger files
            };

            EndpointAddress rsEndpointAddress = new EndpointAddress(_reportingServicesConfiguration.Value.Service2010Url);

            ReportService2010.ReportingService2010SoapClient rsClient = new ReportService2010.ReportingService2010SoapClient(rsBinding, rsEndpointAddress);

            rsClient.Endpoint.EndpointBehaviors.Add(new LogBehavior());

            var clientCredentials = new NetworkCredential(_reportingServicesConfiguration.Value.UserName, _reportingServicesConfiguration.Value.Password, _reportingServicesConfiguration.Value.Domain);
            rsClient.ClientCredentials.Windows.AllowedImpersonationLevel = System.Security.Principal.TokenImpersonationLevel.Impersonation;
            rsClient.ClientCredentials.Windows.ClientCredential = clientCredentials;

            rsClient.ClientCredentials.UserName.UserName = !string.IsNullOrWhiteSpace(_reportingServicesConfiguration.Value.Domain) ? $"{_reportingServicesConfiguration.Value.Domain}\\{_reportingServicesConfiguration.Value.UserName}" : _reportingServicesConfiguration.Value.UserName;
            rsClient.ClientCredentials.UserName.Password = _reportingServicesConfiguration.Value.Password;

            return rsClient;
        }

        private async Task<ReportExecution2005.RenderResponse> RenderReport(string reportPath, IDictionary<string, string> parameters, string format)
        {
            var rsClient = CreateReportExecution2005Client();

            ReportExecution2005.TrustedUserHeader trustedUserHeader = new ReportExecution2005.TrustedUserHeader();

            // Load the report
            var taskLoadReport = await rsClient.LoadReportAsync(trustedUserHeader, reportPath, null);

            // Set the parameters asked for by the report
            if (parameters != null)
            {
                var reportParameters = taskLoadReport.executionInfo.Parameters.Where(x => parameters.ContainsKey(x.Name)).Select(x => new ReportExecution2005.ParameterValue { Name = x.Name, Value = parameters[x.Name] }).ToArray();
                await rsClient.SetExecutionParametersAsync(taskLoadReport.ExecutionHeader, trustedUserHeader, reportParameters, "en-us");
            }

            // Run the report
            const string deviceInfo = @"<DeviceInfo><Toolbar>False</Toolbar></DeviceInfo>";
            var response = await rsClient.RenderAsync(new ReportExecution2005.RenderRequest(taskLoadReport.ExecutionHeader, trustedUserHeader, format, deviceInfo));

            return response;
        }
    }

    public static class PhysicalDocumentFormat
    {
        public const string XML = "XML";
        public const string CSV = "CSV";
        public const string ATOM = "ATOM";
        public const string PDF = "PDF";
        public const string RGDI = "RGDI";
        public const string HTML40 = "HTML4.0";
        public const string MHTML = "MHTML";
        public const string EXCEL = "EXCEL";
        public const string EXCELOPENXML = "EXCELOPENXML";
        public const string RPL = "RPL";
        public const string IMAGE = "IMAGE";
        public const string WORD = "WORD";
        public const string WORDOPENXML = "WORDOPENXML";
    }

    public class DocumentResponse
    {
#pragma warning disable CA1819 // Properties should not return arrays
        public byte[] Result { get; set; }
#pragma warning restore CA1819 // Properties should not return arrays

        public string Extension { get; set; }

        public string MimeType { get; set; }

        public string Encoding { get; set; }
    }

    public class DocumentTemplate
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }

    public class LogBehavior : IEndpointBehavior
    {
        public void AddBindingParameters(
            ServiceEndpoint endpoint,
            BindingParameterCollection bindingParameters)
        {
        }

        public void ApplyClientBehavior(
            ServiceEndpoint endpoint,
            ClientRuntime clientRuntime)
        {
            clientRuntime.ClientMessageInspectors.Add(new LogMessageInspector());
        }

        public void ApplyDispatchBehavior(
            ServiceEndpoint endpoint,
            EndpointDispatcher endpointDispatcher)
        {
        }

        public void Validate(
            ServiceEndpoint endpoint)
        {
        }
    }

    public class LogMessageInspector : IClientMessageInspector
    {
        public void AfterReceiveReply(
            ref Message reply,
            object correlationState)
        {
            System.Diagnostics.Trace.WriteLine(
                "Received the following reply: '{0}'", reply.ToString());
        }

        public object BeforeSendRequest(
            ref Message request,
            IClientChannel channel)
        {
            System.Diagnostics.Trace.WriteLine(
                "Sending the following request: '{0}'", request.ToString());
            return null;
        }
    }
}
