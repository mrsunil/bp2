using System;
using Microsoft.AspNetCore.Http.Abstractions;
using System.Threading.Tasks;

namespace LDC.Atlas.Exception
{

    public class JsonExceptionHandler
    {
        //public async Task Invoke(HttpContent context)
        //{
        //    Microsoft.AspNetCore.Http.

        //    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        //    var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        //    if (ex == null) return;

        //    var error = new
        //    {
        //        message = ex.Message
        //    };

        //    context.Response.ContentType = "application/json";

        //    using (var writer = new StreamWriter(context.Response.Body))
        //    {
        //        new JsonSerializer().Serialize(writer, error);
        //        await writer.FlushAsync().ConfigureAwait(false);
        //    }
        //}
    }
}
