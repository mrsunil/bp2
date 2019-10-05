using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.DataAccess;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class FunctionalObjectService : BaseRepository, IFunctionalObjectService
    {
        public FunctionalObjectService(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<FunctionalObjectDto>> GetAllFunctionalObjectsAsync(string name)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FunctionalObjectName", name);

            IEnumerable<FunctionalObjectDto> functionalObjects;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAllFunctionalObjects, queryParameters))
            {
                functionalObjects = grid.Read<FunctionalObjectDto>().ToList();

                if (functionalObjects != null)
                {
                    var applicationTables = grid.Read<FunctionalObjectTableDto>().ToList();
                    foreach (var functionalObject in functionalObjects)
                    {
                        functionalObject.Tables = applicationTables
                            .Where(applicationTable => applicationTable.FunctionalObjectId == functionalObject.FunctionalObjectId)
                            .GroupBy(table => table.TableId)
                            .Select(group => group.First());
                    }
                }
            }

            return functionalObjects;
        }

        public async Task<FunctionalObjectDto> GetFunctionalObjectByIdAsync(int id)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FunctionalObjectId", id);

            FunctionalObjectDto functionalObject;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetFunctionalObjectByName, queryParameters))
            {
                functionalObject = grid.Read<FunctionalObjectDto>().FirstOrDefault();
                if (functionalObject != null)
                {
                    functionalObject.Tables = grid.Read<FunctionalObjectTableDto>().GroupBy(table => table.TableId).Select(group => group.First()).ToList();
                    var applicationFields = grid.Read<FunctionalObjectFieldDto>().ToList();

                    foreach (var table in functionalObject.Tables)
                    {
                        var fields = applicationFields.Where((field) => field.TableId == table.TableId);
                        foreach (var field in fields)
                        {
                            field.Type = TypeMappingUtil.ToGridColumnType(field.Type);
                        }

                        table.Fields = fields;
                    }
                }
            }

            return functionalObject;
        }

        public async Task<bool> IsFunctionalObjectExistsAsync(string name, int id)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FunctionalObjectId", id);
            queryParameters.Add("@FunctionalObjectName", name);
            queryParameters.Add("@Exists", dbType: System.Data.DbType.Int32, direction: System.Data.ParameterDirection.ReturnValue);

            await ExecuteNonQueryAsync(StoredProcedureNames.CheckIfFunctionalObjectExists, queryParameters);
            var exists = queryParameters.Get<int>("@Exists");
            return exists != 0;
        }

        private static class StoredProcedureNames
        {
            internal const string GetAllFunctionalObjects = "[Audit].[usp_GetListFunctionalObjects]";
            internal const string GetFunctionalObjectByName = "[Audit].[usp_GetListFunctionalObjectsById]";
            internal const string CheckIfFunctionalObjectExists = "[Audit].[usp_FunctionalObjectExists]";
        }
    }
}
