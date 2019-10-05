using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries
{
    public interface IPnlMovementQueries
    {
        Task<string> GetPnlMovementSummeryMessage(string company, string dataVersionId, string compDataVersionId);
    }
}
