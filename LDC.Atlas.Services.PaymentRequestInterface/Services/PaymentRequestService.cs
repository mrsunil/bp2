using AutoMapper;
using LDC.Atlas.Services.PaymentRequestInterface.Application.Commands;
using LDC.Atlas.Services.PaymentRequestInterface.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Globalization;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Services
{
    public class PaymentRequestService : IPaymentRequestService
    {
        private readonly ESBSettings _settings;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public PaymentRequestService(IOptions<ESBSettings> settings, ILogger<PaymentRequestService> logger, IMapper mapper)
        {
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<string> CallESBClient(ProcessInterfaceDataChangeLogsRequest request, string paymentRequestMessage, string legalEntityCode)
        {
            HttpsTransportBindingElement httpsTransport = new HttpsTransportBindingElement();
            httpsTransport.AuthenticationScheme = System.Net.AuthenticationSchemes.Basic;
            CustomBinding esbCustomBinding = new CustomBinding();
            TextMessageEncodingBindingElement esbTextMessageEncod = new TextMessageEncodingBindingElement();
            esbTextMessageEncod.MessageVersion = MessageVersion.CreateVersion(EnvelopeVersion.Soap12, AddressingVersion.None);
            esbTextMessageEncod.WriteEncoding = Encoding.UTF8;

            esbCustomBinding.Elements.Add(esbTextMessageEncod);
            esbCustomBinding.Elements.Add(httpsTransport);

            var uri = string.Format(CultureInfo.InvariantCulture, "{0}/ws/LDC.API.processPaymentOrder_v1.soap:ws/LDC_API_processPaymentOrder_v1_soap_ws_Port", _settings.EnvironmentLink);
            EndpointAddress esbRemoteAddress = new EndpointAddress(uri);
            ESBPaymentRequestClient.ws_PortTypeClient esbClient = new ESBPaymentRequestClient.ws_PortTypeClient(esbCustomBinding, esbRemoteAddress);
            esbClient.ClientCredentials.UserName.UserName = _settings.UserName;
            esbClient.ClientCredentials.UserName.Password = _settings.Password;
            string fileName = string.Format(CultureInfo.InvariantCulture, "{0}_{1}_{2}.{3}", _settings.FileNameCompany, legalEntityCode, DateTime.UtcNow.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture), _settings.FileNameFormat);

            _logger.LogInformation("Calling ESB at {Atlas_EsbUri} with {Atlas_EsbFileName} {Atlas_EsbMessage}", uri, fileName, paymentRequestMessage);

            ESBPaymentRequestClient.processResponse esbResponse = await esbClient.processAsync(fileName, legalEntityCode, Encoding.UTF8.GetBytes(paymentRequestMessage));
            return esbResponse.uuid;
        }
    }
}
