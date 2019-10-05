using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Lock.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddLockAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                //options.AddPolicy(Policies.ReadLockPolicy, policy =>
                //{
                //    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                //    {
                //        new PrivilegePermission
                //        {
                //            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                //            Permission = PermissionLevel.Read
                //        },
                //        new PrivilegePermission
                //        {
                //            Name = AtlasPrivileges.FinancialPrivileges.ReadLock,
                //            Permission = PermissionLevel.Read
                //        }
                //    }));
                //});

                //options.AddPolicy(Policies.EditLockPolicy, policy =>
                //{
                //    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                //    {
                //        new PrivilegePermission
                //        {
                //            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                //            Permission = PermissionLevel.Read
                //        },
                //        new PrivilegePermission
                //        {
                //            Name = AtlasPrivileges.FinancialPrivileges.WriteLock,
                //            Permission = PermissionLevel.ReadWrite
                //        }
                //    }));
                //});
            });
        }
    }

    internal static class Policies
    {
        public const string ReadLockPolicy = "ReadLockPolicy";
        public const string EditLockPolicy = "EditLockPolicy";
    }
}
