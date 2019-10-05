using LDC.Atlas.Application.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Core.Services
{
    public interface IProcessMessageService
    {
        Task<long> SendMessage(ProcessMessage message);

        Task StartStopProcessType(ProcessType processTypeId, bool isActive);

        Task<IEnumerable<long>> SendBulkMessage(IEnumerable<ProcessMessage> messages);
    }
}
