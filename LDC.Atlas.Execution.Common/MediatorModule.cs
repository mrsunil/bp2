using Autofac;
using System;
using System.Reflection;
using LDC.Atlas.Execution.Common.Queries;

namespace LDC.Atlas.Execution.Common
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

            builder.RegisterType<TransactionDocumentService>().AsImplementedInterfaces().PropertiesAutowired();
        }
    }
}
