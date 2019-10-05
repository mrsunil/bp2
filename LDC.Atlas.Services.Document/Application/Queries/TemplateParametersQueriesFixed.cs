using LDC.Atlas.Services.Document.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Application.Queries
{
    public class TemplateParametersQueriesFixed : ITemplateParametersQueries
    {
        public Task<IEnumerable<TemplateParameterDto>> GetAllTemplateParametersAsync(string company)
        {
            return Task.FromResult<IEnumerable<TemplateParameterDto>>(
                new List<TemplateParameterDto>
                {
                    new TemplateParameterDto
                    {
                        Label = "Inactive",
                        TypeName = "Template.Inactive"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Profit Center",
                        TypeName = "Template.ProfitCenter"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Department",
                        TypeName = "Template.Department"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Commodity",
                        TypeName = "Template.Commodity"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Mode of Transport",
                        TypeName = "Template.ModeOfTransport"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Contract Type",
                        TypeName = "Template.ContractType"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Contract Type 2",
                        TypeName = "Template.ContractType2"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Arbitration Code",
                        TypeName = "Template.ArbitrationCode"
                    },
                    new TemplateParameterDto
                    {
                        Label = "ContractTerms",
                        TypeName = "Template.ContractTerms"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Payment Terms",
                        TypeName = "Template.PaymentTerms"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Counterparty",
                        TypeName = "Template.Counterparty"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Counterparty Class",
                        TypeName = "Template.CounterpartyClass"
                    },
                    new TemplateParameterDto
                    {
                        Label = "Template Name",
                        TypeName = "Template.Name"
                    }
                });
        }
    }
}
