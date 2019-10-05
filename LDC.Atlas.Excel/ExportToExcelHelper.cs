using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
//using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IO;
using System.Linq;

namespace LDC.Atlas.Excel
{
    public static class ExportToExcelHelper
    {
        public const string XlsxMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        public static MemoryStream Export(DataTable dataTable, ExcelFileProperties excelFileProperties = null, List<string> formatedClauses = null)
        {
            var wb = new XLWorkbook(XLEventTracking.Disabled);

            if (excelFileProperties != null)
            {
                wb.Properties.Author = excelFileProperties.Author;
                wb.Properties.Title = excelFileProperties.Title;
                wb.Properties.Subject = excelFileProperties.Subject;
                wb.Properties.Category = excelFileProperties.Category;
                wb.Properties.Keywords = excelFileProperties.Keywords;
                wb.Properties.Comments = excelFileProperties.Comments;
                wb.Properties.Status = excelFileProperties.Status;
                wb.Properties.LastModifiedBy = excelFileProperties.LastModifiedBy;
                wb.Properties.Company = excelFileProperties.Company;
                wb.Properties.Manager = excelFileProperties.Manager;
            }

            wb.CustomProperties.Add("Created with", "LDC Atlas");

            wb.Style.Font.FontSize = 10;
            wb.Style.Font.FontName = "Calibri";

            // Add a DataTable as a worksheet
            //var ws = wb.Worksheets.Add(dataTable, dataTable.TableName);
            var ws = wb.Worksheets.Add(dataTable.TableName);

            ws.FirstCell().InsertTable(dataTable);

            for (int i = 0; i < dataTable.Columns.Count; i++)
            {
                if (dataTable.Columns[i].ExtendedProperties.ContainsKey("AdjustToContents"))
                {
                    var adjustToContents = (bool)dataTable.Columns[i].ExtendedProperties["AdjustToContents"];

                    if (adjustToContents)
                    {
                        ws.Columns(i + 1, i + 1).AdjustToContents(1, 99);
                    }
                }

                if (dataTable.Columns[i].ExtendedProperties.ContainsKey("Width"))
                {
                    var width = (double)dataTable.Columns[i].ExtendedProperties["Width"];

                    if (width > 0)
                    {
                        ws.Columns(i + 1, i + 1).Width = width;
                    }
                }
            }

            if (formatedClauses != null)
            {
                var ws2 = wb.Worksheets.Add("Criterias").SetTabColor(XLColor.FromHtml("#009cb9"));
                ws2.Cell(1, 1).Value = "Criterias";
                ws2.Cell(1, 1).AsRange().AddToNamed("Titles");
                var rangeWithStrings = ws2.Cell(2, 1).InsertData(formatedClauses);

                var titlesStyle = wb.Style;
                titlesStyle.Font.Bold = true;
                titlesStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                titlesStyle.Fill.BackgroundColor = XLColor.FromHtml("#009cb9");
                titlesStyle.Font.FontColor = XLColor.White;
                wb.NamedRanges.NamedRange("Titles").Ranges.Style = titlesStyle;

                // ws2.Columns().AdjustToContents();
            }

            var memoryStream = new MemoryStream();

            wb.SaveAs(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);

            return memoryStream;
        }

        /// <summary>
        /// Converts a List&lt;T&gt; to a DataTable.
        /// </summary>
        /// <typeparam name="T">The type of the list collection.</typeparam>
        /// <param name="list">List instance reference.</param>
        /// <param name="settings">Settings for creating the DataTable</param>
        /// <returns>A DataTable of the converted list collection.</returns>
        public static DataTable ToDataTable<T>(this IList<T> list, DataTableSettings settings = null)
        {
            var entityType = list.FirstOrDefault()?.GetType() ?? typeof(T);

            // Lists of type System.String and System.Enum (which includes enumerations and structs) must be handled differently
            // than primitives and custom objects (e.g. an object that is not type System.Object).
            if (entityType == typeof(string))
            {
                var dataTable = new DataTable(entityType.Name);
                dataTable.Columns.Add(entityType.Name, entityType);

                // Iterate through each item in the list. There is only one cell, so use index 0 to set the value.
                foreach (T item in list)
                {
                    var row = dataTable.NewRow();
                    row[0] = item;
                    dataTable.Rows.Add(row);
                }

                return dataTable;
            }

            if (entityType.BaseType == typeof(Enum))
            {
                var dataTable = new DataTable(entityType.Name);
                dataTable.Columns.Add(entityType.Name, typeof(string));

                // Iterate through each item in the list. There is only one cell, so use index 0 to set the value.
                foreach (string namedConstant in Enum.GetNames(entityType))
                {
                    var row = dataTable.NewRow();
                    row[0] = namedConstant;
                    dataTable.Rows.Add(row);
                }

                return dataTable;
            }

            // Check if the type of the list is a primitive type or not. Note that if the type of the list is a custom
            // object (e.g. an object that is not type System.Object), the underlying type will be null.
            var underlyingType = Nullable.GetUnderlyingType(entityType) ?? entityType;
            var primitiveTypes = new List<Type>
            {
                typeof(byte),
                typeof(char),
                typeof(decimal),
                typeof(double),
                typeof(short),
                typeof(int),
                typeof(long),
                typeof(sbyte),
                typeof(float),
                typeof(ushort),
                typeof(uint),
                typeof(ulong),
            };

            var typeIsPrimitive = primitiveTypes.Contains(underlyingType);

            // If the type of the list is a primitive, perform a simple conversion.
            // Otherwise, map the object's properties to columns and fill the cells with the properties' values.
            if (typeIsPrimitive)
            {
                var dataTable = new DataTable(underlyingType.Name);
                dataTable.Columns.Add(underlyingType.Name, underlyingType);

                // Iterate through each item in the list. There is only one cell, so use index 0 to set the value.
                foreach (T item in list)
                {
                    var row = dataTable.NewRow();
                    row[0] = item;
                    dataTable.Rows.Add(row);
                }

                return dataTable;
            }
            else
            {
                // TODO:
                // 1. Convert lists of type System.Object to a data table.
                // 2. Handle objects with nested objects (make the column name the name of the object and print "system.object" as the value).

                var dataTable = new DataTable(settings?.DataTableName ?? entityType.Name);
                var propertyDescriptorCollection = TypeDescriptor.GetProperties(entityType);

                List<DataTableColumnSetting> columnsToCreate = new List<DataTableColumnSetting>();

                // Iterate through each property in the object and add that property name as a new column in the data table.
                foreach (PropertyDescriptor propertyDescriptor in propertyDescriptorCollection)
                {
                    bool isExportable = settings == null;
                    bool adjustToContents = false;
                    double? width = null;
                    string displayName = propertyDescriptor.Name;

                    var columnSetting = settings?.Columns.FirstOrDefault(c => c.PropertyName == propertyDescriptor.Name);

                    if (columnSetting != null)
                    {
                        isExportable = columnSetting.IsExportable;
                        adjustToContents = columnSetting.AdjustToContents;
                        width = columnSetting.Width;
                        displayName = columnSetting.DisplayName ?? columnSetting.PropertyName;
                    }

                    foreach (var attribute in propertyDescriptor.Attributes)
                    {
                        if (attribute is ExcelExportAttribute excelExportAttribute)
                        {
                            isExportable = excelExportAttribute.IsExportable;

                            adjustToContents = excelExportAttribute.AdjustToContents;

                            width = excelExportAttribute.Width;
                        }

                        //if (attribute is DisplayAttribute displayAttribute)
                        //{
                        //    displayName = displayAttribute.GetName();
                        //}
                        else if (attribute is DisplayNameAttribute displayNameAttribute)
                        {
                            displayName = displayNameAttribute.DisplayName;
                        }
                    }

                    if (isExportable)
                    {
                        // Data tables cannot have nullable columns. The cells can have null values, but the actual columns themselves cannot be nullable.
                        // Therefore, if the current property type is nullable, use the underlying type (e.g. if the type is a nullable int, use int).
                        var propertyType = Nullable.GetUnderlyingType(propertyDescriptor.PropertyType) ?? propertyDescriptor.PropertyType;

                        columnsToCreate.Add(new DataTableColumnSetting
                        {
                            DisplayName = displayName,
                            AdjustToContents = adjustToContents,
                            Width = width,
                            PropertyName = propertyDescriptor.Name,
                            PropertyType = propertyType,
                            Order = columnSetting?.Order ?? 0
                        });
                    }
                }

                foreach (var columnToCreate in columnsToCreate.Where(c => c.Order > 0).OrderBy(c => c.Order).Concat(columnsToCreate.Where(c => c.Order == 0)))
                {
                    var column = dataTable.Columns.Add(columnToCreate.DisplayName, columnToCreate.PropertyType);

                    if (columnToCreate.AdjustToContents)
                    {
                        column.ExtendedProperties.Add("AdjustToContents", columnToCreate.AdjustToContents);
                    }

                    if (columnToCreate.Width != null)
                    {
                        column.ExtendedProperties.Add("Width", columnToCreate.Width.Value);
                    }
                }

                // Iterate through each object in the list and add a new row in the data table.
                // Then iterate through each property in the object and add the property's value to the current cell.
                // Once all properties in the current object have been used, add the row to the data table.
                foreach (T item in list)
                {
                    var row = dataTable.NewRow();

                    foreach (PropertyDescriptor propertyDescriptor in propertyDescriptorCollection)
                    {
                        var columnToCreate = columnsToCreate.FirstOrDefault(c => c.PropertyName == propertyDescriptor.Name);

                        if (columnToCreate != null)
                        {
                            var value = propertyDescriptor.GetValue(item);
                            row[columnToCreate.DisplayName] = value ?? DBNull.Value;
                        }
                    }

                    dataTable.Rows.Add(row);
                }

                return dataTable;
            }
        }
    }

    public class DataTableSettings
    {
        public string DataTableName { get; set; }

        public Collection<DataTableColumnSetting> Columns { get; } = new Collection<DataTableColumnSetting>();
    }

    public class DataTableColumnSetting
    {
        public bool IsExportable { get; set; }

        public bool AdjustToContents { get; set; }

        public double? Width { get; set; }

        public string DisplayName { get; set; }

        public string PropertyName { get; set; }

        public int Order { get; set; }

        internal Type PropertyType { get; set; }
    }

    public class ExcelFileProperties
    {
        public string Author { get; set; }

        public string Title { get; set; }

        public string Subject { get; set; }

        public string Category { get; set; }

        public string Keywords { get; set; }

        public string Comments { get; set; }

        public string Status { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public string LastModifiedBy { get; set; }

        public string Company { get; set; }

        public string Manager { get; set; }
    }
}
