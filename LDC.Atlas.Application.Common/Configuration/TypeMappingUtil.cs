using LDC.Atlas.Application.Core.Exceptions;
using System;

namespace LDC.Atlas.Application.Common.Configuration
{
    public static class TypeMappingUtil
    {
        public static string ToGridColumnType(string sqlType)
        {
            switch (sqlType)
            {
                case "text":
                case "ntext":
                case "char":
                case "nchar":
                case "varchar":
                case "nvarchar":
                    return "text";
                case "date":
                case "time":
                case "datetime":
                case "datetime2":
                case "datetimeoffset":
                case "smalldatetime":
                    return "date";
                case "tinyint":
                case "smallint":
                case "int":
                case "real":
                case "money":
                case "float":
                case "decimal":
                case "numeric":
                case "smallmoney":
                case "bigint":
                    return "numeric";
                case "bit":
                    return "boolean";
                default:
                    throw new AtlasTechnicalException("SQL type is not recognized.");
            }
        }
    }
}
