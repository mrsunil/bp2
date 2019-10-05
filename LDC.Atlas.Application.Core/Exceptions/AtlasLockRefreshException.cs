using System;

namespace LDC.Atlas.Application.Core.Exceptions
{
    public class AtlasLockRefreshException : Exception
    {
        public AtlasLockRefreshException()
        {
        }

        public AtlasLockRefreshException(string message)
            : base(message)
        {
        }

        public AtlasLockRefreshException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
