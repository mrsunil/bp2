﻿//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v11.15.3.0 (NJsonSchema v9.10.27.0 (Newtonsoft.Json v9.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

using System;
using System.Text;

namespace LDC.Atlas.Services.PreAccounting.Entities.Bold
{

    public partial class CommercialInvoiceClient : ICommercialInvoiceClient
    {
        partial void PrepareRequest(System.Net.Http.HttpClient client, System.Net.Http.HttpRequestMessage request, System.Text.StringBuilder urlBuilder)
        {
            var byteArray = Encoding.ASCII.GetBytes("test_api:test_api");
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        }

        public class CommercialInvoiceResponse
        {
            public string uuid { get; set; }
        }
    }

}