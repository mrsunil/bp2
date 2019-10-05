using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class ApplicationTableService : BaseRepository, IApplicationTableService
    {
        public ApplicationTableService(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<ApplicationTableDto>> GetApplicationTablesAsync(string tableName)
        {
            var tables = await ExecuteQueryAsync<ApplicationTableDto>(StoredProcedureNames.GetApplicationTables);
            IEnumerable<ApplicationTableDto> filteredTables = tables.Where(t =>
            !(t.TableName.ToUpperInvariant().StartsWith("VW_", StringComparison.InvariantCulture)
            || t.TableName.ToUpperInvariant().StartsWith("V_", StringComparison.InvariantCulture))
            && !t.TableSchema.Equals("Audit", StringComparison.InvariantCulture)
            && !t.TableSchema.Equals("Process", StringComparison.InvariantCulture)
            && !t.TableName.Equals("Lock", StringComparison.InvariantCulture)
            && !t.TableName.Equals("Report", StringComparison.InvariantCulture))
            .OrderBy(t => t.TableName);

            if (!string.IsNullOrEmpty(tableName))
            {
                filteredTables = filteredTables.Where(t => t.TableName.Equals(tableName, StringComparison.InvariantCulture));
            }

            return filteredTables;
        }

        public async Task<ApplicationTableDto> GetApplicationTableByIdAsync(int tableId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TableId", tableId);

            ApplicationTableDto applicationTable;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetApplicationTableById, queryParameters))
            {
                applicationTable = grid.Read<ApplicationTableDto>().FirstOrDefault();

                if (applicationTable != null)
                {
                    applicationTable.Fields = grid.Read<ApplicationFieldDto>().OrderBy(f => f.FieldName).ToList();

                    // Ensure FriendlyName
                    if (applicationTable.Fields.Any())
                    {
                        applicationTable.Fields.ToList().ForEach(i =>
                        {
                            if (string.IsNullOrEmpty(i.FriendlyName))
                            {
                                i.FriendlyName = i.FieldName;
                            }
                        });
                    }
                }
            }

            return applicationTable;
        }

        private static class StoredProcedureNames
        {
            internal const string GetApplicationTables = "[Audit].[usp_GetListTables]";
            internal const string GetApplicationTableById = "[Audit].[usp_GetFieldsByTable]";
        }
    }
}
