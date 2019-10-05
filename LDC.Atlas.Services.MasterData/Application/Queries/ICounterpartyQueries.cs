using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LDC.Atlas.Services.MasterData.Application.Queries.Dto;
using LDC.Atlas.Services.MasterData.Entities;

namespace LDC.Atlas.Services.MasterData.Application.Queries
{
    public interface ICounterpartyQueries
    {
        Task<CounterpartyDto> GetCounterpartyByIdAsync(string company, long counterpartyId);

        Task<IEnumerable<MdmCategoryAccountTypeMapping>> GetMdmCategoryAccountTypeMappingAsync();
    }
}
