using MediatR;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class CreateGridViewCommand : IRequest<int>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public string GridViewColumnConfig { get; set; }
    }

    public class UpdateGridViewCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        internal int GridViewId { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public string GridViewColumnConfig { get; set; }
    }

    public class DeleteGridViewCommand : IRequest
    {
        internal string UserId { get; set; } // internal to avoid the exposure in Swagger

        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        internal int GridViewId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class SetFavoriteGridViewCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal string GridCode { get; set; } // internal to avoid the exposure in Swagger

        internal int GridViewId { get; set; } // internal to avoid the exposure in Swagger

        internal string CreatedBy { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public string GridViewColumnConfig { get; set; }
    }
}
