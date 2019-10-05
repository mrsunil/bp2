using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    public class CreateCostMatrixCommand : IRequest<CostMatrixReference>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<CostMatrixLine> CostMatrixLines { get; set; }
    }

    public class CreateCostMatrixWithParametersCommand : IRequest<CostMatrixReference>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<CostMatrixLine> CostMatrixLines { get; set; }

        public IEnumerable<TagLine> Tags { get; set; }
    }

    public class UpdateCostMatrixCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long CostMatrixId { get; set; } // internal to avoid the exposure in Swagger

        public string Description { get; set; }

        public IEnumerable<CostMatrixLine> CostMatrixLines { get; set; }
    }

    public class UpdateCostMatrixWithParametersCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long CostMatrixId { get; set; } // internal to avoid the exposure in Swagger

        public string Description { get; set; }

        public IEnumerable<CostMatrixLine> CostMatrixLines { get; set; }

        public IEnumerable<TagLine> Tags { get; set; }
    }

    public class DeleteCostMatrixCommand : IRequest
    {
        internal long CostMatrixId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class DeleteCostMatrixLineCommand : IRequest
    {
        internal long CostMatrixLineId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class CostMatrixLine
    {
        public long CostMatrixLineId { get; set; }

        public long CostMatrixId { get; set; }

        public long CostTypeId { get; set; }

        public string Description { get; set; }

        public long? SupplierId { get; set; }

        public int PayReceive { get; set; }

        public string CurrencyCode { get; set; }

        public int RateType { get; set; }

        public long? PriceUnitId { get; set; }

        public decimal RateAmount { get; set; }

        public bool InPL { get; set; }

        public bool NoAct { get; set; }

        public string Narrative { get; set; }

        public string CompanyId { get; set; }
    }

    public class CostMatrixReference
    {
        public long CostMatrixId { get; set; }
    }

    public class TagLine
    {
        public string Id { get; set; }

        public string TypeName { get; set; }
    }
}
