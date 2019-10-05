namespace LDC.Atlas.Infrastructure.Utils
{
    [System.AttributeUsage(System.AttributeTargets.Assembly)]
    public class AtlasServiceAssemblyAttribute : System.Attribute
    {
        public AtlasServiceAssemblyAttribute()
            : this(string.Empty)
        {
        }

        public AtlasServiceAssemblyAttribute(string serviceName)
        {
            ServiceName = serviceName;
        }

        public string ServiceName { get; private set; }
    }
}
