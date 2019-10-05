using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class CreateFilterSetCommand : IRequest<int>
    {
        internal long UserId { get; set; } // internal to avoid the exposure in Swagger

        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public IEnumerable<Filter> Filters { get; set; }
    }

    public class UpdateFilterSetCommand : IRequest
    {
        internal long UserId { get; set; } // internal to avoid the exposure in Swagger

        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        internal int FilterSetId { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public IEnumerable<Filter> Filters { get; set; }
    }

    public class DeleteFilterSetCommand : IRequest
    {
        internal long UserId { get; set; } // internal to avoid the exposure in Swagger

        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        internal int FilterSetId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class CreateFavoriteFilterSetCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        internal int FilterSetId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class Filter
    {
        public int GridColumnId { get; set; }

        public string FieldName { get; set; }

        public string Operator { get; set; }

        public string Value1 { get; set; }

        public string Value2 { get; set; }

        public bool IsActive { get; set; }
    }
}
