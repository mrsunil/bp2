using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace LDC.Atlas.Infrastructure.Models
{
    public class ApplicationSecurityProblemDetails : ProblemDetails
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationSecurityProblemDetails"/> class.
        /// </summary>
        public ApplicationSecurityProblemDetails()
        {
            Title = Resources.ExceptionProblemSecurityTitle;
            Type = "https://atlas.ldc.com/security-error";
        }

        public ApplicationSecurityProblemDetails(IEnumerable<string> errors)
            : this()
        {
            if (errors != null)
            {
                foreach (var error in errors)
                {
                    Errors.Add(error);
                }
            }
        }

        /// <summary>
        /// Gets the validation errors associated with this instance of <see cref="ApplicationSecurityProblemDetails"/>.
        /// </summary>
        public List<string> Errors { get; } = new List<string>();
    }
}
