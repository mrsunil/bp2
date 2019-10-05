using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Processor.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Processor.Repositories
{
    public class MessageRepository : BaseRepository, IMessageRepository
    {
        public MessageRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<ProcessType> GetProcessType(string processTypeName)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProcessTypeName", processTypeName);

            var processType = await ExecuteQueryFirstOrDefaultAsync<ProcessType>(StoredProcedureNames.GetProcessTypeInfo, queryParameters);

            return processType;
        }

        public async Task<Message> CheckAndReceiveMessageToProcess(int processTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProcessTypeId", processTypeId);

            var message = await ExecuteQueryFirstOrDefaultAsync<Message>(StoredProcedureNames.CheckAndReceiveMessageToProcess, queryParameters);

            return message;
        }

        public async Task UpdateMessageStatus(int messageId, MessageStatus messageStatus, string errorMessage)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@MessageId", messageId);
            queryParameters.Add("@Status", messageStatus);
            queryParameters.Add("@Error", errorMessage);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateMessageStatus, queryParameters, true);
        }

        public async Task DeleteMessageFromQueue(int messageId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@MessageId", messageId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteMessageRequest, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string GetProcessTypeInfo = "[Process].[usp_GetProcessType]";
            internal const string CheckAndReceiveMessageToProcess = "[Process].[usp_CheckReceiveMessageToProcess]";
            internal const string UpdateMessageStatus = "[Process].[usp_UpdateMessageStatus]";
            internal const string DeleteMessageRequest = "[Process].[usp_DeleteMessage]";
        }
    }
}
