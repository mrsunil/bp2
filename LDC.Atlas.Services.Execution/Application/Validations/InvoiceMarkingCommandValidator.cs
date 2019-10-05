using FluentValidation;
using LDC.Atlas.Services.Execution.Application.Commands;

namespace LDC.Atlas.Services.Execution.Application.Validations
{
    public class InvoiceMarkingCommandValidator : AbstractValidator<DeleteInvoiceMarkingCommand>
    {
        public InvoiceMarkingCommandValidator()
        {
            RuleFor(command => command.InvoiceMarkingId).NotEmpty();
        }
    }
}
