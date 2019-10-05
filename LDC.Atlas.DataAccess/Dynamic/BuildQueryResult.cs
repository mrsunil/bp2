using Dapper;

namespace LDC.Atlas.DataAccess.Dynamic
{
    public class BuildQueryResult
    {
        public string Sql { get; set; }

        public DynamicParameters Parameters { get; set; }
    }
}