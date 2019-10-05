using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ContractTermsRepository : BaseRepository, IContractTermsRepository
    {
        public ContractTermsRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(ContractTerm),
                       new ColumnAttributeTypeMapper<ContractTerm>());
        }

        public async Task<IEnumerable<ContractTerm>> GetAllAsync(string company, bool includeDeactivated = false, string contractTermCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@ContractTermCode", contractTermCode);
            queryParameters.Add("@Description", description);

            var contractTerms = await ExecuteQueryAsync<ContractTerm>(
                StoredProcedureNames.GetContractTerms,
                queryParameters);

            return contractTerms;
        }

        public async Task UpdateContractTerm(ICollection<ContractTerm> listcontractTerm)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iContractTerm", ToContractTermTvp(listcontractTerm));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateContractTerm, queryParameters, true);
        }

        private DataTable ToContractTermTvp(ICollection<ContractTerm> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_ContractTerm]");

            var contractTermId = new DataColumn("ContractTermId", typeof(long));
            table.Columns.Add(contractTermId);

            var contractTermCode = new DataColumn("ContractTermCode", typeof(string));
            table.Columns.Add(contractTermCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var text = new DataColumn("Text", typeof(string));
            table.Columns.Add(text);

            var gopInvNoBl = new DataColumn("GopInvNoBl", typeof(bool));
            table.Columns.Add(gopInvNoBl);

            var gosInvNoBl = new DataColumn("GosInvNoBl", typeof(bool));
            table.Columns.Add(gosInvNoBl);

            var gosInvNoAlloc = new DataColumn("GosInvNoAlloc", typeof(bool));
            table.Columns.Add(gosInvNoAlloc);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[contractTermId] = value.ContractTermId;
                    row[contractTermCode] = value.ContractTermCode;
                    row[description] = value.Description;
                    row[gopInvNoBl] = value.GopInvNoBl;
                    row[gosInvNoBl] = value.GosInvNoBl;
                    row[gosInvNoAlloc] = value.GosInvNoAlloc;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetContractTerms = "[Masterdata].[usp_ListContractTerms]";
            internal const string UpdateContractTerm = "[MasterData].[usp_UpdateContractTerm]";
        }
    }
}
