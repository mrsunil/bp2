using LDC.Atlas.Services.Execution.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface IManualDocumentMatchingRepository
    {
        Task<ManualDocumentMatchingRecord> CreateUpdateDocumentMatching(ManualDocumentMatchingRecord document);

        Task UpdateDocumentAsync(ManualDocumentMatchingRecord manualDocumentMatching);

        /// <summary>
        /// Deletes a match flag
        /// </summary>
        /// <param name="matchFlagId">Id of the matchflag to delete</param>
        /// <param name="companyCode">working company code ('e6')</param>
        /// <returns>Id of the revaluation document to be reversed, if any</returns>
        Task<long?> DeleteMatchFlag(long? matchFlagId, string companyCode);
    }
}
