using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities.Bold
{
    public interface ICommercialInvoiceClient
    {
        string BaseUrl { get; set; }

        Task<CommercialInvoiceClient.CommercialInvoiceResponse> BookCommercialInvoiceAsync(string resourceID, string path, CommercialInvoiceRoot commercialInvoice);

        Task<CommercialInvoiceClient.CommercialInvoiceResponse> BookCommercialInvoiceAsync(string resourceID, string path, CommercialInvoiceRoot commercialInvoice, CancellationToken cancellationToken);
    }
}