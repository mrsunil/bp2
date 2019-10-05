using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.SharedRules
{
    public static class AmountConverter
    {
        /// <summary>
        /// Converts an amount from one currency to another using the rates of exchange between those
        /// currencies and USD.
        /// </summary>
        /// <param name="amountToConvert">Amount to convert in original currency</param>
        /// <param name="rateFromAmountToUSD">Rate of the amount in the original currency, compared to USD</param>
        /// <param name="rateTypeFromAmountToUSD">Type of the rate to USD of the original currency (M or D)</param>
        /// <param name="rateFromTargetToUSDCCY">Rate of the target currency, compared to USD</param>
        /// <param name="rateTypeFromTargetToCCY">Type of the rate to USD of the target currency (M or D)</param>
        /// <param name="precision">Precision of the calculated result. The method calls Math.Round to the final calculation</param>
        /// <returns>Converted amount</returns>
        public static decimal ConvertAmountThroughIntermediateRoeToUSD(
            decimal amountToConvert,
            decimal rateFromAmountToUSD,
            string rateTypeFromAmountToUSD,
            decimal rateFromTargetToUSDCCY,
            string rateTypeFromTargetToCCY,
            int precision)
        {
            decimal usdAmount = amountToConvert
                * (rateTypeFromAmountToUSD == "M" ? rateFromAmountToUSD : 1)
                / (rateTypeFromAmountToUSD == "M" ? 1 : rateFromAmountToUSD);
            decimal finalAmount = usdAmount
                * (rateTypeFromTargetToCCY == "M" ? 1 : rateFromTargetToUSDCCY)
                / (rateTypeFromTargetToCCY == "M" ? rateFromTargetToUSDCCY : 1);
            return Math.Round(finalAmount, precision, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
        }
    }
}
