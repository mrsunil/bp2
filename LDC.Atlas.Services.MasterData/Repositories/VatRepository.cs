using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class VatRepository : BaseRepository, IVatRepository
    {
        public VatRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Vat),
                       new ColumnAttributeTypeMapper<Vat>());
        }

        public async Task<IEnumerable<Vat>> GetAllAsync(string company, bool includeDeactivated = false, string vatCode = null, string vatDescription = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@VatCode", vatCode);
            queryParameters.Add("@Description", vatDescription);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);

            var vats = await ExecuteQueryAsync<Vat>(
                StoredProcedureNames.GetVat, queryParameters);

            return vats;
        }

        public async Task<Vat> GetVatAsync(string vatCode, string companyId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@VATCodes", vatCode);
            queryParameters.Add("@CompanyId", companyId);

            var vats = await ExecuteQueryAsync<Vat>(
                StoredProcedureNames.GetVatForAcconting, queryParameters);

            return vats.FirstOrDefault<Vat>();
        }

        internal static class StoredProcedureNames
        {
            internal const string GetVat = "[Masterdata].[usp_ListVAT]";
            internal const string GetVatForAcconting = "[MasterData].[usp_GetVAT]";
        }
    }
}
