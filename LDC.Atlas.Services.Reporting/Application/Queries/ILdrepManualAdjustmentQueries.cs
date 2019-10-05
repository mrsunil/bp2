using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries
{
    public interface ILdrepManualAdjustmentQueries
    {
        Task<IEnumerable<LdrepManualAdjustmentDto>> GetLdrepManualAdjustments(DateTime fromDate, DateTime? toDate, string company);
    }
}
