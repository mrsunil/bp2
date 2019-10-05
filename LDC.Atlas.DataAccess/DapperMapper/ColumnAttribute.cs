using System;

namespace LDC.Atlas.DataAccess.DapperMapper
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = true)]
    public class ColumnAttribute : Attribute
    {
        public string Name { get; set; }
    }
}
