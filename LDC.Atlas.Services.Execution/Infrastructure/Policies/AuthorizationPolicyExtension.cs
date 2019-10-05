using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using LDC.Atlas.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Execution.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddExecutionAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.DeleteCostInvoiceMarkingPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TradesPhysicals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.DeleteCostInvoiceMarking,
                            Permission = PermissionLevel.ReadWrite
                        }
                        }));
                });

                options.AddPolicy(Policies.DeleteInvoiceMarkingPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TradesPhysicals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.DeleteInvoiceMarking,
                            Permission = PermissionLevel.ReadWrite
                        }
                        }));
                });

                options.AddPolicy(Policies.AllocateTradePhysicalPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TradesPhysicals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.AllocateDeallocate,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.ManageCharterPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.ChartersPrivileges.CharterView, PermissionLevel.ReadWrite));
                });

                options.AddPolicy(Policies.CharterPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.ChartersPrivileges.CharterView, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.AssignOrDeassignContractPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ChartersPrivileges.CharterView,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ChartersPrivileges.AssignOrDeassignContract,
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
                options.AddPolicy(Policies.CashPaidDifferentClientPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashPayment,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CPDIFFCLI,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashPaidDifferentCurrencyPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashPayment,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CPDIFFCCY,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashPaidFullPartialPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashPayment,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CPPICKTX,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashPaymentSimplePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashPayment,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CPSIMPLE,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashReceiptDifferentCurrencyPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashReceipt,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CRDIFFCCY,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashReceiptFullPartialPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashReceipt,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CRPICKTX,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashReceiptSimplePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashReceipt,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CRSIMPLE,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CashReceiptTraxPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CashReceipt,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.CashPrivileges.CPTraxEdit,
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

                options.AddPolicy(Policies.UpdatePostingStatusPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.UpdatePostingStatusPolicy.PostingStatus, PermissionLevel.ReadWrite));
                });


                options.AddPolicy(Policies.CreateTransactionDocumentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.CreateTransactionDocument.TransactionDocument, PermissionLevel.ReadWrite));
                });

                options.AddPolicy(Policies.CreateDeleteMatchFlagPolicy, policy =>
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
                            Name = AtlasPrivileges.FinancialPrivileges.CreateDeleteMatchFlag,
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
                        }
                    }));
                });
                options.AddPolicy(Policies.GeneratePostings, policy =>
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
                        }
                    }));
                });
                options.AddPolicy(Policies.VesselNamePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TrafficTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.VesselName,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.BlDatePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TrafficTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.BlDate,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.BlReferencePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TrafficTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.BlReference,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.QuantityForTrafficPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TrafficTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.QuantityForTraffic,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.SuperTradeEditionPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TradesPhysicals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.SuperTradeEdition,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });
            });
        }
    }

    internal static class Policies
    {
        public const string DeleteCostInvoiceMarkingPolicy = "DeleteCostInvoiceMarkingPolicy";
        public const string AllocateTradePhysicalPolicy = "AllocateTradePhysicalPolicy";
        public const string CharterPolicy = "CharterActionPolicy";
        public const string ManageCharterPolicy = "ManageCharterPolicy";
        public const string AssignOrDeassignContractPolicy = "AssignOrDeassignContractPolicy";
        public const string PostOpClosedPolicy = "PostOpClosedPolicy";
        public const string CashPaymentSimplePolicy = "CashPaymentSimplePolicy";
        public const string CashReceiptSimplePolicy = "CashReceiptSimplePolicy";
        public const string CashPaidDifferentClientPolicy = "CashPaidDifferentClientPolicy";
        public const string CashPaidFullPartialPolicy = "CashPaidFullPartialPolicy";
        public const string CashReceiptFullPartialPolicy = "CashReceiptFullPartialPolicy";
        public const string CashPaidDifferentCurrencyPolicy = "CashPaidDifferentCurrencyPolicy";
        public const string CashReceiptDifferentCurrencyPolicy = "CashReceiptDifferentCurrencyPolicy";
        public const string CashReceiptTraxPolicy = "CashReceiptTraxPolicy";
        public const string CreateEditDocumentPolicy = "CreateEditDocumentPolicy";
        public const string CreateTransactionDocumentPolicy = "CreateTransactionDocument";
        public const string UpdatePostingStatusPolicy = "UpdatePostingStatus";
        public const string CreateDeleteMatchFlagPolicy = "CreateDeleteMatchFlagPolicy";
        public const string DeleteInvoiceMarkingPolicy = "DeleteInvoiceMarking";
        public const string GenerateEndOfMonthPolicy = "GenerateEndOfMonthPolicy";
        public const string GeneratePostings = "GeneratePostings";
        public const string VesselNamePolicy = "VesselNamePolicy";
        public const string BlDatePolicy = "BlDatePolicy";
        public const string BlReferencePolicy = "BlReferencePolicy";
        public const string QuantityForTrafficPolicy = "QuantityForTrafficPolicy";
        public const string SuperTradeEditionPolicy = "SuperTradeEditionPolicy";
    }
}
