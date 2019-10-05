using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Infrastructure
{
    /// <summary>
    /// A <see cref="ProblemDetails"/> for exception errors.
    /// </summary>
    public class ExceptionProblemDetails : ProblemDetails
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ExceptionProblemDetails"/> class.
        /// </summary>
        public ExceptionProblemDetails()
        {
            Title = Resources.ExceptionProblemDescriptionTitle;
            Type = "https://atlas.ldc.com/server-error";
        }

        public ExceptionProblemDetails(Exception exception)
            : this()
        {
            Exception = exception?.ToString();
        }

        /// <summary>
        /// Gets the Exception associated with this instance of <see cref="ExceptionProblemDetails"/>.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string Exception { get; }
    }
}
