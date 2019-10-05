using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using LDC.Atlas.Services.Lock.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries
{
    public interface ILockQueries
    {
        Task<IEnumerable<LockDto>> GetLocksAsync(string companyId, int? offset, int? limit);

        Task<LockStateResponseDto> GetLockStateAsync(string companyId, long resourceId, string applicationSessionId, string resourceType);
    }
}
