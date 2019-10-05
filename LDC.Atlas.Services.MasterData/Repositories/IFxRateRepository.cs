using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IFxRateRepository
    {
        Task<IEnumerable<FxRateRecord>> GetAllAsync(IEnumerable<DateTime?> fxRateDate, string viewMode);

        Task ImportAsync(List<FxRateRecord> fxRates);

        Task<FxRate> GetFxRateAsync(DateTime fxRateDate, string currencyCode);

        Task<Guid> InsertIntoStageFxRate(List<FxRateRecord> fxRatesForStage);

        Task ImportFxRateFromStage(Guid importId);

        Task DeleteFxRateFromStage(Guid importId);
    }
}