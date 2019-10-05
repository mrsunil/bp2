using MediatR;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class MonthEndTemporaryAdjustmentCommand : IRequest<string>
    {
        public string CurrencyCode { get; set; }

        public long? SectionId { get; set; }

        public long? CostId { get; set; }

        public decimal AccruedAmount { get; set; }

        public decimal Quantity { get; set; }

        public long AccrualNumber { get; set; }

        public int? AccountLineTypeId { get; set; }
    }
}
