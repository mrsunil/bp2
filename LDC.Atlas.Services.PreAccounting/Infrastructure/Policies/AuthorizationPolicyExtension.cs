using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.PreAccounting.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddPreaccountingAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.StartPostingPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingManagement,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.StartPosting,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.AuthorizePostingPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingManagement,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.AuthorizePosting,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.PostOpClosedPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingManagement,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostopClosed,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.GenerateEndOfMonthPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.GenerateEndOfMonth,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.GenerateEndOfYearPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.GenerateEndOfYear,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.CloseReverseAccountingPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CloseReverseAccounting,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.CloseOperationPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CloseOperation,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.ReverseOperationPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.ReverseOperation,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditClosureSettingsDialogPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.EditClosureSettingsDialog,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.DeleteAccountingDocumentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingManagement,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.DeleteAccountingDocument,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.GeneratePostingsPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.GeneratePostings,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.PostingInterfacePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingManagement,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingInterface,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.ReverseDocumentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.AccountingEntries,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.ReverseDocument,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.EditAccountingEntriesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.AccountingEntries,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.EditAccountingEntries,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.EditPostingManagementPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.PostingManagement,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.EditPostingManagement,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.CreateEditDocumentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.AccountingEntries,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CreateEditDocument,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.PostingManagementPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.FinancialPrivileges.PostingManagement, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.ClientTransationReport, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.ClientTransactionReport,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.GlobalReports,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });

                options.AddPolicy(Policies.NominalReport, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.NominalReport,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.GlobalReports,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });
            });
         }
    }

    internal static class Policies
    {
        public const string StartPostingPolicy = "StartPostingPolicy";
        public const string AuthorizePostingPolicy = "AuthorizePostingPolicy";
        public const string PostingManagementPolicy = "PostingManagementPolicy";
        public const string PostOpClosedPolicy = "PostOpClosedPolicy";
        public const string GenerateEndOfMonthPolicy = "GenerateEndOfMonthPolicy";
        public const string GenerateEndOfYearPolicy = "GenerateEndOfYearPolicy";
        public const string CloseReverseAccountingPolicy = "CloseRevAccPolicy";
        public const string CloseOperationPolicy = "CloseOpPolicy";
        public const string ReverseOperationPolicy = "ReverseOpPolicy";
        public const string EditClosureSettingsDialogPolicy = "EditClosureSettingsDialogPolicy";
        public const string DeleteAccountingDocumentPolicy = "DeleteAccountingDocumentPolicy";
        public const string GeneratePostingsPolicy = "GeneratePostingsPolicy";
        public const string PostingInterfacePolicy = "PostingInterfacePolicy";
        public const string ReverseDocumentPolicy = "ReverseDocumentPolicy";
        public const string ViewAccountingEntriesPolicy = "ViewAccountingEntriesPolicy";
        public const string EditAccountingEntriesPolicy = "EditAccountingEntriesPolicy";
        public const string EditPostingManagementPolicy = "EditPostingManagement";
        public const string CreateEditDocumentPolicy = "CreateEditDocumentPolicy";
        public const string ClientTransationReport = "ClientTransationReport";
        public const string NominalReport = "NominalReport";
    }
}
