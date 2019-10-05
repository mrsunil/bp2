using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IPaymentTermsRepository
    {
        Task<IEnumerable<PaymentTerms>> GetAllAsync(string company, int? offset, int? limit, bool includeDeactivated = false, string paymentTermCode = null, string description = null);

        Task UpdatePaymentTerm(ICollection<PaymentTerms> listPaymentTerm);
    }
}
