namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class CurrentCompanyConfigurationDto
    {
        internal long CompanyId { get; set; }

        public bool CanEditInvoiceSetup { get; set; }

        public bool CanEditInterfaceSetup { get; set; }

        public bool CanEditCompanySettings { get; set; }

        public CompanySetupDto CompanySetup { get; set; }

        public InvoiceSetupDto InvoiceSetup { get; set; }

        public InterfaceSetupDto InterfaceSetup { get; set; }
    }
}
