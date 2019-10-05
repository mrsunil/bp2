namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class GridViewDto
    {
        public int GridViewId { get; set; }

        public string CompanyId { get; set; }

        public string Name { get; set; }

        public bool IsDefault { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public string GridCode { get; set; }

        public string ViewColumnsConfiguration { get; set; }
    }
}
