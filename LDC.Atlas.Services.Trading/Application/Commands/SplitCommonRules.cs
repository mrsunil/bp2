using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    internal static class SplitCommonRules
    {
        internal static async Task ValidateSplitContract(CreateSplitCommand command, IPhysicalContractQueries physicalContractQueries, IUserService userService)
        {
            // splited quantities should be less than or equal to parent contract quantity
            decimal totalSplitedQuantity = 0;
            foreach (var child in command.ChildSections)
            {
                totalSplitedQuantity = totalSplitedQuantity + child.Quantity;
            }

            if (command.Quantity < totalSplitedQuantity)
            {
                throw new AtlasBusinessException($"The total splited quantity {totalSplitedQuantity} should be less than or equal to parent contrat quantity {command.Quantity}.");
            }

            // trader
            foreach (var child in command.ChildSections)
            {
                if (child.ContractId > 0)
                {
                    var physicalContract = await physicalContractQueries.GetPhysicalContractByIdAsync(command.CompanyId, child.ContractId, null);
                    var trader = await userService.GetUserByIdAsync(physicalContract.TraderId.Value);

                    if (trader == null)
                    {
                        throw new NotFoundException("User", physicalContract.TraderId);
                    }
                }
            }
        }

        internal static async Task ValidateSplitDetailsContract(SplitDetailsCommand command, ISectionRepository sectionRepository, IUserService userService)
        {
            // splited quantities should be less than or equal to parent contract quantity
            foreach (var sectionId in command.SectionIds)
            {
                var section = await sectionRepository.GetSectionById(sectionId, command.CompanyId, null);
                if (command.Quantity > section.Quantity)
                {
                    throw new AtlasBusinessException($"The splited quantity {command.Quantity} should be less than or equal to parent contrat quantity {section.Quantity}.");
                }
            }

            // splited contract Value
            for (int i = 0; i < command.ContractedValues.Length; i++)
            {
                if (Convert.ToInt32(command.ContractedValues[i]) < 0)
                {
                    throw new AtlasBusinessException($"The splited contract value should not be less than zero.");
                }
            }

            // trader
            foreach (var sectionId in command.SectionIds)
            {
                var section = await sectionRepository.GetSectionById(sectionId, command.CompanyId, null);
                var trader = await userService.GetUserByIdAsync(section.TraderId.Value);
                if (trader == null)
                {
                    throw new NotFoundException("User", section.TraderId);
                }
            }
        }
    }
}
