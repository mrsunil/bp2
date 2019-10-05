using Autofac;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Tags;

namespace LDC.Atlas.Application.Common
{
    public class MediatorModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<Services.DatabaseDateTimeService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<Services.ProcessMessageService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<Services.UserService>().AsImplementedInterfaces().PropertiesAutowired();

            builder.RegisterType<TagsService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<ApplicationTableService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<FilterSetService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<FormService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<FunctionalObjectService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<GridService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<GridViewService>().AsImplementedInterfaces().PropertiesAutowired();
            builder.RegisterType<UserConfigurationService>().AsImplementedInterfaces().PropertiesAutowired();
        }
    }
}
