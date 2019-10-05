using Microsoft.Extensions.Logging;
using System;

namespace LDC.Atlas.DataAccess
{
    public class DapperUnitOfWork : IDisposable, IUnitOfWork
    {
        private readonly ILogger _logger;
        private bool _disposed;

        public DapperUnitOfWork(IDapperContext dapperContext, ILogger<DapperUnitOfWork> logger)
        {
            Context = dapperContext;
            _logger = logger;
        }

        ~DapperUnitOfWork()
        {
            Dispose(false);
        }

        public IDapperContext Context { get; private set; }

        public void BeginTransaction()
        {
            if (Context.Transaction != null)
            {
                throw new InvalidOperationException("A transaction already exists");
            }

            Context.Transaction = Context.Connection.BeginTransaction();
        }

        public void Commit()
        {
            if (Context.Transaction == null)
            {
                throw new InvalidOperationException("Transaction is null");
            }

            try
            {
                Context.Transaction.Commit();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Commit Exception Type: {0}", ex.GetType());

                // Attempt to roll back the transaction.
                try
                {
                    Context.Transaction.Rollback();
                }
#pragma warning disable CA1031 // Do not catch general exception types
                catch (Exception ex2)
                {
                    // This catch block will handle any errors that may have occurred
                    // on the server that would cause the rollback to fail, such as
                    // a closed connection.
                    // https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqltransaction?redirectedfrom=MSDN&view=netcore-2.2#examples
                    _logger.LogError(ex2, "Rollback Exception Type: {0}", ex2.GetType());

                    throw;
                }
#pragma warning restore CA1031 // Do not catch general exception types

                throw;
            }
            finally
            {
                Context.Transaction.Dispose();
                Context.Transaction = null;
            }
        }

        public void Rollback()
        {
            if (Context.Transaction == null)
            {
                throw new InvalidOperationException("Transaction is null");
            }

            try
            {
                Context.Transaction.Rollback();
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception ex2)
            {
                // This catch block will handle any errors that may have occurred
                // on the server that would cause the rollback to fail, such as
                // a closed connection.
                _logger.LogError(ex2, "Rollback Exception Type: {0}", ex2.GetType());
                _logger.LogError("Message: {0}", ex2.Message);
#pragma warning restore CA1031 // Do not catch general exception types

                throw;
            }
            finally
            {
                Context.Transaction.Dispose();
                Context.Transaction = null;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing && Context != null)
                {
                    Context.Dispose();
                    Context = null;
                }

                _disposed = true;
            }
        }
    }
}
