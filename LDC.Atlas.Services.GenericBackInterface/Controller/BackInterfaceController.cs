using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Services.GenericBackInterface.Entities;
using LDC.Atlas.Services.GenericBackInterface.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using static LDC.Atlas.Services.GenericBackInterface.Infrastructure.Policies.AuthorizationPoliciesExtension;

namespace LDC.Atlas.Services.GenericBackInterface.Controller
{
    [Route("api/v1/genericbackinterface/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class BackInterfaceController : ControllerBase
    {
        private readonly AtlasService _atlasService;
        private readonly ILogger _logger;

        public BackInterfaceController(AtlasService atlasService, ILogger<BackInterfaceController> logger)
        {
            _atlasService = atlasService ?? throw new ArgumentNullException(nameof(atlasService));
            _logger = logger;
        }

        /// <summary>
        /// Process esb response
        /// </summary>
        /// <param name="message">The identifier of the esb request to be processed.</param>
        [HttpPost("externalinterfaceresponse")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status405MethodNotAllowed)]
        [Authorize(Policies.GenericBackInterfacePolicy)]
        public async Task<IActionResult> ProcessESBResponse([FromBody] Message message)
        {
            _logger.LogInformation("Process ESB response: {@Atlas_EsbMessage}", message);

            List<string> emptyFields = new List<string>();
            try
            {
                ProcessESBResult processESBResult;
                var businessApplication = string.Empty;
                string body;
                Request.Body.Position = 0;
                using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    body = await reader.ReadToEndAsync();
                }

                if (!string.IsNullOrEmpty(body))
                {
                    var res = new Response();
                    BusinessApplicationType applicationType;
                    if (string.IsNullOrEmpty(message.functionalAck.header[0].status))
                    {
                        emptyFields.Add("status");
                    }
                    else
                    {
                        res.ResponseStatus = message.functionalAck.header[0].status;

                        // Booked should be saved as Completed in DB
                        if (res.ResponseStatus.ToUpper() == "BOOKED")
                        {
                            res.ResponseStatus = "Completed";
                        }
                    }

                    if (string.IsNullOrEmpty(message.functionalAck.items[0].ackBusinessDocId))
                    {
                        emptyFields.Add("ackBusinessDocId");
                    }
                    else
                    {
                        res.AckBusinessDocId = message.functionalAck.items[0].ackBusinessDocId;
                    }

                    res.ResponseMessage = message.functionalAck.items[0].lineItemAck[0].returnMessage;
                    if (string.IsNullOrEmpty(message.functionalAck.functionalDocId.businessDocID))
                    {
                        emptyFields.Add("businessDocID");
                    }
                    else
                    {
                        res.DocumentReference = message.functionalAck.functionalDocId.businessDocID;
                    }

                    if (string.IsNullOrEmpty(message.functionalAck.functionalDocId.businessEntity))
                    {
                        emptyFields.Add("businessEntity");
                    }
                    else
                    {
                        res.CompanyId = message.functionalAck.functionalDocId.businessEntity;
                    }

                    if (string.IsNullOrEmpty(message.functionalAck.header[0].originalBusinessObject))
                    {
                        emptyFields.Add("originalBusinessObject");
                    }
                    else
                    {
                        BusinessObjectType objectType;
                        Enum.TryParse(message.functionalAck.header[0].originalBusinessObject, out objectType);
                        res.BusinessObjectType = objectType;
                    }

                    if (string.IsNullOrEmpty(message.functionalAck.header[0].origMessageTimeStamp))
                    {
                        emptyFields.Add("origMessageTimeStamp");
                    }
                    else
                    {
                        string messageDate = message.functionalAck.header[0].origMessageTimeStamp;
                        DateTime messageTimeStamp = DateTime.ParseExact(messageDate, "yyyyMMddHHmmss", CultureInfo.InvariantCulture);
                        res.TimeStamp = messageTimeStamp;
                    }

                    res.ESBMessage = body;
                    if (string.IsNullOrEmpty(message.functionalAck.header[0].ackBusinessApplication))
                    {
                        emptyFields.Add("ackBusinessApplication");
                    }
                    else
                    {
                        businessApplication = message.functionalAck.header[0].ackBusinessApplication;
                    }

                    var parametersCount = message.functionalAck.items[0].lineItemAck[0].parameters.Length;

                    if (Enum.TryParse(businessApplication, out applicationType))
                    {
                        switch (applicationType)
                        {
                            case BusinessApplicationType.TRAX:
                                res.BusinessApplicationType = BusinessApplicationType.TRAX;
                                for (int i = 0; i < parametersCount; i++)
                                {
                                    if (message.functionalAck.items[0].lineItemAck[0].parameters[i].parameterName == "ValueDate")
                                    {
                                        if (string.IsNullOrEmpty(message.functionalAck.items[0].lineItemAck[0].parameters[i].value))
                                        {
                                            emptyFields.Add("ValueDate");
                                        }
                                        else
                                        {
                                            res.ValueDate = Convert.ToDateTime(message.functionalAck.items[0].lineItemAck[0].parameters[i].value, CultureInfo.InvariantCulture);
                                        }
                                    }
                                    else if (message.functionalAck.items[0].lineItemAck[0].parameters[i].parameterName == "CounterParty")
                                    {
                                        if (string.IsNullOrEmpty(message.functionalAck.items[0].lineItemAck[0].parameters[i].value))
                                        {
                                            emptyFields.Add("CounterParty");
                                        }
                                        else
                                        {
                                            res.Counterparty = message.functionalAck.items[0].lineItemAck[0].parameters[i].value;
                                        }
                                    }
                                }

                                break;
                            case BusinessApplicationType.AX:
                                res.BusinessApplicationType = BusinessApplicationType.AX;
                                for (int i = 0; i < parametersCount; i++)
                                {
                                    if (message.functionalAck.items[0].lineItemAck[0].parameters[i].parameterName == "JournalNum")
                                    {
                                        if (string.IsNullOrEmpty(message.functionalAck.items[0].lineItemAck[0].parameters[i].value))
                                        {
                                            emptyFields.Add("JournalNum");
                                        }
                                        else
                                        {
                                            res.JournalNumber = message.functionalAck.items[0].lineItemAck[0].parameters[i].value;
                                        }
                                    }

                                    if (message.functionalAck.items[0].lineItemAck[0].parameters[i].parameterName == "AXTransDate")
                                    {
                                        if (!string.IsNullOrEmpty(message.functionalAck.items[0].lineItemAck[0].parameters[i].value))
                                        {
                                            string transactionDate = message.functionalAck.items[0].lineItemAck[0].parameters[i].value;
                                            DateTime transactionDateByESB = DateTime.ParseExact(transactionDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                                            res.TransactionDate = transactionDateByESB;
                                        }
                                    }
                                }

                                // removing ackBusinessDocId from mandatory fields as these are not mandatory in case of AX (rejected)
                                if (emptyFields.Count > 0 && emptyFields.Contains("ackBusinessDocId"))
                                {
                                    emptyFields.Remove("ackBusinessDocId");
                                }

                                res.UUID = message.functionalAck.header[0].origMessageId;
                                res.AckBusinessEntity = message.functionalAck.items[0].ackBusinessEntity;
                                break;
                        }

                        if (emptyFields.Count > 0)
                        {
                            var field = string.Join(",", emptyFields);
                            string errormessage = $"The field(s) {field} is/are empty";
                            _logger.LogError(errormessage);
                            return StatusCode(405, new MessageError { Text = errormessage });
                        }
                        else
                        {
                            processESBResult = await _atlasService.CallAtlasApiAsync(res);

                            if (processESBResult.IsSuccess)
                            {
                                if (Enum.TryParse(businessApplication, out applicationType))
                                {
                                    switch (applicationType)
                                    {
                                        case BusinessApplicationType.TRAX:
                                            return Ok($"<uuid>{processESBResult.UUID}</uuid>");
                                        case BusinessApplicationType.AX:
                                            return Ok();
                                    }
                                }
                            }
                            else
                            {
                                _logger.LogError(processESBResult.Error);
                                return StatusCode(405, new MessageError { Text = processESBResult.Error });
                            }
                        }
                    }
                }

                return BadRequest();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);

                return StatusCode(405, new MessageError { Text = e.Message });
            }
        }
    }
}
