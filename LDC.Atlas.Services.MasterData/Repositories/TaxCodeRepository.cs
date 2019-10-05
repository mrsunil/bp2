using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TaxCodeRepository : BaseRepository, ITaxCodeRepository
    {
        public TaxCodeRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<IEnumerable<TaxCodeEntity>> GetAllAsync(string company, bool includeDeactivated = false, string taxCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iIncludeDeactivated", includeDeactivated);
            queryParameters.Add("@iTaxCode", taxCode);
            queryParameters.Add("@iDescription", description);

            var tax = await ExecuteQueryAsync<TaxCodeEntity>(
                StoredProcedureNames.GetTaxCode, queryParameters);

            return tax;
        }

        public async Task UpdateTaxCodes(ICollection<TaxCodeEntity> listTaxCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iTax", ToTaxCodeTvp(listTaxCode));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTaxCode, queryParameters, true);
        }

        private DataTable ToTaxCodeTvp(ICollection<TaxCodeEntity> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Tax]");

            var taxId = new DataColumn("TaxId", typeof(long));
            table.Columns.Add(taxId);

            var taxCode = new DataColumn("TaxCode", typeof(string));
            table.Columns.Add(taxCode);

            var taxRate = new DataColumn("TaxRate", typeof(long));
            table.Columns.Add(taxRate);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var interfaceCode = new DataColumn("InterfaceCode", typeof(string));
            table.Columns.Add(interfaceCode);

            var taxReversalRate = new DataColumn("TaxReversalRate", typeof(long));
            table.Columns.Add(taxReversalRate);

            var alternateVatInputsAccId = new DataColumn("AlternateVatInputsAccId", typeof(long));
            table.Columns.Add(alternateVatInputsAccId);

            var alternateVatOutputsAccId = new DataColumn("AlternateVatOutputsAccId", typeof(long));
            table.Columns.Add(alternateVatOutputsAccId);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            var vatReg = new DataColumn("VatReg", typeof(string));
            table.Columns.Add(vatReg);

            var exciseTariffCode = new DataColumn("ExciseTariffCode", typeof(string));
            table.Columns.Add(exciseTariffCode);

            var formType = new DataColumn("FormType", typeof(string));
            table.Columns.Add(formType);

            var tinNo = new DataColumn("TinNo", typeof(string));
            table.Columns.Add(tinNo);

            var sgstUtgstRate = new DataColumn("SgstUtgstRate", typeof(long));
            table.Columns.Add(sgstUtgstRate);

            var sgstUtgstReversalRate = new DataColumn("SgstUtgstReversalRate", typeof(long));
            table.Columns.Add(sgstUtgstReversalRate);

            var sgstUtgstInputsAccId = new DataColumn("SgstUtgstInputsAccId", typeof(long));
            table.Columns.Add(sgstUtgstInputsAccId);

            var sgstUtgstPayableAccId = new DataColumn("SgstUtgstPayableAccId", typeof(long));
            table.Columns.Add(sgstUtgstPayableAccId);

            var nonZeroFlag = new DataColumn("NonZeroFlag", typeof(string));
            table.Columns.Add(nonZeroFlag);

            var expenseTaxRate = new DataColumn("ExpenseTaxRate", typeof(long));
            table.Columns.Add(expenseTaxRate);

            var expenseAccId = new DataColumn("ExpenseAccId", typeof(long));
            table.Columns.Add(expenseAccId);


            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[taxId] = value.TaxId;
                    row[taxCode] = value.TaxCode;
                    row[taxRate] = value.TaxRate;
                    row[description] = value.Description;
                    row[interfaceCode] = value.InterfaceCode;
                    row[taxReversalRate] = value.TaxReversalRate;
                    row[alternateVatInputsAccId] = value.AlternateVatInputsAccId;
                    row[alternateVatOutputsAccId] = value.AlternateVatOutputsAccId;
                    row[isDeactivated] = value.IsDeactivated;
                    row[vatReg] = value.VatReg;
                    row[exciseTariffCode] = value.ExciseTariffCode;
                    row[formType] = value.FormType;
                    row[tinNo] = value.TinNo;
                    row[sgstUtgstRate] = value.SgstUtgstRate;
                    row[sgstUtgstReversalRate] = value.SgstUtgstReversalRate;
                    row[sgstUtgstInputsAccId] = value.SgstUtgstInputsAccId;
                    row[sgstUtgstPayableAccId] = value.SgstUtgstPayableAccId;
                    row[nonZeroFlag] = value.NonZeroFlag;
                    row[expenseTaxRate] = value.ExpenseTaxRate;
                    row[expenseAccId] = value.ExpenseAccId;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetTaxCode = "[Masterdata].[usp_ListTaxCodes]";
            internal const string UpdateTaxCode = "[Masterdata].[usp_UpdateTaxCode]";
        }

    }
}
