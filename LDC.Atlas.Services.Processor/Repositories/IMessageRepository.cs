using LDC.Atlas.Services.Processor.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Processor.Repositories
{
    public interface IMessageRepository
    {
        Task<ProcessType> GetProcessType(string processTypeName);

        Task<Message> CheckAndReceiveMessageToProcess(int processTypeId);

        Task UpdateMessageStatus(int messageId, MessageStatus messageStatus, string errorMessage);

        Task DeleteMessageFromQueue(int messageId);
    }
}
