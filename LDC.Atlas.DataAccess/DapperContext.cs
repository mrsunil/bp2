using LDC.Atlas.Application.Core;
using Microsoft.Extensions.Options;
using System;
using System.Data;
using System.Data.SqlClient;

namespace LDC.Atlas.DataAccess
{
    public class DapperContext : IDapperContext
    {
        private readonly IDatabaseConfiguration _databaseConfiguration;
        private IDbConnection _connection;
        private bool _disposed;

        public DapperContext(IOptions<DatabaseConfiguration> option, IContextInformation contextInformation)
        {
            _databaseConfiguration = option.Value;
            ContextInformation = contextInformation;
        }

        ~DapperContext()
        {
            Dispose(false);
        }

        public IDbConnection Connection
        {
            get
            {
                if (_connection == null)
                {
                    _connection = new SqlConnection(_databaseConfiguration.ConnectionString);
                }

                if (_connection.State != ConnectionState.Open)
                {
                    _connection.Open();
                }

                return _connection;
            }
        }

        public IDbTransaction Transaction { get; set; }

        public IContextInformation ContextInformation { get; }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    if (_connection != null)
                    {
                        _connection.Dispose();
                        _connection = null;
                    }

                    if (Transaction != null)
                    {
                        Transaction.Dispose();
                        Transaction = null;
                    }
                }

                _disposed = true;
            }
        }
    }
}
