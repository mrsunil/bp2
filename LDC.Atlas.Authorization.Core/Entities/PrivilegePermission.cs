namespace LDC.Atlas.Authorization.Core.Entities
{
    /// <summary>
    /// Privilege is the last level of the athorization structure, which define a operation allowed for a user
    /// For example: CanEditBLDate
    /// </summary>
    public class PrivilegePermission
    {
        public string Name { get; set; }

        public PermissionLevel Permission { get; set; }
    }
}
