using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LDC.Atlas.Infrastructure.Swagger
{
    public class AddResponseHeadersFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
        {
            // https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/764
            if (context.MethodInfo.DeclaringType != null)
            {
                var responseAttributes = context.MethodInfo.DeclaringType.GetCustomAttributes(true)
                    .Union(context.MethodInfo.GetCustomAttributes(true))
                    .OfType<SwaggerResponseHeaderAttribute>();

                foreach (var attr in responseAttributes)
                {
                    var response = operation.Responses.FirstOrDefault(x => x.Key == attr.StatusCode.ToString(CultureInfo.InvariantCulture)).Value;

                    if (response != null)
                    {
                        if (response.Headers == null)
                        {
                            response.Headers = new Dictionary<string, Header>();
                        }

                        response.Headers.Add(attr.Name, new Header { Description = attr.Description, Type = attr.Type });
                    }
                }
            }
        }
    }
}
