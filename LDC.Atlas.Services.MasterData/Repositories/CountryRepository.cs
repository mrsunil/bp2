using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CountryRepository : BaseRepository, ICountryRepository
    {
        public CountryRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Country),
                       new ColumnAttributeTypeMapper<Country>());
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteCountries(IEnumerable<long> countryIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(countryIds);

            queryParameters.Add("@CountryIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeleteCountries, queryParameters, true);
        }

        public async Task<IEnumerable<Country>> GetAllAsync(bool includeDeactivated = false, string countryCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@CountryCode", countryCode);
            queryParameters.Add("@Description", description);

            var countries = await ExecuteQueryAsync<Country>(
                StoredProcedureNames.GetCountries,
                queryParameters);

            return countries;
        }
        public async Task UpdateCountry(ICollection<Country> listCountry)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCountry", ToCountryTvp(listCountry));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCountry, queryParameters, true);
        }

        private DataTable ToCountryTvp(ICollection<Country> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Country]");

            var countryId = new DataColumn("CountryId", typeof(long));
            table.Columns.Add(countryId);

            var mdmId = new DataColumn("MdmId", typeof(string));
            table.Columns.Add(mdmId);

            var countryCode = new DataColumn("CountryCode", typeof(string));
            table.Columns.Add(countryCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var regionId = new DataColumn("RegionId", typeof(int));
            table.Columns.Add(regionId);

            var timezoneHrs = new DataColumn("TimezoneHrs", typeof(float));
            table.Columns.Add(timezoneHrs);

            var eCCode = new DataColumn("ECCode", typeof(string));
            table.Columns.Add(eCCode);

            var zipAfter = new DataColumn("ZipAfter", typeof(bool));
            table.Columns.Add(zipAfter);

            var iSOCode = new DataColumn("ISOCode", typeof(string));
            table.Columns.Add(iSOCode);

            var oFACRestricted = new DataColumn("OFACRestricted", typeof(bool));
            table.Columns.Add(oFACRestricted);

            var nISO = new DataColumn("NISO", typeof(bool));
            table.Columns.Add(nISO);

            var currencyCode = new DataColumn("CurrencyCode", typeof(string));
            table.Columns.Add(currencyCode);


            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[countryId] = value.CountryId;
                    row[countryCode] = value.CountryCode;
                    row[currencyCode] = value.CurrencyCode;
                    row[description] = value.Description;
                    row[eCCode] = value.ECCode;
                    row[iSOCode] = value.ISOCode;
                    row[regionId] = value.RegionId;
                    row[mdmId] = value.MdmId;
                    row[nISO] = value.NISO;
                    row[oFACRestricted] = value.OFACRestricted;
                    row[timezoneHrs] = value.TimezoneHrs;
                    row[zipAfter] = value.ZipAfter;
                    row[isDeactivated] = value.IsDeactivated;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCountries = "[Masterdata].[usp_ListCountries]";
            internal const string UpdateCountry = "[Masterdata].[usp_UpdateCountry]";
            internal const string DeleteCountries = "[Masterdata].[usp_DeleteCountries]";
        }
    }
}
