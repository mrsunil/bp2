using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class FilterSetService : BaseRepository, IFilterSetService
    {
        private readonly IIdentityService _identityService;

        public FilterSetService(IDapperContext dapperContext, IIdentityService identityService)
          : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
              typeof(UserFilterSetDto),
              new ColumnAttributeTypeMapper<UserFilterSetDto>());
            _identityService = identityService;
        }

        public async Task<UserFilterSetDto> GetUserFilterSetById(long userId, string company, int filterSetId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FilterSetId", filterSetId);

            UserFilterSetDto filterSet;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetFilterSetDetails, queryParameters))
            {
                filterSet = grid.Read<UserFilterSetDto>().FirstOrDefault();
                if (filterSet != null)
                {
                    filterSet.Filters = grid.Read<FilterDto>().ToList();
                }
                else
                {
                    return null;
                }
            }

            // A user can access a filter set if he is the owner, or if the filter set is shared with all users for all companies or for the requested company
            if (filterSet.OwnerId == userId
                || (filterSet.IsSharedWithAllUsers && filterSet.IsSharedWithAllCompanies)
                || (filterSet.IsSharedWithAllUsers && filterSet.CompanyId == company))
            {
                return filterSet;
            }

            throw new AtlasSecurityException("You are not the owner of this filter set or it is not shared with you.");
        }

        public async Task<IEnumerable<UserFilterSetDto>> GetUserFilterSets(long userId, string company, string gridCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridCode", gridCode);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UserId", userId);

            var filterSets = await ExecuteQueryAsync<UserFilterSetDto>(StoredProcedureNames.GetFilterSets, queryParameters);
            return filterSets;
        }

        private static class StoredProcedureNames
        {
            internal const string GetFilterSets = "[Configuration].[Usp_ListFilterSets]";
            internal const string GetFilterSetDetails = "[Configuration].[Usp_GetFilterSetDetails]";
        }
    }
}
