using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface IFreezeRepository
    {
        Task<DateTime?> GetFreezeNotClosedAsync(string company, long dataVersionId);
    }
}
