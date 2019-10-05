namespace LDC.Atlas.Authorization.Core.Entities
{
    /// <summary>
    /// This object is used to get the actions associated with the user and the selected company
    /// The user name is mandatory for getting the user's actions
    /// </summary>
    public class PolicyRequirement
    {
        public string UserId { get; set; }

        public string CompanyID { get; set; }
    }
}
