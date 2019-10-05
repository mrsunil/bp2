using Autofac;
using System;

namespace LDC.Atlas.MasterData.Common
{
    public class MediatorModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(typeof(MediatorModule).Assembly)
                .Where(x => x.Name.EndsWith("Repository", StringComparison.InvariantCulture)
                            || x.Name.EndsWith("Queries", StringComparison.InvariantCulture))
                .PropertiesAutowired()
                .AsImplementedInterfaces();

            builder.RegisterType<MasterDataService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<ForeignExchangeRateService>().AsImplementedInterfaces().PropertiesAutowired();
        }
    }
}
