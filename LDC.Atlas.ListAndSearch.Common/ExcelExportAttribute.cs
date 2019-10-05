using System;

namespace LDC.Atlas.ListAndSearch.Common
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ExcelExportAttribute : Attribute
    {
        public bool IsExportable { get; set; } = true;

        public bool AdjustToContents { get; set; }

        public double? Width { get; set; }
    }
}
