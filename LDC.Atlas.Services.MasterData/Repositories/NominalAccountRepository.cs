using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using System;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class NominalAccountRepository : BaseRepository, INominalAccountRepository
    {
        public NominalAccountRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(NominalAccount),
                       new ColumnAttributeTypeMapper<NominalAccount>());
        }

        public async Task<IEnumerable<NominalAccount>> GetAllAsync(string company, bool includeDeactivated = false, string nominalAccountNumber = null, string detailedDescription = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@NominalAccountNumber", nominalAccountNumber);
            queryParameters.Add("@DetailedDescription", detailedDescription);

            var nominalAccounts = await ExecuteQueryAsync<NominalAccount>(
                StoredProcedureNames.GetNominalAccounts, queryParameters);

            return nominalAccounts;
        }

        public async Task UpdateNominalAccount(ICollection<NominalAccount> listNominalAccount)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iNominalAccount", ToNominalAccountTvp(listNominalAccount));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateRegion, queryParameters, true);
        }

        private DataTable ToNominalAccountTvp(ICollection<NominalAccount> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_NominalAccount]");

            var nominalAccountId = new DataColumn("NominalAccountId", typeof(long));
            table.Columns.Add(nominalAccountId);

            var mDMId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mDMId);

            var accountNumber = new DataColumn("AccountNumber", typeof(string));
            table.Columns.Add(accountNumber);

            var mainAccountTitle = new DataColumn("MainAccountTitle", typeof(string));
            table.Columns.Add(mainAccountTitle);

            var detailAccountTitle = new DataColumn("DetailAccountTitle", typeof(string));
            table.Columns.Add(detailAccountTitle);

            var accType = new DataColumn("AccType", typeof(string));
            table.Columns.Add(accType);

            var bankAcc = new DataColumn("BankAcc", typeof(bool));
            table.Columns.Add(bankAcc);

            var custVendor = new DataColumn("CustVendor", typeof(string));
            table.Columns.Add(custVendor);

            var alternativeAccount = new DataColumn("AlternativeAccount", typeof(string));
            table.Columns.Add(alternativeAccount);

            var alternativeDescription = new DataColumn("AlternativeDescription", typeof(string));
            table.Columns.Add(alternativeDescription);

            var otherAlternativeAccount = new DataColumn("OtherAlternativeAccount", typeof(string));
            table.Columns.Add(otherAlternativeAccount);

            var revalxRequired = new DataColumn("RevalxRequired", typeof(bool));
            table.Columns.Add(revalxRequired);

            var incInCcyexp = new DataColumn("IncInCcyexp", typeof(bool));
            table.Columns.Add(incInCcyexp);

            var interfaceBankCode = new DataColumn("InterfaceBankCode", typeof(string));
            table.Columns.Add(interfaceBankCode);

            var dateLastPosted = new DataColumn("DateLastPosted", typeof(DateTime));
            table.Columns.Add(dateLastPosted);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            var clientAccountMandatory = new DataColumn("ClientAccountMandatory", typeof(bool));
            table.Columns.Add(clientAccountMandatory);


            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[nominalAccountId] = value.NominalAccountId;
                    row[mDMId] = value.MDMId;
                    row[accountNumber] = value.AccountNumber;
                    row[mainAccountTitle] = value.MainAccountTitle;
                    row[detailAccountTitle] = value.DetailAccountTitle;
                    row[accType] = value.AccountType;
                    row[bankAcc] = value.BankAccount;
                    row[custVendor] = value.CustomerVendor;
                    row[alternativeAccount] = value.AlternativeAccount;
                    row[alternativeDescription] = value.AlternativeDescription;
                    row[otherAlternativeAccount] = value.OtherAlternativeAccount;
                    row[revalxRequired] = value.RevalxRequired;
                    row[incInCcyexp] = value.IncInCcyexp;
                    row[interfaceBankCode] = value.InterfaceBankCode;
                    row[dateLastPosted] = value.DateLastPosted;
                    row[isDeactivated] = value.IsDeactivated;
                    row[clientAccountMandatory] = value.ClientAccountMandatory;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetNominalAccounts = "[Masterdata].[usp_ListNominalAccounts]";
            internal const string UpdateRegion = "[Masterdata].[usp_UpdateNominalAccount]";
        }
    }
}
