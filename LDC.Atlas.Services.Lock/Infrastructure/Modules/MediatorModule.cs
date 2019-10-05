using Autofac;
using FluentValidation;
using LDC.Atlas.Application.Core.Behaviors;
using MediatR;
using System;
using System.Reflection;

namespace LDC.Atlas.Services.Lock.Infrastructure.Modules
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

            // Register the validators (FluentValidation)
            builder
               .RegisterAssemblyTypes(typeof(Startup).GetTypeInfo().Assembly)
               .Where(t => t.IsClosedTypeOf(typeof(IValidator<>)))
               .AsImplementedInterfaces();

            builder.Register<ServiceFactory>(ctx =>
            {
                var c = ctx.Resolve<IComponentContext>();
                return t => c.Resolve(t);
            });

            // Register the validation behavior
            builder.RegisterGeneric(typeof(ValidationBehavior<,>)).As(typeof(IPipelineBehavior<,>));

            // Register the logging behavior
            builder.RegisterGeneric(typeof(LoggingBehavior<,>)).As(typeof(IPipelineBehavior<,>));
        }
    }
}
