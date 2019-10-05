namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CompanyAssignment
    {
        public int CompanyId { get; set; }

        public string CompanyCode { get; set; }

        public CompanyAssignmentState AssignmentState { get; set; }
    }
}