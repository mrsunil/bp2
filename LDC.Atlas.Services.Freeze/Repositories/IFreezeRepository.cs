using LDC.Atlas.Services.Freeze.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Repositories
{
    public interface IFreezeRepository
    {
        Task<DataVersion> GetFreezeAsync(int dataVersionId);

        Task<DataVersion> GetFreezeAsync(string companyId, DateTime freezeDate, DataVersionType dataVersionTypeId);

        Task<int> CreateFreezeAsync(string companyId, DateTime freezeDate, DataVersionType dataVersionTypeId);

        Task DeleteFreezeAsync(int dataVersionId);

        Task RecalculateFreezeAsync(int dataVersionId, long userId, bool recalculateAccEntries);

        Task PurgeFreezesAsync(string companyId);

        Task<IEnumerable<MonthEnd>> IsMonthEndFreeze(int dataVersionId);

        Task<bool> GetDuplicatedFreezeAsync(string company, DateTime freezeDate, DataVersionType dataVersionTypeId);
    }
}
