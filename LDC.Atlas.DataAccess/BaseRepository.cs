using Dapper;
using LDC.Atlas.Application.Core;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess.DapperMapper;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.DataAccess
{
    public class BaseRepository
    {
        protected const string ContextInformationParameter = "@ContextInformation";
        protected const string DataVersionIdParameter = "@DataVersionId";
        private const string ContextInformationParameterName = "ContextInformation";
        private const string DataVersionIdParameterName = "DataVersionId";

        public BaseRepository(IDapperContext dapperContext)
        {
            DapperContext = dapperContext;
            SqlMapper.AddTypeHandler(new DateTimeHandler());
            SqlMapper.Settings.CommandTimeout = 300;
        }

        protected IDapperContext DapperContext { get; }

        public ILogger<BaseRepository> Logger { get; set; } // public get/set for Property Injection

        /// <summary>
        /// Executes the query asynchronous.
        /// </summary>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <exception cref="System.ArgumentNullException">storedProcedureName</exception>
        protected async Task<IEnumerable<TResult>> ExecuteQueryAsync<TResult>(string storedProcedureName, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (addContext)
            {
                var parameter = new DynamicParameters();
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);

                return await ExecuteQueryAsync<TResult>(storedProcedureName, parameter, false);
            }
            else
            {
                return await SqlMapper.QueryAsync<TResult>(DapperContext.Connection, storedProcedureName, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
            }
        }

        /// <summary>
        /// Executes the query asynchronous.
        /// </summary>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <exception cref="System.ArgumentNullException">
        /// storedProcedureName
        /// or
        /// parameter
        /// </exception>
        protected async Task<IEnumerable<TResult>> ExecuteQueryAsync<TResult>(string storedProcedureName, DynamicParameters parameter, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (addContext)
            {
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);
            }

            AddDataVersionIdParameter(DapperContext.ContextInformation, parameter);

            LogParameters(storedProcedureName, parameter);

            return await SqlMapper.QueryAsync<TResult>(DapperContext.Connection, storedProcedureName, parameter, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
        }

        /// <summary>
        /// Executes the dynamic query asynchronous.
        /// </summary>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="sql">The SQL to execute.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <exception cref="System.ArgumentNullException">
        /// sql
        /// or
        /// parameter
        /// </exception>
        protected async Task<IEnumerable<TResult>> ExecuteDynamicQueryAsync<TResult>(string sql, DynamicParameters parameter, bool addContext = false)
        {
            if (string.IsNullOrEmpty(sql))
            {
                throw new ArgumentNullException(nameof(sql));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (addContext)
            {
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);
            }

            AddDataVersionIdParameter(DapperContext.ContextInformation, parameter);

            LogParameters("DynamicQuery", parameter);

            return await SqlMapper.QueryAsync<TResult>(DapperContext.Connection, sql, parameter, commandType: CommandType.Text, transaction: DapperContext.Transaction);
        }

        /// <summary>
        /// Executes the query with multiple resultsets asynchronous.
        /// </summary>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <exception cref="System.ArgumentNullException">
        /// storedProcedureName
        /// or
        /// parameter
        /// </exception>
        protected async Task<SqlMapper.GridReader> ExecuteQueryMultipleAsync(string storedProcedureName, DynamicParameters parameter, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (addContext)
            {
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);
            }

            AddDataVersionIdParameter(DapperContext.ContextInformation, parameter);

            LogParameters(storedProcedureName, parameter);

            return await SqlMapper.QueryMultipleAsync(DapperContext.Connection, storedProcedureName, parameter, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
        }

        /// <summary>
        /// Executes the query asynchronous and is expected to return only the first element.
        /// </summary>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <exception cref="System.ArgumentNullException">storedProcedureName</exception>
        protected async Task<TResult> ExecuteQueryFirstOrDefaultAsync<TResult>(string storedProcedureName, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (addContext)
            {
                var parameter = new DynamicParameters();
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);

                return await ExecuteQueryFirstOrDefaultAsync<TResult>(storedProcedureName, parameter, false);
            }

            return await SqlMapper.QueryFirstOrDefaultAsync<TResult>(DapperContext.Connection, storedProcedureName, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
        }

        /// <summary>
        /// Executes the query asynchronous and is expected to return only the first element.
        /// </summary>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <exception cref="System.ArgumentNullException">
        /// storedProcedureName
        /// or
        /// parameter
        /// </exception>
        protected async Task<TResult> ExecuteQueryFirstOrDefaultAsync<TResult>(string storedProcedureName, DynamicParameters parameter, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (addContext)
            {
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);
            }

            AddDataVersionIdParameter(DapperContext.ContextInformation, parameter);

            LogParameters(storedProcedureName, parameter);

            return await SqlMapper.QueryFirstOrDefaultAsync<TResult>(DapperContext.Connection, storedProcedureName, parameter, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
        }

        /// <summary>
        /// Executes the query asynchronous for non result execution.
        /// </summary>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// /// <param name="parameter">The parameter.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <returns>The number of rows affected.</returns>
        /// <exception cref="System.ArgumentNullException">
        /// storedProcedureName
        /// or
        /// parameter
        /// </exception>
        protected async Task<int> ExecuteNonQueryAsync(string storedProcedureName, DynamicParameters parameter, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (addContext)
            {
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);
            }

            AddDataVersionIdParameter(DapperContext.ContextInformation, parameter);

            LogParameters(storedProcedureName, parameter);

            return await SqlMapper.ExecuteAsync(DapperContext.Connection, storedProcedureName, parameter, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
        }

        /// <summary>
        /// Execute parameterized SQL that selects a single value.
        /// </summary>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="storedProcedureName">Name of the stored procedure.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="addContext">Whether to add the information context to the parameters.</param>
        /// <returns>The first cell returned, as TResult.</returns>
        /// <exception cref="System.ArgumentNullException">
        /// storedProcedureName
        /// or
        /// parameter
        /// </exception>
        protected async Task<TResult> ExecuteScalarAsync<TResult>(string storedProcedureName, DynamicParameters parameter, bool addContext = false)
        {
            if (string.IsNullOrEmpty(storedProcedureName))
            {
                throw new ArgumentNullException(nameof(storedProcedureName));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (addContext)
            {
                AddContextInformationParameter(DapperContext.ContextInformation, parameter);
            }

            AddDataVersionIdParameter(DapperContext.ContextInformation, parameter);

            LogParameters(storedProcedureName, parameter);

            return await SqlMapper.ExecuteScalarAsync<TResult>(DapperContext.Connection, storedProcedureName, parameter, commandType: CommandType.StoredProcedure, transaction: DapperContext.Transaction);
        }

        private static void AddContextInformationParameter(IContextInformation contextInformation, DynamicParameters parameter)
        {
            if (!parameter.ParameterNames.AsList().Contains(ContextInformationParameterName))
            {
                var json = JsonConvert.SerializeObject(contextInformation, Formatting.Indented, new JsonSerializerSettings
                {
                    ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                });

                parameter.Add(ContextInformationParameter, json);
            }
        }

        private static void AddDataVersionIdParameter(IContextInformation contextInformation, DynamicParameters parameters)
        {
            var dataVersionIdParameter = parameters.ParameterNames.AsList().Find(p => p.Equals(DataVersionIdParameterName, StringComparison.InvariantCultureIgnoreCase));

            if (dataVersionIdParameter != null && parameters.Get<object>(dataVersionIdParameter) == null && (contextInformation != null && contextInformation.DataVersionId.HasValue))
            {
                parameters.Add(DataVersionIdParameter, contextInformation.DataVersionId);
            }
        }

        private void LogParameters(string storedProcedureName, DynamicParameters parameters)
        {
            try
            {
                Dictionary<string, object> paramsDictionary = new Dictionary<string, object>();

                foreach (var parameterName in parameters.ParameterNames)
                {
                    var param = parameters.Get<object>(parameterName);
                    if (param == null || param.GetType() != typeof(DataTable))
                    {
                        paramsDictionary.Add(parameterName, param);
                    }
                    else if (param?.GetType() == typeof(DataTable))
                    {
                        var dataTable = (DataTable)param;

                        if (dataTable.Rows.Count * dataTable.Columns.Count <= 100)
                        {
                            var json = JsonConvert.SerializeObject(dataTable, Formatting.Indented, new JsonSerializerSettings
                            {
                                ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                            });

                            paramsDictionary.Add(parameterName, json);
                        }
                        else
                        {
                            paramsDictionary.Add(parameterName, new { Count = dataTable.Rows.Count });
                        }
                    }
                }

                if (Logger == null)
                {
                    throw new AtlasTechnicalException("Logger not injected. Check Autofac configuration.");
                }

                Logger.LogInformation("Calling {Atlas_StoredProcedureName} with parameters {@Atlas_DynamicParameters}", storedProcedureName, paramsDictionary);
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch
            {
                // No action needed when log is failing.
            }
#pragma warning restore CA1031 // Do not catch general exception types
        }

        protected static DataTable ConvertToBigIntListUDTT(IEnumerable<long> identifiers)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_BigIntList]");

            DataColumn idColumn = new DataColumn("Id", typeof(long));
            udtt.Columns.Add(idColumn);

            foreach (var id in identifiers)
            {
                var row = udtt.NewRow();
                row[idColumn] = id;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        protected static DataTable ConvertToIntListUDTT(IEnumerable<int> identifiers)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_IntList]");

            DataColumn idColumn = new DataColumn("Id", typeof(long));
            udtt.Columns.Add(idColumn);

            foreach (var id in identifiers)
            {
                var row = udtt.NewRow();
                row[idColumn] = id;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        protected DataTable ConvertToVarcharListUDTT(IEnumerable<string> identifiers)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_VarcharList]");

            DataColumn idColumn = new DataColumn("Name", typeof(string));
            udtt.Columns.Add(idColumn);

            foreach (var id in identifiers)
            {
                var row = udtt.NewRow();
                row[idColumn] = id;
                udtt.Rows.Add(row);
            }

            return udtt;
        }
    }
}
