using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Application.Core.Exceptions
{
    public class AtlasTechnicalException : Exception
    {
        public AtlasTechnicalException()
        {
        }

        public AtlasTechnicalException(string message)
            : base(message)
        {
        }

        public AtlasTechnicalException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
