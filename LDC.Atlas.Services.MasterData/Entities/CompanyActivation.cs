namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CompanyActivation
    {
        public int CompanyId { get; set; }

        public string CompanyCode { get; set; }

        public CompanyActivationState ActivationState { get; set; }
    }
}