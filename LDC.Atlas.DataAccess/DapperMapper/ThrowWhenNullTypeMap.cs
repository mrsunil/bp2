using Dapper;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace LDC.Atlas.DataAccess.DapperMapper
{
    // https://github.com/LarrySmith-1437/SafeDapper/tree/master/SafeDapper
    public class ThrowWhenNullTypeMap<T> : SqlMapper.ITypeMap
    {
        private readonly ColumnAttributeTypeMapper<T> _defaultTypeMap = new ColumnAttributeTypeMapper<T>();

        public ConstructorInfo FindConstructor(string[] names, Type[] types)
        {
            return _defaultTypeMap.FindConstructor(names, types);
        }

        public ConstructorInfo FindExplicitConstructor()
        {
            return _defaultTypeMap.FindExplicitConstructor();
        }

        public SqlMapper.IMemberMap GetConstructorParameter(ConstructorInfo constructor, string columnName)
        {
            return _defaultTypeMap.GetConstructorParameter(constructor, columnName);
        }

        public SqlMapper.IMemberMap GetMember(string columnName)
        {
            List<SqlMapper.ITypeMap> fallbackMappers = new List<SqlMapper.ITypeMap>();
            fallbackMappers.Add(_defaultTypeMap);

            FallbackTypeMapper fallbackMapper = new FallbackTypeMapper(fallbackMappers);

            var member = fallbackMapper.GetMember(columnName);
            if (member == null)
            {
                throw new DapperObjectMappingException($"Column {columnName} could not be mapped to object of type {typeof(T).Name}.");
            }

            return member;
        }
    }
}
