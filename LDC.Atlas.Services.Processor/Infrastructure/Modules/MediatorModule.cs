using Autofac;
using System;

namespace LDC.Atlas.Services.Processor.Infrastructure.Modules
{
    public class MediatorModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(typeof(Startup).Assembly)
                .Where(x => x.Name.EndsWith("Repository", StringComparison.InvariantCulture)
                            || x.Name.EndsWith("Queries", StringComparison.InvariantCulture))
                 .PropertiesAutowired()
                .AsImplementedInterfaces();
        }
    }
}
