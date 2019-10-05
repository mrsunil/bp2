using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.DepartmentCommands
{
    public class DeleteDepartmentsCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        public List<Department> MasterDataList { get; set; }
    }
}
