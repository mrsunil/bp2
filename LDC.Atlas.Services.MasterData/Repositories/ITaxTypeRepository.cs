using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ITaxTypeRepository
    {
        Task<IEnumerable<EnumEntity>> GetAllAsync(string company);

        Task UpdateTaxTypes(ICollection<EnumEntity> listTaxTypes);
    }
}
