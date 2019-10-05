using LDC.Atlas.Document.Common.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Services
{
    public interface IPhysicalDocumentGenerationService
    {
        /// <summary>
        /// Processes a specific report and renders it in the specified format.
        /// </summary>
        /// <param name="reportPath">The full name of the report.</param>
        /// <param name="parameters">The parameter values associated with the current report.</param>
        /// <param name="format">The format in which to render the report.</param> RenderingFormat
        Task<DocumentResponse> GenerateDocument(string reportPath, IDictionary<string, string> parameters, string format);

        /// <summary>
        /// Gets a list of templates for a specified document type and company.
        /// </summary>
        /// <param name="physicalDocumentType">The type of document for which to retrieve the templates.</param>
        /// <param name="company">The company code</param>
        /// <param name="recursive">A Boolean expression that indicates whether to return the entire tree of child items below the specified item. The default value is false.</param>
        Task<IEnumerable<DocumentTemplate>> GetTemplates(PhysicalDocumentType physicalDocumentType, string company, bool recursive = true, string module = "");

        Task<DocumentTemplate> GetTemplateByPath(string reportPath, PhysicalDocumentType documentType, string company);
    }
}
