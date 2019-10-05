using Dapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Services
{
    internal class ProcessMessageService : BaseRepository, IProcessMessageService
    {
        public ProcessMessageService(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        public async Task<long> SendMessage(ProcessMessage message)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProcessTypeId", message.ProcessTypeId);
            queryParameters.Add("@CompanyId", message.CompanyId);
            queryParameters.Add("@Content", message.Content);

            queryParameters.Add("@MessageId", dbType: DbType.Int64, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync("[Process].[usp_CreateMessage]", queryParameters, true);

            long messageId = queryParameters.Get<long>("@MessageId");

            return messageId;
        }

        public async Task<IEnumerable<long>> SendBulkMessage(IEnumerable<ProcessMessage> messages)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Messages", ToArrayTVP(messages));
            var messageIds = await ExecuteQueryAsync<long>("[Process].[usp_CreateBulkMessage]", queryParameters, true);
            return messageIds;
        }

        private static DataTable ToArrayTVP(IEnumerable<ProcessMessage> messages)
        {
            var table = new DataTable();
            table.SetTypeName("[Process].[UDTT_Message]");
            var processTypeId = new DataColumn("[ProcessTypeId]", typeof(long));
            table.Columns.Add(processTypeId);
            var companyId = new DataColumn("[CompanyId]", typeof(string));
            table.Columns.Add(companyId);
            var content = new DataColumn("[Content]", typeof(string));
            table.Columns.Add(content);

            foreach (ProcessMessage message in messages)
            {
                if (message != null)
                {
                    var row = table.NewRow();
                    row[processTypeId] = message.ProcessTypeId;
                    row[companyId] = message.CompanyId;
                    row[content] = message.Content;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task StartStopProcessType(ProcessType processTypeId, bool isActive)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProcessTypeId", (long)processTypeId);
            queryParameters.Add("@Name", null);
            queryParameters.Add("@Description", null);
            queryParameters.Add("@IsActive", isActive);
            queryParameters.Add("@VERB", null);
            queryParameters.Add("@EndPoint", null);

            await ExecuteNonQueryAsync("[Process].[usp_SetProcessType]", queryParameters);
        }
    }
}
