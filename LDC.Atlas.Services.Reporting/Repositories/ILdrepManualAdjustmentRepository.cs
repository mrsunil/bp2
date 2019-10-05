using System;
using LDC.Atlas.Services.Reporting.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Repositories
{
    public interface ILdrepManualAdjustmentRepository
    {
        Task<LdrepManualAdjustment> CreateUpdateLdrepManualAdjustment(LdrepManualAdjustment ldrepManualAdjustment);

        Task DeleteLdrepManualAdjustment(LdrepManualAdjustment ldrepManualAdjustment);
    }
}
