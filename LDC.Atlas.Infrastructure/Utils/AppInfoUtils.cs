using System.Reflection;

namespace LDC.Atlas.Infrastructure.Utils
{
    public static class AppInfoUtils
    {
        public static string InformationalVersion { get; } = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion;

        public static string AssemblyName { get; } = Assembly.GetEntryAssembly().FullName;

        public static string AtlasServiceName { get; } = Assembly.GetEntryAssembly().GetCustomAttribute<AtlasServiceAssemblyAttribute>()?.ServiceName;
    }
}
