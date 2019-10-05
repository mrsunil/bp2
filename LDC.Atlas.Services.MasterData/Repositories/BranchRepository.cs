using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class BranchRepository : BaseRepository, IBranchRepository
    {
        public BranchRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Branch),
                       new ColumnAttributeTypeMapper<Branch>());
        }

        public async Task<IEnumerable<Branch>> GetAllAsync(bool includeDeactivated = false, string stateCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@BranchCode", stateCode);
            queryParameters.Add("@Description", description);
            var branches = await ExecuteQueryAsync<Branch>(
                StoredProcedureNames.ListBranches, queryParameters);

            return branches;
        }

    internal static class StoredProcedureNames
    {
        internal const string ListBranches = "[MasterData].[usp_ListBranches]";
    }
}
}
