using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LDC.Atlas.Application.Core.Exceptions
{
    public class ApplicationValidationException : Exception, ISerializable
    {
        public ApplicationValidationException()
        {
        }

        public ApplicationValidationException(string message)
            : base(message)
        {
        }

        public ApplicationValidationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public ApplicationValidationException(string message, Exception innerException, IDictionary<string, string[]> errors)
            : base(message, innerException)
        {
            Errors = errors;
        }

        // This constructor is needed for serialization.
        protected ApplicationValidationException(SerializationInfo info, StreamingContext context)
                    : base(info, context)
        {
            Errors = info.GetValue("errors", typeof(IDictionary<string, string[]>)) as IDictionary<string, string[]>;
        }

        public IDictionary<string, string[]> Errors { get; } = new Dictionary<string, string[]>();

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            if (info == null)
            {
                throw new ArgumentNullException(nameof(info));
            }

            info.AddValue("errors", Errors);
            base.GetObjectData(info, context);
        }
    }
}
