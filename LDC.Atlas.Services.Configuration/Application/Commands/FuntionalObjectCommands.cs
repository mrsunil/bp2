using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class CreateFunctionalObjectCommand : IRequest<int>
    {
        public string Name { get; set; }

        public IEnumerable<FunctionalObjectTableFieldsDto> Keys { get; set; }
    }

    public class UpdateFunctionalObjectCommand : IRequest<int>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<FunctionalObjectTableFieldsDto> Keys { get; set; }
    }

    public class FunctionalObjectTableFieldsDto
    {
        public int TableId { get; set; }

        public IEnumerable<int> FieldIds { get; set; }
    }
}
