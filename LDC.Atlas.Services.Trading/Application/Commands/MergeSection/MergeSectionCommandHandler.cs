using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands.MergeSection
{
    public class MergeSectionCommandHandler : IRequestHandler<MergeSectionCommand, bool>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISectionMergeRepository _sectionMergeRepository;
        private readonly ISectionMergeQueries _sectionMergeQueries;

        public MergeSectionCommandHandler(
            IUnitOfWork unitOfWork,
            ILogger<MergeSectionCommandHandler> logger,
            ISectionMergeRepository sectionMergeRepository,
            ISectionMergeQueries sectionMergeQueries)
        {
            _sectionMergeRepository = sectionMergeRepository ?? throw new ArgumentNullException(nameof(sectionMergeRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _sectionMergeQueries = sectionMergeQueries ?? throw new ArgumentNullException(nameof(sectionMergeQueries));
        }

        public async Task<bool> Handle(MergeSectionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            bool isCostNeeded = true;
            bool isSectionMerged = false;
            decimal quantity = 0;
            decimal contractedValue = 0;
            try
            {
                List<CostDto> updatedCostsForMerge = new List<CostDto>();
                IEnumerable<MergeContracts> mergeContracts = request.MergeContracts;
                if (mergeContracts.Any())
                {
                    foreach (MergeContracts contract in mergeContracts)
                    {
                        // Adding all the section Ids (including Merge from section ids and merge to section id)
                        List<long> selectedSectionIds = contract.MergeFromSectionIds.ToList();
                        selectedSectionIds.Add(contract.MergeToSectionId);

                        // get the contextual data for the section ids selected to check the business rules
                        var contextualData = await _sectionMergeQueries.GetContextualDataForSelectedContractsAsync(request.Company, selectedSectionIds.ToArray(), request.DataVersionId, isCostNeeded);

                        // proceed for merge if there are no blocking section ids
                        bool isMergeAllowed = !contextualData.TradeMergeMessages.Any((message) => message.IsBlocking);
                        if (contextualData != null && isMergeAllowed)
                        {
                            SectionDto mergeToSection = contextualData.SectionContextualData.First((section) => section.SectionId == contract.MergeToSectionId);
                            if (mergeToSection != null)
                            {
                                contract.Quantity = mergeToSection.Quantity;
                                contract.ContractedValue = mergeToSection.ContractedValue;
                            }

                            // impact of costs
                            // get the costs associated with the selected section Ids
                            IEnumerable<CostDto> costsInMergeFromSections = contextualData.CostContextualData.Where((cost) => cost.SectionId != contract.MergeToSectionId);

                            IEnumerable<CostDto> costsInMergeToSection = contextualData.CostContextualData.Where((cost) => cost.SectionId == contract.MergeToSectionId);

                            // When there is no cost in Merge To Section and costs are present in Merge From Section
                            // then soft delete the costs in Merge From Section
                            if (!costsInMergeToSection.Any() && costsInMergeFromSections.Any())
                            {
                                costsInMergeFromSections.ToList().ForEach((cost) => cost.IsDeleted = true);
                                updatedCostsForMerge = costsInMergeFromSections.ToList();
                            }

                            List<CostDto> invoicedCosts = contextualData.CostContextualData.Where((cost) => cost.SectionId != contract.MergeToSectionId && cost.InvoicingStatusId != InvoicingStatus.Uninvoiced && cost.RateTypeId == (int)RateType.Amount).ToList();

                            if (invoicedCosts != null && invoicedCosts.Any())
                            {
                                // Soft delete the invoiced costs for Merge From Sections
                                invoicedCosts.ForEach((cost) =>
                                {
                                    // Soft delete the cost in merge from section
                                    cost.IsDeleted = true;

                                    // New cost will be added in merge to section
                                    cost.IsNewCost = true;
                                    cost.SectionId = contract.MergeToSectionId;
                                    if (updatedCostsForMerge.Contains(cost))
                                    {
                                        updatedCostsForMerge[updatedCostsForMerge.IndexOf(cost)] = cost;
                                    }
                                    else
                                    {
                                        updatedCostsForMerge.Add(cost);
                                    }
                                });
                            }

                            // BR 121 - Rate type amount with same values and rate type as Amount
                            else if (costsInMergeToSection.Any() && costsInMergeFromSections.Any())
                            {
                                foreach (CostDto toCosts in costsInMergeToSection)
                                {
                                    foreach (CostDto fromCosts in costsInMergeFromSections)
                                    {
                                        if (toCosts.RateTypeId == (int)RateType.Amount)
                                        {
                                            var differentCurrency = toCosts.CurrencyCode != fromCosts.CurrencyCode;
                                            var differentCostType = toCosts.CostTypeId != fromCosts.CostTypeId;
                                            var differentSupplier = toCosts.SupplierId != fromCosts.SupplierId;
                                            var differentRateType = toCosts.RateTypeId != fromCosts.RateTypeId;
                                            var differentCostDirection = toCosts.CostDirectionId != fromCosts.CostDirectionId;


                                            if (differentCurrency || differentCostType || differentSupplier || differentRateType || differentCostDirection)
                                            {
                                                fromCosts.IsDeleted = true;
                                                updatedCostsForMerge.Add(fromCosts);
                                            }
                                            else
                                            {
                                                var totalCostAmount = fromCosts.Rate;
                                                var updatedFromCostAmount = totalCostAmount + toCosts.Rate;
                                                toCosts.Rate = updatedFromCostAmount;
                                                updatedCostsForMerge.Add(toCosts);
                                            }
                                        }
                                        else
                                        {
                                            fromCosts.IsDeleted = true;
                                            updatedCostsForMerge.Add(fromCosts);
                                        }
                                    }
                                }
                            }

                            // Calculate quantity / contract value
                            IEnumerable<SectionDto> mergeFromSectionDetails = contextualData.SectionContextualData.Where((section) => section.SectionId != contract.MergeToSectionId);
                            foreach (SectionDto section in mergeFromSectionDetails)
                            {
                                contract.Quantity += section.Quantity;
                                contract.ContractedValue += section.ContractedValue;
                            }
                        }
                    }

                    // call repository
                    var sectionsMerged = await _sectionMergeRepository.MergeSectionAsync(mergeContracts, updatedCostsForMerge, request.Company, request.DataVersionId);
                    if (sectionsMerged.Any())
                    {
                        isSectionMerged = true;
                        foreach (long sectionId in sectionsMerged)
                        {
                            if (sectionId != null)
                            {
                                _logger.LogInformation("Section with id {Atlas_SectionID} is merged.", sectionId);
                            }
                        }
                    }
                }

                _unitOfWork.Commit();

                return isSectionMerged;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
