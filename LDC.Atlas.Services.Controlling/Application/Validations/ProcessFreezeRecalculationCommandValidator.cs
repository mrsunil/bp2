using FluentValidation;
using LDC.Atlas.Services.Controlling.Application.Commands;
using System;

namespace LDC.Atlas.Services.Controlling.Application.Validations
{
    public class ProcessFreezeRecalculationCommandValidator : AbstractValidator<ProcessFreezeRecalculationCommand>
    {
        public ProcessFreezeRecalculationCommandValidator()
        {
            RuleFor(command => command.UserId).NotNull().NotEmpty();
            RuleFor(command => command.SectionId).GreaterThan(0);
            RuleFor(command => command.DataVersionId).GreaterThan(0);
        }
    }
}
