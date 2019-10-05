namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class PrivilegeDto
    {
        public int PrivilegeId { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public int Level { get; set; }

        public string Description { get; set; }

        public int? ParentId { get; set; }

        public int? Type { get; set; }

        public int? Order { get; set; }
    }
}
