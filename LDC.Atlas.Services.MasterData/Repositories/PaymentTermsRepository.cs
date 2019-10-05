using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PaymentTermsRepository : BaseRepository, IPaymentTermsRepository
    {
        public PaymentTermsRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(PaymentTerms),
                       new ColumnAttributeTypeMapper<PaymentTerms>());
        }

        public async Task<IEnumerable<PaymentTerms>> GetAllAsync(string company, int? offset, int? limit, bool includeDeactivated = false, string paymentTermCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@paymentTermCode", paymentTermCode);
            queryParameters.Add("@Description", description);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var paymentTerms = await ExecuteQueryAsync<PaymentTerms>(
                StoredProcedureNames.GetPaymentTerms,
                queryParameters);

            return paymentTerms;
        }

        public async Task UpdatePaymentTerm(ICollection<PaymentTerms> listPaymentTerm)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iPaymentTerm", ToPaymentTermTvp(listPaymentTerm));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePaymentTerm, queryParameters, true);
        }

        private DataTable ToPaymentTermTvp(ICollection<PaymentTerms> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_PaymentTerm]");

            var paymentTermId = new DataColumn("PaymentTermId", typeof(long));
            table.Columns.Add(paymentTermId);

            var paymentTermCode = new DataColumn("PaymentTermCode", typeof(string));
            table.Columns.Add(paymentTermCode);

            var mdmId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mdmId);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var secure = new DataColumn("Secure", typeof(bool));
            table.Columns.Add(secure);

            var creditDays = new DataColumn("CreditDays", typeof(short));
            table.Columns.Add(creditDays);

            var creditAgainst = new DataColumn("CreditAgainst", typeof(string));
            table.Columns.Add(creditAgainst);

            var creditHow = new DataColumn("CreditHow", typeof(string));
            table.Columns.Add(creditHow);

            var lc = new DataColumn("Lc", typeof(bool));
            table.Columns.Add(lc);

            var cadType = new DataColumn("CadType", typeof(bool));
            table.Columns.Add(cadType);

            var prepayInv = new DataColumn("PrepayInv", typeof(bool));
            table.Columns.Add(prepayInv);

            var pVal = new DataColumn("PVal", typeof(string));
            table.Columns.Add(pVal);

            var sVal = new DataColumn("SVal", typeof(string));
            table.Columns.Add(sVal);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            var creditLimitCheck = new DataColumn("CreditLimitCheck", typeof(bool));
            table.Columns.Add(creditLimitCheck);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();

                    row[paymentTermId] = value.PaymentTermsId;
                    row[paymentTermCode] = value.PaymentTermCode;
                    row[description] = value.Description;
                    row[secure] = value.Secure;
                    row[creditDays] = value.CreditDays;
                    row[creditAgainst] = value.CreditAgainst;
                    row[creditHow] = value.CreditHow;
                    row[lc] = value.Lc;
                    row[cadType] = value.CadType;
                    row[prepayInv] = value.PrepayInv;
                    row[pVal] = value.PVal;
                    row[sVal] = value.SVal;
                    row[isDeactivated] = value.IsDeactivated;
                    row[creditLimitCheck] = value.CreditLimitCheck;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPaymentTerms = "[Masterdata].[usp_ListPaymentTerms]";
            internal const string UpdatePaymentTerm = "[MasterData].[usp_UpdatePaymentTerm]";
        }
    }
}
