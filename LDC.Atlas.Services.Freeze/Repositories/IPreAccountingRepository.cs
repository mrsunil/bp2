using LDC.Atlas.Services.Freeze.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Repositories
{
    public interface IPreAccountingRepository
    {
        Task<AccountingSetup> GetAccountingSetup(string companyId);
    }
}
