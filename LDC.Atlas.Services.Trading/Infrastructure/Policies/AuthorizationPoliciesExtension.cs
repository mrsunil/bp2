using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using LDC.Atlas.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Trading.Infrastructure.Policies
{
    public static class AuthorizationPoliciesExtension
    {
        public static void AddTradeAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(AtlasStandardPolicies.TradingAreaPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.Trades, PermissionLevel.Read));
                });
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ReadTradePhysicalPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.TradesPhysicals, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.ReadTradeFuturesAndOptionsPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.CostMatrices, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.ReadCostMatricesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.CostMatrices, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.ReadFxDealPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.FxDeals, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.WriteCostMatricesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.CostMatrices, PermissionLevel.ReadWrite));
                });

                options.AddPolicy(Policies.CreateTradePhysicalPolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.CreateTrade,
                            Permission = PermissionLevel.ReadWrite
                        },
                         new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.ImageCreation,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.AmendSnapshotPhysicalPolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.AmendSnapshot,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.WriteTradeFuturesAndOptionsPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.CostMatrices, PermissionLevel.ReadWrite));
                });

                options.AddPolicy(Policies.WriteTradePhysicalPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.TradesPhysicals, PermissionLevel.ReadWrite));
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

                options.AddPolicy(Policies.DeleteCostsTradePhysicalPolicy, policy =>
                {
                    policy.AddRequirements(new DeleteCostsTradePhysicalRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TradesPhysicals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.DeleteCosts,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.CreateTrancheSplitPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.CreateTrancheSplit,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.GenerateContractAdvicePolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.GenerateContractAdvice,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.TradeApprovalPolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.ApproveTrade,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.TradeDeletionPolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.TradeDeletion,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.BuyerCodePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.BuyerCode,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.SellerCodePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.SellerCode,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CounterPartyPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.CounterPartyReference,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CommodityPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.Commodity,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CropYearPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.CropYear,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.QuantityCodePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.QuantityCode,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.QuantityPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.Quantity,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.QuantityContractedPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.QuantityContracted,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ContractTermsPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.ContractTerms,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PortTermsPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PortTerms,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ArbitrationPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.Arbitration,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.CurrencyPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.Currency,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PriceCodePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PriceCode,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ContractPricePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.ContractPrice,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ContractValuePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.ContractValue,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PaymentTermsPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PaymentTerms,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PeriodTypePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PeriodType,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.FromDatePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.FromDate,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ToDatePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.ToDate,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PositionTypePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PositionType,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PortOfOriginPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PortOfOrigin,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.PortOfDestinationPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.PortOfDestination,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.MarketSectorPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MarketSector,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.InternalMemorandumPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.MainTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.InternalMemorandum,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ContractIssuedOnPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.StatusTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.ContractIssuedOn,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.OtherReferencePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.StatusTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.OtherReference,
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
                options.AddPolicy(Policies.GroupingNumberPolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.GroupingNumber,
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
                options.AddPolicy(Policies.QuantityCodeForTrafficPolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.QuantityCodeForTraffic,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.EditingCostTabGridPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.CostTab,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.EditingCostGrid,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.TradeReport, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.TradeReport,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.GlobalReports,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });

                options.AddPolicy(Policies.FxExposureReportPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.FxExposureReport,
                            Permission = PermissionLevel.ReadWrite
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.GlobalReports,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });

                options.AddPolicy(Policies.CreateEditFxDealPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new PrivilegePermission[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.FxDeals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.CreateEditFxDeal,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.CancelReverseTradePolicy, policy =>
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
                            Name = AtlasPrivileges.TradesPrivileges.CancelReverseTrade,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.DeleteFxDealPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.FxDeals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.DeleteFxDeal,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.CloseTradePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.TradesPhysicals,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.TradesPrivileges.CloseTrade,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
            });
        }
    }

    internal static class Policies
    {
        public const string CreateTradePhysicalPolicy = "CreateTradePhysicalPolicy";
        public const string AllocateTradePhysicalPolicy = "AllocateTradePhysicalPolicy";
        public const string EditCostsTradePhysicalPolicy = "EditCostsTradePhysicalPolicy";
        public const string DeleteCostsTradePhysicalPolicy = "DeleteCostsTradePhysicalPolicy";
        public const string AmendSnapshotPhysicalPolicy = "AmendSnapshotPhysicalPolicy";

        public const string ReadTradePhysicalPolicy = "ReadPhysicalTradesPolicy";
        public const string ReadTradeFuturesAndOptionsPolicy = "ReadFuturesAndOptionsTradesPolicy";
        public const string ReadCostMatricesPolicy = "ReadCostMatricesPolicy";
        public const string WriteCostMatricesPolicy = "ReadCostMatricesPolicy";
        public const string TradeReport = "TradeReport";

        public const string WriteTradePhysicalPolicy = "WriteTradePhysicalPolicy";
        public const string WriteTradeFuturesAndOptionsPolicy = "WriteTradeFuturesAndOptionsPolicy";
        public const string CreateTrancheSplitPolicy = "CreateTrancheSplitPolicy";
        public const string GenerateContractAdvicePolicy = "GenerateContractAdvicePolicy";
        public const string TradeApprovalPolicy = "TradeApprovalPolicy";
        public const string TradeDeletionPolicy = "TradeDeletionPolicy";
        public const string BuyerCodePolicy = "BuyerCodePolicy";
        public const string SellerCodePolicy = "SellerCodePolicy";
        public const string CounterPartyPolicy = "CounterPartyPolicy";
        public const string CommodityPolicy = "CommodityPolicy";
        public const string CropYearPolicy = "CropYearPolicy";
        public const string QuantityCodePolicy = "QuantityCodePolicy";
        public const string QuantityPolicy = "QuantityPolicy";
        public const string QuantityContractedPolicy = "QuantityContractedPolicy";
        public const string ContractTermsPolicy = "ContractTermsPolicy";
        public const string PortTermsPolicy = "PortTermsPolicy";
        public const string ArbitrationPolicy = "ArbitrationPolicy";
        public const string CurrencyPolicy = "CurrencyPolicy";
        public const string PriceCodePolicy = "PriceCodePolicy";
        public const string ContractPricePolicy = "ContractPricePolicy";
        public const string ContractValuePolicy = "ContractValuePolicy";
        public const string PaymentTermsPolicy = "PaymentTermsPolicy";
        public const string PeriodTypePolicy = "PeriodTypePolicy";
        public const string FromDatePolicy = "FromDatePolicy";
        public const string ToDatePolicy = "ToDatePolicy";
        public const string PositionTypePolicy = "PositionTypePolicy";
        public const string PortOfOriginPolicy = "PortOfOriginPolicy";
        public const string PortOfDestinationPolicy = "PortOfDestinationPolicy";
        public const string MarketSectorPolicy = "MarketSectorPolicy";
        public const string InternalMemorandumPolicy = "InternalMemorandumPolicy";
        public const string ContractIssuedOnPolicy = "ContractIssuedOnPolicy";
        public const string OtherReferencePolicy = "OtherReferencePolicy";
        public const string VesselNamePolicy = "VesselNamePolicy";
        public const string BlDatePolicy = "BlDatePolicy";
        public const string BlReferencePolicy = "BlReferencePolicy";
        public const string GroupingNumberPolicy = "GroupingNumberPolicy";
        public const string QuantityForTrafficPolicy = "QuantityForTrafficPolicy";
        public const string QuantityCodeForTrafficPolicy = "QuantityCodeForTrafficPolicy";
        public const string EditingCostTabGridPolicy = "EditingCostTabGridPolicy";

        public const string EditCostMatricesPolicy = "EditCostMatricesPolicy";

        public const string ReadFxDealPolicy = "ReadFxDealPolicy";
        public const string CreateEditFxDealPolicy = "CreateEditFxDealPolicy";
        public const string DeleteFxDealPolicy = "DeleteFxDealPolicy";
        public const string CancelReverseTradePolicy = "CancelReverseTradePolicy";
        public const string CloseTradePolicy = "CloseTradePolicy";
        public const string FxExposureReportPolicy = "FxExposureReportPolicy";
    }
}
