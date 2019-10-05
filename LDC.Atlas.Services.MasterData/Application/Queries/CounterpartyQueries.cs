using AutoMapper;
using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.MasterData.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LDC.Atlas.Services.MasterData.Entities;

namespace LDC.Atlas.Services.MasterData.Application.Queries
{
    public class CounterpartyQueries : BaseRepository, ICounterpartyQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;

        public CounterpartyQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

            SqlMapper.SetTypeMap(
               typeof(CounterpartyDto),
               new ColumnAttributeTypeMapper<CounterpartyDto>());
        }

        public async Task<CounterpartyDto> GetCounterpartyByIdAsync(string company, long counterpartyId)
        {
            CounterpartyDto counterparty;
            var queryParameters = new DynamicParameters();
          
            queryParameters.Add("@CounterpartyId", counterpartyId);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCounterpartyByCounterpartyId, queryParameters))
            {
                counterparty = (await grid.ReadAsync<CounterpartyDto>()).FirstOrDefault();
                if (counterparty != null)
                {
                    counterparty.CounterpartyCompanies = await grid.ReadAsync<CounterpartyCompany>();
                    counterparty.CounterpartyAddresses = await grid.ReadAsync<CounterpartyAddress>();
                    counterparty.CounterpartyBankAccounts = await grid.ReadAsync<CounterPartyBankAccount>();
                    counterparty.CounterpartyBankAccountIntermediaries = await grid.ReadAsync<CounterpartyBankAccountIntermediary>();
                    counterparty.CounterpartyTaxes = await grid.ReadAsync<CounterpartyTax>();
                    counterparty.CounterpartyContacts = await grid.ReadAsync<CounterpartyContact>();
                    counterparty.CounterpartyAccountTypes = await grid.ReadAsync<CounterpartyAccountType>();
                    counterparty.CounterpartyMdmCategory = await grid.ReadAsync<CounterpartyMdmCategory>();
                }
            }

            return counterparty;
        }

        public async Task<IEnumerable<MdmCategoryAccountTypeMapping>> GetMdmCategoryAccountTypeMappingAsync()
        {
            var mappedData = await ExecuteQueryAsync<MdmCategoryAccountTypeMapping>(StoredProcedureNames.GetMdmCategoryAccountTypeMapping, false);

            return mappedData.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string GetCounterpartyByCounterpartyId = "[MasterData].[usp_GetCounterpartyDetailsByCounterpartyId]";
            internal const string GetMdmCategoryAccountTypeMapping = "[MasterData].[usp_GetMdmCategoryAccountTypeMapping]";
        }
    }
}
