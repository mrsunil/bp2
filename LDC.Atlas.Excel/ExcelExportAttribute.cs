using System;

namespace LDC.Atlas.Excel
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ExcelExportAttribute : Attribute
    {
        public bool IsExportable { get; set; } = true;

        public bool AdjustToContents { get; set; }

        public double? Width { get; set; }
    }
}
