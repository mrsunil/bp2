using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class FxDealRepository : BaseRepository, IFxDealRepository
    {
        public FxDealRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<FxDealReference> CreateFxDealAsync(FxDeal fxDeal, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iFxDeals", ConvertToFxDealUDTT(new[] { fxDeal }));
            queryParameters.Add("@iDataVersionId", null);

            var result = await ExecuteQueryFirstOrDefaultAsync<FxDealReference>(StoredProcedureNames.CreateFxDeals, queryParameters, true);

            return result;
        }

        public async Task UpdateFxDealAsync(FxDeal fxDeal, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iFxDeals", ConvertToFxDealUDTT(new[] { fxDeal }));
            queryParameters.Add("@iDataVersionId", null);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateFxDeals, queryParameters, true);
        }

        public async Task DeleteFxDealAsync(long fxDealId, string company)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(new[] { fxDealId });

            queryParameters.Add("@FxDealIds", ids);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteFxDeals, queryParameters, true);
        }

        public async Task DeleteFxDealSectionsAsync(IEnumerable<long> sectionIds, long fxDealId, string company)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(sectionIds);

            queryParameters.Add("@FxDealId", fxDealId);
            queryParameters.Add("@FxDealSectionIds", ids);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteFxDealSections, queryParameters, true);
        }

        public async Task UpdateFxDealSectionsAsync(long fxDealId, IEnumerable<FxDealSection> sections, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@FxDealId", fxDealId);
            queryParameters.Add("@FxDealSections", ConvertToFxDealSectionUDTT(sections));
            queryParameters.Add(DataVersionIdParameter, null);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateFxDealSections, queryParameters, true);
        }

        public async Task<IEnumerable<SectionInformationFxDeal>> GetSectionInformationForFxDealAsync(IEnumerable<long> sectionIds, string company)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(sectionIds);

            queryParameters.Add("@SectionIds", ids);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            var result = await ExecuteQueryAsync<SectionInformationFxDeal>(StoredProcedureNames.GetSectionInformationForFxDeal, queryParameters, true);

            return result;
        }

        public async Task UpdateFxDealStatus(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateFxDealStatus, queryParameters, true);
        }

        public async Task UpdateSettleFxDeals(List<long> fxDealIds, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@FxDealIds", ToArrayTvp(fxDealIds));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateSettleFxDeals, queryParameters, true);
        }

        private static DataTable ToArrayTvp(IEnumerable<long> values)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var sectionId = new DataColumn("Value", typeof(long));
            table.Columns.Add(sectionId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static DataTable ConvertToFxDealUDTT(IEnumerable<FxDeal> fxDeals)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_FxDeal]");

            DataColumn fxDealId = new DataColumn("FxDealId", typeof(long));
            udtt.Columns.Add(fxDealId);

            DataColumn dataVersionId = new DataColumn("DataVersionId", typeof(int));
            udtt.Columns.Add(dataVersionId);

            DataColumn reference = new DataColumn("Reference", typeof(string));
            udtt.Columns.Add(reference);

            DataColumn dealDirectionId = new DataColumn("DealDirectionId", typeof(int));
            udtt.Columns.Add(dealDirectionId);

            DataColumn traderId = new DataColumn("TraderId", typeof(long));
            udtt.Columns.Add(traderId);

            DataColumn contractDate = new DataColumn("ContractDate", typeof(DateTime));
            udtt.Columns.Add(contractDate);

            DataColumn maturityDate = new DataColumn("MaturityDate", typeof(DateTime));
            udtt.Columns.Add(maturityDate);

            DataColumn companyId = new DataColumn("CompanyId", typeof(int));
            udtt.Columns.Add(companyId);

            DataColumn departmentId = new DataColumn("DepartmentId", typeof(long));
            udtt.Columns.Add(departmentId);

            DataColumn fxTradeTypeId = new DataColumn("FxTradeTypeId", typeof(int));
            udtt.Columns.Add(fxTradeTypeId);

            DataColumn currencyCode = new DataColumn("CurrencyCode", typeof(string));
            udtt.Columns.Add(currencyCode);

            DataColumn amount = new DataColumn("Amount", typeof(decimal));
            udtt.Columns.Add(amount);

            DataColumn settlementCurrencyCode = new DataColumn("SettlementCurrencyCode", typeof(string));
            udtt.Columns.Add(settlementCurrencyCode);

            DataColumn spotRate = new DataColumn("SpotRate", typeof(decimal));
            udtt.Columns.Add(spotRate);

            DataColumn spotRateType = new DataColumn("SpotRateType", typeof(string));
            udtt.Columns.Add(spotRateType);

            DataColumn fwPoints = new DataColumn("FwPoints", typeof(decimal));
            udtt.Columns.Add(fwPoints);

            DataColumn nominalAccountId = new DataColumn("NominalAccountId", typeof(long));
            udtt.Columns.Add(nominalAccountId);

            DataColumn settlementNominalAccountId = new DataColumn("SettlementNominalAccountId", typeof(long));
            udtt.Columns.Add(settlementNominalAccountId);

            DataColumn counterpartyId = new DataColumn("CounterpartyId", typeof(long));
            udtt.Columns.Add(counterpartyId);

            DataColumn brokerId = new DataColumn("BrokerId", typeof(long));
            udtt.Columns.Add(brokerId);

            DataColumn fxDealStatusId = new DataColumn("FxDealStatusId", typeof(int));
            udtt.Columns.Add(fxDealStatusId);

            DataColumn bankReference = new DataColumn("BankReference", typeof(string));
            udtt.Columns.Add(bankReference);

            DataColumn memorandum = new DataColumn("Memorandum", typeof(string));
            udtt.Columns.Add(memorandum);

            DataColumn ndfAgreedRate = new DataColumn("NdfAgreedRate", typeof(decimal));
            udtt.Columns.Add(ndfAgreedRate);

            DataColumn ndfAgreedDate = new DataColumn("NdfAgreedDateTime", typeof(DateTime));
            udtt.Columns.Add(ndfAgreedDate);

            DataColumn provinceId = new DataColumn("ProvinceId", typeof(long));
            udtt.Columns.Add(provinceId);

            DataColumn branchId = new DataColumn("BranchId", typeof(long));
            udtt.Columns.Add(branchId);

            foreach (var fxDeal in fxDeals)
            {
                var row = udtt.NewRow();

                row[fxDealId] = fxDeal.FxDealId;
                row[dataVersionId] = fxDeal.DataVersionId;
                row[reference] = fxDeal.Reference;
                row[dealDirectionId] = fxDeal.DealDirectionId;
                row[traderId] = fxDeal.TraderId;
                row[contractDate] = fxDeal.ContractDate;
                row[maturityDate] = fxDeal.MaturityDate;
                row[companyId] = (object)DBNull.Value;
                row[departmentId] = fxDeal.DepartmentId;
                row[fxTradeTypeId] = fxDeal.FxTradeTypeId ?? (object)DBNull.Value;
                row[currencyCode] = fxDeal.CurrencyCode;
                row[amount] = fxDeal.Amount;
                row[settlementCurrencyCode] = fxDeal.SettlementCurrencyCode;
                row[spotRate] = fxDeal.SpotRate;
                row[spotRateType] = fxDeal.SpotRateType;
                row[fwPoints] = fxDeal.FwPoints;
                row[nominalAccountId] = fxDeal.NominalAccountId;
                row[settlementNominalAccountId] = fxDeal.SettlementNominalAccountId;
                row[counterpartyId] = fxDeal.CounterpartyId;
                row[brokerId] = fxDeal.BrokerId;
                row[fxDealStatusId] = fxDeal.FxDealStatusId;
                row[bankReference] = fxDeal.BankReference;
                row[memorandum] = fxDeal.Memorandum;
                row[ndfAgreedRate] = fxDeal.NdfAgreedRate ?? (object)DBNull.Value;
                row[ndfAgreedDate] = fxDeal.NdfAgreedDate ?? (object)DBNull.Value;
                row[provinceId] = fxDeal.ProvinceId ?? (object)DBNull.Value;
                row[branchId] = fxDeal.BranchId ?? (object)DBNull.Value;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static DataTable ConvertToFxDealSectionUDTT(IEnumerable<FxDealSection> sections)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_FxDealSection]");

            DataColumn sectionId = new DataColumn("SectionId", typeof(long));
            udtt.Columns.Add(sectionId);

            DataColumn coverApplied = new DataColumn("CoverApplied", typeof(int));
            udtt.Columns.Add(coverApplied);

            foreach (var section in sections)
            {
                var row = udtt.NewRow();

                row[sectionId] = section.SectionId;
                row[coverApplied] = section.CoverApplied;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateFxDeals = "[Trading].[usp_CreateFxDeals]";
            internal const string UpdateFxDeals = "[Trading].[usp_UpdateFxDeals]";
            internal const string DeleteFxDeals = "[Trading].[usp_DeleteFxDeals]";
            internal const string DeleteFxDealSections = "[Trading].[usp_DeleteFxDealSections]";
            internal const string UpdateFxDealSections = "[Trading].[usp_UpdateFxDealSections]";
            internal const string GetSectionInformationForFxDeal = "[Trading].[usp_GetSectionInformationForFxDeal]";
            internal const string UpdateFxDealStatus = "[Trading].[usp_UpdateFxDealStatus]";
            internal const string UpdateSettleFxDeals = "[Trading].[usp_UpdateSettleFxDeals]";
        }
    }
}
