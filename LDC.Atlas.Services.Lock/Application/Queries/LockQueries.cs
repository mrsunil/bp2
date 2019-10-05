using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries
{
    public class LockQueries : BaseRepository, ILockQueries
    {
        public LockQueries(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<LockStateResponseDto> GetLockStateAsync(string companyId, long resourceId, string applicationSessionId, string resourceType)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@ResourceId", resourceId);
            queryParameters.Add("@ResourceType", resourceType);

            var lockState = await ExecuteQueryFirstOrDefaultAsync<LockStateResponseDto>(StoredProcedureNames.GetLockState, queryParameters);
            if (lockState != null && lockState.ApplicationSessionId != applicationSessionId)
            {
                lockState.IsLocked = true;
            }
            else if (lockState == null)
            {
                return new LockStateResponseDto() { IsLocked = false };
            }
            else
            {
                lockState.IsLocked = false;
            }

            return lockState;
        }

        public async Task<IEnumerable<LockDto>> GetLocksAsync(string companyId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);

            var locks = await ExecuteQueryAsync<LockDto>(StoredProcedureNames.GetLocks, queryParameters);

            return locks;
        }

        private static class StoredProcedureNames
        {
            internal const string GetLocks = "[Lock].[usp_ListLock]";
            internal const string GetLockState = "[Lock].[usp_GetLockState]";
        }
    }
}
