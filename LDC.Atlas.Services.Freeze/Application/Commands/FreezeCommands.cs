using LDC.Atlas.Services.Freeze.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Freeze.Application.Commands
{
    public class CreateFreezeCommand : IRequest<(int, IEnumerable<MonthEnd>)>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public DateTime? FreezeDate { get; set; }

        public DataVersionType DataVersionTypeId { get; set; }

        public DateTime CompanyDate { get; set; }
    }

    public class DeleteFreezeCommand : IRequest
    {
        public string Company { get; set; }

        public int DataVersionId { get; set; }
    }

    public class RecalculateFreezeCommand : IRequest
    {
        public string Company { get; set; }

        public int DataVersionId { get; set; }

        public long UserId { get; set; }

        public bool RecalculateAccEntries { get; set; }
    }

    public class CreateGlobalFreezeCommand : IRequest<CreateGlobalFreezeResult>
    {
        public DateTime? FreezeDate { get; set; }

        public DataVersionType DataVersionTypeId { get; set; }
    }

    public class PurgeFreezesCommand : IRequest
    {
        public string Company { get; set; }
    }
}
