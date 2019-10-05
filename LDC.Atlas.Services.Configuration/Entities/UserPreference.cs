namespace LDC.Atlas.Services.Configuration.Entities
{
    public class UserPreference
    {
        public long UserId { get; set; }

        public string ComponentId { get; set; }

        public string Company { get; set; }

        public string ColumnConfig { get; set; }
    }
}
