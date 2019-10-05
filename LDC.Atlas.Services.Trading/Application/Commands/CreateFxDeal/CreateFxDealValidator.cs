using FluentValidation;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal
{
    public class CreateFxDealValidator : AbstractValidator<CreateFxDealCommand>
    {
        public CreateFxDealValidator()
        {
            RuleFor(command => command.CompanyId).NotEmpty();

            RuleFor(command => command.DealDirectionId).NotEmpty().Must(d => Enum.IsDefined(typeof(FxDealDirection), d));
            RuleFor(command => command.TraderId).NotEmpty();
            RuleFor(command => command.ContractDate).NotEmpty();
            RuleFor(command => command.MaturityDate).NotEmpty();
            RuleFor(command => command.DepartmentId).NotEmpty();
            RuleFor(command => command.CurrencyCode).NotEmpty().Length(3);
            RuleFor(command => command.Amount).NotEmpty().GreaterThan(0);
            RuleFor(command => command.SettlementCurrencyCode).NotEmpty().Length(3);
            RuleFor(command => command.SpotRate).NotEmpty();
            RuleFor(command => command.SpotRateType).NotEmpty().Length(1).Must(t => new List<string> { "M", "D" }.Contains(t));
            RuleFor(command => command.NominalAccountId).NotEmpty();
            RuleFor(command => command.SettlementNominalAccountId).NotEmpty();
            RuleFor(command => command.CounterpartyId).NotEmpty();
            RuleFor(command => command.BrokerId).NotEmpty();
            RuleFor(command => command.BankReference).MaximumLength(15);
            RuleFor(command => command.Memorandum).MaximumLength(40000).Must(t => !t.Contains(";")).Must(t => !t.Contains("\\"));
            RuleFor(command => command.MaturityDate).GreaterThanOrEqualTo(command => command.ContractDate).WithMessage("The maturity date cannot be previous to the contract date.");
        }
    }
}