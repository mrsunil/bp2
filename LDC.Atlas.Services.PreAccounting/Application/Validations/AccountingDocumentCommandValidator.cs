using FluentValidation;
using LDC.Atlas.Services.PreAccounting.Application.Commands;
using LDC.Atlas.Services.PreAccounting.Entities;
using System.Linq;

namespace LDC.Atlas.Services.PreAccounting.Application.Validations
{
    public class AccountingDocumentCommandValidator : AbstractValidator<CreateAccountingDocumentCommand>
    {
        public AccountingDocumentCommandValidator()
        {
            RuleFor(command => command.DocId).NotEmpty();
        }
    }

    public class AccountingDocumentPostedStatusCommandValidatorCollection : AbstractValidator<UpdateAccountingDocumentStatusToPostedCommand>
    {
        public AccountingDocumentPostedStatusCommandValidatorCollection()
        {
            RuleFor(command => command.DocId).NotEmpty().NotEqual(0);
        }
    }

    public class AccountingDocumentDeletedStatusCommandValidatorCollection : AbstractValidator<UpdateAccountingDocumentStatusToDeletedCommand>
    {
        public AccountingDocumentDeletedStatusCommandValidatorCollection()
        {
            RuleForEach(command => command.AccountingDocuments).SetValidator(new DeletedStatusValidatorCollection());
        }
    }

    public class DeletedStatusValidatorCollection : AbstractValidator<AccountingDocumentToDeleted>
    {
        public DeletedStatusValidatorCollection()
        {
            RuleFor(command => command.AccountingId).NotEmpty();
        }
    }

    public class AccountingDocumentAuthorizeForPostingCommandValidatorCollection : AbstractValidator<AuthorizeForPostingCommand>
    {
        public AccountingDocumentAuthorizeForPostingCommandValidatorCollection()
        {
            RuleFor(command => command.AccountingDocuments).NotEmpty();
            RuleForEach(command => command.AccountingDocuments).SetValidator(new AuthorizeForPostingValidatorCollection());
        }
    }

    public class AuthorizeForPostingValidatorCollection : AbstractValidator<AccountingDocumentToAuthorizeForPosting>
    {
        public AuthorizeForPostingValidatorCollection()
        {
            RuleFor(command => command.AccountingId).NotEmpty();
        }
    }

    public class StartStopPostingProcessCommandValidatorCollection : AbstractValidator<StartStopPostingProcessCommand>
    {
        public StartStopPostingProcessCommandValidatorCollection()
        {
            RuleFor(command => command.IsActive).NotNull();
        }
    }

    public class UpdateAccountingDocumentCommandValidator : AbstractValidator<UpdateAccountingDocumentCommand>
    {
        public UpdateAccountingDocumentCommandValidator()
        {
            RuleFor(command => command.DocumentDate).NotNull();
            RuleFor(command => command.AccountingPeriod).NotNull();
            RuleFor(command => command.CurrencyCode).NotNull();
            RuleFor(command => command.CurrencyCode).NotEmpty();
            RuleFor(command => command.AccountingPeriod).NotEmpty();
            RuleFor(command => command.DocumentDate).NotEmpty();
            RuleFor(command => command.ValueDate).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ValueDate").IsMandatory);
            RuleFor(command => command.ValueDate).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ValueDate").IsMandatory);
            RuleFor(command => command.AccountingDocumentLines).NotNull();
            RuleForEach(command => command.AccountingDocumentLines).SetValidator(new UpdateAccountingDocumentValidatorCollection());
            RuleFor(command => command.AccountingDocumentLines.Select(x => x.Amount).Sum()).Equals(0);
        }
    }

    public class UpdateAccountingDocumentValidatorCollection : AbstractValidator<AccountingDocumentLine>
    {
        public UpdateAccountingDocumentValidatorCollection()
        {
            RuleFor(command => command.AccountReferenceId).NotNull().NotEmpty();
            RuleFor(command => command.AccountLineTypeId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "AccountLineTypeId").IsMandatory); ;
            RuleFor(command => command.CostTypeId).NotNull().NotEmpty();
            RuleFor(command => command.Amount).NotNull();
            RuleFor(command => command.DepartmentId).NotNull().NotEmpty();
            RuleFor(command => command.AssociatedAccountId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "AssociatedAccountId").IsMandatory); 
            RuleFor(command => command.Narrative).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Narrative").IsMandatory);
            RuleFor(command => command.CostCenter).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CostCenter").IsMandatory);
            RuleFor(command => command.CharterId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CharterId").IsMandatory);
        }
    }
}