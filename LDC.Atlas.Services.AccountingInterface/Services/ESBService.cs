using AutoMapper;
using LDC.Atlas.Services.AccountingInterface.Configuration;
using LDC.Atlas.Services.AccountingInterface.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace LDC.Atlas.Services.AccountingInterface.Services
{
    public class ESBService : IESBService
    {
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly ESBSettings _settings;
        private Uri requestUri;

        public ESBService(ILogger<ESBService> logger, IOptions<ESBSettings> settings, IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
        }

        public async Task<string> CallESBClient(string xmlMessageForAccounting, DocumentType documentTypeId, int tAorJLTypeId)
        {
            TAType tAType;
            JLType jLType;
            if (documentTypeId == DocumentType.ManualTemporaryAdjustment)
            {
                tAType = (TAType)tAorJLTypeId;
                if (tAType == TAType.ManualMarkToMarket || tAType == TAType.FxDealMonthTemporaryAdjustment)
                {
                    requestUri = new Uri(_settings.EnvironmentLinkMTM);
                }

                if (tAType == TAType.ManualTemporaryAdjustment || tAType == TAType.MonthEndTemporaryAdjustment)
                {
                    requestUri = new Uri(_settings.EnvironmentLinkAccrual);
                }
            }
            else if (documentTypeId == DocumentType.RegularJournal)
            {
                jLType = (JLType)tAorJLTypeId;
                if (jLType == JLType.ManualRegularJournal || jLType == JLType.Revaluation)
                {
                    requestUri = new Uri(_settings.EnvironmentLinkJournalEntry);
                }
            }
            else
            {
                switch (documentTypeId)
                {
                    case DocumentType.PurchaseInvoice:
                        requestUri = new Uri(_settings.EnvironmentLinkCommercial);
                        break;
                    case DocumentType.SalesInvoice:
                        requestUri = new Uri(_settings.EnvironmentLinkCommercial);
                        break;
                    case DocumentType.CreditNote:
                        requestUri = new Uri(_settings.EnvironmentLinkCommercial);
                        break;
                    case DocumentType.DebitNote:
                        requestUri = new Uri(_settings.EnvironmentLinkCommercial);
                        break;
                    case DocumentType.CashReceipt:
                        requestUri = new Uri(_settings.EnvironmentLinkAccPayment);
                        break;
                    case DocumentType.CashPay:
                        requestUri = new Uri(_settings.EnvironmentLinkAccPayment);
                        break;
                    case DocumentType.MatchingCash:
                        requestUri = new Uri(_settings.EnvironmentLinkAccPayment);
                        break;
                    case DocumentType.FxDealJournal:
                        requestUri = new Uri(_settings.EnvironmentLinkDerivative);
                        break;
                }
            }

            var httpClientHandler = new HttpClientHandler()
            {
                Credentials = new NetworkCredential(_settings.UserName, _settings.Password, _settings.Domain),
            };
            var client = new HttpClient(httpClientHandler);

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Xml));

            var stringContent = new StringContent(xmlMessageForAccounting, Encoding.UTF8, MediaTypeNames.Application.Xml);

            _logger.LogInformation("Calling ESB at {Atlas_EsbUri} with {Atlas_EsbMessage}", requestUri, xmlMessageForAccounting);

            // Sending request to esb
            var response = await client.PostAsync(requestUri, stringContent);

                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Calling ESB API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                    throw new Exception(content);
                }
                else
                {
                    var xmlResponse = await response.Content.ReadAsStringAsync();

                    _logger.LogInformation("Calling ESB API successed with content {Atlas_HttpResponseContent}.", response.StatusCode, xmlResponse);

                    XmlDocument xmlDocument = new XmlDocument();
                    xmlDocument.LoadXml(xmlResponse);
                    var uuid = xmlDocument.InnerText;

                    return uuid;
                }
        }
    }
}
