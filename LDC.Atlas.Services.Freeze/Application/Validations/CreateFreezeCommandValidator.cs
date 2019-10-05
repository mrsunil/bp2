using FluentValidation;
using LDC.Atlas.Services.Freeze.Application.Commands;
using LDC.Atlas.Services.Freeze.Entities;
using System;

namespace LDC.Atlas.Services.Freeze.Application.Validations
{
    public class CreateFreezeCommandValidator : AbstractValidator<CreateFreezeCommand>
    {
        public CreateFreezeCommandValidator()
        {
            RuleFor(command => command.FreezeDate).NotNull();
            RuleFor(command => command.DataVersionTypeId).IsInEnum();
            RuleFor(command => command.FreezeDate).LessThan(command => command.CompanyDate).When(command => command.DataVersionTypeId == DataVersionType.Daily);
            RuleFor(command => command.FreezeDate).LessThan(command => command.CompanyDate.AddDays(-(command.CompanyDate.Day - 1))).When(command => command.DataVersionTypeId == DataVersionType.Monthly);
        }
    }
}
