using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Interface.Application.Queries.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Interface.Application.Queries
{
    public class InterfaceQueries : BaseRepository, IInterfaceQueries
    {
        public InterfaceQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {

        }

        public async Task<bool> GetInterfaceProcessActiveStatusAsync()
        {
            bool interfaceStatus = false;
            var result = await ExecuteQueryAsync<InterfaceStatusDto>(StoredProcedureNames.GetInterfaceProcessActiveStatus);
            if (result != null && result.Any())
            {
                interfaceStatus = result.All((status) => status.IsActive);
            }

            return interfaceStatus;
        }
    }

    internal static class StoredProcedureNames
    {
        internal const string GetInterfaceProcessActiveStatus = "[Process].[usp_GetInterfaceProcessActiveStatus]";
    }
}
