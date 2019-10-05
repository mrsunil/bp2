using System;

namespace LDC.Atlas.Application.Core.Exceptions
{
    public class AtlasBusinessException : Exception
    {
        public AtlasBusinessException()
        {
        }

        public AtlasBusinessException(string message)
            : base(message)
        {
        }

        public AtlasBusinessException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
