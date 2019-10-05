using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using LDC.Atlas.Services.Reporting.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Reporting.Application.Commands
{
    public class CreateUpdateLdrepManualAdjustmentCommand : IRequest<LdrepManualAdjustment>
    {
        public string Company { get; set; }

        public DateTime DateFrom { get; set; }

        public DateTime DateTo { get; set; }

        public ICollection<LdrepManualAdjustmentRecords> LdrepManualAdjustmentRecords { get; set; }
    }

    public class DeleteLdrepManualAdjustmentCommand : IRequest
    {
        public string Company { get; set; }

        public DateTime DateFrom { get; set; }

        public DateTime DateTo { get; set; }

        public ICollection<LdrepManualAdjustmentRecords> LdrepManualAdjustmentRecords { get; set; }
    }
}
