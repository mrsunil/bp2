using FluentValidation;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Entities;
using System.Linq;

namespace LDC.Atlas.Services.Execution.Application.Validations
{
    public class ManualJournalCommandValidator : AbstractValidator<CreateManualJournalDocumentCommand>
    {
        public ManualJournalCommandValidator()
        {

            RuleFor(command => command.ManualJournal).NotNull();
            RuleFor(command => command.ManualJournal.DocumentDate).NotNull();
            RuleFor(command => command.ManualJournal.AccountingPeriod).NotNull().When(command => command.ManualJournal.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "AccountingPeriod").IsMandatory);
            RuleFor(command => command.ManualJournal.CurrencyCode).NotNull().NotEmpty();
            RuleFor(command => command.ManualJournal.ValueDate).NotNull().NotEmpty().When(command => command.ManualJournal.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ValueDate").IsMandatory);
            RuleFor(command => command.ManualJournal.ManualJournalLines).NotNull();
            RuleFor(command => command.ManualJournal.ManualJournalLines.Select(x => x.Amount).Sum()).Equals(0);
            RuleFor(command => command.ManualJournal.ManualJournalLines).SetCollectionValidator(new ManualJournalValidatorCollection());
        }
    }

    public class ManualJournalValidatorCollection : AbstractValidator<ManualJournalLine>
    {
        public ManualJournalValidatorCollection()
        {
            RuleFor(command => command.AccountReferenceId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "AccountReferenceId").IsMandatory);
            RuleFor(command => command.AccountLineTypeId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "AccountLineTypeId").IsMandatory);
            RuleFor(command => command.CostTypeId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CostTypeId").IsMandatory);
            RuleFor(command => command.Amount).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Amount").IsMandatory);
            RuleFor(command => command.DepartmentId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "DepartmentId").IsMandatory);
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0).When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Quantity").IsMandatory);
            RuleFor(command => command.AssociatedAccountId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "AssociatedAccountId").IsMandatory);
            RuleFor(command => command.CharterId).NotNull().GreaterThanOrEqualTo(0).When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CharterId").IsMandatory);
            RuleFor(command => command.CommodityId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CommodityId").IsMandatory);
            RuleFor(command => command.SectionId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "SectionId").IsMandatory);
            // Discussed with Mathilde. Narratve is based on configuration for all type (MJ, TA and MTM)
            RuleFor(command => command.Narrative).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Narrative").IsMandatory);
            RuleFor(command => command.AccrualNumber).NotNull().NotEmpty().When(command => command.TransactionDocumentTypeId == (int)MasterDocumentType.TA);
            RuleFor(command => command.CostCenter).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CostCenter").IsMandatory);
            RuleFor(command => command.SecondaryDocumentReference).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "SecondaryDocumentReference").IsMandatory);
            RuleFor(command => command.ClientAccountId).NotNull().NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ClientAccountId").IsMandatory);
        }
    }
}
