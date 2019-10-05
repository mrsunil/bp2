using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LDC.Atlas.Application.Core.Exceptions
{
    public class AtlasSecurityException : Exception
    {
        public AtlasSecurityException()
        {
        }

        public AtlasSecurityException(string message)
            : base(message)
        {
        }

        public AtlasSecurityException(string message, IEnumerable<string> errors)
            : base(message)
        {
            Errors = errors;
        }

        public AtlasSecurityException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        protected AtlasSecurityException(SerializationInfo info, StreamingContext context)
                    : base(info, context)
        {
            Errors = info.GetValue("errors", typeof(IEnumerable<string>)) as IEnumerable<string>;
        }

        public IEnumerable<string> Errors { get; }

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
