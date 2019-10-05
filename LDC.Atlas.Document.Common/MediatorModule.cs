using Autofac;
using System;
using System.Reflection;

namespace LDC.Atlas.Document.Common
{
    public class MediatorModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
                .Where(x => x.Name.EndsWith("Repository", StringComparison.InvariantCulture)
                            || x.Name.EndsWith("Queries", StringComparison.InvariantCulture))
                .PropertiesAutowired()
                .AsImplementedInterfaces();

            builder.RegisterType<Services.PhysicalDocumentGenerationService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<PhysicalDocumentDatabaseStorageService>().AsImplementedInterfaces().PropertiesAutowired();
        }
    }
}
