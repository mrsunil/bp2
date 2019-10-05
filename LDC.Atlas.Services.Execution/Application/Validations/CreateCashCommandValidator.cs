using FluentValidation;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Entities;

namespace LDC.Atlas.Services.Execution.Application.Validations
{
    public class CreateCashCommandValidator : AbstractValidator<CreateCashCommand>
    {
        public CreateCashCommandValidator()
        {
            RuleFor(command => command.CashTypeId).NotEmpty();
            RuleFor(command => command.CompanyId).NotEmpty();

            RuleFor(command => command.CounterPartyCode).MaximumLength(10);
            RuleFor(command => command.ValueDate).NotEmpty();
            RuleFor(command => command.DocumentDate).NotEmpty();
            RuleFor(command => command.CurrencyCode).NotEmpty().MaximumLength(3);
            RuleFor(command => command.Amount).NotEmpty().GreaterThan(0);
            RuleFor(command => command.NominalAccountCode).NotEmpty();
            RuleFor(command => command.NominalAccountCode).MaximumLength(10);
            RuleFor(command => command.DepartmentId).NotEmpty();
            RuleFor(command => command.Narrative).NotEmpty().When(command => command.CostDirectionId == (int)DirectionType.Payment).MaximumLength(130);
            RuleFor(command => command.Narrative).MaximumLength(130).When(command => !string.IsNullOrEmpty(command.Narrative));
            RuleForEach(command => command.AdditionalCostDetails).SetValidator(new AdditionalCostValidator());
            RuleFor(command => command.BankAccountCode).MaximumLength(10);
            RuleForEach(command => command.DocumentMatchings).SetValidator(new DocumentMatchingValidator());

            // rules for cash by picking tx with diff currency
            RuleFor(command => command.MatchingCurrency).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                                  || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingCurrency).MaximumLength(3).When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                                  || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingCurrency).NotEqual(command => command.CurrencyCode).When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                        || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingRate).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                        || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingRateType).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                       || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            // rules for cash by picking tx with diff client
            RuleFor(command => command.PaymentCounterpartyCode).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentClient);
            RuleFor(command => command.PaymentCounterpartyCode).NotEqual(command => command.CounterPartyCode).When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentClient);


            // Defect - 19481 Added API side Validation 
            // When a cash receipt is created, there is no "Urgent" button in the UI the user can check and it is not possible to enable the functionality "Transmit to treasury System
            RuleFor(command => command.UrgentPayment).Equal(false).When(command => command.ChildCashTypeId == (int)CashSelectionType.SimpleCashReceipt || 
                        command.ChildCashTypeId == (int)CashSelectionType.ReceiptFullPartialTransaction || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);
            RuleFor(command => command.ToTransmitToTreasury).Equal(false).When(command => command.ChildCashTypeId == (int)CashSelectionType.SimpleCashReceipt ||
                        command.ChildCashTypeId == (int)CashSelectionType.ReceiptFullPartialTransaction || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);
        }
    }

    public class UpdateCashCommandValidator : AbstractValidator<UpdateCashCommand>
    {
        public UpdateCashCommandValidator()
        {
            RuleFor(command => command.CashTypeId).NotEmpty();
            RuleFor(command => command.CompanyId).NotEmpty();
            RuleFor(command => command.CounterPartyCode).MaximumLength(10);
            RuleFor(command => command.ValueDate).NotEmpty();
            RuleFor(command => command.DocumentDate).NotEmpty();
            RuleFor(command => command.CurrencyCode).NotEmpty().MaximumLength(3);
            // The amount is not always >0: it can be <0 for JL (and for some cashline in specific situations)
            // RuleFor(command => command.Amount).NotEmpty().GreaterThan(0);
            RuleFor(command => command.NominalAccountCode).NotEmpty();
            RuleFor(command => command.NominalAccountCode).MaximumLength(10);
            RuleFor(command => command.DepartmentId).NotEmpty();
            RuleFor(command => command.Narrative).NotEmpty().When(command => command.CostDirectionId == (int)DirectionType.Payment).MaximumLength(130);
            RuleFor(command => command.Narrative).MaximumLength(130).When(command => !string.IsNullOrEmpty(command.Narrative));
            RuleForEach(command => command.AdditionalCostDetails).SetValidator(new AdditionalCostValidator());
            RuleFor(command => command.BankAccountCode).MaximumLength(10);
            RuleFor(command => command.CounterPartyCode).NotEmpty();

            // rules for cash by picking tx with diff currency
            RuleFor(command => command.MatchingCurrency).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                                  || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingCurrency).MaximumLength(3).When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                                  || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingCurrency).NotEqual(command => command.CurrencyCode).When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                        || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingRate).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                        || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            RuleFor(command => command.MatchingRateType).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency
                                                                       || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);

            // rules for cash by picking tx with diff client
            RuleFor(command => command.PaymentCounterpartyCode).NotEmpty().When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentClient);
            RuleFor(command => command.PaymentCounterpartyCode).NotEqual(command => command.CounterPartyCode).When(command => command.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentClient);

            // Defect - 19481 Added API side Validation 
            // When a cash receipt is created, there is no "Urgent" button in the UI the user can check and it is not possible to enable the functionality "Transmit to treasury System
            RuleFor(command => command.UrgentPayment).Equal(false).When(command => command.ChildCashTypeId == (int)CashSelectionType.SimpleCashReceipt ||
                        command.ChildCashTypeId == (int)CashSelectionType.ReceiptFullPartialTransaction || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);
            RuleFor(command => command.ToTransmitToTreasury).Equal(false).When(command => command.ChildCashTypeId == (int)CashSelectionType.SimpleCashReceipt ||
                        command.ChildCashTypeId == (int)CashSelectionType.ReceiptFullPartialTransaction || command.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency);
        }
    }

    public class AdditionalCostValidator : AbstractValidator<CashAdditionalCost>
    {
        public AdditionalCostValidator()
        {
            RuleFor(command => command.Amount).NotEmpty().GreaterThan(0);
            RuleFor(command => command.Narrative).MaximumLength(100);
            RuleFor(command => command.AccountId).NotEmpty();
            // This validation will be there conditionally. Will be uncommented once the solution is found.
            // RuleFor(command => command.AccountLineType).NotEmpty();
            RuleFor(command => command.CurrencyCode).NotEmpty();
            RuleFor(command => command.CostDirectionId).NotEmpty();
            RuleFor(command => command.CostTypeCode).NotEmpty();

            // The ClientAccount should be mandatory only when NominalAccount has ClientAccountMandatory field = true
            RuleFor(command => command.ClientAccount).NotEmpty().GreaterThan(0)
                .When(command => command.ClientAccountMandatory);
        }
    }

    public class DocumentMatchingValidator : AbstractValidator<DocumentMatching>
    {
        public DocumentMatchingValidator()
        {
            // MDU: the amount to be paid can be negative in case of JL (and for some cash line in specific cases)
            // RuleFor(command => command.Amount).NotEmpty().GreaterThan(0);
            // RuleFor(command => command.AmountToBePaid).NotEmpty().GreaterThan(0);
            // RuleFor(command => command.AmountToBePaid).NotEmpty().LessThanOrEqualTo(command => command.Amount);
            // MDU : the following rule is not true (so far) for JL...
            // RuleFor(command => command.AccountLineTypeId).NotEmpty();
        }
    }

    public class UpdateCashDocumentCommandValidator : AbstractValidator<UpdateCashDocumentCommand>
    {
        public UpdateCashDocumentCommandValidator()
        {
            RuleFor(command => command.PhysicalDocumentId).NotEmpty().GreaterThanOrEqualTo(0);
            RuleFor(command => command.DraftDocumentId).NotEmpty().GreaterThanOrEqualTo(0);
            RuleFor(command => command.CashId).NotEmpty().GreaterThanOrEqualTo(0);
        }
    }
}