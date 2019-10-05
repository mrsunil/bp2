using FluentValidation;
using FluentValidation.Results;
using LDC.Atlas.Application.Core.Exceptions;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Core.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly IValidator<TRequest>[] _validators;

        public ValidationBehavior(IValidator<TRequest>[] validators) => _validators = validators;

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            var results = _validators
               .Select(v => v.Validate(request))
               .ToList();

            var failures = results
               .Where(r => !r.IsValid)
               .SelectMany(result => result.Errors)
               .Where(error => error != null)
               .ToList();

            if (failures.Any())
            {
                var errors = results.ToDictionary();

                throw new ApplicationValidationException(
                    $"Command Validation Errors for type {typeof(TRequest).Name}", new ValidationException("Validation exception", failures), errors);
            }

            var response = await next();
            return response;
        }
    }

    public static class ValidationResultExtension
    {
        public static IDictionary<string, string[]> ToDictionary(this IEnumerable<ValidationResult> results, string prefix = null)
        {
            var errors = new Dictionary<string, string[]>();

            foreach (var result in results)
            {
                result.AddToDictionary(errors, prefix);
            }

            return errors;
        }

        /// <summary>
        /// Stores the errors in a ValidationResult object to the specified dictionary.
        /// </summary>
        /// <param name="result">The validation result to store</param>
        /// <param name="errors">The dictionary to store the errors in.</param>
        /// <param name="prefix">An optional prefix. If omitted, the property names will be the keys. If specified, the prefix will be concatenated to the property name with a period. Eg "user.Name"</param>
        public static void AddToDictionary(this ValidationResult result, IDictionary<string, string[]> errors, string prefix)
        {
            if (!result.IsValid)
            {
                foreach (var error in result.Errors)
                {
                    string key = string.IsNullOrEmpty(prefix) ? error.PropertyName : prefix + "." + error.PropertyName;

                    if (errors.TryGetValue(key, out string[] value))
                    {
                        // Optimization needed to avoid allocated arrays
                        var l = errors[key].ToList();
                        l.Add(error.ErrorMessage);
                        errors[key] = l.ToArray();
                    }
                    else
                    {
                        errors.Add(key, new[] { error.ErrorMessage });
                    }
                }
            }
        }
    }
}
