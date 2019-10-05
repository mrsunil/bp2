namespace LDC.Atlas.Services.Configuration.Entities
{
    public class GridView
    {
        public int GridViewId { get; set; }

        public string CompanyId { get; set; }

        public string CreatedBy { get; set; }

        public string Name { get; set; }

        public bool IsDefault { get; set; }

        public bool IsFavorite { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public string GridCode { get; set; }

        public string GridViewColumnConfig { get; set; }
    }
}
