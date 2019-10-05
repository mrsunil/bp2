namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class InterfaceSetupDto
    {
        public long InterfaceSetUpId { get; set; }

        public int InterfaceTypeId { get; set; }

        public string LegalEntityCode { get; set; }

        public string LegalEntity { get; set; }

        public bool IsActive { get; set; }

        public string InterfaceCode { get; set; }
    }
}
