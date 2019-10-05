using Dapper;
using System;
using System.Data;

namespace LDC.Atlas.DataAccess.DapperMapper
{
    // https://stackoverflow.com/a/39730278
    public class DateTimeHandler : SqlMapper.TypeHandler<DateTime>
    {
        public override void SetValue(IDbDataParameter parameter, DateTime value)
        {
            if (value.Kind == DateTimeKind.Local)
            {
                parameter.Value = value.ToUniversalTime();
            }
            else if (value.Kind == DateTimeKind.Unspecified)
            {
                parameter.Value = DateTime.SpecifyKind(value, DateTimeKind.Utc);
            }
            else
            {
                parameter.Value = value;
            }
        }

        public override DateTime Parse(object value)
        {
            return DateTime.SpecifyKind((DateTime)value, DateTimeKind.Utc);
        }
    }
}
