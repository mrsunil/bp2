using System.Net;

public class InterfaceResponse
{
   public string ErrorMessage { get; set; }

   public HttpStatusCode StatusCode { get; set; }
}