using LDC.Atlas.Services.Configuration.Application.Queries.Dto;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Queries
{
    /// <summary>
    /// Query component interface for feature flags.
    /// </summary>
    public interface IFeatureFlagsQueries
    {
        /// <summary>
        /// Returs the status of a given feature based on the company and gap name.
        /// </summary>
        /// <param name="company">Company input value for query.</param>
        /// <param name="gapName">Gap name input value for query.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation with the status of the gap.</returns>
        Task<FeatureBitDto> GetFeatureFlagAsync(string company, string gapName);
    }
}
