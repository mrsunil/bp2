using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class FxRatesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxRateRepository _fxRateRepository;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _hostingEnvironment;

        public FxRatesController(IUnitOfWork unitOfWork, IFxRateRepository fxRateRepository, ICurrencyRepository currencyRepository, IForeignExchangeRateService foreignExchangeRateService, ILogger<FxRatesController> logger, IHostingEnvironment hostingEnvironment)
        {
            _unitOfWork = unitOfWork;
            _fxRateRepository = fxRateRepository;
            _currencyRepository = currencyRepository;
            _foreignExchangeRateService = foreignExchangeRateService;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Returns the list of foreign exchange rates.
        /// </summary>
        /// <param name="fxRateDate">The date for which to request the foreign exchange rates. Required in Daily and Monthly view modes.</param>
        /// <param name="viewMode">The view mode (Spot, Daily, Monthly). If not specified, Spot by default.</param>
        /// <param name="inactiveCurrencies">The inactivecurrencies send whether to show active currencies or both .Default it is false</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<FxRate>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<CollectionViewModel<FxRate>>> GetAsync([FromQuery] DateTime? fxRateDate, [FromQuery] string viewMode = FxRateViewMode.Spot, [FromQuery] bool inactiveCurrencies = false)
        {
            if (fxRateDate == null && viewMode != FxRateViewMode.Spot)
            {
                return BadRequest("The fxRateDate is required for viewMode other than Spot.");
            }

            if (viewMode != FxRateViewMode.Spot && viewMode != FxRateViewMode.Daily && viewMode != FxRateViewMode.Monthly)
            {
                return BadRequest("Invalid value for viewMode.");
            }

            IEnumerable<Currency> currencies = (await _currencyRepository.GetAllAsync(inactiveCurrencies)).ToList();
            List<DateTime?> dates = new List<DateTime?>();
            dates.Add(fxRateDate);
            IEnumerable<FxRateRecord> fxRateRecords = await _fxRateRepository.GetAllAsync(dates, viewMode);

            var fxRatesJoinList =
                (from fxRate in fxRateRecords
                 join currency in currencies on fxRate.CurrencyCodeFrom equals currency.CurrencyCode into currenciesFrom
                 from cf in currenciesFrom.DefaultIfEmpty()
                 join currency in currencies on fxRate.CurrencyCodeTo equals currency.CurrencyCode into currenciesTo
                 from ct in currenciesTo.DefaultIfEmpty()
                 select new { FxRate = fxRate, CurrencyFrom = cf, CurrencyTo = ct }).ToList();

            // Filters out the values which do not meet the codes & types (for ex, EUR=>INR, or USD=>EUR if EUR is of type 'M')
            var fxRateRecordsFiltered = fxRatesJoinList
                .Where(r => (r.CurrencyFrom != null && r.CurrencyTo != null) && (r.CurrencyFrom.IsDollar() || r.CurrencyTo.IsDollar()))
                .Where(r => (r.CurrencyFrom != null && r.CurrencyFrom.IsDollar() && r.CurrencyTo.RoeType == "D") ||
                            (r.CurrencyTo != null && r.CurrencyFrom.RoeType == "M" && r.CurrencyTo.IsDollar())).ToList();

            var fxRates =
                (from r in fxRateRecordsFiltered
                 let c = r.CurrencyFrom.RoeType == "M" && !r.CurrencyFrom.IsDollar() ? r.CurrencyFrom : r.CurrencyTo
                 select new FxRate
                 {
                     CurrencyCode = c.CurrencyCode,
                     CurrencyRoeType = c.RoeType,
                     Date = r.FxRate.ValidDateFrom,
                     Rate = r.FxRate.Rate,
                     FwdMonth1 = r.FxRate.FwdMonth1,
                     FwdMonth2 = r.FxRate.FwdMonth2,
                     FwdMonth3 = r.FxRate.FwdMonth3,
                     FwdMonth6 = r.FxRate.FwdMonth6,
                     FwdYear1 = r.FxRate.FwdYear1,
                     FwdYear2 = r.FxRate.FwdYear2,
                     CurrencyIsDeactivated = c.IsDeactivated,
                     CurrencyDescription = c.Description,
                     CreatedBy = r.FxRate.CreatedBy,
                     CreatedDateTime = r.FxRate.CreatedDateTime,
                     ModifiedBy = r.FxRate.ModifiedBy,
                     ModifiedDateTime = r.FxRate.ModifiedDateTime,
                     CreationMode = (r.FxRate.CreationModeId == 0) ? string.Empty : ((CreationMode)r.FxRate.CreationModeId).ToString()
                 })
                .ToList();

            foreach (var currency in currencies)
            {
                if (fxRates.All(r => r.CurrencyCode != currency.CurrencyCode))
                {
                    fxRates.Add(new FxRate
                    {
                        CurrencyCode = currency.CurrencyCode,
                        CurrencyRoeType = currency.RoeType,
                        CurrencyIsDeactivated = currency.IsDeactivated,
                        CurrencyDescription = currency.Description
                    });
                }
            }

            var result =
                fxRates.OrderBy(r => r.CurrencyCode)
                    .Where(r => r.CurrencyCode != "USD")
                    .ToList();

            var response = new CollectionViewModel<FxRate>(result);

            return Ok(response);
        }

        /// <summary>
        /// Imports a list of foreign exchange rates.
        /// </summary>
        /// <param name="fxRates">The foreign exchange rates to add.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.EditFxRatesPolicy)]
        public async Task<IActionResult> ImportFxRates([FromBody, Required] List<FxRateToImport> fxRates)
        {
            IEnumerable<Currency> currencies = (await _currencyRepository.GetAllAsync(true)).ToList();

            List<FxRateRecord> fxRatesToUpdate = new List<FxRateRecord>();

            foreach (var fxRate in fxRates)
            {
                var currency = currencies.FirstOrDefault(c => c.CurrencyCode == fxRate.CurrencyCode);

                if (currency == null)
                {
                    throw new AtlasBusinessException($"Invalid currency code: {fxRate.CurrencyCode}");
                }

                fxRatesToUpdate.Add(new FxRateRecord
                {
                    CurrencyCodeFrom = currency.RoeType == "M" ? fxRate.CurrencyCode : "USD",
                    CurrencyCodeTo = currency.RoeType == "M" ? "USD" : fxRate.CurrencyCode,
                    ValidDateFrom = fxRate.Date,
                    Rate = (fxRate.Rate == null || fxRate.Rate == 0) ? null : fxRate.Rate,
                    FwdMonth1 = fxRate.Rate != 0 ? fxRate.FwdMonth1 : 0,
                    FwdMonth2 = fxRate.Rate != 0 ? fxRate.FwdMonth2 : 0,
                    FwdMonth3 = fxRate.Rate != 0 ? fxRate.FwdMonth3 : 0,
                    FwdMonth6 = fxRate.Rate != 0 ? fxRate.FwdMonth6 : 0,
                    FwdYear1 = fxRate.Rate != 0 ? fxRate.FwdYear1 : 0,
                    FwdYear2 = fxRate.Rate != 0 ? fxRate.FwdYear2 : 0,
                    CreationModeId = fxRate.CreationModeId != 0 ? fxRate.CreationModeId:0
                });
            }

            _unitOfWork.BeginTransaction();

            try
            {
                await _fxRateRepository.ImportAsync(fxRatesToUpdate);

                _unitOfWork.Commit();

                _logger.LogInformation("Foreign exchange rates imported.");

                return Ok();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Get foreign exchange rate for a currency for a specified date.
        /// </summary>
        /// <param name="fxRateDate">The date for which to request the foreign exchange rate.</param>
        /// <param name="currencyCode">The currency code.</param>
        [HttpGet("foreignexchangerate")]
        [ProducesResponseType(typeof(FxRate), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<FxRate>> GetFxRateByDateAsync([FromQuery][Required] DateTime fxRateDate, [FromQuery][Required] string currencyCode)
        {
            var fxRate = await _fxRateRepository.GetFxRateAsync(fxRateDate, currencyCode);

            return Ok(fxRate);
        }

        /// <summary>
        /// Converts the specified value from a currency to another.
        /// </summary>
        /// <param name="currencyCodeFrom">The currency code from.</param>
        /// <param name="currencyCodeTo">The currency code to.</param>
        /// <param name="value">The value to convert.</param>
        /// <param name="fxRateDate">The fx rate date.</param>
        [HttpGet("convert")]
        [ProducesResponseType(typeof(CollectionViewModel<FxRate>), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<Atlas.MasterData.Common.Entities.FxRateConvertResult>> Convert([FromQuery][Required] string currencyCodeFrom, [FromQuery][Required] string currencyCodeTo, [FromQuery][Required] decimal value, DateTime? fxRateDate)
        {
            var result = await _foreignExchangeRateService.Convert(currencyCodeFrom, currencyCodeTo, value, fxRateDate);

            return result;
        }

        [HttpPost("fileupload")]
        [DisableRequestSizeLimit]
        [ProducesResponseType(typeof(ValidatedFxRateManualImport), StatusCodes.Status200OK)]
        public async Task<ActionResult<ValidatedFxRateManualImport>> FileUpload([FromForm, Required] IFormFile file)
        {
            var lines = new List<string>();
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                while (reader.Peek() >= 0)
                {
                    lines.Add(await reader.ReadLineAsync());
                }
            }

            var dataReadFromCsv = lines
                                     .Skip(1)
                                     .Select((l, i) => FxRateCsvLine.ParseFromCsv(l, i))
                                     .ToList();

            var fxRateImporter = new FxRatesCsvImporter(_fxRateRepository, _currencyRepository);

            var validatedResult = await fxRateImporter.ProcessManualFxRatesImport(dataReadFromCsv);

            return Ok(validatedResult);
        }

        [HttpPost("fileupload/{importId}/confirm")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> ConfirmImportFromStage(Guid importId)
        {
            await _fxRateRepository.ImportFxRateFromStage(importId);

            return NoContent();
        }

        [HttpPost("fileupload/{importId}/cancel")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteImportFromStage(Guid importId)
        {
            await _fxRateRepository.DeleteFxRateFromStage(importId);

            return NoContent();
        }
    }

    internal class FxRateValidationError
    {
        public FxRateValidationError(FxRateCsvLine csvLine, string errorCode)
        {
            FxRateCsvLine = csvLine;
            ErrorCode = errorCode;
        }

        public FxRateCsvLine FxRateCsvLine { get; private set; }

        public string ErrorCode { get; private set; }
    }

    internal class FxRatesCsvImporter
    {
        private readonly IFxRateRepository _fxRateRepository;
        private readonly ICurrencyRepository _currencyRepository;

        private static readonly IDictionary<string, string> _errorMessages = new Dictionary<string, string>
        {
            { "INVALID_CURRENCY", "The currency being imported does not exist in the master data."},
            { "INVALID_ROETYPE", "The D/M specified does not correspond to the entry in the master data." },
            { "INVALID_RATE", "The rate of exchange cannot be 0, should be of numeric data type ,cannot be negative and cannot have more than 10 digit after decimal point." },
            { "INVALID_FWDMTH1", "Fwd point 1 month must be numeric, cannot have more than 10 digit after decimal point." },
            { "INVALID_FWDMTH2", "Fwd point 2 months must be numeric, cannot have more than 10 digit after decimal point." },
            { "INVALID_FWDMTH3", "Fwd point 3 months must be numeric, cannot have more than 10 digit after decimal point." },
            { "INVALID_FWDMTH6", "Fwd point 6 months must be numeric, cannot have more than 10 digit after decimal point." },
            { "INVALID_FWDYR1", "Fwd point 1 year must be numeric, cannot have more than 10 digit after decimal point." },
            { "INVALID_FWDYR2", "Fwd point 2 years must be numeric, cannot have more than 10 digit after decimal point." },
            { "INVALID_DATE", "Date cannot be in future and has to be in YYYYMMDD format." },
            { "WARNING_INACTIVE_CURRENCY", "The currency being imported is inactive in the master data."},
            { "WARNING_EXISTINGDATE", "There is already a rate for the specified date." }
        };

        public FxRatesCsvImporter(IFxRateRepository fxRateRepository, ICurrencyRepository currencyRepository)
        {
            _fxRateRepository = fxRateRepository ?? throw new ArgumentNullException(nameof(fxRateRepository));
            _currencyRepository = currencyRepository ?? throw new ArgumentNullException(nameof(currencyRepository));
        }

        /// <summary>
        /// Validates the FXRates data read from CSV.
        /// </summary>
        /// <param name="csvFxRatesData">List of FxRates read from CSV File.</param>
        internal async Task<ValidatedFxRateManualImport> ProcessManualFxRatesImport(List<FxRateCsvLine> csvFxRatesData)
        {
            IEnumerable<Currency> currencies = (await _currencyRepository.GetAllAsync(true)).ToList();

            List<DateTime?> excelDate = new List<DateTime?>();

            foreach (var item in csvFxRatesData)
            {
                if (!string.IsNullOrEmpty(item.Date))
                {
                    excelDate.Add(Convert.ToDateTime(DateTime.ParseExact(item.Date, "yyyyMMdd", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy")));
                }
            }

            IEnumerable<FxRateRecord> existingFxRateRecords = (await _fxRateRepository.GetAllAsync(excelDate, FxRateViewMode.Daily)).ToList();

            var validatedFxRateDataForReport = ValidateData(csvFxRatesData, currencies, existingFxRateRecords);

            List<FxRateRecord> fxRatesToBeStaged = ConvertToFxRateRecord(csvFxRatesData.Where(i => validatedFxRateDataForReport.GoodData.LineNumberWithCurrency.Keys.Any(y => y == i.LineNumber)).ToList());
            fxRatesToBeStaged.AddRange(ConvertToFxRateRecord(csvFxRatesData.Where(i => validatedFxRateDataForReport.WarningData.Any(j => j.LineNumberWithCurrency.Keys.Any(y => y == i.LineNumber))).ToList()));

            // Save valid data into stage storage
            validatedFxRateDataForReport.ImportId = await _fxRateRepository.InsertIntoStageFxRate(fxRatesToBeStaged);

            return validatedFxRateDataForReport;
        }

        /// <summary>
        /// Reads the dictionary object and generates FxRateRecord Object
        /// </summary>
        /// <param name="dictionaryDataToBeFormatted">Dictionary Object to be formatted</param>
        /// <returns>FxRateRecord Object</returns>
        private static List<FxRateRecord> ConvertToFxRateRecord(List<FxRateCsvLine> dictionaryDataToBeFormatted)
        {
            List<FxRateRecord> fxRateRecords = new List<FxRateRecord>();
            foreach (FxRateCsvLine fxRateToImport in dictionaryDataToBeFormatted)
            {
                fxRateRecords.Add(new FxRateRecord
                {
                    CurrencyCodeFrom = fxRateToImport.RoeType == "M" ? fxRateToImport.CurrencyCode : "USD",
                    CurrencyCodeTo = fxRateToImport.RoeType == "M" ? "USD" : fxRateToImport.CurrencyCode,
                    ValidDateFrom = DateTime.ParseExact(fxRateToImport.Date, "yyyyMMdd", CultureInfo.InvariantCulture),
                    Rate = decimal.Parse(fxRateToImport.Rate, CultureInfo.InvariantCulture),
                    FwdMonth1 = decimal.Parse(fxRateToImport.FwdMonth1, CultureInfo.InvariantCulture),
                    FwdMonth2 = decimal.Parse(fxRateToImport.FwdMonth2, CultureInfo.InvariantCulture),
                    FwdMonth3 = decimal.Parse(fxRateToImport.FwdMonth3, CultureInfo.InvariantCulture),
                    FwdMonth6 = decimal.Parse(fxRateToImport.FwdMonth6, CultureInfo.InvariantCulture),
                    FwdYear1 = decimal.Parse(fxRateToImport.FwdYear1, CultureInfo.InvariantCulture),
                    FwdYear2 = decimal.Parse(fxRateToImport.FwdYear2, CultureInfo.InvariantCulture),
                });
            }

            return fxRateRecords;
        }

        private static ValidatedFxRateManualImport ValidateData(List<FxRateCsvLine> csvLines, IEnumerable<Currency> currencies, IEnumerable<FxRateRecord> existingFxRateRecords)
        {
            ValidatedFxRateManualImport validatedFxRateManualImport = new ValidatedFxRateManualImport
            {
                GoodData = new ManualImportReportData
                {
                    ErrorMessage = "Following Exchange Rates are Ready for Import.",
                    LineNumberWithCurrency = new Dictionary<int, string>()
                },
                BlockerData = new List<ManualImportReportData>(),
                WarningData = new List<ManualImportReportData>()
            };

            List<FxRateValidationError> validationErrors = new List<FxRateValidationError>();

            foreach (var csvLine in csvLines)
            {
                bool isValidLine = ValidateCurrency(validationErrors, csvLine, currencies)
                    && ValidateActiveCurrency(validationErrors, csvLine, currencies)
                    && ValidateRoeType(validationErrors, csvLine, currencies)
                    && ValidateRate(validationErrors, csvLine)
                    && ValidateDate(validationErrors, csvLine)
                    && ValidateFwdPoints(validationErrors, csvLine)
                    && ValidateExistingDate(validationErrors, csvLine, existingFxRateRecords);

                if (isValidLine)
                {
                    validatedFxRateManualImport.GoodData.LineNumberWithCurrency.Add(csvLine.LineNumber, csvLine.CurrencyCode);
                }
            }

            foreach (var group in validationErrors.GroupBy(v => v.ErrorCode).ToList())
            {
                var manualImportReportData = new ManualImportReportData
                {
                    ErrorCode = group.Key,
                    ErrorMessage = _errorMessages[group.Key],
                    LineNumberWithCurrency = group.ToDictionary(g => g.FxRateCsvLine.LineNumber, g => g.FxRateCsvLine.CurrencyCode)
                };

                if (group.Key == "WARNING_EXISTINGDATE" || group.Key == "WARNING_INACTIVE_CURRENCY")
                { validatedFxRateManualImport.WarningData.Add(manualImportReportData); }
                else
                {
                    validatedFxRateManualImport.BlockerData.Add(manualImportReportData);
                }
            }

            return validatedFxRateManualImport;
        }

        private static bool ValidateCurrency(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine, IEnumerable<Currency> currencies)
        {
            if (!currencies.Any(currency => currency.CurrencyCode == csvLine.CurrencyCode))
            {
                validationErrors.Add(new FxRateValidationError(csvLine, "INVALID_CURRENCY"));

                return false;
            }

            return true;
        }

        private static bool ValidateActiveCurrency(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine, IEnumerable<Currency> currencies)
        {
            if (currencies.Where(c => c.IsDeactivated).Any(currency => currency.CurrencyCode == csvLine.CurrencyCode))
            {
                validationErrors.Add(new FxRateValidationError(csvLine, "WARNING_INACTIVE_CURRENCY"));

                return false;
            }

            return true;
        }


        private static bool ValidateRoeType(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine, IEnumerable<Currency> currencies)
        {
            if (currencies.Any(currency => csvLine.CurrencyCode == currency.CurrencyCode && csvLine.RoeType != currency.RoeType))
            {
                validationErrors.Add(new FxRateValidationError(csvLine, "INVALID_ROETYPE"));

                return false;
            }

            return true;
        }

        private static bool ValidateRate(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine)
        {
            if (!decimal.TryParse(csvLine.Rate, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal rate)
                || rate <= 0 || BitConverter.GetBytes(decimal.GetBits(rate)[3])[2] > 10)
            {
                validationErrors.Add(new FxRateValidationError(csvLine, "INVALID_RATE"));

                return false;
            }

            return true;
        }

        private static bool ValidateFwdPoints(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine)
        {
            bool Check(string fwdMonthString, string errorType)
            {
                if (!decimal.TryParse(fwdMonthString, out decimal fwdMonth) || BitConverter.GetBytes(decimal.GetBits(decimal.Parse(fwdMonthString, CultureInfo.InvariantCulture))[3])[2] > 10)
                {
                    validationErrors.Add(new FxRateValidationError(csvLine, errorType));

                    return false;
                }

                return true;
            }

            return Check(csvLine.FwdMonth1, "INVALID_FWDMTH1")
                && Check(csvLine.FwdMonth2, "INVALID_FWDMTH2")
                && Check(csvLine.FwdMonth3, "INVALID_FWDMTH3")
                && Check(csvLine.FwdMonth6, "INVALID_FWDMTH6")
                && Check(csvLine.FwdYear1, "INVALID_FWDYR1")
                && Check(csvLine.FwdYear2, "INVALID_FWDYR2");
        }

        private static bool ValidateDate(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine)
        {
            if (!DateTime.TryParseExact(csvLine.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime result) || result > DateTime.Today)
            {
                validationErrors.Add(new FxRateValidationError(csvLine, "INVALID_DATE"));

                return false;
            }

            return true;
        }

        private static bool ValidateExistingDate(List<FxRateValidationError> validationErrors, FxRateCsvLine csvLine, IEnumerable<FxRateRecord> existingFxRateRecords)
        {
            if (existingFxRateRecords.ToList().Any(existingFxrate => existingFxrate.ValidDateFrom == Convert.ToDateTime(DateTime.ParseExact(csvLine.Date, "yyyyMMdd", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy"))))
            {
                validationErrors.Add(new FxRateValidationError(csvLine, "WARNING_EXISTINGDATE"));
                return false;
            }

            return true;
        }
    }
}