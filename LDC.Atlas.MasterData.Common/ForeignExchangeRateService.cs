using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.MasterData.Common.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.MasterData.Common
{
    public class ForeignExchangeRateService : IForeignExchangeRateService
    {
        private readonly IMasterDataRepository _masterDataRepository;
        private readonly IDistributedCache _distributedCache;

        private IDictionary<string, FxRate> _cachedFxRates = new Dictionary<string, FxRate>();

        public ForeignExchangeRateService(IMasterDataRepository masterDataRepository, IDistributedCache distributedCache)
        {
            _masterDataRepository = masterDataRepository ?? throw new ArgumentNullException(nameof(masterDataRepository));
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
        }

        public async Task<FxRateConvertResult> Convert(string currencyCodeFrom, string currencyCodeTo, decimal value, DateTime? fxRateDate)
        {
            var currencies = await LoadCurrencies();

            var currencyFrom = currencies.FirstOrDefault(c => c.CurrencyCode == currencyCodeFrom);
            var currencyTo = currencies.FirstOrDefault(c => c.CurrencyCode == currencyCodeTo);

            if (currencyFrom == null)
            {
                throw new AtlasBusinessException($"Invalid currency code: {currencyCodeFrom}.");
            }

            if (currencyTo == null)
            {
                throw new AtlasBusinessException($"Invalid currency code: {currencyCodeTo}.");
            }

            if (currencyFrom == currencyTo)
            {
                return new FxRateConvertResult { ConvertedValue = value, Value = value, Rate = 1 };
            }

            if (!currencyFrom.IsDollar() && !currencyTo.IsDollar())
            {
                // None is in USD, just make the conversion is USD then in the final ccy
                var tempResult = await Convert(currencyCodeFrom, "USD", value, fxRateDate);
                var secondResult = await Convert("USD", currencyCodeTo, tempResult.ConvertedValue.Value, fxRateDate);
                return new FxRateConvertResult { Value = value, Rate = tempResult.Rate.Value * secondResult.Rate.Value, ConvertedValue = secondResult.ConvertedValue, RateType = tempResult.RateType };
            }

            var fxRate = await GetFxRate(currencyFrom.IsDollar() ? currencyTo.CurrencyCode : currencyFrom.CurrencyCode, fxRateDate ?? DateTime.Today);

            decimal? convertedValue = null;
            decimal? rate = null;

            if (fxRate != null)
            {
                // From USD to Currency
                if (currencyFrom.IsDollar())
                {
                    rate = currencyTo.RoeType == "M" ? 1 / fxRate.Rate : fxRate.Rate;
                }

                // From Currency to USD
                else
                {
                    rate = currencyFrom.RoeType == "M" ? fxRate.Rate : 1 / fxRate.Rate;
                }

                convertedValue = value * rate;
            }

            return new FxRateConvertResult
            {
                Value = value,
                Rate = rate,
                ConvertedValue = convertedValue,
                RateType = currencyFrom.RoeType == "M" ? RateTypeEnum.M : RateTypeEnum.D
            };
        }

        private async Task<List<Currency>> LoadCurrencies()
        {
            // Retrieve data from cache
            string cacheKey = $"Masterdata_Currencies";
            var cachedJson = await _distributedCache.GetStringAsync(cacheKey);

            if (cachedJson != null)
            {
                var cachedCurrencies = JsonConvert.DeserializeObject<List<Currency>>(cachedJson);

                return cachedCurrencies;
            }

            var currencies = (await _masterDataRepository.GetCurrenciesAsync()).ToList();

            // Save the data in cache
            var jsonToCache = JsonConvert.SerializeObject(currencies);
            await _distributedCache.SetStringAsync(cacheKey, jsonToCache, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) // TODO: use settings ?
            });

            return currencies;
        }

        private async Task<FxRate> GetFxRate(string currencyCodeToSearch, DateTime dateToSearch)
        {
            var fxRateCacheKey = $"{dateToSearch.ToString("yyyyMMdd", CultureInfo.InvariantCulture)}_{currencyCodeToSearch}";

            _cachedFxRates.TryGetValue(fxRateCacheKey, out var fxRate);

            if (fxRate == null)
            {
                fxRate = await _masterDataRepository.GetFxRateAsync(dateToSearch, currencyCodeToSearch);

                if (fxRate != null)
                {
                    _cachedFxRates.Add(fxRateCacheKey, fxRate);
                }
            }

            return fxRate;
        }
    }
}