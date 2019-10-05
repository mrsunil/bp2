using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries
{
    public interface IProfileQueries
    {
        Task<IEnumerable<ProfileSummaryDto>> GetProfilesAsync(int? offset, int? limit);

        Task<ProfileDto> GetProfileByIdAsync(int profileId);

        Task<IEnumerable<PrivilegeDto>> GetPrivilegesAsync();

        Task<IEnumerable<UserPermissionDto>> GetUserProfilesAsync(long userId);

        Task<IEnumerable<CompanyProfileDto>> GetProfilesByCompanyIdAsync(string companyId, int? offset, int? limit);
    }
}
