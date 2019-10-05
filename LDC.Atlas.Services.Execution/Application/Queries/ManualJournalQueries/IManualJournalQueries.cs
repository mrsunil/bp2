using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface IManualJournalQueries
    {
        Task<int> GetManualDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year);

        /// <summary>
        /// Method to read Manual Journal Configuration
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        Task<IEnumerable<ItemConfigurationPropertiesDto>> GetManualJournalFieldsConfiguration(string company);
    }
}
