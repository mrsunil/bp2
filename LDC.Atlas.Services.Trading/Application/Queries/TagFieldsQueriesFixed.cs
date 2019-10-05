using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class TagFieldsQueriesFixed : ITagFieldsQueries
    {
        /// <summary>
        /// Get all tag parameters (static way).
        /// https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.task-1?view=netframework-4.8
        /// </summary>
        /// <param name="company">Company considered to retrieve tags associated.</param>
        /// <returns>Task object.</returns>
        public async Task<IEnumerable<TagParameterDto>> GetAllTagParametersAsync(string company)
        {
            var result = await Task<IEnumerable<TagParameterDto>>.Run(() =>
            {
                return (IEnumerable<TagParameterDto>)new List<TagParameterDto>()
                {
                    new TagParameterDto()
                    {
                        Label = "Cmy1",
                        TypeName = "Commodity.PrincipalCommodity",
                    },
                    new TagParameterDto()
                    {
                        Label = "Cmy2",
                        TypeName = "Commodity.Part2",
                    },
                    new TagParameterDto()
                    {
                        Label = "Cmy3",
                        TypeName = "Commodity.Part3",
                    },
                    new TagParameterDto()
                    {
                        Label = "Cmy4",
                        TypeName = "Commodity.Part4",
                    },
                    new TagParameterDto()
                    {
                        Label = "Cmy5",
                        TypeName = "Commodity.Part5",
                    },
                    new TagParameterDto()
                    {
                        Label = "Contract terms",
                        TypeName = "SectionDto.ContractTermCode",
                    },
                    new TagParameterDto()
                    {
                        Label = "Contract type",
                        TypeName = "TradeDto.Type",
                    },
                    new TagParameterDto()
                    {
                        Label = "Counterparty",
                        TypeName = "SectionDto.CounterpartyReference",
                    },
                    new TagParameterDto()
                    {
                        Label = "Payment terms",
                        TypeName = "SectionDto.PaymentTermCode",
                    },
                    new TagParameterDto()
                    {
                        Label = "Port of destination",
                        TypeName = "SectionDto.PortDestinationCode",
                    },
                    new TagParameterDto()
                    {
                        Label = "Port of origin",
                        TypeName = "SectionDto.PortOriginCode",
                    },
                };
            });

            return result;
        }
    }
}