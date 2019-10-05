using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.MasterData.Common
{
    public interface IForeignExchangeRateService
    {
        Task<FxRateConvertResult> Convert(string currencyCodeFrom, string currencyCodeTo, decimal value, DateTime? fxRateDate);
    }
}
