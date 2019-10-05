using FluentValidation;
using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Validations
{
    public class CompanyConfigurationCommandValidator : AbstractValidator<UpdateCompanyConfigurationCommand>
    {
        public CompanyConfigurationCommandValidator()
        {
            RuleFor(command => command.CompanySetup).SetValidator(new CompanySetupValidator());
            RuleFor(command => command.InvoiceSetup).SetValidator(new InvoiceSetupValidator());
        }
    }

    public class CompanySetupValidator : AbstractValidator<CompanySetup>
    {
        public CompanySetupValidator()
        {
            RuleFor(command => command.CompanyFriendlyCode).NotNull().NotEmpty().MaximumLength(4);
            RuleFor(command => command.CompanyId).NotNull().NotEmpty().MaximumLength(2);
            RuleFor(command => command.CompanyName).NotNull().NotEmpty().MaximumLength(50);
            RuleFor(command => command.FunctionalCurrencyCode).NotNull().NotEmpty();
            RuleFor(command => command.StatutoryCurrencyCode).NotNull().NotEmpty();
            RuleFor(command => command.CompanyTypeId).NotNull().NotEmpty();
            RuleFor(command => command.CompanyPlatformId).NotNull().NotEmpty();
            RuleFor(command => command.TimeZone).NotNull().NotEmpty();
            RuleFor(command => command.LDCRegionId).NotNull().NotEmpty();
        }
    }

    public class InterfaceSetupValidator : AbstractValidator<InterfaceSetup>
    {
        public InterfaceSetupValidator()
        {
            RuleFor(command => command.InterfaceTypeId).NotNull().NotEmpty();
        }
    }

    public class InvoiceSetupValidator : AbstractValidator<InvoiceSetup>
    {
        public InvoiceSetupValidator()
        {
            RuleFor(command => command.InvoiceSetupId).NotNull().NotEmpty();
            RuleFor(command => command.PaymentTermId).NotNull().NotEmpty();
            RuleFor(command => command.VatLabel).NotNull().NotEmpty();
            RuleFor(command => command.VatActive).NotNull().NotEmpty();
        }
    }
}
