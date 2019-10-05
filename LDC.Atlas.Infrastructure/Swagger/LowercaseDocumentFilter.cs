using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

namespace LDC.Atlas.Services.Execution.Infrastructure.Swagger
{
    // https://gist.github.com/yann510/76a2fc61605811f4e95720c2d405ca00
    public class LowercaseDocumentFilter : IDocumentFilter
    {
        public void Apply(SwaggerDocument swaggerDoc, DocumentFilterContext context)
        {
            swaggerDoc.Paths = swaggerDoc.Paths.ToDictionary(entry => LowercaseEverythingButParameters(entry.Key), entry => entry.Value);
        }

        private static string LowercaseEverythingButParameters(string key)
        {
            return string.Join("/", key.Split('/').Select(x => x.Contains("{") ? x : x.ToLowerInvariant()));
        }
    }
}
