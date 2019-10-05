using Dapper;
using LDC.Atlas.Application.Core.Exceptions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace LDC.Atlas.DataAccess.Dynamic
{
    public static class DynamicQueryBuilder
    {
        private static void CheckArg(object o, string name)
        {
            if (o == null)
            {
                throw new ArgumentNullException(name);
            }
        }

        public static BuildQueryResult BuildQuery(string company, string userId, DynamicQueryDefinition dynamicQueryDefinition, string viewName, List<ColumnConfiguration> columnConfigurations, DateTime companyDate, int? dataVersionId = null, List<long> userDepartments = null)
        {
            CheckArg(userId, nameof(userId));
            CheckArg(dynamicQueryDefinition, nameof(dynamicQueryDefinition));
            CheckArg(viewName, nameof(viewName));
            CheckArg(columnConfigurations, nameof(columnConfigurations));

            var result = new BuildQueryResult();

            var queryParameters = new DynamicParameters();

            var query = new StringBuilder();

            query.Append($"SELECT TotalCount = COUNT(*) OVER(), * FROM {viewName}");

            // Filters
            BuildFilters(query, queryParameters, dynamicQueryDefinition.Clauses, columnConfigurations, company, dataVersionId, companyDate, userDepartments);

            // Ordering
            query.Append(" ORDER BY");

            // Ordering from the request
            if (dynamicQueryDefinition.SortColumns.Any())
            {
                int index = 0;
                foreach (var filterColumn in dynamicQueryDefinition.SortColumns)
                {
                    var columnConfiguration = columnConfigurations.FirstOrDefault(c => c.FieldId == filterColumn.FieldId);

                    if (columnConfiguration == null)
                    {
                        throw new AtlasTechnicalException($"The column {filterColumn.FieldId} is not configured to be queryable.");
                    }

                    if (!columnConfiguration.IsSortable)
                    {
                        throw new AtlasTechnicalException($"The column {filterColumn.FieldId} is not configured to be sortable.");
                    }

                    index++;
                    var filterText = GetSqlSort(columnConfiguration.FieldName, filterColumn.SortOrder);
                    query.Append(index == 1 ? $" {filterText}" : $", {filterText}");
                }
            }
            else
            {
                // Ordering from the config
                var sortableColumns =
                    (from config in columnConfigurations
                     where config.IsSortable && config.SortOrderIndex > 0
                     orderby config.SortOrderIndex
                     select config).ToList();

                if (sortableColumns.Any())
                {
                    int index = 0;
                    foreach (var columns in sortableColumns)
                    {
                        index++;
                        var filterText = GetSqlSort(columns.FieldName, columns.SortOrder ?? "ASC");
                        query.Append(index == 1 ? $" {filterText}" : $", {filterText}");
                    }
                }
                else
                {
                    // Fallback ordering
                    var defaultSortColumn = columnConfigurations.Where(c => c.IsSortable).OrderBy(c => c.SortOrderIndex).FirstOrDefault() ?? columnConfigurations.FirstOrDefault();

                    query.Append(defaultSortColumn != null ? $" {defaultSortColumn.FieldName} ASC" : " 1");
                }
            }

            // Pagination
            query.Append(" OFFSET @OffsetRows ROWS FETCH NEXT @fetchRows ROWS ONLY;");
            queryParameters.Add("OffsetRows", dynamicQueryDefinition.Offset);
            queryParameters.Add("FetchRows", dynamicQueryDefinition.Limit);

            result.Sql = query.ToString();
            result.Parameters = queryParameters;

            return result;
        }

        public static List<Tuple<string, string>> BuildReportFilters(DynamicQueryDefinition dynamicQueryDefinition, List<ColumnConfiguration> columnConfigurations, DateTime companyDate)
        {
            CheckArg(dynamicQueryDefinition, nameof(dynamicQueryDefinition));
            CheckArg(columnConfigurations, nameof(columnConfigurations));

            List<Tuple<string, string>> filters = new List<Tuple<string, string>>();
            int index = 0;

            // For report filters we only use the first level of clauses and only with AND operator
            if (dynamicQueryDefinition.Clauses != null)
            {
                foreach (var clause in dynamicQueryDefinition.Clauses.Clauses)
                {
                    var columnConfiguration = columnConfigurations.FirstOrDefault(c => c.FieldId == clause.FieldId);

                    if (columnConfiguration == null)
                    {
                        throw new AtlasTechnicalException($"The column {clause.FieldId} is not configured to be queryable.");
                    }

                    if (!columnConfiguration.IsFilterable)
                    {
                        throw new AtlasTechnicalException($"The column {clause.FieldId} is not configured to be filterable.");
                    }

                    var queryParameters = new DynamicParameters();

                    index++;
                    var filterText = GetSqlFilter(clause, columnConfiguration, index, queryParameters, companyDate);

                    foreach (var parameterName in queryParameters.ParameterNames)
                    {
                        var formatedValue = GetFormatedValue(queryParameters.Get<object>(parameterName), columnConfiguration.FilterType);

                        filterText = filterText.Replace($"@{parameterName}", formatedValue);
                    }

                    filters.Add(new Tuple<string, string>(filterText, clause.GroupName));
                }
            }

            return filters;
        }

        public static string FormatClause(QueryClause clause, List<ColumnConfiguration> columnConfigurations)
        {
            var columnConfiguration = columnConfigurations.FirstOrDefault(c => c.FieldId == clause.FieldId);

            if (columnConfiguration == null)
            {
                throw new AtlasTechnicalException($"The column {clause.FieldId} is not configured.");
            }

            switch (clause.Operator)
            {
                case FilterColumnOperators.Equal:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} = {clause.Value1}";
                    }

                case FilterColumnOperators.Empty:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} IS EMPTY";
                    }

                case FilterColumnOperators.NotEmpty:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} IS NOT EMPTY";
                    }

                case FilterColumnOperators.NotEqual:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} != {clause.Value1}";
                    }

                case FilterColumnOperators.GreaterThan:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} > {clause.Value1}";
                    }

                case FilterColumnOperators.LessThan:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} < {clause.Value1}";
                    }

                case FilterColumnOperators.GreaterThanEquals:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} >= {clause.Value1}";
                    }

                case FilterColumnOperators.LessThanEquals:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} <= {clause.Value1}";
                    }

                case FilterColumnOperators.In:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} IN ({clause.Value1})";
                    }

                case FilterColumnOperators.Between:
                    {
                        return $"{columnConfiguration.FriendlyName ?? columnConfiguration.FieldName} BETWEEN {clause.Value1} AND {clause.Value2}";
                    }

                default: throw new AtlasTechnicalException($"Unknown operator: {clause.Operator}");
            }
        }

        private static void BuildFilters(StringBuilder query, DynamicParameters queryParameters, QueryClause clauses, List<ColumnConfiguration> columnConfigurations, string company, int? dataVersionId, DateTime companyDate, List<long> userDepartments = null)
        {
            bool hasWhere = false;

            if (!string.IsNullOrWhiteSpace(company))
            {
                query.Append(" WHERE [CompanyId] = @CompanyId");
                // https://github.com/StackExchange/Dapper#ansi-strings-and-varchar
                queryParameters.Add("@CompanyId", new DbString { Value = company, IsFixedLength = true, Length = 2, IsAnsi = true });

                hasWhere = true;
            }

            if (dataVersionId != null)
            {
                query.Append(hasWhere ? " AND" : " WHERE");

                query.Append(" [DataVersionId] = @DataVersionId");
                queryParameters.Add("@DataVersionId", dataVersionId);

                hasWhere = true;
            }

            if (userDepartments != null && userDepartments.Count > 0)
            {
                query.Append(hasWhere ? " AND" : " WHERE");

                query.Append(" DepartmentId IN @Departments");

                queryParameters.Add("@Departments", userDepartments);

                hasWhere = true;
            }

            if (clauses != null && ((clauses.Clauses != null && clauses.Clauses.Any()) || clauses.FieldId != null))
            {
                query.Append(hasWhere ? " AND" : " WHERE");

                int index = 0;
                var filterText = BuildFilterForClauses(clauses, queryParameters, ref index, columnConfigurations, companyDate);

                query.Append(" ");
                query.Append(filterText);
            }
        }

        private static string BuildFilterForClauses(QueryClause clauses, DynamicParameters queryParameters, ref int index, List<ColumnConfiguration> columnConfigurations, DateTime companyDate)
        {
            if (clauses.Clauses != null && clauses.Clauses.Any())
            {
                string sqlOperator;
                if (string.IsNullOrEmpty(clauses.LogicalOperator) || clauses.LogicalOperator == LogicalOperation.And)
                {
                    sqlOperator = "AND";
                }
                else if (clauses.LogicalOperator == LogicalOperation.Or)
                {
                    sqlOperator = "OR";
                }
                else
                {
                    throw new AtlasTechnicalException($"Invalid value for LogicalOperator: {clauses.LogicalOperator}");
                }

                var clausesQuery = new StringBuilder();

                if (clauses.LogicalOperator == LogicalOperation.Or)
                {
                    clausesQuery.Append("(");
                }

                int innerIndex = 0;
                foreach (var clause in clauses.Clauses)
                {
                    innerIndex++;
                    var filterText = BuildFilterForClauses(clause, queryParameters, ref index, columnConfigurations, companyDate);

                    clausesQuery.Append(innerIndex == 1 ? $"{filterText}" : $" {sqlOperator} {filterText}");
                }

                if (clauses.LogicalOperator == LogicalOperation.Or)
                {
                    clausesQuery.Append(")");
                }

                return clausesQuery.ToString();
            }
            else
            {
                var columnConfiguration = columnConfigurations.FirstOrDefault(c => c.FieldId == clauses.FieldId);

                if (columnConfiguration == null)
                {
                    throw new AtlasTechnicalException($"The column {clauses.FieldId} is not configured to be queryable.");
                }

                if (!columnConfiguration.IsFilterable)
                {
                    throw new AtlasTechnicalException($"The column {clauses.FieldId} is not configured to be filterable.");
                }

                index++;
                var filterText = GetSqlFilter(clauses, columnConfiguration, index, queryParameters, companyDate);

                return filterText;
            }
        }

        private static string GetSqlFilter(QueryClause clause, ColumnConfiguration columnConfiguration, int index, DynamicParameters queryParameters, DateTime companyDate)
        {
            string sql;
            string fieldType = columnConfiguration.FilterType;

            switch (clause.Operator)
            {
                case FilterColumnOperators.Equal:
                    {
                        if (string.IsNullOrWhiteSpace(clause.Value1))
                        {
                            throw new AtlasTechnicalException($"Value is missing for field {columnConfiguration.FieldId}.");
                        }

                        if (clause.Value1.Contains("%"))
                        {
                            sql = $"[{columnConfiguration.FieldName}] LIKE @{columnConfiguration.FieldName}{index}";
                        }
                        else
                        {
                            if (fieldType == FilterColumnTypes.Date)
                            {
                                sql = $"[{columnConfiguration.FieldName}] >= @{columnConfiguration.FieldName}{index} AND [{columnConfiguration.FieldName}] < DATEADD(day, 1, @{columnConfiguration.FieldName}{index})";
                            }
                            else
                            {
                                sql = $"[{columnConfiguration.FieldName}] = @{columnConfiguration.FieldName}{index}";
                            }
                        }

                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));

                        break;
                    }

                case FilterColumnOperators.Empty:
                    {
                        if (IsStringFieldType(fieldType))
                        {
                            sql = $"ISNULL([{columnConfiguration.FieldName}], '') = ''";
                        }
                        else
                        {
                            sql = $"[{columnConfiguration.FieldName}] IS NULL";
                        }

                        break;
                    }

                case FilterColumnOperators.NotEmpty:
                    {
                        if (IsStringFieldType(fieldType))
                        {
                            sql = $"ISNULL([{columnConfiguration.FieldName}], '') <> ''";
                        }
                        else
                        {
                            sql = $"[{columnConfiguration.FieldName}] IS NOT NULL";
                        }

                        break;
                    }

                case FilterColumnOperators.NotEqual:
                    {
                        if (fieldType == FilterColumnTypes.Date)
                        {
                            sql = $"([{columnConfiguration.FieldName}] < @{columnConfiguration.FieldName}{index} OR [{columnConfiguration.FieldName}] >= DATEADD(day, 1, @{columnConfiguration.FieldName}{index}))";
                        }
                        else
                        {
                            sql = $"[{columnConfiguration.FieldName}] <> @{columnConfiguration.FieldName}{index}";
                        }

                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));
                        break;
                    }

                case FilterColumnOperators.GreaterThan:
                    {
                        sql = $"[{columnConfiguration.FieldName}] > @{columnConfiguration.FieldName}{index}";
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));
                        break;
                    }

                case FilterColumnOperators.LessThan:
                    {
                        sql = $"[{columnConfiguration.FieldName}] < @{columnConfiguration.FieldName}{index}";
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));
                        break;
                    }

                case FilterColumnOperators.GreaterThanEquals:
                    {
                        sql = $"[{columnConfiguration.FieldName}] >= @{columnConfiguration.FieldName}{index}";
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));
                        break;
                    }

                case FilterColumnOperators.LessThanEquals:
                    {
                        sql = $"[{columnConfiguration.FieldName}] <= @{columnConfiguration.FieldName}{index}";
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));
                        break;
                    }

                case FilterColumnOperators.In:
                    {
                        if (string.IsNullOrWhiteSpace(clause.Value1))
                        {
                            throw new AtlasTechnicalException($"Value is missing for field {columnConfiguration.FieldId}.");
                        }

                        sql = $"[{columnConfiguration.FieldName}] IN @{columnConfiguration.FieldName}{index}";
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}", clause.Value1
                            .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => GetValue(s.Trim(), fieldType, columnConfiguration.FieldName, companyDate)));
                        break;
                    }

                case FilterColumnOperators.Between:
                    {
                        sql = $"[{columnConfiguration.FieldName}] BETWEEN @{columnConfiguration.FieldName}{index}_1 AND @{columnConfiguration.FieldName}{index}_2";
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}_1", GetValue(clause.Value1, fieldType, columnConfiguration.FieldName, companyDate));
                        queryParameters.Add($"{columnConfiguration.FieldName}{index}_2", GetValue(clause.Value2, fieldType, columnConfiguration.FieldName, companyDate));
                        break;
                    }

                default: throw new AtlasTechnicalException($"Unknown operator: {clause.Operator}");
            }

            return sql;
        }

        private static object GetValue(string filterColumnValue, string fieldType, string fieldName, DateTime companyDate)
        {
            switch (fieldType)
            {
                case FilterColumnTypes.Numeric:
                    {
                        if (decimal.TryParse(filterColumnValue, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
                        {
                            return result;
                        }

                        throw new AtlasTechnicalException($"Unknown numeric format for field {fieldName}");
                    }

                case FilterColumnTypes.Text:
                case FilterColumnTypes.Picklist:
                case FilterColumnTypes.OptionSet:
                    {
                        return filterColumnValue;
                    }

                case FilterColumnTypes.Date:
                    {
                        if (filterColumnValue == SpecialKeyWords.Today)
                        {
                            return companyDate.Date;
                        }
                        else if (filterColumnValue == SpecialKeyWords.Yesterday)
                        {
                            return companyDate.Date.AddDays(-1);
                        }
                        else if (DateTime.TryParseExact(filterColumnValue, "dd MMM yyyy", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var result))
                        {
                            return result.ToUniversalTime();
                        }

                        throw new AtlasTechnicalException($"Unknown date format for field {fieldName}");
                    }

                case FilterColumnTypes.Boolean:
                    {
                        if (!bool.TryParse(filterColumnValue, out var result))
                        {
                            throw new AtlasTechnicalException($"Unknown boolean format for field {fieldName}");
                        }

                        return result;
                    }

                case FilterColumnTypes.Period:
                    {
                        if (filterColumnValue == SpecialKeyWords.CurrentPeriod)
                        {
                            return DateTime.Today;
                        }
                        else if (filterColumnValue == SpecialKeyWords.CurrentMonth)
                        {
                            return DateTime.Today;
                        }
                        else
                        {
                            if (DateTime.TryParseExact(filterColumnValue, "MMM yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
                            {
                                return result;
                            }
                            else if (int.TryParse(filterColumnValue, out var result2))
                            {
                                return result2;
                            }

                            throw new AtlasTechnicalException($"Unknown period format for field {fieldName}");
                        }
                    }

                default: throw new AtlasTechnicalException($"Unknown type for field {fieldName}");
            }
        }

        private static string GetFormatedValue(object value, string fieldType)
        {
            switch (fieldType)
            {
                case FilterColumnTypes.Numeric:
                    {
                        return ((decimal)value).ToString(CultureInfo.InvariantCulture);
                    }

                case FilterColumnTypes.Text:
                case FilterColumnTypes.Picklist:
                case FilterColumnTypes.OptionSet:
                    {
                        if (value.GetType() == typeof(string))
                        {
                            return $"'{value.ToString().Replace("'", "''")}'";
                        }
                        else if (value is IEnumerable valueCollection)
                        {
                            StringBuilder builder = new StringBuilder();
                            builder.Append("(");

                            foreach (var parameterValue in valueCollection)
                            {
                                builder.Append($"'{parameterValue.ToString().Replace("'", "''")}',");
                            }

                            builder.Remove(builder.Length - 1, 1);
                            builder.Append(")");
                            return builder.ToString();
                        }
                        else
                        {
                            return $"'{value.ToString().Replace("'", "''")}'";
                        }
                    }

                case FilterColumnTypes.Date:
                    {
                        return $"'{((DateTime)value).ToString(CultureInfo.InvariantCulture)}'";
                    }

                case FilterColumnTypes.Boolean:
                    {
                        return ((bool)value) ? "1" : "0";
                    }

                case FilterColumnTypes.Period:
                    {
                        return $"'{((DateTime)value).ToString(CultureInfo.InvariantCulture)}'";
                    }

                default: throw new AtlasTechnicalException($"Unknown field type: {fieldType}");
            }
        }

        private static string GetSqlSort(string fieldName, string sortOrder)
        {
            switch (sortOrder)
            {
                case SortColumnOrder.Desc:
                    {
                        return $"[{fieldName}] DESC";
                    }

                case SortColumnOrder.Asc:
                    {
                        return $"[{fieldName}] ASC";
                    }

                default: throw new AtlasTechnicalException("Unknown sort order");
            }
        }

        private static bool IsStringFieldType(string fieldType)
        {
            return fieldType == FilterColumnTypes.Text
                   || fieldType == FilterColumnTypes.Picklist
                   || fieldType == FilterColumnTypes.OptionSet;
        }
    }

    public static class FilterColumnOperators
    {
        public const string Equal = "eq";
        public const string NotEqual = "ne";
        public const string GreaterThan = "gt";
        public const string LessThan = "lt";
        public const string GreaterThanEquals = "ge";
        public const string LessThanEquals = "le";
        public const string In = "in";
        public const string Between = "bt";
        public const string Empty = "empty";
        public const string NotEmpty = "notEmpty";
    }

    public static class SpecialKeyWords
    {
        public const string Yesterday = "yesterday";
        public const string Today = "today";
        public const string CurrentPeriod = "CURRENT_PERIOD";
        public const string CurrentMonth = "CURRENT_MONTH";
    }

    public static class FilterColumnTypes
    {
        public const string Numeric = "numeric";
        public const string Text = "text";
        public const string Date = "date";
        public const string Boolean = "boolean";
        public const string Period = "period";
        public const string Picklist = "picklist";
        public const string OptionSet = "optionset";
    }

    public static class SortColumnOrder
    {
        public const string Asc = "ASC";
        public const string Desc = "DESC";
    }

    public static class LogicalOperation
    {
        public const string And = "and";
        public const string Or = "or";
    }

    public class ColumnConfiguration
    {
        public int FieldId { get; set; }

        public string FieldName { get; set; }

        public string FriendlyName { get; set; }

        public string GridType { get; set; }

        public string FilterType { get; set; }

        public string OptionSet { get; set; }

        public bool IsFilterable { get; set; }

        public bool IsSortable { get; set; }

        public string SortOrder { get; set; }

        public int SortOrderIndex { get; set; }

        public bool IsGroup { get; set; }
    }
}
