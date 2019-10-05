namespace LDC.Atlas.Infrastructure.Models
{
    public class AzureAdConfiguration
    {
        public string ClientId { get; set; }

        public string ClientSecret { get; set; }

        public string Authority { get; set; }

        public string RedirectUri { get; set; }

        public string Resource { get; set; }

        public string Scopes { get; set; }

        public string GroupId { get; set; }
    }
}
