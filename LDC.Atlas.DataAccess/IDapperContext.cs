using LDC.Atlas.Application.Core;
using System;
using System.Data;

namespace LDC.Atlas.DataAccess
{
    public interface IDapperContext : IDisposable
    {
        IDbConnection Connection { get; }

        IDbTransaction Transaction { get; set; }

        IContextInformation ContextInformation { get; }
    }
}
