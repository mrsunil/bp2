using FluentValidation;
using LDC.Atlas.Services.Trading.Application.Commands;

namespace LDC.Atlas.Services.Trading.Application.Validations
{
    public class CreateCostMatrixCommandValidator : AbstractValidator<CreateCostMatrixCommand>
    {
        public CreateCostMatrixCommandValidator()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(30);
            RuleFor(command => command.Description).MaximumLength(60);
        }
    }

    public class UpdateCostMatrixCommandValidator : AbstractValidator<UpdateCostMatrixCommand>
    {
        public UpdateCostMatrixCommandValidator()
        {
            RuleFor(command => command.CostMatrixId).NotEmpty();
            RuleFor(command => command.Description).MaximumLength(60);
        }
    }
}
