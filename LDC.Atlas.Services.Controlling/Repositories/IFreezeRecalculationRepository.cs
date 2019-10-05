using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Repositories
{
    public interface IFreezeRecalculationRepository
    {
        Task LaunchFreezeRecalculationAsync(string userId, long dataVersionId, long sectionId, bool recalculateAccEntries);
    }
}
