using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.ListAndSearch.Common;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface ITradingListAndSearch
    {
        Task<Stream> ExportSearchSectionsToStreamAsync(string company, EntitySearchRequest searchRequest, string format);

        string GetExportFileName(string company);

        Task<IEnumerable<SectionSearchResultDto>> SearchSectionsAsync(string company, EntitySearchRequest searchRequest, bool skipPaginationLimit = false);
    }

    public class TradingListAndSearch : BaseListAndSearch, ITradingListAndSearch
    {
        private readonly string tradeGridCode = "tradeList";

        public TradingListAndSearch(
            IDapperContext dapperContext,
            IIdentityService identityService,
            ISystemDateTimeService systemDateTimeService,
            IUserService userService,
            IMapper mapper,
            IGridService gridQueries,
            IGridViewService gridViewQueries)
            : base(dapperContext, identityService, systemDateTimeService, userService, mapper, gridQueries, gridViewQueries)
        {
        }

        public async Task<IEnumerable<SectionSearchResultDto>> SearchSectionsAsync(string company, EntitySearchRequest searchRequest, bool skipPaginationLimit = false)
        {
            var tradeResults = await SearchAsync<SectionSearchResultDto>(company, searchRequest, tradeGridCode, "[Configuration].[Vw_TradeListAndSearch]", skipPaginationLimit);

            return tradeResults.ToList();
        }

        public async Task<Stream> ExportSearchSectionsToStreamAsync(string company, EntitySearchRequest searchRequest, string format = ListAndSearchExportFormat.Excel)
        {
            var searchResult = await SearchSectionsAsync(company, searchRequest, true);

            var dataTable = await ConvertSearchResultToDataTableAsync(company, tradeGridCode, searchRequest.GridViewId, searchResult);

            var formatedClauses = await GenerateFormatedClauses(company, searchRequest, tradeGridCode);

            var stream = ExportToExcelHelper.Export(dataTable, new ExcelFileProperties { Author = _identityService.GetUserPrincipalName(), Company = $"LDC - {company}", Title = "Atlas Trades Export", }, formatedClauses);

            return stream;
        }

        public string GetExportFileName(string company)
        {
            // The defaulted name of the exported file will be as follows: YYYYMMDD_HHMM_[company]_[atlas V2 screen’s name]_[user’s active directory name].
            return $"{DateTime.UtcNow.ToString("yyyyMMdd_HHmm", CultureInfo.InvariantCulture)}_{company}_Trades_{_identityService.GetUserName()}.xlsx";
        }
    }
}
