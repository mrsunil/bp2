﻿using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IAddressTypeRepository
    {
        Task<IEnumerable<EnumEntity>> GetAllAsync();
    }
}
