using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class LanguagePreferenceRepository : BaseRepository, ILanguagePreferenceRepository
    {

        public LanguagePreferenceRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Language),
                       new ColumnAttributeTypeMapper<Language>());
        }

        public async Task<IEnumerable<Language>> GetAllAsync()
        {
            var language = await ExecuteQueryAsync<Language>(StoredProcedureNames.ListFouriteLanguage);
            return language;
        }

        internal static class StoredProcedureNames
        {
            internal const string ListFouriteLanguage = "[MasterData].[usp_ListFavouriteLanguages]";
        }
    }
}
