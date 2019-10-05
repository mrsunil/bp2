using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface IManualJournalRepository
    {
        Task<ManualJournalResponse> CreateManualJournal(ManualJournalDocument manualJournalDocument, string company);

        Task<IEnumerable<ManualJournalLineReference>> GetManualJournalLineReferences(long manualJournalDocumentId, string company, long? dataVersionId);
    }
}
