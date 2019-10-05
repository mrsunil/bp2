using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Infrastructure
{
    /// <summary>
    /// A <see cref="ProblemDetails"/> for validation errors.
    /// </summary>
    public class ApplicationValidationProblemDetails : ProblemDetails
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationValidationProblemDetails"/> class.
        /// </summary>
        public ApplicationValidationProblemDetails()
        {
            Title = Resources.ApplicationValidationProblemDescriptionTitle;
            Type = "https://atlas.ldc.com/validation-error";
        }

        public ApplicationValidationProblemDetails(IDictionary<string, string> errors)
            : this()
        {
            foreach (var error in errors)
            {
                Errors.Add(error.Key, error.Value);
            }
        }

        /// <summary>
        /// Gets the validation errors associated with this instance of <see cref="ApplicationValidationProblemDetails"/>.
        /// </summary>
        public IDictionary<string, string> Errors { get; } = new Dictionary<string, string>(StringComparer.Ordinal);
    }
}
