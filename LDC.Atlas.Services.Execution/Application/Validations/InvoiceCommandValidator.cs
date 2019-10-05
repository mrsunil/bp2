using FluentValidation;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Entities;

namespace LDC.Atlas.Services.Execution.Application.Validations
{
    public class InvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
    {
        public InvoiceCommandValidator()
        {
            RuleFor(command => command.Template).NotEmpty().When(c => c.ExternalInhouse == Entities.InvoiceSourceType.Inhouse && c.InvoiceType != InvoiceType.Reversal);

            RuleFor(command => command.ExternalInvoiceRef).MaximumLength(25);

            RuleFor(command => command.Currency).NotEmpty().When(command => command.InvoiceType != InvoiceType.Reversal);

            RuleFor(command => command.InvoiceType).IsInEnum();
            RuleFor(command => command.QuantityToInvoiceType).IsInEnum();
            RuleFor(command => command.ExternalInhouse).IsInEnum();
            RuleFor(command => command.DocumentType).IsInEnum().When(c => c.InvoiceType == InvoiceType.CostCreditNote || c.InvoiceType == InvoiceType.CostDebitNote || c.InvoiceType == InvoiceType.Cost || c.InvoiceType == InvoiceType.CostReceivable );
            RuleFor(command => command.CostDirection).IsInEnum().When(c => c.InvoiceType == InvoiceType.CostCreditNote || c.InvoiceType == InvoiceType.CostDebitNote || c.InvoiceType == InvoiceType.Cost || c.InvoiceType == InvoiceType.CostReceivable);

            // No document specified when creating a draft
            RuleFor(command => command.PhysicalDocumentId).Null().When(c => c.IsDraft);

            RuleFor(command => command.InvoiceLines).SetCollectionValidator(new InvoiceLinesValidatorCollection());
        }
    }

    public class InvoiceLinesValidatorCollection : AbstractValidator<InvoiceLineRecord>
    {
        public InvoiceLinesValidatorCollection()
        {
            RuleFor(invoiceLine => invoiceLine.Quantity).GreaterThan(0).When(invoiceLine => string.IsNullOrEmpty(invoiceLine.CostTypeCode));         
        }
    }


    public class UpdateInvoiceDocumentCommandValidator : AbstractValidator<UpdateInvoiceDocumentCommand>
    {
        public UpdateInvoiceDocumentCommandValidator()
        {
            RuleFor(command => command.PhysicalDocumentId).NotEmpty().GreaterThanOrEqualTo(0);
            RuleFor(command => command.DraftDocumentId).NotEmpty().GreaterThanOrEqualTo(0);
            RuleFor(command => command.InvoiceId).NotEmpty().GreaterThanOrEqualTo(0);
        }
    }
}
