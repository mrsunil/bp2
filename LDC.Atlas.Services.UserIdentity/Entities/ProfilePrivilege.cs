namespace LDC.Atlas.Services.UserIdentity.Entities
{
    public class ProfilePrivilege
    {
        public int Id { get; set; }

        public int PrivilegeId { get; set; }

        public int ProfileId { get; set; }

        public int Permission { get; set; }
    }
}
