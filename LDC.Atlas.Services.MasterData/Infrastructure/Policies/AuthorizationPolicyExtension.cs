using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.MasterData.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddMasterDataAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ReadFxRatesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.MarketData,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });

                options.AddPolicy(Policies.EditFxRatesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.MarketData,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.EditCounterpartyPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.EditContractTermPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.EditPaymentTermPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.EditBusinessSectorPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.EditVesselPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
          

                options.AddPolicy(Policies.EditArbitrationPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditDepartmentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditNominalAccountPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditProfitCenterPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditTaxTypePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditPriceUnitPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditShippingStatusPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditWeightUnitPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditCostTypePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditPortPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditPeriodTypePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditCountryPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditCurrencyPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditRegionPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
                options.AddPolicy(Policies.EditTaxCodePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });

                options.AddPolicy(Policies.EditFxTradeTypePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.ReadWrite
                        },
                    }));
                });
            });
        }
    }

    internal static class Policies
    {
        public const string ReadFxRatesPolicy = "ReadFxRatesPolicy";
        public const string EditFxRatesPolicy = "EditFxRatesPolicy";
        public const string EditCounterpartyPolicy = "EditCounterpartyPolicy";
        public const string EditContractTermPolicy = "EditContractTermPolicy";
        public const string EditPaymentTermPolicy = "EditPaymentTermPolicy";
        public const string EditBusinessSectorPolicy = "EditBusinessSectorPolicy";
        public const string EditVesselPolicy = "EditVesselPolicy";
        public const string EditArbitrationPolicy = "EditArbitrationPolicy";
        public const string EditDepartmentPolicy = "EditDepartmentPolicy";
        public const string EditNominalAccountPolicy = "EditNominalAccountPolicy";
        public const string EditProfitCenterPolicy = "EditProfitCenterPolicy";
        public const string EditTaxTypePolicy = "EditTaxTypePolicy";
        public const string EditPriceUnitPolicy = "EditPriceUnitPolicy";
        public const string EditShippingStatusPolicy = "EditShippingStatusPolicy";
        public const string EditWeightUnitPolicy = "EditWeightUnitPolicy";
        public const string EditCostTypePolicy = "EditCostTypePolicy";
        public const string EditPortPolicy = "EditPortPolicy";
        public const string EditPeriodTypePolicy = "EditPeriodTypePolicy";
        public const string EditCountryPolicy = "EditCountryPolicy";
        public const string EditCurrencyPolicy = "EditCurrencyPolicy";
        public const string EditRegionPolicy = "EditRegionPolicy";
        public const string EditTaxCodePolicy = "EditTaxCodePolicy";
        public const string EditFxTradeTypePolicy = "EditFxTradeTypePolicy";
    }
}
