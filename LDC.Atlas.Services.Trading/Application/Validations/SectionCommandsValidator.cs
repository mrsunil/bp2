using FluentValidation;
using LDC.Atlas.Services.Trading.Application.Commands;

namespace LDC.Atlas.Services.Trading.Application.Validations
{
    public class GenerateContractAdviceCommandValidator : AbstractValidator<GenerateContractAdviceCommand>
    {
        public GenerateContractAdviceCommandValidator()
        {
            RuleFor(command => command.Company).NotEmpty();
            RuleFor(command => command.DocumentTemplatePath).NotEmpty();
            RuleFor(command => command.SectionId).NotEmpty();
        }
    }

    public class UpdateContractAdviceCommandValidator : AbstractValidator<UpdateContractAdviceCommand>
    {
        public UpdateContractAdviceCommandValidator()
        {
            RuleFor(command => command.Company).NotEmpty();
            RuleFor(command => command.DocumentTemplatePath).NotEmpty();
            RuleFor(command => command.SectionId).NotEmpty();
            RuleFor(command => command.PhysicalDocumentId).NotEmpty();
            RuleFor(command => command.DraftDocumentId).NotEmpty();
        }
    }

    public class AssignContractAdviceCommandValidator : AbstractValidator<AssignContractAdviceCommand>
    {
        public AssignContractAdviceCommandValidator()
        {
            RuleFor(command => command.Company).NotEmpty();
            RuleFor(command => command.DocumentTemplatePath).NotEmpty();
            RuleFor(command => command.SectionId).NotEmpty();
            RuleFor(command => command.DocumentId).NotEmpty();
        }
    }
}
