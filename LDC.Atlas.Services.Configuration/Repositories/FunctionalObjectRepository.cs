using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class FunctionalObjectRepository : BaseRepository, IFunctionalObjectRepository
    {
        public FunctionalObjectRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<int> CreateFunctionalObject(FunctionalObject functionalObject)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FunctionalObjectName", functionalObject.Name);
            queryParameters.Add("@ListObjects", ToArrayTVP(functionalObject.Tables));
            queryParameters.Add("@FunctionalObjectId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateFunctionalObject, queryParameters, true);

            int functionalObjectId = queryParameters.Get<int>("@FunctionalObjectId");
            return functionalObjectId;
        }

        public async Task<int> UpdateFunctionalObject(FunctionalObject functionalObject)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FunctionalObjectId", functionalObject.Id);
            queryParameters.Add("@FunctionalObjectName", functionalObject.Name);
            queryParameters.Add("@ListObjects", ToArrayTVP(functionalObject.Tables));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateFunctionalObject, queryParameters, true);

            return functionalObject.Id;
        }

        private static DataTable ToArrayTVP(IEnumerable<ApplicationTable> applicationTables)
        {
            var dataTable = new DataTable();
            dataTable.SetTypeName("[Audit].[UDTT_PredefinedObjects]");

            var fieldId = new DataColumn("FieldId", typeof(int));
            dataTable.Columns.Add(fieldId);

            if (applicationTables != null)
            {
                foreach (var table in applicationTables)
                {
                    if (table.Fields != null)
                    {
                        foreach (var field in table.Fields)
                        {
                            var row = dataTable.NewRow();
                            row[fieldId] = field.FieldId;
                            dataTable.Rows.Add(row);
                        }
                    }
                }
            }

            return dataTable;
        }

        public async Task<bool> IsFunctionalObjectExistsAsync(string name, int? id = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FunctionalObjectId", id);
            queryParameters.Add("@FunctionalObjectName", name);

            var exists = await ExecuteQueryFirstOrDefaultAsync<int>(StoredProcedureNames.CheckIfFunctionalObjectExists, queryParameters);
            return exists != 0;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateFunctionalObject = "[Audit].[usp_CreateFunctionalObject]";
            internal const string UpdateFunctionalObject = "[Audit].[usp_UpdateFunctionalObject]";
            internal const string CheckIfFunctionalObjectExists = "[Audit].[usp_FunctionalObjectExists]";
        }
    }
}
